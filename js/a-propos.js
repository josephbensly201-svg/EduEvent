// ============================================
// A-PROPOS.JS - Page À propos
// ============================================

// ===== FAQ ACCORDÉON =====
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            // Fermer les autres FAQ
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                }
            });
            // Basculer l'item actuel
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

            // Validation
            if (!nom || nom.length < 2) {
                showContactMessage('Veuillez entrer votre nom complet (minimum 2 caractères).', 'error');
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

            // Simulation d'envoi
            showContactMessage(
                '✅ Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
                'success'
            );
            
            // Réinitialiser le formulaire
            this.reset();

            // Cacher le message après 5 secondes
            setTimeout(function() {
                contactMessage.className = 'form-message';
                contactMessage.textContent = '';
            }, 5000);
        });
    }

    // ===== OUVERTURE AUTO DE LA FAQ =====
    // Ouvrir le premier élément par défaut
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }

    // ===== GESTION DU MENU MOBILE =====
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }
});

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Valide une adresse email
 * @param {string} email - L'email à valider
 * @returns {boolean} - True si l'email est valide
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Affiche un message de statut pour le formulaire de contact
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de message ('success' ou 'error')
 */
function showContactMessage(message, type) {
    const msg = document.getElementById('contactFormMessage');
    if (msg) {
        msg.textContent = message;
        msg.className = 'form-message ' + type;
        msg.style.display = 'block';

        // Cacher automatiquement après 5 secondes
        setTimeout(function() {
            msg.className = 'form-message';
            msg.textContent = '';
            msg.style.display = 'none';
        }, 5000);
    }
}

// ============================================
// ANIMATION AU SCROLL (Optionnel)
// ============================================

/**
 * Animation des éléments au scroll
 * Ajoute une classe 'visible' quand l'élément entre dans le viewport
 */
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

// ============================================
// GESTION DES TAGS DE CATÉGORIE (Optionnel)
// ============================================

/**
 * Ajoute des couleurs aux tags de catégorie
 */
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

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Animation au scroll
    setupScrollAnimation();
    
    // Couleurs des badges
    setupCategoryBadges();

    // Gestion du bouton de connexion (pour la cohérence)
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            // Pas d'action spéciale, le lien mène vers profil.html
        });
    }

    console.log('✅ Page À propos chargée avec succès');
});
