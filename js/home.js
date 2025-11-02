/* ===== 홈 렌더 ===== */
function renderHome() {
  renderHomePinned();
  renderHomeGallery();
}

function renderHomePinned() {
  const box = document.getElementById('homePinned');
  let all = [];
  CAT_KEYS.forEach(c => ensureIds(c).forEach(p => all.push({...p,cat:c})));
  const pinned = all.filter(p => p.pinned).slice(0,3);
  
  if(!pinned.length) {
    box.innerHTML = '<p>고정된 글이 없어요 📌</p>';
    return;
  }
  
  box.innerHTML = pinned.map(p =>
    `<div class="item" onclick="openById('${p.cat}','${p.id}')">
      📌 ${p.title} <span style="font-size:12px;color:#888">· ${p.date||''}</span>
    </div>`
  ).join('');
}

function renderHomeGallery() {
  const wrap = document.getElementById('homeGallery');
  wrap.innerHTML = '';
  let all = [];
  CAT_KEYS.forEach(c => ensureIds(c).forEach(p => all.push({...p,cat:c})));
  const withImg = all.filter(p => p.image);
  
  if(!withImg.length) {
    wrap.innerHTML = '<p>아직 사진이 없어요 📷</p>';
    return;
  }
  
  wrap.innerHTML = withImg.map(p =>
    `<div class="tile" onclick="openById('${p.cat}','${p.id}')">
      <img src="${p.image}" alt="${p.title}">
      <div class="cap">${p.title}</div>
    </div>`
  ).join('');
}

function openById(cat, id) {
  location.href = `category.html?cat=${cat}&id=${id}`;
}

// 시작 시 홈 화면 렌더링
window.addEventListener('load', () => {
  renderHome();
});