/* ==========================================
   BOXGAME JS - FULL PERSISTENCE & SCORE SYSTEM
========================================== */

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
   GAME STATE
========================= */
const MAX_PLAYED_PER_DIFF = 5;
let currentDifficulty = "easy";
let currentLevel = 0;
let answerList = [];
let isSubmitting = false;

let easyPlayed = [];
let mediumPlayed = [];
let hardPlayed = [];
let expertPlayed = [];

// สถิติสำหรับ Achievement & Quest
let boxCorrectTotal = 0;
let boxStreak = 0;
let questionStartTime = 0;

/* =========================
   💾 ระบบ Persistence (บันทึกสถานะ)
========================= */

function saveGameState() {
    const state = {
        currentDifficulty: currentDifficulty,
        currentLevel: currentLevel,
        easyPlayed: easyPlayed,
        mediumPlayed: mediumPlayed,
        hardPlayed: hardPlayed,
        expertPlayed: expertPlayed,
        boxCorrectTotal: boxCorrectTotal,
        boxStreak: boxStreak
    };
    const loggedInUser = localStorage.getItem("loggedInUser") || "Guest";
    localStorage.setItem(`boxgame_persistence_${loggedInUser}`, JSON.stringify(state));
}

function loadGameState() {
    const loggedInUser = localStorage.getItem("loggedInUser") || "Guest";
    const saved = localStorage.getItem(`boxgame_persistence_${loggedInUser}`);
    if (saved) {
        const state = JSON.parse(saved);
        currentDifficulty = state.currentDifficulty || "easy";
        currentLevel = state.currentLevel || 0;
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

/* =========================
   🚀 ระบบ Skip (หักเหรียญ x1)
========================= */

function skipLevel() {
    if (isSubmitting) return;

    let cost = 0;
    if (currentDifficulty === "easy") {
        cost = 10;
    } else if (currentDifficulty === "medium") {
        cost = 20;
    } else if (currentDifficulty === "hard") {
        cost = 30;
    } else if (currentDifficulty === "expert") {
        cost = 40;
    }

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert("กรุณาล็อกอินก่อนใช้งานระบบ Skip");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(function(u) {
        return u.username === loggedInUser;
    });

    if (userIndex !== -1) {
        let user = users[userIndex];
        
        if (user.coins >= cost) {
            isSubmitting = true;
            user.coins -= cost;
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            
            const coinDisplay = document.querySelector('.coin-display strong');
            if (coinDisplay) {
                coinDisplay.innerText = user.coins;
            }

            document.getElementById("result").innerText = `ข้ามด่านสำเร็จ! (-${cost} Coins)`;
            document.getElementById("result").style.color = "#f59e0b";

            setTimeout(function() {
                boxStreak = 0; // ข้ามด่านโดนตัด Streak
                let next = getRandomLevelByDifficulty();
                if (next === -1) {
                    if (currentDifficulty === "easy") {
                        currentDifficulty = "medium";
                    } else if (currentDifficulty === "medium") {
                        currentDifficulty = "hard";
                    } else if (currentDifficulty === "hard") {
                        currentDifficulty = "expert";
                    } else {
                        showFinishPopup();
                        isSubmitting = false;
                        return;
                    }
                    currentLevel = getRandomLevelByDifficulty();
                } else {
                    currentLevel = next;
                }
                
                loadLevel();
                document.getElementById("result").innerText = "";
                isSubmitting = false;
            }, 800);

        } else {
            document.getElementById("result").innerText = `เหรียญไม่พอ! (ต้องการ ${cost} Coins)`;
            document.getElementById("result").style.color = "#ef4444";
            isSubmitting = false;
        }
    }
}

/* =========================
   CORE LOGIC
========================= */

function getRandomLevelByDifficulty() {
    let pool, played;
    if (currentDifficulty === "easy") {
        pool = easyLevels;
        played = easyPlayed;
    } else if (currentDifficulty === "medium") {
        pool = mediumLevels;
        played = mediumPlayed;
    } else if (currentDifficulty === "hard") {
        pool = hardLevels;
        played = hardPlayed;
    } else {
        pool = expertLevels;
        played = expertPlayed;
    }

    if (played.length >= MAX_PLAYED_PER_DIFF) return -1;

    let rand;
    do {
        rand = Math.floor(Math.random() * pool.length);
    } while (played.includes(rand));
    
    played.push(rand);
    return rand;
}

function getCurrentLevelData() {
    if (currentDifficulty === "easy") return easyLevels[currentLevel];
    if (currentDifficulty === "medium") return mediumLevels[currentLevel];
    if (currentDifficulty === "hard") return hardLevels[currentLevel];
    return expertLevels[currentLevel];
}

function loadLevel() {
    const area = document.getElementById('answerArea');
    if (area) area.classList.remove("correct", "wrong");
    answerList = [];

    const level = getCurrentLevelData();
    const totalPlayed = easyPlayed.length + mediumPlayed.length + hardPlayed.length + expertPlayed.length;

    document.getElementById("levelTitle").innerText = `Level: ${totalPlayed} / 20`;
    document.getElementById("question").innerText = level.question;

    let choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";
    
    let displayChoices = [...new Set(level.choices)];
    displayChoices.sort(function() { return Math.random() - 0.5; });

    displayChoices.forEach(function(choice) {
        let btn = document.createElement("div");
        btn.className = "block";
        btn.innerText = choice;
        btn.onclick = function() { addAnswer(choice); };
        choicesDiv.appendChild(btn);
    });

    renderAnswer();
    
    questionStartTime = Date.now();
    saveGameState(); 

    // ดึง UI คะแนนมาโชว์ล่าสุด (มาจาก data.js)
    if (typeof updateScoreUI === "function") {
        updateScoreUI();
    }
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
    let level = getCurrentLevelData();
    if (answerList.length >= level.correct.length) return;
    if (answerList.includes(value)) return;
    answerList.push(value);
    renderAnswer();
}

function removeLast() { answerList.pop(); renderAnswer(); }
function removeAt(index) { answerList.splice(index, 1); renderAnswer(); }
function resetBoard() { answerList = []; renderAnswer(); }

function submitAnswer() {
    if (isSubmitting) return;
    isSubmitting = true;

    let level = getCurrentLevelData();
    let result = document.getElementById("result");
    let answerArea = document.getElementById("answerArea");

    if (JSON.stringify(answerList) === JSON.stringify(level.correct)) {
        result.style.color = "#10B981";
        result.innerText = "ถูกต้อง!";
        answerArea.classList.add("correct");

        // 1. เพิ่มคะแนน (ฟังก์ชันจาก data.js)
        if (typeof addScore === "function") {
            addScore(currentDifficulty);
        }

        // 2. ระบบ Achievement
        boxCorrectTotal++;
        boxStreak++;
        let timeTaken = (Date.now() - questionStartTime) / 1000;

        if (typeof window.unlockAchievement === "function") {
            window.unlockAchievement("code-first");
            if (boxCorrectTotal >= 5) window.unlockAchievement("code-correct-5");
            if (boxCorrectTotal >= 10) {
                window.unlockAchievement("code-correct-10");
                window.unlockAchievement("code-master");
            }
            if (boxStreak >= 3) window.unlockAchievement("word-3");
            if (timeTaken <= 5) window.unlockAchievement("code-speed");
            
            let answerStr = answerList.join(" ").toLowerCase();
            if (answerStr.includes("if")) window.unlockAchievement("code-if");
            if (answerStr.includes("for") || answerStr.includes("while")) window.unlockAchievement("code-loop");
            if (answerStr.includes("[") || answerStr.includes("array")) window.unlockAchievement("code-array");
        }

        // 3. ระบบ Quest
        if (typeof window.updateQuestProgress === "function") {
            window.updateQuestProgress("q_box_3", 1);
            window.updateQuestProgress("q_streak_3", boxStreak);
            let earnedScore = 1;
            if(currentDifficulty === "medium") earnedScore = 2;
            if(currentDifficulty === "hard") earnedScore = 3;
            if(currentDifficulty === "expert") earnedScore = 4;
            window.updateQuestProgress("q_score_50", earnedScore);
            
            let answerStr = answerList.join("").toLowerCase();
            if (answerStr.includes("<h1>")) {
                window.updateQuestProgress("q_box_h1", 1);
            }
        }

        setTimeout(function() {
            let next = getRandomLevelByDifficulty();
            if (next === -1) {
                if (currentDifficulty === "easy") currentDifficulty = "medium";
                else if (currentDifficulty === "medium") currentDifficulty = "hard";
                else if (currentDifficulty === "hard") currentDifficulty = "expert";
                else { showFinishPopup(); isSubmitting = false; return; }
                currentLevel = getRandomLevelByDifficulty();
            } else {
                currentLevel = next;
            }
            loadLevel();
            result.innerText = "";
            isSubmitting = false;
        }, 800);
    } else {
        result.style.color = "#ef4444";
        result.innerText = "ยังไม่ถูก ลองใหม่";
        answerArea.classList.add("wrong");
        boxStreak = 0; // ตอบผิดตัด Streak 
        setTimeout(function() {
            answerArea.classList.remove("wrong");
            isSubmitting = false;
        }, 400);
    }
}

function showFinishPopup() {
    const loggedInUser = localStorage.getItem("loggedInUser") || "Guest";
    document.getElementById("finishPopup").style.display = "flex";
    localStorage.removeItem(`boxgame_persistence_${loggedInUser}`); // เล่นจบแล้วล้างข้อมูลที่ค้างไว้
}

function playAgain() {
    const loggedInUser = localStorage.getItem("loggedInUser") || "Guest";
    localStorage.removeItem(`boxgame_persistence_${loggedInUser}`);
    location.reload();
}

function goHome() { window.location.href = "../Home.html"; }

function closePopup() { 
    document.getElementById("finishPopup").style.display = "none"; 
}

window.onload = function() {
    if (!loadGameState()) {
        currentLevel = getRandomLevelByDifficulty();
    }
    loadLevel();
};