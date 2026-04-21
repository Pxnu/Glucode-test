/* ==========================================
   PROFILE JS - ระบบจัดการฉายาและข้อมูล
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

    // 1. แมปข้อมูลชื่อฉายาจาก ID ใน achievement.js
    // (รบกวนแก้ชื่อให้ตรงกับที่คุณตั้งไว้ในหน้า Achievement นะครับ)
    const TITLE_MAP = {
        'code-first': 'First Step Coder',
        'code-correct-5': 'Code Apprentice',
        'code-correct-10': 'Algorithm Master',
        'word-3': 'Streak King',
        'quiz-first': 'Fast Thinker',
        'code-speed': 'Flash Programmer'
    };

    // 2. แสดงข้อมูลเบื้องต้น
    document.getElementById('disp-username').innerText = user.username;
    document.getElementById('val-username').innerText = user.username;
    document.getElementById('val-email').innerText = user.email || "No Email Provided";
    document.getElementById('disp-coins').innerText = user.coins || 0;
    document.getElementById('disp-total-score').innerText = (user.scoreDuo || 0) + (user.scoreBox || 0);
    document.getElementById('input-bio').value = user.bio || "";
    
    // แสดงฉายาปัจจุบันที่หัวข้อ
    const titleBadge = document.getElementById('selected-title-display');
    titleBadge.innerText = user.currentTitle || "Newbie Coder";

    // 3. จัดการ dropdown ฉายาที่ปลดล็อกแล้ว
    const titleSelect = document.getElementById('title-select');
    const unlocked = user.unlockedAchievements || [];

    unlocked.forEach(id => {
        if (TITLE_MAP[id]) {
            const option = document.createElement('option');
            option.value = TITLE_MAP[id];
            option.innerText = TITLE_MAP[id];
            // ถ้าเป็นฉายาปัจจุบัน ให้เซ็ตเป็น Selected
            if (user.currentTitle === TITLE_MAP[id]) option.selected = true;
            titleSelect.appendChild(option);
        }
    });

    // 4. ระบบบันทึกข้อมูล
    const saveBtn = document.getElementById('saveProfileBtn');
    saveBtn.addEventListener('click', () => {
        const newBio = document.getElementById('input-bio').value;
        const newTitle = titleSelect.value || "Newbie Coder";

        // อัปเดตลงในฐานข้อมูล
        users[userIndex].bio = newBio;
        users[userIndex].currentTitle = newTitle;

        localStorage.setItem("users", JSON.stringify(users));

        // อัปเดต UI ทันที
        titleBadge.innerText = newTitle;
        
        // แอนิเมชันปุ่มบันทึกสำเร็จ
        const originalText = saveBtn.innerText;
        saveBtn.innerText = "บันทึกสำเร็จ! ✔️";
        saveBtn.style.background = "#10b981";

        setTimeout(() => {
            saveBtn.innerText = originalText;
            saveBtn.style.background = "";
        }, 2000);
    });
});