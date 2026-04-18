/* ==========================================
   CORE.JS - Auth, Navbar UI, Theme Manager
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ระบบ Auth (กันคนไม่ล็อกอิน) ---
    const loggedInUser = localStorage.getItem('loggedInUser');
    const path = window.location.pathname.toLowerCase();
    const isSubFolder = path.includes("game") || path.includes("leaderboard") || path.includes("learnpage") || path.includes("quest") || path.includes("tutorial");
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
            if (link.textContent === 'Sign Up' || link.textContent === 'Sign In') {
                link.parentElement.style.display = 'none';
            }
        });

        // Dropdown: Leader Board
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
            const icon = document.getElementById('leaderboardIcon');
            leaderBoardLi.addEventListener('mouseenter', () => icon.classList.replace('fa-angle-down', 'fa-angle-up'));
            leaderBoardLi.addEventListener('mouseleave', () => icon.classList.replace('fa-angle-up', 'fa-angle-down'));
        }

        // Dropdown: Profile (ขวาสุด)
        if (navList) {
            const userLi = document.createElement('li');
            userLi.classList.add('user-dropdown-container');
            userLi.innerHTML = `
                <a href="#" id="dropdownToggleBtn" class="user-dropdown-btn">
                    ${loggedInUser} <i id="dropdownIcon" class="fa-solid fa-angle-down"></i>
                </a>
                <div class="user-dropdown-menu" id="dropdownMenu">
                    <div class="dropdown-item coin-display">
                        <span>Coins: <strong>${userCoins}</strong></span>
                    </div>
                    <hr class="dropdown-divider">
                    <a href="#" class="dropdown-item">Profile</a>
                    <a href="#" class="dropdown-item">Shop</a>
                    <a href="${rootPath}Glucode quest/quest.html" class="dropdown-item">Quests</a>
                    <a href="${rootPath}Glucode quest/achievement.html" class="dropdown-item">Achievement</a>
                    <a href="#" id="logoutBtn" class="dropdown-item">Logout</a>
                </div>
            `;
            navList.appendChild(userLi);

            const dIcon = document.getElementById('dropdownIcon');
            userLi.addEventListener('mouseenter', () => dIcon.classList.replace('fa-angle-down', 'fa-angle-up'));
            userLi.addEventListener('mouseleave', () => dIcon.classList.replace('fa-angle-up', 'fa-angle-down'));
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

    // --- 4. ระบบ Theme ---
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.className = "";
    if (savedTheme !== "light") document.body.classList.add(savedTheme);

    document.querySelectorAll('.theme-btn').forEach(btn => {
        if (btn.getAttribute('data-theme') === savedTheme) btn.classList.add('active');

        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.body.className = "";
            if (theme !== "light") document.body.classList.add(theme);
            localStorage.setItem("theme", theme);

            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});