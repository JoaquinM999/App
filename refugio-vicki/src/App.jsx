import { useState, useEffect } from "react";

const FF = "'Varela Round', sans-serif";

/* ─────────────────────────────────────────────
   VIRTUAL COORDINATE SYSTEM
   BASE_W: 375px (ancho de referencia iPhone base)
   BASE_H: 667px (alto de referencia iPhone base)
   
   El sistema escala todo uniformemente manteniendo
   proporciones exactas en cualquier dispositivo.
───────────────────────────────────────────── */
const BASE_W = 375;
const BASE_H = 667;

function useWindowScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const vw = window.visualViewport?.width ?? window.innerWidth;
      const ratio = BASE_W / BASE_H;
      
      // Calcular el scale basado en la altura disponible
      const newScale = vh / BASE_H;
      setScale(newScale);
    };
    
    calc();
    
    window.visualViewport?.addEventListener("resize", calc);
    window.visualViewport?.addEventListener("scroll", calc);
    window.addEventListener("resize", calc);
    window.addEventListener("orientationchange", calc);
    
    return () => {
      window.visualViewport?.removeEventListener("resize", calc);
      window.visualViewport?.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
      window.removeEventListener("orientationchange", calc);
    };
  }, []);
  
  return scale;
}

/* ─────────────────────────────────────────────
   LEGACY: useWorldSize mantiene compatibilidad
───────────────────────────────────────────── */
function useWorldSize() {
  return { width: BASE_W, height: BASE_H };
}

/* ─────────────────────────────────────────────
   DEBUG MODE
   Para activar: añadir ?debug a la URL
   Ej: https://tu-app.com/?debug
   Muestra cajas sobre los hotspots y coords
   del click para que puedas recalibrar.
───────────────────────────────────────────── */
const useDebug = () =>
  typeof window !== "undefined" && window.location.search.includes("debug");

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const HUGS = [
  "Eres más valiente de lo que crees 🌸",
  "Hoy también mereces todo lo bueno del mundo 💕",
  "Tu presencia hace este lugar más brillante ✨",
  "Está bien no estar bien. Aquí estás segura 🌷",
  "Cada pasito cuenta, aunque sea pequeñito 🐾",
  "Eres exactamente suficiente, tal como eres 🍓",
  "El mundo es mejor contigo en él 🌈",
  "Respira. Todo pasa, incluso esto 🌬️",
  "Mereces amor, descanso y algodón de azúcar 🍭",
  "Hoy hiciste lo mejor que pudiste. Eso es todo 💖",
];

const ALBUMS = [
  { id:1, name:"Momentos Juntos",  emoji:"🌸", color:"#fce4ec", photos:["URL_1.jpg","URL_2.jpg"] },
  { id:2, name:"Con Papá",         emoji:"⭐", color:"#f3e5f5", photos:["URL_1.jpg","URL_2.jpg"] },
  { id:3, name:"Recuerdos Felices",emoji:"🌈", color:"#e8f5e9", photos:["URL_1.jpg","URL_2.jpg"] },
  { id:4, name:"Viajes",           emoji:"✈️", color:"#e3f2fd", photos:["URL_1.jpg","URL_2.jpg"] },
];

/* ─────────────────────────────────────────────
   BUILDINGS — Coordenadas en píxeles (375x667 base)
   Cada edificio está posicionado exactamente en su
   ubicación en el mapa, escalando uniformemente.
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   BUILDINGS — Ajustados exactamente a tus recuadros rojos
───────────────────────────────────────────── */
const BUILDINGS = [
  { id: "refugio",     top: 70,   left: 40,   w: 110,  h: 140 },
  { id: "recuerdos",   top: 45,   left: 235,  w: 115,  h: 175 },
  { id: "abrazos",     top: 265,  left: 45,   w: 65,   h: 105 },
  { id: "invernadero", top: 255,  left: 215,  w: 135,  h: 145 },
  { id: "cafe",        top: 395,  left: 30,   w: 145,  h: 130 },
  { id: "observatorio",top: 450,  left: 255,  w: 90,   h: 105 },
];

