document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const header = document.querySelector('header');
    if (menuBtn) { menuBtn.addEventListener('click', () => header.classList.toggle('nav-open')); }
    const form = document.querySelector('#newsletter-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value.trim();
            if (!email) return alert('Please enter your email.');
            alert(`Thanks! ${email} has been added (demo).`);
            form.reset();
        });
    }
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            logo.classList.toggle('spin');
        });
    }
});