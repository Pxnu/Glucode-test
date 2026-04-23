/* ==========================================
   DUO JS - FULL (มีระบบจำโจทย์ปัจจุบัน & สลับโหมดอิสระ)
   (ไฟล์นี้รวมชุดข้อมูลโจทย์ quiz_data.js เข้ามาไว้ด้วยกันแล้ว)
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // ป้องกันการรันสคริปต์ถ้าไม่ได้ล็อกอิน
    const currentUser = localStorage.getItem("loggedInUser");
    if (!currentUser) return;

    /* =========================
       QUIZ DATA
       (ข้อมูลโจทย์คำถามและคำตอบทั้งหมดในโหมด Duo)
    ========================= */
    const quizData = {
        easy: [
            { tags: ["<h1>", "Hello", "</h1>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างหัวข้อหลัก (H1) ที่มีข้อความ 'Hello'" },
            { tags: ["<p>", "This is my website", "</p>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างย่อหน้า (Paragraph) ที่มีข้อความ 'This is my website'" },
            { tags: ["<button>", "Submit", "</button>"], hint: "สร้างปุ่ม (Button) ที่มีข้อความ 'Submit'" },
            { tags: ["<div>", "Box", "</div>"], hint: "สร้างกล่องที่มีข้อความ 'Box'" },
            { tags: ["<b>", "Important", "</b>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับทำข้อความตัวหนา (Bold) ที่มีคำว่า 'Important" },
            { tags: ["<i>", "Note", "</i>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับทำข้อความตัวเอียง (Italic) ที่มีคำว่า 'Note'" },
            { tags: ["<u>", "Link", "</u>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับขีดเส้นใต้ (Underline) คำว่า 'Link'" },
            { tags: ["<h2>", "About Me", "</h2>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างหัวข้อรอง (H2) ที่มีข้อความ 'About Me" },
            { tags: ["<small>", "© 2026", "</small>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับแสดงข้อความขนาดเล็ก (Small) คำว่า '© 2026'" },
            { tags: ["<code>", "console.log(1)", "</code>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับแสดงรูปแบบโค้ด (Code) ข้อความ 'console.log(1)'" },
            { tags: ["<h3>", "Details", "</h3>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างหัวข้อระดับ 3 (H3) ที่มีข้อความ 'Details'" },
            { tags: ["<strong>", "Warning!", "</strong>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับเน้นข้อความสำคัญ (Strong) คำว่า 'Warning!'" }
        ],
        medium: [
            { tags: ["<li>", "Home", "</li>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างรายการ (List Item) ข้อความ 'Home'" },
            { tags: ["<div>", "Content here", "</div>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างกล่องเนื้อหา (Div) ข้อความ 'Content here'" },
            { tags: ["<tr>", "<td>", "Data", "</td>", "</tr>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างแถวตาราง (Table Row) และข้อมูล 'Data'" },
            { tags: ["<hr>"], hint: "สร้างเส้นคั่น" },
            { tags: ["<br>"], hint: "ขึ้นบรรทัดใหม่" },
            { tags: ["<footer>", "My Footer", "</footer>"], hint: "สร้างส่วนท้ายที่มีข้อความที่มีคำว่า 'My Footer'" },
            { tags: ["<header>", "My Header", "</header>"], hint: "สร้างส่วนหัวที่มีข้อความที่มีคำว่า 'My Header'" },
            { tags: ["<section>", "Content", "</section>"], hint: "สร้าง section ที่มีข้อความที่มีคำว่า 'Content'" },
            //{ tags: ["<table>", "<tr><td>1</td><td>2</td></tr>", "</table>"], hint: "สร้างตาราง 1 แถว 2 คอลัมน์" },
            //{ tags: ["<div class='box'>", "Hello", "</div>"], hint: "สร้าง div พร้อม class 'box'" },
            //{ tags: ["<a href='https://example.com'>", "Go", "</a>"], hint: "สร้างลิงก์ไป example.com" },
            { tags: ["<input type='checkbox'>"], hint: "สร้าง checkbox" },
            //{ tags: ["<input type='radio'>"], hint: "สร้าง radio button" }
        ],
        hard: [
            { tags: ["<h1>", "Welcome", "</h1>", "<button>", "Start", "</button>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างหัวข้อ 'Welcome' และปุ่ม 'Start' ต่อท้าย" },
            { tags: ["<textarea>", "SPU", "</textarea>"], hint: "สร้าง textarea พร้อมข้อความ SPU" },
            { tags: ["<p>", "Hi", "<b>", "User", "</b>", "</p>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างย่อหน้าที่มีคำว่า 'User' เป็นตัวหนา (Hi <b>User</b>)" },
            { tags: ["<ul>", "<li>", "Info", "</li>", "</ul>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างรายการแบบไม่ลำดับ (Unordered List) ที่มีรายการ 'Info'" },
            { tags: ["<header>", "<nav>", "Menu", "</nav>", "</header>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างส่วนหัว (Header) ที่มีเมนูนำทาง (Nav) ข้อความ 'Menu'" },
            { tags: ["<form>", '<input type="password">', "</form>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างฟอร์มที่มีช่องกรอกรหัสผ่าน (Password Input)" },
            //{ tags: ["<nav>", "Menu", "</nav>"], hint: "สร้าง navigation bar" },
            //{ tags: ["<article>", "Article Content", "</article>"], hint: "สร้าง article" },
            //{ tags: ["<aside>", "Sidebar", "</aside>"], hint: "สร้าง sidebar" },
            { tags: ["<main>", "Main Content", "</main>"], hint: "สร้าง main content" },
            //{ tags: ["<div id='container'>", "<p>Nested</p>", "</div>"], hint: "div ภายในมี p" },
            //{ tags: ["<ul>", "<li><a href='#'>Link1</a></li>", "<li><a href='#'>Link2</a></li>", "</ul>"], hint: "ul กับ li ที่มีลิงก์" }
        ],
        expert: [
            { tags: ["<article>", "<h2>", "My Blog", "</h2>", "<p>", "Welcome to my blog", "</p>", "</article>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างบทความ (Article) ที่มีหัวข้อ 'My Blog' และเนื้อหา" },
            { tags: ["<aside>", "<ul>", "<li>", '<a href="#">', "Link", "</a>", "</li>", "</ul>", "</aside>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างแถบข้าง (Aside) ที่มีรายการลิงก์ 'Link'" },
            { tags: ["<figure>", '<img src="img.jpg" alt="image">', "<figcaption>", "This is an image", "</figcaption>", "</figure>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างรูปภาพพร้อมคำอธิบาย (Figcaption) 'This is an image'" },
            { tags: ["<fieldset>", "<legend>", "Login", "</legend>", '<input type="text">', "</fieldset>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับจัดกลุ่มฟอร์ม (Fieldset) หัวข้อ 'Login' และช่องรับข้อมูล" },
            //{ tags: ["<audio controls>", "<source src='audio.mp3' type='audio/mpeg'>", "</audio>"], hint: "เพิ่ม audio player" },
            //{ tags: ["<video controls>", "<source src='video.mp4' type='video/mp4'>", "</video>"], hint: "เพิ่ม video player" },
            //{ tags: ["<iframe src='https://example.com'></iframe>"], hint: "ฝัง iframe" },
            //{ tags: ["<canvas id='myCanvas'></canvas>"], hint: "สร้าง canvas" },
            //{ tags: ["<blockquote>", "Quote", "</blockquote>"], hint: "สร้าง blockquote" },
            //{ tags: ["<details>", "<summary>More</summary>", "Extra info", "</details>"], hint: "details/summary" },
            { tags: ["<table>", "<thead>", "</thead>", "<tbody>", "</tbody>", "</table>"], hint: "จงสร้างชุดคำสั่ง HTML สำหรับสร้างตารางที่มีส่วนหัว (Thead) และส่วนข้อมูล (Tbody)" }
        ]
    };

    /* =========================
       GAME STATE
       (ตัวแปรควบคุมเกม)
    ========================= */
    const SCORE_MAP = { easy: 2, medium: 4, hard: 6, expert: 8 }; // คะแนนต่อข้อ
    const ROUND_LIMIT = 5; // ทำครบ 5 ข้อถึงจะเด้งหน้าต่างพักครึ่ง
    const SKIP_COSTS = { easy: 10, medium: 20, hard: 30, expert: 40 }; // ราคาข้ามด่าน

    let currentDifficulty = "easy"; // ความยากปัจจุบัน
    let isSubmitting = false; // กันส่งคำตอบเบิ้ล
    let correctAnswer = ""; // เก็บค่าเฉลยในรูปแบบ String

    // 🔥 แยกนับรอบของแต่ละโหมด (ตัวนับรอบ 1-5 ข้อ)
    let playedInRound = { easy: 0, medium: 0, hard: 0, expert: 0 };
    // 🔥 ล็อกข้อปัจจุบันไว้กันรีเฟรชหน้าจอหนี
    let activeQuestion = { easy: -1, medium: -1, hard: -1, expert: -1 };

    // เก็บ Index ข้อที่เคยเล่นไปแล้วเพื่อไม่ให้สุ่มมาซ้ำ
    let easyPlayed = [], mediumPlayed = [], hardPlayed = [], expertPlayed = [];
    let duoCorrectTotal = 0, duoStreak = 0, questionStartTime = 0; // ตัวแปรสถิติส่งให้ระบบ Quest

    /* =========================
       💾 Persistence & Score
       (ระบบเซฟ/โหลด และอัปเดต UI)
    ========================= */
    // โหลดคะแนนเฉพาะโหมด Duo
    function loadScore() {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let user = users.find(u => u.username === currentUser);
        return user && user.scoreDuo ? user.scoreDuo : 0;
    }

    // เพิ่มคะแนนเข้าบัญชีผู้ใช้เมื่อตอบถูก
    function addScoreToUser(points) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let userIndex = users.findIndex(u => u.username === currentUser);
        if (userIndex !== -1) {
            users[userIndex].scoreDuo = (users[userIndex].scoreDuo || 0) + points;
            users[userIndex].score = users[userIndex].scoreDuo + (users[userIndex].scoreBox || 0); // รวมคะแนนสองโหมดเข้าด้วยกัน
            localStorage.setItem("users", JSON.stringify(users));
        }
    }

    // เซฟตัวแปรสถานะลง LocalStorage
    function saveGameState() {
        const state = {
            currentDifficulty, playedInRound, activeQuestion,
            easyPlayed, mediumPlayed, hardPlayed, expertPlayed,
            duoCorrectTotal, duoStreak
        };
        localStorage.setItem(`duo_persistence_${currentUser}`, JSON.stringify(state));
    }

    // โหลดตัวแปรสถานะขึ้นมาจาก LocalStorage
    function loadGameState() {
        const saved = localStorage.getItem(`duo_persistence_${currentUser}`);
        if (saved) {
            const state = JSON.parse(saved);
            currentDifficulty = state.currentDifficulty || "easy";

            // ปรับโครงสร้างเผื่อผู้เล่นมีเซฟแบบเวอร์ชันเก่า
            if (typeof state.playedInRound === 'number') playedInRound = { easy: state.playedInRound, medium: 0, hard: 0, expert: 0 };
            else playedInRound = state.playedInRound || { easy: 0, medium: 0, hard: 0, expert: 0 };

            activeQuestion = state.activeQuestion || { easy: -1, medium: -1, hard: -1, expert: -1 };

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

    // รีเฟรชข้อมูลตัวเลขบนหน้าจอ (คะแนน, เหรียญ, ความคืบหน้า)
    function syncGameUI() {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let user = users.find(u => u.username === currentUser);
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

    // 🔥 สลับโหมดอย่างอิสระ (เมื่อผู้ใช้เปลี่ยนค่าใน Dropdown)
    window.changeDifficulty = function (val) {
        currentDifficulty = val;
        // 🎬 Pulse the card when difficulty changes
        const card = document.querySelector(".card");
        if (card) {
            card.classList.remove("difficulty-switching");
            void card.offsetWidth;
            card.classList.add("difficulty-switching");
            card.addEventListener("animationend", () => {
                card.classList.remove("difficulty-switching");
            }, { once: true });
        }
        generateQuiz();
    };

    /* =========================
       🚀 ระบบ Skip (ข้ามข้อ)
    ========================= */
    // เด้งหน้าต่างถามยืนยันเมื่อกดข้าม
    window.promptSkip = function () {
        if (isSubmitting) return;
        document.getElementById("skipCostText").innerText = SKIP_COSTS[currentDifficulty];
        document.getElementById("skipConfirmPopup").style.display = "flex";
    };

    // ดำเนินการตัดเหรียญและข้ามข้อ
    window.executeSkip = function () {
        const cost = SKIP_COSTS[currentDifficulty];
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let userIndex = users.findIndex(u => u.username === currentUser);

        if (userIndex !== -1 && users[userIndex].coins >= cost) {
            users[userIndex].coins -= cost; // ตัดเหรียญ
            localStorage.setItem('users', JSON.stringify(users));

            window.closePopup('skipConfirmPopup');
            duoStreak = 0; // รีเซ็ตคอมโบ

            // แสดงข้อความว่าข้ามแล้ว
            let resultDisplay = document.getElementById("resultMessage");
            resultDisplay.textContent = `⏭️ ข้ามด่านสำเร็จ! (-${cost} Coins)`;
            resultDisplay.style.color = "#f59e0b";

            isSubmitting = true;
            // หน่วงเวลาเพื่อเปลี่ยนข้อ
            setTimeout(() => {
                resultDisplay.textContent = "";
                handleRoundProgress(true);
            }, 1000);
        } else {
            // 🟢 เปลี่ยนจาก alert() เป็นเปิด Popup โชว์ว่าเหรียญไม่พอ
            window.closePopup('skipConfirmPopup');
            const emptyDesc = document.getElementById("coinEmptyDesc");
            if (emptyDesc) emptyDesc.innerText = `การข้ามด่านนี้ต้องใช้ ${cost} Coins (คุณมี ${(users[userIndex] ? users[userIndex].coins : 0)} Coins)`;
            document.getElementById("coinEmptyPopup").style.display = "flex";
        }
    };

    // 🟢 ฟังก์ชันสำหรับปุ่ม "ไปหน้า Quest"
    window.goToQuestPage = function () {
        window.location.href = "../Glucode quest/quest.html";
    };

    /* =========================
       CORE LOGIC
       (ระบบการสร้างโจทย์ ตรวจคำตอบ เปลี่ยนด่าน)
    ========================= */
    // ดึงโจทย์ชุดปัจจุบันและหาข้อที่ยังไม่ถูกเล่นมาเตรียมไว้
    function getAvailableQuestions() {
        let pool = quizData[currentDifficulty];
        let played = currentDifficulty === "easy" ? easyPlayed : currentDifficulty === "medium" ? mediumPlayed : currentDifficulty === "hard" ? hardPlayed : expertPlayed;

        let avail = [];
        pool.forEach((_, i) => { if (!played.includes(i)) avail.push(i); });
        return { avail, pool, played };
    }

    // จัดการความคืบหน้า (เช่นเมื่อจบข้อ)
    function handleRoundProgress(isSkip = false) {
        activeQuestion[currentDifficulty] = -1; // เคลียร์ข้อปัจจุบันทิ้งเพราะทำไปแล้ว
        playedInRound[currentDifficulty]++; // เพิ่มจำนวนนับ
        syncGameUI();

        // ถ้าครบ 5 ข้อ ให้เด้ง Popup
        if (playedInRound[currentDifficulty] >= ROUND_LIMIT) {
            showProgressionPopup();
        } else {
            // ถ้าไม่ครบก็ดึงข้อต่อไปมาแสดง
            generateQuiz();
        }
        isSubmitting = false;
        saveGameState();
    }

    // แสดงหน้าต่างยินดีเมื่อจบ 5 ข้อ
    window.showProgressionPopup = function (isExhausted = false) {
        // เพิ่มบรรทัดนี้ลงไปเพื่ออัปเดต Quest โหมด Duo ตามระดับความยากปัจจุบัน
        if (typeof window.updateQuestProgress === 'function' && !isExhausted) {
            window.updateQuestProgress(`duo-${currentDifficulty}`, 1);
        }

        let { avail } = getAvailableQuestions();
        let popup = document.getElementById("progressionPopup");
        let title = document.getElementById("progTitle");
        let desc = document.getElementById("progDesc");
        let btnContainer = document.getElementById("progBtns");
        btnContainer.innerHTML = ""; // ล้างปุ่มที่มีอยู่

        // กรณีโจทย์ถูกดึงมาใช้ครบทุกข้อแล้ว
        if (isExhausted || avail.length === 0) {
            title.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> 🚧 โหมดนี้เล่นครบแล้ว!`;
            desc.innerText = `คุณเล่นโจทย์ ${currentDifficulty.toUpperCase()} ครบทั้งหมดแล้ว ไประดับต่อไปกันเถอะ`;
        } else {
            // กรณียังมีโจทย์เหลือให้เล่นซ้ำในระดับนี้
            title.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> 🎉 คุณเล่นผ่านระดับนี้แล้ว!`;
            desc.innerText = `สามารถไปด่านถัดไป หรือจะฝึกระดับ ${currentDifficulty.toUpperCase()} ต่อดี?`;

            // เพิ่มปุ่มเล่นระดับเดิมต่อ
            let btnStay = document.createElement("button");
            btnStay.className = "btn-cancel";
            btnStay.innerHTML = `<i class="fa-solid fa-rotate-right"></i> เล่น ${currentDifficulty} ต่อ`;
            btnStay.onclick = () => { playedInRound[currentDifficulty] = 0; window.closePopup('progressionPopup'); generateQuiz(); };
            btnContainer.appendChild(btnStay);
        }

        // ปุ่มไปด่านถัดไป
        let btnNext = document.createElement("button");
        btnNext.className = "btn-primary";

        // ถ้าอยู่ Expert แล้วเล่นจนข้อหมด ให้จบเกมจริงๆ
        if (currentDifficulty === "expert" && avail.length === 0) {
            document.getElementById("gameClearPopup").style.display = "flex";
            localStorage.removeItem(`duo_persistence_${currentUser}`);
            return;
        } else {
            btnNext.innerHTML = `ไปด่านถัดไป <i class="fa-solid fa-arrow-right"></i>`;
            btnNext.onclick = () => moveNextDifficulty();
        }

        btnContainer.appendChild(btnNext);
        popup.style.display = "flex";
    };

    // อัปเกรดระดับความยากเป็นอันถัดไป
    window.moveNextDifficulty = function () {
        const order = ["easy", "medium", "hard", "expert"];
        let nextIdx = order.indexOf(currentDifficulty) + 1;
        if (nextIdx < order.length) {
            playedInRound[currentDifficulty] = 0; // เคลียร์ตัวนับของโหมดเก่าทิ้ง
            currentDifficulty = order[nextIdx]; // ดันหมวดใหม่ขึ้นมา
            window.closePopup('progressionPopup');
            generateQuiz();
        } else {
            window.closePopup('progressionPopup');
            document.getElementById("gameClearPopup").style.display = "flex";
            localStorage.removeItem(`duo_persistence_${currentUser}`);
        }
    };

    // สร้างและโหลดโจทย์ขึ้นมาบนหน้าจอ
    function generateQuiz() {
        if (playedInRound[currentDifficulty] >= ROUND_LIMIT) {
            showProgressionPopup();
            return;
        }

        // รีเซ็ตช่องพิมพ์คำตอบ ปลดล็อกปุ่ม
        document.getElementById("userInput").value = "";
        document.getElementById("userInput").disabled = false;
        document.getElementById("resultMessage").innerHTML = "";
        document.getElementById("submitBtn").disabled = false;

        let { avail, pool, played } = getAvailableQuestions();

        let randIdx;
        // 🔥 ตรวจสอบว่ามีโจทย์ค้างอยู่ไหม
        if (activeQuestion[currentDifficulty] !== -1) {
            randIdx = activeQuestion[currentDifficulty];
        } else {
            if (avail.length === 0) {
                showProgressionPopup(true);
                return;
            }
            randIdx = avail[Math.floor(Math.random() * avail.length)];
            played.push(randIdx);
            activeQuestion[currentDifficulty] = randIdx;
        }

        const currentItem = pool[randIdx];
        correctAnswer = currentItem.tags.join('');

        // 🎬 Animation: slide hint out → update → slide in
        const hintEl = document.getElementById("hintText");
        const inputEl = document.getElementById("userInput");

        function applyNewHint() {
            hintEl.textContent = currentItem.hint;
            hintEl.classList.remove("hint-slide-out");
            hintEl.classList.add("hint-slide-in");

            // Animate input box too
            inputEl.classList.remove("input-fade-in");
            void inputEl.offsetWidth;
            inputEl.classList.add("input-fade-in");

            syncGameUI();
            questionStartTime = Date.now();
            isSubmitting = false;
            saveGameState();

            hintEl.addEventListener("animationend", () => {
                hintEl.classList.remove("hint-slide-in");
            }, { once: true });
            inputEl.addEventListener("animationend", () => {
                inputEl.classList.remove("input-fade-in");
            }, { once: true });
        }

        // ถ้ามีข้อความเดิม → slide out ก่อน
        if (hintEl.textContent && hintEl.textContent !== "กำลังโหลดโจทย์...") {
            hintEl.classList.remove("hint-slide-in");
            hintEl.classList.add("hint-slide-out");
            hintEl.addEventListener("animationend", () => {
                applyNewHint();
            }, { once: true });
        } else {
            applyNewHint();
        }
    }

    // --------------------------------------------------
    // ฟังก์ชันตรวจคำตอบ โหมด Duo
    // --------------------------------------------------
    function checkAnswer() {
        if (isSubmitting) return;
        isSubmitting = true;

        let answerField = document.getElementById("userInput");
        let resultDisplay = document.getElementById("resultMessage");
        let submitBtn = document.getElementById("submitBtn");

        function grantAchievement(achId) {
            let users = JSON.parse(localStorage.getItem("users")) || [];
            let currentUser = localStorage.getItem("loggedInUser");
            let uIdx = users.findIndex(u => u.username === currentUser);
            if (uIdx !== -1) {
                if (!users[uIdx].unlockedAchievements) users[uIdx].unlockedAchievements = [];
                if (!users[uIdx].unlockedAchievements.includes(achId)) {
                    users[uIdx].unlockedAchievements.push(achId);
                    localStorage.setItem("users", JSON.stringify(users));
                    if (typeof window.showAchievementToast === 'function') window.showAchievementToast(achId);
                }
            }
        }

        let userTyped = answerField.value.trim().replace(/\s+/g, '').toLowerCase();
        let correctNormalized = correctAnswer.trim().replace(/\s+/g, '').toLowerCase();

        if (userTyped === "") {
            // 🟢 เปลี่ยนข้อความเตือนให้ใช้ FontAwesome
            resultDisplay.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> กรุณากรอกคำตอบก่อนส่ง';
            resultDisplay.style.color = "#f59e0b"; // สีส้มเตือน
            isSubmitting = false;
            return;
        }

        if (userTyped === correctNormalized) {
            // === ตอบถูก ===
            let earnedScore = SCORE_MAP[currentDifficulty];
            addScoreToUser(earnedScore);

            // 🟢 เปลี่ยนข้อความตอบถูกให้ใช้ FontAwesome
            resultDisplay.innerHTML = `<i class="fa-solid fa-circle-check"></i> ถูกต้อง! รับไป ${earnedScore} คะแนน`;
            resultDisplay.style.color = "#10B981"; // สีเขียว

            submitBtn.disabled = true;
            answerField.disabled = true;

            duoCorrectTotal++;
            duoStreak++;
            let timeTaken = (Date.now() - questionStartTime) / 1000;

            grantAchievement("duo-first");
            if (duoCorrectTotal >= 5) grantAchievement("duo-5");
            if (duoCorrectTotal >= 10) grantAchievement("duo-10");
            if (duoStreak >= 3) grantAchievement("duo-streak-3");
            if (timeTaken <= 8) grantAchievement("duo-speed");

            let users = JSON.parse(localStorage.getItem("users")) || [];
            let uIdx = users.findIndex(u => u.username === localStorage.getItem("loggedInUser"));
            if (uIdx !== -1) {
                let p = users[uIdx].questProgress || {};

                const addQuest = (qId, amt, isMax = false) => {
                    if (!p[qId]) p[qId] = { current: 0, claimed: false };
                    if (!p[qId].claimed) {
                        if (isMax) { if (amt > p[qId].current) p[qId].current = amt; }
                        else { p[qId].current += amt; }
                    }
                };

                let wordCount = correctAnswer.trim().split(/\s+/).length;

                addQuest("q_duo_5", 1);
                addQuest("q_streak_3", duoStreak, true);
                addQuest("q_score_30", earnedScore);
                addQuest("correct_5_times", 1);
                addQuest("type_3_words", wordCount);

                users[uIdx].questProgress = p;
                localStorage.setItem("users", JSON.stringify(users));
            }

            setTimeout(() => {
                resultDisplay.innerHTML = ""; // เคลียร์ข้อความ
                handleRoundProgress(false);
            }, 1000);
        } else {
            // === ตอบผิด ===
            // 🟢 เปลี่ยนข้อความตอบผิดให้ใช้ FontAwesome
            resultDisplay.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง ลองใหม่อีกครั้งนะ';
            resultDisplay.style.color = "#ef4444"; // สีแดง
            duoStreak = 0;
            isSubmitting = false;
        }
    }
    
    // ฟังก์ชันจัดการปุ่มและหน้าต่างทั่วไป
    window.closePopup = function (id) { document.getElementById(id).style.display = "none"; };
    window.goHome = function () { window.location.href = "../index.html"; };

    // --- ตอนหน้าเว็บโหลดเสร็จ ---
    loadGameState(); // โหลดเซฟ
    generateQuiz(); // สร้างหน้าเกมข้อแรก

    // ผู้เล่นสามารถกดปุ่มคลิก หรือกด Enter ในช่องเพื่อส่งคำตอบได้
    document.getElementById("submitBtn").addEventListener("click", checkAnswer);
    document.getElementById("userInput").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            checkAnswer();
        }
    });
});