// EVENEMENT.JS 

// ÉTAT 
let allEvents = [];
let filteredEvents = [];
let currentPage = 0;
const eventsPerPage = 4;
let currentView = 'grid';

//  RÉFÉRENCES DOM
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const dateFilter = document.getElementById('dateFilter');
const eventsContainer = document.getElementById('eventsContainer');
const eventsCount = document.getElementById('eventsCount');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const viewBtns = document.querySelectorAll('.view-btn');

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

// VALIDATION DU NOM 
function estNomValide(nom) {
    const regex = /^[A-Za-zÀ-ÿ\s\-']+$/;
    return regex.test(nom);
}

// CHARGER LES ÉVÉNEMENTS
async function chargerEvenements() {
    try {
        const response = await fetch('data/evenements.json');
        if (!response.ok) throw new Error('Fichier JSON non trouvé');
        return await response.json();
    } catch (error) {
        console.error('Erreur chargement JSON:', error);
        return [
            {
                id: 1,
                titre: "Conférence sur l'Intelligence Artificielle",
                description: "Découvrez les dernières avancées en IA.",
                date: "2026-07-15",
                lieu: "Auditorium, Campus CHCL",
                categorie: "Conférence",
                organisateur: "Département d'Informatique",
                image: "images/events/conference1.jpg",
                capacite: 100,
                inscrits: 75
            },
            {
                id: 2,
                titre: "Atelier sur les Réseaux Informatiques",
                description: "Apprenez à construire et administrer des réseaux.",
                date: "2026-07-20",
                lieu: "Salle 204, Campus CHCL",
                categorie: "Atelier",
                organisateur: "Club Tech",
                image: "images/events/reseaux.jpg",
                capacite: 50,
                inscrits: 30
            },
            {
                id: 3,
                titre: "Tournoi de Football Universitaire",
                description: "Tournoi inter-facultés de football.",
                date: "2026-07-25",
                lieu: "Parc Raphaël, Campus CHCL",
                categorie: "Sport",
                organisateur: "Service des Sports",
                image: "images/events/foot1.jpg",
                capacite: 200,
                inscrits: 120
            },
            {
                id: 4,
                titre: "Soirée Culturelle",
                description: "Une soirée dédiée à la culture.",
                date: "2026-07-30",
                lieu: "Espace Culturel, Campus CHCL",
                categorie: "Culture",
                organisateur: "Association Culturelle",
                image: "images/events/soiree.jpg",
                capacite: 150,
                inscrits: 90
            }
        ];
    }
}


// INITIALISATION

async function init() {
    allEvents = await chargerEvenements();
    filteredEvents = [...allEvents];
    renderEvents();
    handleUrlParams();
}


// RENDU DES ÉVÉNEMENTS
function renderEvents() {
    const start = 0;
    const end = (currentPage + 1) * eventsPerPage;
    const eventsToShow = filteredEvents.slice(start, end);

    if (eventsToShow.length === 0) {
        eventsContainer.innerHTML = `
            <div style="text-align: center; padding: 60px; grid-column: 1 / -1;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--gray);"></i>
                <p style="color: var(--gray); margin-top: 12px;">Aucun événement ne correspond à vos critères.</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        eventsCount.textContent = '0 événement trouvé';
        return;
    }

    eventsContainer.innerHTML = eventsToShow.map(event => createEventCard(event)).join('');

    const total = filteredEvents.length;
    eventsCount.textContent = `${total} événement${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`;

    if (end >= filteredEvents.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }

    applyView();
}


// CRÉER UNE CARTE D'ÉVÉNEMENT

function createEventCard(event) {
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const placesRestantes = (event.capacite || 0) - (event.inscrits || 0);
    const imagePath = event.image || 'images/events/default.jpg';

    return `
        <div class="event-card" data-id="${event.id}">
            <div class="event-card-image">
                <img src="${imagePath}" alt="${event.titre}" onerror="this.src='images/events/default.jpg'" />
                <span class="event-card-badge">${event.categorie}</span>
            </div>
            <div class="event-card-body">
                <h3>${event.titre}</h3>
                <p>${event.description.substring(0, 120)}${event.description.length > 120 ? '...' : ''}</p>
                <div class="event-card-meta">
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.lieu}</span>
                    <span><i class="fas fa-users"></i> ${placesRestantes} places</span>
                </div>
                <a href="detail.html?id=${event.id}" class="event-card-btn">Voir les détails</a>
            </div>
        </div>
    `;
}


// FILTRES
function filterEvents() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const date = dateFilter.value;

    filteredEvents = allEvents.filter(event => {
        const matchSearch = event.titre.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.lieu.toLowerCase().includes(searchTerm);

        const matchCategory = category === 'all' || event.categorie === category;

        let matchDate = true;
        if (date !== 'all') {
            const eventDate = new Date(event.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const weekLater = new Date(today);
            weekLater.setDate(today.getDate() + 7);
            const monthLater = new Date(today);
            monthLater.setMonth(today.getMonth() + 1);

            if (date === 'today') {
                matchDate = eventDate.toDateString() === today.toDateString();
            } else if (date === 'week') {
                matchDate = eventDate >= today && eventDate <= weekLater;
            } else if (date === 'month') {
                matchDate = eventDate >= today && eventDate <= monthLater;
            }
        }

        return matchSearch && matchCategory && matchDate;
    });

    currentPage = 0;
    renderEvents();
}


// VUE GRILLE / LISTE
function applyView() {
    if (currentView === 'list') {
        eventsContainer.classList.add('view-list');
    } else {
        eventsContainer.classList.remove('view-list');
    }
}

// ÉCOUTEURS D'ÉVÉNEMENTS
searchInput.addEventListener('input', filterEvents);
categoryFilter.addEventListener('change', filterEvents);
dateFilter.addEventListener('change', filterEvents);

loadMoreBtn.addEventListener('click', function () {
    currentPage++;
    renderEvents();
});

viewBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        viewBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentView = this.dataset.view;
        applyView();
    });
});


// GÉRER LES PARAMÈTRES URL
function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const categorie = params.get('categorie');

    if (categorie) {
        const categoryMap = {
            'conference': 'Conférence',
            'atelier': 'Atelier',
            'sport': 'Sport',
            'culture': 'Culture'
        };
        const mappedCategory = categoryMap[categorie.toLowerCase()] || categorie;
        categoryFilter.value = mappedCategory;
        filterEvents();
    }
}

// DÉMARRAGE
init();
