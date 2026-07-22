# AP TET Paper-II(A) School Assistant Hindi Mock Test Platform

A lightweight, zero-dependency, 100% offline Computer Based Test (CBT) platform tailored specifically for **Andhra Pradesh Teacher Eligibility Test (AP TET) Paper-II(A) School Assistant — Hindi**.

The portal mimics real-world competitive CBT interfaces (like TCS iON & AP Government CBT portals), complete with a live timer, candidate profile header, color-coded question palette, custom submission modals, detailed scorecard analysis, printable report cards, and full review mode with detailed Hindi explanations.

---

## 📁 Project Directory Structure

```
TET/
│
├── index.html                 # Main Single-Page CBT Application Shell
├── style.css                  # Custom CBT Design System (Light/Dark mode, TCS iON Palette)
├── app.js                     # CBT Core Engine (State Manager, Timer, LocalStorage, Result Math)
│
├── data/                      # Mock Test JSON Datasets
│   ├── mock1.json             # AP TET Hindi Full Model Paper 1
│   ├── mock2.json             # Hindi Grammar & Literature Special
│   ├── mock3.json             # Hindi Pedagogy & Comprehension
│   └── previous_year_2024.json# AP TET SA Hindi 2024 Past Paper
│
├── assets/                    # Platform Vector Graphics
│   ├── logo.svg               # AP TET CBT Portal Logo
│   └── candidate_avatar.svg   # Default Candidate Photo Avatar
│
└── README.md                  # Documentation & Adding New Mock Tests Guide
```

---

## 🚀 How to Run the Application

This platform is **100% browser-based and offline**. No Node.js, database, backend server, or installation is required!

1. Double-click `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari).
2. Choose any mock test from the Home screen cards or upload your own custom JSON file.
3. Start practicing!

---

## ➕ How to Add New Mock Tests (Scalability)

The exam engine (`app.js`) is completely decoupled from the question content. Adding new mock tests requires **zero changes to the core code**.

### Step 1: Create a New JSON File
Create a new JSON file inside the `data/` directory (e.g., `data/mock4.json`).

### Step 2: Use the Required JSON Schema
Your JSON file must be an array of question objects adhering to this exact format:

```json
[
  {
    "id": 1,
    "topic": "हिंदी व्याकरण (Grammar)",
    "question": "'कमल' का पर्यायवाची शब्द कौन-सा है?",
    "options": [
      "पेड़",
      "पंकज",
      "नदी",
      "बादल"
    ],
    "answer": 1,
    "explanation": "'पंकज' कमल का पर्यायवाची शब्द है। 'पंक' (कीचड़) + 'ज' (जन्म लेने वाला) अर्थात कीचड़ में जन्म लेने वाला (कमल)।"
  }
]
```

#### JSON Field Specifications:
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Number | Unique sequential question number (1, 2, 3...) |
| `topic` | String | Subject/Topic area (e.g., `हिंदी व्याकरण`, `हिंदी साहित्य`, `भाषा शिक्षण शास्त्र`) |
| `question` | String | Question text in Hindi Unicode (Devanagari) |
| `options` | Array[String] | Array of 4 multiple-choice option strings |
| `answer` | Number | **0-indexed** position of the correct answer in the `options` array (`0` for A, `1` for B, `2` for C, `3` for D) |
| `explanation` | String | Detailed explanation in Hindi displayed during Review Mode |

### Step 3: Make the Mock Test Available
You can load your new mock test in two ways:

1. **Option A (Instant - No Code Required):**
   Use the **"कस्टम JSON टेस्ट फाइल अपलोड करें"** (Upload Custom JSON) button on the Home screen to select `mock4.json` directly from your device.

2. **Option B (Add a Card to `index.html`):**
   Add a card in `index.html` inside `<div class="mock-grid">`:
   ```html
   <div class="mock-card" onclick="cbtEngine.startMock('data/mock4.json', 'Mock Test 4 — Full Syllabus')">
     <div class="card-badge">माडल टेस्ट 4</div>
     <h3 class="card-title">Mock Test 4</h3>
     <p class="card-desc">नवीनतम पाठ्यक्रम आधारित संपूर्ण मॉक टेस्ट</p>
     <div class="card-meta">
       <span>150 मिनट</span>
       <span>बहुविकल्पीय प्रश्न</span>
     </div>
     <button type="button" class="btn btn-primary btn-block">परीक्षा प्रारंभ करें (Start Test)</button>
   </div>
   ```

---

## ⚡ Key Features

* **Real-time CBT Timer**: Configurable 150-minute countdown timer with low-time visual alerts and automatic submission.
* **TCS iON Standard Palette**: 5 visual question states:
  * ⚪ **Gray**: Not Visited
  * 🔴 **Red**: Not Answered
  * 🟢 **Green**: Answered
  * 🟠 **Orange**: Marked for Review
  * 🟣 **Purple**: Answered & Marked for Review
* **Automatic Progress Recovery (localStorage)**: Refreshing or closing the tab will automatically prompt you to resume your exam session with remaining time intact.
* **Keyboard Navigation**:
  * `[N]` or `[Right Arrow]`: Next Question / Save & Next
  * `[P]` or `[Left Arrow]`: Previous Question
  * `[1], [2], [3], [4]`: Select Options A, B, C, D
  * `[M]`: Mark for Review
  * `[C]`: Clear Response
* **Qualifying Score Analysis**: Calculates score, percentage, accuracy, time spent, and qualifying status based on official AP TET cutoff standards (OC: 60%, BC: 50%, SC/ST/PH: 40%).
* **Detailed Hindi Review Mode**: Review every question post-exam with green/red answer indicators and explanations. Filter by correct, incorrect, or unattempted.
* **Printable Scorecard**: Fully styled `@media print` layout for exporting scorecards to PDF or physical printer.
* **Responsive & Accessibility**: Mobile-collapsible question palette drawer, dark mode toggle, and fullscreen mode.

---

## 📜 License
Developed for AP TET Paper-II(A) School Assistant Hindi Candidates. Free to use, adapt, and expand.
