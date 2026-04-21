/* ==========================================
   THEME SHOP JS - ระบบซื้อและปลดล็อกธีม
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    if (localStorage.getItem("forceResetThemes_v1") !== "done") {
        users.forEach(u => {
            u.unlockedThemes = ['light', 'dark']; 
        });
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("forceResetThemes_v1", "done"); 
    }

    const userIndex = users.findIndex(u => u.username === loggedInUser);
    const user = users[userIndex];

    if (!user) {
        window.location.href = "../Login.html";
        return;
    }

    if (!user.unlockedThemes) {
        user.unlockedThemes = ['light', 'dark'];
        localStorage.setItem("users", JSON.stringify(users));
    }

    const THEMES_DATA = [
        { id: 'light', name: 'Light (Default)', price: 0, bg: '#F8FAFC', icon: 'fa-sun', iconColor: '#f59e0b' },
        { id: 'dark', name: 'Dark Mode', price: 0, bg: '#1E293B', icon: 'fa-moon', iconColor: '#F8FAFC' },
        { id: 'winter', name: 'Winter', price: 50, bg: '#F0F9FF', icon: 'fa-snowflake', iconColor: '#0284C7' },
        { id: 'easter', name: 'Easter', price: 55, bg: '#FFF5F7', icon: 'fa-egg', iconColor: '#EC4899' },
        { id: 'halloween', name: 'Halloween', price: 60, bg: '#1A0B2E', icon: 'fa-ghost', iconColor: '#FF9E00' }
    ];

    const grid = document.getElementById('themeGrid');
    const coinDisplay = document.getElementById('shopCoinDisplay');

    function renderShop() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        coinDisplay.innerText = user.coins || 0;
        grid.innerHTML = '';

        THEMES_DATA.forEach(theme => {
            const isUnlocked = user.unlockedThemes.includes(theme.id);
            const isEquipped = currentTheme === theme.id;

            let btnHtml = '';
            if (isEquipped) {
                btnHtml = `<button class="btn-buy btn-equipped"><i class="fa-solid fa-circle-check"></i> ใช้งานอยู่</button>`;
            } else if (isUnlocked) {
                btnHtml = `<button class="btn-equip" onclick="equipTheme('${theme.id}')"><i class="fa-solid fa-palette"></i> เลือกใช้งาน</button>`;
            } else {
                btnHtml = `<button class="btn-buy" onclick="buyTheme('${theme.id}', ${theme.price}, '${theme.name}')"><i class="fa-solid fa-cart-shopping"></i> ซื้อ (${theme.price} Coins)</button>`;
            }

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

    window.buyTheme = function(themeId, price, themeName) {
        let currentCoins = user.coins || 0;

        if (currentCoins >= price) {
            user.coins -= price;
            user.unlockedThemes.push(themeId);
            localStorage.setItem("users", JSON.stringify(users));

            const navCoin = document.querySelector('.coin-display strong');
            if (navCoin) navCoin.innerText = user.coins;

            // 🟢 แสดงปุ่มที่ซื้อขึ้นมาทันที (ส่วนคลิกทำงาน core.js รับไปทำต่อแล้ว)
            const newlyUnlockedBtn = document.querySelector(`.theme-btn[data-theme="${themeId}"]`);
            if (newlyUnlockedBtn) {
                newlyUnlockedBtn.style.display = 'flex';
            }

            showShopAlert('success', 'สั่งซื้อสำเร็จ!', `คุณได้รับธีม ${themeName} แล้ว! สามารถกดเลือกใช้งานได้เลย`);
            renderShop(); 
        } else {
            showShopAlert('error', 'เหรียญไม่พอ!', `การซื้อธีมนี้ต้องการ ${price} Coins (คุณมี ${currentCoins} Coins) ไปเล่นเกมเพื่อหาเหรียญเพิ่มกันเถอะ!`);
        }
    };

    window.equipTheme = function(themeId) {
        document.body.className = '';
        if (themeId !== 'light') {
            document.body.classList.add(themeId);
        }
        localStorage.setItem('theme', themeId);
        
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

        renderShop(); 
    };

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

    renderShop();
});