// ============================================
// MAIN.JS - Page d'accueil
// ============================================

// ===== MENU MOBILE =====
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    // ===== NEWSLETTER =====
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            if (email && isValidEmail(email)) {
                newsletterMessage.textContent = 'Merci pour votre abonnement ! Vous recevrez nos actualités.';
                newsletterMessage.className = 'form-message success';
                this.querySelector('input[type="email"]').value = '';
                
                setTimeout(function() {
                    newsletterMessage.className = 'form-message';
                    newsletterMessage.textContent = '';
                }, 5000);
            } else {
                newsletterMessage.textContent = 'Veuillez entrer une adresse email valide.';
                newsletterMessage.className = 'form-message error';
            }
        });
    }

    // ===== CHARGER LES ÉVÉNEMENTS À LA UNE =====
    loadFeaturedEvents();
    
    // ===== CHARGER ET ANIMER LES STATISTIQUES =====
    loadStatsAndAnimate();
});

// ============================================
// VALIDATION EMAIL
// ============================================
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// CHARGER LES ÉVÉNEMENTS À LA UNE
// ============================================
async function loadFeaturedEvents() {
    const container = document.getElementById('featuredEvents');
    if (!container) return;

    try {
        const events = await chargerEvenements();
        const featured = events.slice(0, 3);
        
        container.innerHTML = featured.map(event => createEventCard(event)).join('');
    } catch (error) {
        console.error('Erreur chargement événements:', error);
        container.innerHTML = `
            <div style="text-align:center;padding:40px;grid-column:1/-1;color:var(--gray);">
                <i class="fas fa-exclamation-triangle" style="font-size:2rem;color:var(--secondary);"></i>
                <p style="margin-top:10px;">Impossible de charger les événements.</p>
            </div>
        `;
    }
}

// ============================================
// CHARGER LES ÉVÉNEMENTS DEPUIS JSON
// ============================================
async function chargerEvenements() {
    try {
        const response = await fetch('data/evenements.json');
        if (!response.ok) throw new Error('Fichier JSON non trouvé');
        return await response.json();
    } catch (error) {
        console.error('Erreur chargement JSON:', error);
        // Données de secours
        return [
            {
                id: 1,
                titre: "Conférence sur l'Intelligence Artificielle",
                description: "Découvrez les dernières avancées en IA.",
                date: "2026-07-15",
                lieu: "Auditorium, Campus CHCL",
                categorie: "Conférence",
                image: "image/events/conference1.jpg",
                inscrits: 75
            },
            {
                id: 2,
                titre: "Atelier sur les Réseaux Informatiques",
                description: "Apprenez à construire et administrer des réseaux.",
                date: "2026-07-20",
                lieu: "Salle 204, Campus CHCL",
                categorie: "Atelier",
                image: "image/events/reseaux.jpg",
                inscrits: 30
            },
            {
                id: 3,
                titre: "Tournoi de Football Universitaire",
                description: "Tournoi inter-facultés de football.",
                date: "2026-07-25",
                lieu: "Parc Raphaël, Campus CHCL",
                categorie: "Sport",
                image: "image/events/foot1.jpg",
                inscrits: 120
            }
        ];
    }
}

// ============================================
// CRÉER UNE CARTE D'ÉVÉNEMENT
// ============================================
function createEventCard(event) {
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const imagePath = event.image || 'image/events/default.jpg';

    return `
        <div class="event-card">
            <div class="event-card-image">
                <img src="${imagePath}" alt="${event.titre}" onerror="this.src='image/events/default.jpg'" />
                <span class="event-card-badge">${event.categorie}</span>
            </div>
            <div class="event-card-body">
                <h3>${event.titre}</h3>
                <p>${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
                <div class="event-card-meta">
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.lieu}</span>
                </div>
                <a href="detail.html?id=${event.id}" class="event-card-btn">Voir les détails</a>
            </div>
        </div>
    `;
}

// ============================================
// CHARGER ET ANIMER LES STATISTIQUES
// ============================================
async function loadStatsAndAnimate() {
    try {
        const events = await chargerEvenements();
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;

        const statNumbers = statsSection.querySelectorAll('.stat-number');
        if (statNumbers.length >= 4) {
            // Calcul des statistiques
            const totalEvents = events.length;
            const totalParticipants = events.reduce((sum, e) => sum + (e.inscrits || 0), 0);
            const categories = new Set(events.map(e => e.categorie));
            
            // Mettre à jour les data-target
            statNumbers[0].setAttribute('data-target', totalEvents);
            statNumbers[1].setAttribute('data-target', totalParticipants);
            statNumbers[2].setAttribute('data-target', categories.size);
            statNumbers[3].setAttribute('data-target', 98);
        }
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }

    // Lancer l'animation
    animateStats();
}

// ============================================
// STATISTIQUES ANIMÉES
// ============================================
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    function startAnimation() {
        if (animated) return;
        animated = true;

        stats.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target')) || 0;
            let current = 0;
            const duration = 2000;
            const steps = 50;
            const increment = Math.ceil(target / steps);
            const stepTime = duration / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = current + (index === 3 ? '%' : '');
            }, stepTime);
        });
    }

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAnimation();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }
}