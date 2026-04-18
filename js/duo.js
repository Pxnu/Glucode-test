/* ==========================================
   DUO JS - FULL (จัดแบ่งโจทย์ 4 ระดับ + ระบบใหม่)
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem("loggedInUser");
    if (!currentUser) return;

    /* =========================
       QUIZ DATA
    ========================= */
    const quizData = {
        easy: [
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
            { tags: ["<em>", "Italic", "</em>"], hint: "ข้อความตัวเอียง 'Italic'" }
        ],
        medium: [
            { tags: ["<input type='text'>"], hint: "สร้างช่องกรอกข้อความ" },
            { tags: ["<input type='password'>"], hint: "สร้างช่องกรอกรหัสผ่าน" },
            { tags: ["<form>", "<input>", "</form>"], hint: "สร้างฟอร์มง่าย ๆ" },
            { tags: ["<hr>"], hint: "สร้างเส้นคั่น" },
            { tags: ["<br>"], hint: "ขึ้นบรรทัดใหม่" },
            { tags: ["<footer>", "My Footer", "</footer>"], hint: "สร้างส่วนท้าย 'My Footer'" },
            { tags: ["<header>", "My Header", "</header>"], hint: "สร้างส่วนหัว 'My Header'" },
            { tags: ["<section>", "Content", "</section>"], hint: "สร้าง section 'Content'" },
            { tags: ["<table>", "<tr><td>1</td><td>2</td></tr>", "</table>"], hint: "สร้างตาราง 1 แถว 2 คอลัมน์" },
            { tags: ["<div class='box'>", "Hello", "</div>"], hint: "สร้าง div พร้อม class 'box'" },
            { tags: ["<a href='https://example.com'>", "Go", "</a>"], hint: "สร้างลิงก์ไป example.com" },
            { tags: ["<input type='checkbox'>"], hint: "สร้าง checkbox" },
            { tags: ["<input type='radio'>"], hint: "สร้าง radio button" }
        ],
        hard: [
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
            { tags: ["<div id='container'>", "<p>Nested</p>", "</div>"], hint: "div ภายในมี p" },
            { tags: ["<ul>", "<li><a href='#'>Link1</a></li>", "<li><a href='#'>Link2</a></li>", "</ul>"], hint: "ul กับ li ที่มีลิงก์" }
        ],
        expert: [
            { tags: ["<form action='/submit' method='post'>", "<input type='text'>", "</form>"], hint: "ฟอร์ม POST" },
            { tags: ["<table>", "<tr><th>Name</th><th>Age</th></tr>", "<tr><td>Alice</td><td>20</td></tr>", "</table>"], hint: "ตารางชื่อและอายุ" },
            { tags: ["<section>", "<article>", "Content", "</article>", "</section>"], hint: "section ภายในมี article" },
            { tags: ["<div class='grid'>", "<div>1</div>", "<div>2</div>", "</div>"], hint: "div แบบ grid" },
            { tags: ["<audio controls>", "<source src='audio.mp3' type='audio/mpeg'>", "</audio>"], hint: "เพิ่ม audio player" },
            { tags: ["<video controls>", "<source src='video.mp4' type='video/mp4'>", "</video>"], hint: "เพิ่ม video player" },
            { tags: ["<iframe src='https://example.com'></iframe>"], hint: "ฝัง iframe" },
            { tags: ["<canvas id='myCanvas'></canvas>"], hint: "สร้าง canvas" },
            { tags: ["<blockquote>", "Quote", "</blockquote>"], hint: "สร้าง blockquote" },
            { tags: ["<details>", "<summary>More</summary>", "Extra info", "</details>"], hint: "details/summary" },
            { tags: ["<figure>", "<img src='img.jpg'>", "<figcaption>Caption</figcaption>", "</figure>"], hint: "figure + caption" }
        ]
    };

    /* =========================
       GAME STATE
    ========================= */
    const SCORE_MAP = { easy: 1, medium: 2, hard: 3, expert: 4 };
    const ROUND_LIMIT = 5;
    const SKIP_COSTS = { easy: 10, medium: 20, hard: 30, expert: 40 };

    let currentDifficulty = "easy";
    let playedInRound = 0;
    let isSubmitting = false;
    let correctAnswer = "";

    let easyPlayed = [], mediumPlayed = [], hardPlayed = [], expertPlayed = [];
    let duoCorrectTotal = 0, duoStreak = 0, questionStartTime = 0;

    /* =========================
       💾 Persistence & Score
    ========================= */
    function loadScore() {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let user = users.find(u => u.username === currentUser);
        return user && user.scoreDuo ? user.scoreDuo : 0;
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

    function saveGameState() {
        const state = {
            currentDifficulty, playedInRound,
            easyPlayed, mediumPlayed, hardPlayed, expertPlayed,
            duoCorrectTotal, duoStreak
        };
        localStorage.setItem(`duo_persistence_${currentUser}`, JSON.stringify(state));
    }

    function loadGameState() {
        const saved = localStorage.getItem(`duo_persistence_${currentUser}`);
        if (saved) {
            const state = JSON.parse(saved);
            currentDifficulty = state.currentDifficulty || "easy";
            playedInRound = state.playedInRound || 0;
            easyPlayed = state.easyPlayed || [];
            mediumPlayed = state.mediumPlayed || [];
            hardPlayed = state.hardPlayed || [];
            expertPlayed = state.expertPlayed || [];
            duoCorrectTotal = state.duoCorrectTotal || 0;
            duoStreak = state.duoStreak || 0;
            return true;
        }
        return false;
    }

    function syncGameUI() {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let user = users.find(u => u.username === currentUser);
        let coins = user ? (user.coins || 0) : 0;

        document.getElementById("coinDisplay").innerText = `💰 ${coins}`;
        document.getElementById("scoreDisplay").innerText = `Score: ${loadScore()}`;
        document.getElementById("levelDisplay").innerText = `Round: ${playedInRound + 1 > ROUND_LIMIT ? ROUND_LIMIT : playedInRound + 1} / ${ROUND_LIMIT}`;
        document.getElementById("difficultySelect").value = currentDifficulty;

        let navCoin = document.querySelector('.coin-display strong');
        if (navCoin) navCoin.innerText = coins;
    }

    window.changeDifficulty = function (val) {
        if (playedInRound > 0 && playedInRound < ROUND_LIMIT) {
            if (!confirm("คุณกำลังทำข้อค้างอยู่ หากเปลี่ยนโหมดตอนนี้จะเริ่มนับ 1 ใหม่ ตกลงหรือไม่?")) {
                document.getElementById("difficultySelect").value = currentDifficulty;
                return;
            }
        }
        currentDifficulty = val;
        playedInRound = 0;
        generateQuiz();
    };

    /* =========================
       🚀 ระบบ Skip
    ========================= */
    window.promptSkip = function () {
        if (isSubmitting) return;
        document.getElementById("skipCostText").innerText = SKIP_COSTS[currentDifficulty];
        document.getElementById("skipConfirmPopup").style.display = "flex";
    };

    window.executeSkip = function () {
        const cost = SKIP_COSTS[currentDifficulty];
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let userIndex = users.findIndex(u => u.username === currentUser);

        if (userIndex !== -1 && users[userIndex].coins >= cost) {
            users[userIndex].coins -= cost;
            localStorage.setItem('users', JSON.stringify(users));

            window.closePopup('skipConfirmPopup');
            duoStreak = 0; // ตัด Streak

            let resultDisplay = document.getElementById("resultMessage");
            resultDisplay.textContent = `⏭️ ข้ามด่านสำเร็จ! (-${cost} Coins)`;
            resultDisplay.style.color = "#f59e0b";

            isSubmitting = true;
            setTimeout(() => {
                resultDisplay.textContent = "";
                handleRoundProgress(true);
            }, 1000);
        } else {
            alert("เหรียญไม่พอข้ามด่าน!");
            window.closePopup('skipConfirmPopup');
        }
    };

    /* =========================
       CORE LOGIC
    ========================= */
    function getAvailableQuestions() {
        let pool = quizData[currentDifficulty];
        let played = currentDifficulty === "easy" ? easyPlayed : currentDifficulty === "medium" ? mediumPlayed : currentDifficulty === "hard" ? hardPlayed : expertPlayed;

        let avail = [];
        pool.forEach((_, i) => { if (!played.includes(i)) avail.push(i); });
        return { avail, pool, played };
    }

    function handleRoundProgress(isSkip = false) {
        playedInRound++;
        syncGameUI();

        if (playedInRound >= ROUND_LIMIT) {
            showProgressionPopup();
        } else {
            generateQuiz();
        }
        isSubmitting = false;
    }

    window.showProgressionPopup = function (isExhausted = false) {
        let { avail } = getAvailableQuestions();
        let popup = document.getElementById("progressionPopup");
        let title = document.getElementById("progTitle");
        let desc = document.getElementById("progDesc");
        let btnContainer = document.getElementById("progBtns");
        btnContainer.innerHTML = "";

        if (isExhausted || avail.length === 0) {
            title.innerText = "🚧 โหมดนี้เล่นครบแล้ว!";
            desc.innerText = `คุณเล่นโจทย์ ${currentDifficulty.toUpperCase()} ครบทั้งหมดแล้ว ไประดับต่อไปกันเถอะ`;
        } else {
            title.innerText = "🎉 คุณเล่นผ่านระดับนี้แล้ว!";
            desc.innerText = `สามารถไปด่านถัดไป หรือจะฝึกระดับ ${currentDifficulty.toUpperCase()} ต่อดี?`;

            let btnStay = document.createElement("button");
            btnStay.innerText = `เล่น ${currentDifficulty} ต่อ`;
            btnStay.style.background = "var(--subtext)";
            btnStay.style.color = "white";
            btnStay.onclick = () => { playedInRound = 0; window.closePopup('progressionPopup'); generateQuiz(); };
            btnContainer.appendChild(btnStay);
        }

        let btnNext = document.createElement("button");
        btnNext.className = "goHome";

        if (currentDifficulty === "expert" && avail.length === 0) {
            document.getElementById("gameClearPopup").style.display = "flex";
            localStorage.removeItem(`duo_persistence_${currentUser}`);
            return;
        } else {
            btnNext.innerText = "ไปด่านถัดไป ➔";
            btnNext.onclick = () => moveNextDifficulty();
        }

        btnContainer.appendChild(btnNext);
        popup.style.display = "flex";
    };

    window.moveNextDifficulty = function () {
        const order = ["easy", "medium", "hard", "expert"];
        let nextIdx = order.indexOf(currentDifficulty) + 1;
        if (nextIdx < order.length) {
            currentDifficulty = order[nextIdx];
            playedInRound = 0;
            window.closePopup('progressionPopup');
            generateQuiz();
        } else {
            window.closePopup('progressionPopup');
            document.getElementById("gameClearPopup").style.display = "flex";
            localStorage.removeItem(`duo_persistence_${currentUser}`);
        }
    };

    function generateQuiz() {
        document.getElementById("userInput").value = "";
        document.getElementById("userInput").disabled = false;
        document.getElementById("resultMessage").innerHTML = "";
        document.getElementById("submitBtn").disabled = false;

        let { avail, pool, played } = getAvailableQuestions();

        if (avail.length === 0) {
            showProgressionPopup(true);
            return;
        }

        let randIdx = avail[Math.floor(Math.random() * avail.length)];
        played.push(randIdx);
        const currentItem = pool[randIdx];

        correctAnswer = currentItem.tags.join('');
        document.getElementById("hintText").textContent = currentItem.hint;

        syncGameUI();
        questionStartTime = Date.now();
        isSubmitting = false;
        saveGameState();
    }

    function checkAnswer() {
        if (isSubmitting) return;
        isSubmitting = true;

        let answerField = document.getElementById("userInput");
        let resultDisplay = document.getElementById("resultMessage");
        let submitBtn = document.getElementById("submitBtn");

        let userTyped = answerField.value.trim().replace(/\s+/g, '').toLowerCase();
        let correctNormalized = correctAnswer.trim().replace(/\s+/g, '').toLowerCase();

        if (userTyped === "") {
            resultDisplay.textContent = "⚠️ กรุณากรอกคำตอบก่อนส่ง";
            resultDisplay.style.color = "#ef4444";
            isSubmitting = false;
            return;
        }

        if (userTyped === correctNormalized) {
            let earnedScore = SCORE_MAP[currentDifficulty];
            addScoreToUser(earnedScore);

            resultDisplay.textContent = `🎉 ถูกต้อง! รับไป ${earnedScore} คะแนน`;
            resultDisplay.style.color = "#10B981";

            submitBtn.disabled = true;
            answerField.disabled = true;

            // ระบบ Quest & Achievement เดิมของคุณ
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
                window.updateQuestProgress("q_score_50", earnedScore);
            }

            setTimeout(() => {
                resultDisplay.textContent = "";
                handleRoundProgress(false);
            }, 1000);
        } else {
            resultDisplay.textContent = "❌ ยังไม่ถูกต้อง ลองใหม่อีกครั้งนะ";
            resultDisplay.style.color = "#ef4444";
            duoStreak = 0;
            isSubmitting = false;
        }
    }

    window.closePopup = function (id) { document.getElementById(id).style.display = "none"; };
    window.goHome = function () { window.location.href = "../Home.html"; };

    // Initial Load
    loadGameState();
    generateQuiz();

    // Events
    document.getElementById("submitBtn").addEventListener("click", checkAnswer);
    document.getElementById("userInput").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            checkAnswer();
        }
    });
});