/* ─────────────────────────────────────────────
   CHARACTERS — (Ajustados hacia abajo y a la derecha)
───────────────────────────────────────────── */
const CHARACTERS = [
  { id:"melody", name:"My Melody",   msg:"¡Eres súper especial, Vicki! 🐰💕",       top: 185, left: 150, w: 25, h: 40 },
  { id:"kitty",  name:"Hello Kitty", msg:"¡Este es tu espacio seguro! 🎀",           top: 204, left: 202, w: 30, h: 35 },
  { id:"pompo",  name:"Pompompurin", msg:"¡La vida es más dulce contigo! 🍮",        top: 340, left: 110, w: 35, h: 30 },
  { id:"keropi", name:"Keroppi",     msg:"¡Un pasito a la vez! 🐸💚",               top: 370, left: 263, w: 30, h: 30 },
  { id:"badtz",  name:"Badtz-Maru",  msg:"¡Estoy planeando algo genial para ti! 😤", top: 426, left: 181, w: 25, h: 40 },
  { id:"kuromi", name:"Kuromi", msg:"¿Lista para causar problemas? 🖤",              top: 487, left: 227, w: 30, h: 35 },
  { id:"cinna",  name:"Cinnamoroll", msg:"¡Todo va a estar bien! ☁️💙",             top: 532, left: 42,  w: 45, h: 25 },
];

/* ─────────────────────────────────────────────
   SCENES — Coordenadas en píxeles (375x667 base)
   globTop/globLeft = posición del objeto interactivo
───────────────────────────────────────────── */
const SCENES = {
  refugio:     { bg:"url('/Casita.png')",      accent:"#f48fb1", dark:"#c2185b", glob:"📝 Escribir en diario", globTop: 387, globLeft: 180 },
  recuerdos:   { bg:"url('/Arbol.png')",        accent:"#ce93d8", dark:"#7b1fa2", glob:"📸 Ver fotos",          globTop: 253, globLeft: 188 },
  abrazos:     { bg:"url('/Postal.png')",       accent:"#f06292", dark:"#ad1457", glob:"💌 Abrir buzón",        globTop: 367, globLeft: 131 },
  invernadero: { bg:"url('/Invernadero.png')",  accent:"#81c784", dark:"#388e3c", glob:"🌱 Mi ánimo",           globTop: 400, globLeft: 188 },
  cafe:        { bg:"url('/Cafe.png')",         accent:"#ffb74d", dark:"#e65100", glob:"🎶 Poner música",       globTop: 454, globLeft: 206 },
  observatorio:{ bg:"url('/Astronomia.png')",   accent:"#ce93d8", dark:"#e1bee7", glob:"🔭 Ver estrellas",      globTop: 367, globLeft: 225 },
};

const MAP_BG = "/mapa-vicki.png";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const ls = {
  get:(k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch{ return d; }},
  set:(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} },
};
const fmt = d => new Date(d).toLocaleDateString("es-AR",{day:"2-digit",month:"short",year:"numeric"});

