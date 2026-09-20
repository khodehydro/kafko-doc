/* ==========================================================================
   Kafko — home screen
   Mock content + rendering + interaction layer
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
  { id: 'a1', name: 'BTS',        lang: 'ko', art: 3, fresh: true  },
  { id: 'a2', name: 'Ed Sheeran', lang: 'en', art: 1, fresh: true  },
  { id: 'a3', name: 'Bad Bunny',  lang: 'es', art: 4, fresh: true  },
  { id: 'a4', name: 'Tarkan',     lang: 'tr', art: 7, fresh: true  },
  { id: 'a5', name: 'Adele',      lang: 'en', art: 2, fresh: false },
  { id: 'a6', name: 'IU',         lang: 'ko', art: 5, fresh: true  },
  { id: 'a7', name: 'Stromae',    lang: 'fr', art: 6, fresh: false },
  { id: 'a8', name: 'Karol G',    lang: 'es', art: 8, fresh: true  },
];

const SONGS = [
  { id: 's1',  title: 'Dynamite',            artist: 'BTS',            lang: 'ko', access: 'free', art: 1  },
  { id: 's2',  title: 'Shape of You',        artist: 'Ed Sheeran',     lang: 'en', access: 'free', art: 2  },
  { id: 's3',  title: 'Tití Me Preguntó',    artist: 'Bad Bunny',      lang: 'es', access: 'premium', art: 3  },
  { id: 's4',  title: 'Şımarık',             artist: 'Tarkan',         lang: 'tr', access: 'free', art: 4  },
  { id: 's5',  title: 'Rolling in the Deep', artist: 'Adele',          lang: 'en', access: 'premium', art: 5  },
  { id: 's6',  title: 'Eight',               artist: 'IU',             lang: 'ko', access: 'free', art: 6  },
  { id: 's7',  title: 'Alors on danse',      artist: 'Stromae',        lang: 'fr', access: 'premium', art: 7  },
  { id: 's8',  title: 'PROVENZA',            artist: 'Karol G',        lang: 'es', access: 'free', art: 8  },
  { id: 's9',  title: 'Yalnız Çiçek',        artist: 'Emre Aydın',     lang: 'tr', access: 'free', art: 9  },
  { id: 's10', title: '99 Luftballons',      artist: 'Nena',           lang: 'de', access: 'free', art: 10 },
  { id: 's11', title: 'Lemon',               artist: 'Kenshi Yonezu',  lang: 'jp', access: 'premium', art: 11 },
  { id: 's12', title: "L'italiano",          artist: 'Toto Cutugno',   lang: 'it', access: 'free', art: 12 },
];

/* --------------------------------------------------------------- helpers -- */

const $ = sel => document.querySelector(sel);

/* app language code → flag artwork (UK flag stands for English) */
const FLAG = { ko: 'kr', en: 'gb', es: 'es', tr: 'tr', fr: 'fr', de: 'de', jp: 'jp', it: 'it', br: 'br' };

const cover     = n => `assets/covers/tile-${n}.jpg`;
const portrait  = n => `assets/artists/art-${n}.jpg`;
const flag      = code => `assets/flags/${FLAG[code] || code}.svg`;

const iconGlobe = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2"/><path d="M12 3.4c2.3 2.4 3.4 5.4 3.4 8.6s-1.1 6.2-3.4 8.6c-2.3-2.4-3.4-5.4-3.4-8.6S9.7 5.8 12 3.4z"/></svg>`;
const iconGrid  = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3.6" y="3.6" width="7.4" height="7.4" rx="2.4"/><rect x="13" y="3.6" width="7.4" height="7.4" rx="2.4"/><rect x="3.6" y="13" width="7.4" height="7.4" rx="2.4"/><rect x="13" y="13" width="7.4" height="7.4" rx="2.4"/></svg>`;
const iconPlay  = `<svg class="i-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8.6 5.6a1 1 0 0 1 1.52-.85l8.6 5.55a1.1 1.1 0 0 1 0 1.83l-8.6 5.55a1 1 0 0 1-1.52-.85z"/></svg>`;
const iconPause = `<svg class="i-pause" viewBox="0 0 24 24" fill="currentColor"><rect x="7.6" y="5.4" width="3.6" height="13.2" rx="1.7"/><rect x="12.8" y="5.4" width="3.6" height="13.2" rx="1.7"/></svg>`;
const iconCrown = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.6 18.6 2.1 7l5.1 3.3L12 4l4.8 6.3L21.9 7l-1.5 11.6z"/></svg>`;
const iconHead  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15v-2.6a8 8 0 0 1 16 0V15"/><rect x="2.6" y="14.4" width="4.4" height="6.4" rx="2"/><rect x="17" y="14.4" width="4.4" height="6.4" rx="2"/></svg>`;

/* -------------------------------------------------------------- rendering -- */

