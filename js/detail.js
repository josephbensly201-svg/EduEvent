// ============================================
// DETAIL.JS - Page détail d'un événement
// ============================================

// ===== RÉFÉRENCES DOM =====
const container = document.getElementById('eventDetailContainer');
const registrationForm = document.getElementById('registrationForm');
const registrationMessage = document.getElementById('registrationMessage');
const commentForm = document.getElementById('commentForm');
const commentsContainer = document.getElementById('commentsContainer');

let currentEvent = null;

// ============================================
// CHARGER LES ÉVÉNEMENTS
// ============================================
async function chargerEvenements() {
    try {
        const response = await fetch('data/evenements.json');
        if (!response.ok) throw new Error('Fichier JSON non trouvé');
        return await response.json();
    } catch (error) {
        console.error('Erreur chargement JSON:', error);
        return getDefaultEvents();
    }
}

function getDefaultEvents() {
    return [
        {
            id: 1,
            titre: "Conférence sur l'Intelligence Artificielle",
            description: "Découvrez les dernières avancées en IA.",
            date: "2026-07-15T14:00:00",
            lieu: "Auditorium, Campus CHCL",
            categorie: "Conférence",
            organisateur: "Département d'Informatique",
            image: "image/events/conference1.jpg",
            capacite: 100,
            inscrits: 75
        },
        {
            id: 2,
            titre: "Atelier sur les Réseaux Informatiques",
            description: "Apprenez à construire et administrer des réseaux.",
            date: "2026-07-20T09:00:00",
            lieu: "Salle 204, Campus CHCL",
            categorie: "Atelier",
            organisateur: "Club Tech",
            image: "image/events/reseaux.jpg",
            capacite: 50,
            inscrits: 30
        },
        {
            id: 3,
            titre: "Tournoi de Football Universitaire",
            description: "Tournoi inter-facultés de football.",
            date: "2026-07-25T10:00:00",
            lieu: "Parc Raphaël, Campus CHCL",
            categorie: "Sport",
            organisateur: "Service des Sports",
            image: "image/events/foot1.jpg",
            capacite: 200,
            inscrits: 120
        },
        {
            id: 4,
            titre: "Soirée Culturelle",
            description: "Une soirée dédiée à la culture.",
            date: "2026-07-30T18:00:00",
            lieu: "Espace Culturel, Campus CHCL",
            categorie: "Culture",
            organisateur: "Association Culturelle",
            image: "image/events/soiree.jpg",
            capacite: 150,
            inscrits: 90
        }
    ];
}

// ============================================
// GESTION LOCALSTORAGE
// ============================================
function getCurrentUser() {
    const user = localStorage.getItem('chcl_current_user');
    return user ? JSON.parse(user) : null;
}

function saveUserInscription(email, inscription) {
    const allInscriptions = localStorage.getItem('chcl_inscriptions');
    const data = allInscriptions ? JSON.parse(allInscriptions) : {};
    
    if (!data[email]) {
        data[email] = [];
    }
    data[email].push(inscription);
    localStorage.setItem('chcl_inscriptions', JSON.stringify(data));
}

function getUserInscriptions(email) {
    const allInscriptions = localStorage.getItem('chcl_inscriptions');
    const data = allInscriptions ? JSON.parse(allInscriptions) : {};
    return data[email] || [];
}

// ============================================
// CHARGER LE DÉTAIL DE L'ÉVÉNEMENT
// ============================================
function getEventId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function loadEventDetail() {
    const eventId = getEventId();
    
    if (!eventId) {
        container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--gray);">Aucun événement spécifié.</p>';
        return;
    }

    const events = await chargerEvenements();
    const event = events.find(e => e.id == eventId);

    if (!event) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px;">
                <i class="fas fa-search" style="font-size:3rem;color:var(--gray);"></i>
                <p style="color:var(--gray);margin-top:12px;">Événement non trouvé.</p>
                <a href="evenement.html" class="btn-primary" style="margin-top:16px;">Retour à la liste</a>
            </div>
        `;
        return;
    }

    currentEvent = event;
    renderEventDetail(event);
    loadComments(eventId);
}

// ============================================
// AFFICHER LE DÉTAIL
// ============================================
function renderEventDetail(event) {
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const placesRestantes = event.capacite - event.inscrits;
    const imagePath = event.image || 'image/events/default.jpg';

    container.innerHTML = `
        <div class="event-detail-container">
            <img src="${imagePath}" alt="${event.titre}" class="event-detail-banner" onerror="this.src='image/events/default.jpg'" />
            <div class="event-detail-info">
                <div class="event-meta">
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="fas fa-clock"></i> ${formattedTime}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.lieu}</span>
                    <span><i class="fas fa-tag"></i> ${event.categorie}</span>
                </div>
                <h2>${event.titre}</h2>
                <p class="event-description">${event.description}</p>
                <div class="event-organizer">
                    <i class="fas fa-user-circle"></i>
                    <span><strong>Organisateur :</strong> ${event.organisateur || 'Administration'}</span>
                </div>
                <div style="margin-top: 20px; padding: 16px; background: var(--gray-light); border-radius: 8px;">
                    <strong>Places restantes :</strong> 
                    <span id="placesRestantes" style="font-size: 1.2rem; color: ${placesRestantes > 0 ? 'var(--success)' : 'var(--secondary)'};">
                        ${placesRestantes} / ${event.capacite}
                    </span>
                </div>
                <div style="margin-top: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
                    <a href="#" class="btn-secondary" onclick="shareEvent('facebook')"><i class="fab fa-facebook"></i> Partager</a>
                    <a href="#" class="btn-secondary" onclick="shareEvent('twitter')"><i class="fab fa-twitter"></i> Partager</a>
                    <a href="#" class="btn-secondary" onclick="shareEvent('linkedin')"><i class="fab fa-linkedin"></i> Partager</a>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// INSCRIPTION AVEC SAUVEGARDE
