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
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างหัวข้อหลัก (H1) ที่มีข้อความ 'Hello'",
        correct: ["<h1>", "Hello", "</h1>"],
        choices: ["<h1>", "Hello", "</h1>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างย่อหน้า (Paragraph) ที่มีข้อความ 'This is my website'",
        correct: ["<p>", "This is my website", "</p>"],
        choices: ["<p>", "This is my website", "</p>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับทำข้อความตัวหนา (Bold) ที่มีคำว่า 'Important'",
        correct: ["<b>", "Important", "</b>"],
        choices: ["<b>", "Important", "</b>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับทำข้อความตัวเอียง (Italic) ที่มีคำว่า 'Note'",
        correct: ["<i>", "Note", "</i>"],
        choices: ["<i>", "Note", "</i>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับขีดเส้นใต้ (Underline) คำว่า 'Link'",
        correct: ["<u>", "Link", "</u>"],
        choices: ["<u>", "Link", "</u>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างหัวข้อรอง (H2) ที่มีข้อความ 'About Me'",
        correct: ["<h2>", "About Me", "</h2>"],
        choices: ["<h2>", "About Me", "</h2>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับแสดงข้อความขนาดเล็ก (Small) คำว่า '© 2026'",
        correct: ["<small>", "© 2026", "</small>"],
        choices: ["<small>", "© 2026", "</small>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับแสดงรูปแบบโค้ด (Code) ข้อความ 'console.log(1)'",
        correct: ["<code>", "console.log(1)", "</code>"],
        choices: ["<code>", "console.log(1)", "</code>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างหัวข้อระดับ 3 (H3) ที่มีข้อความ 'Details'",
        correct: ["<h3>", "Details", "</h3>"],
        choices: ["<h3>", "Details", "</h3>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับเน้นข้อความสำคัญ (Strong) คำว่า 'Warning!'",
        correct: ["<strong>", "Warning!", "</strong>"],
        choices: ["<strong>", "Warning!", "</strong>"]
    }
];

const mediumLevels = [
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างลิงก์ (Anchor) ข้อความ 'Go to page'",
        correct: ['<a href="#">', "Go to page", "</a>"],
        choices: ['<a href="#">', "Go to page", "</a>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างรายการ (List Item) ข้อความ 'Home'",
        correct: ["<li>", "Home", "</li>"],
        choices: ["<li>", "Home", "</li>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างปุ่ม (Button) ข้อความ 'Submit'",
        correct: ["<button>", "Submit", "</button>"],
        choices: ["<button>", "Submit", "</button>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างกล่องเนื้อหา (Div) ข้อความ 'Content here'",
        correct: ["<div>", "Content here", "</div>"],
        choices: ["<div>", "Content here", "</div>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างแถวตาราง (Table Row) และข้อมูล 'Data'",
        correct: ["<tr>", "<td>", "Data", "</td>", "</tr>"],
        choices: ["<tr>", "<td>", "Data", "</td>", "</tr>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างหัวตาราง (Table Header) ข้อความ 'Name'",
        correct: ["<th>", "Name", "</th>"],
        choices: ["<th>", "Name", "</th>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างช่องกรอกข้อมูลตัวเลข (Input Number)",
        correct: ['<input type="number">'],
        choices: ['<input type="number">']
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างฟอร์ม (Form) ที่มีข้อความ 'Form here'",
        correct: ["<form>", "Form here", "</form>"],
        choices: ["<form>", "Form here", "</form>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างคำพูดอ้างอิง (Blockquote) ข้อความ 'Learning never ends'",
        correct: ["<blockquote>", "Learning never ends", "</blockquote>"],
        choices: ["<blockquote>", "Learning never ends", "</blockquote>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างรายการแบบลำดับเลข (Ordered List) ข้อความ 'Step 1'",
        correct: ["<ol>", "<li>", "Step 1", "</li>", "</ol>"],
        choices: ["<ol>", "<li>", "Step 1", "</li>", "</ol>"]
    }
];

const hardLevels = [
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างหัวข้อ 'Welcome' และปุ่ม 'Start' ต่อท้าย",
        correct: ["<h1>", "Welcome", "</h1>", "<button>", "Start", "</button>"],
        choices: ["<h1>", "Welcome", "</h1>", "<button>", "Start", "</button>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างรูปภาพที่กดคลิกได้ (Link Image)",
        correct: ['<a href="#">', '<img src="img.jpg" alt="image">', "</a>"],
        choices: ['<a href="#">', '<img src="img.jpg" alt="image">', "</a>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างย่อหน้าที่มีคำว่า 'User' เป็นตัวหนา (Hi <b>User</b>)",
        correct: ["<p>", "Hi", "<b>", "User", "</b>", "</p>"],
        choices: ["<p>", "Hi", "<b>", "User", "</b>", "</p>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างรายการแบบไม่ลำดับ (Unordered List) ที่มีรายการ 'Info'",
        correct: ["<ul>", "<li>", "Info", "</li>", "</ul>"],
        choices: ["<ul>", "<li>", "Info", "</li>", "</ul>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างส่วนหัว (Header) ที่มีเมนูนำทาง (Nav) ข้อความ 'Menu'",
        correct: ["<header>", "<nav>", "Menu", "</nav>", "</header>"],
        choices: ["<header>", "<nav>", "Menu", "</nav>", "</header>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างฟอร์มที่มีช่องกรอกรหัสผ่าน (Password Input)",
        correct: ["<form>", '<input type="password">', "</form>"],
        choices: ["<form>", '<input type="password">', "</form>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างกล่องเนื้อหา 'Hello' พร้อมเส้นคั่น (HR) ด้านล่าง",
        correct: ["<div>", "Hello", "<hr>", "</div>"],
        choices: ["<div>", "Hello", "<hr>", "</div>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างตาราง 1 ช่องที่มีข้อความ 'Value'",
        correct: ["<table>", "<tr>", "<td>", "Value", "</td>", "</tr>", "</table>"],
        choices: ["<table>", "<tr>", "<td>", "Value", "</td>", "</tr>", "</table>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างส่วนท้าย (Footer) ที่มีลิขสิทธิ์ '© 2026' ขนาดเล็ก",
        correct: ["<footer>", "<small>", "© 2026", "</small>", "</footer>"],
        choices: ["<footer>", "<small>", "© 2026", "</small>", "</footer>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้าง Label 'Pick color' คู่กับช่องเลือกสี (Input Color)",
        correct: ['<label for="color">', "Pick color", "</label>", '<input id="color" type="color">'],
        choices: ['<label for="color">', "Pick color", "</label>", '<input id="color" type="color">']
    }
];

const expertLevels = [
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างบทความ (Article) ที่มีหัวข้อ 'My Blog' และเนื้อหา",
        correct: ["<article>", "<h2>", "My Blog", "</h2>", "<p>", "Welcome to my blog", "</p>", "</article>"],
        choices: ["<article>", "<h2>", "My Blog", "</h2>", "<p>", "Welcome to my blog", "</p>", "</article>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างแถบข้าง (Aside) ที่มีรายการลิงก์ 'Link'",
        correct: ["<aside>", "<ul>", "<li>", '<a href="#">', "Link", "</a>", "</li>", "</ul>", "</aside>"],
        choices: ["<aside>", "<ul>", "<li>", '<a href="#">', "Link", "</a>", "</li>", "</ul>", "</aside>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างรูปภาพพร้อมคำอธิบาย (Figcaption) 'This is an image'",
        correct: ["<figure>", '<img src="img.jpg" alt="image">', "<figcaption>", "This is an image", "</figcaption>", "</figure>"],
        choices: ["<figure>", '<img src="img.jpg" alt="image">', "<figcaption>", "This is an image", "</figcaption>", "</figure>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับจัดกลุ่มฟอร์ม (Fieldset) หัวข้อ 'Login' และช่องรับข้อมูล",
        correct: ["<fieldset>", "<legend>", "Login", "</legend>", '<input type="text">', "</fieldset>"],
        choices: ["<fieldset>", "<legend>", "Login", "</legend>", '<input type="text">', "</fieldset>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างโครงสร้าง Main และ Section ที่มีหัวข้อ 'Hello'",
        correct: ["<main>", "<section>", "<h1>", "Hello", "</h1>", "</section>", "</main>"],
        choices: ["<main>", "<section>", "<h1>", "Hello", "</h1>", "</section>", "</main>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างตารางที่มีส่วนหัว (Thead) และส่วนข้อมูล (Tbody)",
        correct: ["<table>", "<thead>", "</thead>", "<tbody>", "</tbody>", "</table>"],
        choices: ["<table>", "<thead>", "</thead>", "<tbody>", "</tbody>", "</table>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้าง Nav ที่มีหัวข้อ 'Menu' และรายการ 'Home'",
        correct: ["<nav>", "<h3>", "Menu", "</h3>", "<ul>", "<li>", "Home", "</li>", "</ul>", "</nav>"],
        choices: ["<nav>", "<h3>", "Menu", "</h3>", "<ul>", "<li>", "Home", "</li>", "</ul>", "</nav>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้าง Details ที่มี Summary 'Read more' และข้อความ 'Details here'",
        correct: ["<details>", "<summary>", "Read more", "</summary>", "<p>", "Details here", "</p>", "</details>"],
        choices: ["<details>", "<summary>", "Read more", "</summary>", "<p>", "Details here", "</p>", "</details>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างฟอร์มที่มี Label 'Username', ช่องกรอก และปุ่ม 'Send'",
        correct: ["<form>", '<label for="username">', "Username", "</label>", '<input id="username" type="text">', "<button>", "Send", "</button>", "</form>"],
        choices: ["<form>", '<label for="username">', "Username", "</label>", '<input id="username" type="text">', "<button>", "Send", "</button>", "</form>"]
    },
    {
        question: "จงเลือกชุดคำสั่ง HTML สำหรับสร้างวิดีโอ (Video) ที่รองรับไฟล์หลายนามสกุลและข้อความแจ้งเตือน",
        correct: ['<video controls>', '<source src="v.mp4">', '<source src="v.webm">', "Your browser does not support video", "</video>"],
        choices: ['<video controls>', '<source src="v.mp4">', '<source src="v.webm">', "Your browser does not support video", "</video>"]
    }
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
    if (navCoin) navCoin.innerText = coins;
}

// 🔥 เปลี่ยนโหมดได้อิสระ ไม่รีเซ็ต Round (เรียกใช้เมื่อเปลี่ยน Dropdown)
window.changeDifficulty = function (val) {
    currentDifficulty = val;
    // 🎬 Pulse the wrapper when difficulty changes
    const wrapper = document.querySelector(".game-box-wrapper");
    if (wrapper) {
        wrapper.classList.remove("difficulty-switching");
        void wrapper.offsetWidth;
        wrapper.classList.add("difficulty-switching");
        wrapper.addEventListener("animationend", () => {
            wrapper.classList.remove("difficulty-switching");
        }, { once: true });
    }
    loadLevel();
};

/* =========================
   🚀 ระบบ Skip
   (กดข้ามข้อโดยหักเหรียญ)
========================= */
// เด้งหน้าต่างถามยืนยันการข้าม
window.promptSkip = function () {
    if (isSubmitting) return;
    document.getElementById("skipCostText").innerText = SKIP_COSTS[currentDifficulty];
    document.getElementById("skipConfirmPopup").style.display = "flex";
};

// ดำเนินการหักเหรียญและข้ามข้อ
window.executeSkip = function () {
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
window.goToQuestPage = function () {
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
    pool.forEach((_, i) => { if (!played.includes(i)) avail.push(i); });
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
window.showProgressionPopup = function (isExhausted = false) {
    // เพิ่มบรรทัดนี้ลงไปที่บรรทัดแรกๆ ของฟังก์ชัน เพื่ออัปเดต Quest ตามระดับความยากปัจจุบันที่เพิ่งเล่นผ่าน
    if (typeof window.updateQuestProgress === 'function' && !isExhausted) {
        window.updateQuestProgress(`box-${currentDifficulty}`, 1);
    }

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
window.moveNextDifficulty = function () {
    const order = ["easy", "medium", "hard", "expert"];
    let nextIdx = order.indexOf(currentDifficulty) + 1;
    if (nextIdx < order.length) {
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

    // 🎬 Animation: slide question out → update content → slide in
    const questionEl = document.getElementById("question");
    const choicesDiv = document.getElementById("choices");

    function applyNewContent() {
        // แสดงข้อความคำถาม
        questionEl.innerText = level.question;
        questionEl.classList.remove("question-slide-out");
        questionEl.classList.add("question-slide-in");

        // สร้างกล่องตัวเลือกคำตอบด้านล่าง โดยสุ่มสลับตำแหน่งตลอด
        choicesDiv.innerHTML = "";
        choicesDiv.classList.remove("choices-fade-in");
        let displayChoices = [...new Set(level.choices)].sort(() => Math.random() - 0.5);

        // ใส่ตัวเลือกเข้าไปในกล่อง HTML
        displayChoices.forEach(choice => {
            let btn = document.createElement("div");
            btn.className = "block";
            if (answerList.includes(choice)) {
                btn.classList.add("selected");
            }
            btn.innerText = choice;
            btn.onclick = () => addAnswer(choice, btn);
            choicesDiv.appendChild(btn);
        });

        // trigger reflow แล้วใส่ class animate
        void choicesDiv.offsetWidth;
        choicesDiv.classList.add("choices-fade-in");

        renderAnswer();
        syncGameUI(); // อัปเดต UI
        questionStartTime = Date.now();
        isSubmitting = false;
        saveGameState();

        // ล้าง animation class หลังเล่นเสร็จ
        questionEl.addEventListener("animationend", () => {
            questionEl.classList.remove("question-slide-in");
        }, { once: true });
    }

    // ถ้า question มีข้อความเดิมอยู่ ให้ slide out ก่อน แล้วค่อย slide in
    if (questionEl.innerText && questionEl.innerText !== "Loading...") {
        questionEl.classList.remove("question-slide-in");
        questionEl.classList.add("question-slide-out");
        questionEl.addEventListener("animationend", () => {
            applyNewContent();
        }, { once: true });
    } else {
        applyNewContent();
    }
}


// ฟังก์ชันสำหรับวาดคำตอบด้านบน และคืนค่าสีให้ตัวเลือกด้านล่าง
function renderAnswer() {
    let area = document.getElementById("answerArea");
    area.innerHTML = "";

    // ค้นหาและคืนค่าสีหม่นให้กับปุ่มด้านล่างทั้งหมดก่อน
    const allChoices = document.querySelectorAll("#choices .block");
    allChoices.forEach(btn => {
        if (!answerList.includes(btn.innerText)) {
            btn.classList.remove("selected");
        } else {
            btn.classList.add("selected");
        }
    });

    answerList.forEach(function (value, index) {
        let block = document.createElement("div");
        block.className = "block add";
        block.innerText = value;
        block.onclick = function () {
            removeAt(index);
        };
        area.appendChild(block);
    });
}

// ฟังก์ชันจัดการเมื่อผู้เล่นกดเลือกตัวเลือกด้านล่าง
function addAnswer(value, element) {
    let { pool } = getAvailableQuestions();
    let level = pool[currentLevel];

    if (answerList.length >= level.correct.length || answerList.includes(value)) return;

    answerList.push(value);

    // ใส่สีหม่นให้กับตัวเลือกที่ถูกกด
    if (element) {
        element.classList.add("selected");
    }

    renderAnswer();
}


// ปุ่มควบคุมการจัดการคำตอบ
window.removeLast = function () { answerList.pop(); renderAnswer(); }; // ลบตัวสุดท้าย
window.removeAt = function (index) { answerList.splice(index, 1); renderAnswer(); }; // ลบตัวที่ระบุ
window.resetBoard = function () { answerList = []; renderAnswer(); }; // เคลียร์กระดานคำตอบใหม่หมด

// --------------------------------------------------
// ระบบการกดส่งและตรวจคำตอบ (Submit) โหมด Jigsaws
// --------------------------------------------------
window.submitAnswer = function () {
    if (isSubmitting) return;
    isSubmitting = true;

    let { pool } = getAvailableQuestions();
    let level = pool[currentLevel];
    let result = document.getElementById("result");
    let answerArea = document.getElementById("answerArea");

    function grantAchievement(achId) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let uIdx = users.findIndex(u => u.username === getCurrentUser());
        if (uIdx !== -1) {
            if (!users[uIdx].unlockedAchievements) users[uIdx].unlockedAchievements = [];
            if (!users[uIdx].unlockedAchievements.includes(achId)) {
                users[uIdx].unlockedAchievements.push(achId);
                localStorage.setItem("users", JSON.stringify(users));
                if (typeof window.showAchievementToast === 'function') window.showAchievementToast(achId);
            }
        }
    }

    if (JSON.stringify(answerList) === JSON.stringify(level.correct)) {
        // === ตอบถูกต้อง ===
        // 🟢 เปลี่ยนข้อความตอบถูกให้มี FontAwesome
        if (result) { result.style.color = "#10B981"; result.innerHTML = '<i class="fa-solid fa-circle-check"></i> ถูกต้อง!'; }
        if (answerArea) answerArea.classList.add("correct");

        addScore(currentDifficulty);
        boxCorrectTotal++;
        boxStreak++;
        let timeTaken = (Date.now() - questionStartTime) / 1000;

        grantAchievement("box-first");
        if (boxCorrectTotal >= 5) grantAchievement("box-5");
        if (boxCorrectTotal >= 10) grantAchievement("box-10");
        if (boxStreak >= 3) grantAchievement("box-streak-3");
        if (timeTaken <= 5) grantAchievement("box-speed");

        let users = JSON.parse(localStorage.getItem("users")) || [];
        let uIdx = users.findIndex(u => u.username === getCurrentUser());
        if (uIdx !== -1) {
            let p = users[uIdx].questProgress || {};

            const addQuest = (qId, amt, isMax = false) => {
                if (!p[qId]) p[qId] = { current: 0, claimed: false };
                if (!p[qId].claimed) {
                    if (isMax) { if (amt > p[qId].current) p[qId].current = amt; }
                    else { p[qId].current += amt; }
                }
            };

            addQuest("q_box_5", 1);
            addQuest("q_streak_3", boxStreak, true);
            addQuest("q_score_30", SCORE_MAP[currentDifficulty]);
            addQuest("correct_5_times", 1);

            users[uIdx].questProgress = p;
            localStorage.setItem("users", JSON.stringify(users));
        }

        setTimeout(() => {
            if (result) result.innerHTML = "";
            handleRoundProgress(false);
        }, 800);
    } else {
        // === ตอบผิด ===
        // 🟢 เปลี่ยนข้อความตอบผิดให้มี FontAwesome
        if (result) { result.style.color = "#ef4444"; result.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูก ลองใหม่'; }
        if (answerArea) answerArea.classList.add("wrong");
        boxStreak = 0;

        setTimeout(() => {
            if (answerArea) answerArea.classList.remove("wrong");
            isSubmitting = false;
        }, 400);
    }
};

// ฟังก์ชันปิดหน้าต่าง Pop-up
window.closePopup = function (id) { document.getElementById(id).style.display = "none"; };
window.goHome = function () { window.location.href = "../home.html"; };

// โหลดเกมทันทีเมื่อโหลดไฟล์ JS เสร็จสิ้น
window.onload = function () {
    loadGameState();
    syncGameUI();
    // ❌ ยังไม่ loadLevel()
};

window.startGame = function () {
    document.getElementById("startScreen").style.display = "none";
    loadLevel(); // เริ่มเกม
};