/* ==========================================
   CORE.JS - Auth, Navbar UI, Theme Manager
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ระบบ Auth (กันคนไม่ล็อกอิน) ---
    const loggedInUser = localStorage.getItem('loggedInUser');
    const path = window.location.pathname.toLowerCase();
    
    // เพิ่ม profilepage และ themeshop เข้าไปในเงื่อนไขการถอย path
    const isSubFolder = path.includes("game") || 
                        path.includes("leaderboard") || 
                        path.includes("learnpage") || 
                        path.includes("quest") || 
                        path.includes("tutorial") ||
                        path.includes("profilepage") ||
                        path.includes("themeshop");

    const rootPath = isSubFolder ? "../" : "./";

    if (!loggedInUser && !path.includes("login")) {
        window.location.href = rootPath + "Login.html";
        return;
    }

    // --- 2. ระบบ Navbar & Dropdown ---
    if (loggedInUser) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let currentUser = users.find(u => u.username === loggedInUser);
        let userCoins = currentUser && currentUser.coins !== undefined ? currentUser.coins : 0;

        const navLinks = document.querySelectorAll('nav ul li a');
        const navList = document.querySelector('nav ul');

        navLinks.forEach(link => {
            if (link.textContent.trim() === 'Sign Up' || link.textContent.trim() === 'Sign In') {
                if (link.parentElement) {
                    link.parentElement.style.display = 'none';
                }
            }
        });

        const leaderBoardLink = Array.from(navLinks).find(link => link.textContent.trim() === 'Leader Board');
        if (leaderBoardLink && leaderBoardLink.parentElement) { 
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
            const icon = document.getElementById('leaderboardIcon');
            if (icon) {
                leaderBoardLi.addEventListener('mouseenter', () => icon.classList.replace('fa-angle-down', 'fa-angle-up'));
                leaderBoardLi.addEventListener('mouseleave', () => icon.classList.replace('fa-angle-up', 'fa-angle-down'));
            }
        }

        if (navList) {
            // เช็คว่ามีรูปโปรไฟล์อัปโหลดไว้ไหม
            let userIconHtml = `<i id="dropdownIcon" class="fa-solid fa-user" style="margin-right: 5px;"></i>`;
            if (currentUser && currentUser.avatar) {
                userIconHtml = `<img src="${currentUser.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-right: 8px; border: 2px solid var(--btn);">`;
            }

            const userLi = document.createElement('li');
            userLi.classList.add('user-dropdown-container');
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
                    <a href="${rootPath}Glucode Theme Shop/themeShop.html" class="dropdown-item">Shop</a>
                    <a href="${rootPath}Glucode quest/quest.html" class="dropdown-item">Quests</a>
                    <a href="${rootPath}Glucode quest/achievement.html" class="dropdown-item">Achievement</a>
                    <a href="#" id="logoutBtn" class="dropdown-item">Logout</a>
                </div>
            `;
            navList.appendChild(userLi);

            const dIcon = document.getElementById('dropdownArrow');
            if (dIcon) {
                userLi.addEventListener('mouseenter', () => dIcon.classList.replace('fa-angle-down', 'fa-angle-up'));
                userLi.addEventListener('mouseleave', () => dIcon.classList.replace('fa-angle-up', 'fa-angle-down'));
            }
        }

        const heroGreeting = document.querySelector('.header h2 span');
        if (heroGreeting) heroGreeting.textContent = loggedInUser;
    }

    // --- 3. ระบบ Logout ---
    document.addEventListener('click', (e) => {
        const logoutBtn = e.target.closest('#logoutBtn');
        if (logoutBtn) {
            e.preventDefault();
            document.body.style.cursor = "wait"; 
            logoutBtn.textContent = "Logging out...";
            setTimeout(() => {
                document.body.style.cursor = "default";
                localStorage.removeItem("loggedInUser"); 
                sessionStorage.removeItem("hasSeenWelcome");
                window.location.href = rootPath + "Login.html"; 
            }, 800);
        }
    });

    // --------------------------------------------------
    // 4. ระบบเปลี่ยนธีม (Theme Switcher แบบยืดหดได้)
    // --------------------------------------------------
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;
    let savedTheme = localStorage.getItem('theme') || 'light';

    // 🟢 ดึงข้อมูลสิทธิ์การครอบครองธีมของผู้ใช้
    let currentUsers = JSON.parse(localStorage.getItem("users")) || [];
    let activeUserForTheme = currentUsers.find(u => u.username === localStorage.getItem("loggedInUser"));
    let myThemes = activeUserForTheme && activeUserForTheme.unlockedThemes ? activeUserForTheme.unlockedThemes : ['light', 'dark'];

    // ป้องกันกรณีที่ผู้เล่นเซฟธีมไว้ แล้วจู่ๆ ธีมนั้นโดนรีเซ็ต จะให้กลับมาใช้ Light ทันที
    if (!myThemes.includes(savedTheme)) {
        savedTheme = 'light';
        localStorage.setItem('theme', 'light');
    }

    const themeSwitcherBox = document.getElementById('themeSwitcherBox');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    if (themeToggleBtn && themeSwitcherBox) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            themeSwitcherBox.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!themeSwitcherBox.contains(e.target)) {
                themeSwitcherBox.classList.remove('open');
            }
        });
    }

    function setTheme(theme) {
        // ห้ามเปลี่ยนธีมถ้ายังไม่ได้ปลดล็อก
        if (!myThemes.includes(theme)) return;

        body.className = ''; 
        if (theme !== 'light') {
            body.classList.add(theme); 
        }
        localStorage.setItem('theme', theme); 

        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
            
            // 🟢 ซ่อนปุ่มเปลี่ยนธีมที่ยังไม่ได้ปลดล็อก (ซื้อในร้าน)
            if (!myThemes.includes(btn.dataset.theme)) {
                btn.style.display = 'none';
            } else {
                btn.style.display = 'flex';
            }
        });
        
        if (themeToggleBtn) {
            const activeBtn = Array.from(themeButtons).find(b => b.dataset.theme === theme);
            if (activeBtn) {
                const themeIcon = activeBtn.querySelector('i');
                if (themeIcon) {
                    const themeIconClass = themeIcon.className;
                    themeToggleBtn.innerHTML = `<i class="${themeIconClass}"></i> <i class="fa-solid fa-angle-up arrow-icon"></i>`;
                }
            }
        }
    }

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (myThemes.includes(btn.dataset.theme)) {
                setTheme(btn.dataset.theme);
                if (themeSwitcherBox) themeSwitcherBox.classList.remove('open');
            }
        });
    });

    setTheme(savedTheme);
});