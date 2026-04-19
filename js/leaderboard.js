/* ==========================================
   LEADERBOARD.JS - Universal Leaderboard
========================================== */
const ITEMS_PER_PAGE = 10;
let currentlyShowing = ITEMS_PER_PAGE;
let players = [];
let currentUser = localStorage.getItem("loggedInUser");

function loadLeaderboard() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // เช็คจาก URL
    const urlParams = new URLSearchParams(window.location.search);
    const boardType = urlParams.get('type') || "total";

    // อัปเดตหัวข้อ H1 และเพิ่มไอคอนให้สวยงาม
    const title = document.querySelector("h1");
    if (title) {
        if (boardType === "duo") {
            title.innerHTML = '<i class="fa-solid fa-keyboard" style="color: var(--btn); margin-right: 10px;"></i> Duo Leader Board';
        } else if (boardType === "boxgame") {
            title.innerHTML = '<i class="fa-solid fa-cubes" style="color: #10B981; margin-right: 10px;"></i> Jigsaw Leader Board';
        } else {
            title.innerHTML = '<i class="fa-solid fa-trophy" style="color: #F59E0B; margin-right: 10px;"></i> Global Leader Board';
        }
    }

    // ดึงคะแนน
    players = users.map(u => {
        let score = 0;
        let sBox = u.scoreBox || 0;
        let sDuo = u.scoreDuo || 0;

        if (boardType === "duo") score = sDuo;
        else if (boardType === "boxgame") score = sBox;
        else score = sBox + sDuo;

        return { name: u.username, score: score };
    });
    
    players.sort((a, b) => b.score - a.score);
}

// ฟังก์ชันสร้างกล่องบอกอันดับของตัวเองด้านบน
function showCurrentUserRank() {
    if (!currentUser) return;
    
    // หาอันดับของตัวเอง (+1 เพราะ index เริ่มที่ 0)
    let userRank = players.findIndex(p => p.name === currentUser) + 1;
    if (userRank === 0) return; // ถ้าไม่เจอชื่อในระบบ ให้ข้ามไป
    
    let userData = players[userRank - 1];
    
    let wrapper = document.querySelector(".leaderboard-wrapper");
    let existingCard = document.getElementById("currentUserCard");
    
    // ถ้ายังไม่มีกล่อง ให้สร้างขึ้นมาแทรกใต้ H1
    if (!existingCard) {
        existingCard = document.createElement("div");
        existingCard.id = "currentUserCard";
        existingCard.className = "current-user-card";
        let h1 = wrapper.querySelector("h1");
        h1.parentNode.insertBefore(existingCard, h1.nextSibling);
    }
    
    // จัดฟอร์แมตตัวเลขคะแนนให้มีคอมม่า (เช่น 1,000)
    let formattedScore = userData.score.toLocaleString();
    
    existingCard.innerHTML = `
        <div class="rank-info">
            <span class="label">อันดับของคุณ</span>
            <span class="rank">#${userRank}</span>
        </div>
        <div class="user-info">
            <span class="name"><i class="fa-solid fa-user-astronaut"></i> ${userData.name}</span>
            <span class="score"><i class="fa-solid fa-star" style="color: #FDE68A;"></i> ${formattedScore} Pts</span>
        </div>
    `;
}

function renderBoard() {
    let board = document.getElementById("board");
    if (!board) return;
    board.innerHTML = "";

    if (players.length === 0) {
        board.innerHTML = "<div style='text-align:center; padding: 50px; color: var(--subtext); font-size: 1.1rem;'><i class='fa-solid fa-box-open fa-3x' style='margin-bottom:20px; opacity:0.4;'></i><br>ยังไม่มีข้อมูลผู้เล่นในกระดานนี้</div>";
        return;
    }

    players.slice(0, currentlyShowing).forEach((p, index) => {
        let row = document.createElement("div");
        let topClass = (index === 0) ? "top1" : (index === 1) ? "top2" : (index === 2) ? "top3" : "";
        
        // เช็คว่าแถวนี้คือตัวเราหรือไม่
        let currentClass = (p.name === currentUser) ? " current-user" : "";

        row.className = "row " + topClass + currentClass;
        
        // เพิ่ม Animation Delay ให้โหลดไล่ระดับทีละแถวสวยๆ
        row.style.animation = `fadeIn 0.5s ease ${index * 0.05}s forwards`;
        row.style.opacity = "0"; // ซ่อนไว้ก่อนให้ animation ทำงาน
        
        // ตกแต่งไอคอนสำหรับอันดับ Top 3 โดยใช้ Font Awesome ที่พรีเมียมขึ้น
        let rankDisplay = "";
        if (index === 0) {
            rankDisplay = `<div class="rank-badge rank-1"><i class="fa-solid fa-crown"></i></div>`;
        } else if (index === 1) {
            rankDisplay = `<div class="rank-badge rank-2"><i class="fa-solid fa-medal"></i></div>`;
        } else if (index === 2) {
            rankDisplay = `<div class="rank-badge rank-3"><i class="fa-solid fa-award"></i></div>`;
        } else {
            rankDisplay = `<div class="rank-badge rank-other">${index + 1}</div>`;
        }
        
        // ถ้าเป็นตัวเรา ให้เติมคำว่า (คุณ) ท้ายชื่อ พร้อมไอคอนและจัดสไตล์
        let displayName = p.name === currentUser 
            ? `${p.name} <span class="you-badge"></i> (คุณ)</span>` 
            : p.name;
        
        // จัดฟอร์แมตคะแนน
        let formattedScore = p.score.toLocaleString();
        
        row.innerHTML = `
            <div class="col-rank">${rankDisplay}</div>
            <div class="col-player">${displayName}</div>
            <div class="col-score"><i class="fa-solid fa-star score-icon"></i> ${formattedScore} <span>Pts</span></div>
        `;
        board.appendChild(row);
    });
    
    updatePaginationButtons();
    showCurrentUserRank(); // อัปเดตกล่องอันดับของตัวเองด้วย
}

function updatePaginationButtons() {
    let container = document.querySelector(".leaderboard-container");
    if (!container) return;

    let btnWrapper = document.getElementById("paginationWrapper");
    if (!btnWrapper) {
        btnWrapper = document.createElement("div");
        btnWrapper.id = "paginationWrapper";
        btnWrapper.className = "pagination-wrapper";
        container.appendChild(btnWrapper);
    }
    btnWrapper.innerHTML = "";

    if (currentlyShowing > ITEMS_PER_PAGE) {
        let btn = document.createElement("button");
        btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> ย่อให้น้อยลง';
        btn.className = "show-more-btn";
        btn.onclick = () => { currentlyShowing -= ITEMS_PER_PAGE; renderBoard(); };
        btnWrapper.appendChild(btn);
    }
    if (currentlyShowing < players.length) {
        let btn = document.createElement("button");
        btn.innerHTML = 'ดูเพิ่มเติม <i class="fa-solid fa-chevron-down"></i>';
        btn.className = "show-more-btn";
        btn.onclick = () => { currentlyShowing += ITEMS_PER_PAGE; renderBoard(); };
        btnWrapper.appendChild(btn);
    }
}

document.addEventListener('DOMContentLoaded', () => { loadLeaderboard(); renderBoard(); });