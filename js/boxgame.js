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
        question: "คุณกำลังสร้างหน้าเว็บแนะนำตัว และต้องการแสดงข้อความ 'Hello' เป็นหัวข้อหลักที่ใหญ่ที่สุดบนหน้าเว็บ",
        correct: ["<h1>", "Hello", "</h1>"],
        choices: ["<h1>", "Hello", "</h1>", "<p>"]
    },
    {
        question: "คุณต้องการเขียนข้อความธรรมดาเป็นเนื้อหาอธิบายใต้หัวข้อ โดยใช้คำว่า 'This is my website'",
        correct: ["<p>", "This is my website", "</p>"],
        choices: ["<p>", "This is my website", "</p>", "<h1>"]
    },
    {
        question: "คุณต้องการเน้นคำว่า 'Important' ให้เป็นตัวหนา เพื่อให้ผู้ใช้เห็นเด่นชัด",
        correct: ["<b>", "Important", "</b>"],
        choices: ["<b>", "Important", "</b>", "<i>"]
    },
    {
        question: "คุณต้องการทำข้อความ 'Note' ให้เป็นตัวเอียง เพื่อใช้เป็นคำอธิบายเพิ่มเติม",
        correct: ["<i>", "Note", "</i>"],
        choices: ["<i>", "Note", "</i>", "<u>"]
    },
    {
        question: "คุณต้องการขีดเส้นใต้คำว่า 'Link' เพื่อให้ดูเหมือนข้อความสำคัญ",
        correct: ["<u>", "Link", "</u>"],
        choices: ["<u>", "Link", "</u>", "<b>"]
    },
    {
        question: "คุณต้องการสร้างหัวข้อรองสำหรับหัวข้อย่อย โดยใช้ข้อความว่า 'About Me'",
        correct: ["<h2>", "About Me", "</h2>"],
        choices: ["<h2>", "About Me", "</h2>", "<h1>"]
    },
    {
        question: "คุณต้องการแสดงข้อความลิขสิทธิ์ '© 2026' ให้มีขนาดเล็กกว่าปกติ",
        correct: ["<small>", "© 2026", "</small>"],
        choices: ["<small>", "© 2026", "</small>", "<p>"]
    },
    {
        question: "คุณต้องการแสดงโค้ดตัวอย่าง เช่น 'console.log(1)' ให้มีรูปแบบเหมือนโค้ด",
        correct: ["<code>", "console.log(1)", "</code>"],
        choices: ["<code>", "console.log(1)", "</code>", "<p>"]
    },
    {
        question: "คุณต้องการสร้างหัวข้อย่อยขนาดเล็กลงอีกระดับหนึ่ง โดยใช้ข้อความ 'Details'",
        correct: ["<h3>", "Details", "</h3>"],
        choices: ["<h3>", "Details", "</h3>", "<h2>"]
    },
    {
        question: "คุณต้องการเน้นข้อความ 'Warning!' ให้มีความสำคัญมากกว่าปกติ",
        correct: ["<strong>", "Warning!", "</strong>"],
        choices: ["<strong>", "Warning!", "</strong>", "<b>"]
    }
];

const mediumLevels = [
    {
        question: "คุณต้องการสร้างลิงก์ให้ผู้ใช้กดเพื่อไปยังหน้าอื่น โดยแสดงคำว่า 'Go to page'",
        correct: ['<a href="#">', "Go to page", "</a>"],
        choices: ['<a href="#">', "Go to page", "</a>", "<p>"]
    },
    {
        question: "คุณกำลังสร้างรายการเมนู และต้องการเพิ่มรายการชื่อ 'Home' ลงไปใน list",
        correct: ["<li>", "Home", "</li>"],
        choices: ["<li>", "Home", "</li>", "<ul>"]
    },
    {
        question: "คุณต้องการสร้างปุ่มให้ผู้ใช้กด โดยแสดงข้อความ 'Submit'",
        correct: ["<button>", "Submit", "</button>"],
        choices: ["<button>", "Submit", "</button>", "<a>"]
    },
    {
        question: "คุณต้องการสร้างกล่องสำหรับใส่เนื้อหา เช่น 'Content here'",
        correct: ["<div>", "Content here", "</div>"],
        choices: ["<div>", "Content here", "</div>", "<span>"]
    },
    {
        question: "คุณกำลังสร้างตาราง และต้องการเพิ่มแถวที่มีข้อมูลคำว่า 'Data'",
        correct: ["<tr>", "Data", "</tr>"],
        choices: ["<tr>", "Data", "</tr>", "<td>"]
    },
    {
        question: "คุณต้องการสร้างหัวตารางที่แสดงคำว่า 'Name'",
        correct: ["<th>", "Name", "</th>"],
        choices: ["<th>", "Name", "</th>", "<td>"]
    },
    {
        question: "คุณต้องการสร้างช่องกรอกตัวเลข เช่น อายุ",
        correct: ['<input type="number">'],
        choices: ['<input type="number">', '<input type="text">', '<button>']
    },
    {
        question: "คุณต้องการสร้างฟอร์มสำหรับกรอกข้อมูล โดยมีข้อความ 'Form here'",
        correct: ["<form>", "Form here", "</form>"],
        choices: ["<form>", "Form here", "</form>", "<div>"]
    },
    {
        question: "คุณต้องการแสดงคำพูดอ้างอิง เช่น 'Learning never ends'",
        correct: ["<blockquote>", "Learning never ends", "</blockquote>"],
        choices: ["<blockquote>", "Learning never ends", "</blockquote>", "<p>"]
    },
    {
        question: "คุณต้องการสร้างรายการแบบตัวเลข เช่น 'Step 1'",
        correct: ["<ol>", "Step 1", "</ol>"],
        choices: ["<ol>", "Step 1", "</ol>", "<ul>"]
    }
];

