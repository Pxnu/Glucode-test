// js/quest.js

// ข้อมูลโจทย์เควส ปรับให้ตรงกับการผ่านแต่ละด่านของแต่ละเกม
const questsData = [
    // หมวด Jigsaws (BoxGame)
    { id: "box-easy", title: "ก้าวแรกนักต่อจิ๊กซอว์", desc: "เล่นเคลียร์โหมด Jigsaws ระดับ Easy", target: 1, reward: 10, difficulty: "Easy", achievementId: "box-easy" },
    { id: "box-medium", title: "นักต่อโค้ดระดับกลาง", desc: "เล่นเคลียร์โหมด Jigsaws ระดับ Medium", target: 1, reward: 20, difficulty: "Medium", achievementId: "box-medium" },
    { id: "box-hard", title: "ผู้เชี่ยวชาญจิ๊กซอว์", desc: "เล่นเคลียร์โหมด Jigsaws ระดับ Hard", target: 1, reward: 30, difficulty: "Hard", achievementId: "box-hard" },
    { id: "box-expert", title: "ปรมาจารย์นักต่อโค้ด", desc: "เล่นเคลียร์โหมด Jigsaws ระดับ Expert", target: 1, reward: 50, difficulty: "Challenge", achievementId: "box-expert" },

    // หมวด พิมพ์โค้ด (Duo)
    { id: "duo-easy", title: "ก้าวแรกนักพิมพ์โค้ด", desc: "เล่นเคลียร์โหมด Duo ระดับ Easy", target: 1, reward: 10, difficulty: "Easy", achievementId: "duo-easy" },
    { id: "duo-medium", title: "นักพิมพ์คล่องมือ", desc: "เล่นเคลียร์โหมด Duo ระดับ Medium", target: 1, reward: 20, difficulty: "Medium", achievementId: "duo-medium" },
    { id: "duo-hard", title: "แฮกเกอร์คีย์บอร์ด", desc: "เล่นเคลียร์โหมด Duo ระดับ Hard", target: 1, reward: 30, difficulty: "Hard", achievementId: "duo-hard" },
    { id: "duo-expert", title: "เทพเจ้าการพิมพ์", desc: "เล่นเคลียร์โหมด Duo ระดับ Expert", target: 1, reward: 50, difficulty: "Challenge", achievementId: "duo-expert" }
];

function getUserData() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = localStorage.getItem('loggedInUser');
    let index = users.findIndex(u => u.username === currentUser);
    return { users, user: users[index], index };
}

// 🌟 ฟังก์ชันอัปเดตความคืบหน้าเควส + ปลดล็อก Achievement
window.updateQuestProgress = function(questId, amount = 1) {
    let { users, user, index } = getUserData();
    if (!user) return;

    if (!user.quests) user.quests = {}; 
    if (!user.claimedQuests) user.claimedQuests = [];
    if (!user.unlockedAchievements) user.unlockedAchievements = [];

    // ถ้าเควสนี้รับรางวัลไปแล้ว ไม่ต้องนับต่อ
    if (user.claimedQuests.includes(questId)) return;

    let currentProgress = user.quests[questId] || 0;
    let questInfo = questsData.find(q => q.id === questId);
    if (!questInfo) return;

    if (currentProgress < questInfo.target) {
        // ถ้านับ Streak ให้แทนที่ด้วยค่าสูงสุด / ถ้าเควสอื่นให้บวกเพิ่ม
        if (questId.includes("streak")) {
            user.quests[questId] = Math.max(currentProgress, amount);
        } else {
            user.quests[questId] = Math.min(currentProgress + amount, questInfo.target);
        }
        
        // แจ้งเตือนและปลดล็อก Achievement เมื่อทำเควสสำเร็จ
        if (user.quests[questId] >= questInfo.target && currentProgress < questInfo.target) {
            showQuestNotification(questInfo.title);
            
            // ปลดล็อค Achievement ทันที
            if (!user.unlockedAchievements.includes(questInfo.achievementId)) {
                user.unlockedAchievements.push(questInfo.achievementId);
                // เรียกโชว์ Popup โล่รางวัลจาก core.js
                if (typeof window.showAchievementToast === 'function') {
                    window.showAchievementToast(questInfo.achievementId);
                }
            }
        }
        
        localStorage.setItem('users', JSON.stringify(users));

        // รีเฟรชหน้าจอถ้ากำลังเปิดหน้า Quest อยู่
        if (document.getElementById("quest-list")) renderQuests();
    }
};

