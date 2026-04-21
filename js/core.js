/* ==========================================
   CORE.JS - Auth, Navbar UI, Theme Manager
   (ไฟล์นี้ถูกรวมมาจากไฟล์ระบบล็อกอิน, ระบบสร้างเมนู Navbar และระบบเปลี่ยนธีม)
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ระบบ Auth (กันคนไม่ล็อกอิน) ---
    // ตรวจสอบว่ามีผู้ใช้ล็อกอินอยู่หรือไม่ ถ้าไม่มีจะเตะกลับไปหน้า Login
    const loggedInUser = localStorage.getItem('loggedInUser');
    const path = window.location.pathname.toLowerCase();
    // เช็คว่าหน้าปัจจุบันอยู่ในโฟลเดอร์ย่อยหรือไม่ เพื่อจัดการ path ของลิงก์ให้ถูกต้อง
    const isSubFolder = path.includes("game") || path.includes("leaderboard") || path.includes("learnpage") || path.includes("quest") || path.includes("tutorial") || path.includes("profile");
    const rootPath = isSubFolder ? "../" : "./";

    // ถ้าไม่ได้ล็อกอิน และไม่ได้อยู่หน้า login ให้เด้งกลับไปหน้า login ทันที
    if (!loggedInUser && !path.includes("login")) {
        window.location.href = rootPath + "Login.html";
        return;
    }

    // --- 2. ระบบ Navbar & Dropdown ---
    // ถ้าล็อกอินแล้ว ให้สร้างเมนูผู้ใช้และดึงข้อมูลเหรียญมาแสดง
    if (loggedInUser) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let currentUser = users.find(u => u.username === loggedInUser);
        let userCoins = currentUser && currentUser.coins !== undefined ? currentUser.coins : 0;

        const navLinks = document.querySelectorAll('nav ul li a');
        const navList = document.querySelector('nav ul');

        // ซ่อนปุ่ม Sign Up และ Sign In บน Navbar เพราะล็อกอินแล้ว
        navLinks.forEach(link => {
            if (link.textContent === 'Sign Up' || link.textContent === 'Sign In') {
                link.parentElement.style.display = 'none';
            }
        });

        // Dropdown: Leader Board (สร้างเมนูย่อยให้ Leader Board เลือกว่าจะดูของ Duo หรือ Jigsaws)
        const leaderBoardLink = Array.from(navLinks).find(link => link.textContent.trim() === 'Leader Board');
        if (leaderBoardLink) {
            const leaderBoardLi = leaderBoardLink.parentElement;
            leaderBoardLi.classList.add('user-dropdown-container');
            leaderBoardLi.innerHTML = `
                <a href="${rootPath}Glucode LeaderBoard/leader_board.html" class="user-dropdown-btn">
                    Leader Board <i id="leaderboardIcon" class="fa-solid fa-angle-down"></i>
                </a>
                <div class="user-dropdown-menu" style="left: 50%; transform: translateX(-50%); text-align: center;">
                    <a href="${rootPath}Glucode LeaderBoard/leader_board.html?type=duo" class="dropdown-item">Duo</a>
                    <a href="${rootPath}Glucode LeaderBoard/leader_board.html?type=boxgame" class="dropdown-item">Jigsaws</a> 
                </div>
            `;
            // เปลี่ยนลูกศรชี้ขึ้น/ลง เมื่อเอาเมาส์ชี้
            const icon = document.getElementById('leaderboardIcon');
            leaderBoardLi.addEventListener('mouseenter', () => icon.classList.replace('fa-angle-down', 'fa-angle-up'));
            leaderBoardLi.addEventListener('mouseleave', () => icon.classList.replace('fa-angle-up', 'fa-angle-down'));
        }

        // Dropdown: Profile
        if (navList) {
            // 🟢 ตรวจสอบว่าผู้ใช้มีรูปอัปโหลดไว้หรือไม่
            let userIconHtml = `<i id="dropdownIcon" class="fa-solid fa-user" style="margin-right: 5px;"></i>`;
            if (currentUser && currentUser.avatar) {
                // ถัามี ให้ใช้ tag img แบบวงกลมเล็กๆ แทน
                userIconHtml = `<img src="${currentUser.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-right: 8px; border: 2px solid var(--btn);">`;
            }

            const userLi = document.createElement('li');
            userLi.classList.add('user-dropdown-container');
            // 🟢 แทรก userIconHtml เข้าไปตรงปุ่มแทนไอคอนเดิม
            userLi.innerHTML = `
                <a href="${rootPath}Glucode ProfilePage/profile.html" id="dropdownToggleBtn" class="user-dropdown-btn" style="display: flex; align-items: center;">
                    ${userIconHtml} ${loggedInUser} <i id="dropdownArrow" class="fa-solid fa-angle-down" style="margin-left: 8px;"></i>
                </a>
                <div class="user-dropdown-menu" id="dropdownMenu">
                    <div class="dropdown-item coin-display">
                        <span>Coins: <strong>${userCoins}</strong></span>
                    </div>
                    <hr class="dropdown-divider">
                    <a href="${rootPath}Glucode ProfilePage/profile.html" class="dropdown-item">Profile</a>
                    <a href="#" class="dropdown-item">Shop</a>
                    <a href="${rootPath}Glucode quest/quest.html" class="dropdown-item">Quests</a>
                    <a href="${rootPath}Glucode quest/achievement.html" class="dropdown-item">Achievement</a>
                    <a href="#" id="logoutBtn" class="dropdown-item">Logout</a>
                </div>
            `;
            navList.appendChild(userLi);

            // แอนิเมชันลูกศร
            const dIcon = document.getElementById('dropdownArrow');
            if (dIcon) {
                userLi.addEventListener('mouseenter', () => dIcon.classList.replace('fa-angle-down', 'fa-angle-up'));
                userLi.addEventListener('mouseleave', () => dIcon.classList.replace('fa-angle-up', 'fa-angle-down'));
            }
        }

        // อัปเดตข้อความทักทายในหน้า Home ให้เป็นชื่อผู้ใช้
        const heroGreeting = document.querySelector('.header h2 span');
        if (heroGreeting) heroGreeting.textContent = loggedInUser;
    }

    // --- 3. ระบบ Logout ---
    // จัดการเมื่อกดปุ่ม Logout ให้เคลียร์ข้อมูลเซสชันแล้วเด้งไปหน้า Login
    document.addEventListener('click', (e) => {
        const logoutBtn = e.target.closest('#logoutBtn');
        if (logoutBtn) {
            e.preventDefault();
            document.body.style.cursor = "wait"; // เปลี่ยนเมาส์เป็นรูปโหลด
            logoutBtn.textContent = "Logging out...";
            setTimeout(() => {
                document.body.style.cursor = "default";
                localStorage.removeItem("loggedInUser"); // ลบชื่อคนล็อกอินออก
                sessionStorage.removeItem("hasSeenWelcome");
                window.location.href = rootPath + "Login.html"; // เด้งไปหน้า Login
            }, 800);
        }
    });

    // --------------------------------------------------
    // 4. ระบบเปลี่ยนธีม (Theme Switcher แบบยืดหดได้)
    // --------------------------------------------------
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'light';

    // ฟังก์ชันจัดการเปิด/ปิดเมนูธีม
    const themeSwitcherBox = document.getElementById('themeSwitcherBox');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    if (themeToggleBtn && themeSwitcherBox) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // กันไม่ให้กดแล้วเหตุการณ์ทะลุไปโดน document
            themeSwitcherBox.classList.toggle('open');
        });

        // ถ้ากดพื้นที่อื่นบนหน้าเว็บ ให้ปิดเมนูธีม
        document.addEventListener('click', (e) => {
            if (!themeSwitcherBox.contains(e.target)) {
                themeSwitcherBox.classList.remove('open');
            }
        });
    }

    // ฟังก์ชันสำหรับเซ็ตคลาสธีมให้ <body>
    function setTheme(theme) {
        body.className = ''; 
        if (theme !== 'light') {
            body.classList.add(theme); 
        }
        localStorage.setItem('theme', theme); 

        // อัปเดตสถานะปุ่ม (ปุ่มไหนถูกเลือกให้สว่างขึ้น)
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        
        // 🟢 เปลี่ยนไอคอนของปุ่มเปิด/ปิด ให้ตรงกับธีมที่เลือก
        if (themeToggleBtn) {
            const activeBtn = Array.from(themeButtons).find(b => b.dataset.theme === theme);
            if (activeBtn) {
                // คัดลอกไอคอนของธีมที่เลือก มาใส่ในปุ่มหลักแทน (ยกเว้นลูกศร)
                const themeIconClass = activeBtn.querySelector('i').className;
                themeToggleBtn.innerHTML = `<i class="${themeIconClass}"></i> <i class="fa-solid fa-angle-up arrow-icon"></i>`;
            }
        }
    }

    // กำหนด Event Listener ให้ทุกปุ่มสลับธีม
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
            // เมื่อเลือกธีมเสร็จ ให้หดเมนูเก็บอัตโนมัติ
            if (themeSwitcherBox) themeSwitcherBox.classList.remove('open');
        });
    });

    // สั่งรันธีมที่เซฟไว้ทันทีที่โหลดหน้าเว็บเสร็จ
    setTheme(savedTheme);
});