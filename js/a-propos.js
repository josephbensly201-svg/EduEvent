// A-PROPOS.JS 

// MENU MOBILE

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('open');
        });

        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('open');
            });
        });

        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('open');
            }
        });
    }

    // GESTION DU BOUTON CONNEXION 
    updateLoginButton();
});


// GESTION DU BOUTON CONNEXION

function updateLoginButton() {
    const btnLogin = document.getElementById('btnLogin');
    const currentUser = localStorage.getItem('chcl_current_user');
    
    if (btnLogin) {
        if (currentUser) {
            btnLogin.style.display = 'none';
        } else {
            btnLogin.style.display = 'inline-flex';
        }
    }
}

// VALIDATION EMAIL
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}


// VALIDATION DU NOM 
function estNomValide(nom) {
    const regex = /^[A-Za-zÀ-ÿ\s\-']+$/;
    return regex.test(nom);
}


// FAQ ACCORDÉON

document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    // ===== FORMULAIRE DE CONTACT =====
    const contactForm = document.getElementById('contactForm');
    const contactMessage = document.getElementById('contactFormMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nom = document.getElementById('contactNom').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const sujet = document.getElementById('contactSujet').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!nom || nom.length < 2 || !estNomValide(nom)) {
                showContactMessage('Veuillez entrer votre nom complet (lettres uniquement, minimum 2 caractères).', 'error');
                return;
            }

            if (!email || !isValidEmail(email)) {
                showContactMessage('Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            if (!sujet || sujet.length < 3) {
                showContactMessage('Veuillez entrer un sujet (minimum 3 caractères).', 'error');
                return;
            }

            if (!message || message.length < 10) {
                showContactMessage('Veuillez entrer un message (minimum 10 caractères).', 'error');
                return;
            }

            showContactMessage(
                ' Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
                'success'
            );
            
            this.reset();

            setTimeout(function() {
                contactMessage.className = 'form-message';
                contactMessage.textContent = '';
            }, 5000);
        });
    }

    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
});

function showContactMessage(message, type) {
    const msg = document.getElementById('contactFormMessage');
    if (msg) {
        msg.textContent = message;
        msg.className = 'form-message ' + type;
        msg.style.display = 'block';

        setTimeout(function() {
            msg.className = 'form-message';
            msg.textContent = '';
            msg.style.display = 'none';
        }, 5000);
    }
}


// ANIMATION AU SCROLL

function setupScrollAnimation() {
    const elements = document.querySelectorAll('.team-card, .value-item, .faq-item');
    
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}


// GESTION DES TAGS DE CATÉGORIE

function setupCategoryBadges() {
    const badges = document.querySelectorAll('.event-card-badge');
    const categoryColors = {
        'Conférence': '#6C3CE1',
        'Atelier': '#2ECC71',
        'Sport': '#FF6B6B',
        'Culture': '#F39C12',
        'Soutenance': '#3498DB'
    };

    badges.forEach(badge => {
        const category = badge.textContent.trim();
        if (categoryColors[category]) {
            badge.style.background = categoryColors[category];
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupScrollAnimation();
    setupCategoryBadges();
});
