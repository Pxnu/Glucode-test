/* ==========================================
   ACHIEVEMENT JS - จัดการหอเกียรติยศ (อัปเดตล่าสุด)
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
    const unlocked = user.unlockedAchievements || [];

    // ลูปหาการ์ด Achievement ทั้งหมดบนหน้าจอ (อิงจาก id เช่น id="box-first")
    const cards = document.querySelectorAll('.achievement-card');
    
    // เผื่อใช้โครงสร้างเก่าที่มี data-achievement ให้รองรับด้วย
    const oldCards = document.querySelectorAll('[data-achievement]');

    // จัดการเปลี่ยนสีและแม่กุญแจสำหรับโครงสร้างการ์ดแบบใหม่
    cards.forEach(card => {
        if (unlocked.includes(card.id)) {
            card.style.opacity = '1';
            card.style.filter = 'grayscale(0%)';
            card.style.border = '2px solid #10b981'; // ขอบเปลี่ยนเป็นสีเขียว
            
            const icon = card.querySelector('.status i');
            if (icon) {
                icon.classList.replace('fa-lock', 'fa-unlock');
                icon.style.color = '#10b981';
            }
        } else {
            // ถ้ายืนยังไม่ปลดล็อก ให้ทำเป็นสีเทาๆ ทึบๆ
            card.style.opacity = '0.6';
            card.style.filter = 'grayscale(100%)';
        }
    });

    // จัดการแบบโครงสร้างเก่า เผื่อหน้า HTML บางคนยังไม่ได้อัปเดต
    oldCards.forEach(item => {
        const key = item.getAttribute('data-achievement');
        if (unlocked.includes(key) || (user.achievements && user.achievements.includes(key))) {
            item.textContent = item.textContent.replace("🔒", "✅");
            item.classList.add("unlocked");
        }
    });
});