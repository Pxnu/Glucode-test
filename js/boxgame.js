/* ==========================================
   BOXGAME JS - FULL (มีระบบจำโจทย์ปัจจุบัน & สลับโหมดอิสระ)
   (ไฟล์นี้รวมชุดข้อมูลโจทย์ data.js เข้ามาไว้ด้วยกันแล้ว)
========================================== */

// --- 1. DATA SYSTEM ---
// ระบบจัดการคะแนนและดึงข้อมูลผู้ใช้
const SCORE_MAP = { easy: 1, medium: 2, hard: 3, expert: 4 }; // คะแนนที่จะได้ในแต่ละความยาก

function getCurrentUser() { return localStorage.getItem("loggedInUser") || "Guest"; }

// ฟังก์ชันโหลดคะแนนเฉพาะโหมด BoxGame ของผู้เล่น
function loadScore() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.username === getCurrentUser());
    return user && user.scoreBox ? user.scoreBox : 0;
}

// ฟังก์ชันเซฟคะแนนกลับลงไปใน LocalStorage
function saveScore(newScore) {
    const username = getCurrentUser();
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userIndex = users.findIndex(u => u.username === username);
    if (userIndex !== -1) {
        users[userIndex].scoreBox = newScore;
        users[userIndex].score = (users[userIndex].scoreDuo || 0) + newScore; // รวมยอดคะแนน 2 โหมด
        localStorage.setItem("users", JSON.stringify(users));
    }
}

// ฟังก์ชันบวกคะแนนหลังจากตอบถูก
function addScore(difficulty) {
    let currentScore = loadScore();
    currentScore += SCORE_MAP[difficulty] || 1;
    saveScore(currentScore);
}

/* =========================
   LEVEL DATA
   (ข้อมูลโจทย์ทั้งหมดของแต่ละระดับความยาก)
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
    { question: "สร้างตาราง thead และ tbody", correct: ["<table>", "<thead>", "<tr>", "<th>", "ID", "</th>", "</tr>", "</thead>", "<tbody>", "</tbody>", "</table>"], choices: ["<thead>", "</th>", "<tbody>", "<table>", "<tr>", "ID", "</th>", "</tr>", "</thead>", "<th>", "</table>", "</tbody>"] },
    { question: "สร้าง nav ที่มีป้ายชื่อ label", correct: ["<nav>", "<label>", "Menu", "</label>", "<ul>", "<li>", "Home", "</li>", "</ul>", "</nav>"], choices: ["</nav>", "<li>", "<label>", "Home", "</li>", "<nav>", "Menu", "</label>", "<ul>", "</ul>"] },
    { question: "สร้างส่วน Details", correct: ["<details>", "<summary>", "Read More", "</summary>", "<p>", "Content", "</p>", "</details>"], choices: ["<details>", "</summary>", "Content", "</details>", "<p>", "<summary>", "Read More", "</p>"] },
    { question: "สร้างฟอร์ม Label ผูกกับ Input", correct: ["<form>", "<label>", "Username", "</label>", '<input type="text">', "<button>", "Send", "</button>", "</form>"], choices: ["<button>", "<label>", "Username", "</label>", "Send", "</form>", "<form>", '<input type="text">', "</button>"] },
    { question: "สร้าง Video พร้อมไฟล์สำรอง", correct: ["<video>", '<source src="v.mp4">', '<source src="v.webm">', "Error", "</video>"], choices: ["<video>", "Error", '<source src="v.webm">', "</video>", '<source src="v.mp4">'] }
];

/* =========================
   GAME STATE & LOGIC
   (ตัวแปรควบคุมสถานะเกม)
========================= */
const ROUND_LIMIT = 5; // กำหนดว่าต้องเล่นผ่านกี่ข้อถึงจะผ่านด่าน (5-Step)
const SKIP_COSTS = { easy: 10, medium: 20, hard: 30, expert: 40 }; // ราคาเหรียญในการกดข้ามแต่ละด่าน

let currentDifficulty = "easy";
let currentLevel = 0;
let answerList = [];
let isSubmitting = false;

