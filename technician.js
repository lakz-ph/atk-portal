import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* ============ FIREBASE ============ */
const firebaseConfig = {
  apiKey: "AIzaSyC3PzfKBSKGVnYjfwaeKxEMA-JJrmhNScw",
  authDomain: "atk-drone-service-portal.firebaseapp.com",
  projectId: "atk-drone-service-portal"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentTech = "";
let showOriginal = {};
let rcOpen = false;
let accOpen = false;
let activeId = "";

onAuthStateChanged(auth,u=>{
  if(!u) window.location="index.html";
  else currentTech = u.email.split("@")[0];
});

/* ===== Lists ===== */
const rcList=[
 ["DJI RC N1","#f44336"],["DJI RC N2","#ff9800"],["DJI RC N3","#4caf50"],
 ["DJI RC","#2196f3"],["DJI RC2","#9c27b0"],["DJI RC PRO","#ff5722"],
 ["DJI RC PRO2","#ffc107"],["DJI SMART RC","#4caf50"],["DJI RC 3","#2196f3"]
];

const accList=[
 ["1 Battery","#f44336"],["2 Battery","#ff9800"],["3 Battery with Hub","#4caf50"],
 ["Gimbal Cap","#2196f3"],["Prop Guard","#9c27b0"],["Bag","#ff5722"],
 ["Box","#ffc107"],["Inbuild 4 Prop","#4caf50"],["Memory Card","#2196f3"],
 ["ND Filter","#9c27b0"],["C to C Cable","#ff5722"],["C to Lightning Cable","#ffc107"],["Charger","#4caf50"]
];

window.toggleOrig=f=>{ showOriginal[f]=!showOriginal[f]; search.dispatchEvent(new Event("input")); };

/* ===== Helpers ===== */
function colorFor(name,list){
  const f=list.find(x=>x[0]===name);
  return f?f[1]:"#555";
}
function renderTags(text,list){
  if(!text) return "";
  return text.split(", ").map(t=>
    `<span class="tag" style="background:${colorFor(t,list)}">${t}</span>`
  ).join("");
}

/* ===== Quick Search ===== */
window.quickSearch = function(val){
  if(!val) return;
  search.value = val;
  search.dispatchEvent(new Event("input"));
};

/* ===== Search & Render ===== */
search.addEventListener("input", async ()=>{
  const q = search.value.toLowerCase();
  results.innerHTML="";

  const snap = await getDocs(collection(db,"tickets"));
  snap.forEach(d=>{
    const t = d.data();

    if(
      (t.ticket && t.ticket.toLowerCase().includes(q)) ||
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.phone && t.phone.includes(q))
    ){
      results.innerHTML += `
      <tr>
        <td>${t.date||""}</td>

        <td>
          <span style="cursor:pointer;color:#4fc3f7"
            onclick="quickSearch('${t.ticket}')">
            ${t.ticket}
          </span>
        </td>

        <td><input value="${t.name||""}" onchange="upd('${d.id}','name',this.value,'${t.name||""}')"></td>
        <td><input value="${t.model||""}" onchange="upd('${d.id}','model',this.value,'${t.model||""}')"></td>

        <td onclick="openRC('${d.id}','${t.rc||""}')">
          <div class="tagBox">${renderTags(t.rc,rcList) || '<span class="tag" style="background:#555">Select RC</span>'}</div>
        </td>

        <td onclick="openACC('${d.id}','${t.acc||""}')">
          <div class="tagBox">${renderTags(t.acc,accList) || '<span class="tag" style="background:#555">Select Accessories</span>'}</div>
        </td>

        <td>
          <textarea class="problemBox"
            onchange="upd('${d.id}','problem',this.value,'${t.problem||""}')"
          >${t.problem||""}</textarea>
        </td>

        <td>
          <input value="${t.phone||""}"
            onchange="upd('${d.id}','phone',this.value,'${t.phone||""}')"
            onfocus="quickSearch('${t.phone||""}')">
        </td>

        <td>${t.status||""}</td>
        <td>${t.user||""}</td>
      </tr>`;
    }
  });
});

/* ===== Save ===== */
window.upd = async(id,f,v,o)=>{
  const r = doc(db,"tickets",id);
  await updateDoc(r,{
    [f]:v,
    [f+"_orig"]:o,
    [f+"_by"]:currentTech,
    [f+"_time"]:new Date().toLocaleString()
  });
};

/* ===== Tag builder ===== */
function makeTag(n,c,active,cb){
  const d=document.createElement("div");
  d.className="tag";
  d.style.background=c;
  d.style.opacity=active?"1":"0.5";
  d.innerText=n;
  d.onclick=cb;
  return d;
}

/* ===== RC Panel ===== */
window.openRC=(id,current)=>{
  if(rcOpen && activeId===id){ rcPanel.innerHTML=""; rcOpen=false; return; }
  rcOpen=true; accOpen=false; activeId=id; accPanel.innerHTML=""; rcPanel.innerHTML="";
  rcList.forEach(r=>{
    const active=current===r[0];
    rcPanel.appendChild(makeTag(r[0],r[1],active,()=>{
      upd(id,"rc",active?"":r[0],current);
      openRC(id,active?"":r[0]);
    }));
  });
};

/* ===== Accessories Panel ===== */
window.openACC=(id,current)=>{
  if(accOpen && activeId===id){ accPanel.innerHTML=""; accOpen=false; return; }
  accOpen=true; rcOpen=false; activeId=id; rcPanel.innerHTML=""; accPanel.innerHTML="";
  let sel=current?current.split(", "):[];
  accList.forEach(a=>{
    const active=sel.includes(a[0]);
    accPanel.appendChild(makeTag(a[0],a[1],active,()=>{
      if(active) sel=sel.filter(x=>x!==a[0]);
      else sel.push(a[0]);
      upd(id,"acc",sel.join(", "),current);
      openACC(id,sel.join(", "));
    }));
  });
};
