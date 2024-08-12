const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

let names = ["Alice", "Bob", "Charlie", "David", "Eva"];
let remainingNames = [...names];
let hiddenResults = ["Thua tại khang","19/5","FGH","Phong Cách","HEW","Duck Team","CAP HIGH","Lại phải gánh Kito","Former XMH","Vua về nhì","3T","Đội Minh Moi","MCK","NDU BU"];
let angle = 0;
let spinning = false;

// Tạo màu cố định cho mỗi tên
let colors = generateColors(names.length);

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateColors(numSegments) {
    let colors = [];
    for (let i = 0; i < numSegments; i++) {
        colors.push(getRandomColor());
    }
    return colors;
}

function drawWheel() {
    const numSegments = remainingNames.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    for (let i = 0; i < numSegments; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2,
            i * anglePerSegment + angle,
            (i + 1) * anglePerSegment + angle
        );
        ctx.closePath();

        ctx.fillStyle = colors[names.indexOf(remainingNames[i])]; // Sử dụng màu cố định
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(
            canvas.width / 2 + Math.cos((i + 0.5) * anglePerSegment + angle) * 150,
            canvas.height / 2 + Math.sin((i + 0.5) * anglePerSegment + angle) * 150
        );
        ctx.rotate((i + 0.5) * anglePerSegment + angle);
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(remainingNames[i], 0, 0);
        ctx.restore();
    }
}

function spinWheel() {
    if (spinning) return;
    spinning = true;

    let selectedName;

    if (remainingNames.includes("MCK")) {
        selectedName = hiddenResults.shift(); // Lấy kết quả ẩn nếu có tên này
    } else {
        selectedName = remainingNames[Math.floor(Math.random() * remainingNames.length)];
    }

    let spinTime = 3000;
    let spinSpeed = Math.random() * 10 + 10;
    let startAngle = angle;
    let selectedIndex = remainingNames.indexOf(selectedName);
    let spinAngle = Math.PI * 4 + (selectedIndex + Math.random()) * ((2 * Math.PI) / remainingNames.length);

    function animateSpin() {
        spinTime -= 16;
        if (spinTime <= 0) {
            spinning = false;
            showWinner(`Tên được chọn: ${selectedName}`);

            remainingNames.splice(selectedIndex, 1);
            if (remainingNames.length > 0) {
                drawWheel();
            } else {
                alert("Không còn tên nào trong danh sách!");
            }
            return;
        }

        angle = startAngle + easeOut(spinTime, 0, spinAngle, 3000);
        angle %= 2 * Math.PI;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWheel();
        requestAnimationFrame(animateSpin);
    }

    requestAnimationFrame(animateSpin);
}

function easeOut(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
}

function addNames() {
    const nameInput = document.getElementById("nameInput");
    const newNames = nameInput.value.trim().split("\n").filter(name => name.trim() !== "");

    if (newNames.length > 0) {
        remainingNames = newNames;
        names = [...newNames];
        colors = generateColors(names.length); // Cập nhật lại màu sắc cho danh sách mới
        nameInput.value = "";
        drawWheel();
    } else {
        alert("Vui lòng nhập ít nhất một tên!");
    }
}

function shuffleNames() {
    const nameInput = document.getElementById("nameInput");
    let nameList = nameInput.value.trim().split("\n").filter(name => name.trim() !== "");
    
    if (nameList.length > 0) {
        for (let i = nameList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nameList[i], nameList[j]] = [nameList[j], nameList[i]];
        }
        nameInput.value = nameList.join("\n");
    } else {
        alert("Không có tên nào để tráo đổi!");
    }
}

function showWinner(message) {
    const modal = document.getElementById("winnerModal");
    const winnerName = document.getElementById("winnerName");
    winnerName.textContent = message;
    modal.style.display = "flex"; // Hiển thị modal
}

document.getElementById("addNames").addEventListener("click", addNames);
document.getElementById("shuffleNames").addEventListener("click", shuffleNames);
document.getElementById("spin").addEventListener("click", spinWheel);

// Thêm sự kiện click cho hình ảnh
document.getElementById("interactiveImage").addEventListener("click", function() {
    this.style.display = "none"; // Ẩn hình ảnh khi nhấp vào
});

// Đóng modal khi nhấp vào nút "Đóng"
document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("winnerModal").style.display = "none";
});

drawWheel();