// ============================================
registrationForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nom = document.getElementById('regNom').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const telephone = document.getElementById('regTelephone').value.trim();

    if (!nom || nom.length < 2) {
        showRegistrationMessage('Veuillez entrer un nom complet valide.', 'error');
        return;
    }
    if (!email || !isValidEmail(email)) {
        showRegistrationMessage('Veuillez entrer une adresse email valide.', 'error');
        return;
    }
    if (!telephone || telephone.length < 8) {
        showRegistrationMessage('Veuillez entrer un numéro de téléphone valide.', 'error');
        return;
    }

    if (!currentEvent) {
        showRegistrationMessage('Erreur: événement non trouvé.', 'error');
        return;
    }

    if (currentEvent.inscrits >= currentEvent.capacite) {
        showRegistrationMessage('Désolé, il n\'y a plus de places disponibles.', 'error');
        return;
    }

    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showRegistrationMessage('Veuillez vous connecter pour vous inscrire.', 'error');
        return;
    }

    // Vérifier si déjà inscrit
    const userInscriptions = getUserInscriptions(currentUser.email);
    const alreadyRegistered = userInscriptions.some(ins => ins.eventId === currentEvent.id);
    
    if (alreadyRegistered) {
        showRegistrationMessage('Vous êtes déjà inscrit à cet événement !', 'error');
        return;
    }

    // Créer l'inscription
    const inscription = {
        id: Date.now(),
        eventId: currentEvent.id,
        titre: currentEvent.titre,
        date: new Date(currentEvent.date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }),
        lieu: currentEvent.lieu,
        nom: nom,
        email: email,
        telephone: telephone,
        dateInscription: new Date().toLocaleDateString('fr-FR')
    };

    // Sauvegarder
    saveUserInscription(currentUser.email, inscription);

    // Incrémenter le nombre d'inscrits
    currentEvent.inscrits++;
    
    // Mettre à jour l'affichage des places
    const placesSpan = document.getElementById('placesRestantes');
    if (placesSpan) {
        const placesRestantes = currentEvent.capacite - currentEvent.inscrits;
        placesSpan.textContent = `${placesRestantes} / ${currentEvent.capacite}`;
        placesSpan.style.color = placesRestantes > 0 ? 'var(--success)' : 'var(--secondary)';
    }

    showRegistrationMessage(
        `✅ Félicitations ${nom} ! Vous êtes inscrit(e) à "${currentEvent.titre}".`,
        'success'
    );
    
    this.reset();
});

function showRegistrationMessage(message, type) {
    registrationMessage.textContent = message;
    registrationMessage.className = `form-message ${type}`;
    
    setTimeout(() => {
        registrationMessage.className = 'form-message';
        registrationMessage.textContent = '';
    }, 5000);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// COMMENTAIRES
// ============================================
function loadComments(eventId) {
    const commentsData = {
        '1': [
            { nom: 'Frantz S.', date: '15 juin 2026', texte: 'Excellent événement, j\'ai beaucoup appris !' },
            { nom: 'Building 4S.', date: '16 juin 2026', texte: 'Très intéressant, je recommande.' }
        ],
        '2': [
            { nom: 'Steph B.', date: '10 juin 2026', texte: 'Atelier pratique très utile pour mes projets.' }
        ],
        '3': [
            { nom: 'Bens J.', date: '20 juin 2026', texte: 'Super tournoi, ambiance incroyable !' }
        ],
        '4': [
            { nom: 'Wilkey T.', date: '25 juin 2026', texte: 'Magnifique soirée, la musique était géniale.' }
        ]
    };
    
    const comments = commentsData[eventId] || [];
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p style="color: var(--gray);">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>';
        return;
    }

    commentsContainer.innerHTML = comments.map(comment => `
        <div style="padding: 16px; border-bottom: 1px solid var(--gray-light);">
            <strong>${comment.nom}</strong>
            <span style="color: var(--gray); font-size: 0.85rem; margin-left: 12px;">${comment.date}</span>
            <p style="margin-top: 6px;">${comment.texte}</p>
        </div>
    `).join('');
}

commentForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nom = document.getElementById('commentNom').value.trim();
    const texte = document.getElementById('commentText').value.trim();

    if (!nom || !texte) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    const newComment = {
        nom: nom,
        date: new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }),
        texte: texte
    };

    const commentDiv = document.createElement('div');
    commentDiv.style.padding = '16px';
    commentDiv.style.borderBottom = '1px solid var(--gray-light)';
    commentDiv.innerHTML = `
        <strong>${newComment.nom}</strong>
        <span style="color: var(--gray); font-size: 0.85rem; margin-left: 12px;">${newComment.date}</span>
        <p style="margin-top: 6px;">${newComment.texte}</p>
    `;

    if (commentsContainer.querySelector('p')) {
        commentsContainer.innerHTML = '';
    }
    commentsContainer.prepend(commentDiv);
    this.reset();
});

// ============================================
// PARTAGE
// ============================================
function shareEvent(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Découvrez cet événement sur EduEvent !');

    let shareUrl = '';
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    return false;
}

// ============================================
// INITIALISATION
// ============================================
loadEventDetail();
