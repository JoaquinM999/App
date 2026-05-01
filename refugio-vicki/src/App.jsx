import { useState, useEffect, useRef } from "react";

const HUGS = [
  "Eres más valiente de lo que crees 🌸","Hoy también mereces todo lo bueno del mundo 💕",
  "Tu presencia hace este lugar más brillante ✨","Está bien no estar bien. Aquí estás segura 🌷",
  "Cada pasito cuenta, aunque sea pequeñito 🐾","Eres exactamente suficiente, tal como eres 🍓",
  "El mundo es mejor contigo en él 🌈","Respira. Todo pasa, incluso esto 🌬️",
  "Mereces amor, descanso y algodón de azúcar 🍭","Hoy hiciste lo mejor que pudiste. Eso es todo 💖",
];

const ALBUMS = [
  { id:1, name:"Momentos Juntos", emoji:"🌸", color:"#fce4ec",
    photos:["URL_FOTO_1.jpg","URL_FOTO_2.jpg","URL_FOTO_3.jpg"] },
  { id:2, name:"Con Papá", emoji:"⭐", color:"#f3e5f5",
    photos:["URL_FOTO_1.jpg","URL_FOTO_2.jpg"] },
  { id:3, name:"Recuerdos Felices", emoji:"🌈", color:"#e8f5e9",
    photos:["URL_FOTO_1.jpg","URL_FOTO_2.jpg","URL_FOTO_3.jpg"] },
  { id:4, name:"Viajes", emoji:"✈️", color:"#e3f2fd",
    photos:["URL_FOTO_1.jpg","URL_FOTO_2.jpg"] },
];

const CHARACTERS = [
  { id:"badtz",  name:"Badtz-Maru", msg:"¡No me molestes, estoy planeando algo genial para ti! 😤", top:"63%", left:"47%" },
  { id:"kuromi", name:"Kuromi",     msg:"¡Jeje! ¿Lista para causar un poco de problemas hoy? 🖤",    top:"73%", left:"60%" },
  { id:"melody", name:"My Melody",  msg:"¡Hola Vicki! Eres súper especial, no lo olvides. 🐰💕",      top:"33%", left:"28%" },
  { id:"cinna",  name:"Cinnamoroll",msg:"¡A volar alto hoy! Todo va a estar bien. ☁️💙",              top:"79%", left:"13%" },
  { id:"keropi", name:"Keroppi",    msg:"¡Croac! ¡Un pasito a la vez! 🐸💚",                          top:"54%", left:"77%" },
  { id:"kitty",  name:"Hello Kitty",msg:"¡Te queremos mucho! Este es tu espacio seguro. 🎀",           top:"40%", left:"44%" },
];

const BUILDINGS = [
  { id:"refugio",     label:"El Refugio",   emoji:"🏠", top:"22%", left:"16%" },
  { id:"recuerdos",   label:"Recuerdos",    emoji:"📸", top:"12%", left:"62%" },
  { id:"abrazos",     label:"Abrazos",      emoji:"💝", top:"30%", left:"36%" },
  { id:"invernadero", label:"Invernadero",  emoji:"🌿", top:"48%", left:"68%" },
  { id:"cafe",        label:"Café Musical", emoji:"☕", top:"62%", left:"10%" },
  { id:"observatorio",label:"Observatorio", emoji:"🔭", top:"72%", left:"75%" },
];

const MODAL_THEMES = {
  refugio:     { bg:"#fff8f9", accent:"#f48fb1", icon:"🏠", title:"Mi Diario Secreto",    pattern:"notebook" },
  recuerdos:   { bg:"#fdf4ff", accent:"#ce93d8", icon:"📸", title:"Álbum de Recuerdos",   pattern:"dots" },
  abrazos:     { bg:"#fff0f5", accent:"#f06292", icon:"💝", title:"Un Abrazo Para Ti",     pattern:"hearts" },
  invernadero: { bg:"#f0fff4", accent:"#81c784", icon:"🌿", title:"Mi Jardín Interior",    pattern:"leaves" },
  cafe:        { bg:"#fffaf0", accent:"#ffb74d", icon:"☕", title:"Café Musical",           pattern:"music" },
  observatorio:{ bg:"#f3f0ff", accent:"#9575cd", icon:"🔭", title:"Soltar al Universo",    pattern:"stars" },
};

