let currentCategory = null;
let posts = [];
let currentIndex = null;

function showCategory(cat) {
  currentCategory = cat;
  localStorage.setItem('lastCategory', cat);
  document.getElementById('categoryTitle').textContent =
    cat === 'broadcast' ? '🎤 방송부 이야기' :
    cat === 'cute' ? '🐾 귀여운 것들' :
    cat === 'school' ? '🏫 학교 생활' : '💭 하루 기록';
  posts = ensureIds(cat);
  renderList();
  document.getElementById('postList').style.display = 'block';
  document.getElementById('viewPost').style.display = 'none';
}

/* ===== 목록/정렬 ===== */
function renderList() {
  const sort = document.getElementById('sortSelect').value;
  let arr = [...posts];
  arr.sort((a,b) => {
    if(sort === 'latest') return new Date(b.date) - new Date(a.date);
    if(sort === 'oldest') return new Date(a.date) - new Date(b.date);
    if(sort === 'likes')  return (b.likeCount||0) - (a.likeCount||0);
    return 0;
  });
  
  const seq = [...arr.filter(p => p.pinned), ...arr.filter(p => !p.pinned)];
  const list = document.getElementById('postList');
  
  if(!seq.length) {
    list.innerHTML = '<p>아직 글이 없어요 🐷</p>';
    return;
  }
  
  list.innerHTML = seq.map(p => {
    const i = posts.indexOf(p);
    return `<div class="post-item" onclick="openPost(${i})">${p.pinned?'📌 ':''}📅 ${p.date||''} · ${p.title}</div>`;
  }).join('');
}

/* ===== 보기/좋아요/수정/삭제 ===== */
function openPost(i) {
  currentIndex = i;
  const p = posts[i];
  document.getElementById('viewTitle').textContent = p.title;
  document.getElementById('viewDate').textContent = '작성일: '+(p.date||'');
  document.getElementById('viewContent').textContent = p.content||'';
  document.getElementById('viewImage').src = p.image||'';
  document.getElementById('postList').style.display = 'none';
  document.getElementById('viewPost').style.display = 'block';
  updateLikeDisplay();
  renderComments();
}

function backToList() {
  posts = ensureIds(currentCategory);
  document.getElementById('viewPost').style.display = 'none';
  document.getElementById('postList').style.display = 'block';
  renderList();
}

function requestDelete() {
  if(!confirm('이 글을 삭제할까요?')) return;
  posts.splice(currentIndex,1);
  setPosts(currentCategory,posts);
  alert('삭제 완료 🗑️');
  backToList();
}

function requestEdit() {
  openEditPopup();
}

function openEditPopup() {
  const p = posts[currentIndex];
  document.getElementById('editTitle').value = p.title;
  document.getElementById('editContent').value = p.content;
  document.getElementById('editPin').checked = !!p.pinned;
  document.getElementById('editPreview').src = p.image||'';
  document.getElementById('popup').style.display = 'flex';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

document.getElementById('editImageInput').addEventListener('change', function() {
  const f = this.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = e => document.getElementById('editPreview').src = e.target.result;
  r.readAsDataURL(f);
});

function saveEdit() {
  const t = document.getElementById('editTitle').value.trim();
  const c = document.getElementById('editContent').value.trim();
  const i = document.getElementById('editPreview').src;
  const pin = document.getElementById('editPin').checked;
  const old = posts[currentIndex];
  posts[currentIndex] = {...old, title:t||old.title, content:c, image:i, pinned:pin};
  setPosts(currentCategory,posts);
  alert('수정 완료 💛');
  closePopup();
  openPost(currentIndex);
}

function toggleLike() {
  const p = posts[currentIndex];
  p.liked = !p.liked;
  p.likeCount = (p.likeCount||0) + (p.liked?1:-1);
  if(p.likeCount < 0) p.likeCount = 0;
  setPosts(currentCategory,posts);
  updateLikeDisplay();
}

function updateLikeDisplay() {
  const p = posts[currentIndex];
  document.getElementById('likeCount').textContent = p.likeCount||0;
  document.getElementById('likeBtn').classList.toggle('active', !!p.liked);
}

/* ===== 댓글 ===== */
function addComment() {
  const nameInput = document.getElementById('commentName').value.trim();
  const text = document.getElementById('commentText').value.trim();
  const isAnon = document.getElementById('anonymous').checked;
  
  if(!text) return alert("댓글 내용을 입력하세요");
  
  const name = isAnon ? '익명' : (nameInput || '익명');
  const now = new Date();
  const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  
  const p = posts[currentIndex];
  p.comments = p.comments || [];
  p.comments.push({name, content:text, date:ts});
  setPosts(currentCategory,posts);
  
  document.getElementById('commentName').value = '';
  document.getElementById('commentText').value = '';
  document.getElementById('anonymous').checked = false;
  renderComments();
}

function renderComments() {
  const p = posts[currentIndex];
  const list = document.getElementById('commentList');
  
  if(!p.comments || !p.comments.length) {
    list.innerHTML = '<p class="muted">아직 댓글이 없어요. 첫 댓글의 주인공이 되어줘! 💛</p>';
    return;
  }
  
  list.innerHTML = p.comments.map(c =>
    `<div class="comment">
      <strong>${c.name}</strong>
      <span class="muted">${c.date||''}</span><br>
      ${c.content}
    </div>`
  ).join('');
}

// URL 파라미터에서 카테고리와 ID를 읽어서 초기화
window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const id = params.get('id');
  
  if(cat && CAT_KEYS.includes(cat)) {
    showCategory(cat);
    if(id) {
      const idx = posts.findIndex(p => p.id === id);
      if(idx >= 0) openPost(idx);
    }
  } else {
    const last = localStorage.getItem('lastCategory');
    if(last && CAT_KEYS.includes(last)) showCategory(last);
    else showCategory('daily');
  }
});