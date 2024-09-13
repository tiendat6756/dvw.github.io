const header = document.querySelector("header");
const menu = document.querySelector("#mn-btn");
const close = document.querySelector("#cl-btn");
const contentContainer = document.querySelector("#content-container");
const leftArrow = document.querySelector("#left-arrow");
const rightArrow = document.querySelector("#right-arrow");
let currentPageIndex = 0;

// Danh sách các trang bao gồm "home", "dgtd", "dgnl", "about", "mock-test", "contact"
const pages = ["home.html", "dgtd.html", "dgnl.html", "about.html", "mock-test.html", "contact.html"];

// Load nội dung trang ban đầu
loadPage(pages[currentPageIndex]);

// Sự kiện click menu
menu.addEventListener("click", () => {
  header.classList.toggle("show-mobile-menu");
});

close.addEventListener("click", () => {
  menu.click();
});

// Tải nội dung dựa trên sự kiện click của menu và logo
document.querySelectorAll('.menu-links a, .logo').forEach(item => {
  item.addEventListener('click', function(event) {
    event.preventDefault();
    const linkElement = event.target.closest('a');
    if (linkElement) {
      const page = linkElement.getAttribute('data-page');
      
      if (page) {
        currentPageIndex = pages.indexOf(`${page}.html`);
        if (currentPageIndex !== -1) {
          loadPage(`${page}.html`, 'left'); // Chuyển hướng sang trái khi nhấn vào menu
        } else {
          console.error('Page not found in pages array:', page);
        }
      } else {
        console.error('No data-page attribute found on the clicked element');
      }
    }
  });
});

// Điều hướng bằng mũi tên trái và phải
leftArrow.addEventListener('click', () => {
  currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
  loadPage(pages[currentPageIndex], 'right'); // Chuyển hướng sang phải
});

rightArrow.addEventListener('click', () => {
  currentPageIndex = (currentPageIndex + 1) % pages.length;
  loadPage(pages[currentPageIndex], 'left'); // Chuyển hướng sang trái
});

// Sự kiện swipe cho thiết bị di động
let startX;

contentContainer.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

contentContainer.addEventListener('touchmove', (e) => {
  if (!startX) return;
  let endX = e.touches[0].clientX;
  if (startX - endX > 100) { // Swipe trái
    currentPageIndex = (currentPageIndex + 1) % pages.length;
    loadPage(pages[currentPageIndex], 'left');
  } else if (endX - startX > 100) { // Swipe phải
    currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
    loadPage(pages[currentPageIndex], 'right');
  }
  startX = null;
});

// Function để tải trang mới vào content container với hiệu ứng
function loadPage(page, direction = 'left') {
  // Xóa các lớp hiệu ứng trước đó
  contentContainer.classList.remove('slide-in-from-left', 'slide-out-to-right', 'slide-in-from-right', 'slide-out-to-left');

  // Thêm lớp hiệu ứng để trượt ra khỏi trang hiện tại
  if (direction === 'left') {
    contentContainer.classList.add('slide-out-to-right');
  } else {
    contentContainer.classList.add('slide-out-to-left');
  }

  // Đợi cho đến khi hiệu ứng trượt ra hoàn tất, sau đó tải trang mới
  setTimeout(() => {
    fetch(page)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        contentContainer.innerHTML = data;
        
        // Sau khi tải nội dung mới, thêm lớp hiệu ứng để trượt vào
        contentContainer.classList.remove('slide-out-to-right', 'slide-out-to-left');
        if (direction === 'left') {
          contentContainer.classList.add('slide-in-from-left');
        } else {
          contentContainer.classList.add('slide-in-from-right');
        }
        
        updateActiveMenu(); // Cập nhật trạng thái menu sau khi tải trang
      })
      .catch(error => console.error('Error loading page:', error));
  }, 500); // Thời gian chờ phù hợp với thời gian animation của CSS (0.5s)
}

// Function để cập nhật trạng thái menu
function updateActiveMenu() {
  document.querySelectorAll('.menu-links a').forEach(link => {
    link.classList.remove('active');
    const page = link.getAttribute('data-page');
    if (page && `${page}.html` === pages[currentPageIndex]) {
      link.classList.add('active');
    }
  });
}
