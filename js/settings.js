/* ==========================================
   SETTINGS JS - จัดการอัปโหลดรูปภาพ, เปลี่ยนชื่อ และรหัสผ่าน
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
    
    // ตัวแปรรหัสผ่าน
    const oldPwdInput = document.getElementById('setting-old-pwd');
    const newPwdInput = document.getElementById('setting-new-pwd');
    const confirmPwdInput = document.getElementById('setting-confirm-pwd');

    if (emailInput) emailInput.value = user.email || "";
    if (usernameInput) usernameInput.value = user.username;
    
    let selectedAvatarBase64 = user.avatar || ""; 
    if (user.avatar && avatarPreview) {
        avatarPreview.src = user.avatar;
    }

    // ระบบเลือกและ Crop รูปภาพโปรไฟล์ (Cropper.js)
    let cropper; 
    const cropModal = document.getElementById('cropModal');
    const cropImage = document.getElementById('cropImage');

    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) { 
                    showPwdAlert('error', 'รูปภาพใหญ่เกินไป!', 'กรุณาใช้รูปขนาดไม่เกิน 2MB');
                    this.value = ""; 
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    cropImage.src = event.target.result;
                    cropModal.style.display = 'flex'; 

                    if (cropper) cropper.destroy();

                    cropper = new Cropper(cropImage, {
                        aspectRatio: 1, 
                        viewMode: 1,    
                        dragMode: 'move', 
                        autoCropArea: 0.8, 
                        background: false, 
                        guides: true     
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    window.closeCropModal = function() {
        cropModal.style.display = 'none';
        if (cropper) cropper.destroy();
        if (avatarInput) avatarInput.value = ""; 
    };

    document.getElementById('cropConfirmBtn').addEventListener('click', () => {
        if (!cropper) return;

        const canvas = cropper.getCroppedCanvas({
            width: 300,
            height: 300
        });

        const base64String = canvas.toDataURL('image/jpeg', 0.8);
        
        if (avatarPreview) avatarPreview.src = base64String; 
        selectedAvatarBase64 = base64String; 

        closeCropModal();
    });

    // ฟังก์ชันแสดง Popup แจ้งเตือนรหัสผ่านและการบันทึก
    window.showPwdAlert = function(type, title, message, reloadOnClose = false) {
        const modal = document.getElementById('passwordAlertModal');
        const icon = document.getElementById('pwdAlertIcon');
        const titleEl = document.getElementById('pwdAlertTitle');
        const msgEl = document.getElementById('pwdAlertMessage');
        const btn = document.getElementById('pwdAlertBtn');

        titleEl.innerText = title;
        msgEl.innerText = message;

        if (type === 'error') {
            icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: #ef4444;"></i>';
            btn.style.background = '#ef4444'; // สีแดง
        } else if (type === 'success') {
            icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i>';
            btn.style.background = '#10b981'; // สีเขียว
        }

        modal.dataset.reload = reloadOnClose ? 'true' : 'false';
        modal.style.display = 'flex';
    };

    window.closePwdAlertModal = function() {
        const modal = document.getElementById('passwordAlertModal');
        modal.style.display = 'none';
        
        if (modal.dataset.reload === 'true') {
            window.location.reload();
        }
    };

    // ฟังก์ชันสำหรับปิดหน้าต่างยืนยันอีเมล
    window.closeEmailConfirmModal = function() {
        document.getElementById('emailConfirmModal').style.display = 'none';
        document.getElementById('email-confirm-pwd').value = '';
    };

    // ระบบบันทึกการตั้งค่า
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const newEmail = emailInput ? emailInput.value.trim() : user.email;
            
            // 🟢 ดึง Username ที่กรอกเข้ามา
            const newUsername = usernameInput ? usernameInput.value.trim() : user.username;

            // ตรวจสอบว่า Username ห้ามว่าง
            if (!newUsername) {
                showPwdAlert('error', 'ข้อมูลไม่ครบถ้วน', 'กรุณากรอก Username ระบบไม่อนุญาตให้ใช้ชื่อเว้นว่างได้');
                return;
            }

            // 🛑 ตรวจสอบอักษรพิเศษใน Username (อนุญาตเฉพาะตัวอักษรและตัวเลขเท่านั้น)
            const invalidCharsRegex = /[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/;
            if (invalidCharsRegex.test(newUsername)) {
                showPwdAlert('error', 'รูปแบบไม่ถูกต้อง', 'Username ไม่สามารถใส่อักษรพิเศษได้ (เช่น @, #, $, ฯลฯ)');
                return;
            }

            // 🟢 ตรวจสอบว่าเปลี่ยนชื่อไหม และถ้าเปลี่ยน ซ้ำกับ User อื่นในระบบไหม
            if (newUsername !== user.username) {
                const isDuplicate = users.some((u, idx) => u.username.toLowerCase() === newUsername.toLowerCase() && idx !== userIndex);
                if (isDuplicate) {
                    showPwdAlert('error', 'ชื่อผู้ใช้ซ้ำกัน', 'Username นี้มีคนใช้งานแล้ว กรุณาลองใช้ชื่ออื่น');
                    return;
                }
            }

            // ตรวจสอบการเปลี่ยนรหัสผ่าน
            const oldPwd = oldPwdInput.value;
            const newPwd = newPwdInput.value;
            const confirmPwd = confirmPwdInput.value;

            // ฟังก์ชันสำหรับเซฟข้อมูล (แยกออกมาเพื่อรอเรียกใช้งานหลังเช็ค Popup)
            const proceedToSave = () => {
                if (oldPwd || newPwd || confirmPwd) {
                    if (oldPwd !== user.password) {
                        showPwdAlert('error', 'รหัสผ่านไม่ถูกต้อง', 'รหัสผ่านปัจจุบันที่คุณระบุไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
                        return;
                    }
                    if (!newPwd || !confirmPwd) {
                        showPwdAlert('error', 'ข้อมูลไม่ครบถ้วน', 'กรุณากรอกรหัสผ่านใหม่และการยืนยันรหัสผ่านให้ครบถ้วน');
                        return;
                    }
                    if (newPwd !== confirmPwd) {
                        showPwdAlert('error', 'รหัสผ่านไม่ตรงกัน', 'รหัสผ่านใหม่ที่คุณตั้ง กับ การยืนยันรหัสผ่านไม่ตรงกัน');
                        return;
                    }
                    users[userIndex].password = newPwd;
                }

                // 🟢 บันทึกข้อมูลที่แก้ไขลงฐานข้อมูล
                users[userIndex].username = newUsername;
                users[userIndex].email = newEmail;
                users[userIndex].avatar = selectedAvatarBase64;
                
                localStorage.setItem("users", JSON.stringify(users));
                
                // 🟢 อัปเดต Session การล็อกอินด้วยชื่อใหม่
                localStorage.setItem("loggedInUser", newUsername);
                
                // โชว์ Popup บันทึกสำเร็จ
                showPwdAlert('success', 'บันทึกข้อมูลสำเร็จ', 'การตั้งค่าและข้อมูลบัญชีของคุณถูกอัปเดตเรียบร้อยแล้ว', true);
                
                const originalText = saveBtn.innerHTML;
                saveBtn.innerHTML = "บันทึกข้อมูลเรียบร้อยแล้ว! <i class='fa-solid fa-circle-check'></i>";
                saveBtn.style.background = "#10b981";

                setTimeout(() => {
                    saveBtn.innerHTML = originalText;
                    saveBtn.style.background = "";
                }, 1500);
            };

            // 🛑 ตรวจสอบการเปลี่ยนอีเมล ถ้ามีการแก้ไขอีเมล ให้เด้ง Popup ถามรหัสผ่านก่อน
            if (newEmail !== user.email) {
                const emailModal = document.getElementById('emailConfirmModal');
                const confirmBtn = document.getElementById('confirmEmailChangeBtn');
                
                emailModal.style.display = 'flex';
                
                // กำหนดคำสั่งให้ปุ่ม "ยืนยัน" ใน Popup
                confirmBtn.onclick = function() {
                    const confirmPwdValue = document.getElementById('email-confirm-pwd').value;
                    if (confirmPwdValue !== user.password) {
                        showPwdAlert('error', 'รหัสผ่านไม่ถูกต้อง', 'รหัสผ่านเพื่อยืนยันการเปลี่ยนอีเมลไม่ถูกต้อง กรุณาลองใหม่');
                        return;
                    }
                    
                    // ถ้ารหัสถูก ให้ปิด Popup และทำงานส่วนเซฟข้อมูลต่อ
                    closeEmailConfirmModal();
                    proceedToSave();
                };
                
                return; // หยุดการทำงานชั่วคราว รอผู้ใช้กรอกรหัสใน Popup
            } else {
                // ถ้าไม่ได้เปลี่ยนอีเมล ให้บันทึกข้อมูลได้เลย
                proceedToSave();
            }
        });
    }
});