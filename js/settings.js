/* ==========================================
   SETTINGS JS - จัดการอัปโหลดรูปภาพ, รหัสผ่าน และบัญชี
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

    // 🟢 ระบบเลือกและ Crop รูปภาพโปรไฟล์ (Cropper.js)
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

    // 🟢 ฟังก์ชันแสดง Popup แจ้งเตือนรหัสผ่านและการบันทึก
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

        // เซ็ตตัวแปรบอกว่าปิดหน้าต่างแล้วต้องรีเฟรชหน้าเว็บไหม
        modal.dataset.reload = reloadOnClose ? 'true' : 'false';
        modal.style.display = 'flex';
    };

    window.closePwdAlertModal = function() {
        const modal = document.getElementById('passwordAlertModal');
        modal.style.display = 'none';
        
        // ถ้าระบุว่าต้องรีเฟรช ให้รีเฟรชหน้าเว็บ (ใช้ตอนบันทึกสำเร็จ)
        if (modal.dataset.reload === 'true') {
            window.location.reload();
        }
    };

    // ระบบบันทึกการตั้งค่า (รวมตรวจสอบรหัสผ่าน)
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const newEmail = emailInput ? emailInput.value : user.email;

            // ตรวจสอบการเปลี่ยนรหัสผ่าน
            const oldPwd = oldPwdInput.value;
            const newPwd = newPwdInput.value;
            const confirmPwd = confirmPwdInput.value;

            // ถ้ามีการพิมพ์อะไรลงไปในช่องรหัสผ่าน ถือว่าต้องการเปลี่ยนรหัส
            if (oldPwd || newPwd || confirmPwd) {
                // เช็ครหัสเดิม
                if (oldPwd !== user.password) {
                    showPwdAlert('error', 'รหัสผ่านไม่ถูกต้อง', 'รหัสผ่านปัจจุบันที่คุณระบุไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
                    return;
                }
                // เช็ครหัสใหม่ว่ากรอกครบไหม
                if (!newPwd || !confirmPwd) {
                    showPwdAlert('error', 'ข้อมูลไม่ครบถ้วน', 'กรุณากรอกรหัสผ่านใหม่และการยืนยันรหัสผ่านให้ครบถ้วน');
                    return;
                }
                // เช็ครหัสใหม่ว่าตรงกันไหม
                if (newPwd !== confirmPwd) {
                    showPwdAlert('error', 'รหัสผ่านไม่ตรงกัน', 'รหัสผ่านใหม่ที่คุณตั้ง กับ การยืนยันรหัสผ่านไม่ตรงกัน');
                    return;
                }
                
                // ถ้าผ่านเงื่อนไขหมด บันทึกรหัสใหม่
                users[userIndex].password = newPwd;
            }

            // บันทึก Email และ รูปโปรไฟล์ที่ถูก Crop
            users[userIndex].email = newEmail;
            users[userIndex].avatar = selectedAvatarBase64;
            
            localStorage.setItem("users", JSON.stringify(users));
            
            // โชว์ Popup บันทึกสำเร็จ และสั่งให้รีเฟรชเมื่อปิด
            showPwdAlert('success', 'บันทึกข้อมูลสำเร็จ', 'การตั้งค่าและข้อมูลบัญชีของคุณถูกอัปเดตเรียบร้อยแล้ว', true);
        });
    }
});