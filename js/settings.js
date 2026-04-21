/* ==========================================
   SETTINGS JS - จัดการข้อมูลบัญชี (รูป, ชื่อ, รหัสผ่าน)
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === loggedInUser);
    const user = users[userIndex];

    if (!user) {
        window.location.href = "../Login.html";
        return;
    }

    // โหลดข้อมูลเดิมมาใส่ช่อง Input
    const emailInput = document.getElementById('setting-email');
    const usernameInput = document.getElementById('setting-username');
    const avatarPreview = document.getElementById('setting-avatar-preview');
    const avatarInput = document.getElementById('avatar-input');
    
    // ช่องรหัสผ่าน
    const oldPassInput = document.getElementById('setting-old-pass');
    const newPassInput = document.getElementById('setting-new-pass');
    const confirmPassInput = document.getElementById('setting-confirm-pass');
    
    if (emailInput) emailInput.value = user.email || "";
    if (usernameInput) usernameInput.value = user.username;
    
    let selectedAvatarBase64 = user.avatar || ""; 
    if (user.avatar && avatarPreview) {
        avatarPreview.src = user.avatar;
    }

    // จัดการอัปโหลดรูปภาพใหม่
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 1048576) { // กันไฟล์เกิน 1MB
                    alert("รูปภาพใหญ่เกินไป! กรุณาใช้รูปขนาดไม่เกิน 1MB");
                    this.value = ""; 
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64String = event.target.result;
                    if (avatarPreview) avatarPreview.src = base64String;
                    selectedAvatarBase64 = base64String; 
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // ระบบบันทึกการตั้งค่า
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const newEmail = emailInput ? emailInput.value.trim() : user.email;
            const newUsername = usernameInput ? usernameInput.value.trim() : user.username;
            
            const oldPass = oldPassInput ? oldPassInput.value : "";
            const newPass = newPassInput ? newPassInput.value : "";
            const confPass = confirmPassInput ? confirmPassInput.value : "";

            // 🟢 1. ตรวจสอบการเปลี่ยนชื่อผู้ใช้ (Username)
            if (newUsername !== user.username) {
                if (newUsername === "") {
                    alert("ชื่อผู้ใช้ต้องไม่เป็นค่าว่าง!");
                    return;
                }
                // ตรวจสอบว่าชื่อใหม่ซ้ำกับคนอื่นไหม
                const isDuplicate = users.find(u => u.username === newUsername && u.username !== user.username);
                if (isDuplicate) {
                    alert("ชื่อผู้ใช้นี้มีคนใช้แล้ว กรุณาใช้ชื่ออื่น");
                    return;
                }

                // 🔄 ทำการย้ายข้อมูลเซฟเกมจากชื่อเก่าไปชื่อใหม่
                const boxSave = localStorage.getItem(`boxgame_persistence_${user.username}`);
                if (boxSave) {
                    localStorage.setItem(`boxgame_persistence_${newUsername}`, boxSave);
                    localStorage.removeItem(`boxgame_persistence_${user.username}`);
                }
                const duoSave = localStorage.getItem(`duo_persistence_${user.username}`);
                if (duoSave) {
                    localStorage.setItem(`duo_persistence_${newUsername}`, duoSave);
                    localStorage.removeItem(`duo_persistence_${user.username}`);
                }

                // เปลี่ยนชื่อใน Session ปัจจุบัน
                localStorage.setItem("loggedInUser", newUsername);
                users[userIndex].username = newUsername;
            }

            // 🟢 2. ตรวจสอบการเปลี่ยนรหัสผ่าน (Password)
            if (oldPass !== "" || newPass !== "" || confPass !== "") {
                if (oldPass !== user.password) {
                    alert("รหัสผ่านปัจจุบันไม่ถูกต้อง!");
                    return;
                }
                if (newPass !== confPass) {
                    alert("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน!");
                    return;
                }
                if (newPass.length < 4) {
                    alert("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร");
                    return;
                }
                // อัปเดตรหัสผ่านใหม่
                users[userIndex].password = newPass;
            }

            // 🟢 3. บันทึกข้อมูลอื่นๆ (อีเมล, รูปภาพ)
            users[userIndex].email = newEmail;
            users[userIndex].avatar = selectedAvatarBase64;
            
            // เซฟลง LocalStorage
            localStorage.setItem("users", JSON.stringify(users));
            
            // แสดงแอนิเมชันปุ่ม
            const originalText = saveBtn.innerText;
            saveBtn.innerText = "บันทึกข้อมูลเรียบร้อยแล้ว! ✔️";
            saveBtn.style.background = "#10b981";

            setTimeout(() => {
                saveBtn.innerText = originalText;
                saveBtn.style.background = "";
                // ล้างช่องรหัสผ่านให้ว่างหลังเซฟเสร็จ
                if(oldPassInput) oldPassInput.value = "";
                if(newPassInput) newPassInput.value = "";
                if(confirmPassInput) confirmPassInput.value = "";
                
                window.location.reload(); 
            }, 1500);
        });
    }
});