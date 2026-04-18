/* ==========================================
   LEADERBOARD.JS - Universal Leaderboard
========================================== */
const ITEMS_PER_PAGE = 10;
let currentlyShowing = ITEMS_PER_PAGE;
let players = [];

function loadLeaderboard() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // เช็คจาก URL
    const urlParams = new URLSearchParams(window.location.search);
    const boardType = urlParams.get('type') || "total";

    // อัปเดตหัวข้อ H1
    const title = document.querySelector("h1");
    if (title) {
        if (boardType === "duo") title.innerText = "Duo Leader Board";
        else if (boardType === "boxgame") title.innerText = "Jigsaw Leader Board";
        else title.innerText = "Global Leader Board";
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

function renderBoard() {
    let board = document.getElementById("board");
    if (!board) return;
    board.innerHTML = "";

    if (players.length === 0) {
        board.innerHTML = "<p style='text-align:center; padding: 20px; color: var(--subtext);'>ยังไม่มีข้อมูล</p>";
        return;
    }

    players.slice(0, currentlyShowing).forEach((p, index) => {
        let row = document.createElement("div");
        let topClass = (index === 0) ? "top1" : (index === 1) ? "top2" : (index === 2) ? "top3" : "";

        row.className = "row " + topClass;
        row.innerHTML = `<div>${index + 1}</div><div class="player">${p.name}</div><div>${p.score}</div>`;
        board.appendChild(row);
    });
    updatePaginationButtons();
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
        btn.innerText = "↑ Show Less";
        btn.className = "show-more-btn";
        btn.onclick = () => { currentlyShowing -= ITEMS_PER_PAGE; renderBoard(); };
        btnWrapper.appendChild(btn);
    }
    if (currentlyShowing < players.length) {
        let btn = document.createElement("button");
        btn.innerText = "Show More ↓";
        btn.className = "show-more-btn";
        btn.onclick = () => { currentlyShowing += ITEMS_PER_PAGE; renderBoard(); };
        btnWrapper.appendChild(btn);
    }
}

document.addEventListener('DOMContentLoaded', () => { loadLeaderboard(); renderBoard(); });