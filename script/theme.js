function setTheme(theme) {
    // ล้างคลาสธีมเก่าออก
    document.body.className = ""; 
    
    // ถ้าไม่ใช่ light (ค่าเริ่มต้น) ให้ใส่คลาสของธีมลงไปที่ body
    if (theme !== "light") { 
        document.body.classList.add(theme); 
    }
    
    // เซฟลงระบบ
    localStorage.setItem("theme", theme);
    
    // เปลี่ยนสถานะ Active ให้ปุ่มที่มี data-theme ตรงกับธีมปัจจุบัน
    document.querySelectorAll('.theme-btn').forEach(btn => {
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function applyTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
}

document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    
    // ผูกคำสั่งคลิกให้ปุ่มเปลี่ยนธีมทุกปุ่ม
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.getAttribute('data-theme'));
        });
    });
});