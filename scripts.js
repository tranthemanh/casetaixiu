let balance = 1000;
let betAmountTai = 0;
let betAmountXiu = 0;
let totalBetTai = 0;
let totalBetXiu = 0;
let timer;
let countdown;
let historyIndex = 0; // Index hiện tại trong lịch sử

function startTimer() {
    let timeLeft = 5;
    countdown = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Thời gian còn lại: ${timeLeft} giây`;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            rollDice();
        }
    }, 1000);
}

function startGame() {
    startTimer();
    timer = setTimeout(() => {
        startGame();
    }, 60000);
}

function resetGame() {
    clearInterval(countdown);
    clearTimeout(timer);
    document.getElementById('timer').innerText = "Thời gian còn lại: 60 giây";
    startGame();
}

document.getElementById('bet-tai').addEventListener('click', function() {
    betAmountTai = parseInt(document.getElementById('bet-amount-tai').value);
    if (betAmountTai > balance) {
        alert("Bạn không có đủ tiền cược!");
    } else {
        balance -= betAmountTai;
        totalBetTai += betAmountTai;
        document.getElementById('balance').innerText = `Số tiền hiện có: ${balance.toFixed(2)}`;
        document.getElementById('total-bet-tai').innerText = `Tổng cược Tài: ${totalBetTai}`;
    }
});

document.getElementById('bet-xiu').addEventListener('click', function() {
    betAmountXiu = parseInt(document.getElementById('bet-amount-xiu').value);
    if (betAmountXiu > balance) {
        alert("Bạn không có đủ tiền cược!");
    } else {
        balance -= betAmountXiu;
        totalBetXiu += betAmountXiu;
        document.getElementById('balance').innerText = `Số tiền hiện có: ${balance.toFixed(2)}`;
        document.getElementById('total-bet-xiu').innerText = `Tổng cược Xỉu: ${totalBetXiu}`;
    }
});

document.getElementById('add-money').addEventListener('click', function() {
    const amount = parseInt(prompt("Nhập số tiền bạn muốn nạp:"));
    if (amount > 0) {
        balance += amount;
        document.getElementById('balance').innerText = `Số tiền hiện có: ${balance.toFixed(2)}`;
    }
});

function rollDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2 + dice3;

    document.getElementById('dice1').src = `images/dice${dice1}.png`;
    document.getElementById('dice2').src = `images/dice${dice2}.png`;
    document.getElementById('dice3').src = `images/dice${dice3}.png`;

    let resultText = `Kết quả: ${dice1} + ${dice2} + ${dice3} = ${total}. `;
    let resultTai = "", resultXiu = "";

    if (total === 3 || total === 18) {
        resultText += "Bạn thua!";
    } else if (total >= 4 && total <= 10) {
        if (totalBetXiu > 0) {
            balance += totalBetXiu + totalBetXiu * 0.98;
            resultXiu += "Bạn thắng!";
        }
        if (totalBetTai > 0) {
            resultTai += "Bạn thua!";
        }
    } else if (total >= 11 && total <= 17) {
        if (totalBetTai > 0) {
            balance += totalBetTai + totalBetTai * 0.98;
            resultTai += "Bạn thắng!";
        }
        if (totalBetXiu > 0) {
            resultXiu += "Bạn thua!";
        }
    }

    document.getElementById('balance').innerText = `Số tiền hiện có: ${balance.toFixed(2)}`;
    document.getElementById('result').innerText = resultText + " " + resultTai + " " + resultXiu;

    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.textContent = resultText + " " + resultTai + " " + resultXiu;
    historyList.appendChild(listItem);

    totalBetTai = 0;
    totalBetXiu = 0;
    document.getElementById('total-bet-tai').innerText = `Tổng cược Tài: ${totalBetTai}`;
    document.getElementById('total-bet-xiu').innerText = `Tổng cược Xỉu: ${totalBetXiu}`;

    resetGame();
}

document.getElementById('view-history').addEventListener('click', function() {
    const historyDiv = document.getElementById('history');
    if (historyDiv.style.display === 'none') {
        historyDiv.style.display = 'block';
    } else {
        historyDiv.style.display = 'none';
    }
});

// Lắng nghe sự kiện scroll để di chuyển trong lịch sử
document.getElementById('history').addEventListener('wheel', function(event) {
    const historyList = document.getElementById('history-list');
    if (event.deltaY < 0 && historyIndex > 0) {
        historyIndex--;
    } else if (event.deltaY > 0 && historyIndex < historyList.getElementsByTagName('li').length - 1) {
        historyIndex++;
    }
    updateHistoryVisibility(historyList.getElementsByTagName('li'));
});

// Cập nhật hiển thị của các mục trong lịch sử
function updateHistoryVisibility(historyItems) {
    for (let i = 0; i < historyItems.length; i++) {
        if (i === historyIndex) {
            historyItems[i].style.display = "block";
        } else {
            historyItems[i].style.display = "block";
        }
    }
}

// Bắt đầu ván game đầu tiên khi trang được tải
window.onload = startGame;

