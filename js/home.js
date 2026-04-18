/* ==========================================
   HOME.JS - Welcome Popup & Buttons
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');

    // --- 1. Welcome Popup ---
    const welcomeOverlay = document.getElementById("welcomeOverlay");
    const welcomeName = document.getElementById("welcomeName");
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");

    if (welcomeOverlay && welcomeName && loggedInUser) {
        if (!hasSeenWelcome) {
            welcomeName.textContent = loggedInUser;
            setTimeout(() => {
                welcomeOverlay.classList.add("hide");
                sessionStorage.setItem("hasSeenWelcome", "true");
                setTimeout(() => { welcomeOverlay.style.display = "none"; }, 500);
            }, 1200);
        } else {
            welcomeOverlay.style.display = "none";
        }
    }

    // --- 2. ปุ่ม Get Started ---
    const getStartedBtn = document.querySelector('#getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            document.body.style.cursor = 'wait';
            getStartedBtn.style.pointerEvents = 'none';
            getStartedBtn.textContent = 'Loading...';
            setTimeout(() => { window.location.href = './Glucode LearnPage/Learn.html'; }, 800);
        });
    }
});