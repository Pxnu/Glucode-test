/* ==========================================
   BOXGAME JS - FULL (มีระบบจำโจทย์ปัจจุบัน & สลับโหมดอิสระ)
========================================== */

// --- 1. DATA SYSTEM ---
const SCORE_MAP = { easy: 1, medium: 2, hard: 3, expert: 4 };

function getCurrentUser() { return localStorage.getItem("loggedInUser") || "Guest"; }

function loadScore() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.username === getCurrentUser());
    return user && user.scoreBox ? user.scoreBox : 0;
}

function saveScore(newScore) {
    const username = getCurrentUser();
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userIndex = users.findIndex(u => u.username === username);
    if (userIndex !== -1) {
        users[userIndex].scoreBox = newScore;
        users[userIndex].score = (users[userIndex].scoreDuo || 0) + newScore;
        localStorage.setItem("users", JSON.stringify(users));
    }
}

function addScore(difficulty) {
    let currentScore = loadScore();
    currentScore += SCORE_MAP[difficulty] || 1;
    saveScore(currentScore);
}

/* =========================
   LEVEL DATA
========================= */
const easyLevels = [
    { question: "สร้างหัวข้อหลัก (Main Heading)", correct: ["<h1>", "My Website", "</h1>"], choices: ["</h1>", "<h1>", "My Website"] },
    { question: "สร้างย่อหน้าเนื้อหา", correct: ["<p>", "This is a paragraph.", "</p>"], choices: ["</p>", "This is a paragraph.", "<p>"] },
    { question: "ทำให้ข้อความเป็นตัวหนา", correct: ["<b>", "Warning", "</b>"], choices: ["Warning", "</b>", "<b>"] },
    { question: "สร้างตัวเอียง", correct: ["<i>", "Italic Text", "</i>"], choices: ["</i>", "<i>", "Italic Text"] },
    { question: "ขีดเส้นใต้คำ", correct: ["<u>", "Underline", "</u>"], choices: ["Underline", "</u>", "<u>"] },
    { question: "สร้างหัวข้อรองระดับ 2", correct: ["<h2>", "Topic", "</h2>"], choices: ["Topic", "</h2>", "<h2>"] },
    { question: "ใช้ Tag Strong", correct: ["<strong>", "Alert!", "</strong>"], choices: ["<strong>", "Alert!", "</strong>"] },
    { question: "สร้างข้อความตัวเล็ก", correct: ["<small>", "Copyright", "</small>"], choices: ["</small>", "<small>", "Copyright"] },
    { question: "แสดง Code", correct: ["<code>", "print('Hi')", "</code>"], choices: ["<code>", "print('Hi')", "</code>"] },
    { question: "สร้างหัวข้อระดับ 3", correct: ["<h3>", "Title", "</h3>"], choices: ["Title", "</h3>", "<h3>"] }
];

const mediumLevels = [
    { question: "สร้างลิงก์ไป Google", correct: ['<a href="https://google.com">', "Google", "</a>"], choices: ["</a>", "Google", '<a href="https://google.com">'] },
    { question: "สร้างรายการ (List Item)", correct: ["<li>", "Item 1", "</li>"], choices: ["</li>", "Item 1", "<li>"] },
    { question: "สร้างปุ่ม Submit", correct: ["<button>", "Click Me", "</button>"], choices: ["Click Me", "</button>", "<button>"] },
    { question: "สร้างกล่อง Div", correct: ["<div>", "Content", "</div>"], choices: ["</div>", "Content", "<div>"] },
    { question: "สร้างแถวตาราง (tr)", correct: ["<tr>", "Data", "</tr>"], choices: ["</tr>", "Data", "<tr>"] },
    { question: "สร้างหัวตาราง (th)", correct: ["<th>", "Name", "</th>"], choices: ["</th>", "<th>", "Name"] },
    { question: "สร้างช่องรับตัวเลข", correct: ['<input type="number">'], choices: ['<input type="number">'] },
    { question: "สร้างฟอร์ม (Form)", correct: ["<form>", "Form Content", "</form>"], choices: ["</form>", "Form Content", "<form>"] },
    { question: "สร้างคำพูดอ้างอิง", correct: ["<blockquote>", "Quote", "</blockquote>"], choices: ["<blockquote>", "Quote", "</blockquote>"] },
    { question: "สร้างรายการแบบตัวเลข (ol)", correct: ["<ol>", "Item", "</ol>"], choices: ["</ol>", "<ol>", "Item"] }
];

