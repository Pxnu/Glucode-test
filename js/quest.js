/* ==========================================
   QUEST JS - ระบบจัดการภารกิจรายวัน (มีเวลานับถอยหลัง)
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === loggedInUser);
    
    if (userIndex === -1) {
        window.location.href = "../Login.html";
        return;
    }

    const user = users[userIndex];
    if (!user.questProgress) user.questProgress = {}; 

    // 🟢 ระบบเวลานับถอยหลังถึงเที่ยงคืน (Countdown Timer)
    function updateCountdown() {
        const now = new Date();
        // หาวันพรุ่งนี้ เวลา 00:00:00
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeLeft = tomorrow - now; // ลบกันออกมาเป็นมิลลิวินาที

        // คำนวณเป็น ชั่วโมง นาที วินาที
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const countdownEl = document.getElementById('countdownTimer');
        if (countdownEl) {
            // padStart(2, '0') ช่วยเติมเลข 0 ด้านหน้าถ้าเลขมีหลักเดียว เช่น 09 นาที 05 วินาที
            countdownEl.innerText = `${String(hours).padStart(2, '0')} ชม. ${String(minutes).padStart(2, '0')} นาที ${String(seconds).padStart(2, '0')} วินาที`;
        }
    }
    
    // เรียกใช้ทันทีตอนเปิดหน้าเว็บ และตั้งเวลาให้อัปเดตทุก 1 วินาที (1000 ms)
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 🟢 ฐานข้อมูล Quest (รวมเควสต์เก่า 2 อัน และใหม่ 5 อัน รวมเป็น 7 อัน)
    const QUEST_DATA = [
        { id: 'q_login', title: 'เข้าสู่ระบบประจำวัน', desc: 'ล็อกอินเข้าสู่ระบบ Glucode (รีเซ็ตทุกวัน)', max: 1, reward: 10, icon: 'fa-right-to-bracket', color: '#3b82f6', bg: '#eff6ff' },
        { id: 'q_box_5', title: 'นักต่อบล็อกโค้ด', desc: 'ตอบถูกในโหมด Jigsaws 5 ข้อ', max: 5, reward: 20, icon: 'fa-puzzle-piece', color: '#10b981', bg: '#dcfce7' },
        { id: 'q_duo_5', title: 'นักพิมพ์โค้ดมือไว', desc: 'ตอบถูกในโหมด Duo 5 ข้อ', max: 5, reward: 30, icon: 'fa-keyboard', color: '#8b5cf6', bg: '#f3e8ff' },
        { id: 'q_streak_3', title: 'ต่อเนื่องไม่มีสะดุด', desc: 'ทำคอมโบตอบถูก 3 ข้อติดกันในโหมดใดก็ได้', max: 3, reward: 20, icon: 'fa-fire', color: '#ef4444', bg: '#fee2e2' },
        { id: 'q_score_30', title: 'นักสะสมคะแนน', desc: 'สะสมคะแนนจากการเล่นให้ครบ 30 Pts', max: 30, reward: 40, icon: 'fa-star', color: '#f59e0b', bg: '#fef3c7' },
        { id: 'type_3_words', title: 'ฝึกพิมพ์ 3 คำ', desc: 'พิมพ์โค้ดให้ถูกต้อง 3 คำ', max: 3, reward: 20, icon: 'fa-font', color: '#ec4899', bg: '#fce7f3' },
        { id: 'correct_5_times', title: 'ตอบถูก 5 ข้อ', desc: 'ตอบคำถามได้ถูกต้อง 5 ครั้ง', max: 5, reward: 50, icon: 'fa-check-double', color: '#14b8a6', bg: '#ccfbf1' }
    ];

    const container = document.getElementById('questContainer');
    const coinDisplay = document.getElementById('questCoinDisplay');

    function renderQuests() {
        coinDisplay.innerText = user.coins || 0;
        container.innerHTML = '';

        QUEST_DATA.forEach(q => {
            let progress = user.questProgress[q.id] || { current: 0, claimed: false };
            let currentAmount = Math.min(progress.current, q.max);
            let percent = (currentAmount / q.max) * 100;
            let isReady = currentAmount >= q.max && !progress.claimed;

            let btnHtml = '';
            if (progress.claimed) {
                btnHtml = `<button class="btn-claim btn-claimed" disabled><i class="fa-solid fa-check"></i> รับแล้ว</button>`;
            } else if (isReady) {
                btnHtml = `<button class="btn-claim btn-ready" onclick="claimReward('${q.id}', ${q.reward})">รับรางวัล</button>`;
            } else {
                btnHtml = `<button class="btn-claim btn-uncompleted" disabled>${currentAmount} / ${q.max}</button>`;
            }

            const card = document.createElement('div');
            card.className = 'quest-card';
            card.innerHTML = `
                <div class="quest-icon" style="color: ${q.color}; background: ${q.bg};">
                    <i class="fa-solid ${q.icon}"></i>
                </div>
                <div class="quest-info">
                    <h3>${q.title}</h3>
                    <p>${q.desc}</p>
                    <div class="progress-container">
                        <div class="progress-text">${currentAmount} / ${q.max}</div>
                        <div class="progress-bar" style="width: ${percent}%; background: ${q.color};"></div>
                    </div>
                </div>
                <div class="quest-reward">
                    <div class="reward-amt"><i class="fa-solid fa-coins"></i> +${q.reward}</div>
                    ${btnHtml}
                </div>
            `;
            container.appendChild(card);
        });
    }

    window.claimReward = function(questId, amount) {
        if (!user.questProgress[questId]) return;

        user.questProgress[questId].claimed = true;
        user.coins = (user.coins || 0) + amount;
        
        localStorage.setItem("users", JSON.stringify(users));

        const navCoin = document.querySelector('.coin-display strong');
        if (navCoin) navCoin.innerText = user.coins;

        renderQuests();
    };

    renderQuests();
});