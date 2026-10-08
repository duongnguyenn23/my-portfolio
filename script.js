// =========================================================
// 1. CINEMATIC PRELOADER CONTROLLER (MÀN HÌNH CHỜ HIỆU ỨNG TẢI TRANG)
// =========================================================
const preloader = document.getElementById("preloader");
const preloaderProgress = document.getElementById("preloaderProgress");
const preloaderPercent = document.getElementById("preloaderPercent");

let progress = 0;
let isResourceLoaded = false;
let isFinished = false;

// Cập nhật giao diện tiến trình %
function updateProgress(value) {
    if (preloaderProgress) preloaderProgress.style.width = value + "%";
    if (preloaderPercent) preloaderPercent.textContent = Math.round(value) + "%";
}

// Bắt đầu chạy tiến trình đếm số mượt mà
const progressInterval = setInterval(() => {
    if (!isResourceLoaded) {
        // Tăng tự nhiên lên tối đa 90% trong lúc chờ các tài nguyên nặng
        if (progress < 90) {
            progress += Math.random() * 7 + 3;
            if (progress > 90) progress = 90;
            updateProgress(progress);
        }
    } else {
        // Khi toàn bộ tài nguyên (ảnh, css, script, media) đã sẵn sàng
        progress += 15;
        if (progress >= 100) {
            progress = 100;
            updateProgress(progress);
            clearInterval(progressInterval);
            finishLoading();
        } else {
            updateProgress(progress);
        }
    }
}, 50);

function finishLoading() {
    if (isFinished) return;
    isFinished = true;

    // Giữ lại 300ms ở mức 100% để người xem thấy sự hoàn tất
    setTimeout(() => {
        // Kích hoạt animation xuất hiện trang web và trượt preloader
        document.body.classList.add("loaded");

        // Sau khi preloader trượt lên hoàn tất, ẩn hoàn toàn để giải phóng DOM
        setTimeout(() => {
            if (preloader) {
                preloader.style.display = "none";
            }
            // Cho phép cuộn trang bình thường
            document.body.style.overflow = "auto";
        }, 900);
    }, 300);
}

// Lắng nghe sự kiện window load (khi toàn bộ ảnh, css, scripts đã load xong)
window.addEventListener("load", () => {
    isResourceLoaded = true;
});

// Fallback an toàn: tối đa 3.5 giây sẽ mở trang ngay dù mạng chập chờn
setTimeout(() => {
    isResourceLoaded = true;
}, 3500);


// =========================================================
// 2. HERO VIDEO & ÂM THANH
// =========================================================
const video = document.querySelector(".hero-video");
const btn = document.getElementById("volumeBtn");

// Định nghĩa 2 Icon SVG (Nét mảnh, tinh tế)
const iconMute = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>`;

const iconSound = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>`;

if (btn) {
    btn.innerHTML = iconMute;

    // Sự kiện CLICK nút loa
    btn.addEventListener('click', function() {
        if (!video) return;
        video.muted = !video.muted;
        
        if (video.muted) {
            btn.innerHTML = iconMute;
        } else {
            btn.innerHTML = iconSound;
            video.volume = 1; 
        }
    });
}

// Tự động giảm âm lượng video khi cuộn trang ra xa
window.addEventListener("scroll", () => {
    if (!video) return;

    const rect = video.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const percentVisible = Math.max(0, Math.min(visibleHeight / rect.height, 1));

    if (!video.muted) {
        video.volume = percentVisible;
    }

    if (percentVisible <= 0 && !video.muted) {
        video.muted = true;
        if (btn) btn.innerHTML = iconMute;
    }
});


// =========================================================
// 3. NAVBAR SCROLL SPY & CLICK
// =========================================================
const navLinks = document.querySelectorAll('.nav-link');
const trackedSections = document.querySelectorAll('section');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

window.addEventListener('scroll', () => {
    let currentId = '';
    
    trackedSections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= (sectionTop - 180)) {
            currentId = section.getAttribute('id');
        }
    });

    // Map các section con về mục cha tương ứng trên navbar
    let targetLink = currentId;
    if (currentId === 'featured_projects' || currentId === 'story') {
        targetLink = 'my_project';
    }

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            if (href === '#' + targetLink) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
});


// =========================================================
// 4. HIỆU ỨNG HIỂN THỊ KHI CUỘN (SCROLL REVEAL)
// =========================================================
document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    const hiddenElements = document.querySelectorAll('.reveal-item');
    hiddenElements.forEach((el) => observer.observe(el));
});


// =========================================================
// 5. XỬ LÝ LIÊN HỆ (CONTACT FORM)
// =========================================================
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;
        const email = "tungduong9454@gmail.com";

        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + "\n\n" + message)}`;
        window.location.href = mailtoLink;
    });
}