const hardLevels = [
    { question: "สร้างหัวข้อ (h1) และปุ่มต่อกัน", correct: ["<h1>", "Title", "</h1>", "<button>", "OK", "</button>"], choices: ["</button>", "<h1>", "OK", "Title", "</h1>", "<button>"] },
    { question: "สร้างลิงก์ที่หุ้มรูปภาพ", correct: ['<a href="#">', '<img src="pic.jpg">', "</a>"], choices: ["</a>", '<img src="pic.jpg">', '<a href="#">'] },
    { question: "สร้างย่อหน้าที่มีตัวหนาข้างใน", correct: ["<p>", "Hi", "<b>", "User", "</b>", "</p>"], choices: ["</b>", "<p>", "Hi", "User", "</p>", "<b>"] },
    { question: "สร้างรายการแบบ ul > li", correct: ["<ul>", "<li>", "Info", "</li>", "</ul>"], choices: ["</li>", "<ul>", "Info", "</ul>", "<li>"] },
    { question: "สร้าง header > nav", correct: ["<header>", "<nav>", "Menu", "</nav>", "</header>"], choices: ["</nav>", "<header>", "Menu", "</header>", "<nav>"] },
    { question: "สร้างฟอร์มที่มีรหัสผ่านและปุ่ม", correct: ["<form>", '<input type="password">', "<button>", "Go", "</button>", "</form>"], choices: ["<form>", "Go", "</button>", '<input type="password">', "</form>", "<button>"] },
    { question: "สร้างกล่องที่มีเส้นคั่น (div > hr)", correct: ["<div>", "Text", "<hr>", "</div>"], choices: ["<hr>", "<div>", "</div>", "Text"] },
    { question: "สร้างตารางย่อ (table > tr > td)", correct: ["<table>", "<tr>", "<td>", "Val", "</td>", "</tr>", "</table>"], choices: ["</td>", "<table>", "</tr>", "<td>", "Val", "<tr>", "</table>"] },
    { question: "สร้าง Footer พร้อมตัวเล็ก", correct: ["<footer>", "<small>", "Copy", "</small>", "</footer>"], choices: ["<footer>", "</small>", "Copy", "</footer>", "<small>"] },
    { question: "สร้าง Label คู่กับช่องเลือกสี", correct: ["<label>", "Color", "</label>", '<input type="color">'], choices: ["Color", "</label>", '<input type="color">', "<label>"] }
];

const expertLevels = [
    { question: "สร้างโครงสร้างบทความ (Article)", correct: ["<article>", "<h2>", "Title", "</h2>", "<p>", "Text", "</p>", "</article>"], choices: ["<p>", "</article>", "<h2>", "Title", "</h2>", "Text", "<article>", "</p>"] },
    { question: "สร้างแถบด้านข้าง (Aside)", correct: ["<aside>", "<ul>", "<li>", "<a>", "Link", "</a>", "</li>", "</ul>", "</aside>"], choices: ["<li>", "</a>", "<ul>", "<a>", "Link", "</aside>", "<aside>", "</li>", "</ul>"] },
    { question: "สร้าง Figure พร้อมคำบรรยาย", correct: ["<figure>", '<img src="img.jpg">', "<figcaption>", "Caption", "</figcaption>", "</figure>"], choices: ["<figcaption>", "Caption", "</figure>", '<img src="img.jpg">', "</figcaption>", "<figure>"] },
    { question: "สร้างแบบฟอร์ม Fieldset", correct: ["<fieldset>", "<legend>", "Login", "</legend>", "<input>", "</fieldset>"], choices: ["<input>", "<legend>", "</fieldset>", "<fieldset>", "Login", "</legend>"] },
    { question: "สร้าง Main และ Section", correct: ["<main>", "<section>", "<h1>", "Hi", "</h1>", "</section>", "</main>"], choices: ["</main>", "<h1>", "<section>", "<main>", "Hi", "</h1>", "</section>"] },
    { question: "สร้างตาราง thead และ tbody", correct: ["<table>", "<thead>", "<tr>", "<th>", "ID", "</th>", "</tr>", "</thead>", "<tbody>", "</tbody>", "</table>"], choices: ["<thead>", "</th>", "<tbody>", "<table>", "<tr>", "ID", "</th>", "</tr>", "</thead>", "<th>", "</table>", "<tbody>"] },
    { question: "สร้าง nav ที่มีป้ายชื่อ label", correct: ["<nav>", "<label>", "Menu", "</label>", "<ul>", "<li>", "Home", "</li>", "</ul>", "</nav>"], choices: ["</nav>", "<li>", "<label>", "Home", "</li>", "<nav>", "Menu", "</label>", "<ul>", "</ul>"] },
    { question: "สร้างส่วน Details", correct: ["<details>", "<summary>", "Read More", "</summary>", "<p>", "Content", "</p>", "</details>"], choices: ["<details>", "</summary>", "Content", "</details>", "<p>", "<summary>", "Read More", "</p>"] },
    { question: "สร้างฟอร์ม Label ผูกกับ Input", correct: ["<form>", "<label>", "Username", "</label>", '<input type="text">', "<button>", "Send", "</button>", "</form>"], choices: ["<button>", "<label>", "Username", "</label>", "Send", "</form>", "<form>", '<input type="text">', "</button>"] },
    { question: "สร้าง Video พร้อมไฟล์สำรอง", correct: ["<video>", '<source src="v.mp4">', '<source src="v.webm">', "Error", "</video>"], choices: ["<video>", "Error", '<source src="v.webm">', "</video>", '<source src="v.mp4">'] }
];

