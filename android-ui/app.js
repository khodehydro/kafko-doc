/* ==========================================================================
   Kafko — home screen prototype
   Stage 01: static mock data + rendering + ui interactions
   ========================================================================== */

/* ---------------------------------------------------------------- data --- */

const LANGUAGES = [
  { code: 'all', label: 'All' },
  { code: 'en',  label: 'English' },
  { code: 'ko',  label: 'Korean' },
  { code: 'es',  label: 'Spanish' },
  { code: 'tr',  label: 'Turkish' },
  { code: 'fr',  label: 'French' },
  { code: 'de',  label: 'German' },
  { code: 'jp',  label: 'Japanese' },
  { code: 'it',  label: 'Italian' },
  { code: 'br',  label: 'Portuguese' },
];

/* cover art = gradient pair + a music emoji (stand-in for real artwork) */
const ARTISTS = [
  { id: 'a1', name: 'BTS',        lang: 'ko', glyph: '🎤', c1: '#B39DDB', c2: '#5E35B1', fresh: true },
  { id: 'a2', name: 'Ed Sheeran', lang: 'en', glyph: '🎸', c1: '#FFAB91', c2: '#E64A19', fresh: true },
  { id: 'a3', name: 'Bad Bunny',  lang: 'es', glyph: '🌴', c1: '#4DD0E1', c2: '#00796B', fresh: true },
  { id: 'a4', name: 'Sezen Aksu', lang: 'tr', glyph: '🎻', c1: '#F48FB1', c2: '#C2185B', fresh: true },
  { id: 'a5', name: 'Adele',      lang: 'en', glyph: '🎹', c1: '#90A4AE', c2: '#37474F', fresh: false },
  { id: 'a6', name: 'IU',         lang: 'ko', glyph: '🌸', c1: '#B2DFDB', c2: '#26A69A', fresh: true },
  { id: 'a7', name: 'Stromae',    lang: 'fr', glyph: '🎷', c1: '#CE93D8', c2: '#7B1FA2', fresh: false },
  { id: 'a8', name: 'Karol G',    lang: 'es', glyph: '🌈', c1: '#FFD54F', c2: '#F57C00', fresh: true },
  { id: 'a9', name: 'Rammstein',  lang: 'de', glyph: '🔥', c1: '#EF9A9A', c2: '#B71C1C', fresh: true },
  { id: 'a10', name: 'Yo-Yo Ma',  lang: 'jp', glyph: '🎼', c1: '#B0BEC5', c2: '#546E7A', fresh: false },
  { id: 'a11', name: 'Laura Pausini', lang: 'it', glyph: '💫', c1: '#FFE082', c2: '#F9A825', fresh: true },
];

const SONGS = [
  { id: 's1', title: 'Dynamite',            artist: 'BTS',        lang: 'ko', access: 'free',      glyph: '🎤', c1: '#B39DDB', c2: '#5E35B1' },
  { id: 's2', title: 'Shape of You',        artist: 'Ed Sheeran', lang: 'en', access: 'free',      glyph: '🎸', c1: '#FFAB91', c2: '#E64A19' },
  { id: 's3', title: 'Tití Me Preguntó',    artist: 'Bad Bunny',  lang: 'es', access: 'premium',   glyph: '🌴', c1: '#4DD0E1', c2: '#00796B' },
  { id: 's4', title: 'Şımarık',             artist: 'Tarkan',     lang: 'tr', access: 'free',      glyph: '🍒', c1: '#FF8A80', c2: '#D32F2F' },
  { id: 's5', title: 'Rolling in the Deep', artist: 'Adele',      lang: 'en', access: 'premium',   glyph: '🎹', c1: '#90A4AE', c2: '#37474F' },
  { id: 's6', title: 'Eight',               artist: 'IU',         lang: 'ko', access: 'free',      glyph: '🌸', c1: '#B2DFDB', c2: '#26A69A' },
  { id: 's7', title: 'Alors on danse',      artist: 'Stromae',    lang: 'fr', access: 'premium',   glyph: '🎷', c1: '#CE93D8', c2: '#7B1FA2' },
  { id: 's8', title: 'PROVENZA',            artist: 'Karol G',    lang: 'es', access: 'free',      glyph: '🌈', c1: '#FFD54F', c2: '#F57C00' },
  { id: 's9', title: 'Yalnız Çiçek',        artist: 'Emre Aydın', lang: 'tr', access: 'free',      glyph: '🌼', c1: '#C5E1A5', c2: '#558B2F' },
  { id: 's10', title: '99 Luftballons',     artist: 'Nena',       lang: 'de', access: 'free',      glyph: '🎈', c1: '#FFCDD2', c2: '#C62828' },
  { id: 's11', title: 'Lemon',              artist: 'Kenshi Yonezu', lang: 'jp', access: 'premium', glyph: '🍋', c1: '#FFF176', c2: '#F9A825' },
  { id: 's12', title: "L'italiano",         artist: 'Toto Cutugno', lang: 'it', access: 'free',    glyph: '🍝', c1: '#A5D6A7', c2: '#2E7D32' },
  { id: 's13', title: 'Garota de Ipanema',  artist: 'João Gilberto', lang: 'br', access: 'premium', glyph: '🌊', c1: '#80DEEA', c2: '#00838F' },
];

