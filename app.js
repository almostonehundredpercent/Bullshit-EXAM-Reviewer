// ===================== STATE =====================
const state = {
  topic: 'all',
  mode: 'quiz',         // 'quiz' | 'timed' | 'flash'
  order: 'seq',         // 'seq' | 'shuffle'
  questions: [],
  qIdx: 0,
  answered: false,
  score: 0,
  missed: [],           // store {q, your, correctIdx}
  timerInterval: null,
  timeLeft: 60,
  flash: { cards: [], idx: 0, flipped: false },
};

const STORAGE_KEY = 'bsitReviewerHighScores';
const THEME_KEY = 'bsitReviewerTheme';

// ===================== UTILITIES =====================
function $(id) { return document.getElementById(id); }

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function topicLabel(id) {
  const t = TOPICS.find(x => x.id === id);
  return t ? t.label : id;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

// ===================== THEME =====================
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  $('themeIcon').textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ===================== HIGH SCORES =====================
function getHighScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveHighScore(topic, mode, score, total) {
  const scores = getHighScores();
  const key = `${topic}_${mode}`;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const existing = scores[key];
  let isNew = false;
  if (!existing || pct > existing.pct || (pct === existing.pct && score > existing.score)) {
    scores[key] = { topic, mode, score, total, pct, date: new Date().toISOString() };
    isNew = true;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  return isNew;
}

function renderHighScores() {
  const scores = getHighScores();
  const keys = Object.keys(scores);
  const list = $('highscoreList');
  if (keys.length === 0) {
    list.innerHTML = '<div class="highscore-empty">No high scores yet. Start a review to set one!</div>';
    return;
  }
  const modeLabels = { quiz: 'Quiz', timed: 'Timed', flash: 'Flashcards' };
  const sorted = keys.sort((a, b) => scores[b].pct - scores[a].pct);
  list.innerHTML = sorted.map(k => {
    const s = scores[k];
    const modeLbl = modeLabels[s.mode] || s.mode;
    return `<div class="highscore-row">
      <span class="hs-topic">${topicLabel(s.topic)} <span style="color:var(--text-tertiary); font-weight:400;">(${modeLbl})</span></span>
      <span class="hs-score">${s.score}/${s.total} &middot; ${s.pct}%</span>
    </div>`;
  }).join('');
}

function clearHighScores() {
  if (confirm('Clear all high scores? This cannot be undone.')) {
    localStorage.removeItem(STORAGE_KEY);
    renderHighScores();
  }
}

// ===================== HOME SCREEN SETUP =====================
function renderTopicGrid() {
  const grid = $('topicGrid');
  grid.innerHTML = TOPICS.map(t => {
    const count = t.id === 'all' ? QUESTIONS.length : QUESTIONS.filter(q => q.t === t.id).length;
    const active = t.id === state.topic ? ' active' : '';
    return `<button class="topic-chip${active}" data-topic="${t.id}">${t.label}<span class="count">${count} questions</span></button>`;
  }).join('');

  grid.querySelectorAll('.topic-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      state.topic = btn.dataset.topic;
      grid.querySelectorAll('.topic-chip').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
}

function initModeCards() {
  const cards = document.querySelectorAll('.mode-card');
  cards.forEach(card => {
    if (card.dataset.mode === state.mode) card.classList.add('active');
    card.addEventListener('click', () => {
      state.mode = card.dataset.mode;
      cards.forEach(c => c.classList.toggle('active', c === card));
      $('orderCard').style.display = state.mode === 'flash' ? 'none' : 'block';
    });
  });
}

function initOrderToggle() {
  $('btnSeq').addEventListener('click', () => setOrder('seq'));
  $('btnShuffle').addEventListener('click', () => setOrder('shuffle'));
}

function setOrder(order) {
  state.order = order;
  $('btnSeq').classList.toggle('active', order === 'seq');
  $('btnShuffle').classList.toggle('active', order === 'shuffle');
}

// ===================== START REVIEW =====================
function startReview() {
  if (state.mode === 'flash') {
    startFlashcards();
    return;
  }
  startQuiz();
}

function getFilteredQuestions() {
  let qs = state.topic === 'all' ? QUESTIONS : QUESTIONS.filter(q => q.t === state.topic);
  if (state.order === 'shuffle') qs = shuffleArray(qs);
  return qs;
}

function startQuiz() {
  state.questions = getFilteredQuestions();
  state.qIdx = 0;
  state.score = 0;
  state.answered = false;
  state.missed = [];

  if (state.mode === 'timed') {
    state.timeLeft = 60;
    $('timerDisplay').style.display = 'block';
    $('timerDisplay').classList.remove('warning');
    startTimer();
  } else {
    $('timerDisplay').style.display = 'none';
  }

  showScreen('screen-quiz');
  renderQuestion();
}

function startTimer() {
  clearInterval(state.timerInterval);
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      finishQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = $('timerDisplay');
  el.textContent = `${state.timeLeft}s`;
  el.classList.toggle('warning', state.timeLeft <= 10);
}

// ===================== QUIZ RENDERING =====================
function renderQuestion() {
  const total = state.questions.length;

  if (state.qIdx >= total) {
    finishQuiz();
    return;
  }

  const q = state.questions[state.qIdx];
  state.answered = false;

  // progress bar
  const pct = total > 0 ? Math.round((state.qIdx / total) * 100) : 0;
  $('pbar').style.width = pct + '%';

  // meta
  $('quizTopicTag').textContent = topicLabel(q.t);
  $('quizProgress').textContent = state.mode === 'timed'
    ? `Question ${state.qIdx + 1}`
    : `Question ${state.qIdx + 1} of ${total}`;

  // question text + optional code block
  if (q.code) {
    const lines = q.q.split('\n');
    $('qtext').textContent = lines[0];
    $('codeblock').textContent = lines.slice(1).join('\n');
    $('codeblock').style.display = 'block';
  } else {
    $('qtext').textContent = q.q;
    $('codeblock').style.display = 'none';
  }

  // choices
  const choicesEl = $('choices');
  choicesEl.innerHTML = q.c.map((c, i) =>
    `<button class="ch" data-idx="${i}">${String.fromCharCode(65 + i)}) ${c}</button>`
  ).join('');

  choicesEl.querySelectorAll('.ch').forEach(btn => {
    btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.idx, 10)));
  });

  // explanation + next button
  $('exp').classList.remove('show');
  $('exp').textContent = q.e;
  $('nextBtn').style.display = 'none';

  // live score
  $('liveScore').textContent = state.score;
}

