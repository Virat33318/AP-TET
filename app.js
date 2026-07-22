/**
 * AP TET Paper-II(A) School Assistant Hindi CBT Mock Test Engine
 * 100% Vanilla JavaScript (ES6+) - Fully Offline
 */

class CBTEngine {
  constructor() {
    // Session State
    this.questions = [];
    this.currentQIndex = 0;
    this.userAnswers = {}; // { qIndex: selectedOptionIndex }
    this.questionStates = {}; // { qIndex: 'not-visited' | 'not-answered' | 'answered' | 'marked' | 'ans-marked' }
    this.bookmarks = {}; // { qIndex: boolean }
    
    this.timerDuration = 150 * 60; // 150 Minutes default in seconds
    this.remainingSeconds = 150 * 60;
    this.timerInterval = null;
    this.timeSpentSeconds = 0;

    this.activeMockTitle = 'AP TET Paper-II(A) School Assistant Hindi Mock Test';
    this.activeMockPath = '';
    this.isExamActive = false;

    // Embedded Fallback Datasets for direct file:// CORS bypass
    this.embeddedDatasets = {
      'data/mock1.json': [
        {
          "id": 1,
          "topic": "हिंदी व्याकरण (Grammar)",
          "question": "'कमल' का सही पर्यायवाची शब्द कौन-सा है?",
          "options": ["पेड़", "पंकज", "नदी", "बादल"],
          "answer": 1,
          "explanation": "'पंकज' कमल का पर्यायवाची शब्द है। 'पंक' (कीचड़) + 'ज' (जन्म लेने वाला) अर्थात कीचड़ में जन्म लेने वाला (कमल)।"
        },
        {
          "id": 2,
          "topic": "हिंदी व्याकरण (Grammar)",
          "question": "'महोत्सव' शब्द का सही संधि-विच्छेद क्या है?",
          "options": ["मह + उत्सव", "महा + उत्सव", "महो + उत्सव", "महान + उत्सव"],
          "answer": 1,
          "explanation": "'महोत्सव' का संधि-विच्छेद 'महा + उत्सव' है। यह गुण स्वर संधि का उदाहरण है (आ + उ = ओ)।"
        },
        {
          "id": 3,
          "topic": "हिंदी साहित्य (Literature)",
          "question": "हिंदी साहित्य के आदिकाल को 'वीरगाथा काल' नाम किसने दिया था?",
          "options": ["हजारी प्रसाद द्विवेदी", "डॉ. नगेंद्र", "आचार्य रामचंद्र शुक्ल", "राहुल सांकृत्यायन"],
          "answer": 2,
          "explanation": "आचार्य रामचंद्र शुक्ल ने अपने 'हिंदी साहित्य का इतिहास' में आदिकाल की प्रमुख प्रवृत्तियों के आधार पर इसे 'वीरगाथा काल' कहा था।"
        },
        {
          "id": 4,
          "topic": "हिंदी व्याकरण (Grammar)",
          "question": "'यथाशक्ति' शब्द में कौन-सा समास है?",
          "options": ["तत्पुरुष समास", "द्विगु समास", "अव्ययीभाव समास", "बहुव्रीहि समास"],
          "answer": 2,
          "explanation": "'यथाशक्ति' का विग्रह है 'शक्ति के अनुसार'। प्रथम पद 'यथा' अव्यय है, अतः यह अव्ययीभाव समास है।"
        },
        {
          "id": 5,
          "topic": "भाषा शिक्षण शास्त्र (Pedagogy)",
          "question": "भाषा के प्राथमिक कौशल कौन-से हैं?",
          "options": ["पढ़ना और लिखना", "सुनना और बोलना", "सुनना और लिखना", "बोलना और पढ़ना"],
          "answer": 1,
          "explanation": "भाषा सीखने का स्वाभाविक क्रम (LSRW) है - सुनना (Listening), बोलना (Speaking), पढ़ना (Reading), लिखना (Writing)। इनमें सुनना और बोलना प्राथमिक कौशल हैं।"
        },
        {
          "id": 6,
          "topic": "हिंदी साहित्य (Literature)",
          "question": "'गोदान' उपन्यास के लेखक कौन हैं?",
          "options": ["जयशंकर प्रसाद", "मुंशी प्रेमचंद", "फणीश्वर नाथ रेणु", "सूर्यकांत त्रिपाठी 'निराला'"],
          "answer": 1,
          "explanation": "'गोदान' हिंदी के महान उपन्यासकार मुंशी प्रेमचंद का अंतिम और सबसे प्रसिद्ध यथार्थवादी उपन्यास है, जो 1936 में प्रकाशित हुआ था।"
        },
        {
          "id": 7,
          "topic": "हिंदी व्याकरण (Grammar)",
          "question": "'अंधे की लाठी' मुहावरे का सही अर्थ क्या है?",
          "options": ["अंधे व्यक्ति का सहारा", "एकमात्र सहारा", "अंधेरे में रास्ता दिखाना", "कमजोर होना"],
          "answer": 1,
          "explanation": "'अंधे की लाठी' मुहावरे का अर्थ 'एकमात्र सहारा' होना होता है।"
        },
        {
          "id": 8,
          "topic": "हिंदी व्याकरण (Grammar)",
          "question": "निम्न में से कौन-सा शब्द शुद्ध वर्तनी वाला है?",
          "options": ["उज्ज्वल", "उज्वल", "उजवल", "उज्जवल"],
          "answer": 0,
          "explanation": "शुद्ध रूप 'उज्ज्वल' है। उत + ज्वल = उज्ज्वल (व्यंजन संधि)।"
        },
        {
          "id": 9,
          "topic": "भाषा शिक्षण शास्त्र (Pedagogy)",
          "question": "हिंदी भाषा शिक्षण में 'आगमन विधि' (Inductive Method) का प्रयोग किस प्रकार किया जाता है?",
          "options": ["पहले नियम फिर उदाहरण", "पहले उदाहरण फिर नियम", "केवल नियमों का कंठस्थीकरण", "केवल प्रश्नों का अभ्यास"],
          "answer": 1,
          "explanation": "आगमन विधि में छात्रों के सामने पहले विशिष्ट उदाहरण प्रस्तुत किए जाते हैं, तत्पश्चात उनसे सामान्य नियम निकलवाए जाते हैं।"
        },
        {
          "id": 10,
          "topic": "हिंदी साहित्य (Literature)",
          "question": "छायावाद के चार प्रमुख स्तंभों में कौन शामिल नहीं है?",
          "options": ["जयशंकर प्रसाद", "सूर्यकांत त्रिपाठी 'निराला'", "महादेवी वर्मा", "माखनलाल चतुर्वेदी"],
          "answer": 3,
          "explanation": "छायावाद के चार प्रमुख स्तंभ हैं: जयशंकर प्रसाद, सूर्यकांत त्रिपाठी 'निराला', सुमित्रानंदन पंत और महादेवी वर्मा।"
        }
      ],
      'data/mock2.json': [
        {
          "id": 1,
          "topic": "हिंदी व्याकरण (Grammar)",
          "question": "'पवन' का संधि-विच्छेद क्या होगा?",
          "options": ["प + वन", "पो + अन", "पौ + अन", "पा + वन"],
          "answer": 1,
          "explanation": "'पवन' का सही संधि विच्छेद 'पो + अन' है। यह अयादि स्वर संधि का नियम है (ओ + अ = अव)।"
        },
        {
          "id": 2,
          "topic": "हिंदी व्याकरण (Grammar)",
          "question": "द्विगु समास का उदाहरण निम्न में से कौन-सा है?",
          "options": ["माता-पिता", "त्रिफला", "पीतांबर", "राजपुरुष"],
          "answer": 1,
          "explanation": "'त्रिफला' (तीन फलों का समूह) का पहला पद संख्यावाचक विशेषण है, इसलिए यह द्विगु समास है।"
        },
        {
          "id": 3,
          "topic": "हिंदी साहित्य (Literature)",
          "question": "'बीजक' रचना किस कवि की रचनाओं का संग्रह है?",
          "options": ["सूरदास", "तुलसीदास", "कबीरदास", "मलिक मोहम्मद जायसी"],
          "answer": 2,
          "explanation": "कबीरदास की साखी, शब्द और रमैनी रचनाओं का संग्रह उनके शिष्य धर्मदास ने 'बीजक' नाम से किया था।"
        },
        {
          "id": 4,
          "topic": "हिंदी व्याकरण (Grammar)",
          "question": "'अनुग्रह' शब्द का विलोम क्या होगा?",
          "options": ["आग्रह", "संग्रह", "विग्रह", "परिग्रह"],
          "answer": 2,
          "explanation": "'अनुग्रह' शब्द का सही विलोम 'विग्रह' या 'कोप' होता है।"
        },
        {
          "id": 5,
          "topic": "भाषा शिक्षण शास्त्र (Pedagogy)",
          "question": "व्याकरण शिक्षण की सर्वोत्तम विधि कौन-सी मानी जाती है?",
          "options": ["निगमन विधि", "आगमन-निगमन विधि", "पाठ्यपुस्तक विधि", "सूत्र विधि"],
          "answer": 1,
          "explanation": "व्याकरण शिक्षण के लिए 'आगमन-निगमन विधि' सर्वश्रेष्ठ है।"
        }
      ],
      'data/mock3.json': [
        {
          "id": 1,
          "topic": "भाषा शिक्षण शास्त्र (Pedagogy)",
          "question": "प्राथमिक स्तर पर वाचन (पढ़ने) का मुख्य उद्देश्य क्या है?",
          "options": ["द्रुत गति से पढ़ना", "अर्थ ग्रहण करते हुए पढ़ना", "उच्च स्वर में चिल्लाना", "कठिन शब्दों का उच्चारण करना"],
          "answer": 1,
          "explanation": "पढ़ने का वास्तविक उद्देश्य केवल अक्षरों को पहचानना नहीं, बल्कि लिखे हुए पाठ का 'अर्थ ग्रहण' करना है।"
        },
        {
          "id": 2,
          "topic": "हिंदी व्याकरण (Grammar)",
          "question": "'पीतांबर' में कौन-सा समास है यदि इसका विग्रह 'पीत है अंबर जिसका अर्थात श्रीकृष्ण' किया जाए?",
          "options": ["कर्मधारय समास", "बहुव्रीहि समास", "तत्पुरुष समास", "द्वंद्व समास"],
          "answer": 1,
          "explanation": "जब दो पद मिलकर किसी तीसरे अन्य पद का बोध कराते हैं (विशेष अर्थ), तो वहाँ बहुव्रीहि समास होता है।"
        },
        {
          "id": 3,
          "topic": "हिंदी साहित्य (Literature)",
          "question": "'अंधेर नगरी' नाटक के रचयिता कौन हैं?",
          "options": ["भारतेंदु हरिश्चंद्र", "जयशंकर प्रसाद", "मोहन राकेश", "धर्मवीर भारती"],
          "answer": 0,
          "explanation": "'अंधेर नगरी' (1881 ई.) आधुनिक हिंदी साहित्य के पितामह भारतेंदु हरिश्चंद्र द्वारा रचित एक प्रसिद्ध प्रहसन (नाटक) है।"
        }
      ],
      'data/previous_year_2024.json': [
        {
          "id": 1,
          "topic": "AP TET PYQ 2024 - Grammar",
          "question": "'पावक' का संधि विच्छेद क्या होगा?",
          "options": ["पा + अक", "पौ + अक", "पो + अक", "पाव + क"],
          "answer": 1,
          "explanation": "'पौ + अक = पावक'। औ + अ = आव (अयादि संधि)।"
        },
        {
          "id": 2,
          "topic": "AP TET PYQ 2024 - Literature",
          "question": "हिंदी का प्रथम समाचार पत्र कौन-सा था?",
          "options": ["बंगदूत", "उदंत मार्तंड", "समाचार दर्पण", "कवि वचन सुधा"],
          "answer": 1,
          "explanation": "हिंदी का पहला समाचार पत्र 'उदंत मार्तंड' था जो 30 मई 1826 को कोलकाता से पंडित जुगल किशोर शुक्ल द्वारा प्रकाशित किया गया था।"
        }
      ]
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkSavedSession();
  }

  // Set up global listeners (Keyboard shortcuts, full screen, theme)
  setupEventListeners() {
    // Theme toggle
    document.getElementById('btnThemeToggle').addEventListener('click', () => this.toggleTheme());

    // Fullscreen toggle
    document.getElementById('btnFullscreen').addEventListener('click', () => this.toggleFullscreen());

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (!this.isExamActive) return;

      // Don't trigger shortcuts inside text inputs/selects
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'n':
        case 'N':
          this.saveAndNext();
          break;
        case 'ArrowLeft':
        case 'p':
        case 'P':
          this.prevQuestion();
          break;
        case '1':
          this.selectOption(0);
          break;
        case '2':
          this.selectOption(1);
          break;
        case '3':
          this.selectOption(2);
          break;
        case '4':
          this.selectOption(3);
          break;
        case 'm':
        case 'M':
          this.markForReview();
          break;
        case 'c':
        case 'C':
          this.clearResponse();
          break;
      }
    });

    // Handle session resume buttons
    document.getElementById('btnResumeSession').addEventListener('click', () => this.restoreSession());
    document.getElementById('btnDiscardSession').addEventListener('click', () => this.discardSavedSession());
  }

  // --- Theme & Fullscreen ---
  toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('APTET_THEME', newTheme);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  // --- View Switcher ---
  switchView(viewId) {
    ['homeView', 'examView', 'resultView', 'reviewView'].forEach(id => {
      document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(viewId).classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  goHome() {
    if (this.isExamActive) {
      if (!confirm("परीक्षा प्रगति पर है! क्या आप मुख्य पृष्ठ पर जाना चाहते हैं? (Your exam will stay saved)")) {
        return;
      }
    }
    this.switchView('homeView');
    this.checkSavedSession();
  }

  // --- Load Mock JSON Test ---
  async startMock(jsonPath, mockTitle) {
    this.activeMockPath = jsonPath;
    this.activeMockTitle = mockTitle;

    try {
      let data = null;
      
      // Attempt standard fetch first
      try {
        const response = await fetch(jsonPath);
        if (response.ok) {
          data = await response.json();
        }
      } catch (err) {
        console.warn("Fetch failed (likely file:// protocol CORS). Falling back to embedded dataset:", jsonPath);
      }

      // Fallback to embedded data if fetch failed
      if (!data && this.embeddedDatasets[jsonPath]) {
        data = this.embeddedDatasets[jsonPath];
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        alert("त्रुटि: मॉक टेस्ट डेटा लोड नहीं हो सका। कृपया फाइल की जाँच करें।");
        return;
      }

      this.initExam(data, mockTitle);
    } catch (e) {
      console.error(e);
      alert("माक टेस्ट लोड करने में असमर्थ।");
    }
  }

  // Handle custom user uploaded JSON file
  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data) && data.length > 0 && data[0].question && data[0].options) {
          this.initExam(data, `Custom Uploaded Test — ${file.name}`);
        } else {
          alert("अमान्य JSON संरचना! प्रत्येक प्रश्न में 'question', 'options', और 'answer' होना आवश्यक है।");
        }
      } catch (err) {
        alert("JSON फाइल पढ़ने में त्रुटि। कृपया सही JSON फॉर्मेट चुनें।");
      }
    };
    reader.readAsText(file);
  }

  // --- Exam Initialization ---
  initExam(questionsData, mockTitle) {
    this.questions = questionsData;
    this.activeMockTitle = mockTitle;
    this.currentQIndex = 0;
    this.userAnswers = {};
    this.bookmarks = {};
    this.questionStates = {};

    // Default question state is 'not-visited' for all
    this.questions.forEach((_, idx) => {
      this.questionStates[idx] = 'not-visited';
    });
    // First question is 'not-answered' once visited
    this.questionStates[0] = 'not-answered';

    // Timer reset (150 minutes standard)
    this.remainingSeconds = 150 * 60;
    this.timeSpentSeconds = 0;
    this.isExamActive = true;

    // Update UI Header
    document.getElementById('activeMockTitle').innerText = mockTitle;

    this.renderQuestion();
    this.renderPalette();
    this.updateLegendCounts();
    this.startTimer();
    this.saveSession();

    this.switchView('examView');
  }

  // --- Render Current Question ---
  renderQuestion() {
    const q = this.questions[this.currentQIndex];
    if (!q) return;

    // Mark current state as visited if was not-visited
    if (this.questionStates[this.currentQIndex] === 'not-visited') {
      this.questionStates[this.currentQIndex] = 'not-answered';
    }

    // Question Number & Topic
    document.getElementById('currentQNum').innerText = String(this.currentQIndex + 1).padStart(2, '0');
    document.getElementById('currentQTopic').innerText = q.topic || 'हिंदी साहित्य/व्याकरण';

    // Bookmark status
    const btnBm = document.getElementById('btnBookmark');
    const bmText = document.getElementById('bookmarkText');
    if (this.bookmarks[this.currentQIndex]) {
      btnBm.classList.add('bookmarked');
      bmText.innerText = 'बुकमार्क किया गया';
    } else {
      btnBm.classList.remove('bookmarked');
      bmText.innerText = 'बुकमार्क';
    }

    // Question Text
    document.getElementById('questionText').innerText = `${this.currentQIndex + 1}. ${q.question}`;

    // Render Options
    const optionsGroup = document.getElementById('optionsGroup');
    optionsGroup.innerHTML = '';

    const selectedOptIdx = this.userAnswers[this.currentQIndex];

    q.options.forEach((optText, optIdx) => {
      const isSelected = selectedOptIdx === optIdx;
      const optDiv = document.createElement('div');
      optDiv.className = `option-item ${isSelected ? 'selected' : ''}`;
      optDiv.onclick = () => this.selectOption(optIdx);

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'questionOption';
      radio.className = 'option-radio';
      radio.checked = isSelected;
      radio.id = `opt_${optIdx}`;

      const label = document.createElement('label');
      label.className = 'option-text';
      label.htmlFor = `opt_${optIdx}`;
      label.innerText = `(${String.fromCharCode(65 + optIdx)}) ${optText}`;

      optDiv.appendChild(radio);
      optDiv.appendChild(label);
      optionsGroup.appendChild(optDiv);
    });

    // Update Nav buttons state
    document.getElementById('btnPrevQ').disabled = (this.currentQIndex === 0);
    if (this.currentQIndex === this.questions.length - 1) {
      document.getElementById('btnSaveNext').innerText = 'Save & Review';
    } else {
      document.getElementById('btnSaveNext').innerHTML = 'Save & Next &raquo;';
    }

    this.renderPalette();
    this.updateLegendCounts();
  }

  // --- Option Selection Logic ---
  selectOption(optIdx) {
    this.userAnswers[this.currentQIndex] = optIdx;

    // Update state depending on mark status
    if (this.questionStates[this.currentQIndex] === 'marked' || this.questionStates[this.currentQIndex] === 'ans-marked') {
      this.questionStates[this.currentQIndex] = 'ans-marked';
    } else {
      this.questionStates[this.currentQIndex] = 'answered';
    }

    this.renderQuestion();
    this.saveSession();
  }

  // --- Clear Response ---
  clearResponse() {
    delete this.userAnswers[this.currentQIndex];

    if (this.questionStates[this.currentQIndex] === 'ans-marked') {
      this.questionStates[this.currentQIndex] = 'marked';
    } else {
      this.questionStates[this.currentQIndex] = 'not-answered';
    }

    this.renderQuestion();
    this.saveSession();
  }

  // --- Mark for Review ---
  markForReview() {
    const hasAnswer = this.userAnswers[this.currentQIndex] !== undefined && this.userAnswers[this.currentQIndex] !== null;
    this.questionStates[this.currentQIndex] = hasAnswer ? 'ans-marked' : 'marked';

    this.nextQuestion();
  }

  // --- Save & Next ---
  saveAndNext() {
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentQIndex < this.questions.length - 1) {
      this.currentQIndex++;
      this.renderQuestion();
      this.saveSession();
    }
  }

  prevQuestion() {
    if (this.currentQIndex > 0) {
      this.currentQIndex--;
      this.renderQuestion();
      this.saveSession();
    }
  }

  jumpToQuestion(idx) {
    this.currentQIndex = idx;
    this.renderQuestion();

    // Close mobile palette drawer if open
    document.getElementById('paletteSidebar').classList.remove('mobile-open');
  }

  toggleBookmark() {
    this.bookmarks[this.currentQIndex] = !this.bookmarks[this.currentQIndex];
    this.renderQuestion();
  }

  // --- Question Palette Rendering ---
  renderPalette(filter = 'all') {
    const grid = document.getElementById('paletteGrid');
    grid.innerHTML = '';

    this.questions.forEach((_, idx) => {
      const state = this.questionStates[idx] || 'not-visited';
      
      // Filter logic
      if (filter === 'answered' && !(state === 'answered' || state === 'ans-marked')) return;
      if (filter === 'unanswered' && !(state === 'not-answered' || state === 'not-visited')) return;
      if (filter === 'marked' && !(state === 'marked' || state === 'ans-marked')) return;

      const qBtn = document.createElement('button');
      qBtn.type = 'button';
      qBtn.className = `q-btn state-${state} ${idx === this.currentQIndex ? 'current' : ''}`;
      qBtn.innerText = idx + 1;
      qBtn.onclick = () => this.jumpToQuestion(idx);

      grid.appendChild(qBtn);
    });
  }

  filterPalette(val) {
    this.renderPalette(val);
  }

  toggleMobilePalette() {
    document.getElementById('paletteSidebar').classList.toggle('mobile-open');
  }

  // --- Update Palette Legend Counts ---
  updateLegendCounts() {
    let counts = {
      answered: 0,
      notAnswered: 0,
      notVisited: 0,
      marked: 0,
      ansMarked: 0
    };

    Object.values(this.questionStates).forEach(st => {
      if (st === 'answered') counts.answered++;
      else if (st === 'not-answered') counts.notAnswered++;
      else if (st === 'not-visited') counts.notVisited++;
      else if (st === 'marked') counts.marked++;
      else if (st === 'ans-marked') counts.ansMarked++;
    });

    document.getElementById('legendAnsweredCount').innerText = counts.answered;
    document.getElementById('legendNotAnsweredCount').innerText = counts.notAnswered;
    document.getElementById('legendNotVisitedCount').innerText = counts.notVisited;
    document.getElementById('legendMarkedCount').innerText = counts.marked;
    document.getElementById('legendAnsMarkedCount').innerText = counts.ansMarked;
  }

  // --- Countdown Timer System ---
  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds <= 0) {
        clearInterval(this.timerInterval);
        alert("समय समाप्त हो गया है! (Time Up!) आपकी परीक्षा स्वतः सबमिट की जा रही है।");
        this.finalSubmitExam();
        return;
      }

      this.remainingSeconds--;
      this.timeSpentSeconds++;
      this.updateTimerDisplay();

      // Low time warning (< 5 minutes)
      if (this.remainingSeconds < 300) {
        document.getElementById('timerBox').classList.add('timer-low');
      } else {
        document.getElementById('timerBox').classList.remove('timer-low');
      }

      // Save state every 10 seconds
      if (this.remainingSeconds % 10 === 0) {
        this.saveSession();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const hrs = Math.floor(this.remainingSeconds / 3600);
    const mins = Math.floor((this.remainingSeconds % 3600) / 60);
    const secs = this.remainingSeconds % 60;

    const formatted = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('timerDisplay').innerText = formatted;
  }

  formatTimeSpent(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  }

  // --- Submission Confirmation Modal ---
  confirmSubmit() {
    let answeredCount = 0;
    let unansweredCount = 0;
    let markedCount = 0;

    this.questions.forEach((_, idx) => {
      const st = this.questionStates[idx];
      if (st === 'answered' || st === 'ans-marked') {
        answeredCount++;
      } else {
        unansweredCount++;
      }
      if (st === 'marked' || st === 'ans-marked') {
        markedCount++;
      }
    });

    document.getElementById('modalTotalQ').innerText = this.questions.length;
    document.getElementById('modalAnsweredQ').innerText = answeredCount;
    document.getElementById('modalUnansweredQ').innerText = unansweredCount;
    document.getElementById('modalMarkedQ').innerText = markedCount;
    document.getElementById('modalTimeLeft').innerText = document.getElementById('timerDisplay').innerText;

    document.getElementById('submitModal').classList.remove('hidden');
  }

  closeSubmitModal() {
    document.getElementById('submitModal').classList.add('hidden');
  }

  // --- Final Submit & Result Calculations ---
  finalSubmitExam() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isExamActive = false;
    this.closeSubmitModal();
    this.clearSavedSession();

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const topicStats = {};

    this.questions.forEach((q, idx) => {
      const userAns = this.userAnswers[idx];
      const topic = q.topic || 'सामान्य हिंदी';

      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, answered: 0, correct: 0, wrong: 0 };
      }
      topicStats[topic].total++;

      if (userAns !== undefined && userAns !== null) {
        topicStats[topic].answered++;
        if (userAns === q.answer) {
          correctCount++;
          topicStats[topic].correct++;
        } else {
          wrongCount++;
          topicStats[topic].wrong++;
        }
      } else {
        unansweredCount++;
      }
    });

    const totalQ = this.questions.length;
    const score = correctCount; // +1 per correct answer, no negative marking in TET
    const maxScore = totalQ;
    const percentage = ((score / maxScore) * 100).toFixed(1);
    const attemptedCount = correctCount + wrongCount;
    const accuracy = attemptedCount > 0 ? ((correctCount / attemptedCount) * 100).toFixed(1) : 0;

    // AP TET Qualifying Criteria: OC 60%, BC 50%, SC/ST/PH 40%
    const isPass = percentage >= 40.0;

    // Populate Result View Elements
    document.getElementById('resultMockTitle').innerText = this.activeMockTitle;
    
    const passBadge = document.getElementById('resultPassBadge');
    if (isPass) {
      passBadge.className = 'status-badge-lg pass';
      passBadge.innerText = `उत्तीर्ण (QUALIFIED - ${percentage}%)`;
    } else {
      passBadge.className = 'status-badge-lg fail';
      passBadge.innerText = `अनुत्तीर्ण (NOT QUALIFIED - ${percentage}%)`;
    }

    document.getElementById('resultScore').innerText = score;
    document.getElementById('resultMaxScore').innerText = `/ ${maxScore}`;
    document.getElementById('resultPercentage').innerText = `${percentage}%`;

    document.getElementById('resTotalQ').innerText = totalQ;
    document.getElementById('resCorrectQ').innerText = correctCount;
    document.getElementById('resWrongQ').innerText = wrongCount;
    document.getElementById('resUnansweredQ').innerText = unansweredCount;
    document.getElementById('resTimeTaken').innerText = this.formatTimeSpent(this.timeSpentSeconds);
    document.getElementById('resAccuracy').innerText = `${accuracy}%`;

    // Render Topic Breakdown Table
    const tbody = document.getElementById('topicBreakdownTbody');
    tbody.innerHTML = '';

    Object.keys(topicStats).forEach(tName => {
      const st = topicStats[tName];
      const tAcc = st.answered > 0 ? ((st.correct / st.answered) * 100).toFixed(1) : '0.0';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${tName}</strong></td>
        <td>${st.total}</td>
        <td>${st.answered}</td>
        <td class="text-success font-weight-bold">${st.correct}</td>
        <td class="text-danger font-weight-bold">${st.wrong}</td>
        <td><strong>${tAcc}%</strong></td>
      `;
      tbody.appendChild(tr);
    });

    this.switchView('resultView');
  }

  showResultView() {
    this.switchView('resultView');
  }

  // --- Detailed Review Mode ---
  showReviewMode() {
    this.renderReviewStream('all');
    this.switchView('reviewView');
  }

  renderReviewStream(filter = 'all') {
    const stream = document.getElementById('reviewStream');
    stream.innerHTML = '';

    this.questions.forEach((q, idx) => {
      const userAns = this.userAnswers[idx];
      const isAnswered = (userAns !== undefined && userAns !== null);
      const isCorrect = isAnswered && userAns === q.answer;

      let cardStatus = 'unattempted';
      if (isAnswered) {
        cardStatus = isCorrect ? 'correct' : 'wrong';
      }

      // Filter check
      if (filter === 'correct' && !isCorrect) return;
      if (filter === 'wrong' && (isCorrect || !isAnswered)) return;
      if (filter === 'unattempted' && isAnswered) return;

      const card = document.createElement('div');
      card.className = `review-card ${cardStatus}`;

      let statusBadgeText = 'अनुत्तरित (Unattempted)';
      let statusBadgeClass = 'inline-badge gray';
      if (isAnswered) {
        if (isCorrect) {
          statusBadgeText = 'सही उत्तर (Correct +1.0)';
          statusBadgeClass = 'inline-badge green';
        } else {
          statusBadgeText = 'गलत उत्तर (Wrong 0.0)';
          statusBadgeClass = 'inline-badge red';
        }
      }

      let optionsHtml = '';
      q.options.forEach((optText, optIdx) => {
        let optClass = 'rev-option';
        let icon = '';

        if (optIdx === q.answer) {
          optClass += ' correct-ans';
          icon = '✓ (सही उत्तर)';
        } else if (isAnswered && optIdx === userAns) {
          optClass += ' wrong-ans';
          icon = '✗ (आपका उत्तर)';
        }

        optionsHtml += `
          <div class="${optClass}">
            <span>(${String.fromCharCode(65 + optIdx)}) ${optText}</span>
            <small>${icon}</small>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="review-q-head">
          <div>
            <strong>प्रश्न ${idx + 1}</strong>
            <span class="tag-topic">${q.topic || 'हिंदी'}</span>
          </div>
          <span class="${statusBadgeClass}">${statusBadgeText}</span>
        </div>
        <div class="question-text" style="font-size:1.1rem; margin-bottom:1rem;">${q.question}</div>
        <div class="review-options-list">
          ${optionsHtml}
        </div>
        <div class="explanation-box">
          <strong>व्याख्या (Explanation):</strong><br>
          ${q.explanation || 'व्याख्या उपलब्ध नहीं है।'}
        </div>
      `;

      stream.appendChild(card);
    });
  }

  filterReview(filter, btnElem) {
    document.querySelectorAll('.review-filter-bar .btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
    this.renderReviewStream(filter);
  }

  // --- LocalStorage Session Persistence ---
  saveSession() {
    if (!this.isExamActive) return;

    const sessionData = {
      activeMockTitle: this.activeMockTitle,
      activeMockPath: this.activeMockPath,
      questions: this.questions,
      currentQIndex: this.currentQIndex,
      userAnswers: this.userAnswers,
      questionStates: this.questionStates,
      bookmarks: this.bookmarks,
      remainingSeconds: this.remainingSeconds,
      timeSpentSeconds: this.timeSpentSeconds,
      timestamp: new Date().getTime()
    };

    localStorage.setItem('APTET_HINDI_CBT_SESSION', JSON.stringify(sessionData));
  }

  checkSavedSession() {
    const raw = localStorage.getItem('APTET_HINDI_CBT_SESSION');
    const banner = document.getElementById('resumeBanner');

    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data && data.questions && data.questions.length > 0) {
          document.getElementById('resumeBannerText').innerText = 
            `पिछला सत्र: "${data.activeMockTitle}" | उत्तरित: ${Object.keys(data.userAnswers || {}).length}/${data.questions.length} प्रश्न | शेष समय: ${Math.floor(data.remainingSeconds / 60)} मिनट`;
          banner.classList.remove('hidden');
          return;
        }
      } catch (e) {}
    }
    banner.classList.add('hidden');
  }

  restoreSession() {
    const raw = localStorage.getItem('APTET_HINDI_CBT_SESSION');
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      this.questions = data.questions;
      this.activeMockTitle = data.activeMockTitle;
      this.activeMockPath = data.activeMockPath;
      this.currentQIndex = data.currentQIndex || 0;
      this.userAnswers = data.userAnswers || {};
      this.questionStates = data.questionStates || {};
      this.bookmarks = data.bookmarks || {};
      this.remainingSeconds = data.remainingSeconds || 150 * 60;
      this.timeSpentSeconds = data.timeSpentSeconds || 0;
      this.isExamActive = true;

      document.getElementById('activeMockTitle').innerText = this.activeMockTitle;
      document.getElementById('resumeBanner').classList.add('hidden');

      this.renderQuestion();
      this.renderPalette();
      this.updateLegendCounts();
      this.startTimer();
      this.switchView('examView');
    } catch (e) {
      alert("सत्र पुनर्स्थापित करने में त्रुटि।");
      this.clearSavedSession();
    }
  }

  discardSavedSession() {
    this.clearSavedSession();
    document.getElementById('resumeBanner').classList.add('hidden');
  }

  clearSavedSession() {
    localStorage.removeItem('APTET_HINDI_CBT_SESSION');
  }
}

// Global CBT Engine Instance
let cbtEngine;
document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('APTET_THEME') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  cbtEngine = new CBTEngine();
});