/* =========================
   GAME STATE & LOGIC
========================= */
const ROUND_LIMIT = 5;
const SKIP_COSTS = { easy: 10, medium: 20, hard: 30, expert: 40 };

let currentDifficulty = "easy";
let currentLevel = 0;
let answerList = [];
let isSubmitting = false;

// 🔥 แยกนับรอบของแต่ละโหมด
let playedInRound = { easy: 0, medium: 0, hard: 0, expert: 0 };
// 🔥 ล็อกข้อปัจจุบันไว้กันรีเฟรชหน้าจอ (-1 คือยังไม่มีข้อค้าง)
let activeQuestion = { easy: -1, medium: -1, hard: -1, expert: -1 };

let easyPlayed = [], mediumPlayed = [], hardPlayed = [], expertPlayed = [];
let boxCorrectTotal = 0, boxStreak = 0, questionStartTime = 0;

/* =========================
   💾 Persistence & Sync
========================= */
function saveGameState() {
    const state = {
        currentDifficulty, playedInRound, activeQuestion,
        easyPlayed, mediumPlayed, hardPlayed, expertPlayed,
        boxCorrectTotal, boxStreak
    };
    localStorage.setItem(`boxgame_persistence_${getCurrentUser()}`, JSON.stringify(state));
}

function loadGameState() {
    const saved = localStorage.getItem(`boxgame_persistence_${getCurrentUser()}`);
    if (saved) {
        const state = JSON.parse(saved);
        currentDifficulty = state.currentDifficulty || "easy";
        
        // แปลงรูปแบบเก่าให้เป็นแบบใหม่
        if (typeof state.playedInRound === 'number') playedInRound = { easy: state.playedInRound, medium: 0, hard: 0, expert: 0 };
        else playedInRound = state.playedInRound || { easy: 0, medium: 0, hard: 0, expert: 0 };

        activeQuestion = state.activeQuestion || { easy: -1, medium: -1, hard: -1, expert: -1 };
        
        easyPlayed = state.easyPlayed || [];
        mediumPlayed = state.mediumPlayed || [];
        hardPlayed = state.hardPlayed || [];
        expertPlayed = state.expertPlayed || [];
        boxCorrectTotal = state.boxCorrectTotal || 0;
        boxStreak = state.boxStreak || 0;
        return true;
    }
    return false;
}

function syncGameUI() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.username === getCurrentUser());
    let coins = user ? (user.coins || 0) : 0;

    let round = playedInRound[currentDifficulty] + 1;
    if (round > ROUND_LIMIT) round = ROUND_LIMIT;

    document.getElementById("coinDisplay").innerHTML = `<i class="fa-solid fa-coins"></i> ${coins}`;
    document.getElementById("scoreDisplay").innerText = `Score: ${loadScore()}`;
    document.getElementById("levelDisplay").innerText = `Round: ${round} / ${ROUND_LIMIT}`;
    document.getElementById("difficultySelect").value = currentDifficulty;
    
    let navCoin = document.querySelector('.coin-display strong');
    if(navCoin) navCoin.innerText = coins;
}

// 🔥 เปลี่ยนโหมดได้อิสระ ไม่รีเซ็ต Round
window.changeDifficulty = function(val) {
    currentDifficulty = val;
    loadLevel();
};

/* =========================
   🚀 ระบบ Skip
========================= */
window.promptSkip = function() {
    if (isSubmitting) return;
    document.getElementById("skipCostText").innerText = SKIP_COSTS[currentDifficulty];
    document.getElementById("skipConfirmPopup").style.display = "flex";
};

