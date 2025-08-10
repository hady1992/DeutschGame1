import React, { useEffect, useMemo, useState } from 'react'

const CATEGORIES = [
  { id:'colors', title:'الألوان', icon:'🎨', words:[
    { de:'rot', ar:'أحمر', emoji:'🟥' },
    { de:'blau', ar:'أزرق', emoji:'🟦' },
    { de:'gelb', ar:'أصفر', emoji:'🟨' },
    { de:'grün', ar:'أخضر', emoji:'🟩' },
    { de:'schwarz', ar:'أسود', emoji:'⬛' },
    { de:'weiß', ar:'أبيض', emoji:'⬜' },
  ]},
  { id:'animals', title:'الحيوانات', icon:'🐾', words:[
    { de:'die Katze', ar:'قطة', emoji:'🐱' },
    { de:'der Hund', ar:'كلب', emoji:'🐶' },
    { de:'der Vogel', ar:'طائر', emoji:'🐦' },
    { de:'der Fisch', ar:'سمكة', emoji:'🐟' },
    { de:'die Maus', ar:'فأر', emoji:'🐭' },
    { de:'der Hase', ar:'أرنب', emoji:'🐰' },
  ]},
  { id:'home', title:'أشياء في البيت', icon:'🏠', words:[
    { de:'der Tisch', ar:'طاولة', emoji:'🛋️' },
    { de:'der Stuhl', ar:'كرسي', emoji:'🪑' },
    { de:'die Tür', ar:'باب', emoji:'🚪' },
    { de:'das Fenster', ar:'نافذة', emoji:'🪟' },
    { de:'das Buch', ar:'كتاب', emoji:'📖' },
    { de:'die Lampe', ar:'مصباح', emoji:'💡' },
  ]},
  { id:'verbs', title:'أفعال بسيطة', icon:'⚡', words:[
    { de:'essen', ar:'يأكل', emoji:'🍽️' },
    { de:'trinken', ar:'يشرب', emoji:'🥤' },
    { de:'laufen', ar:'يجري/يمشي', emoji:'🏃' },
    { de:'schlafen', ar:'ينام', emoji:'😴' },
    { de:'spielen', ar:'يلعب', emoji:'🎲' },
    { de:'lesen', ar:'يقرأ', emoji:'📚' },
  ]},
];

const STORAGE_KEY = 'woerterreise_progress_v1';
const MODES = { LEARN:'LEARN', MATCH:'MATCH', LISTEN:'LISTEN' };

function useLocalProgress(){
  const [state,setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { unlocked:0, stars:0, completed:{} };
    } catch {
      return { unlocked:0, stars:0, completed:{} };
    }
  });
  useEffect(()=>{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);
  return [state,setState];
}

