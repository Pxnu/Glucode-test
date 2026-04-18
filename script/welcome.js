// --- welcome.js ---

document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const welcomeOverlay = document.getElementById("welcomeOverlay");
    const welcomeName = document.getElementById("welcomeName");

    // ถ้าไม่มี Element หรือไม่ได้ล็อกอิน ให้ข้ามไป
    if (!welcomeOverlay || !welcomeName || !loggedInUser) return;

    // เช็คว่าเคยดูไปหรือยัง
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");

    if (!hasSeenWelcome) {
        // 🛠️ ไม่ต้องสั่งเปิด display แล้ว เพราะ HTML เปิดรอไว้ให้แล้ว (เลยไม่กระพริบแวบๆ)
        welcomeName.textContent = loggedInUser;
        
        // หน่วงเวลาให้ผู้เล่นอ่านข้อความสักพัก แล้วค่อยเล่นแอนิเมชันซ่อน
        setTimeout(() => {
            welcomeOverlay.classList.add("hide"); // แอนิเมชันเฟดออก
            sessionStorage.setItem("hasSeenWelcome", "true"); // บันทึกว่าดูแล้ว
            
            // รอแอนิเมชันทำงานเสร็จ ค่อยเอาออกจากหน้าจอเพื่อไม่ให้ขวางการคลิก
            setTimeout(() => {
                welcomeOverlay.style.display = "none";
            }, 500); 
        }, 1200); // ⏱️ ปรับเวลาโชว์หน้านี้ให้นานขึ้นนิดนึงได้ครับ (1200 = 1.2 วินาที)
    } 
    // ส่วน else ไม่ต้องมีแล้ว เพราะสคริปต์ดักในไฟล์ HTML จัดการปิดไปแล้ว
});