window.executeSkip = function() {
    const cost = SKIP_COSTS[currentDifficulty];
    const loggedInUser = getCurrentUser();
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(u => u.username === loggedInUser);

    if (userIndex !== -1 && users[userIndex].coins >= cost) {
        users[userIndex].coins -= cost;
        localStorage.setItem('users', JSON.stringify(users));
        
        closePopup('skipConfirmPopup');
        boxStreak = 0; 
        
        let result = document.getElementById("result");
        result.innerText = `ข้ามด่านสำเร็จ! (-${cost} Coins)`;
        result.style.color = "#f59e0b";
        
        isSubmitting = true;
        setTimeout(() => {
            result.innerText = "";
            handleRoundProgress(true); 
        }, 1000);
    } else {
        alert("เหรียญไม่พอข้ามด่าน!");
        closePopup('skipConfirmPopup');
    }
};

/* =========================
   CORE LOGIC
========================= */
function getAvailableQuestions() {
    let pool = currentDifficulty === "easy" ? easyLevels : currentDifficulty === "medium" ? mediumLevels : currentDifficulty === "hard" ? hardLevels : expertLevels;
    let played = currentDifficulty === "easy" ? easyPlayed : currentDifficulty === "medium" ? mediumPlayed : currentDifficulty === "hard" ? hardPlayed : expertPlayed;
    
    let avail = [];
    pool.forEach((_, i) => { if(!played.includes(i)) avail.push(i); });
    return { avail, pool, played };
}

function handleRoundProgress(isSkip = false) {
    // เคลียร์โจทย์ปัจจุบันทิ้งเพราะทำผ่าน/ข้ามแล้ว
    activeQuestion[currentDifficulty] = -1; 
    playedInRound[currentDifficulty]++;
    syncGameUI();
    
    if (playedInRound[currentDifficulty] >= ROUND_LIMIT) {
        showProgressionPopup();
    } else {
        loadLevel();
    }
    isSubmitting = false;
    saveGameState();
}

window.showProgressionPopup = function(isExhausted = false) {
    let { avail } = getAvailableQuestions();
    let popup = document.getElementById("progressionPopup");
    let title = document.getElementById("progTitle");
    let desc = document.getElementById("progDesc");
    let btnContainer = document.getElementById("progBtns");
    btnContainer.innerHTML = "";
    
    if (isExhausted || avail.length === 0) {
        title.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> 🚧 โหมดนี้เล่นครบแล้ว!`;
        desc.innerText = `คุณเล่นโจทย์ ${currentDifficulty.toUpperCase()} ครบทั้งหมดแล้ว ไประดับต่อไปกันเถอะ`;
    } else {
        title.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> 🎉 คุณเล่นผ่านระดับนี้แล้ว!`;
        desc.innerText = `สามารถไปด่านถัดไป หรือจะฝึกระดับ ${currentDifficulty.toUpperCase()} ต่อดี?`;
        
        let btnStay = document.createElement("button");
        btnStay.className = "btn-cancel";
        btnStay.innerHTML = `<i class="fa-solid fa-rotate-right"></i> เล่น ${currentDifficulty} ต่อ`;
        btnStay.onclick = () => { playedInRound[currentDifficulty] = 0; closePopup('progressionPopup'); loadLevel(); };
        btnContainer.appendChild(btnStay);
    }

    let btnNext = document.createElement("button");
    btnNext.className = "btn-primary";
    
    if (currentDifficulty === "expert" && avail.length === 0) {
        document.getElementById("gameClearPopup").style.display = "flex";
        localStorage.removeItem(`boxgame_persistence_${getCurrentUser()}`);
        return;
    } else {
        btnNext.innerHTML = `ไปด่านถัดไป <i class="fa-solid fa-arrow-right"></i>`;
        btnNext.onclick = () => moveNextDifficulty();
    }
    
    btnContainer.appendChild(btnNext);
    popup.style.display = "flex";
};

window.moveNextDifficulty = function() {
    const order = ["easy", "medium", "hard", "expert"];
    let nextIdx = order.indexOf(currentDifficulty) + 1;
    if(nextIdx < order.length) {
        playedInRound[currentDifficulty] = 0; // ล้างรอบของโหมดนี้ทิ้ง
        currentDifficulty = order[nextIdx];
        closePopup('progressionPopup');
        loadLevel();
    } else {
        closePopup('progressionPopup');
        document.getElementById("gameClearPopup").style.display = "flex";
        localStorage.removeItem(`boxgame_persistence_${getCurrentUser()}`);
    }
};