const hardLevels = [
    {
        question: "คุณกำลังสร้างหน้าเว็บ และต้องการแสดงหัวข้อ 'Welcome' จากนั้นมีปุ่ม 'Start' อยู่ถัดลงมา เพื่อให้ผู้ใช้กดเริ่มใช้งาน",
        correct: ["<h1>", "Welcome", "</h1>", "<button>", "Start", "</button>"],
        choices: ["<h1>", "Welcome", "</h1>", "<button>", "Start", "</button>", "<p>"]
    },
    {
        question: "คุณต้องการให้รูปภาพสามารถคลิกได้ โดยเมื่อกดที่รูปจะทำหน้าที่เป็นลิงก์",
        correct: ['<a href="#">', '<img src="img.jpg">', "</a>"],
        choices: ['<a href="#">', '<img src="img.jpg">', "</a>", "<div>"]
    },
    {
        question: "คุณต้องการเขียนประโยค 'Hi User' โดยให้คำว่า 'User' เป็นตัวหนาอยู่ภายในย่อหน้า",
        correct: ["<p>", "Hi", "<b>", "User", "</b>", "</p>"],
        choices: ["<p>", "Hi", "<b>", "User", "</b>", "</p>", "<i>"]
    },
    {
        question: "คุณกำลังสร้างเมนูรายการ และต้องการให้มี list ที่ภายในมีรายการชื่อ 'Info'",
        correct: ["<ul>", "<li>", "Info", "</li>", "</ul>"],
        choices: ["<ul>", "<li>", "Info", "</li>", "</ul>", "<ol>"]
    },
    {
        question: "คุณต้องการสร้างส่วนหัวของเว็บไซต์ (header) และภายในมีเมนูนำทางชื่อ 'Menu'",
        correct: ["<header>", "<nav>", "Menu", "</nav>", "</header>"],
        choices: ["<header>", "<nav>", "Menu", "</nav>", "</header>", "<div>"]
    },
    {
        question: "คุณต้องการสร้างฟอร์มที่มีช่องกรอกรหัสผ่าน เพื่อให้ผู้ใช้พิมพ์ password",
        correct: ["<form>", '<input type="password">', "</form>"],
        choices: ["<form>", '<input type="password">', "</form>", "<input>"]
    },
    {
        question: "คุณต้องการสร้างกล่องข้อความที่มีเนื้อหา 'Hello' และมีเส้นคั่นด้านล่าง",
        correct: ["<div>", "Hello", "<hr>", "</div>"],
        choices: ["<div>", "Hello", "<hr>", "</div>", "<p>"]
    },
    {
        question: "คุณกำลังสร้างตาราง และต้องการมี 1 แถว 1 ช่อง ที่แสดงคำว่า 'Value'",
        correct: ["<table>", "<tr>", "<td>", "Value", "</td>", "</tr>", "</table>"],
        choices: ["<table>", "<tr>", "<td>", "Value", "</td>", "</tr>", "</table>", "<div>"]
    },
    {
        question: "คุณต้องการสร้างส่วนท้ายของเว็บไซต์ โดยแสดงข้อความลิขสิทธิ์ '© 2026' ด้วยตัวอักษรขนาดเล็ก",
        correct: ["<footer>", "<small>", "© 2026", "</small>", "</footer>"],
        choices: ["<footer>", "<small>", "© 2026", "</small>", "</footer>", "<p>"]
    },
    {
        question: "คุณต้องการสร้าง label ที่มีข้อความ 'Pick color' และมีช่องเลือกสีอยู่ถัดไป",
        correct: ["<label>", "Pick color", "</label>", '<input type="color">'],
        choices: ["<label>", "Pick color", "</label>", '<input type="color">', "<input>"]
    }
];