function speakGerman(text){
  try{
    if(!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    u.rate = 0.9;
    u.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }catch{ /* ignore */ }
}

function Card({children, className=''}){
  return <div className={`rounded-2xl shadow-lg bg-white border border-gray-100 p-4 ${className}`}>{children}</div>
}
function Btn({children,onClick,disabled,className=''}){
  return (
    <button onClick={onClick} disabled={disabled}
      className={`px-4 py-2 rounded-xl shadow-sm border text-sm font-bold hover:shadow transition active:scale-[0.98] ${disabled?'opacity-50 cursor-not-allowed':'bg-gray-50 hover:bg-gray-100'} ${className}`}>
      {children}
    </button>
  )
}

function LearnMode({words,onComplete}){
  const [i,setI] = useState(0);
  const w = words[i];
  useEffect(()=>{ speakGerman(w.de); },[i]);
  const next = () => { if(i < words.length-1) setI(i+1); else onComplete?.() }
  return (
    <Card className="text-center">
      <div className="text-6xl mb-3">{w.emoji}</div>
      <div className="text-2xl font-extrabold">{w.de}</div>
      <div className="text-gray-500 mt-1">{w.ar}</div>
      <div className="flex gap-2 justify-center mt-4">
        <Btn onClick={()=>speakGerman(w.de)}>🔊 اسمع الكلمة</Btn>
        <Btn onClick={next}>التالي</Btn>
      </div>
      <div className="mt-3 text-xs text-gray-400">{i+1} / {words.length}</div>
    </Card>
  )
}

function shuffle(arr){ return [...arr].sort(()=>Math.random()-0.5) }

function MatchMode({words,onComplete}){
  const pairs = useMemo(()=>words.map(w=>({id:w.de,left:w.de,right:w.emoji})),[words]);
  const [left,setLeft] = useState(()=>shuffle(pairs.map(p=>p.left)));
  const [right,setRight] = useState(()=>shuffle(pairs.map(p=>p.right)));
  const [selLeft,setSelLeft] = useState(null);
  const [matched,setMatched] = useState({});
  useEffect(()=>{
    if(Object.keys(matched).length === pairs.length){ setTimeout(()=>onComplete?.(),400) }
  },[matched])
  return (
    <Card>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="font-bold mb-2">الكلمة بالألمانية</div>
          <div className="grid gap-2">
            {left.map(l=> (
              <button key={l} onClick={()=>setSelLeft(l)}
                className={`p-3 rounded-xl border text-left ${selLeft===l?'bg-blue-50 border-blue-300':'bg-white'} ${matched[l]?'opacity-50':''}`}
                disabled={!!matched[l]}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="font-bold mb-2">اختر الصورة المطابقة</div>
          <div className="grid gap-2">
            {right.map((r,idx)=> (
              <button key={idx} onClick={()=>{
                if(!selLeft) return;
                const pair = pairs.find(p=>p.left===selLeft);
                if(pair && pair.right===r){ setMatched(m=>({...m,[selLeft]:true})); speakGerman(selLeft); }
              }} className="p-3 rounded-xl border bg-white text-3xl">{r}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">طابق كل الكلمات — التقدم محفوظ تلقائياً</div>
    </Card>
  )
}

function ListenMode({words,onComplete}){
  const [qIdx,setQIdx] = useState(0);
  const current = useMemo(()=>words[qIdx % words.length],[qIdx,words]);
  const [choices,setChoices] = useState(()=>shuffle(words).slice(0,4));

  useEffect(()=>{
    speakGerman(current.de);
    setChoices(shuffle(words).slice(0,4));
  },[qIdx, words]);

  const pick = (w)=>{
    if(w.de === current.de){
      if(qIdx >= words.length-1) onComplete?.();
      else setQIdx(v=>v+1);
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-center gap-3">
        <Btn onClick={()=>speakGerman(current.de)}>🔊 اسمع الكلمة</Btn>
        <div className="text-gray-500 text-sm">اختر الصورة المطابقة</div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {choices.map((w,i)=>(
          <button key={i} onClick={()=>pick(w)} className="p-4 rounded-2xl border bg-white text-center hover:bg-gray-50 active:scale-[0.98]">
            <div className="text-5xl">{w.emoji}</div>
            <div className="mt-1 text-sm text-gray-500">{w.ar}</div>
          </button>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-400">سؤال {qIdx+1} / {words.length}</div>
    </Card>
  )
}

export default function App(){
  const [progress,setProgress] = useLocalProgress();
  const [station,setStation] = useState(0);
  const [mode,setMode] = useState(MODES.LEARN);
  const category = CATEGORIES[station];
  const words = category.words;

  useEffect(()=>{ document.documentElement.dir = 'rtl'; },[]);

  const completeStation = ()=>{
    setProgress(p=>{
      const completed = {...p.completed, [category.id]:true};
      const unlocked = Math.max(p.unlocked, station+1);
      return {...p, unlocked, stars:p.stars+1, completed};
    });
  }

  const StationCard = ({s}) => (
    <button onClick={()=>setStation(s.index)} disabled={s.index > progress.unlocked}
      className={`rounded-2xl p-4 border shadow-sm text-left transition w-full ${s.index<=progress.unlocked?'bg-white hover:bg-gray-50':'bg-gray-100 opacity-60 cursor-not-allowed'}`}>
      <div className="flex items-center gap-3">
        <div className="text-3xl">{s.icon}</div>
        <div className="flex-1">
          <div className="font-extrabold">{s.title}</div>
          <div className="text-xs text-gray-500">محطة {s.index+1}</div>
        </div>
        {progress.completed[s.id] && <div className="text-yellow-500">⭐</div>}
      </div>
    </button>
  );

  const MAP_STATIONS = CATEGORIES.map((c,i)=>({id:c.id,title:c.title,icon:c.icon,index:i}));

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-900">
      <header className="max-w-4xl mx-auto px-4 pt-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🗺️</div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">رحلة الكلمات – Die Wörterreise</h1>
            <p className="text-xs text-gray-500">مناسبة لعمر 6 سنوات — تعلّم ممتع وخفيف</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-700 text-sm">نجوم: {progress.stars}</div>
          <Btn onClick={()=>{
            if(confirm('إعادة ضبط التقدم؟')){
              localStorage.removeItem(STORAGE_KEY);
              location.reload();
            }
          }}>إعادة الضبط</Btn>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        <Card className="mb-4">
          <div className="font-extrabold mb-2">خريطة المغامرة</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MAP_STATIONS.map(s => <StationCard key={s.id} s={s} />)}
          </div>
          <div className="mt-2 text-xs text-gray-500">افتح المحطات تدريجيًا. كل محطة = مجموعة كلمات جديدة.</div>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Card>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{category.icon}</div>
                <div>
                  <div className="font-black">{category.title}</div>
                  <div className="text-xs text-gray-500">محطة {station+1} من {CATEGORIES.length}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Btn className={mode==='LEARN'?'bg-blue-100 border-blue-300':''} onClick={()=>setMode('LEARN')}>📖 تعلّم</Btn>
                <Btn className={mode==='MATCH'?'bg-blue-100 border-blue-300':''} onClick={()=>setMode('MATCH')}>🧩 مطابقة</Btn>
                <Btn className={mode==='LISTEN'?'bg-blue-100 border-blue-300':''} onClick={()=>setMode('LISTEN')}>🎧 اسمع واختر</Btn>
                <Btn onClick={()=>speakGerman(words.map(w=>w.de).join(', '))}>🔊 نُطق كل الكلمات</Btn>
              </div>
              <div className="mt-4">
                <Btn className="w-full bg-green-100 border-green-300" onClick={completeStation}>✅ اعتبر المحطة مُنجزة (للأهل)</Btn>
              </div>
            </Card>
          </div>
          <div className="md:col-span-2">
            {mode==='LEARN' && <LearnMode words={words} onComplete={completeStation} />}
            {mode==='MATCH' && <MatchMode words={words} onComplete={completeStation} />}
            {mode==='LISTEN' && <ListenMode words={words} onComplete={completeStation} />}
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 pb-8 text-center text-xs text-gray-500">
        تعمل كليًا بدون إنترنت بعد التثبيت كـ APK – النطق يعتمد على محرّك TTS في الجهاز.
      </footer>
    </div>
  )
}

function useLocalProgress(){
  const [state,setState] = React.useState(()=>{
    try{
      const raw = localStorage.getItem('woerterreise_progress_v1');
      return raw? JSON.parse(raw):{unlocked:0,stars:0,completed:{}};
    }catch{return {unlocked:0,stars:0,completed:{}}}
  });
  React.useEffect(()=>{ localStorage.setItem('woerterreise_progress_v1', JSON.stringify(state)); },[state]);
  return [state,setState];
}
