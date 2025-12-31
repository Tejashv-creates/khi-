// Floating hearts
(function hearts(){
  const svg = document.querySelector('.hearts');
  if(!svg) return;
  const w = window.innerWidth;
  const colors = ['#ff6fa1','#ffd27d','#7f5af0'];
  const count = Math.min(24, Math.max(12, Math.floor(w/80)));
  for(let i=0;i<count;i++){
    const x = Math.random()*w;
    const delay = Math.random()*8;
    const duration = 12 + Math.random()*12;
    const drift = (Math.random()*100-50)+'px';
    const color = colors[Math.floor(Math.random()*colors.length)];
    const el = document.createElementNS('http://www.w3.org/2000/svg','svg');
    el.setAttribute('class','heart');
    el.setAttribute('viewBox','0 0 24 24');
    el.style.left = x+'px';
    el.style.bottom = '-40px';
    el.style.animationDuration = duration+'s';
    el.style.animationDelay = delay+'s';
    el.style.setProperty('--drift', drift);
    el.innerHTML = '<path fill="'+color+'" d="M12 21s-6.716-4.272-9.428-7.548C.328 11.107 1.131 7.6 3.9 6.23c2.359-1.16 4.47.066 5.322 1.64C9.974 6.296 12.012 5 14.1 6.23c2.77 1.37 3.572 4.877 1.328 7.222C18.716 16.728 12 21 12 21z"/>';
    svg.appendChild(el);
  }
})();

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if(revealEls.length){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => obs.observe(el));
}

// Footer year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Music: start on first interaction (autoplay fallback)
const bgMusic = document.getElementById('bgMusic');
if(bgMusic){
  const startMusic = ()=>{ bgMusic.play().catch(()=>{}); document.removeEventListener('click', startMusic); };
  document.addEventListener('click', startMusic, { once:true });
}

// Simple player controls (if present)
const audio = document.getElementById('audioEl');
const playBtn = document.getElementById('playBtn');
const muteBtn = document.getElementById('muteBtn');
const progressBar = document.getElementById('progressBar');
const timeNow = document.getElementById('timeNow');
const timeDur = document.getElementById('timeDur');

function fmtTime(s){
  if(!isFinite(s)) return '0:00';
  const m = Math.floor(s/60), sec = Math.floor(s%60);
  return m + ':' + String(sec).padStart(2,'0');
}
if(audio){
  audio.addEventListener('loadedmetadata', ()=>{ if(timeDur) timeDur.textContent = fmtTime(audio.duration); });
  if(playBtn) playBtn.addEventListener('click', async ()=>{
    if(audio.paused){ await audio.play().catch(()=>{}); playBtn.textContent='Pause'; } else { audio.pause(); playBtn.textContent='Play'; }
  });
  if(muteBtn) muteBtn.addEventListener('click', ()=>{ audio.muted = !audio.muted; muteBtn.textContent = audio.muted ? 'Unmute' : 'Mute'; });
  audio.addEventListener('timeupdate', ()=>{
    const p = (audio.currentTime / audio.duration) * 100;
    if(progressBar) progressBar.style.width = (p || 0) + '%';
    if(timeNow) timeNow.textContent = fmtTime(audio.currentTime);
  });
}