// 🔥 แยกนับรอบของแต่ละโหมด (เก็บว่าเล่นไปกี่ข้อแล้วในแต่ละความยาก)
let playedInRound = { easy: 0, medium: 0, hard: 0, expert: 0 };
// 🔥 ล็อกข้อปัจจุบันไว้กันรีเฟรชหน้าจอ (-1 คือยังไม่มีข้อค้าง หรือเพิ่งผ่านข้อที่แล้ว)
let activeQuestion = { easy: -1, medium: -1, hard: -1, expert: -1 };

// เก็บประวัติ Index ข้อที่เล่นผ่านไปแล้วในแต่ละโหมด เพื่อป้องกันการสุ่มเจอข้อเดิม
let easyPlayed = [], mediumPlayed = [], hardPlayed = [], expertPlayed = [];
let boxCorrectTotal = 0, boxStreak = 0, questionStartTime = 0; // ตัวแปรสำหรับภารกิจ/Achievement

/* =========================
   💾 Persistence & Sync
   (ระบบจำสถานะเกมและซิงค์ UI)
========================= */
// เซฟข้อมูลสถานะทั้งหมดลง LocalStorage
function saveGameState() {
    const state = {
        currentDifficulty, playedInRound, activeQuestion,
        easyPlayed, mediumPlayed, hardPlayed, expertPlayed,
        boxCorrectTotal, boxStreak
    };
    localStorage.setItem(`boxgame_persistence_${getCurrentUser()}`, JSON.stringify(state));
}