function showQuestNotification(title) {
    // 1. ดึง Container ตัวเดียวกับระบบ Achievement มาใช้ เพื่อให้มันเรียงต่อกัน (Stack) ไม่ซ้อนทับกัน
    let container = document.getElementById('achievement-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'achievement-toast-container';
        document.body.appendChild(container);
    }

    // 2. สร้างตัว Popup โดยใช้ Class เดียวกับ Achievement เพื่อยืมความสวยงามมาใช้
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    
    // กำหนดสีและไอคอนเฉพาะสำหรับ Quest (ตัวอย่างใช้สีม่วง)
    const questColor = '#8B5CF6'; 
    toast.style.borderLeftColor = questColor;
    
    // โครงสร้าง HTML เดียวกับ Toast ใน core.js
    toast.innerHTML = `
        <div class="toast-icon" style="color: ${questColor}; background: ${questColor}25;">
            <i class="fa-solid fa-scroll"></i>
        </div>
        <div class="toast-content">
            <h4 class="toast-header" style="color: ${questColor};">📜 Quest Completed</h4>
            <h3>${title}</h3>
            <p>ไปรับรางวัลที่หน้า Quests ได้เลย!</p>
        </div>
    `;

    // 3. เอาไปใส่ในตะกร้า
    container.appendChild(toast);

    // 4. เล่นแอนิเมชันสไลด์เข้า
    setTimeout(() => toast.classList.add('show'), 50);

    // 5. หน่วงเวลา 4 วินาทีแล้วสไลด์ออก พร้อมลบออกจากหน้าเว็บ
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500); 
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("quest-list")) {
        renderQuests();
        updateUserStatsUI();
    }
});

function renderQuests() {
    let list = document.getElementById("quest-list");
    if (!list) return;

    list.innerHTML = "";
    let { user } = getUserData();
    if (!user) return;

    if (!user.quests) user.quests = {};
    if (!user.claimedQuests) user.claimedQuests = [];

    questsData.forEach(q => {
        let progress = user.quests[q.id] || 0;
        let isCompleted = progress >= q.target;
        let isClaimed = user.claimedQuests.includes(q.id);
        let progressPercent = (progress / q.target) * 100;

        let difficultyColor = "";
        if (q.difficulty === "Easy") difficultyColor = "#10B981"; // เขียว
        else if (q.difficulty === "Medium") difficultyColor = "#F59E0B"; // ส้ม
        else if (q.difficulty === "Hard") difficultyColor = "#EF4444"; // แดง
        else if (q.difficulty === "Challenge") difficultyColor = "#8B5CF6"; // ม่วง

        let li = document.createElement("div");
        li.className = "quest-item " + (isClaimed ? "claimed" : (isCompleted ? "completed" : ""));
        
        li.innerHTML = `
            <div class="quest-info">
                <h3>${q.title} <span style="font-size: 0.8rem; background: ${difficultyColor}20; color: ${difficultyColor}; padding: 3px 8px; border-radius: 12px; margin-left: 8px;">${q.difficulty}</span></h3>
                <p>${q.desc}</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progressPercent}%"></div>
                </div>
                <span class="progress-text">${progress} / ${q.target}</span>
            </div>
            <div class="quest-action">
                <div class="reward">💰 ${q.reward}</div>
                ${isClaimed 
                    ? `<button class="claim-btn claimed-btn" disabled>รับแล้ว ✅</button>`
                    : `<button class="claim-btn ${isCompleted ? 'ready' : ''}" 
                        ${!isCompleted ? 'disabled' : `onclick="claimReward('${q.id}', ${q.reward})"`}>
                        ${isCompleted ? 'รับรางวัล' : 'ยังไม่สำเร็จ'}
                       </button>`
                }
            </div>
        `;
        list.appendChild(li);
    });
}

window.claimReward = function(questId, reward) {
    let { users, user, index } = getUserData();
    if (!user) return;

    if (!user.claimedQuests) user.claimedQuests = [];
    if (!user.coins) user.coins = 0;

    if (!user.claimedQuests.includes(questId)) {
        user.claimedQuests.push(questId);
        user.coins += reward;
        localStorage.setItem('users', JSON.stringify(users));

        renderQuests();
        updateUserStatsUI();
        
        let coinDisplay = document.querySelector('.coin-display strong');
        if (coinDisplay) coinDisplay.textContent = user.coins;
    }
};

function updateUserStatsUI() {
    let { user } = getUserData();
    if (!user) return;
    let coinUI = document.getElementById("user-coins");
    if (coinUI) coinUI.textContent = user.coins || 0;
}