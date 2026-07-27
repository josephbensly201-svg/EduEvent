// ============================================
// PROFIL.JS 
// ============================================

// ============================================
// MENU MOBILE
// ============================================
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
});

// ============================================
// GESTION DU LOCALSTORAGE
// ============================================

const STORAGE_KEYS = {
    USERS: 'chcl_users',
    CURRENT_USER: 'chcl_current_user',
    INSCRIPTIONS: 'chcl_inscriptions'
};

function getUsers() {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
}

function getUserInscriptions(email) {
    const allInscriptions = localStorage.getItem(STORAGE_KEYS.INSCRIPTIONS);
    const data = allInscriptions ? JSON.parse(allInscriptions) : {};
    return data[email] || [];
}

function saveUserInscription(email, inscription) {
    const allInscriptions = localStorage.getItem(STORAGE_KEYS.INSCRIPTIONS);
    const data = allInscriptions ? JSON.parse(allInscriptions) : {};
    
    if (!data[email]) {
        data[email] = [];
    }
    
    data[email].push(inscription);
    localStorage.setItem(STORAGE_KEYS.INSCRIPTIONS, JSON.stringify(data));
}

function removeUserInscription(email, inscriptionId) {
    const allInscriptions = localStorage.getItem(STORAGE_KEYS.INSCRIPTIONS);
    const data = allInscriptions ? JSON.parse(allInscriptions) : {};
    
    if (data[email]) {
        data[email] = data[email].filter(ins => ins.id !== inscriptionId);
        localStorage.setItem(STORAGE_KEYS.INSCRIPTIONS, JSON.stringify(data));
    }
}

// ============================================
// VALIDATION EMAIL 
// ============================================
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

// ============================================
// VALIDATION DU NOM 
// ============================================
function estNomValide(nom) {
    const regex = /^[A-Za-zÀ-ÿ\s\-']+$/;
    return regex.test(nom);
}

// ============================================
// STOCKAGE DE LA PHOTO DE PROFIL
// ============================================

function loadProfilePhoto() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const avatarImg = document.getElementById('profilAvatar');
    if (!avatarImg) return;

    const photoKey = 'chcl_photo_' + currentUser.email;
    const storedPhoto = localStorage.getItem(photoKey);

    if (storedPhoto) {
        avatarImg.src = storedPhoto;
    } else {
        avatarImg.src = 'images/avatar-default.png';
    }
}

function saveProfilePhoto(photoDataUrl) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const photoKey = 'chcl_photo_' + currentUser.email;
    localStorage.setItem(photoKey, photoDataUrl);

    const avatarImg = document.getElementById('profilAvatar');
    if (avatarImg) {
        avatarImg.src = photoDataUrl;
    }

    showProfilMessage('Photo de profil mise à jour avec succès !', 'success');
}

function ouvrirSelecteurPhoto() {
    const input = document.getElementById('avatarUpload');
    if (input) {
        input.click();
    }
}

function setupAvatarUpload() {
    const fileInput = document.getElementById('avatarUpload');
    if (!fileInput) return;

    fileInput.addEventListener('change', function(e) {
        const file = this.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner une image.');
            this.value = '';
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('L\'image ne doit pas dépasser 2MB.');
            this.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            saveProfilePhoto(e.target.result);
        };
        reader.onerror = function() {
            alert('Erreur lors de la lecture de l\'image.');
        };
        reader.readAsDataURL(file);
    });
}

// ============================================
// CHANGER ENTRE CONNEXION ET INSCRIPTION
// ============================================
function showForm(type) {
    const loginContainer = document.getElementById('loginFormContainer');
    const registerContainer = document.getElementById('registerFormContainer');
    const buttons = document.querySelectorAll('.auth-btn');

    if (loginContainer && registerContainer) {
        if (type === 'login') {
            loginContainer.style.display = 'block';
            registerContainer.style.display = 'none';
        } else {
            loginContainer.style.display = 'none';
            registerContainer.style.display = 'block';
        }
    }

    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    if (type === 'login') {
        if (buttons[0]) buttons[0].classList.add('active');
    } else {
        if (buttons[1]) buttons[1].classList.add('active');
    }
}

