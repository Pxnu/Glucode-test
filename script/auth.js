// --- Glucode/script/auth.js ---
const loggedInUser = localStorage.getItem('loggedInUser');

function getLoginPath() {
    const currentPath = window.location.pathname.toLowerCase();
    // 🛠️ แก้ไขตรงนี้: เพิ่ม learnpage เข้าไปในเงื่อนไข
    if (currentPath.includes("game") || currentPath.includes("quest") || currentPath.includes("leaderboard") || currentPath.includes("learnpage")) {
        return "../Login.html";
    }
    return "./Login.html";
}

const loginPath = getLoginPath();

if (!loggedInUser) {
    window.location.href = loginPath;
}

document.addEventListener('click', (e) => {
    const logoutBtn = e.target.closest('#logoutBtn');
    
    if (logoutBtn) {
        e.preventDefault();
        
        document.body.style.cursor = "wait";
        logoutBtn.style.cursor = "wait";
        logoutBtn.style.pointerEvents = "none";
        logoutBtn.textContent = "Logging out...";

        setTimeout(() => {
            document.body.style.cursor = "default";
            localStorage.removeItem("loggedInUser");
            sessionStorage.removeItem("hasSeenWelcome");
            
            window.location.href = loginPath;
        }, 800);
    }
});