function loadLevel() {
    if (playedInRound[currentDifficulty] >= ROUND_LIMIT) {
        showProgressionPopup();
        return;
    }

    const area = document.getElementById('answerArea');
    if (area) area.classList.remove("correct", "wrong");
    answerList = [];

    let { avail, played, pool } = getAvailableQuestions();
    
    // 🔥 ตรวจสอบว่ามีโจทย์ค้างอยู่ไหม ถ้ารีเฟรชมาจะดึงข้อเดิมมาทำ
    if (activeQuestion[currentDifficulty] !== -1) {
        currentLevel = activeQuestion[currentDifficulty];
    } else {
        // ถ้าไม่มีโจทย์ค้างและโจทย์หมด
        if (avail.length === 0) {
            showProgressionPopup(true);
            return;
        }
        // สุ่มโจทย์ใหม่
        currentLevel = avail[Math.floor(Math.random() * avail.length)];
        played.push(currentLevel);
        activeQuestion[currentDifficulty] = currentLevel; // ล็อกข้อไว้
    }

    const level = pool[currentLevel];
    document.getElementById("question").innerText = level.question;

    let choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";
    let displayChoices = [...new Set(level.choices)].sort(() => Math.random() - 0.5);

    displayChoices.forEach(choice => {
        let btn = document.createElement("div");
        btn.className = "block";
        btn.innerText = choice;
        btn.onclick = () => addAnswer(choice);
        choicesDiv.appendChild(btn);
    });

    renderAnswer();
    syncGameUI();
    questionStartTime = Date.now();
    isSubmitting = false;
    saveGameState();
}

function renderAnswer() {
    let area = document.getElementById("answerArea");
    area.innerHTML = "";
    answerList.forEach(function(value, index) {
        let block = document.createElement("div");
        block.className = "block add";
        block.innerText = value;
        block.onclick = function() { removeAt(index); };
        area.appendChild(block);
    });
}

function addAnswer(value) {
    let { pool } = getAvailableQuestions();
    let level = pool[currentLevel];
    if (answerList.length >= level.correct.length || answerList.includes(value)) return;
    answerList.push(value);
    renderAnswer();
}

window.removeLast = function() { answerList.pop(); renderAnswer(); };
window.removeAt = function(index) { answerList.splice(index, 1); renderAnswer(); };
window.resetBoard = function() { answerList = []; renderAnswer(); };

window.submitAnswer = function() {
    if (isSubmitting) return;
    isSubmitting = true;

    let { pool } = getAvailableQuestions();
    let level = pool[currentLevel];
    let result = document.getElementById("result");
    let answerArea = document.getElementById("answerArea");

    if (JSON.stringify(answerList) === JSON.stringify(level.correct)) {
        result.style.color = "#10B981";
        result.innerText = "ถูกต้อง!";
        answerArea.classList.add("correct");

        addScore(currentDifficulty);

        boxCorrectTotal++;
        boxStreak++;
        let timeTaken = (Date.now() - questionStartTime) / 1000;
        
        if (typeof window.unlockAchievement === "function") {
            window.unlockAchievement("code-first");
            if (boxCorrectTotal >= 5) window.unlockAchievement("code-correct-5");
            if (boxCorrectTotal >= 10) { window.unlockAchievement("code-correct-10"); window.unlockAchievement("code-master"); }
            if (boxStreak >= 3) window.unlockAchievement("word-3");
            if (timeTaken <= 5) window.unlockAchievement("code-speed");
            let answerStr = answerList.join(" ").toLowerCase();
            if (answerStr.includes("if")) window.unlockAchievement("code-if");
            if (answerStr.includes("for") || answerStr.includes("while")) window.unlockAchievement("code-loop");
            if (answerStr.includes("[") || answerStr.includes("array")) window.unlockAchievement("code-array");
        }
        if (typeof window.updateQuestProgress === "function") {
            window.updateQuestProgress("q_box_3", 1);
            window.updateQuestProgress("q_streak_3", boxStreak);
            let earnedScore = SCORE_MAP[currentDifficulty];
            window.updateQuestProgress("q_score_50", earnedScore);
            let answerStr = answerList.join("").toLowerCase();
            if (answerStr.includes("<h1>")) window.updateQuestProgress("q_box_h1", 1);
        }

        setTimeout(() => {
            result.innerText = "";
            handleRoundProgress(false); 
        }, 800);
    } else {
        result.style.color = "#ef4444";
        result.innerText = "ยังไม่ถูก ลองใหม่";
        answerArea.classList.add("wrong");
        boxStreak = 0; 
        setTimeout(() => { answerArea.classList.remove("wrong"); isSubmitting = false; }, 400);
    }
};

window.closePopup = function(id) { document.getElementById(id).style.display = "none"; };
window.goHome = function() { window.location.href = "../Home.html"; };

window.onload = function() {
    loadGameState();
    loadLevel();
    syncGameUI();
};