function MoodChart({ data }) {
  if(!data.length) return <p style={{textAlign:"center",color:"rgba(255,255,255,0.6)",fontSize:"0.78rem",fontFamily:FF}}>Aún no hay registros 🌱</p>;
  const pts=[...data].reverse().slice(0,10);
  const w=260,h=80,pad=14;
  const xStep=(w-pad*2)/Math.max(pts.length-1,1);
  const yS=v=>h-pad-((v/10)*(h-pad*2));
  const points=pts.map((d,i)=>`${pad+i*xStep},${yS(d.score)}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{overflow:"visible"}}>
      <defs><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f48fb1" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#f48fb1" stopOpacity="0"/>
      </linearGradient></defs>
      <polygon fill="url(#gc)" points={`${pad},${h-pad} ${points} ${pad+(pts.length-1)*xStep},${h-pad}`}/>
      <polyline fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" points={points}/>
      {pts.map((d,i)=>(
        <circle key={i} cx={pad+i*xStep} cy={yS(d.score)} r="4" fill="#fff" stroke="#f48fb1" strokeWidth="2"/>
      ))}
    </svg>
  );
}

function StarAnim({ text, onDone }) {
  const [ph,setPh]=useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setPh(1),50);
    const t2=setTimeout(()=>setPh(2),950);
    const t3=setTimeout(onDone,1600);
    return()=>[t1,t2,t3].forEach(clearTimeout);
  },[]);
  return (
    <div style={{
      position:"absolute",bottom:ph===2?"130%":"10%",left:ph===2?"110%":"20%",
      transition:"all 1.4s cubic-bezier(.4,0,.2,1)",opacity:ph===2?0:1,
      fontSize:"1.8rem",pointerEvents:"none",zIndex:20,
      transform:ph===2?"scale(0.2) rotate(30deg)":"scale(1)",
      filter:"drop-shadow(0 0 10px #ce93d8)",
    }}>
      ⭐ <span style={{fontSize:"0.68rem",color:"#fff",fontFamily:FF}}>{text.slice(0,18)}{text.length>18?"…":""}</span>
    </div>
  );
}

const glass = {
  background:"rgba(255,255,255,0.32)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",
  borderRadius:"1.75rem",border:"1.5px solid rgba(255,255,255,0.55)",boxShadow:"0 8px 32px rgba(0,0,0,0.18)",
};
const glassInner = {
  background:"rgba(255,255,255,0.22)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",
  borderRadius:"1.25rem",border:"1px solid rgba(255,255,255,0.4)",
};

function GlassInput({ value, onChange, placeholder, multiline=false, accent="#f48fb1" }) {
  const base = {
    width:"100%",padding:"0.6rem 1rem",borderRadius:"1.25rem",
    border:`1.5px solid ${accent}66`,background:"rgba(255,255,255,0.55)",backdropFilter:"blur(8px)",
    fontFamily:FF,fontSize:"0.85rem",color:"#3a0030",outline:"none",boxSizing:"border-box",resize:"none",
    boxShadow:`0 2px 10px ${accent}22`,marginBottom:"0.5rem",
  };
  return multiline
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} style={{...base,lineHeight:1.6}}/>
    : <input value={value} onChange={onChange} placeholder={placeholder} style={base}/>;
}

function GlassBtn({ onClick, accent="#f48fb1", children, full=true }) {
  const [hov,setHov]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background:hov?`${accent}ee`:`${accent}cc`,color:"#fff",border:"1.5px solid rgba(255,255,255,0.5)",
      borderRadius:"2rem",padding:"0.55rem 1.2rem",fontFamily:FF,cursor:"pointer",fontSize:"0.85rem",
      width:full?"100%":"auto",boxShadow:hov?`0 6px 20px ${accent}88`:`0 3px 12px ${accent}44`,
      transform:hov?"scale(1.03)":"scale(1)",transition:"all 0.18s cubic-bezier(.36,.07,.19,.97)",
      backdropFilter:"blur(4px)",marginTop:"0.4rem",
    }}>{children}</button>
  );
}

/* ─── Actions ─── */
function ActionRefugio({ accent }) {
  const [entries,setEntries]=useState(()=>ls.get("diary",[]));
  const [text,setText]=useState("");
  const save=()=>{
    if(!text.trim()) return;
    const next=[{text,date:new Date().toISOString()},...entries];
    setEntries(next);ls.set("diary",next);setText("");
  };
  return (<>
    <div style={{...glassInner,maxHeight:"28vmin",overflowY:"auto",padding:"0.75rem",marginBottom:"0.6rem"}}>
      {!entries.length && <p style={{textAlign:"center",color:"rgba(255,255,255,0.7)",fontSize:"0.8rem",fontFamily:FF}}>Aún no hay entradas 🌱</p>}
      {entries.map((e,i)=>(
        <div key={i} style={{borderLeft:"3px solid #f48fb1",paddingLeft:"0.6rem",marginBottom:"0.5rem"}}>
          <div style={{fontSize:"0.62rem",color:"#f8bbd0",fontFamily:FF}}>📅 {fmt(e.date)}</div>
          <div style={{fontSize:"0.82rem",color:"#fff",fontFamily:FF,lineHeight:1.5}}>{e.text}</div>
        </div>
      ))}
    </div>
    <GlassInput value={text} onChange={e=>setText(e.target.value)} placeholder="¿Qué quieres recordar hoy? 🌸" multiline accent={accent}/>
    <GlassBtn onClick={save} accent={accent}>💾 Guardar entrada</GlassBtn>
  </>);
}

function ActionRecuerdos({ accent }) {
  const [view,setView]=useState(null);
  if(!view) return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {ALBUMS.map(a=>(
        <button key={a.id} onClick={()=>setView(a)} style={{
          ...glassInner,padding:"0.9rem 0.5rem",cursor:"pointer",textAlign:"center",
          background:"rgba(255,255,255,0.25)",border:"1.5px solid rgba(255,255,255,0.4)",transition:"transform 0.15s",
        }}>
          <div style={{fontSize:"1.8rem"}}>{a.emoji}</div>
          <div style={{fontSize:"0.72rem",color:"#fff",fontFamily:FF,marginTop:3,textShadow:"0 1px 4px rgba(0,0,0,0.3)"}}>{a.name}</div>
          <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.7)",fontFamily:FF}}>{a.photos.length} fotos</div>
        </button>
      ))}
    </div>
  );
  return (<>
    <GlassBtn onClick={()=>setView(null)} accent={accent} full={false}>← Volver</GlassBtn>
    <p style={{textAlign:"center",fontSize:"0.82rem",color:"#fff",fontFamily:FF,margin:"0.5rem 0",textShadow:"0 1px 4px rgba(0,0,0,0.3)"}}>{view.emoji} {view.name}</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
      {view.photos.map((url,i)=>(
        <div key={i} style={{aspectRatio:"1",...glassInner,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src={url} alt={`foto ${i+1}`} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
        </div>
      ))}
    </div>
  </>);
}

function ActionAbrazos({ accent }) {
  const [idx,setIdx]=useState(()=>Math.floor(Math.random()*HUGS.length));
  return (<>
    <div style={{...glassInner,padding:"1.5rem 1rem",textAlign:"center",marginBottom:"0.75rem"}}>
      <p style={{fontSize:"1.05rem",color:"#fff",fontFamily:FF,lineHeight:1.7,fontStyle:"italic",textShadow:"0 1px 8px rgba(0,0,0,0.25)",margin:0}}>{HUGS[idx]}</p>
    </div>
    <GlassBtn onClick={()=>setIdx(Math.floor(Math.random()*HUGS.length))} accent={accent}>💌 Otro abrazo</GlassBtn>
  </>);
}

function ActionInvernadero({ accent }) {
  const [mood,setMood]=useState({feel:"",help:"",score:5});
  const [hist,setHist]=useState(()=>ls.get("mood",[]));
  const save=()=>{
    const e={...mood,date:new Date().toISOString()};
    const next=[e,...hist];setHist(next);ls.set("mood",next);
    setMood({feel:"",help:"",score:5});
  };
  return (<>
    <GlassInput value={mood.feel} onChange={e=>setMood({...mood,feel:e.target.value})} placeholder="¿Cómo te sientes hoy? 🌱" accent={accent}/>
    <GlassInput value={mood.help} onChange={e=>setMood({...mood,help:e.target.value})} placeholder="¿Qué ayudaría a mejorar tu día? ✨" accent={accent}/>
    <div style={{...glassInner,padding:"0.6rem 0.9rem",marginBottom:"0.4rem"}}>
      <label style={{fontSize:"0.78rem",color:"#fff",fontFamily:FF,display:"block",marginBottom:6,textShadow:"0 1px 4px rgba(0,0,0,0.3)"}}>
        Ánimo: <strong>{mood.score}/10</strong> {mood.score>=8?"🌟":mood.score>=6?"😊":mood.score>=4?"😐":"😔"}
      </label>
      <input type="range" min="1" max="10" value={mood.score} onChange={e=>setMood({...mood,score:+e.target.value})} style={{width:"100%",accentColor:accent}}/>
    </div>
    <GlassBtn onClick={save} accent={accent}>🌿 Guardar check-in</GlassBtn>
    {hist.length>0 && <div style={{...glassInner,padding:"0.5rem",marginTop:"0.6rem"}}><MoodChart data={hist}/></div>}
  </>);
}

function ActionCafe({ accent }) {
  return (<>
    <p style={{textAlign:"center",fontSize:"0.82rem",color:"rgba(255,255,255,0.85)",fontFamily:FF,marginBottom:"0.75rem",textShadow:"0 1px 4px rgba(0,0,0,0.3)"}}>Tu rincón lo-fi para respirar 🎶</p>
    <div style={{borderRadius:"1.25rem",overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
      <iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0"
        width="100%" height="152" frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"/>
    </div>
    <p style={{textAlign:"center",fontSize:"0.72rem",color:"rgba(255,255,255,0.65)",fontFamily:FF,marginTop:"0.6rem"}}>Respira profundo. Este momento es tuyo. ☕</p>
  </>);
}

function ActionObservatorio({ accent }) {
  const [text,setText]=useState("");
  const [star,setStar]=useState(null);
  const launch=()=>{ if(!text.trim()) return; setStar(text); setText(""); };
  return (<>
    <p style={{textAlign:"center",fontSize:"0.82rem",color:"rgba(255,255,255,0.85)",fontFamily:FF,marginBottom:"0.6rem",lineHeight:1.6,textShadow:"0 1px 6px rgba(0,0,0,0.4)"}}>
      Escribe lo que quieres soltar y el universo lo recibirá 🌠
    </p>
    <div style={{position:"relative",minHeight:50}}>
      {star && <StarAnim text={star} onDone={()=>setStar(null)}/>}
    </div>
    <GlassInput value={text} onChange={e=>setText(e.target.value)} placeholder="¿Qué pensamiento quieres soltar hoy? 🌠" accent={accent}/>
    <GlassBtn onClick={launch} accent={accent}>🌠 Lanzar al universo</GlassBtn>
  </>);
}

const ACTION_MAP = {
  refugio:ActionRefugio, recuerdos:ActionRecuerdos, abrazos:ActionAbrazos,
  invernadero:ActionInvernadero, cafe:ActionCafe, observatorio:ActionObservatorio,
};

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const { width, height } = useWorldSize();
  const scale = useWindowScale();
  const debug = useDebug();

  const [worldEl,  setWorldEl]  = useState(null);
  const [scene,    setScene]    = useState("map");
  const [actionOpen,setAction]  = useState(false);
  const [bubble,   setBubble]   = useState(null);
  const [clickXY,  setClickXY]  = useState(null);   // debug coords

  const goMap      = () => { setScene("map"); setAction(false); setBubble(null); };
  const goScene    = id  => { setScene(id);   setAction(false); setBubble(null); };
  const openAction = ()  => setAction(true);
  const closeAction= ()  => setAction(false);

  /* Debug: mostrar coords del click */
  useEffect(() => {
    if (!debug || !worldEl) return;
    const h = e => {
      const r = worldEl.getBoundingClientRect();
      // Ahora sí calcula los píxeles reales virtuales, sin multiplicar por 100
      const x = ((e.clientX - r.left) / scale).toFixed(0);
      const y = ((e.clientY - r.top)  / scale).toFixed(0);
      setClickXY({ x, y });
      clearTimeout(h._t);
      h._t = setTimeout(() => setClickXY(null), 2500);
    };
    worldEl.addEventListener("click", h);
    return () => worldEl.removeEventListener("click", h);
  }, [debug, worldEl, scale]);

  const sc       = scene !== "map" ? SCENES[scene] : null;
  const ActionUI = scene !== "map" ? ACTION_MAP[scene] : null;
  const isObs    = scene === "observatorio";

  if (!width || !height) return null;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap" rel="stylesheet"/>

      {/* Letterbox exterior */}
      <div style={{
        position:"fixed", inset:0,
        backgroundColor:"#1a0030",
        display:"flex", alignItems:"center", justifyContent:"center",
        overflow:"hidden",
      }}>

        {/* #world — VIRTUAL COORDINATE SYSTEM
            Dimensiones fijas: 375x667 (píxeles base)
            Escalado uniforme con transform: scale()
            Mantiene proporciones exactas en todos los dispositivos
        */}
        <div ref={setWorldEl} id="world" style={{
          width, height,
          position:"relative", overflow:"hidden", fontFamily:FF, flexShrink:0,
          backgroundImage: scene === "map" ? `url('${MAP_BG}')` : sc?.bg,
          backgroundSize:"100% 100%",
          backgroundPosition:"center",
          backgroundRepeat:"no-repeat",
          transform: `scale(${scale})`,
          transformOrigin: "center top",
          willChange: "transform",
        }}>

          {/* ══ MAPA ══ */}
          {scene === "map" && (<>

            {BUILDINGS.map(b=>(
              <button key={b.id} onClick={()=>goScene(b.id)} style={{
                position:"absolute", top: b.top, left: b.left,
                width: b.w, height: b.h, padding:0,
                background: debug ? "rgba(255,50,50,0.35)" : "transparent",
                border: debug ? "2px solid red" : "none",
                cursor:"pointer", zIndex:10,
              }}>
                {debug && <span style={{
                  position:"absolute",top:2,left:2,
                  fontSize:"0.42rem",color:"#fff",fontFamily:"monospace",lineHeight:1.3,
                  background:"rgba(180,0,0,0.82)",padding:"1px 3px",borderRadius:2,
                }}>🏠 {b.id}{"\n"}t:{b.top} l:{b.left}</span>}
              </button>
            ))}

            {CHARACTERS.map(c=>(
              <div key={c.id} style={{position:"absolute",top: c.top,left: c.left,width: c.w,height: c.h,zIndex:15}}>
                <button onClick={()=>setBubble(b=>b===c.id?null:c.id)} style={{
                  width:"100%",height:"100%",padding:0,
                  background: debug ? "rgba(0,80,255,0.35)" : "transparent",
                  border: debug ? "2px solid #4af" : "none",
                  cursor:"pointer",
                }}>
                  {debug && <span style={{
                    position:"absolute",top:2,left:2,
                    fontSize:"0.42rem",color:"#fff",fontFamily:"monospace",lineHeight:1.3,
                    background:"rgba(0,50,180,0.85)",padding:"1px 3px",borderRadius:2,
                  }}>🐾 {c.id}{"\n"}t:{c.top} l:{c.left}</span>}
                </button>

                {bubble===c.id && (
                  <div style={{
                    position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%)",
                    background:"rgba(255,255,255,0.94)",backdropFilter:"blur(12px)",
                    border:"2px solid rgba(244,143,177,0.6)",borderRadius:"1.25rem",
                    padding:"0.5rem 0.75rem",minWidth:140,maxWidth:175,
                    fontSize:"0.68rem",color:"#3a0030",textAlign:"center",fontFamily:FF,
                    boxShadow:"0 6px 20px rgba(244,143,177,0.35)",
                    animation:"bubblePop 0.28s cubic-bezier(.36,.07,.19,.97)",
                    zIndex:30,whiteSpace:"normal",
                  }}>
                    <strong style={{color:"#f06292",display:"block",marginBottom:2,fontSize:"0.65rem"}}>{c.name}</strong>
                    {c.msg}
                    <div style={{
                      position:"absolute",bottom:-7,left:"50%",transform:"translateX(-50%)",
                      width:0,height:0,
                      borderLeft:"7px solid transparent",borderRight:"7px solid transparent",
                      borderTop:"7px solid rgba(255,255,255,0.94)",
                    }}/>
                  </div>
                )}
              </div>
            ))}
          </>)}

          {/* ══ INTERIOR ══ */}
          {scene !== "map" && sc && (<>

            {isObs && (
              <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}>
                {Array.from({length:45}).map((_,i)=>(
                  <div key={i} style={{
                    position:"absolute",
                    top:`${Math.random()*85}%`,left:`${Math.random()*100}%`,
                    width:Math.random()*3+1,height:Math.random()*3+1,
                    borderRadius:"50%",background:"#fff",
                    opacity:Math.random()*0.8+0.2,
                    animation:`twinkle ${1.5+Math.random()*2}s ease-in-out infinite alternate`,
                    animationDelay:`${Math.random()*2}s`,
                  }}/>
                ))}
              </div>
            )}

            <button onClick={goMap} style={{
              position:"absolute",top: 20, left: 15, zIndex:40,
              ...glass,background:"rgba(255,255,255,0.35)",border:"1.5px solid rgba(255,255,255,0.5)",
              color: isObs ? "#e0d0ff" : sc.dark,
              fontFamily:FF,fontSize:"0.75rem",padding:"0.35rem 0.85rem",cursor:"pointer",borderRadius:"2rem",
            }}>← Mapa</button>

            <div style={{
              position:"absolute",top: 20, left:"50%",transform:"translateX(-50%)",
              fontFamily:FF,fontSize:"0.78rem",fontWeight:700,
              color: isObs ? "#e0d0ff" : sc.dark,
              textShadow: isObs ? "0 0 12px #9575cd" : "0 1px 6px rgba(255,255,255,0.8)",
              zIndex:40,whiteSpace:"nowrap",
            }}>
              {scene==="refugio"?"🏠 El Refugio":scene==="recuerdos"?"📸 Recuerdos":
               scene==="abrazos"?"💝 Abrazos":scene==="invernadero"?"🌿 Invernadero":
               scene==="cafe"?"☕ Café Musical":"🔭 Observatorio"}
            </div>

            {/* Glob flotante */}
            {!actionOpen && (
              <button onClick={openAction} style={{
                position:"absolute",
                top: sc.globTop, left: sc.globLeft,
                transform:"translate(-50%,-50%)",zIndex:20,
                ...glass,background:"rgba(255,255,255,0.45)",
                border:`2px solid ${sc.accent}88`,
                color: isObs ? "#fff" : sc.dark,
                fontFamily:FF,fontSize:"0.8rem",
                padding:"0.6rem 1.1rem",cursor:"pointer",borderRadius:"2rem",
                animation:"floatBob 2.2s ease-in-out infinite",
                boxShadow:`0 6px 24px ${sc.accent}55`,whiteSpace:"nowrap",
              }}>
                {sc.glob}
              </button>
            )}

            {/* Debug: punto rojo en posición del glob */}
            {debug && !actionOpen && (
              <div style={{
                position:"absolute",top: sc.globTop,left: sc.globLeft,
                transform:"translate(-50%,-50%)",
                width:14,height:14,borderRadius:"50%",background:"red",
                zIndex:50,pointerEvents:"none",boxShadow:"0 0 0 4px rgba(255,0,0,0.3)",
              }}/>
            )}

            {actionOpen && (<>
              <div style={{
                position:"absolute",inset:0,zIndex:30,
                background:"rgba(0,0,0,0.28)",backdropFilter:"blur(5px)",WebkitBackdropFilter:"blur(5px)",
              }}/>
              <div style={{
                position:"absolute",top:"50%",left:"50%",
                transform:"translate(-50%,-50%)",
                zIndex:40,width:"86%",maxWidth:370,maxHeight:"72dvh",overflowY:"auto",
                ...glass,padding:"1.2rem 1.1rem 1.4rem",
                animation:"slideUp 0.32s cubic-bezier(.22,1,.36,1)",
              }}>
                <div style={{width:36,height:4,borderRadius:99,background:"rgba(255,255,255,0.5)",margin:"0 auto 0.9rem"}}/>
                <button onClick={closeAction} style={{
                  position:"absolute",top:"0.9rem",right:"0.9rem",
                  background:"rgba(255,255,255,0.3)",border:"1px solid rgba(255,255,255,0.4)",
                  borderRadius:"50%",width:28,height:28,cursor:"pointer",
                  color:"#fff",fontFamily:FF,fontSize:"0.9rem",
                  display:"flex",alignItems:"center",justifyContent:"center",
                }}>✕</button>
                {ActionUI && <ActionUI accent={sc.accent}/>}
              </div>
            </>)}
          </>)}

          {/* ── Debug: coordenadas del click ── */}
          {debug && clickXY && (
            <div style={{
              position:"absolute",top:"50%",left:"50%",
              transform:"translate(-50%,-50%)",
              background:"rgba(0,0,0,0.9)",color:"#0ff",
              fontFamily:"monospace",fontSize:"1.1rem",
              padding:"0.6rem 1.2rem",borderRadius:"0.75rem",
              zIndex:9999,pointerEvents:"none",border:"1px solid #0ff",
            }}>
              left: {clickXY.x}px<br/>top: {clickXY.y}px
            </div>
          )}

          {debug && (
            <div style={{
              position:"absolute",bottom:"1%",left:"50%",transform:"translateX(-50%)",
              background:"rgba(0,0,0,0.75)",color:"#ff0",
              fontFamily:"monospace",fontSize:"0.55rem",
              padding:"2px 8px",borderRadius:4,zIndex:9999,pointerEvents:"none",
            }}>
              🐛 DEBUG — clickeá cualquier punto para ver sus coordenadas
            </div>
          )}

          <style>{`
            @keyframes floatBob{0%,100%{transform:translate(-50%,-50%) translateY(0)}50%{transform:translate(-50%,-50%) translateY(-10px)}}
            @keyframes bubblePop{0%{transform:translateX(-50%) scale(0.4);opacity:0}70%{transform:translateX(-50%) scale(1.06)}100%{transform:translateX(-50%) scale(1);opacity:1}}
            @keyframes slideUp{from{transform:translate(-50%,-60%);opacity:0}to{transform:translate(-50%,-50%);opacity:1}}
            @keyframes twinkle{from{opacity:0.2;transform:scale(0.8)}to{opacity:1;transform:scale(1.2)}}
            *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;font-family:'Varela Round',sans-serif;}
            #world ::-webkit-scrollbar{width:3px}
            #world ::-webkit-scrollbar-thumb{background:rgba(244,143,177,0.6);border-radius:4px}
            textarea,input{font-family:'Varela Round',sans-serif;}
          `}</style>

        </div>
      </div>
    </>
  );
}