const LANG_NAME = Object.fromEntries(LANGUAGES.map(l => [l.code, l.label]));

/* -------------------------------------------------------------- helpers --- */

const $  = (sel, root = document) => root.querySelector(sel);

const flagSvg = code => `<svg class="flag" viewBox="0 0 32 32" aria-hidden="true"><use href="#f-${code}"></use></svg>`;

/* ------------------------------------------------------------- rendering --- */

function renderStories() {
  const track = $('#storyTrack');

  track.innerHTML = ARTISTS.map(a => `
    <button class="story" type="button" data-artist="${a.id}" data-name="${a.name}">
      <span class="story__ring${a.fresh ? ' is-new' : ''}">
        <span class="story__avatar" style="--a:${a.c1};--b:${a.c2}">
          <span class="story__glyph">${a.glyph}</span>
        </span>
        <span class="flag-chip story__flag">${flagSvg(a.lang)}</span>
      </span>
      <span class="story__name">${a.name}</span>
    </button>
  `).join('') + `
    <button class="story story--all" type="button" id="seeAllBtn">
      <span class="story__ring">
        <span class="story__avatar story__avatar--all">
          <svg class="ic" viewBox="0 0 24 24"><use href="#ic-grid"></use></svg>
        </span>
      </span>
      <span class="story__name">See all</span>
    </button>
  `;
}

function renderFilters() {
  $('#filters').innerHTML = LANGUAGES.map(l => `
    <button class="lang${l.code === 'all' ? ' is-active' : ''}" type="button" data-lang="${l.code}">
      <span class="lang__circle${l.code === 'all' ? ' lang__circle--all' : ''}">
        ${l.code === 'all' ? '<svg class="ic" viewBox="0 0 24 24"><use href="#ic-globe"></use></svg>' : flagSvg(l.code)}
      </span>
      <span class="lang__name">${l.label}</span>
    </button>
  `).join('');
}

function songMarkup(s, i) {
  return `
  <li class="song" data-id="${s.id}" data-lang="${s.lang}" style="--i:${i}">
    <button class="song__row" type="button">
      <span class="cover" style="--c1:${s.c1};--c2:${s.c2}">
        <span class="cover__glyph">${s.glyph}</span>
        <span class="flag-chip cover__flag">${flagSvg(s.lang)}</span>
      </span>

      <span class="song__meta">
        <span class="song__title">${s.title}</span>
        <span class="song__artist">${s.artist} · ${LANG_NAME[s.lang]}</span>
      </span>

      <span class="song__tail">
        <span class="badge badge--${s.access === 'free' ? 'free' : 'pro'}">
          ${s.access === 'free' ? '' : '<svg class="ic" viewBox="0 0 24 24"><use href="#ic-crown"></use></svg>'}
          ${s.access === 'free' ? 'Free' : 'Premium'}
        </span>
        <span class="eq"><i></i><i></i><i></i></span>
        <span class="play">
          <svg class="ic ic-play"  viewBox="0 0 24 24"><use href="#ic-play"></use></svg>
          <svg class="ic ic-pause" viewBox="0 0 24 24"><use href="#ic-pause"></use></svg>
        </span>
      </span>
    </button>
  </li>`;
}

