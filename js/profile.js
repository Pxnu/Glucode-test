/* ==========================================
   PROFILE JS - ข้อมูลผู้ใช้งาน
   ==========================================
   จัดการดึงข้อมูลจาก localStorage มาแสดงผล
   และระบบบันทึกข้อมูลส่วนตัว (Profile Update)
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. ดึงข้อมูลพื้นฐาน
    const loggedInUser = localStorage.getItem("loggedInUser");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // ค้นหา Object ของผู้ใช้ปัจจุบัน
    const userIndex = users.findIndex(u => u.username === loggedInUser);
    const user = users[userIndex];

    if (!user) {
        // ถ้าไม่มีข้อมูล ให้เด้งกลับหน้า Login
        window.location.href = "../Login.html";
        return;
    }

    // 2. แสดงผลข้อมูลลงใน HTML
    const displayFields = {
        'disp-username': user.username,
        'disp-coins': user.coins || 0,
        'disp-total-score': (user.scoreDuo || 0) + (user.scoreBox || 0),
        'input-email': user.email || "ไม่ระบุอีเมล",
        'input-username': user.username,
        'input-bio': user.bio || ""
    };

    // วนลูปนำข้อมูลไปใส่ตาม ID ที่ตั้งไว้
    for (let id in displayFields) {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.value = displayFields[id];
            } else {
                el.innerText = displayFields[id];
            }
        }
    }

    // 3. ระบบบันทึกการเปลี่ยนแปลง (Save Changes)
    const saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const newBio = document.getElementById('input-bio').value;
            
            // อัปเดตข้อมูลใน Array
            users[userIndex].bio = newBio;
            
            // เซฟกลับลง localStorage
            localStorage.setItem("users", JSON.stringify(users));

            // แสดงสถานะการบันทึก
            saveBtn.innerText = "บันทึกสำเร็จ! ✔️";
            saveBtn.style.background = "#10B981"; // สีเขียว

            setTimeout(() => {
                saveBtn.innerText = "Save Changes";
                saveBtn.style.background = ""; // กลับเป็นสีธีมปกติ
            }, 2000);
        });
    }

    // 4. แสดงระดับ (Rank) ตามคะแนน
    const rankLabel = document.getElementById('profile-rank');
    if (rankLabel) {
        const totalScore = (user.scoreDuo || 0) + (user.scoreBox || 0);
        let rank = "Beginner";
        
        if (totalScore >= 500) rank = "Master of Code";
        else if (totalScore >= 200) rank = "Professional";
        else if (totalScore >= 50) rank = "Intermediate";
        
        rankLabel.innerText = rank;
    }
});