const ls = {
  get:(k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch{ return d; } },
  set:(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} },
};
const fmt = d => new Date(d).toLocaleDateString("es-AR",{day:"2-digit",month:"short",year:"numeric"});

function StarAnim({ text, onDone }) {
  const [ph, setPh] = useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setPh(1),50);
    const t2=setTimeout(()=>setPh(2),900);
    const t3=setTimeout(onDone,1500);
    return()=>[t1,t2,t3].forEach(clearTimeout);
  },[]);
  return (
    <div style={{
      position:"absolute", bottom:ph===2?"130%":"15%", left:ph===2?"115%":"25%",
      transition:"all 1.3s cubic-bezier(.4,0,.2,1)",
      opacity:ph===2?0:1, fontSize:"2rem", pointerEvents:"none", zIndex:20,
      transform:ph===2?"scale(0.2) rotate(30deg)":"scale(1) rotate(0deg)",
      filter:"drop-shadow(0 0 8px #ce93d8)",
    }}>
      ⭐
      <span style={{fontSize:"0.7rem",color:"#7c4dff",fontFamily:"'Varela Round',sans-serif",marginLeft:4}}>
        {text.slice(0,18)}{text.length>18?"…":""}
      </span>
    </div>
  );
}

function MoodChart({ data }) {
  if(!data.length) return <p style={{textAlign:"center",color:"#b39ddb",fontSize:"0.8rem",fontFamily:"'Varela Round',sans-serif"}}>Aún no hay registros 🌱</p>;
  const pts=data.slice(-10); const w=280,h=90,pad=16;
  const xStep=(w-pad*2)/Math.max(pts.length-1,1);
  const yS=v=>h-pad-((v/10)*(h-pad*2));
  const points=pts.map((d,i)=>`${pad+i*xStep},${yS(d.score)}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f48fb1" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#f48fb1" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon fill="url(#gc)" points={`${pad},${h-pad} ${points} ${pad+(pts.length-1)*xStep},${h-pad}`}/>
      <polyline fill="none" stroke="#f48fb1" strokeWidth="2.5" strokeLinecap="round" points={points}/>
      {pts.map((d,i)=>(
        <circle key={i} cx={pad+i*xStep} cy={yS(d.score)} r="5" fill="#fff" stroke="#f48fb1" strokeWidth="2"/>
      ))}
      {[2,5,8].map(v=>(
        <line key={v} x1={pad} x2={w-pad} y1={yS(v)} y2={yS(v)} stroke="#f8bbd0" strokeWidth="1" strokeDasharray="4,3"/>
      ))}
    </svg>
  );
}

const patternSVG = {
  notebook: `repeating-linear-gradient(transparent, transparent 27px, #f9d0e0 27px, #f9d0e0 28px)`,
  dots:     `radial-gradient(circle, #f8bbd0 1px, transparent 1px)`,
  hearts:   `none`,
  leaves:   `none`,
  music:    `none`,
  stars:    `none`,
};

export default function App() {
  const [modal,setModal]   = useState(null);
  const [bubble,setBubble] = useState(null);
  const [diaryEntries,setDiaryEntries] = useState(()=>ls.get("diary",[]));
  const [diaryText,setDiaryText]       = useState("");
  const [albumView,setAlbumView]       = useState(null);
  const [hugIdx,setHugIdx]             = useState(0);
  const [mood,setMood]     = useState({feel:"",help:"",score:5});
  const [moodHistory,setMoodHistory]   = useState(()=>ls.get("mood",[]));
  const [obsText,setObsText]           = useState("");
  const [star,setStar]     = useState(null);
  const [pressed,setPressed]= useState(null);

  const saveDiary=()=>{
    if(!diaryText.trim()) return;
    const e={text:diaryText,date:new Date().toISOString()};
    const next=[e,...diaryEntries];
    setDiaryEntries(next); ls.set("diary",next); setDiaryText("");
  };
  const saveMood=()=>{
    const e={...mood,date:new Date().toISOString()};
    const next=[e,...moodHistory];
    setMoodHistory(next); ls.set("mood",next); setMood({feel:"",help:"",score:5});
  };
  const launchStar=()=>{
    if(!obsText.trim()) return;
    setStar(obsText); setObsText("");
  };
  const closeModal=()=>{ setModal(null); setAlbumView(null); };

  const theme = modal ? MODAL_THEMES[modal] : null;

  /* ── Styles ── */
  const FF = "'Varela Round', sans-serif";

  const inp = (accent="#f48fb1") => ({
    width:"100%", padding:"0.65rem 1rem", borderRadius:"1.5rem",
    border:`2px solid ${accent}44`, fontFamily:FF,
    background:"rgba(255,255,255,0.85)", fontSize:"0.88rem",
    boxSizing:"border-box", marginBottom:"0.6rem", outline:"none",
    boxShadow:`0 2px 10px ${accent}22`,
    color:"#7b1fa2", transition:"all 0.2s",
  });

  const Btn = ({onClick,color="#f48fb1",children,style={}}) => {
    const [hov,setHov]=useState(false);
    return (
      <button onClick={onClick}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{
          background:`linear-gradient(135deg,${color},${color}cc)`,
          color:"#fff", border:"none", borderRadius:"2rem",
          padding:"0.6rem 1.4rem", fontFamily:FF, cursor:"pointer",
          fontSize:"0.9rem", marginTop:"0.4rem", width:"100%",
          boxShadow:hov?`0 6px 20px ${color}66`:`0 3px 10px ${color}44`,
          transform:hov?"scale(1.03)":"scale(1)",
          transition:"all 0.18s cubic-bezier(.36,.07,.19,.97)",
          letterSpacing:"0.02em", ...style,
        }}>{children}</button>
    );
  };

  return (
    <div style={{
      position:"fixed", inset:0, overflow:"hidden", fontFamily:FF,
      backgroundImage:`url('/mapa-vicki.png')`,
      backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap" rel="stylesheet"/>

      {/* Building hotspots */}
      {BUILDINGS.map(b=>(
        <button key={b.id} onClick={()=>setModal(b.id)}
          onMouseEnter={()=>setPressed(b.id)} onMouseLeave={()=>setPressed(null)}
          style={{
            position:"absolute", top:b.top, left:b.left, zIndex:10,
            transform:`translateX(-50%) scale(${pressed===b.id?0.93:1})`,
            background:"rgba(255,255,255,0.82)", backdropFilter:"blur(4px)",
            border:"2px solid rgba(244,143,177,0.6)", borderRadius:"2rem",
            padding:"0.22rem 0.65rem", fontFamily:FF, fontSize:"0.65rem",
            color:"#9c4dcc", cursor:"pointer",
            boxShadow:"0 3px 12px rgba(244,143,177,0.35)",
            transition:"transform 0.15s cubic-bezier(.36,.07,.19,.97), box-shadow 0.15s",
          }}>
          {b.emoji} {b.label}
        </button>
      ))}

      {/* Character hotspots */}
      {CHARACTERS.map(c=>(
        <div key={c.id} style={{position:"absolute",top:c.top,left:c.left,zIndex:15,transform:"translate(-50%,-50%)"}}>
          <button onClick={()=>setBubble(b=>b===c.id?null:c.id)} style={{
            background:"rgba(255,255,255,0.45)", border:"2px solid rgba(244,143,177,0.5)",
            borderRadius:"50%", width:34, height:34, cursor:"pointer",
            fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center",
            backdropFilter:"blur(2px)", transition:"transform 0.15s",
          }}>
            {c.id==="badtz"?"🐧":c.id==="kuromi"?"🖤":c.id==="melody"?"🐰":c.id==="cinna"?"🐶":c.id==="keropi"?"🐸":"🎀"}
          </button>
          {bubble===c.id && (
            <div style={{
              position:"absolute", bottom:"115%", left:"50%",
              transform:"translateX(-50%)",
              background:"rgba(255,255,255,0.97)", border:"2.5px solid #f48fb1",
              borderRadius:"1.25rem", padding:"0.55rem 0.8rem",
              minWidth:155, maxWidth:195,
              fontSize:"0.7rem", color:"#9c4dcc", textAlign:"center",
              fontFamily:FF, boxShadow:"0 6px 20px rgba(244,143,177,0.4)",
              animation:"bubblePop 0.3s cubic-bezier(.36,.07,.19,.97)", zIndex:20,
            }}>
              <strong style={{fontSize:"0.68rem",color:"#f06292",display:"block",marginBottom:2}}>{c.name}</strong>
              {c.msg}
              <div style={{position:"absolute",bottom:-9,left:"50%",transform:"translateX(-50%)",width:0,height:0,
                borderLeft:"9px solid transparent",borderRight:"9px solid transparent",borderTop:"9px solid #f48fb1"}}/>
            </div>
          )}
        </div>
      ))}

      {/* MODAL */}
      {modal && theme && (
        <div style={{
          position:"fixed", inset:0, zIndex:50,
          display:"flex", alignItems:"flex-end", justifyContent:"center",
          background:"rgba(230,200,240,0.35)", backdropFilter:"blur(8px)",
        }} onClick={e=>e.target===e.currentTarget&&closeModal()}>

          <div style={{
            width:"100%", maxWidth:430,
            background:theme.bg,
            borderRadius:"2.5rem 2.5rem 0 0",
            padding:"1.4rem 1.3rem 2rem",
            maxHeight:"82vh", overflowY:"auto",
            boxShadow:"0 -8px 40px rgba(206,147,216,0.35)",
            fontFamily:FF, position:"relative",
            backgroundImage: modal==="refugio"
              ? patternSVG.notebook
              : modal==="recuerdos"
              ? `radial-gradient(circle, ${theme.accent}22 1.5px, transparent 1.5px)`
              : "none",
            backgroundSize: modal==="refugio" ? "100% 28px" : modal==="recuerdos" ? "20px 20px" : "auto",
            animation:"slideUp 0.35s cubic-bezier(.22,1,.36,1)",
          }}>
            {/* Handle bar */}
            <div style={{width:44,height:5,background:`${theme.accent}66`,borderRadius:99,margin:"0 auto 1rem",}}/>

            {/* Close */}
            <button onClick={closeModal} style={{
              position:"absolute", top:"1.1rem", right:"1.1rem",
              background:`${theme.accent}22`, border:"none", borderRadius:"50%",
              width:30, height:30, cursor:"pointer", color:theme.accent,
              fontFamily:FF, fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center",
            }}>✕</button>

            {/* Title */}
            <div style={{textAlign:"center", marginBottom:"1.1rem"}}>
              <span style={{fontSize:"2rem"}}>{theme.icon}</span>
              <h2 style={{margin:"0.2rem 0 0",fontSize:"1.05rem",color:theme.accent,fontFamily:FF,fontWeight:700}}>
                {theme.title}
              </h2>
            </div>

            {/* ── REFUGIO ── */}
            {modal==="refugio" && (<>
              <div style={{
                maxHeight:180, overflowY:"auto", marginBottom:"0.8rem",
                background:"rgba(255,255,255,0.6)", borderRadius:"1.5rem",
                padding:"0.75rem", border:"1.5px solid #f8bbd0",
              }}>
                {!diaryEntries.length && <p style={{textAlign:"center",color:"#d4a0bb",fontSize:"0.82rem"}}>Aún no hay entradas 🌱<br/>¡Escribe tu primer momento!</p>}
                {diaryEntries.map((e,i)=>(
                  <div key={i} style={{background:"rgba(255,240,245,0.9)",borderRadius:"1rem",padding:"0.55rem 0.75rem",marginBottom:"0.5rem",borderLeft:"3px solid #f48fb1"}}>
                    <div style={{fontSize:"0.65rem",color:"#f06292",marginBottom:3}}>📅 {fmt(e.date)}</div>
                    <div style={{fontSize:"0.83rem",color:"#7b1fa2",lineHeight:1.5}}>{e.text}</div>
                  </div>
                ))}
              </div>
              <textarea value={diaryText} onChange={e=>setDiaryText(e.target.value)}
                placeholder="¿Qué quieres recordar hoy? 🌸"
                style={{...inp(),"minHeight":"80px",resize:"none",lineHeight:1.6,fontFamily:FF}}/>
              <Btn onClick={saveDiary} color="#f48fb1">💾 Guardar entrada</Btn>
            </>)}

            {/* ── RECUERDOS ── */}
            {modal==="recuerdos" && (<>
              {!albumView ? (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {ALBUMS.map(a=>(
                    <button key={a.id} onClick={()=>setAlbumView(a)} style={{
                      background:`linear-gradient(135deg,${a.color},white)`,
                      border:"2px solid #f48fb1", borderRadius:"1.5rem",
                      padding:"1rem 0.5rem", cursor:"pointer", textAlign:"center",
                      fontFamily:FF, boxShadow:"0 4px 14px rgba(244,143,177,0.2)",
                      transition:"transform 0.15s",
                    }}>
                      <div style={{fontSize:"2rem"}}>{a.emoji}</div>
                      <div style={{fontSize:"0.75rem",color:"#9c4dcc",marginTop:4}}>{a.name}</div>
                      <div style={{fontSize:"0.65rem",color:"#b39ddb",marginTop:2}}>{a.photos.length} fotos</div>
                    </button>
                  ))}
                </div>
              ) : (<>
                <button onClick={()=>setAlbumView(null)} style={{
                  background:"none", border:"2px solid #ce93d8",
                  borderRadius:"2rem", padding:"0.25rem 0.85rem",
                  color:"#9c4dcc", cursor:"pointer", fontSize:"0.8rem",
                  fontFamily:FF, marginBottom:"0.75rem",
                }}>← Volver</button>
                <p style={{textAlign:"center",fontSize:"0.85rem",color:"#9c4dcc",marginBottom:"0.75rem"}}>
                  {albumView.emoji} {albumView.name}
                </p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {albumView.photos.map((url,i)=>(
                    <div key={i} style={{aspectRatio:"1",borderRadius:"1rem",overflow:"hidden",
                      background:"#fce4ec",border:"2px solid #f8bbd0",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <img src={url} alt={`foto ${i+1}`}
                        style={{width:"100%",height:"100%",objectFit:"cover"}}
                        onError={e=>{e.target.style.display="none";}}/>
                    </div>
                  ))}
                </div>
              </>)}
            </>)}

            {/* ── ABRAZOS ── */}
            {modal==="abrazos" && (<>
              <div style={{
                background:"linear-gradient(135deg,#fce4ec,#f8bbd0,#f3e5f5)",
                borderRadius:"2rem", padding:"1.8rem 1.2rem",
                textAlign:"center", fontSize:"1.05rem", color:"#9c4dcc",
                minHeight:110, display:"flex", alignItems:"center", justifyContent:"center",
                marginBottom:"1rem", boxShadow:"0 4px 20px rgba(244,143,177,0.2)",
                lineHeight:1.6, fontStyle:"italic",
              }}>
                {HUGS[hugIdx]}
              </div>
              <Btn onClick={()=>setHugIdx(Math.floor(Math.random()*HUGS.length))} color="#f06292">
                💌 Otro abrazo
              </Btn>
            </>)}

            {/* ── INVERNADERO ── */}
            {modal==="invernadero" && (<>
              <input value={mood.feel} onChange={e=>setMood({...mood,feel:e.target.value})}
                placeholder="¿Cómo te sientes hoy? 🌱" style={inp("#81c784")}/>
              <input value={mood.help} onChange={e=>setMood({...mood,help:e.target.value})}
                placeholder="¿Qué ayudaría a mejorar tu día? ✨" style={inp("#81c784")}/>
              <div style={{
                background:"rgba(255,255,255,0.7)", borderRadius:"1.5rem",
                padding:"0.75rem 1rem", marginBottom:"0.5rem",
                border:"2px solid #a5d6a744",
              }}>
                <label style={{fontSize:"0.82rem",color:"#558b2f",display:"block",marginBottom:8}}>
                  Nivel de ánimo: <strong>{mood.score}/10</strong>{" "}
                  {mood.score>=8?"🌟":mood.score>=6?"😊":mood.score>=4?"😐":"😔"}
                </label>
                <input type="range" min="1" max="10" step="1" value={mood.score}
                  onChange={e=>setMood({...mood,score:+e.target.value})}
                  style={{width:"100%",accentColor:"#81c784"}}/>
              </div>
              <Btn onClick={saveMood} color="#66bb6a">🌿 Guardar check-in</Btn>
              {moodHistory.length>0 && (
                <div style={{marginTop:"1rem",background:"rgba(255,255,255,0.65)",borderRadius:"1.5rem",padding:"0.75rem"}}>
                  <p style={{textAlign:"center",fontSize:"0.75rem",color:"#81c784",margin:"0 0 0.5rem"}}>Historial de ánimo 📊</p>
                  <MoodChart data={[...moodHistory].reverse().slice(0,10)}/>
                </div>
              )}
            </>)}

            {/* ── CAFÉ ── */}
            {modal==="cafe" && (<>
              <p style={{textAlign:"center",fontSize:"0.85rem",color:"#ef6c00",marginBottom:"1rem"}}>
                Tu rincón lo-fi para respirar 🎶
              </p>
              <div style={{borderRadius:"1.5rem",overflow:"hidden",boxShadow:"0 4px 20px rgba(255,183,77,0.3)"}}>
                <iframe
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0"
                  width="100%" height="152" frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"/>
              </div>
              <p style={{textAlign:"center",fontSize:"0.75rem",color:"#ffb74d",marginTop:"0.75rem"}}>
                Respira profundo. Este momento es tuyo. ☕
              </p>
            </>)}

            {/* ── OBSERVATORIO ── */}
            {modal==="observatorio" && (<>
              <p style={{textAlign:"center",fontSize:"0.85rem",color:"#7c4dff",marginBottom:"1rem",lineHeight:1.6}}>
                Escribe lo que quieres soltar y el universo lo recibirá 🌠
              </p>
              <div style={{position:"relative",minHeight:60,marginBottom:"0.25rem"}}>
                {star && <StarAnim text={star} onDone={()=>setStar(null)}/>}
              </div>
              <input value={obsText} onChange={e=>setObsText(e.target.value)}
                placeholder="¿Qué pensamiento quieres soltar hoy? 🌠"
                style={inp("#9575cd")}/>
              <Btn onClick={launchStar} color="#7c4dff">🌠 Lanzar al universo</Btn>
              <div style={{textAlign:"center",fontSize:"0.75rem",color:"#b39ddb",marginTop:"0.75rem"}}>
                El universo recibe todo con amor 💫
              </div>
            </>)}

          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;font-family:'Varela Round',sans-serif;}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes bubblePop{0%{transform:translateX(-50%) scale(0.4);opacity:0}70%{transform:translateX(-50%) scale(1.06)}100%{transform:translateX(-50%) scale(1);opacity:1}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#f48fb1;border-radius:4px}
        input[type=range]::-webkit-slider-thumb{cursor:pointer}
      `}</style>
    </div>
  );
}