function renderSongs(filter = 'all') {
  const list = filter === 'all' ? SONGS : SONGS.filter(s => s.lang === filter);

  $('#songList').innerHTML = list.length
    ? list.map(songMarkup).join('')
    : `<li class="songs__empty">
         <span class="songs__empty-emoji">🎧</span>
         No songs here yet — try another language
       </li>`;

  $('#songsTitle').textContent  = filter === 'all' ? 'All songs' : `${LANG_NAME[filter]} songs`;
  $('#songsCount').textContent  = `${list.length} ${list.length === 1 ? 'song' : 'songs'}`;
  $('#clearFilter').hidden      = filter === 'all';
}

/* ---------------------------------------------------------- interactions --- */

function setLanguageFilter(code) {
  document.querySelectorAll('.lang').forEach(btn =>
    btn.classList.toggle('is-active', btn.dataset.lang === code));

  renderSongs(code);
  $('#app').scrollTo({ top: 0, behavior: 'smooth' });
}

function togglePlay(songEl) {
  const wasPlaying = songEl.classList.contains('is-playing');
  document.querySelectorAll('.song.is-playing').forEach(el => el.classList.remove('is-playing'));

  if (!wasPlaying) {
    songEl.classList.add('is-playing');
    const song = SONGS.find(s => s.id === songEl.dataset.id);
    toast(`♪ ${song.title} — ${song.artist}`);
  }
}

function toggleStories() {
  const track = $('#storyTrack');
  const label = $('#seeAllBtn .story__name');
  const btn   = $('#seeAllBtn');
  const open  = !track.classList.contains('is-expanded');

  if (open) {
    track.style.height = track.scrollHeight + 'px';
    track.classList.add('is-expanded');
    requestAnimationFrame(() => { track.style.height = track.scrollHeight + 'px'; });
    label.textContent = 'Show less';
    btn.classList.add('is-active');
  } else {
    /* measure the collapsed height without animating */
    const expanded = track.scrollHeight;
    track.style.transition = 'none';
    track.classList.remove('is-expanded');
    track.style.height = 'auto';
    const collapsed = track.scrollHeight;
    track.style.height = expanded + 'px';
    void track.offsetHeight;
    track.style.transition = '';
    track.style.height = collapsed + 'px';
    label.textContent = 'See all';
    btn.classList.remove('is-active');
  }

  setTimeout(() => { track.style.height = ''; }, 480);
}

let toastTimer;
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 1900);
}

/* dock ---------------------------------------------------------------- */

function movePill(activeBtn, animate = true) {
  const pill = $('#dockPill');
  const dock = $('#dock');
  const dockBox = dock.getBoundingClientRect();
  const box = activeBtn.getBoundingClientRect();

  if (!animate) dock.classList.remove('dock--ready');
  pill.style.width = box.width + 'px';
  pill.style.transform = `translateX(${box.left - dockBox.left}px)`;
  if (!animate) void pill.offsetWidth;
  dock.classList.add('dock--ready');
}

/* ------------------------------------------------------------- bootstrap --- */

renderStories();
renderFilters();
renderSongs();

const dock = $('#dock');
movePill($('#dock .dock__item.is-active'), false);

dock.addEventListener('click', e => {
  const item = e.target.closest('.dock__item');
  if (!item || item.classList.contains('is-active')) return;

  document.querySelectorAll('#dock .dock__item').forEach(btn => {
    btn.classList.remove('is-active');
    btn.removeAttribute('aria-current');
  });
  item.classList.add('is-active');
  item.setAttribute('aria-current', 'page');
  movePill(item);

  if (item.dataset.tab !== 'home') {
    toast(`${item.querySelector('span').textContent} screen — coming soon`);
  }
});

window.addEventListener('resize', () => movePill($('#dock .dock__item.is-active'), false));

/* languages */
$('#filters').addEventListener('click', e => {
  const btn = e.target.closest('.lang');
  if (btn) setLanguageFilter(btn.dataset.lang);
});

$('#clearFilter').addEventListener('click', () => setLanguageFilter('all'));

/* songs */
$('#songList').addEventListener('click', e => {
  const row = e.target.closest('.song');
  if (row) togglePlay(row);
});

/* stories */
$('#storyTrack').addEventListener('click', e => {
  if (e.target.closest('#seeAllBtn')) return toggleStories();

  const story = e.target.closest('.story');
  if (!story) return;

  document.querySelectorAll('.story.is-active').forEach(s => s.classList.remove('is-active'));
  story.classList.add('is-active');
  story.querySelector('.story__ring')?.classList.remove('is-new');
  toast(`Loading songs by ${story.dataset.name}`);
});
