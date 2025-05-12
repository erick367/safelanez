const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const headerNavLinks = document.querySelectorAll('header nav a[href^="#"]');
const allInternalLinks = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll('main section[id]');
const animatedSections = document.querySelectorAll('.section-animate');
const contactForm = document.getElementById('contact-form');
const contactFormStatus = document.getElementById('contact-form-status');
const bookingForm = document.getElementById('booking-form');
const bookingFormStatus = document.getElementById('booking-form-status');
const currentYearSpan = document.getElementById('current-year');
const dateInput = document.getElementById('preferred_start_date');

if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

currentYearSpan.textContent = new Date().getFullYear();

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    menuToggle.classList.toggle('open');
});

allInternalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (link.closest('#mobile-menu')) {
            mobileMenu.classList.add('hidden');
            menuToggle.classList.remove('open');
        }

        if (targetElement) {
            const headerOffset = document.querySelector('header')?.offsetHeight || 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

const setActiveLink = () => {
    let currentSectionId = '';
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const offset = 150;
        if (scrollPosition >= sectionTop - offset) {
            currentSectionId = section.getAttribute('id');
        }
    });

    if ((window.innerHeight + scrollPosition) >= document.body.offsetHeight - 50) {
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
            currentSectionId = lastSection.getAttribute('id');
        }
    }
    if (currentSectionId === '' && sections.length > 0 && scrollPosition < sections[0].offsetTop - 150) {
        currentSectionId = 'home';
    }

    headerNavLinks.forEach(link => {
        link.classList.remove('text-sky-600', 'font-semibold');
        link.classList.add('text-slate-600', 'font-medium');

        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.remove('text-slate-600', 'font-medium');
            link.classList.add('text-sky-600', 'font-semibold');
        }
    });

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.classList.remove('bg-sky-100', 'text-sky-700', 'font-semibold');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('bg-sky-100', 'text-sky-700', 'font-semibold');
        }
    });
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.1
});

animatedSections.forEach(section => {
    observer.observe(section);
});

window.addEventListener('scroll', setActiveLink);
document.addEventListener('DOMContentLoaded', setActiveLink);

document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.opacity = '1';
    }, 100);
});

function handleFormSubmit(form, statusElement) {
    if (!form.checkValidity()) {
        statusElement.textContent = 'Please fill in all required fields.';
        statusElement.className = `mt-4 text-center font-medium text-red-600`;
        form.reportValidity();
        return;
    }

    statusElement.textContent = 'Sending...';
    statusElement.className = `mt-4 text-center font-medium text-sky-600`;

    setTimeout(() => {
        statusElement.textContent = 'Thank you! Your request has been sent. We\'ll be in touch soon.';
        statusElement.className = `mt-4 text-center font-medium text-green-600`;
        form.reset();
        setTimeout(() => {
            statusElement.textContent = '';
        }, 5000);
    }, 1500);
}

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(bookingForm, bookingFormStatus);
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(contactForm, contactFormStatus);
    });
}