// ============================================
// DÉCONNEXION
// ============================================
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        setCurrentUser(null);
        location.reload();
    }
}

function showProfilMessage(message, type) {
    const msg = document.getElementById('profilMessage');
    if (msg) {
        msg.textContent = message;
        msg.className = 'form-message ' + type;

        setTimeout(function() {
            msg.className = 'form-message';
            msg.textContent = '';
        }, 5000);
    }
}

// ============================================
// CHARGER LE PROFIL DE L'UTILISATEUR
// ============================================
function loadUserProfile(user) {
    if (!user) return;

    updateUserDisplay(user);

    const prenom = document.getElementById('profilPrenom');
    const nom = document.getElementById('profilNom');
    const email = document.getElementById('profilEmail');
    const telephone = document.getElementById('profilTelephone');
    const faculte = document.getElementById('profilFaculte');
    const niveau = document.getElementById('profilNiveau');

    if (prenom) prenom.value = user.prenom || '';
    if (nom) nom.value = user.nom || '';
    if (email) email.value = user.email || '';
    if (telephone) telephone.value = user.telephone || '';
    if (faculte) faculte.value = user.faculte || '';
    if (niveau) niveau.value = user.niveau || '';
}

function updateUserDisplay(user) {
    if (!user) return;

    const displayNom = document.getElementById('profilDisplayNom');
    const displayRole = document.getElementById('profilDisplayRole');
    const displayFaculte = document.getElementById('profilDisplayFaculte');
    const displayProgramme = document.getElementById('profilDisplayProgramme');

    const roleLabels = {
        'etudiant': 'Étudiant',
        'professeur': 'Professeur',
        'administration': 'Administration'
    };

    if (displayNom) displayNom.textContent = user.prenom + ' ' + user.nom;
    if (displayRole) displayRole.textContent = roleLabels[user.role] || user.role || 'Membre';
    if (displayFaculte) displayFaculte.textContent = user.faculte || 'Non renseigné';
    if (displayProgramme) displayProgramme.textContent = user.niveau || 'Non renseigné';
}

function updateDashboard(user) {
    if (!user) return;

    const inscriptions = getUserInscriptions(user.email);

    const dashInscriptions = document.getElementById('dashInscriptions');
    const dashFaculte = document.getElementById('dashFaculte');
    const dashNiveau = document.getElementById('dashNiveau');
    const dashDate = document.getElementById('dashDate');

    if (dashInscriptions) dashInscriptions.textContent = inscriptions.length;
    if (dashFaculte) dashFaculte.textContent = user.faculte || 'Sciences';
    if (dashNiveau) dashNiveau.textContent = user.niveau || 'L3';
    if (dashDate) dashDate.textContent = new Date().getFullYear();

    const statInscriptions = document.getElementById('statInscriptions');
    const statEvenements = document.getElementById('statEvenements');
    const statAnnee = document.getElementById('statAnnee');

    if (statInscriptions) statInscriptions.textContent = inscriptions.length;
    if (statEvenements) statEvenements.textContent = inscriptions.length;
    if (statAnnee) statAnnee.textContent = new Date().getFullYear();

    updateRecentActivities(inscriptions);
}

function updateRecentActivities(inscriptions) {
    const container = document.getElementById('recentActivities');
    if (!container) return;

    if (inscriptions.length === 0) {
        container.innerHTML = '<p style="color: var(--gray);">Aucune activité récente</p>';
        return;
    }

    const recent = inscriptions.slice(-3).reverse();
    container.innerHTML = recent.map(ins => `
        <div style="padding: 12px; border-bottom: 1px solid var(--gray-light); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${ins.titre}</strong>
                <p style="color: var(--gray); font-size: 0.85rem; margin: 0;">
                    <i class="fas fa-calendar"></i> ${ins.date}
                </p>
            </div>
            <span style="color: var(--success); font-size: 0.85rem;">Inscrit</span>
        </div>
    `).join('');
}