const expertLevels = [
    {
        question: "คุณกำลังสร้างบทความบนเว็บ โดยมีหัวข้อ 'My Blog' และมีเนื้อหา 'Welcome to my blog' อยู่ภายใน article",
        correct: ["<article>", "<h2>", "My Blog", "</h2>", "<p>", "Welcome to my blog", "</p>", "</article>"],
        choices: ["<article>", "<h2>", "My Blog", "</h2>", "<p>", "Welcome to my blog", "</p>", "</article>", "<div>"]
    },
    {
        question: "คุณต้องการสร้าง sidebar (aside) ที่มีรายการลิงก์ชื่อ 'Link' อยู่ภายใน list",
        correct: ["<aside>", "<ul>", "<li>", "<a>", "Link", "</a>", "</li>", "</ul>", "</aside>"],
        choices: ["<aside>", "<ul>", "<li>", "<a>", "Link", "</a>", "</li>", "</ul>", "</aside>", "<nav>"]
    },
    {
        question: "คุณต้องการแสดงรูปภาพพร้อมคำอธิบายใต้รูป โดยใช้ข้อความ 'This is image'",
        correct: ["<figure>", '<img src="img.jpg">', "<figcaption>", "This is image", "</figcaption>", "</figure>"],
        choices: ["<figure>", '<img src="img.jpg">', "<figcaption>", "This is image", "</figcaption>", "</figure>", "<p>"]
    },
    {
        question: "คุณต้องการจัดกลุ่มข้อมูลในฟอร์ม โดยมีหัวข้อ 'Login' และมีช่อง input อยู่ด้านใน",
        correct: ["<fieldset>", "<legend>", "Login", "</legend>", "<input>", "</fieldset>"],
        choices: ["<fieldset>", "<legend>", "Login", "</legend>", "<input>", "</fieldset>", "<form>"]
    },
    {
        question: "คุณกำลังสร้างโครงสร้างหลักของหน้าเว็บ โดยมี main และภายในมี section ที่มีหัวข้อ 'Hello'",
        correct: ["<main>", "<section>", "<h1>", "Hello", "</h1>", "</section>", "</main>"],
        choices: ["<main>", "<section>", "<h1>", "Hello", "</h1>", "</section>", "</main>", "<div>"]
    },
    {
        question: "คุณต้องการสร้างตารางที่มีส่วนหัว (thead) และส่วนข้อมูล (tbody) ครบโครงสร้าง",
        correct: ["<table>", "<thead>", "</thead>", "<tbody>", "</tbody>", "</table>"],
        choices: ["<table>", "<thead>", "</thead>", "<tbody>", "</tbody>", "</table>", "<tr>"]
    },
    {
        question: "คุณต้องการสร้างเมนูนำทาง (nav) ที่มี label 'Menu' และรายการ 'Home' อยู่ภายใน list",
        correct: ["<nav>", "<label>", "Menu", "</label>", "<ul>", "<li>", "Home", "</li>", "</ul>", "</nav>"],
        choices: ["<nav>", "<label>", "Menu", "</label>", "<ul>", "<li>", "Home", "</li>", "</ul>", "</nav>", "<div>"]
    },
    {
        question: "คุณต้องการสร้างส่วนที่สามารถกดเพื่อแสดง/ซ่อนเนื้อหา โดยมีหัวข้อ 'Read more' และข้อความ 'Details here'",
        correct: ["<details>", "<summary>", "Read more", "</summary>", "<p>", "Details here", "</p>", "</details>"],
        choices: ["<details>", "<summary>", "Read more", "</summary>", "<p>", "Details here", "</p>", "</details>", "<span>"]
    },
    {
        question: "คุณต้องการสร้างฟอร์มที่มี label 'Username' ช่องกรอกข้อความ และปุ่ม 'Send'",
        correct: ["<form>", "<label>", "Username", "</label>", '<input type="text">', "<button>", "Send", "</button>", "</form>"],
        choices: ["<form>", "<label>", "Username", "</label>", '<input type="text">', "<button>", "Send", "</button>", "</form>", "<input>"]
    },
    {
        question: "คุณต้องการแสดงวิดีโอที่รองรับหลายไฟล์ และมีข้อความ fallback กรณีโหลดไม่ได้",
        correct: ["<video>", '<source src="v.mp4">', '<source src="v.webm">', "Your browser does not support video", "</video>"],
        choices: ["<video>", '<source src="v.mp4">', '<source src="v.webm">', "Your browser does not support video", "</video>", "<audio>"]
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
        // ตรวจสอบว่าคำตอบนี้ถูกเลือกอยู่หรือไม่ ถ้าใช่ให้ใส่ class 'selected'
        if (answerList.includes(choice)) {
            btn.classList.add("selected");
        }
        btn.innerText = choice;
        btn.onclick = () => addAnswer(choice, btn); // ส่ง element btn เข้าไปด้วย
        choicesDiv.appendChild(btn);
    });

    renderAnswer();
    syncGameUI(); // อัปเดต UI 
    questionStartTime = Date.now(); // เริ่มจับเวลา (ไว้แจก Achievement ตอบไว)
    isSubmitting = false;
    saveGameState(); // เซฟเกม
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

    answerList.forEach(function(value, index) {
        let block = document.createElement("div");
        block.className = "block add";
        block.innerText = value;
        block.onclick = function() { 
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
    syncGameUI();
    // ❌ ยังไม่ loadLevel()
};

window.startGame = function() {
    document.getElementById("startScreen").style.display = "none";
    loadLevel(); // เริ่มเกม
};