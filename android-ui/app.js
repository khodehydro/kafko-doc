/* ==========================================================================
   Kafko — home screen
   content model · rendering · interaction state
   ========================================================================== */

/* ------------------------------------------------------------------ data -- */

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

const LANG_NAME = Object.fromEntries(LANGUAGES.map(l => [l.code, l.label]));

const ARTISTS = [
  { name: 'BTS',        lang: 'ko', art: 3, fresh: true  },
  { name: 'Ed Sheeran', lang: 'en', art: 1, fresh: true  },
  { name: 'Bad Bunny',  lang: 'es', art: 4, fresh: true  },
  { name: 'Tarkan',     lang: 'tr', art: 7, fresh: true  },
  { name: 'Adele',      lang: 'en', art: 2, fresh: false },
  { name: 'IU',         lang: 'ko', art: 5, fresh: true  },
  { name: 'Stromae',    lang: 'fr', art: 6, fresh: false },
  { name: 'Karol G',    lang: 'es', art: 8, fresh: true  },
];

/* level = CEFR target, phrases = lyric lines split for study,
   progress = share of the song already learned (0–1, null = not started) */
const SONGS = [
  { id: 's1',  title: 'Dynamite',            artist: 'BTS',           lang: 'ko', access: 'free',    art: 1,  level: 'A2', phrases: 38, progress: 0.62 },
  { id: 's2',  title: 'Shape of You',        artist: 'Ed Sheeran',    lang: 'en', access: 'free',    art: 2,  level: 'A2', phrases: 42, progress: null },
  { id: 's3',  title: 'Tití Me Preguntó',    artist: 'Bad Bunny',     lang: 'es', access: 'premium', art: 3,  level: 'B1', phrases: 55, progress: 0.18 },
  { id: 's4',  title: 'Şımarık',             artist: 'Tarkan',        lang: 'tr', access: 'free',    art: 4,  level: 'A1', phrases: 26, progress: null },
  { id: 's5',  title: 'Rolling in the Deep', artist: 'Adele',         lang: 'en', access: 'premium', art: 5,  level: 'B2', phrases: 61, progress: 0.35 },
  { id: 's6',  title: 'Eight',               artist: 'IU',            lang: 'ko', access: 'free',    art: 6,  level: 'A2', phrases: 34, progress: null },
  { id: 's7',  title: 'Alors on danse',      artist: 'Stromae',       lang: 'fr', access: 'premium', art: 7,  level: 'B1', phrases: 47, progress: 0.08 },
  { id: 's8',  title: 'PROVENZA',            artist: 'Karol G',       lang: 'es', access: 'free',    art: 8,  level: 'A2', phrases: 39, progress: null },
  { id: 's9',  title: 'Yalnız Çiçek',        artist: 'Emre Aydın',    lang: 'tr', access: 'free',    art: 9,  level: 'A2', phrases: 31, progress: null },
  { id: 's10', title: '99 Luftballons',      artist: 'Nena',          lang: 'de', access: 'free',    art: 10, level: 'B1', phrases: 44, progress: null },
  { id: 's11', title: 'Lemon',               artist: 'Kenshi Yonezu', lang: 'jp', access: 'premium', art: 11, level: 'B2', phrases: 58, progress: null },
  { id: 's12', title: "L'italiano",          artist: 'Toto Cutugno',  lang: 'it', access: 'free',    art: 12, level: 'A2', phrases: 36, progress: null },
];

/* --------------------------------------------------------------- helpers -- */

const $ = sel => document.querySelector(sel);

/* app language code → flag artwork (UK flag stands for English) */
const FLAG = { ko: 'kr', en: 'gb', es: 'es', tr: 'tr', fr: 'fr', de: 'de', jp: 'jp', it: 'it', br: 'br' };

const cover    = n => `assets/covers/tile-${n}.jpg`;
const portrait = n => `assets/artists/art-${n}.jpg`;
const flag     = c => `assets/flags/${FLAG[c] || c}.svg`;

