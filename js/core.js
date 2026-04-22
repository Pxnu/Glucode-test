/* ==========================================
   CORE.JS - Auth, Navbar UI, Theme Manager
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ระบบ Auth (กันคนไม่ล็อกอิน) ---
    const loggedInUser = localStorage.getItem('loggedInUser');
    const path = window.location.pathname.toLowerCase();

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

    // --- 2. ระบบ Navbar & Dropdown & Daily Reset ---
    if (loggedInUser) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let userIndex = users.findIndex(u => u.username === loggedInUser);
        let currentUser = users[userIndex];

        if (currentUser) {
            // 🟢 ระบบรีเซ็ตเควสต์รายวัน (Daily Quest Reset)
            let today = new Date().toDateString(); // ดึงวันที่ปัจจุบัน
            if (currentUser.lastQuestDate !== today) {
                // ถัาเปลี่ยนวันใหม่ ให้ล้างข้อมูลเควสต์เก่าทิ้ง
                currentUser.lastQuestDate = today;
                currentUser.questProgress = {
                    'q_login': { current: 1, claimed: false } // แจกเควสต์ล็อกอินให้ 1/1 ทันที
                };
                localStorage.setItem('users', JSON.stringify(users));
            }

            let userCoins = currentUser.coins !== undefined ? currentUser.coins : 0;

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
                        <a href="${rootPath}Glucode LeaderBoard/leader_board.html?type=duo" class="dropdown-item">Find Game</a>
                        <a href="${rootPath}Glucode LeaderBoard/leader_board.html?type=boxgame" class="dropdown-item">Box Game</a> 
                    </div>
                `;
                const icon = document.getElementById('leaderboardIcon');
                if (icon) {
                    leaderBoardLi.addEventListener('mouseenter', () => icon.classList.replace('fa-angle-down', 'fa-angle-up'));
                    leaderBoardLi.addEventListener('mouseleave', () => icon.classList.replace('fa-angle-up', 'fa-angle-down'));
                }
            }

            if (navList) {
                let userIconHtml = `<i id="dropdownIcon" class="fa-solid fa-user" style="margin-right: 5px;"></i>`;
                if (currentUser.avatar) {
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

    // 🟢 สร้างฟังก์ชันดึงรายชื่อธีมแบบ Real-time เพื่อแก้บัคธีมหาย
    function getMyThemes() {
        let currentUsers = JSON.parse(localStorage.getItem("users")) || [];
        let activeUserForTheme = currentUsers.find(u => u.username === localStorage.getItem("loggedInUser"));
        return activeUserForTheme && activeUserForTheme.unlockedThemes ? activeUserForTheme.unlockedThemes : ['light', 'dark'];
    }

    let initialThemes = getMyThemes();

    if (!initialThemes.includes(savedTheme)) {
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
        // 🟢 ดึงข้อมูลสิทธิ์แบบล่าสุดทุกครั้งที่เปลี่ยนธีม
        let freshThemes = getMyThemes();

        if (!freshThemes.includes(theme)) return;

        body.className = '';
        if (theme !== 'light') {
            body.classList.add(theme);
        }
        localStorage.setItem('theme', theme);

        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);

            // 🟢 อัปเดตการแสดงผลปุ่มโดยอิงจากข้อมูลล่าสุด
            if (!freshThemes.includes(btn.dataset.theme)) {
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
            // 🟢 ตรวจสอบสิทธิ์แบบ Real-time ก่อนเปลี่ยนธีม
            let freshThemes = getMyThemes();
            if (freshThemes.includes(btn.dataset.theme)) {
                setTheme(btn.dataset.theme);
                if (themeSwitcherBox) themeSwitcherBox.classList.remove('open');
            }
        });
    });

    setTheme(savedTheme);
});

/* ==========================================
   GLOBAL ACHIEVEMENT TOAST SYSTEM test
========================================== */
// ฐานข้อมูลฉายา เพื่อดึงชื่อและไอคอนไปโชว์ใน Popup ขวาล่าง
const GLOBAL_ACHIEVEMENTS = {
    'box-first': { title: 'ก้าวแรกนักต่อโค้ด', desc: 'เล่นโหมด Box Game ครั้งแรก', icon: 'fa-puzzle-piece', color: '#4f46e5' },
    'box-5': { title: 'นักต่อโค้ดฝึกหัด', desc: 'ตอบถูกรวม 5 ข้อ (Box Game)', icon: 'fa-layer-group', color: '#10b981' },
    'box-10': { title: 'ปรมาจารย์จิ๊กซอว์', desc: 'ตอบถูกรวม 10 ข้อ (Box Game)', icon: 'fa-crown', color: '#f59e0b' },
    'box-streak-3': { title: 'ต่อเนื่องไม่มีสะดุด!', desc: 'ตอบถูกติดกัน 3 ข้อ (Box Game)', icon: 'fa-fire', color: '#ef4444' },
    'box-speed': { title: 'ไวดั่งสายฟ้า', desc: 'ตอบถูกภายใน 5 วินาที', icon: 'fa-bolt', color: '#6366f1' },

    'duo-first': { title: 'ก้าวแรกนักพิมพ์โค้ด', desc: 'เล่นโหมด Find Game ครั้งแรก', icon: 'fa-keyboard', color: '#0ea5e9' },
    'duo-5': { title: 'พิมพ์คล่องมือ', desc: 'ตอบถูกรวม 5 ข้อ (Find Game)', icon: 'fa-code', color: '#10b981' },
    'duo-10': { title: 'แฮกเกอร์คีย์บอร์ด', desc: 'ตอบถูกรวม 10 ข้อ (Find Game)', icon: 'fa-laptop-code', color: '#f59e0b' },
    'duo-streak-3': { title: 'นิ้วไฟลุก!', desc: 'ตอบถูกติดกัน 3 ข้อ (Find Game)', icon: 'fa-fire-flame-curved', color: '#ef4444' },
    'duo-speed': { title: 'พิมพ์ไวดั่งพายุ', desc: 'ตอบถูกภายใน 8 วินาที', icon: 'fa-stopwatch', color: '#8b5cf6' }
};

// ฟังก์ชันสั่งโชว์ Popup โทรเรียกใช้ได้จากทุกหน้า
window.showAchievementToast = function (achId) {
    const data = GLOBAL_ACHIEVEMENTS[achId];
    if (!data) return;

    // สร้างตระกร้าใส่ Popup ถ้ายังไม่มี
    let container = document.getElementById('achievement-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'achievement-toast-container';
        document.body.appendChild(container);
    }

    // สร้างตัว Popup
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.style.borderLeftColor = data.color;

    // RGB to RGBA สำหรับพื้นหลังไอคอน (ทำให้สีจางลง 15%)
    toast.innerHTML = `
        <div class="toast-icon" style="color: ${data.color}; background: ${data.color}25;">
            <i class="fa-solid ${data.icon}"></i>
        </div>
        <div class="toast-content">
            <h4 class="toast-header">🏆 Achievement Unlocked</h4>
            <h3>${data.title}</h3>
            <p>${data.desc}</p>
        </div>
    `;

    container.appendChild(toast);

    // เล่นแอนิเมชันสไลด์เข้า
    setTimeout(() => toast.classList.add('show'), 50);

    // หน่วงเวลา 4.5 วินาทีแล้วสไลด์ออก
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500); // ลบออกจาก HTML หลังสไลด์ออกเสร็จ
    }, 4500);
};