function selectAnswer(idx) {
  if (state.answered) return;
  state.answered = true;

  const q = state.questions[state.qIdx];
  const correct = idx === q.a;

  if (correct) {
    state.score++;
  } else {
    state.missed.push({
      q: q.q,
      code: q.code,
      choices: q.c,
      yourIdx: idx,
      correctIdx: q.a,
      exp: q.e,
      topic: q.t,
    });
  }

  document.querySelectorAll('.ch').forEach((el, i) => {
    el.disabled = true;
    if (i === q.a) el.classList.add('correct');
    else if (i === idx && i !== q.a) el.classList.add('wrong');
  });

  $('exp').classList.add('show');
  $('liveScore').textContent = state.score;

  if (state.mode === 'timed') {
    // brief pause then auto-advance
    setTimeout(() => {
      state.qIdx++;
      if (state.qIdx >= state.questions.length) {
        // loop back for endless timed mode
        state.questions = getFilteredQuestions();
        state.qIdx = 0;
      }
      renderQuestion();
    }, 700);
  } else {
    $('nextBtn').style.display = 'inline-block';
  }
}

function nextQuestion() {
  state.qIdx++;
  renderQuestion();
}

function finishQuiz() {
  clearInterval(state.timerInterval);

  const total = state.mode === 'timed'
    ? (state.score + state.missed.length)
    : state.questions.length;

  $('scoreBig').textContent = `${state.score}/${total}`;
  $('scoreLabel').textContent = `${topicLabel(state.topic)} · ${state.mode === 'timed' ? 'Timed challenge' : 'Quiz mode'}`;

  const acc = total > 0 ? Math.round((state.score / total) * 100) : 0;
  $('statAccuracy').textContent = acc + '%';
  $('statCorrect').textContent = state.score;
  $('statMissed').textContent = total - state.score;
  $('statTotal').textContent = total;

  // emoji based on performance
  let emoji = '🎉';
  if (acc >= 90) emoji = '🏆';
  else if (acc >= 70) emoji = '🎉';
  else if (acc >= 50) emoji = '💪';
  else emoji = '📚';
  $('resultEmoji').textContent = emoji;

  const isNew = saveHighScore(state.topic, state.mode, state.score, total);
  $('newHighscoreBanner').style.display = isNew ? 'block' : 'none';

  $('reviewMissedBtn').style.display = state.missed.length > 0 ? 'inline-block' : 'none';

  showScreen('screen-results');
}

