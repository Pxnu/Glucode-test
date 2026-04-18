/* ==========================================
   DUO JS - FULL LOGIC (Original UI Compatible)
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem("loggedInUser");
    if (!currentUser) return;

    let currentStage = 1;
    let currentQuestionIndex = -1; // ตัวจำโจทย์
    const maxStage = 10;
    let correctAnswer = "";
    let isSubmitting = false;

    let duoCorrectTotal = 0;
    let duoStreak = 0;
    let questionStartTime = 0;

    const quizData = {
        level1: [
            { tags: ["<h1>", "Welcome", "</h1>"], hint: "สร้างหัวเรื่องใหญ่ 'Welcome'" },
            { tags: ["<p>", "Hello World", "</p>"], hint: "สร้างย่อหน้าข้อความ 'Hello World'" },
            { tags: ["<button>", "Submit", "</button>"], hint: "สร้างปุ่ม 'Submit'" },
            { tags: ["<div>", "Box", "</div>"], hint: "สร้างกล่องที่มีข้อความ 'Box'" },
            { tags: ["<span>", "Text", "</span>"], hint: "สร้าง span ที่มี 'Text'" },
            { tags: ["<h2>", "Title", "</h2>"], hint: "สร้างหัวข้อย่อย 'Title'" },
            { tags: ["<a href='#'>", "Link", "</a>"], hint: "สร้างลิงก์ที่มีข้อความ 'Link'" },
            { tags: ["<img src='img.jpg'>"], hint: "เพิ่มรูปภาพ 'img.jpg'" },
            { tags: ["<ul>", "<li>Item 1</li>", "<li>Item 2</li>", "</ul>"], hint: "สร้างรายการไม่เรียงลำดับ 2 รายการ" },
            { tags: ["<ol>", "<li>First</li>", "<li>Second</li>", "</ol>"], hint: "สร้างรายการเรียงลำดับ 2 รายการ" },
            { tags: ["<strong>", "Bold", "</strong>"], hint: "ข้อความตัวหนา 'Bold'" },
            { tags: ["<em>", "Italic", "</em>"], hint: "ข้อความตัวเอียง 'Italic'" },
            { tags: ["<input type='text'>"], hint: "สร้างช่องกรอกข้อความ" },
            { tags: ["<input type='password'>"], hint: "สร้างช่องกรอกรหัสผ่าน" },
            { tags: ["<form>", "<input>", "</form>"], hint: "สร้างฟอร์มง่าย ๆ" },
            { tags: ["<hr>"], hint: "สร้างเส้นคั่น" },
            { tags: ["<br>"], hint: "ขึ้นบรรทัดใหม่" },
            { tags: ["<footer>", "My Footer", "</footer>"], hint: "สร้างส่วนท้าย 'My Footer'" },
            { tags: ["<header>", "My Header", "</header>"], hint: "สร้างส่วนหัว 'My Header'" },
            { tags: ["<section>", "Content", "</section>"], hint: "สร้าง section 'Content'" }
        ],
        level2: [
            { tags: ["<table>", "<tr><td>1</td><td>2</td></tr>", "</table>"], hint: "สร้างตาราง 1 แถว 2 คอลัมน์" },
            { tags: ["<div class='box'>", "Hello", "</div>"], hint: "สร้าง div พร้อม class 'box'" },
            { tags: ["<a href='https://example.com'>", "Go", "</a>"], hint: "สร้างลิงก์ไป example.com" },
            { tags: ["<input type='checkbox'>"], hint: "สร้าง checkbox" },
            { tags: ["<input type='radio'>"], hint: "สร้าง radio button" },
            { tags: ["<label for='id1'>", "Name", "</label>"], hint: "สร้าง label ให้ input id='id1'" },
            { tags: ["<textarea>", "Write here", "</textarea>"], hint: "สร้าง textarea พร้อมข้อความ" },
            { tags: ["<select>", "<option>Option 1</option>", "<option>Option 2</option>", "</select>"], hint: "สร้าง dropdown 2 ตัวเลือก" },
            { tags: ["<img src='pic.jpg' alt='Picture'>"], hint: "เพิ่มรูปพร้อม alt" },
            { tags: ["<meta charset='UTF-8'>"], hint: "กำหนด charset UTF-8" },
            { tags: ["<link rel='stylesheet' href='style.css'>"], hint: "เชื่อมไฟล์ CSS" },
            { tags: ["<nav>", "Menu", "</nav>"], hint: "สร้าง navigation bar" },
            { tags: ["<article>", "Article Content", "</article>"], hint: "สร้าง article" },
            { tags: ["<aside>", "Sidebar", "</aside>"], hint: "สร้าง sidebar" },
            { tags: ["<main>", "Main Content", "</main>"], hint: "สร้าง main content" },
            { tags: ["<strong>", "Important", "</strong>"], hint: "ข้อความสำคัญ" },
            { tags: ["<em>", "Note", "</em>"], hint: "ข้อความหมายเหตุ" },
            { tags: ["<small>", "Fine print", "</small>"], hint: "ข้อความตัวเล็ก" },
            { tags: ["<mark>", "Highlight", "</mark>"], hint: "ข้อความเน้นสี" }
        ],
        level3: [
            { tags: ["<div id='container'>", "<p>Nested</p>", "</div>"], hint: "div ภายในมี p" },
            { tags: ["<ul>", "<li><a href='#'>Link1</a></li>", "<li><a href='#'>Link2</a></li>", "</ul>"], hint: "ul กับ li ที่มีลิงก์" },
            { tags: ["<form action='/submit' method='post'>", "<input type='text'>", "</form>"], hint: "ฟอร์ม POST" },
            { tags: ["<table>", "<tr><th>Name</th><th>Age</th></tr>", "<tr><td>Alice</td><td>20</td></tr>", "</table>"], hint: "ตารางชื่อและอายุ" },
            { tags: ["<section>", "<article>", "Content", "</article>", "</section>"], hint: "section ภายในมี article" },
            { tags: ["<div class='grid'>", "<div>1</div>", "<div>2</div>", "</div>"], hint: "div แบบ grid" },
            { tags: ["<audio controls>", "<source src='audio.mp3' type='audio/mpeg'>", "</audio>"], hint: "เพิ่ม audio player" },
            { tags: ["<video controls>", "<source src='video.mp4' type='video/mp4'>", "</video>"], hint: "เพิ่ม video player" },
            { tags: ["<iframe src='https://example.com'></iframe>"], hint: "ฝัง iframe" },
            { tags: ["<canvas id='myCanvas'></canvas>"], hint: "สร้าง canvas" },
            { tags: ["<blockquote>", "Quote", "</blockquote>"], hint: "สร้าง blockquote" },
            { tags: ["<code>", "let x = 10;", "</code>"], hint: "เขียนโค้ด snippet" },
            { tags: ["<pre>", "Preformatted", "</pre>"], hint: "ข้อความ preformatted" },
            { tags: ["<details>", "<summary>More</summary>", "Extra info", "</details>"], hint: "details/summary" },
            { tags: ["<dl>", "<dt>Term</dt>", "<dd>Definition</dd>", "</dl>"], hint: "definition list" },
            { tags: ["<figure>", "<img src='img.jpg'>", "<figcaption>Caption</figcaption>", "</figure>"], hint: "figure + caption" },
            { tags: ["<mark>", "Highlight Text", "</mark>"], hint: "เน้นข้อความ" },
            { tags: ["<b>", "Bold Text", "</b>"], hint: "ตัวหนาแบบเก่า" },
            { tags: ["<i>", "Italic Text", "</i>"], hint: "ตัวเอียงแบบเก่า" },
            { tags: ["<s>", "Strikethrough", "</s>"], hint: "ขีดฆ่าข้อความ" }
        ]
    };

    function loadScore() {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let user = users.find(u => u.username === currentUser);
        return user && user.scoreDuo ? user.scoreDuo : 0;
    }

    function updateScoreUI() {
        const scoreEl = document.getElementById("scoreDisplay");
        if (scoreEl) {
            scoreEl.innerText = `${currentUser} | Score: ${loadScore()}`;
        }
    }

    function saveGameState() {
        const state = {
            currentStage: currentStage,
            currentQuestionIndex: currentQuestionIndex,
            duoCorrectTotal: duoCorrectTotal,
            duoStreak: duoStreak
        };
        localStorage.setItem(`duo_persistence_${currentUser}`, JSON.stringify(state));
    }

    function loadGameState() {
        const saved = localStorage.getItem(`duo_persistence_${currentUser}`);
        if (saved) {
            const state = JSON.parse(saved);
            currentStage = state.currentStage || 1;
            currentQuestionIndex = state.currentQuestionIndex !== undefined ? state.currentQuestionIndex : -1;
            duoCorrectTotal = state.duoCorrectTotal || 0;
            duoStreak = state.duoStreak || 0;
            return true;
        }
        return false;
    }

    // ==========================================
    // 🚀 ระบบ SKIP แบบ BoxGame (ตัดเหรียญและข้ามด่าน)
    // ==========================================
    window.skipLevel = function () {
        if (isSubmitting) return;

        // 1. คำนวณค่าธรรมเนียมการข้าม (ตามแบบ BoxGame)
        let cost = currentStage <= 3 ? 20 : currentStage <= 6 ? 40 : 60;

        let users = JSON.parse(localStorage.getItem("users")) || [];
        let userIndex = users.findIndex(u => u.username === currentUser);

        if (userIndex !== -1) {
            let user = users[userIndex];

            // 2. ตรวจสอบเหรียญ
            if (user.coins >= cost) {
                isSubmitting = true;
                user.coins -= cost;
                localStorage.setItem("users", JSON.stringify(users));

                // อัปเดตการแสดงผลเหรียญในหน้าจอ (ถ้ามี)
                const coinDisplay = document.querySelector('.coin-display strong');
                if (coinDisplay) coinDisplay.innerText = user.coins;

                // 3. แสดงสถานะและข้ามด่าน
                const resultDisplay = document.getElementById("resultMessage");
                resultDisplay.textContent = `⏭️ ข้ามด่านสำเร็จ! (-${cost} Coins)`;
                resultDisplay.style.color = "#f59e0b";

                setTimeout(() => {
                    duoStreak = 0;
                    if (currentStage < maxStage) {
                        currentStage++;
                        currentQuestionIndex = -1; // รีเซ็ตดัชนีเพื่อสุ่มโจทย์ใหม่ในด่านถัดไป
                        generateQuiz();
                        isSubmitting = false;
                    } else {
                        showFinishPopup(); // จบเกมถ้าเป็นด่านสุดท้าย
                    }
                }, 1000);
            } else {
                // เหรียญไม่พอ
                const resultDisplay = document.getElementById("resultMessage");
                resultDisplay.textContent = `⚠️ เหรียญไม่พอ! (ต้องการ ${cost} Coins)`;
                resultDisplay.style.color = "#ef4444";
            }
        }
    };

    function generateQuiz() {
        document.getElementById("userInput").value = "";
        document.getElementById("userInput").disabled = false;
        document.getElementById("resultMessage").innerHTML = "";
        document.getElementById("submitBtn").disabled = false;

        let levelKey = currentStage <= 3 ? 'level1' : currentStage <= 6 ? 'level2' : 'level3';
        const levelArray = quizData[levelKey];

        // สุ่มโจทย์ใหม่เฉพาะเมื่อไม่ได้เซฟไว้
        if (currentQuestionIndex === -1 || currentQuestionIndex >= levelArray.length) {
            currentQuestionIndex = Math.floor(Math.random() * levelArray.length);
        }

        const currentItem = levelArray[currentQuestionIndex];

        correctAnswer = currentItem.tags.join('');
        document.getElementById("hintText").textContent = currentItem.hint;
        document.getElementById("levelDisplay").textContent = `Level: ${currentStage} / ${maxStage}`;

        questionStartTime = Date.now();
        saveGameState();
        updateScoreUI();
    }

    function checkAnswer() {
        if (isSubmitting) return;
        isSubmitting = true;

        let answerField = document.getElementById("userInput");
        let resultDisplay = document.getElementById("resultMessage");
        let submitBtn = document.getElementById("submitBtn");

        // ตัดช่องว่างเพื่อให้เช็คได้ง่ายขึ้น
        let userTyped = answerField.value.trim().replace(/\s+/g, '').toLowerCase();
        let correctNormalized = correctAnswer.trim().replace(/\s+/g, '').toLowerCase();

        if (userTyped === "") {
            resultDisplay.textContent = "⚠️ กรุณากรอกคำตอบก่อนส่ง";
            resultDisplay.style.color = "#ef4444";
            isSubmitting = false;
            return;
        }

        if (userTyped === correctNormalized) {
            let earnedScore = currentStage <= 3 ? 4 : currentStage <= 6 ? 8 : 11;

            addScoreToUser(earnedScore);
            updateScoreUI();

            resultDisplay.textContent = `🎉 ถูกต้อง! รับไป ${earnedScore} คะแนน`;
            resultDisplay.style.color = "#10B981";

            submitBtn.disabled = true;
            answerField.disabled = true;

            let timeTaken = (Date.now() - questionStartTime) / 1000;
            duoCorrectTotal++;
            duoStreak++;

            if (typeof window.unlockAchievement === "function") {
                window.unlockAchievement("quiz-first");
                if (duoCorrectTotal >= 3) window.unlockAchievement("quiz-3");
                if (duoStreak >= 5) window.unlockAchievement("quiz-5");
            }
            if (typeof window.updateQuestProgress === "function") {
                window.updateQuestProgress("q_duo_5", 1);
                window.updateQuestProgress("q_streak_3", duoStreak);
            }

            setTimeout(() => {
                if (currentStage < maxStage) {
                    currentStage++;
                    currentQuestionIndex = -1; // ผ่านด่านแล้ว ให้สุ่มโจทย์ใหม่
                    generateQuiz();
                    isSubmitting = false;
                } else {
                    showFinishPopup();
                }
            }, 1000);
        } else {
            resultDisplay.textContent = "❌ ยังไม่ถูกต้อง ลองใหม่อีกครั้งนะ";
            resultDisplay.style.color = "#ef4444";
            duoStreak = 0;
            isSubmitting = false;
        }
    }

    function addScoreToUser(points) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let userIndex = users.findIndex(u => u.username === currentUser);
        if (userIndex !== -1) {
            users[userIndex].scoreDuo = (users[userIndex].scoreDuo || 0) + points;
            users[userIndex].score = users[userIndex].scoreDuo + (users[userIndex].scoreBox || 0);
            localStorage.setItem("users", JSON.stringify(users));
        }
    }

    function showFinishPopup() {
        const popup = document.getElementById("finishPopup");
        if (popup) {
            popup.style.display = "flex";
            document.getElementById("finalScoreText").innerText = `คะแนนของคุณคือ: ${loadScore()}`;
        }
        document.getElementById("submitBtn").disabled = true;
        document.getElementById("userInput").disabled = true;
        localStorage.removeItem(`duo_persistence_${currentUser}`);
        isSubmitting = false;
    }

    window.playAgain = function () {
        localStorage.removeItem(`duo_persistence_${currentUser}`);
        location.reload();
    };

    window.goHome = function () {
        window.location.href = "../Home.html";
    };

    window.closePopup = function () {
        const popup = document.getElementById("finishPopup");
        if (popup) popup.style.display = "none";
    };

    // document.getElementById("hintTitle").textContent = "Glucode ૮₍'˶• . • ⑅ ₎ა";

    loadGameState();
    generateQuiz();

    document.getElementById("submitBtn").addEventListener("click", checkAnswer);

    document.getElementById("userInput").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            checkAnswer();
        }
    });
});