function loadUserInscriptions(email) {
    const inscriptionsList = document.getElementById('inscriptionsList');
    if (!inscriptionsList) return;

    const inscriptions = getUserInscriptions(email);

    if (inscriptions.length === 0) {
        inscriptionsList.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-calendar-plus" style="font-size: 3rem; color: var(--gray);"></i>
                <p style="color: var(--gray); margin-top: 12px;">Vous n'êtes inscrit(e) à aucun événement pour le moment.</p>
                <a href="evenements.html" class="btn-primary" style="margin-top: 16px;">Découvrir des événements</a>
            </div>
        `;
        return;
    }

    let html = '';
    inscriptions.forEach(ins => {
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--gray-light);">
                <div>
                    <h4>${ins.titre}</h4>
                    <p style="color: var(--gray); font-size: 0.9rem;">
                        <i class="fas fa-calendar"></i> ${ins.date} 
                        <i class="fas fa-map-marker-alt" style="margin-left: 12px;"></i> ${ins.lieu}
                    </p>
                    <p style="color: var(--gray); font-size: 0.85rem;">
                        <i class="fas fa-user"></i> ${ins.nom}
                    </p>
                </div>
                <button onclick="annulerInscriptionLocal('${email}', ${ins.id})" class="btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">
                    <i class="fas fa-times"></i> Annuler
                </button>
            </div>
        `;
    });
    inscriptionsList.innerHTML = html;
}

function annulerInscriptionLocal(email, inscriptionId) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette inscription ?')) {
        removeUserInscription(email, inscriptionId);
        const currentUser = getCurrentUser();
        if (currentUser) {
            loadUserInscriptions(currentUser.email);
            updateDashboard(currentUser);
        }
        showProfilMessage('Inscription annulée avec succès.', 'success');
    }
}

// ============================================
// FORMULAIRE DE CONNEXION
// ============================================
function handleLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!email || !password) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        const users = getUsers();
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            setCurrentUser(foundUser);
            alert('Connexion réussie ! Bienvenue ' + foundUser.prenom + ' !');
            location.reload();
        } else {
            alert('Email ou mot de passe incorrect.');
        }
    });
}

// ============================================
// FORMULAIRE D'INSCRIPTION
// ============================================
function handleRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const prenom = document.getElementById('regPrenom').value.trim();
        const nom = document.getElementById('regNom').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const telephone = document.getElementById('regTelephone').value.trim();
        const role = document.getElementById('regRole').value;
        const faculte = document.getElementById('regFaculte').value;
        const niveau = document.getElementById('regNiveau').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const terms = document.getElementById('regTerms').checked;

        // Validation du prénom et nom (lettres uniquement)
        if (!prenom || !nom || !estNomValide(prenom) || !estNomValide(nom)) {
            alert('Veuillez entrer un prénom et un nom valides (lettres uniquement).');
            return;
        }

        if (!email || !isValidEmail(email)) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }

        const users = getUsers();
        if (users.some(u => u.email === email)) {
            alert('Cet email est déjà utilisé.');
            return;
        }

        if (!telephone || telephone.length < 8) {
            alert('Veuillez entrer un numéro de téléphone valide.');
            return;
        }

        if (!role) {
            alert('Veuillez sélectionner votre rôle.');
            return;
        }

        if (!faculte) {
            alert('Veuillez sélectionner votre faculté.');
            return;
        }

        if (!niveau) {
            alert('Veuillez sélectionner votre niveau.');
            return;
        }

        if (!password || password.length < 8) {
            alert('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        if (!terms) {
            alert('Veuillez accepter les conditions d\'utilisation.');
            return;
        }

        const newUser = {
            prenom: prenom,
            nom: nom,
            email: email,
            telephone: telephone,
            role: role,
            faculte: faculte,
            niveau: niveau,
            password: password,
            dateInscription: new Date().toLocaleDateString('fr-FR')
        };

        users.push(newUser);
        saveUsers(users);
        setCurrentUser(newUser);

        alert('Inscription réussie ! Bienvenue ' + prenom + ' !');
        location.reload();
    });
}

