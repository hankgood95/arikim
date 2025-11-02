/* ===== 글쓰기 ===== */
document.getElementById('imageInput').addEventListener('change', function() {
  const f = this.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = e => document.getElementById('preview').src = e.target.result;
  r.readAsDataURL(f);
});

function savePost() {
  const catEl = document.getElementById('category');
  const cat = (catEl && catEl.value) ? String(catEl.value) : 'daily';
  const arr = ensureIds(cat);
  const now = new Date();
  const date = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
  
  const newPost = {
    id: 'p_'+Date.now().toString(36)+Math.random().toString(36).slice(2,8),
    title: (document.getElementById('title').value||'제목 없음').trim(),
    content: document.getElementById('content').value,
    image: document.getElementById('preview').src||'',
    date,
    likeCount: 0,
    liked: false,
    pinned: document.getElementById('pinPost').checked,
    comments: []
  };
  
  arr.unshift(newPost);
  setPosts(cat, arr);
  
  document.getElementById('title').value = '';
  document.getElementById('content').value = '';
  document.getElementById('preview').src = '';
  document.getElementById('imageInput').value = '';
  document.getElementById('pinPost').checked = false;
  
  alert('저장 완료 💛');
  location.href = `category.html?cat=${cat}`;
}

/* ===== 이모티콘 ===== */
const emojis = "😀😁😂🤣😅😊😋😍😘😎😇🥰🤩😜😝🙂🙃😉😌😴😪😆😮😲😭😡😺😻🐶🐱🐷🐰🐻🐼🐸🐥🍀🌸🌼🌈🍎🍩🍰☕🍔🍟🎬🎧🎵💌💖💛💙💜💤✨🔥💧⭐🎉".split("");
document.getElementById('emojiGrid').innerHTML = emojis.map(e =>
  `<span style="font-size:24px; cursor:pointer" onclick="insertEmoji('${e}')">${e}</span>`
).join('');

function openEmojiPopup() {
  document.getElementById('emojiPopup').style.display = 'flex';
}

function closeEmojiPopup() {
  document.getElementById('emojiPopup').style.display = 'none';
}

function insertEmoji(e) {
  const c = document.getElementById('content');
  const s = c.selectionStart || c.value.length;
  const d = c.selectionEnd || c.value.length;
  c.value = c.value.slice(0,s) + e + c.value.slice(d);
  c.focus();
  c.selectionStart = c.selectionEnd = s + e.length;
  closeEmojiPopup();
}