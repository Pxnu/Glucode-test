/* ==========================================
   THEME SHOP JS - ระบบซื้อและปลดล็อกธีม
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // 🟢 ระบบล้างข้อมูลเก่า: บังคับให้ผู้ใช้ทุกคนมีแค่ธีม Light และ Dark เท่านั้น (ทำงานแค่ครั้งเดียว)
    if (localStorage.getItem("forceResetThemes_v1") !== "done") {
        users.forEach(u => {
            u.unlockedThemes = ['light', 'dark']; // ริบธีมอื่นคืน และให้แค่ 2 ธีมพื้นฐาน
        });
        localStorage.setItem("users", JSON.stringify(users));
        // มาร์คไว้ว่าทำการรีเซ็ตแล้ว เพื่อที่ครั้งหน้าผู้ใช้ซื้อธีมใหม่แล้วจะได้ไม่โดนลบอีก
        localStorage.setItem("forceResetThemes_v1", "done"); 
    }

    const userIndex = users.findIndex(u => u.username === loggedInUser);
    const user = users[userIndex];

    if (!user) {
        window.location.href = "../Login.html";
        return;
    }

    // กรณีมี User สมัครใหม่
    if (!user.unlockedThemes) {
        user.unlockedThemes = ['light', 'dark'];
        localStorage.setItem("users", JSON.stringify(users));
    }

    // 1. ข้อมูลและราคาธีม (ปรับ Dark Mode ให้เป็น 0 Coins)
    const THEMES_DATA = [
        { id: 'light', name: 'Light (Default)', price: 0, bg: '#F8FAFC', icon: 'fa-sun', iconColor: '#f59e0b' },
        { id: 'dark', name: 'Dark Mode', price: 0, bg: '#1E293B', icon: 'fa-moon', iconColor: '#F8FAFC' },
        { id: 'winter', name: 'Winter', price: 50, bg: '#F0F9FF', icon: 'fa-snowflake', iconColor: '#0284C7' },
        { id: 'easter', name: 'Easter', price: 55, bg: '#FFF5F7', icon: 'fa-egg', iconColor: '#EC4899' },
        { id: 'halloween', name: 'Halloween', price: 60, bg: '#1A0B2E', icon: 'fa-ghost', iconColor: '#FF9E00' }
    ];

    const grid = document.getElementById('themeGrid');
    const coinDisplay = document.getElementById('shopCoinDisplay');

    // 2. ฟังก์ชันวาด UI ร้านค้า
    function renderShop() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        coinDisplay.innerText = user.coins || 0;
        grid.innerHTML = '';

        THEMES_DATA.forEach(theme => {
            const isUnlocked = user.unlockedThemes.includes(theme.id);
            const isEquipped = currentTheme === theme.id;

            // กำหนดสถานะปุ่ม
            let btnHtml = '';
            if (isEquipped) {
                btnHtml = `<button class="btn-buy btn-equipped"><i class="fa-solid fa-circle-check"></i> ใช้งานอยู่</button>`;
            } else if (isUnlocked) {
                btnHtml = `<button class="btn-equip" onclick="equipTheme('${theme.id}')"><i class="fa-solid fa-palette"></i> เลือกใช้งาน</button>`;
            } else {
                btnHtml = `<button class="btn-buy" onclick="buyTheme('${theme.id}', ${theme.price}, '${theme.name}')"><i class="fa-solid fa-cart-shopping"></i> ซื้อ (${theme.price} Coins)</button>`;
            }

            // สร้างการ์ดสินค้า
            const card = document.createElement('div');
            card.className = 'theme-card';
            card.innerHTML = `
                <div class="theme-preview" style="background-color: ${theme.bg};">
                    <i class="fa-solid ${theme.icon}" style="color: ${theme.iconColor}; text-shadow: 0 4px 15px rgba(0,0,0,0.3);"></i>
                </div>
                <div class="theme-info">
                    <div>
                        <div class="theme-name">${theme.name}</div>
                        <div class="theme-price">
                            ${theme.price === 0 ? 'ฟรี (Free)' : `<i class="fa-solid fa-coins"></i> ${theme.price} Coins`}
                        </div>
                    </div>
                    ${btnHtml}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // 3. 🟢 ฟังก์ชันซื้อธีม (แบบ Real-time)
    window.buyTheme = function(themeId, price, themeName) {
        let currentCoins = user.coins || 0;

        if (currentCoins >= price) {
            // หักเงิน และเพิ่มธีมเข้าคลัง
            user.coins -= price;
            user.unlockedThemes.push(themeId);
            localStorage.setItem("users", JSON.stringify(users));

            // อัปเดตตัวเลขเหรียญบน Navbar
            const navCoin = document.querySelector('.coin-display strong');
            if (navCoin) navCoin.innerText = user.coins;

            // 🟢 ทำให้ปุ่มธีมที่มุมซ้ายล่าง โผล่ขึ้นมาให้กดได้แบบ Real-time โดยไม่ต้องรีเฟรชหน้า
            const newlyUnlockedBtn = document.querySelector(`.theme-btn[data-theme="${themeId}"]`);
            if (newlyUnlockedBtn) {
                newlyUnlockedBtn.style.display = 'flex';
                
                // แอบเพิ่ม Event ให้ปุ่มมุมซ้ายล่างนี้กดใช้งานธีมได้ทันที (เพื่อแก้ปัญหา core.js โหลดค่าไม่ทัน)
                newlyUnlockedBtn.addEventListener('click', () => {
                    equipTheme(themeId);
                    const themeSwitcherBox = document.getElementById('themeSwitcherBox');
                    if (themeSwitcherBox) themeSwitcherBox.classList.remove('open');
                });
            }

            showShopAlert('success', 'สั่งซื้อสำเร็จ!', `คุณได้รับธีม ${themeName} แล้ว! สามารถกดเลือกใช้งานได้เลย`);
            
            // 🟢 วาดหน้าร้านค้าใหม่ (ปุ่มจะเปลี่ยนจาก "ซื้อ" เป็น "เลือกใช้งาน" โดยที่ยังไม่ถูกสวมใส่ธีม)
            renderShop(); 
        } else {
            showShopAlert('error', 'เหรียญไม่พอ!', `การซื้อธีมนี้ต้องการ ${price} Coins (คุณมี ${currentCoins} Coins) ไปเล่นเกมเพื่อหาเหรียญเพิ่มกันเถอะ!`);
        }
    };

    // 4. 🟢 ฟังก์ชันเลือกใช้งานธีม (Real-time แทนการใช้ location.reload)
    window.equipTheme = function(themeId) {
        // เปลี่ยนคลาสธีมที่ Body ทันที
        document.body.className = '';
        if (themeId !== 'light') {
            document.body.classList.add(themeId);
        }
        localStorage.setItem('theme', themeId);
        
        // 🟢 อัปเดตไอคอนปุ่มใหญ่ (Toggle) ที่มุมซ้ายล่าง ให้เป็นไอคอนของธีมที่เพิ่งเลือก
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === themeId);
        });
        
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        const activeBtn = Array.from(themeButtons).find(b => b.dataset.theme === themeId);
        
        if (activeBtn && themeToggleBtn) {
            const themeIconClass = activeBtn.querySelector('i').className;
            themeToggleBtn.innerHTML = `<i class="${themeIconClass}"></i> <i class="fa-solid fa-angle-up arrow-icon"></i>`;
        }

        // วาดหน้าร้านค้าใหม่ เพื่อให้ปุ่มที่กดเมื่อกี้เปลี่ยนเป็นคำว่า "ใช้งานอยู่"
        renderShop(); 
    };

    // 5. ระบบ Popup แจ้งเตือน
    window.showShopAlert = function(type, title, message) {
        const modal = document.getElementById('shopAlertModal');
        const icon = document.getElementById('shopAlertIcon');
        const btn = document.getElementById('shopAlertBtn');

        document.getElementById('shopAlertTitle').innerText = title;
        document.getElementById('shopAlertMessage').innerText = message;

        if (type === 'error') {
            icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: #ef4444;"></i>';
            btn.style.background = '#ef4444';
        } else if (type === 'success') {
            icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i>';
            btn.style.background = '#10b981';
        }

        modal.style.display = 'flex';
    };

    window.closeShopAlert = function() {
        document.getElementById('shopAlertModal').style.display = 'none';
    };

    // โหลดร้านค้าครั้งแรก
    renderShop();
});