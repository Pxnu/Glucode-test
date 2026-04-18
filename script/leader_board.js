// =========================================
// LEADERBOARD TOTAL (Sum of scoreBox + scoreDuo)
// =========================================
const ITEMS_PER_PAGE = 10; 
let currentlyShowing = ITEMS_PER_PAGE; 
let players = [];

function loadLeaderboard() {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    players = users.map(u => {
        // ดึงค่าคะแนนแต่ละตัวแปล ถ้าไม่มีให้เป็น 0
        let sBox = u.scoreBox !== undefined ? u.scoreBox : 0;
        let sDuo = u.scoreDuo !== undefined ? u.scoreDuo : 0;
        
        return {
            name: u.username,
            // รวมคะแนนจากทั้งสองแหล่งเข้าด้วยกัน
            score: sBox + sDuo 
        };
    });
    
    // เรียงลำดับจากคะแนนรวมมากไปน้อย
    players.sort((a, b) => b.score - a.score);
}

function renderBoard() {
    let board = document.getElementById("board");
    if (!board) return;
    board.innerHTML = "";

    if (players.length === 0) {
        board.innerHTML = "<p style='color: var(--subtext); padding: 20px;'>ยังไม่มีข้อมูล</p>";
        updatePaginationButtons();
        return;
    }

    // แสดงผลข้อมูลตามจำนวนที่กำหนด (Pagination)
    players.slice(0, currentlyShowing).forEach((p, index) => {
        let row = document.createElement("div");
        row.className = "row " + getTopClass(index);
        row.innerHTML = `
            <div>${index + 1}</div>
            <div class="player">${p.name}</div>
            <div>${p.score}</div>
        `;
        board.appendChild(row);
    });

    updatePaginationButtons();
}

function updatePaginationButtons() {
    let container = document.querySelector(".leaderboard-container");
    
    let btnWrapper = document.getElementById("paginationWrapper");
    if (!btnWrapper) {
        btnWrapper = document.createElement("div");
        btnWrapper.id = "paginationWrapper";
        btnWrapper.className = "pagination-wrapper";
        container.appendChild(btnWrapper);
    }

    btnWrapper.innerHTML = "";

    // ปุ่ม Show Less
    if (currentlyShowing > ITEMS_PER_PAGE) {
        let lessBtn = document.createElement("button");
        lessBtn.innerText = "↑ Show Less";
        lessBtn.className = "show-more-btn";
        lessBtn.onclick = () => {
            currentlyShowing = Math.max(ITEMS_PER_PAGE, currentlyShowing - ITEMS_PER_PAGE);
            renderBoard();
        };
        btnWrapper.appendChild(lessBtn);
    }

    // ปุ่ม Show More
    if (currentlyShowing < players.length) {
        let moreBtn = document.createElement("button");
        moreBtn.innerText = "Show More ↓";
        moreBtn.className = "show-more-btn";
        moreBtn.onclick = () => {
            currentlyShowing += ITEMS_PER_PAGE;
            renderBoard();
        };
        btnWrapper.appendChild(moreBtn);
    }

    if (btnWrapper.innerHTML === "") {
        btnWrapper.remove();
    }
}

function getTopClass(index) {
    if (index === 0) return "top1";
    if (index === 1) return "top2";
    if (index === 2) return "top3";
    return "";
}

// เริ่มต้นทำงานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
    renderBoard();
});