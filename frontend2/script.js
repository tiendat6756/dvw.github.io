const header = document.querySelector("header");
const menu = document.querySelector("#mn-btn");
const close = document.querySelector("#cl-btn");
const contentContainer = document.querySelector("#content-container");
const leftArrow = document.querySelector("#left-arrow");
const rightArrow = document.querySelector("#right-arrow");
let currentPageIndex = 0;


const pages = ["home.html", "dgtd.html", "dgnl.html", "about.html", "mock-test.html", "contact.html"];


loadPage(pages[currentPageIndex]);


menu.addEventListener("click", () => {
  header.classList.toggle("show-mobile-menu");
});

close.addEventListener("click", () => {
  menu.click();
});


document.querySelectorAll('.menu-links a, .logo').forEach(item => {
  item.addEventListener('click', function(event) {
    event.preventDefault();
    const linkElement = event.target.closest('a');
    if (linkElement) {
      const page = linkElement.getAttribute('data-page');
      
      if (page) {
        currentPageIndex = pages.indexOf(`${page}.html`);
        if (currentPageIndex !== -1) {
          loadPage(`${page}.html`, 'left'); 
        } else {
          console.error('Page not found in pages array:', page);
        }
      } else {
        console.error('No data-page attribute found on the clicked element');
      }
    }
  });
});


leftArrow.addEventListener('click', () => {
  currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
  loadPage(pages[currentPageIndex], 'right'); 
});

rightArrow.addEventListener('click', () => {
  currentPageIndex = (currentPageIndex + 1) % pages.length;
  loadPage(pages[currentPageIndex], 'left'); 
});


let startX;

contentContainer.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

contentContainer.addEventListener('touchmove', (e) => {
  if (!startX) return;
  let endX = e.touches[0].clientX;
  if (startX - endX > 100) { 
    currentPageIndex = (currentPageIndex + 1) % pages.length;
    loadPage(pages[currentPageIndex], 'left');
  } else if (endX - startX > 100) { 
    currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
    loadPage(pages[currentPageIndex], 'right');
  }
  startX = null;
});


function loadPage(page, direction = 'left') {

  contentContainer.classList.remove('slide-in-from-left', 'slide-out-to-right', 'slide-in-from-right', 'slide-out-to-left');

 
  if (direction === 'left') {
    contentContainer.classList.add('slide-out-to-right');
  } else {
    contentContainer.classList.add('slide-out-to-left');
  }

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
        
      
        contentContainer.classList.remove('slide-out-to-right', 'slide-out-to-left');
        if (direction === 'left') {
          contentContainer.classList.add('slide-in-from-left');
        } else {
          contentContainer.classList.add('slide-in-from-right');
        }
        
        updateActiveMenu(); 
      })
      .catch(error => console.error('Error loading page:', error));
  }, 500); 
}


function updateActiveMenu() {
  document.querySelectorAll('.menu-links a').forEach(link => {
    link.classList.remove('active');
    const page = link.getAttribute('data-page');
    if (page && `${page}.html` === pages[currentPageIndex]) {
      link.classList.add('active');
    }
  });
}
