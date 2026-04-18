// เก็บรายชื่อ Achievement ภาษาไทย เพื่อให้หน้าเกมดึงไปโชว์ใน Popup ได้ถูกต้อง
const achievementNames = {
    "word-first": "เรียงคำสำเร็จครั้งแรก",
    "word-3": "เรียงคำถูก 3 ครั้ง",
    "word-5": "เรียงคำถูก 5 ครั้งติด",
    "word-speed": "เรียงคำภายใน 5 วินาที",
    "word-master": "Word Master (ครบ 10 ครั้ง)",
    "code-first": "เขียนโค้ดครั้งแรก",
    "code-if": "ใช้ if-else ได้",
    "code-loop": "ใช้ loop (for/while) ได้",
    "code-array": "ใช้ array ได้",
    "code-correct-5": "เขียนโค้ดถูก 5 ข้อ",
    "code-correct-10": "เขียนโค้ดถูก 10 ข้อ",
    "code-master": "Coding Master",
    "quiz-first": "ตอบถูกครั้งแรก",
    "quiz-3": "ตอบถูก 3 ข้อ",
    "quiz-5": "ตอบถูก 5 ข้อติด",
    "quiz-10": "ตอบถูก 10 ข้อ",
    "quiz-speed": "ตอบภายใน 5 วินาที",
    "quiz-master": "Quiz Master",
    "all-rounder": "All Rounder (ครบทุกหมวด)",
    "pro-player": "Pro Player (ปลดล็อกทั้งหมด)"
};

document.addEventListener('DOMContentLoaded', () => {
    loadAchievementsUI();
});

// ฟังก์ชันโหลดข้อมูลมาแสดงบนหน้าจอ Achievement
function loadAchievementsUI() {
    const currentUser = localStorage.getItem('loggedInUser');
    if (!currentUser) return;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.username === currentUser);

    if (user && user.achievements) {
        user.achievements.forEach(key => {
            const item = document.querySelector(`[data-achievement="${key}"]`);
            if (item) {
                item.textContent = item.textContent.replace("🔒", "✅");
                item.classList.add("unlocked");
            }
        });
    }
}

// ฟังก์ชันสั่งปลดล็อก (เรียกจากหน้าเกม)
window.unlockAchievement = function(key) {
    const currentUser = localStorage.getItem('loggedInUser');
    if (!currentUser) return;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(u => u.username === currentUser);
    
    if (userIndex === -1) return;

    if (!users[userIndex].achievements) {
        users[userIndex].achievements = [];
    }

    // ถ้าเคยปลดล็อกแล้ว ให้ข้ามไปเลย
    if (users[userIndex].achievements.includes(key)) return;

    // บันทึกลง localStorage
    users[userIndex].achievements.push(key);
    localStorage.setItem('users', JSON.stringify(users));

    // อัปเดตหน้า UI ทันที (ถ้ากำลังเปิดหน้าตู้โชว์อยู่)
    const item = document.querySelector(`[data-achievement="${key}"]`);
    if (item) {
        item.textContent = item.textContent.replace("🔒", "✅");
        item.classList.add("unlocked");
    }

    // ดึงชื่อภาษาไทยไปโชว์ (ถ้าหาไม่เจอให้ใช้ key แทน)
    let displayName = achievementNames[key] || key;
    showPopup(displayName);
};

// ฟังก์ชันแสดง Popup (ปรับปรุงใหม่ให้สร้าง HTML เองถ้ายืนอยู่หน้าเกม)
function showPopup(text) {
    let popup = document.getElementById("achievement-popup");
    let popupText = document.getElementById("popup-text");

    // ถ้ายืนอยู่หน้าเกมแล้วหาแท็ก HTML ไม่เจอ ให้ JS สร้างแท็กขึ้นมาเองเลย
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "achievement-popup";
        popupText = document.createElement("p");
        popupText.id = "popup-text";
        popup.appendChild(popupText);
        document.body.appendChild(popup);
    }

    popupText.textContent = "🏆 ปลดล็อกแล้ว: " + text;
    
    // รีเซ็ตคลาสก่อนเล่นแอนิเมชันใหม่
    popup.classList.remove("show");
    
    setTimeout(() => {
        popup.classList.add("show");
    }, 50);

    // ซ่อนเมื่อผ่านไป 4 วินาที
    setTimeout(() => {
        popup.classList.remove("show");
    }, 4000);
}