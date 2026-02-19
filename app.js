import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyC3PzfKBSKGVnYjfwaeKxEMA-JJrmhNScw",
  authDomain: "atk-drone-service-portal.firebaseapp.com",
  projectId: "atk-drone-service-portal"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= DOM ================= */
const ticketId = document.getElementById("ticketId");
const nameEl   = document.getElementById("name");
const phoneEl  = document.getElementById("phone");
const modelEl  = document.getElementById("model");
const problemEl= document.getElementById("problem");
const dateEl   = document.getElementById("date");
const statusEl = document.getElementById("status");
const userEmailBox = document.getElementById("userEmail");

let currentUserEmail = "";

/* ================= USER SHORT NAME ================= */
function getShortUser(email){
  if(!email) return "";
  return email.split("@")[0];   // lakz@atk.com → lakz
}

/* ================= AUTH ================= */
onAuthStateChanged(auth,user=>{
  if(!user) window.location="index.html";
  else{
    currentUserEmail=user.email;
    userEmailBox.innerText="Logged in: "+user.email;
    showCurrentTicket();
  }
});

document.getElementById("logoutBtn").onclick=()=>{
  signOut(auth).then(()=>window.location="index.html");
};

/* ================= TICKET SYSTEM (FROM TICKETS ONLY) ================= */

async function getHighestTicket(){
  const snap = await getDocs(collection(db,"tickets"));
  let max = 25280;

  snap.forEach(d=>{
    const v = d.data().ticket;
    if(v && v.startsWith("ATK")){
      const n = parseInt(v.replace("ATK",""));
      if(n > max) max = n;
    }
  });
  return max;
}

async function showCurrentTicket(){
  const max = await getHighestTicket();
  ticketId.value = "ATK" + (max + 1);
}

async function generateTicket(){
  const max = await getHighestTicket();
  return "ATK" + (max + 1);
}

/* ================= RC & ACCESSORIES ================= */

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

let selectedRC="";
let selectedAcc=[];

function makeTag(name,color,click){
  const t=document.createElement("div");
  t.className="tag";
  t.style.background=color;
  t.innerText=name;
  t.onclick=click;
  return t;
}

/* RC */
const rcOptions=document.getElementById("rcOptions");
rcList.forEach(r=>{
  rcOptions.appendChild(makeTag(r[0],r[1],()=>{
    selectedRC=r[0];
    document.getElementById("rcSelected").innerHTML="";
    document.getElementById("rcSelected").appendChild(
      makeTag(r[0],r[1],()=>{selectedRC="";document.getElementById("rcSelected").innerHTML="";})
    );
    rcOptions.style.display="none";
  }));
});
window.toggleRC=()=>rcOptions.style.display=rcOptions.style.display=="flex"?"none":"flex";

/* ACC */
const accOptions=document.getElementById("accOptions");
accList.forEach(a=>{
  accOptions.appendChild(makeTag(a[0],a[1],()=>{
    if(!selectedAcc.includes(a[0])){
      selectedAcc.push(a[0]);
      renderAcc();
    }
  }));
});
function renderAcc(){
  const box=document.getElementById("accSelected");
  box.innerHTML="";
  selectedAcc.forEach(a=>{
    const color=accList.find(x=>x[0]==a)[1];
    box.appendChild(makeTag(a,color,()=>{selectedAcc=selectedAcc.filter(x=>x!=a);renderAcc();}));
  });
}
window.toggleACC=()=>accOptions.style.display=accOptions.style.display=="flex"?"none":"flex";

/* ================= SAVE ================= */
document.getElementById("saveBtn").onclick=async()=>{
  if(!nameEl.value||!phoneEl.value||!modelEl.value||!problemEl.value||!dateEl.value||!selectedRC){
    alert("Fill all fields");
    return;
  }

  const newTicket = await generateTicket();

  await addDoc(collection(db,"tickets"),{
    ticket:newTicket,
    name:nameEl.value,
    phone:phoneEl.value,
    model:modelEl.value,
    rc:selectedRC,
    acc:selectedAcc.join(", "),
    problem:problemEl.value,
    date:dateEl.value,
    status:statusEl.value,
    user: getShortUser(currentUserEmail)   // ✅ only short name stored
  });

  alert("Saved "+newTicket);

  nameEl.value=phoneEl.value=modelEl.value=problemEl.value=dateEl.value="";
  selectedRC=""; selectedAcc=[];
  document.getElementById("rcSelected").innerHTML="";
  renderAcc();

  showCurrentTicket();
};

/* ================= SEARCH ================= */
search.addEventListener("input",async()=>{
  const q=search.value.toLowerCase();
  results.innerHTML="";
  recordsTable.style.display="none";
  if(q==="") return;

  const snap=await getDocs(collection(db,"tickets"));
  snap.forEach(d=>{
    const t=d.data();
    if(t.ticket.toLowerCase().includes(q)||t.name.toLowerCase().includes(q)||t.phone.includes(q)||t.date.includes(q)){
      recordsTable.style.display="table";
      results.innerHTML+=`
      <tr>
      <td>${t.date}</td>
      <td>${t.ticket}</td>
      <td>${t.name}</td>
      <td>${t.model}</td>
      <td>${t.rc}</td>
      <td>${t.acc}</td>
      <td>${t.problem}</td>
      <td>${t.phone}</td>
      <td>${t.status}</td>
      <td>${t.user}</td>
      </tr>`;
    }
  });
});