const svgGlobe  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2"/><path d="M12 3.4c2.3 2.4 3.4 5.4 3.4 8.6s-1.1 6.2-3.4 8.6c-2.3-2.4-3.4-5.4-3.4-8.6S9.7 5.8 12 3.4z"/></svg>`;
const svgGrid   = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3.6" y="3.6" width="7.4" height="7.4" rx="2.4"/><rect x="13" y="3.6" width="7.4" height="7.4" rx="2.4"/><rect x="3.6" y="13" width="7.4" height="7.4" rx="2.4"/><rect x="13" y="13" width="7.4" height="7.4" rx="2.4"/></svg>`;
const svgPlay   = `<svg class="i-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.6 5.6a1 1 0 0 1 1.52-.85l8.6 5.55a1.1 1.1 0 0 1 0 1.83l-8.6 5.55a1 1 0 0 1-1.52-.85z"/></svg>`;
const svgPause  = `<svg class="i-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7.6" y="5.4" width="3.6" height="13.2" rx="1.7"/><rect x="12.8" y="5.4" width="3.6" height="13.2" rx="1.7"/></svg>`;
const svgCrown  = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.6 18.6 2.1 7l5.1 3.3L12 4l4.8 6.3L21.9 7l-1.5 11.6z"/></svg>`;
const svgMuted  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15v-2.6a8 8 0 0 1 16 0V15"/><rect x="2.6" y="14.4" width="4.4" height="6.4" rx="2"/><rect x="17" y="14.4" width="4.4" height="6.4" rx="2"/></svg>`;

/* -------------------------------------------------------------- rendering -- */

function renderStories() {
  $('#storyTrack').innerHTML = ARTISTS.map(a => `
    <button class="story" type="button" data-name="${a.name}">
      <span class="story__ring${a.fresh ? ' is-fresh' : ''}">
        <span class="story__avatar"><img src="${portrait(a.art)}" alt="" width="58" height="58" draggable="false" loading="lazy"></span>
        <span class="story__flag"><img src="${flag(a.lang)}" alt="" width="19" height="19" loading="lazy"></span>
      </span>
      <span class="story__name">${a.name}</span>
    </button>
  `).join('') + `
    <button class="story story--all" type="button" id="seeAllBtn">
      <span class="story__ring"><span class="story__avatar">${svgGrid}</span></span>
      <span class="story__name">See all</span>
    </button>
  `;
}

function renderFilters() {
  $('#filters').innerHTML = LANGUAGES.map((l, i) => `
    <button class="chip${l.code === 'all' ? ' chip--all is-active' : ''}" type="button"
            role="tab" aria-selected="${l.code === 'all'}" data-lang="${l.code}"
            style="animation: rise .5s var(--ease-out) both; animation-delay: ${60 + i * 24}ms">
      <span class="chip__circle">
        ${l.code === 'all' ? svgGlobe : `<img src="${flag(l.code)}" alt="" width="46" height="46" draggable="false" loading="lazy">`}
      </span>
      <span class="chip__name">${l.label}</span>
    </button>
  `).join('');
}

/* the hero always shows the most advanced unfinished song of the active filter */
function renderHero(lang = 'all') {
  const hero = $('#hero');
  const pool = (lang === 'all' ? SONGS : SONGS.filter(s => s.lang === lang))
    .filter(s => s.progress)
    .sort((a, b) => b.progress - a.progress);

  const song = pool[0];
  if (!song) {
    hero.classList.add('is-hidden');
    hero.dataset.song = '';
    return;
  }

  const learned = Math.round(song.progress * song.phrases);
  hero.dataset.song = song.id;
  hero.classList.remove('is-hidden');
  hero.classList.toggle('is-playing', playingId === song.id);

  hero.innerHTML = `
    <span class="hero__glow" aria-hidden="true"></span>

    <div class="hero__top">
      <span class="hero__eyebrow">Continue learning</span>
      <span class="hero__count">${learned} / ${song.phrases} phrases</span>
    </div>

    <div class="hero__row" data-open="${song.id}">
      <span class="hero__art">
        <img src="${cover(song.art)}" alt="" width="54" height="54" draggable="false">
        <span class="hero__flag"><img src="${flag(song.lang)}" alt="" width="20" height="20"></span>
      </span>
      <span class="hero__info">
        <span class="hero__title">${song.title}</span>
        <span class="hero__sub">${song.artist} · ${song.level} · ${LANG_NAME[song.lang]}</span>
      </span>
      <button class="hero__play" type="button" data-play="${song.id}"
              aria-label="${playingId === song.id ? 'Pause' : 'Continue'} ${song.title}">
        ${svgPlay}${svgPause}
      </button>
    </div>

    <span class="hero__bar"><i style="width:${Math.round(song.progress * 100)}%"></i></span>
  `;
}

