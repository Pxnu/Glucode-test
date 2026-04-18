document.addEventListener('DOMContentLoaded', () => {
    const getStartedBtn = document.querySelector('#getStartedBtn');

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            // ใส่เอฟเฟกต์ Loading เล็กน้อยตามสไตล์เดิมของคุณก่อนเปลี่ยนหน้า
            document.body.style.cursor = 'wait';
            getStartedBtn.style.cursor = 'wait';
            getStartedBtn.style.pointerEvents = 'none';
            getStartedBtn.textContent = 'Loading...';

            setTimeout(() => {
                document.body.style.cursor = 'default';
                // นำ User ไปยังหน้า Learn Page
                window.location.href = './Glucode LearnPage/Learn.html';
            }, 800);
        });
    }
});