// ===================== REVIEW MISSED QUESTIONS =====================
function renderMissedReview() {
  const list = $('reviewList');
  if (state.missed.length === 0) {
    list.innerHTML = '<div class="highscore-empty">No missed questions — great job!</div>';
  } else {
    list.innerHTML = state.missed.map(m => {
      let qDisplay = m.q;
      let codeHtml = '';
      if (m.code) {
        const lines = m.q.split('\n');
        qDisplay = lines[0];
        codeHtml = `<pre class="codeblock" style="display:block; margin: 8px 0;">${lines.slice(1).join('\n')}</pre>`;
      }
      return `<div class="review-item">
        <div class="review-q">${escapeHtml(qDisplay)}</div>
        ${codeHtml}
        <div class="review-answer your-answer">Your answer: ${String.fromCharCode(65 + m.yourIdx)}) ${escapeHtml(m.choices[m.yourIdx])}</div>
        <div class="review-answer correct-answer">Correct answer: ${String.fromCharCode(65 + m.correctIdx)}) ${escapeHtml(m.choices[m.correctIdx])}</div>
        <div class="review-exp">${escapeHtml(m.exp)}</div>
      </div>`;
    }).join('');
  }
  showScreen('screen-review');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===================== FLASHCARDS =====================
function startFlashcards() {
  let cards = state.topic === 'all' ? FLASHCARDS : FLASHCARDS.filter(f => f.t === state.topic);
  if (state.order === 'shuffle') cards = shuffleArray(cards);

  if (cards.length === 0) {
    cards = FLASHCARDS; // fallback
  }

  state.flash.cards = cards;
  state.flash.idx = 0;
  state.flash.flipped = false;

  showScreen('screen-flash');
  renderFlashcard();
}

function renderFlashcard() {
  const { cards, idx } = state.flash;
  const card = cards[idx];

  $('flashTopicTag').textContent = topicLabel(card.t);
  $('flashProgress').textContent = `Card ${idx + 1} of ${cards.length}`;
  $('flashFront').textContent = card.f;
  $('flashBack').textContent = card.b;

  $('flashcardInner').classList.toggle('flipped', state.flash.flipped);
}

function flipFlashcard() {
  state.flash.flipped = !state.flash.flipped;
  $('flashcardInner').classList.toggle('flipped', state.flash.flipped);
}

function nextFlashcard() {
  state.flash.idx = (state.flash.idx + 1) % state.flash.cards.length;
  state.flash.flipped = false;
  renderFlashcard();
}

function prevFlashcard() {
  state.flash.idx = (state.flash.idx - 1 + state.flash.cards.length) % state.flash.cards.length;
  state.flash.flipped = false;
  renderFlashcard();
}

function shuffleFlashcards() {
  state.flash.cards = shuffleArray(state.flash.cards);
  state.flash.idx = 0;
  state.flash.flipped = false;
  renderFlashcard();
}

// ===================== NAVIGATION =====================
function quitToHome() {
  clearInterval(state.timerInterval);
  renderHighScores();
  showScreen('screen-home');
}

// ===================== INIT =====================
function init() {
  initTheme();
  renderTopicGrid();
  initModeCards();
  initOrderToggle();
  renderHighScores();

  $('themeToggle').addEventListener('click', toggleTheme);
  $('startBtn').addEventListener('click', startReview);
  $('clearScores').addEventListener('click', clearHighScores);

  // Quiz screen
  $('quitBtn').addEventListener('click', quitToHome);
  $('nextBtn').addEventListener('click', nextQuestion);

  // Results screen
  $('retryBtn').addEventListener('click', startReview);
  $('homeBtn').addEventListener('click', quitToHome);
  $('reviewMissedBtn').addEventListener('click', renderMissedReview);

  // Review screen
  $('reviewBackBtn').addEventListener('click', () => showScreen('screen-results'));
  $('reviewHomeBtn').addEventListener('click', quitToHome);

  // Flashcard screen
  $('flashQuitBtn').addEventListener('click', quitToHome);
  $('flashcard').addEventListener('click', flipFlashcard);
  $('flashNext').addEventListener('click', nextFlashcard);
  $('flashPrev').addEventListener('click', prevFlashcard);
  $('flashShuffleBtn').addEventListener('click', shuffleFlashcards);

  // keyboard support for quiz (1-4, enter for next)
  document.addEventListener('keydown', (e) => {
    if (!$('screen-quiz').classList.contains('active')) return;
    if (['1', '2', '3', '4'].includes(e.key) && !state.answered) {
      const idx = parseInt(e.key, 10) - 1;
      const btn = document.querySelector(`.ch[data-idx="${idx}"]`);
      if (btn) selectAnswer(idx);
    } else if (e.key === 'Enter' && state.answered && state.mode !== 'timed') {
      nextQuestion();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