function renderStories() {
  const track = $('#storyTrack');

  track.innerHTML = ARTISTS.map(a => `
    <button class="story" type="button" data-name="${a.name}" data-art="${a.art}">
      <span class="story__ring${a.fresh ? ' is-fresh' : ''}">
        <span class="story__avatar">
          <img src="${portrait(a.art)}" alt="" width="56" height="56" draggable="false" loading="lazy">
        </span>
        <span class="story__flag"><img src="${flag(a.lang)}" alt="" width="19" height="19" loading="lazy"></span>
      </span>
      <span class="story__name">${a.name}</span>
    </button>
  `).join('') + `
    <button class="story story--all" type="button" id="seeAllBtn">
      <span class="story__ring">
        <span class="story__avatar">${iconGrid}</span>
      </span>
      <span class="story__name">See all</span>
    </button>
  `;
}

function renderFilters() {
  $('#filters').innerHTML = LANGUAGES.map((l, i) => `
    <button class="chip${l.code === 'all' ? ' chip--all is-active' : ''}" type="button"
            role="tab" aria-selected="${l.code === 'all'}" data-lang="${l.code}"
            style="animation: rise .5s var(--ease-out) both; animation-delay: ${60 + i * 26}ms">
      <span class="chip__circle">
        ${l.code === 'all' ? iconGlobe : `<img src="${flag(l.code)}" alt="" width="46" height="46" draggable="false" loading="lazy">`}
      </span>
      <span class="chip__name">${l.label}</span>
    </button>
  `).join('');
}

const songRow = (s, i) => `
  <li class="song" data-id="${s.id}" style="--i:${i}">
    <button class="song__row" type="button" aria-label="${s.title} by ${s.artist}">
      <span class="cover">
        <img src="${cover(s.art)}" alt="" width="52" height="52" draggable="false" loading="lazy">
        <span class="cover__flag"><img src="${flag(s.lang)}" alt="" width="20" height="20" loading="lazy"></span>
      </span>

      <span class="song__meta">
        <span class="song__title">${s.title}</span>
        <span class="song__artist">${s.artist}</span>
      </span>

      <span class="song__tail">
        <span class="badge badge--${s.access === 'free' ? 'free' : 'pro'}">
          ${s.access === 'free' ? 'Free' : `${iconCrown}Premium`}
        </span>
        <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="play">${iconPlay}${iconPause}</span>
      </span>
    </button>
  </li>`;

function renderSongs(lang = 'all') {
  const list = lang === 'all' ? SONGS : SONGS.filter(s => s.lang === lang);

  $('#songList').innerHTML = list.length
    ? list.map(songRow).join('')
    : `<li class="songs__empty">${iconHead}No songs in this language yet.</li>`;

  $('#songsTitle').textContent = lang === 'all' ? 'All songs' : `${LANG_NAME[lang]} songs`;
  $('#songsCount').textContent = `${list.length} ${list.length === 1 ? 'song' : 'songs'}`;
  $('#resetFilter').hidden = lang === 'all';
}

/* ----------------------------------------------------------- interaction -- */

function setLanguage(code) {
  document.querySelectorAll('.chip').forEach(chip => {
    const on = chip.dataset.lang === code;
    chip.classList.toggle('is-active', on);
    chip.setAttribute('aria-selected', on);
  });

  renderSongs(code);
  $('#scroll').scrollTo({ top: 0, behavior: 'smooth' });
}

function togglePlay(card) {
  const already = card.classList.contains('is-playing');
  document.querySelectorAll('.song.is-playing').forEach(el => el.classList.remove('is-playing'));
  if (already) return;

  card.classList.add('is-playing');
  const song = SONGS.find(s => s.id === card.dataset.id);
  toast(`Now playing · ${song.title}`);
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

/* ------------------------------------------------------- sticky offsets -- */

function syncSticky() {
  const appbar = $('#appbar');
  const scroll = $('#scroll');
  scroll.style.setProperty('--sticky-top', appbar.offsetHeight + 'px');
  movePill($('#dock .dock__item.is-active'), false);
}

/* --------------------------------------------------------------- bootstrap -- */

renderStories();
renderFilters();
renderSongs();
syncSticky();

$('#scroll').addEventListener('scroll', e => {
  e.currentTarget.classList.toggle('is-scrolled', e.currentTarget.scrollTop > 6);
}, { passive: true });

window.addEventListener('resize', syncSticky);
window.addEventListener('orientationchange', syncSticky);
if (document.fonts) document.fonts.ready.then(syncSticky);

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

  if (item.dataset.tab !== 'home') {
    toast(`${item.querySelector('span').textContent} — coming soon`);
  }
});

/* language filters */
$('#filters').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (chip) setLanguage(chip.dataset.lang);
});
$('#resetFilter').addEventListener('click', () => setLanguage('all'));

/* songs */
$('#songList').addEventListener('click', e => {
  const card = e.target.closest('.song');
  if (card) togglePlay(card);
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
