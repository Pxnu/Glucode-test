/* ==========================================
   SETTINGS JS - ระบบจัดการข้อมูลบัญชีผู้ใช้
   ==========================================
   ควบคุมการดึงข้อมูลมาแสดงในฟอร์ม และบันทึก
   การอัปเดต (Username, Email, Password, Bio)
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. ตรวจสอบการล็อกอิน
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        window.location.href = "../Login.html"; // ถ้าไม่ได้ล็อกอิน เตะกลับไปหน้า Login
        return;
    }

    // 2. ดึงข้อมูล User จาก LocalStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userIndex = users.findIndex(u => u.username === loggedInUser);
    
    if (userIndex === -1) {
        window.location.href = "../Login.html";
        return;
    }

    const currentUserData = users[userIndex];

    // 3. นำข้อมูลปัจจุบันมาใส่ในช่องฟอร์มให้ผู้เล่นเห็น
    document.getElementById("displayCurrentUsername").innerText = currentUserData.username;
    document.getElementById("editUsername").value = currentUserData.username;
    document.getElementById("editEmail").value = currentUserData.email || "";
    document.getElementById("editBio").value = currentUserData.bio || "";

    // 4. จัดการเมื่อผู้ใช้กดปุ่ม "บันทึกการเปลี่ยนแปลง" (Submit Form)
    const settingsForm = document.getElementById("settingsForm");
    const messageBox = document.getElementById("settingsMessage");

    if (settingsForm) {
        settingsForm.addEventListener("submit", (e) => {
            e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชอัตโนมัติ

            // ดึงค่าใหม่ที่ผู้ใช้พิมพ์
            const newUsername = document.getElementById("editUsername").value.trim();
            const newEmail = document.getElementById("editEmail").value.trim();
            const newBio = document.getElementById("editBio").value.trim();
            const newPassword = document.getElementById("editPassword").value;
            const confirmPass = document.getElementById("confirmPassword").value;

            // ล้างข้อความแจ้งเตือนเก่า
            messageBox.className = "settings-message";
            messageBox.innerText = "";

            // --- ตรวจสอบความถูกต้อง (Validation) ---

            // เช็คว่ากรอกชื่อผู้ใช้หรืออีเมลว่างเปล่าหรือไม่
            if (newUsername === "" || newEmail === "") {
                showMessage("กรุณากรอก Username และ Email ให้ครบถ้วน", "error");
                return;
            }

            // ถ้ารหัสผ่านถูกกรอก ต้องเช็คว่าพิมพ์ตรงกัน 2 ช่องไหม
            if (newPassword !== "") {
                if (newPassword !== confirmPass) {
                    showMessage("รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน!", "error");
                    return;
                }
                if (newPassword.length < 6) {
                    showMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร", "error");
                    return;
                }
            }

            // ถ้ามีการเปลี่ยนชื่อผู้ใช้ ต้องเช็คว่าชื่อใหม่ซ้ำกับคนอื่นในระบบไหม
            if (newUsername !== loggedInUser) {
                const isDuplicate = users.some(u => u.username.toLowerCase() === newUsername.toLowerCase());
                if (isDuplicate) {
                    showMessage("Username นี้มีผู้ใช้งานแล้ว กรุณาเลือกชื่ออื่น", "error");
                    return;
                }
            }

            // --- ทำการอัปเดตข้อมูล (Update Data) ---
            users[userIndex].username = newUsername;
            users[userIndex].email = newEmail;
            users[userIndex].bio = newBio;
            
            // ถ้ายอมเปลี่ยนรหัส ให้บันทึกรหัสใหม่ลงไป
            if (newPassword !== "") {
                users[userIndex].password = newPassword; 
            }

            // เซฟข้อมูลกลับลง localStorage
            localStorage.setItem("users", JSON.stringify(users));

            // ถ้าเปลี่ยนชื่อ Username ต้องอัปเดต Session ล็อกอินด้วย
            if (newUsername !== loggedInUser) {
                localStorage.setItem("loggedInUser", newUsername);
                // อัปเดตข้อความบนหน้าจอให้เป็นชื่อใหม่ทันที
                document.getElementById("displayCurrentUsername").innerText = newUsername;
                
                // อัปเดตชื่อบน Navbar ด้วย (ถ้ามี)
                const navProfileText = document.querySelector('.user-dropdown-btn');
                if (navProfileText) {
                    navProfileText.innerHTML = `<i class="fa-solid fa-user"></i> ${newUsername} <i id="dropdownIcon" class="fa-solid fa-angle-down"></i>`;
                }
            }

            // แจ้งเตือนว่าบันทึกสำเร็จ
            showMessage("บันทึกการตั้งค่าเรียบร้อยแล้ว!", "success");
            
            // ล้างช่องรหัสผ่านเพื่อความปลอดภัย
            document.getElementById("editPassword").value = "";
            document.getElementById("confirmPassword").value = "";
        });
    }

    // ฟังก์ชันช่วยเหลือสำหรับแสดงข้อความแจ้งเตือน (สีเขียว/แดง)
    function showMessage(text, type) {
        messageBox.innerText = text;
        messageBox.classList.add(type); // เติมคลาส 'success' หรือ 'error'
    }
});