// ============================================
// GESTION DES ONGLETS
// ============================================
function handleTabs() {
    const tabs = document.querySelectorAll('.profil-nav a[data-tab]');
    const tabContents = {
        dashboard: document.getElementById('tabDashboard'),
        inscriptions: document.getElementById('tabInscriptions'),
        settings: document.getElementById('tabSettings')
    };

    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const tabName = this.getAttribute('data-tab');

            Object.keys(tabContents).forEach(key => {
                if (tabContents[key]) {
                    tabContents[key].classList.remove('active');
                }
            });

            if (tabContents[tabName]) {
                tabContents[tabName].classList.add('active');
            }
        });
    });
}

// ============================================
// FORMULAIRE DE MODIFICATION DU PROFIL
// ============================================
function handleProfilForm() {
    const profilForm = document.getElementById('profilForm');
    if (!profilForm) return;

    profilForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const prenom = document.getElementById('profilPrenom').value.trim();
        const nom = document.getElementById('profilNom').value.trim();
        const email = document.getElementById('profilEmail').value.trim();
        const telephone = document.getElementById('profilTelephone').value.trim();
        const faculte = document.getElementById('profilFaculte').value.trim();
        const niveau = document.getElementById('profilNiveau').value.trim();

        // Validation du prénom et nom (lettres uniquement)
        if (!prenom || !nom || !email || !estNomValide(prenom) || !estNomValide(nom)) {
            showProfilMessage('Veuillez remplir tous les champs obligatoires (lettres uniquement pour nom et prénom).', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showProfilMessage('Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        const currentUser = getCurrentUser();
        if (currentUser) {
            currentUser.prenom = prenom;
            currentUser.nom = nom;
            currentUser.email = email;
            currentUser.telephone = telephone;
            currentUser.faculte = faculte;
            currentUser.niveau = niveau;

            const users = getUsers();
            const index = users.findIndex(u => u.email === currentUser.email);
            if (index !== -1) {
                users[index] = currentUser;
                saveUsers(users);
                setCurrentUser(currentUser);
            }
        }

        updateUserDisplay(currentUser);
        updateDashboard(currentUser);

        showProfilMessage('Profil mis à jour avec succès !', 'success');
    });
}

// ============================================
// FORMULAIRE DE CHANGEMENT DE MOT DE PASSE
// ============================================
function handleSettingsForm() {
    const settingsForm = document.getElementById('settingsForm');
    if (!settingsForm) return;

    settingsForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const oldPwd = document.getElementById('oldPassword').value;
        const newPwd = document.getElementById('newPassword').value;
        const confirmPwd = document.getElementById('confirmNewPassword').value;

        if (!oldPwd || !newPwd || !confirmPwd) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        const currentUser = getCurrentUser();
        if (currentUser && currentUser.password !== oldPwd) {
            alert('Ancien mot de passe incorrect.');
            return;
        }

        if (newPwd !== confirmPwd) {
            alert('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }

        if (newPwd.length < 8) {
            alert('Le nouveau mot de passe doit contenir au moins 8 caractères.');
            return;
        }

        if (currentUser) {
            currentUser.password = newPwd;
            const users = getUsers();
            const index = users.findIndex(u => u.email === currentUser.email);
            if (index !== -1) {
                users[index] = currentUser;
                saveUsers(users);
                setCurrentUser(currentUser);
            }
        }

        alert('Votre mot de passe a été modifié avec succès.');
        this.reset();
    });
}

function handleLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }
}

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    const currentUser = getCurrentUser();
    const authSection = document.getElementById('authSection');
    const profilSection = document.getElementById('profilSection');
    const pageSubtitle = document.getElementById('pageSubtitle');

    if (currentUser) {
        if (authSection) authSection.style.display = 'none';
        if (profilSection) profilSection.style.display = 'block';
        if (pageSubtitle) {
            pageSubtitle.textContent = 'Bienvenue ' + currentUser.prenom + ' ' + currentUser.nom + ' !';
        }
        
        loadProfilePhoto();
        loadUserInscriptions(currentUser.email);
        loadUserProfile(currentUser);
        updateDashboard(currentUser);
    } else {
        if (profilSection) profilSection.style.display = 'none';
        if (authSection) authSection.style.display = 'block';
    }

    setupAvatarUpload();
    handleLoginForm();
    handleRegisterForm();
    handleTabs();
    handleProfilForm();
    handleSettingsForm();
    handleLogout();
});