const songRow = (s, i) => `
  <li class="song${s.progress ? ' song--progress' : ''}" data-id="${s.id}" style="--i:${i}">
    <button class="song__row" type="button" aria-label="${s.title} by ${s.artist}">
      <span class="cover">
        <img src="${cover(s.art)}" alt="" width="56" height="56" draggable="false" loading="lazy">
        <span class="cover__flag"><img src="${flag(s.lang)}" alt="" width="21" height="21" loading="lazy"></span>
      </span>

      <span class="song__body">
        <span class="song__title">${s.title}</span>
        <span class="song__artist">${s.artist}</span>
        <span class="song__meta">
          <span class="tag tag--level">${s.level}</span>
          <span class="song__phrases">${s.phrases} phrases</span>
          <span class="tag ${s.access === 'free' ? 'tag--free' : 'tag--pro'}">
            ${s.access === 'free' ? 'Free' : `${svgCrown}Premium`}
          </span>
        </span>
        ${s.progress ? `<span class="song__progress" aria-hidden="true"><i style="width:${Math.round(s.progress * 100)}%"></i></span>` : ''}
      </span>

      <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="play">${svgPlay}${svgPause}</span>
    </button>
  </li>`;

function renderSongs(lang = 'all') {
  const list = lang === 'all' ? SONGS : SONGS.filter(s => s.lang === lang);

  $('#songList').innerHTML = list.length
    ? list.map(songRow).join('')
    : `<li class="songs__empty"><span>${svgMuted}</span>No songs in this language yet.</li>`;

  $('#songsTitle').textContent = lang === 'all' ? 'All songs' : `${LANG_NAME[lang]} songs`;
  $('#songsCount').textContent = `${list.length}`;
  $('#resetFilter').hidden = lang === 'all';

  /* keep playback state honest when the list changes */
  if (playingId && !list.some(s => s.id === playingId)) {
    playingId = null;
    $('#hero')?.classList.remove('is-playing');
  } else if (playingId) {
    $(`.song[data-id="${playingId}"]`)?.classList.add('is-playing');
  }
}

/* ----------------------------------------------------------- interaction -- */

let playingId = null;

function setPlaying(id) {
  playingId = playingId === id ? null : id;

  document.querySelectorAll('.song').forEach(el =>
    el.classList.toggle('is-playing', el.dataset.id === playingId));

  const hero = $('#hero');
  if (hero) hero.classList.toggle('is-playing', hero.dataset.song === playingId && !!playingId);

  if (playingId) {
    const song = SONGS.find(s => s.id === playingId);
    toast(`Now playing · ${song.title}`);
  }
}

