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

    // 1. โหลดข้อมูลเดิมมาใส่ช่อง Input
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

    // 🟢 (ลบโค้ดระบบเปิด/ปิดตารหัสผ่านออกไปแล้ว)

    // 2. ระบบเลือกและ Crop รูปภาพโปรไฟล์ (Cropper.js)
    let cropper;
    const cropModal = document.getElementById('cropModal');
    const cropImage = document.getElementById('cropImage');

    if (avatarInput) {
        avatarInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) { // ไม่เกิน 2MB
                    alert("รูปภาพใหญ่เกินไป! กรุณาใช้รูปขนาดไม่เกิน 2MB");
                    this.value = "";
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (event) {
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

    window.closeCropModal = function () {
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

    // 3. ระบบบันทึกการตั้งค่า (รวมตรวจสอบรหัสผ่าน)
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const newEmail = emailInput ? emailInput.value : user.email;

            // ตรวจสอบการเปลี่ยนรหัสผ่าน
            const oldPwd = oldPwdInput.value;
            const newPwd = newPwdInput.value;
            const confirmPwd = confirmPwdInput.value;

            // ถ้ามีการพิมพ์ข้อความใดๆ ในช่องรหัส ถือว่าผู้ใช้ต้องการเปลี่ยนรหัส
            if (oldPwd || newPwd || confirmPwd) {
                if (oldPwd !== user.password) {
                    alert("รหัสผ่านปัจจุบันไม่ถูกต้อง!");
                    return;
                }
                if (!newPwd || !confirmPwd) {
                    alert("กรุณากรอกรหัสผ่านใหม่ให้ครบถ้วน!");
                    return;
                }
                if (newPwd !== confirmPwd) {
                    alert("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน!");
                    return;
                }
                // บันทึกรหัสผ่านใหม่
                users[userIndex].password = newPwd;
            }

            // บันทึก Email และ Avatar
            users[userIndex].email = newEmail;
            users[userIndex].avatar = selectedAvatarBase64;

            localStorage.setItem("users", JSON.stringify(users));

            const originalText = saveBtn.innerText;
            saveBtn.innerText = "บันทึกข้อมูลเรียบร้อยแล้ว! ✔️";
            saveBtn.style.background = "#10b981";

            setTimeout(() => {
                saveBtn.innerText = originalText;
                saveBtn.style.background = "";
                window.location.reload();
            }, 1500);
        });
    }
});