// โหลดข้อมูลสถานะกลับมาตอนโหลดหน้าเว็บ
function loadGameState() {
    const saved = localStorage.getItem(`boxgame_persistence_${getCurrentUser()}`);
    if (saved) {
        const state = JSON.parse(saved);
        currentDifficulty = state.currentDifficulty || "easy";
        
        // แปลงรูปแบบเก่าให้เป็นแบบใหม่ (เพื่อรองรับการอัปเดตโค้ด)
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

// อัปเดตข้อมูลบนหน้าจอ (คะแนน, เหรียญ, ความคืบหน้ารอบปัจจุบัน)
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
    
    // อัปเดตตัวเลขเหรียญบน Navbar ด้านบนด้วย
    let navCoin = document.querySelector('.coin-display strong');
    if(navCoin) navCoin.innerText = coins;
}

// 🔥 เปลี่ยนโหมดได้อิสระ ไม่รีเซ็ต Round (เรียกใช้เมื่อเปลี่ยน Dropdown)
window.changeDifficulty = function(val) {
    currentDifficulty = val;
    loadLevel();
};

/* =========================
   🚀 ระบบ Skip
   (กดข้ามข้อโดยหักเหรียญ)
========================= */
// เด้งหน้าต่างถามยืนยันการข้าม
window.promptSkip = function() {
    if (isSubmitting) return;
    document.getElementById("skipCostText").innerText = SKIP_COSTS[currentDifficulty];
    document.getElementById("skipConfirmPopup").style.display = "flex";
};

// ดำเนินการหักเหรียญและข้ามข้อ
window.executeSkip = function() {
    const cost = SKIP_COSTS[currentDifficulty];
    const loggedInUser = getCurrentUser();
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(u => u.username === loggedInUser);

    if (userIndex !== -1 && users[userIndex].coins >= cost) {
        users[userIndex].coins -= cost; // หักเหรียญ
        localStorage.setItem('users', JSON.stringify(users));
        
        closePopup('skipConfirmPopup'); // ปิดหน้าต่างยืนยัน
        boxStreak = 0; // กดข้ามถือว่าคอมโบขาด
        
        // แจ้งข้อความข้ามด่านสำเร็จ
        let result = document.getElementById("result");
        result.innerText = `ข้ามด่านสำเร็จ! (-${cost} Coins)`;
        result.style.color = "#f59e0b";
        
        isSubmitting = true;
        setTimeout(() => {
            result.innerText = "";
            handleRoundProgress(true); // เปลี่ยนข้อ (ข้าม)
        }, 1000);
    } else {
        // 🟢 เปลี่ยนจาก alert() เป็นเปิด Popup โชว์ว่าเหรียญไม่พอ
        closePopup('skipConfirmPopup'); // ปิดหน้าต่างยืนยันก่อน
        const emptyDesc = document.getElementById("coinEmptyDesc");
        if (emptyDesc) emptyDesc.innerText = `การข้ามด่านนี้ต้องใช้ ${cost} Coins (คุณมี ${(users[userIndex] ? users[userIndex].coins : 0)} Coins)`;
        document.getElementById("coinEmptyPopup").style.display = "flex";
    }
};

// 🟢 ฟังก์ชันสำหรับปุ่ม "ไปหน้า Quest"
window.goToQuestPage = function() {
    // ปรับเส้นทางให้ถูกต้องตามโครงสร้างโฟลเดอร์ของคุณ
    window.location.href = "../Glucode quest/quest.html"; 
};

/* =========================
   CORE LOGIC
   (ระบบการทำงานหลักของเกม)
========================= */
// ฟังก์ชันดึงชุดคำถามและหาข้อที่ยังไม่ได้เล่น
function getAvailableQuestions() {
    let pool = currentDifficulty === "easy" ? easyLevels : currentDifficulty === "medium" ? mediumLevels : currentDifficulty === "hard" ? hardLevels : expertLevels;
    let played = currentDifficulty === "easy" ? easyPlayed : currentDifficulty === "medium" ? mediumPlayed : currentDifficulty === "hard" ? hardPlayed : expertPlayed;
    
    let avail = [];
    // นำ Index ที่ยังไม่เคยเล่นไปใส่ไว้ใน avail
    pool.forEach((_, i) => { if(!played.includes(i)) avail.push(i); });
    return { avail, pool, played };
}

// ฟังก์ชันจัดการเมื่อจบข้อใดข้อนึง (ไม่ว่าจะตอบถูกหรือกดข้าม)
function handleRoundProgress(isSkip = false) {
    // เคลียร์โจทย์ปัจจุบันทิ้งเพราะทำผ่าน/ข้ามแล้ว
    activeQuestion[currentDifficulty] = -1; 
    playedInRound[currentDifficulty]++; // นับข้อเพิ่ม
    syncGameUI(); // อัปเดต UI
    
    // ถ้าเล่นครบ 5 ข้อแล้ว (ตามตัวแปร ROUND_LIMIT) ให้โชว์หน้าต่างพักครึ่ง
    if (playedInRound[currentDifficulty] >= ROUND_LIMIT) {
        showProgressionPopup();
    } else {
        // ถ้ายะงไม่ครบ ก็โหลดข้อถัดไป
        loadLevel();
    }
    isSubmitting = false;
    saveGameState();
}

// หน้าต่างแสดงความยินดีเมื่อผ่านครบ 5 ข้อ (Progression Popup)
window.showProgressionPopup = function(isExhausted = false) {
    let { avail } = getAvailableQuestions();
    let popup = document.getElementById("progressionPopup");
    let title = document.getElementById("progTitle");
    let desc = document.getElementById("progDesc");
    let btnContainer = document.getElementById("progBtns");
    btnContainer.innerHTML = ""; // ล้างปุ่มเก่า
    
    // ถ้าระดับความยากนี้ไม่มีโจทย์เหลือให้เล่นแล้ว
    if (isExhausted || avail.length === 0) {
        title.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> 🚧 โหมดนี้เล่นครบแล้ว!`;
        desc.innerText = `คุณเล่นโจทย์ ${currentDifficulty.toUpperCase()} ครบทั้งหมดแล้ว ไประดับต่อไปกันเถอะ`;
    } else {
        // ถ้าโจทย์ยังเหลือ
        title.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> 🎉 คุณเล่นผ่านระดับนี้แล้ว!`;
        desc.innerText = `สามารถไปด่านถัดไป หรือจะฝึกระดับ ${currentDifficulty.toUpperCase()} ต่อดี?`;
        
        // สร้างปุ่มให้เลือกเล่นระดับเดิมต่อ
        let btnStay = document.createElement("button");
        btnStay.className = "btn-cancel";
        btnStay.innerHTML = `<i class="fa-solid fa-rotate-right"></i> เล่น ${currentDifficulty} ต่อ`;
        btnStay.onclick = () => { playedInRound[currentDifficulty] = 0; closePopup('progressionPopup'); loadLevel(); };
        btnContainer.appendChild(btnStay);
    }

    // สร้างปุ่ม "ไปด่านถัดไป"
    let btnNext = document.createElement("button");
    btnNext.className = "btn-primary";
    
    // ถ้าจบโหมด Expert แล้ว และไม่มีโจทย์เหลือ ให้จบเกมโดยสมบูรณ์
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

// ฟังก์ชันสำหรับกระโดดไปความยากระดับต่อไป
window.moveNextDifficulty = function() {
    const order = ["easy", "medium", "hard", "expert"];
    let nextIdx = order.indexOf(currentDifficulty) + 1;
    if(nextIdx < order.length) {
        playedInRound[currentDifficulty] = 0; // ล้างรอบของโหมดปัจจุบันทิ้ง
        currentDifficulty = order[nextIdx]; // เปลี่ยนเป็นหมวดต่อไป
        closePopup('progressionPopup');
        loadLevel(); // โหลดด่านใหม่
    } else {
        // ถ้าถึงระดับสุดยอดแล้ว ให้โชว์หน้าจบเกม
        closePopup('progressionPopup');
        document.getElementById("gameClearPopup").style.display = "flex";
        localStorage.removeItem(`boxgame_persistence_${getCurrentUser()}`);
    }
};

// ฟังก์ชันโหลดโจทย์มาแสดงผลบนหน้าจอ
function loadLevel() {
    // ดักไว้เผื่อมีบัค ถ้าเล่นเกิน 5 ข้อแล้ว ให้โชว์หน้าต่างพักครึ่ง
    if (playedInRound[currentDifficulty] >= ROUND_LIMIT) {
        showProgressionPopup();
        return;
    }

    // ล้างช่องใส่คำตอบ และคลาสสีแดง/เขียวออก
    const area = document.getElementById('answerArea');
    if (area) area.classList.remove("correct", "wrong");
    answerList = [];

    let { avail, played, pool } = getAvailableQuestions();
    
    // 🔥 ตรวจสอบว่ามีโจทย์ค้างอยู่ไหม ถ้ารีเฟรชหน้าเว็บมา จะได้ดึงข้อเดิมที่ค้างอยู่มาให้ทำต่อ ไม่สุ่มหนี
    if (activeQuestion[currentDifficulty] !== -1) {
        currentLevel = activeQuestion[currentDifficulty];
    } else {
        // ถ้าไม่มีโจทย์ค้าง และโจทย์ในหมวดนี้หมดแล้ว ให้โชว์แจ้งเตือน
        if (avail.length === 0) {
            showProgressionPopup(true);
            return;
        }
        // สุ่มโจทย์ใหม่จากข้อที่ยังไม่เคยเล่น
        currentLevel = avail[Math.floor(Math.random() * avail.length)];
        played.push(currentLevel); // บันทึกว่าข้อนี้ถูกสุ่มไปแล้ว
        activeQuestion[currentDifficulty] = currentLevel; // ล็อกข้อไว้กันผู้เล่นกด F5 หนี
    }

    const level = pool[currentLevel];
    // แสดงข้อความคำถาม
    document.getElementById("question").innerText = level.question;

    // สร้างกล่องตัวเลือกคำตอบด้านล่าง โดยสุ่มสลับตำแหน่งตลอด
    let choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";
    let displayChoices = [...new Set(level.choices)].sort(() => Math.random() - 0.5);

    // ใส่ตัวเลือกเข้าไปในกล่อง HTML
    displayChoices.forEach(choice => {
        let btn = document.createElement("div");
        btn.className = "block";
        btn.innerText = choice;
        btn.onclick = () => addAnswer(choice); // เมื่อกด จะเอาคำตอบส่งไปข้างบน
        choicesDiv.appendChild(btn);
    });

    renderAnswer();
    syncGameUI(); // อัปเดต UI 
    questionStartTime = Date.now(); // เริ่มจับเวลา (ไว้แจก Achievement ตอบไว)
    isSubmitting = false;
    saveGameState(); // เซฟเกม
}

// ฟังก์ชันสำหรับวาดกล่องคำตอบที่ผู้เล่นกดเลือกไว้ในด้านบน
function renderAnswer() {
    let area = document.getElementById("answerArea");
    area.innerHTML = "";
    answerList.forEach(function(value, index) {
        let block = document.createElement("div");
        block.className = "block add";
        block.innerText = value;
        block.onclick = function() { removeAt(index); }; // กดที่บล็อกเพื่อลบมันออกได้
        area.appendChild(block);
    });
}

// ฟังก์ชันจัดการเมื่อผู้เล่นกดเลือกตัวเลือกด้านล่าง
function addAnswer(value) {
    let { pool } = getAvailableQuestions();
    let level = pool[currentLevel];
    // ดักไม่ให้เพิ่มคำตอบเกินจำนวนช่องเฉลย หรือเพิ่มตัวที่เลือกไปแล้วซ้ำอีก
    if (answerList.length >= level.correct.length || answerList.includes(value)) return;
    answerList.push(value);
    renderAnswer();
}

// ปุ่มควบคุมการจัดการคำตอบ
window.removeLast = function() { answerList.pop(); renderAnswer(); }; // ลบตัวสุดท้าย
window.removeAt = function(index) { answerList.splice(index, 1); renderAnswer(); }; // ลบตัวที่ระบุ
window.resetBoard = function() { answerList = []; renderAnswer(); }; // เคลียร์กระดานคำตอบใหม่หมด

// ฟังก์ชันสำหรับส่งคำตอบและตรวจความถูกต้อง
window.submitAnswer = function() {
    if (isSubmitting) return; // กันกดปุ่มรัว
    isSubmitting = true;

    let { pool } = getAvailableQuestions();
    let level = pool[currentLevel];
    let result = document.getElementById("result");
    let answerArea = document.getElementById("answerArea");

    // ตรวจสอบความถูกต้องของคำตอบ (แปลงเป็นข้อความและเปรียบเทียบ)
    if (JSON.stringify(answerList) === JSON.stringify(level.correct)) {
        // === กรณีตอบถูก ===
        result.style.color = "#10B981";
        result.innerText = "ถูกต้อง!";
        answerArea.classList.add("correct");

        addScore(currentDifficulty); // บวกคะแนน

        boxCorrectTotal++;
        boxStreak++;
        let timeTaken = (Date.now() - questionStartTime) / 1000; // คิดเวลาที่ใช้ตอบ
        
        // ส่งค่าไปให้ระบบ Achievement ตรวจสอบการปลดล็อกฉายาและเควสต์
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

        // รอสักพักแล้วเปลี่ยนข้อ
        setTimeout(() => {
            result.innerText = "";
            handleRoundProgress(false); 
        }, 800);
    } else {
        // === กรณีตอบผิด ===
        result.style.color = "#ef4444";
        result.innerText = "ยังไม่ถูก ลองใหม่";
        answerArea.classList.add("wrong");
        boxStreak = 0; // ทำลายคอมโบ
        // ลบสีแดงออก ให้ตอบใหม่
        setTimeout(() => { answerArea.classList.remove("wrong"); isSubmitting = false; }, 400);
    }
};

// ฟังก์ชันปิดหน้าต่าง Pop-up
window.closePopup = function(id) { document.getElementById(id).style.display = "none"; };
window.goHome = function() { window.location.href = "../Home.html"; };

// โหลดเกมทันทีเมื่อโหลดไฟล์ JS เสร็จสิ้น
window.onload = function() {
    loadGameState();
    loadLevel();
    syncGameUI();
};