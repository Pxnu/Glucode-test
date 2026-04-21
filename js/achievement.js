/* ==========================================
   ACHIEVEMENT JS - จัดการหอเกียรติยศ
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

    // ลูปหาการ์ด Achievement ทั้งหมดบนหน้าจอ
    const cards = document.querySelectorAll('.achievement-card');
    cards.forEach(card => {
        if (unlocked.includes(card.id)) {
            // ถ้าปลดล็อกแล้ว ให้แสดงสีสันสดใส และเปลี่ยนไอคอนกุญแจ
            card.style.opacity = '1';
            card.style.filter = 'grayscale(0%)';
            card.style.border = '2px solid #10b981'; // ขอบเขียว
            
            const icon = card.querySelector('.status i');
            if (icon) {
                icon.classList.replace('fa-lock', 'fa-unlock');
                icon.style.color = '#10b981'; // สีเขียว
            }
        } else {
            // ถ้ายืนยังไม่ปลดล็อก ให้ทำเป็นสีเทาๆ ทึบๆ
            card.style.opacity = '0.6';
            card.style.filter = 'grayscale(100%)';
        }
    });
});