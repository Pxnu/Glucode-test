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
    const isSubFolder = path.includes("game") || path.includes("leaderboard") || path.includes("learnpage") || path.includes("quest") || path.includes("tutorial");
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

        // Dropdown: Profile (ขวาสุด) (สร้างเมนูโปรไฟล์ขวาสุด แสดงชื่อผู้ใช้, เหรียญ, Quest, และ Logout)
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

            // เปลี่ยนลูกศรชี้ขึ้น/ลง เมื่อเอาเมาส์ชี้
            const dIcon = document.getElementById('dropdownIcon');
            userLi.addEventListener('mouseenter', () => dIcon.classList.replace('fa-angle-down', 'fa-angle-up'));
            userLi.addEventListener('mouseleave', () => dIcon.classList.replace('fa-angle-up', 'fa-angle-down'));
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

    // --- 4. ระบบ Theme ---
    // จัดการเปลี่ยนธีมสีของเว็บไซต์ สว่าง/มืด/กิจกรรมต่างๆ
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.className = "";
    if (savedTheme !== "light") document.body.classList.add(savedTheme);

    document.querySelectorAll('.theme-btn').forEach(btn => {
        if (btn.getAttribute('data-theme') === savedTheme) btn.classList.add('active');

        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.body.className = "";
            if (theme !== "light") document.body.classList.add(theme); // ใส่ class ธีมลงใน body
            localStorage.setItem("theme", theme); // เซฟธีมลง LocalStorage

            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});