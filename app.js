(() => {
  'use strict';

  const TESTS = [
    ['sa2_hindi_full', 'SA(II) Hindi Official Practice Paper', 'Complete 136-Question AP TET / DSC Practice Set (CDP, Grammar & Literature)', 150 * 60, 'Full Exam Paper'],
    ['cdp_section', 'Child Development & Pedagogy (बाल विकास)', 'Section A: 60 Questions on Learning, Psychology & Pedagogy', 60 * 60, 'Section A'],
    ['hindi_grammar_section', 'Hindi Language & Grammar (भाषा व व्याकरण)', 'Section B: 60 Questions on Sandhi, Samas, Alankar, Chhand & Grammar', 60 * 60, 'Section B'],
    ['hindi_literature_section', 'Hindi Literature & History (हिंदी साहित्य)', 'Section C: 16 Questions on Literary History, Poetry & Authors', 20 * 60, 'Section C'],
    ['mock1', 'Mock Practice Test 1', '30 General Hindi Grammar & Pedagogy Practice Questions', 30 * 60, 'Practice Set'],
    ['mock2', 'Mock Practice Test 2', '30 Hindi Literature & Pedagogy Questions', 30 * 60, 'Practice Set'],
    ['mock3', 'Mock Practice Test 3', '30 Mixed AP TET Hindi Practice Questions', 30 * 60, 'Practice Set']
  ];

  const $ = id => document.getElementById(id);
  let state = null;
  let timer = null;

  const key = id => 'aptet-hindi-' + id;
  const time = n => [n / 3600, (n / 60) % 60, n % 60].map(x => String(Math.floor(x)).padStart(2, '0')).join(':');

  function notify(text) {
    const toast = $('toast');
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function view(name) {
    ['home', 'exam', 'results'].forEach(x => ($(x).hidden = x !== name));
    $('headTools').hidden = name !== 'exam';
    window.scrollTo(0, 0);
  }

  function save() {
    if (state && !state.done) {
      localStorage.setItem(key(state.id), JSON.stringify({ ...state, questions: undefined }));
    }
  }

  function renderCards() {
    $('cards').innerHTML = TESTS.map(([id, title, description, timeSec, tag]) => `
      <button data-id="${id}" class="card-btn">
        <div class="card-header">
          <span class="card-badge">${tag}</span>
          <span class="card-time">⏱ ${Math.floor(timeSec / 60)} Mins</span>
        </div>
        <h3>${title}</h3>
        <p>${description}</p>
      </button>
    `).join('');
  }

  async function startTest(id, title, allocatedTime) {
    try {
      const response = await fetch(`data/${id}.json`);
      if (!response.ok) throw new Error('Failed to fetch JSON');
      const qs = await response.json();
      if (!Array.isArray(qs) || !qs.length) throw new Error('Empty questions array');

      const saved = JSON.parse(localStorage.getItem(key(id)) || 'null');
      const initialTime = allocatedTime || (qs.length * 60);

      if (saved && !saved.done && saved.questionsCount === qs.length) {
        state = { ...saved, questions: qs };
      } else {
        state = {
          id,
          title,
          questions: qs,
          questionsCount: qs.length,
          current: 0,
          answers: {},
          visited: [0],
          marked: [],
          left: initialTime,
          totalTime: initialTime
        };
      }

      state.title = title;
      $('examTitle').textContent = title;
      view('exam');
      renderQuestion();

      clearInterval(timer);
      timer = setInterval(() => {
        state.left = Math.max(0, state.left - 1);
        $('timer').textContent = time(state.left);
        save();
        if (state.left <= 0) {
          notify('Time is up. Submitting your test automatically.');
          finishTest();
        }
      }, 1000);
    } catch (e) {
      console.error(e);
      notify('Could not load test. If running directly via file://, use a local HTTP server or supported browser.');
    }
  }

  function renderQuestion() {
    const q = state.questions[state.current];
    if (!state.visited.includes(state.current)) {
      state.visited.push(state.current);
    }

    $('timer').textContent = time(state.left);
    $('qnum').textContent = `Question ${state.current + 1} of ${state.questions.length}`;
    $('topic').textContent = q.topic || 'Hindi';
    $('question').textContent = `${state.current + 1}. ${q.question}`;
    $('progressText').textContent = `${Math.round(((state.current + 1) / state.questions.length) * 100)}% Complete`;
    $('progress').style.width = `${((state.current + 1) / state.questions.length) * 100}%`;

    $('options').innerHTML = q.options.map((opt, i) => `
      <label class="option ${state.answers[state.current] === i ? 'selected' : ''}">
        <input name="answer" type="radio" value="${i}" ${state.answers[state.current] === i ? 'checked' : ''}>
        <span><b>(${["क", "ख", "ग", "घ"][i]})</b> ${opt}</span>
      </label>
    `).join('');

    $('prev').disabled = state.current === 0;
    $('next').textContent = state.current === state.questions.length - 1 ? 'Review & Submit →' : 'Save & Next →';

    const isMarked = state.marked.includes(state.current);
    $('mark').classList.toggle('active', isMarked);
    $('mark').textContent = isMarked ? '★ Marked for Review' : '☆ Mark for Review';

    renderPalette();
    save();
  }

  function renderPalette() {
    $('palette').innerHTML = state.questions.map((q, i) => {
      let statusClass = '';
      if (i === state.current) statusClass = 'current';
      else if (state.marked.includes(i)) statusClass = 'marked';
      else if (state.answers[i] !== undefined) statusClass = 'answered';

      return `<button class="${statusClass}" data-i="${i}" aria-label="Question ${i + 1}">${i + 1}</button>`;
    }).join('');
  }

  function goToQuestion(i) {
    state.current = Math.max(0, Math.min(i, state.questions.length - 1));
    renderQuestion();
  }

  function finishTest() {
    clearInterval(timer);
    state.done = true;
    localStorage.removeItem(key(state.id));

    const total = state.questions.length;
    const attempted = Object.keys(state.answers).length;
    const correct = state.questions.filter((q, i) => state.answers[i] === q.answer).length;
    const wrong = attempted - correct;
    const pct = Math.round((correct / total) * 100);
    const taken = (state.totalTime || (150 * 60)) - state.left;

    state.result = { attempted, correct, wrong, total, pct, taken };

    const isPassed = pct >= 40;
    $('summary').innerHTML = `
      <div class="status-badge ${isPassed ? 'pass' : 'fail'}">${isPassed ? 'PASSED' : 'NEEDS PRACTICE'}</div>
      <h2>${isPassed ? 'Congratulations!' : 'Good Effort!'}</h2>
      <p>You scored <strong>${correct}</strong> out of <strong>${total}</strong> (${pct}%)</p>
    `;

    const stats = [
      ['Total Questions', total],
      ['Attempted', attempted],
      ['Correct Answers', correct],
      ['Wrong Answers', wrong],
      ['Unanswered', total - attempted],
      ['Final Score', `${correct} / ${total}`],
      ['Percentage', `${pct}%`],
      ['Time Elapsed', time(taken)]
    ];

    $('stats').innerHTML = stats.map(([label, val]) => `
      <div class="stat-box">
        <b>${val}</b>
        <span>${label}</span>
      </div>
    `).join('');

    renderReview('all');
    view('results');
  }

  function renderReview() {
    const reviewContainer = $('review');
    reviewContainer.innerHTML = state.questions.map((q, i) => {
      const userAns = state.answers[i];
      const isCorrect = userAns === q.answer;
      const isAnswered = userAns !== undefined;

      const userText = isAnswered ? `(${["क", "ख", "ग", "घ"][userAns]}) ${q.options[userAns]}` : 'Not Answered';
      const correctText = `(${["क", "ख", "ग", "घ"][q.answer]}) ${q.options[q.answer]}`;

      return `
        <article class="review-card ${isAnswered ? (isCorrect ? 'correct-card' : 'wrong-card') : 'unanswered-card'}">
          <div class="review-header">
            <span class="q-tag">Question ${i + 1}</span>
            <span class="topic-tag">${q.topic || 'Hindi'}</span>
            <span class="result-tag ${isAnswered ? (isCorrect ? 'tag-correct' : 'tag-wrong') : 'tag-unanswered'}">
              ${isAnswered ? (isCorrect ? '✓ Correct' : '✗ Incorrect') : '◯ Skipped'}
            </span>
          </div>
          <h3>${q.question}</h3>
          <div class="review-details">
            <p><strong>Your Response:</strong> <span class="${isCorrect ? 'correct-text' : 'wrong-text'}">${userText}</span></p>
            <p><strong>Correct Answer:</strong> <span class="correct-text">${correctText}</span></p>
            <div class="explanation-box">
              <strong>Explanation:</strong> ${q.explanation || 'Refer to AP TET SA(II) syllabus notes.'}
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Event Listeners
  $('cards').onclick = e => {
    const btn = e.target.closest('[data-id]');
    if (btn) {
      const test = TESTS.find(x => x[0] === btn.dataset.id);
      if (test) startTest(test[0], test[1], test[3]);
    }
  };

  $('options').onchange = e => {
    state.answers[state.current] = +e.target.value;
    renderQuestion();
  };

  $('palette').onclick = e => {
    const btn = e.target.closest('[data-i]');
    if (btn) goToQuestion(+btn.dataset.i);
  };

  $('prev').onclick = () => goToQuestion(state.current - 1);
  $('next').onclick = () => {
    if (state.current < state.questions.length - 1) {
      goToQuestion(state.current + 1);
    } else {
      $('dialog').showModal();
    }
  };

  $('mark').onclick = () => {
    const idx = state.marked.indexOf(state.current);
    if (idx < 0) state.marked.push(state.current);
    else state.marked.splice(idx, 1);
    renderQuestion();
  };

  $('clear').onclick = () => {
    delete state.answers[state.current];
    renderQuestion();
  };

  $('submit').onclick = () => $('dialog').showModal();
  $('confirm').onclick = finishTest;
  $('back').onclick = () => {
    state = null;
    view('home');
  };

  $('print').onclick = () => window.print();

  $('dark').onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('aptet-dark', document.body.classList.contains('dark'));
  };

  $('full').onclick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  document.onkeydown = e => {
    if (!state || $('exam').hidden || e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowLeft') goToQuestion(state.current - 1);
    if (e.key === 'ArrowRight') {
      if (state.current < state.questions.length - 1) goToQuestion(state.current + 1);
    }
    if (/^[1-4]$/.test(e.key)) {
      const radio = document.querySelector(`input[value="${+e.key - 1}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  if (localStorage.getItem('aptet-dark') === 'true') {
    document.body.classList.add('dark');
  }

  renderCards();
})();