function setLanguage(code) {
  document.querySelectorAll('.chip').forEach(chip => {
    const on = chip.dataset.lang === code;
    chip.classList.toggle('is-active', on);
    chip.setAttribute('aria-selected', on);
  });

  renderSongs(code);
  renderHero(code);
  $('#scroll').scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleStories() {
  const track = $('#storyTrack');
  const btn   = $('#seeAllBtn');
  const label = btn.querySelector('.story__name');

  if (!track.classList.contains('is-expanded')) {
    track.style.height = track.scrollHeight + 'px';
    track.classList.add('is-expanded');
    requestAnimationFrame(() => { track.style.height = track.scrollHeight + 'px'; });
    label.textContent = 'Show less';
    btn.classList.add('is-active');
  } else {
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
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2000);
}

/* -------------------------------------------------------------- dock pill -- */

function movePill(btn, animate = true) {
  const pill = $('#dockPill');
  const dock = $('#dock');
  const dockBox = dock.getBoundingClientRect();
  const box = btn.getBoundingClientRect();

  if (!animate) dock.classList.remove('dock--ready');
  pill.style.width = box.width + 'px';
  pill.style.transform = `translateX(${box.left - dockBox.left}px)`;
  if (!animate) void pill.offsetWidth;
  dock.classList.add('dock--ready');
}

/* ------------------------------------------------------- layout observers -- */

const scroll = $('#scroll');
const appbar = $('#appbar');

/* the sticky filter strip must sit exactly under the (shrinking) app bar */
new ResizeObserver(() => {
  scroll.style.setProperty('--sticky-top', appbar.offsetHeight + 'px');
}).observe(appbar);

let compact = false;
function syncScrollState() {
  const y = scroll.scrollTop;
  scroll.classList.toggle('is-scrolled', y > 6);

  if (!compact && y > 78) { compact = true;  scroll.classList.add('is-compact'); }
  else if (compact && y < 42) { compact = false; scroll.classList.remove('is-compact'); }
}

scroll.addEventListener('scroll', syncScrollState, { passive: true });

/* ------------------------------------------------------------- bootstrap -- */

renderStories();
renderFilters();
renderSongs();
renderHero();

scroll.style.setProperty('--sticky-top', appbar.offsetHeight + 'px');
movePill($('.dock__item.is-active'), false);
syncScrollState();

if (document.fonts) document.fonts.ready.then(() => {
  scroll.style.setProperty('--sticky-top', appbar.offsetHeight + 'px');
  movePill($('.dock__item.is-active'), false);
});
window.addEventListener('resize', () => movePill($('.dock__item.is-active'), false));

/* app bar */
$('#searchBtn').addEventListener('click', () => toast('Search — coming soon'));

/* dock */
$('#dock').addEventListener('click', e => {
  const item = e.target.closest('.dock__item');
  if (!item || item.classList.contains('is-active')) return;

  document.querySelectorAll('.dock__item').forEach(btn => {
    btn.classList.remove('is-active');
    btn.removeAttribute('aria-current');
  });
  item.classList.add('is-active');
  item.setAttribute('aria-current', 'page');
  movePill(item);

  const tab = item.dataset.tab;
  if (tab === 'leitner') toast(`Leitner · ${$('#dueBadge').textContent} cards due`);
  else if (tab === 'profile') toast('Profile — coming soon');
});

/* language filters */
$('#filters').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (chip) setLanguage(chip.dataset.lang);
});
$('#resetFilter').addEventListener('click', () => setLanguage('all'));

/* song list */
$('#songList').addEventListener('click', e => {
  const card = e.target.closest('.song');
  if (card) setPlaying(card.dataset.id);
});

/* hero */
$('#hero').addEventListener('click', e => {
  const play = e.target.closest('.hero__play');
  if (play) return setPlaying(play.dataset.play);

  const row = e.target.closest('[data-open]');
  if (row) {
    const song = SONGS.find(s => s.id === row.dataset.open);
    toast(`Opening ${song.title} · ${song.artist}`);
  }
});

/* artists */
$('#storyTrack').addEventListener('click', e => {
  if (e.target.closest('#seeAllBtn')) return toggleStories();

  const story = e.target.closest('.story');
  if (!story) return;

  document.querySelectorAll('.story.is-active').forEach(el => el.classList.remove('is-active'));
  story.classList.add('is-active');
  story.querySelector('.story__ring')?.classList.remove('is-fresh');
  toast(`Loading songs by ${story.dataset.name}`);
});
