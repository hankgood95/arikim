/* ===== 스토리지 헬퍼 ===== */
const CAT_KEYS = ['broadcast', 'cute', 'school', 'daily'];
const sections = ['home', 'write', 'categoryView'];
let currentCategory = null;

const getKey = cat => 'posts_'+cat;
const safeParse = (j,f=[]) => { try{const v=JSON.parse(j); return Array.isArray(v)?v:f;}catch{return f;} };
const getPosts = cat => safeParse(localStorage.getItem(getKey(cat)),[]);
const setPosts = (cat,arr) => localStorage.setItem(getKey(cat), JSON.stringify(arr||[]));

function ensureIds(cat) {
  const arr = getPosts(cat);
  let changed = false;
  arr.forEach(p => {
    if(!p.id) { p.id='p_'+Date.now().toString(36)+Math.random().toString(36).slice(2,8); changed=true; }
    if(typeof p.likeCount !== 'number') { p.likeCount = p.likeCount?Number(p.likeCount):0; changed=true; }
    if(typeof p.liked !== 'boolean') { p.liked=false; changed=true; }
    if(typeof p.pinned !== 'boolean') { p.pinned=!!p.pinned; changed=true; }
    if(!Array.isArray(p.comments)) { p.comments=[]; changed=true; }
  });
  if(changed) setPosts(cat,arr);
  return arr;
}

CAT_KEYS.forEach(k => ensureIds(k));

/* ===== 라우팅 ===== */
function showSection(n) {
  sections.forEach(s => document.getElementById(s).style.display='none');
  document.getElementById(n).style.display='block';
  if(n === 'home') renderHome();
}

/* ===== 다크 모드 ===== */
function toggleDark() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// 다크모드 초기화
if(localStorage.getItem('darkMode')==='true') document.body.classList.add('dark');