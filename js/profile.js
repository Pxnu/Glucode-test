/* ==========================================
   PROFILE JS - ระบบจัดการโปรไฟล์และฉายา
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === loggedInUser);
    const user = users[userIndex];

    if (!user) {
        window.location.href = "../Login.html";
        return;
    }

    // 1. แมปข้อมูลชื่อฉายาจาก ID (เชื่อมกับ Achievement)
    const TITLE_MAP = {
        'code-first': 'First Step Coder',
        'code-correct-5': 'Code Apprentice',
        'code-correct-10': 'Algorithm Master',
        'word-3': 'Streak King',
        'quiz-first': 'Fast Thinker',
        'code-speed': 'Flash Programmer'
    };

    // 2. โชว์รูปโปรไฟล์ (ถ้ามีรูป Base64 เก็บไว้)
    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar && user.avatar) {
        profileAvatar.src = user.avatar;
    }

    // 3. แสดงข้อมูลเบื้องต้น
    document.getElementById('disp-username').innerText = user.username;
    document.getElementById('val-username').innerText = user.username;
    document.getElementById('val-email').innerText = user.email || "No Email Provided";
    document.getElementById('disp-coins').innerText = user.coins || 0;
    document.getElementById('disp-total-score').innerText = (user.scoreDuo || 0) + (user.scoreBox || 0);
    document.getElementById('input-bio').value = user.bio || "";
    
    // แสดงฉายาปัจจุบัน
    const titleBadge = document.getElementById('selected-title-display');
    titleBadge.innerText = user.currentTitle || "Newbie Coder";

    // 4. จัดการ dropdown ฉายาที่ปลดล็อกแล้ว
    const titleSelect = document.getElementById('title-select');
    const unlocked = user.unlockedAchievements || [];

    unlocked.forEach(id => {
        if (TITLE_MAP[id]) {
            const option = document.createElement('option');
            option.value = TITLE_MAP[id];
            option.innerText = TITLE_MAP[id];
            if (user.currentTitle === TITLE_MAP[id]) option.selected = true;
            titleSelect.appendChild(option);
        }
    });

    // 5. ระบบบันทึกข้อมูลหน้า Profile
    const saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const newBio = document.getElementById('input-bio').value;
            const newTitle = titleSelect.value || "Newbie Coder";

            users[userIndex].bio = newBio;
            users[userIndex].currentTitle = newTitle;

            localStorage.setItem("users", JSON.stringify(users));
            titleBadge.innerText = newTitle;
            
            const originalText = saveBtn.innerText;
            saveBtn.innerText = "บันทึกสำเร็จ! ✔️";
            saveBtn.style.background = "#10b981"; // สีเขียว

            setTimeout(() => {
                saveBtn.innerText = originalText;
                saveBtn.style.background = ""; // กลับเป็นสีเดิม
            }, 2000);
        });
    }
});