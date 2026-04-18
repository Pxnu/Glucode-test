// ข้อมูลโจทย์เควสที่เชื่อมกับเกมโดยตรง
const questsData = [
    { id: "q_duo_5", title: "Duo Beginner", desc: "ตอบคำถามในเกม Duo ให้ถูกครบ 5 ข้อ", target: 5, reward: 20 },
    { id: "q_box_3", title: "BoxGame Explorer", desc: "ต่อจิ๊กซอว์โค้ดใน BoxGame ให้ถูก 3 ด่าน", target: 3, reward: 15 },
    { id: "q_streak_3", title: "On Fire! 🔥", desc: "ทำคอมโบ (Streak) ตอบถูกติดกัน 3 ครั้งรวด", target: 3, reward: 30 },
    { id: "q_box_h1", title: "Heading Master", desc: "ประกอบโค้ดสร้างหัวข้อ <h1> ในเกม BoxGame", target: 1, reward: 10 },
    { id: "q_score_50", title: "นักสะสมแต้ม", desc: "สะสมคะแนนจากการเล่นเกม 50 คะแนน", target: 50, reward: 50 }
];

function getUserData() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = localStorage.getItem('loggedInUser');
    let index = users.findIndex(u => u.username === currentUser);
    return { users, user: users[index], index };
}

// 🌟 ฟังก์ชันหลักสำหรับรับค่าจากหน้าเกมมาอัปเดตความคืบหน้า
window.updateQuestProgress = function(questId, amount = 1) {
    let { users, user, index } = getUserData();
    if (!user) return;

    if (!user.quests) user.quests = {}; 
    if (!user.claimedQuests) user.claimedQuests = [];

    // ถ้าเควสนี้รับรางวัลไปแล้ว ไม่ต้องนับต่อ
    if (user.claimedQuests.includes(questId)) return;

    let currentProgress = user.quests[questId] || 0;
    let questInfo = questsData.find(q => q.id === questId);
    if (!questInfo) return;

    if (currentProgress < questInfo.target) {
        // ถ้านับ Streak ให้แทนที่ด้วยค่าสูงสุด / ถ้าเควสอื่นให้บวกเพิ่ม
        if (questId === "q_streak_3") {
            user.quests[questId] = Math.max(currentProgress, amount);
        } else {
            user.quests[questId] = Math.min(currentProgress + amount, questInfo.target);
        }
        
        localStorage.setItem('users', JSON.stringify(users));

        // แจ้งเตือนเมื่อทำเควสสำเร็จ
        if (user.quests[questId] >= questInfo.target && currentProgress < questInfo.target) {
            showQuestNotification(questInfo.title);
        }

        // รีเฟรชหน้าจอถ้ากำลังเปิดหน้า Quest อยู่
        if (document.getElementById("quest-list")) renderQuests();
    }
};

// เด้ง Popup แจ้งเตือนเวลาเควสเสร็จ
function showQuestNotification(title) {
    let popup = document.getElementById("achievement-popup");
    let popupText = document.getElementById("popup-text");

    if (!popup) {
        popup = document.createElement("div");
        popup.id = "achievement-popup";
        popupText = document.createElement("p");
        popupText.id = "popup-text";
        popup.appendChild(popupText);
        document.body.appendChild(popup);
    }

    popupText.textContent = "📜 เควสสำเร็จ: " + title;
    popup.classList.remove("show");
    setTimeout(() => popup.classList.add("show"), 50);
    setTimeout(() => popup.classList.remove("show"), 4000);
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

        let li = document.createElement("div");
        li.className = "quest-item " + (isClaimed ? "claimed" : (isCompleted ? "completed" : ""));
        
        li.innerHTML = `
            <div class="quest-info">
                <h3>${q.title}</h3>
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

// ระบบกดรับรางวัล
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