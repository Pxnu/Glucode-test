/* ==========================================
   LEADERBOARD.JS - Universal Leaderboard
========================================== */
const ITEMS_PER_PAGE = 10;
let currentlyShowing = ITEMS_PER_PAGE;
let players = [];
let currentUser = localStorage.getItem("loggedInUser");

function loadLeaderboard() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const urlParams = new URLSearchParams(window.location.search);
    const boardType = urlParams.get('type') || "total";

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

function showCurrentUserRank() {
    if (!currentUser) return;

    let userRank = players.findIndex(p => p.name === currentUser) + 1;

    let oldCards = document.querySelectorAll(".current-user-card:not(.sticky-bottom)");
    oldCards.forEach(card => card.remove());

    let existingCard = document.getElementById("currentUserCard");

    if (userRank === 0 || userRank <= currentlyShowing) {
        if (existingCard) {
            existingCard.classList.add("hidden-float");
        }
        return;
    }

    if (!existingCard) {
        existingCard = document.createElement("div");
        existingCard.id = "currentUserCard";
        existingCard.className = "current-user-card sticky-bottom hidden-float";
        document.body.appendChild(existingCard);
    }

    let userData = players[userRank - 1];
    let formattedScore = userData.score.toLocaleString();

    // ดึงคลาสป้ายอันดับแบบเดียวกับตารางมาใช้ เพื่อความกลมกลืน
    let rankDisplay = "";
    if (userRank === 1) {
        rankDisplay = `<div class="rank-badge rank-1"><i class="fa-solid fa-crown"></i></div>`;
    } else if (userRank === 2) {
        rankDisplay = `<div class="rank-badge rank-2"><i class="fa-solid fa-medal"></i></div>`;
    } else if (userRank === 3) {
        rankDisplay = `<div class="rank-badge rank-3"><i class="fa-solid fa-award"></i></div>`;
    } else {
        rankDisplay = `<div class="rank-badge rank-other">${userRank}</div>`;
    }

    existingCard.innerHTML = `
        <div class="user-rank-floating">
            <div class="floating-rank">${rankDisplay}</div>
            <div class="floating-name"><i class="fa-solid fa-user-check" style="color: var(--subtext);"></i> ${userData.name} <span class="you-badge-float">(คุณ)</span></div>
            <div class="floating-score"><i class="fa-solid fa-star score-icon"></i> ${formattedScore} <span>Pts</span></div>
        </div>
    `;

    setTimeout(() => {
        existingCard.classList.remove("hidden-float");
    }, 50);
}

function renderBoard() {
    let board = document.getElementById("board");
    if (!board) return;
    board.innerHTML = "";

    if (players.length === 0) {
        board.innerHTML = "<div style='text-align:center; padding: 50px; color: var(--subtext); font-size: 1.1rem;'><i class='fa-solid fa-box-open fa-3x' style='margin-bottom:20px; opacity:0.4;'></i><br>ยังไม่มีข้อมูลผู้เล่นในกระดานนี้</div>";
        let existingCard = document.getElementById("currentUserCard");
        if (existingCard) existingCard.classList.add("hidden-float");
        return;
    }

    players.slice(0, currentlyShowing).forEach((p, index) => {
        let row = document.createElement("div");
        let topClass = (index === 0) ? "top1" : (index === 1) ? "top2" : (index === 2) ? "top3" : "";
        let currentClass = (p.name === currentUser) ? " current-user" : "";

        row.className = "row " + topClass + currentClass;
        row.style.animation = `fadeIn 0.5s ease ${index * 0.05}s forwards`;
        row.style.opacity = "0";

        let rankDisplay = "";
        if (index === 0) rankDisplay = `<div class="rank-badge rank-1"><i class="fa-solid fa-crown"></i></div>`;
        else if (index === 1) rankDisplay = `<div class="rank-badge rank-2"><i class="fa-solid fa-medal"></i></div>`;
        else if (index === 2) rankDisplay = `<div class="rank-badge rank-3"><i class="fa-solid fa-award"></i></div>`;
        else rankDisplay = `<div class="rank-badge rank-other">${index + 1}</div>`;

        let displayName = p.name === currentUser
            ? `${p.name} <span class="you-badge"><i class="fa-solid fa-user-check"></i> คุณ</span>`
            : p.name;

        let formattedScore = p.score.toLocaleString();

        row.innerHTML = `
            <div class="col-rank">${rankDisplay}</div>
            <div class="col-player">${displayName}</div>
            <div class="col-score"><i class="fa-solid fa-star score-icon"></i> ${formattedScore} <span>Pts</span></div>
        `;
        board.appendChild(row);
    });

    updatePaginationButtons();
    showCurrentUserRank();
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