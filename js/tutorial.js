let step = 0;
let autoTimer = null;
let isAnimating = false;

const content = document.getElementById("content");
const cursor = document.getElementById("cursor");

const SLIDES = [
    () => `<h1>Welcome to Glucode</h1><p>เริ่มต้นการเรียนรู้การเขียนโค้ดแบบเกม</p>`,
    () => `<h1>Glucode System</h1><p>Glucode เป็นเว็บเกมที่ช่วยฝึกเขียนโค้ด<br>โดยใช้เกมทำให้เรียนง่ายและสนุก</p><p>มี 2 รูปแบบ:<br> ต่อจิ๊กซอ<br> พิมพ์โค้ด</p>`,
    () => `<h1>Box Game</h1><p>ลากโค้ดมาต่อให้ถูกต้องตามลำดับ</p><video autoplay muted loop playsinline style="width: 900px; max-width: 95%; border-radius: 20px; margin-top: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.25);"><source src="../Glucode VdoTutorial/1.mp4" type="video/mp4"></video>`,
    () => `<h1>Find Game</h1><p>พิมพ์โค้ดให้ถูกต้องตามโจทย์</p><video autoplay muted loop playsinline style="width: 900px; max-width: 95%; border-radius: 20px; margin-top: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.25);"><source src="../Glucode VdoTutorial/2.mp4" type="video/mp4"></video>`,
    () => `<h1>Ready?</h1><p>คลิกเพื่อเริ่มเข้าสู่ระบบ</p>`,
];

// อัปเดต dot indicators ให้ตรงกับ step ปัจจุบัน
function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === step);
    });
}

// เล่น animation slide เข้า-ออก แล้วสลับเนื้อหา
function animateSlide(direction, callback) {
    const exitClass  = direction === 'right' ? 'slide-exit-left'  : 'slide-exit-right';
    const enterClass = direction === 'right' ? 'slide-enter-right' : 'slide-enter-left';

    // Slide ออก
    content.classList.add(exitClass);

    setTimeout(() => {
        content.classList.remove(exitClass);
        callback(); // สลับ HTML
        content.classList.add(enterClass);

        // ถัก animation เข้า
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                content.classList.remove(enterClass);
                content.classList.add('slide-active');
            });
        });

        setTimeout(() => {
            content.classList.remove('slide-active');
            isAnimating = false;
        }, 350);
    }, 300);
}

function render(direction = 'right') {
    clearTimeout(autoTimer);

    if (step === 5) {
        // จบ tutorial → บันทึกและ redirect
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            let userIndex = users.findIndex(u => u.username === loggedInUser);
            if (userIndex !== -1) {
                users[userIndex].hasSeenTutorial = true;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
        sessionStorage.removeItem("hasSeenWelcome");
        window.location.href = "../home.html";
        return;
    }

    animateSlide(direction, () => {
        content.innerHTML = SLIDES[step]();
        updateDots();

        // Auto-advance สำหรับ slide วิดีโอ
        if (step === 2) autoTimer = setTimeout(() => { if (!isAnimating) { step++; render('right'); } }, 8000);
        if (step === 3) autoTimer = setTimeout(() => { if (!isAnimating) { step++; render('right'); } }, 8500);
    });
}

// ---- Event Listeners ----

document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const mid = window.innerWidth / 2;
    cursor.style.left = x + "px";
    cursor.style.top = e.clientY + "px";
    cursor.innerHTML = x < mid
        ? '<i class="fa-solid fa-angle-left"></i>'
        : '<i class="fa-solid fa-angle-right"></i>';
});

document.addEventListener("click", (e) => {
    if (isAnimating) return; // ป้องกันกดซ้ำตอน animate

    const x = e.clientX;
    const mid = window.innerWidth / 2;
    const direction = x < mid ? 'left' : 'right';

    if (step === 2 || step === 3) clearTimeout(autoTimer);

    if (direction === 'left') {
        if (step <= 0) return;
        step--;
    } else {
        step++;
        if (step > 5) step = 5;
    }

    isAnimating = true;
    render(direction);
});

// ---- Init ----
// ใส่เนื้อหา slide แรกและสร้าง dots โดยไม่ animate
content.innerHTML = SLIDES[0]();

const dotsContainer = document.getElementById('dots');
SLIDES.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dotsContainer.appendChild(dot);
});
