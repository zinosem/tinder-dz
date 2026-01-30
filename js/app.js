/* ========================================
   LoveDZ - Application de Rencontres Algérie
   JavaScript Principal
   ======================================== */

// ========================================
// Enregistrement du Service Worker (PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré:', registration.scope);
            })
            .catch((error) => {
                console.log('❌ Erreur Service Worker:', error);
            });
    });
}

// Détection si l'app est installée
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Afficher un bouton d'installation personnalisé si nécessaire
    showInstallButton();
});

function showInstallButton() {
    // On peut afficher un bouton d'installation dans l'UI
    console.log('💡 L\'app peut être installée');
}

// Installer l'app
function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ App installée!');
            }
            deferredPrompt = null;
        });
    }
}

// Vérifier si on est en mode standalone (installé)
function isInstalledPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

// ========================================
// État de l'Application
// ========================================
const appState = {
    currentUser: null,
    profiles: [],
    currentCardIndex: 0,
    matches: [],
    conversations: [],
    swipedProfiles: [],
    receivedLikes: [],
    sentLikes: [],
    superLikes: [],
    isPremium: false
};

// ========================================
// Profils de Démonstration
// ========================================
const demoProfiles = [
    {
        id: 1,
        name: "Sarah",
        age: 25,
        location: "Alger",
        bio: "Passionnée de voyage et de cuisine. J'adore découvrir de nouveaux endroits 🌍✨",
        interests: ["Voyage", "Cuisine", "Musique"],
        online: true,
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
        id: 2,
        name: "Amina",
        age: 23,
        location: "Oran",
        bio: "Médecin en formation, j'aime lire et faire du sport le weekend 📚💪",
        interests: ["Sport", "Lecture", "Cinéma"],
        online: false,
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
        id: 3,
        name: "Lina",
        age: 27,
        location: "Constantine",
        bio: "Architecte passionnée d'art et de design. La créativité est ma passion 🎨",
        interests: ["Art", "Design", "Voyage"],
        online: true,
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
        id: 4,
        name: "Yasmine",
        age: 24,
        location: "Annaba",
        bio: "Entrepreneuse, j'aime les challenges et les nouvelles rencontres 🚀",
        interests: ["Business", "Fitness", "Technologie"],
        online: false,
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    },
    {
        id: 5,
        name: "Nadia",
        age: 26,
        location: "Blida",
        bio: "Professeur d'anglais, passionnée de langues et de cultures 🌐📖",
        interests: ["Langues", "Culture", "Musique"],
        online: true,
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    },
    {
        id: 6,
        name: "Rania",
        age: 22,
        location: "Tizi Ouzou",
        bio: "Étudiante en informatique, geek et fière de l'être 👩‍💻🎮",
        interests: ["Gaming", "Tech", "Anime"],
        online: true,
        gradient: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
    },
    {
        id: 7,
        name: "Karim",
        age: 28,
        location: "Alger",
        bio: "Ingénieur en informatique, passionné de sport et de musique 🎸⚽",
        interests: ["Sport", "Musique", "Tech"],
        online: true,
        gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
    },
    {
        id: 8,
        name: "Youcef",
        age: 26,
        location: "Oran",
        bio: "Chef cuisinier, la gastronomie est mon art 🍳👨‍🍳",
        interests: ["Cuisine", "Voyage", "Photographie"],
        online: false,
        gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)"
    },
    {
        id: 9,
        name: "Mehdi",
        age: 30,
        location: "Constantine",
        bio: "Médecin urgentiste, j'adore la randonnée et le camping 🏔️",
        interests: ["Nature", "Randonnée", "Lecture"],
        online: true,
        gradient: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)"
    },
    {
        id: 10,
        name: "Sofiane",
        age: 25,
        location: "Sétif",
        bio: "Photographe freelance, je capture les beaux moments de la vie 📷",
        interests: ["Photographie", "Art", "Voyage"],
        online: false,
        gradient: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)"
    }
];

// ========================================
// Initialisation
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Masquer le splash screen après 2.5 secondes
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        showPage('landing-page');
    }, 2500);

    // Initialiser les événements
    initializeEventListeners();
    
    // Charger les profils de démo
    appState.profiles = [...demoProfiles];
    
    // Initialiser les likes de démo
    initializeDemoLikes();
    
    // Check premium status
    checkPremiumStatus();
});

// ========================================
// Gestion des Pages
// ========================================
function showPage(pageId) {
    // Masquer toutes les pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Afficher la page demandée
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.remove('hidden');
        
        // Actions spécifiques par page
        if (pageId === 'app-page') {
            generateCards();
        } else if (pageId === 'messages-page') {
            generateMatches();
            generateConversations();
        } else if (pageId === 'likes-page') {
            generateLikesGrid('received');
        }
    }
}

// ========================================
// Authentification
// ========================================
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simulation de connexion
    if (email && password) {
        appState.currentUser = {
            name: email.split('@')[0],
            email: email,
            location: "Alger",
            age: 25
        };
        
        showToast('Connexion réussie! 🎉');
        setTimeout(() => showPage('app-page'), 500);
    }
}

function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgot-email').value;
    
    if (email) {
        // Simulation d'envoi d'email
        showToast('Un email de réinitialisation a été envoyé à ' + email + ' 📧');
        
        // Retour à la page de connexion après 2 secondes
        setTimeout(() => {
            showPage('login-page');
        }, 2000);
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const firstname = document.getElementById('register-firstname').value;
    const age = document.getElementById('register-age').value;
    const email = document.getElementById('register-email').value;
    const wilaya = document.getElementById('register-wilaya').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const password = document.getElementById('register-password').value;
    
    if (firstname && age && email && wilaya && gender && password) {
        appState.currentUser = {
            name: firstname,
            email: email,
            location: wilaya,
            age: parseInt(age),
            gender: gender
        };
        
        // Mettre à jour le profil
        document.getElementById('profile-name').textContent = firstname + ', ' + age;
        document.getElementById('profile-location').textContent = wilaya;
        
        showToast('Compte créé avec succès! 🎉');
        setTimeout(() => showPage('app-page'), 500);
    }
}

function logout() {
    appState.currentUser = null;
    appState.swipedProfiles = [];
    appState.currentCardIndex = 0;
    
    showToast('À bientôt! 👋');
    setTimeout(() => showPage('landing-page'), 500);
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ========================================
// Génération des Cartes de Profil
// ========================================
function generateCards() {
    const cardStack = document.getElementById('card-stack');
    const noCards = document.getElementById('no-cards');
    
    cardStack.innerHTML = '';
    
    const availableProfiles = appState.profiles.filter(
        profile => !appState.swipedProfiles.includes(profile.id)
    );
    
    if (availableProfiles.length === 0) {
        noCards.classList.remove('hidden');
        return;
    }
    
    noCards.classList.add('hidden');
    
    // Afficher les 3 prochains profils
    const profilesToShow = availableProfiles.slice(0, 3).reverse();
    
    profilesToShow.forEach((profile, index) => {
        const card = createCard(profile, index === profilesToShow.length - 1);
        cardStack.appendChild(card);
    });
    
    // Initialiser le swipe sur la carte du dessus
    initializeSwipe();
    
    // Setup image navigation on cards
    document.querySelectorAll('.swipe-card').forEach(card => {
        setupCardImageNavigation(card);
    });
}

function createCard(profile, isTop) {
    const card = document.createElement('div');
    card.className = 'swipe-card';
    card.dataset.profileId = profile.id;
    
    if (!isTop) {
        card.style.transform = 'scale(0.95)';
        card.style.top = '10px';
    }
    
    const distance = Math.floor(Math.random() * 20) + 1;
    const verified = Math.random() > 0.5;
    
    card.innerHTML = `
        <div class="card-image" style="background: ${profile.gradient}">
            <i class="fas fa-user"></i>
            
            <!-- Image gallery dots -->
            <div class="card-image-dots">
                <div class="card-image-dot active"></div>
                <div class="card-image-dot"></div>
                <div class="card-image-dot"></div>
            </div>
            
            <div class="card-badges">
                ${profile.online ? '<span class="badge online"><i class="fas fa-circle"></i> En ligne</span>' : ''}
                ${verified ? '<span class="badge verified"><i class="fas fa-check-circle"></i> Vérifié</span>' : ''}
            </div>
            
            <!-- Quick actions -->
            <div class="card-quick-actions">
                <button class="card-quick-btn" onclick="event.stopPropagation(); reportProfile(${profile.id})">
                    <i class="fas fa-flag"></i>
                </button>
                <button class="card-quick-btn" onclick="event.stopPropagation(); shareProfile(${profile.id})">
                    <i class="fas fa-share"></i>
                </button>
            </div>
            
            <!-- Info overlay on image -->
            <div class="card-info-overlay">
                <h2>${profile.name}, <span>${profile.age}</span></h2>
                <p class="card-location">
                    <i class="fas fa-map-marker-alt"></i> ${profile.location}
                    <span class="card-distance">• ${distance} km</span>
                </p>
            </div>
            
            <div class="swipe-overlay like-overlay">LIKE</div>
            <div class="swipe-overlay nope-overlay">NOPE</div>
        </div>
        <div class="card-info">
            <p class="card-bio">${profile.bio}</p>
            <div class="card-tags">
                ${profile.interests.map(interest => `<span class="card-tag">${interest}</span>`).join('')}
            </div>
            <button class="card-expand-btn" onclick="event.stopPropagation(); expandProfile(${profile.id})">
                <i class="fas fa-chevron-down"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Quick action functions
function reportProfile(profileId) {
    showToast('Signalement envoyé 🚩');
}

function shareProfile(profileId) {
    showToast('Lien copié! 📋');
}

// ========================================
// Profile Detail Modal
// ========================================
let currentDetailProfile = null;
let currentImageIndex = 0;

function expandProfile(profileId) {
    const profile = appState.profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    currentDetailProfile = profile;
    currentImageIndex = 0;
    
    // Populate modal
    document.getElementById('detail-name').textContent = `${profile.name}, ${profile.age}`;
    document.getElementById('detail-location').textContent = profile.location;
    document.getElementById('detail-distance').textContent = `${Math.floor(Math.random() * 20) + 1} km`;
    document.getElementById('detail-bio').textContent = profile.bio;
    
    // Generate images
    const imagesContainer = document.getElementById('profile-detail-images');
    const dotsContainer = document.getElementById('gallery-dots');
    
    const colors = [profile.gradient, 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'];
    
    imagesContainer.innerHTML = colors.map((color, i) => `
        <div class="profile-detail-image" style="background: ${color}">
            <i class="fas fa-user"></i>
        </div>
    `).join('');
    
    dotsContainer.innerHTML = colors.map((_, i) => `
        <div class="gallery-dot ${i === 0 ? 'active' : ''}" onclick="goToProfileImage(${i})"></div>
    `).join('');
    
    // Generate interests
    const interestsContainer = document.getElementById('detail-interests');
    interestsContainer.innerHTML = profile.interests.map(interest => 
        `<span class="detail-interest">${interest}</span>`
    ).join('');
    
    // Show modal
    document.getElementById('profile-detail-modal').classList.remove('hidden');
}

function closeProfileDetail() {
    document.getElementById('profile-detail-modal').classList.add('hidden');
    currentDetailProfile = null;
}

function prevProfileImage() {
    const images = document.querySelectorAll('.profile-detail-image');
    const dots = document.querySelectorAll('.gallery-dot');
    
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateProfileGallery(images, dots);
    }
}

function nextProfileImage() {
    const images = document.querySelectorAll('.profile-detail-image');
    const dots = document.querySelectorAll('.gallery-dot');
    
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        updateProfileGallery(images, dots);
    }
}

function goToProfileImage(index) {
    const images = document.querySelectorAll('.profile-detail-image');
    const dots = document.querySelectorAll('.gallery-dot');
    
    currentImageIndex = index;
    updateProfileGallery(images, dots);
}

function updateProfileGallery(images, dots) {
    images.forEach((img, i) => {
        img.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentImageIndex);
    });
}

// ========================================
// Card Image Navigation
// ========================================
function setupCardImageNavigation(card) {
    const cardImage = card.querySelector('.card-image');
    if (!cardImage) return;
    
    // Create navigation areas
    const navArea = document.createElement('div');
    navArea.className = 'card-image-nav';
    navArea.innerHTML = `
        <div class="card-image-nav-area" data-dir="prev"></div>
        <div class="card-image-nav-area" data-dir="next"></div>
    `;
    cardImage.appendChild(navArea);
    
    let cardImageIndex = 0;
    const dots = card.querySelectorAll('.card-image-dot');
    const totalImages = dots.length;
    
    navArea.addEventListener('click', (e) => {
        e.stopPropagation();
        const dir = e.target.dataset.dir;
        
        if (dir === 'prev' && cardImageIndex > 0) {
            cardImageIndex--;
        } else if (dir === 'next' && cardImageIndex < totalImages - 1) {
            cardImageIndex++;
        }
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === cardImageIndex);
        });
    });
}

// ========================================
// Settings Functions
// ======================================== 
function showSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}

function changeEmail() {
    const newEmail = prompt('Entrez votre nouvel email:');
    if (newEmail && newEmail.includes('@')) {
        showToast('Email mis à jour! ✉️');
    }
}

function changePassword() {
    const currentPass = prompt('Mot de passe actuel:');
    if (currentPass) {
        const newPass = prompt('Nouveau mot de passe:');
        if (newPass && newPass.length >= 6) {
            showToast('Mot de passe mis à jour! 🔐');
        } else {
            showToast('Le mot de passe doit contenir au moins 6 caractères');
        }
    }
}

function changePhone() {
    const phone = prompt('Entrez votre numéro de téléphone:');
    if (phone) {
        showToast('Numéro de téléphone mis à jour! 📱');
    }
}

function manageBlockedUsers() {
    showToast('Aucun utilisateur bloqué');
}

function showHelp() {
    showToast('Centre d\'aide bientôt disponible');
}

function contactSupport() {
    showToast('Email: support@lovedz.com');
}

function showPrivacyPolicy() {
    showToast('Politique de confidentialité bientôt disponible');
}

function deleteAccount() {
    if (confirm('Es-tu sûr de vouloir supprimer ton compte? Cette action est irréversible.')) {
        if (confirm('Dernière confirmation: supprimer définitivement ton compte?')) {
            showToast('Compte supprimé. Au revoir! 👋');
            setTimeout(() => {
                logout();
            }, 2000);
        }
    }
}

// ========================================
// Système de Swipe
// ========================================
let currentCard = null;
let startX = 0;
let startY = 0;
let moveX = 0;
let isDragging = false;

function initializeSwipe() {
    currentCard = document.querySelector('.swipe-card:last-child');
    
    if (!currentCard) return;
    
    currentCard.addEventListener('mousedown', startDrag);
    currentCard.addEventListener('touchstart', startDrag);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
}

function startDrag(e) {
    if (!currentCard) return;
    
    isDragging = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    currentCard.style.transition = 'none';
}

function drag(e) {
    if (!isDragging || !currentCard) return;
    
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    moveX = currentX - startX;
    
    const rotate = moveX * 0.1;
    currentCard.style.transform = `translateX(${moveX}px) rotate(${rotate}deg)`;
    
    // Afficher les overlays
    const likeOverlay = currentCard.querySelector('.like-overlay');
    const nopeOverlay = currentCard.querySelector('.nope-overlay');
    
    if (moveX > 0) {
        likeOverlay.style.opacity = Math.min(moveX / 100, 1);
        nopeOverlay.style.opacity = 0;
    } else {
        nopeOverlay.style.opacity = Math.min(Math.abs(moveX) / 100, 1);
        likeOverlay.style.opacity = 0;
    }
}

function endDrag() {
    if (!isDragging || !currentCard) return;
    
    isDragging = false;
    currentCard.style.transition = 'transform 0.3s ease';
    
    const threshold = 100;
    
    if (moveX > threshold) {
        performSwipe('right');
    } else if (moveX < -threshold) {
        performSwipe('left');
    } else {
        // Retour à la position initiale
        currentCard.style.transform = '';
        currentCard.querySelector('.like-overlay').style.opacity = 0;
        currentCard.querySelector('.nope-overlay').style.opacity = 0;
    }
    
    moveX = 0;
}

function performSwipe(direction) {
    if (!currentCard) return;
    
    const profileId = parseInt(currentCard.dataset.profileId);
    appState.swipedProfiles.push(profileId);
    
    if (direction === 'right') {
        currentCard.classList.add('swipe-right');
        
        // Simuler un match (30% de chance)
        if (Math.random() < 0.3) {
            const profile = appState.profiles.find(p => p.id === profileId);
            if (profile) {
                setTimeout(() => showMatch(profile), 500);
            }
        }
    } else {
        currentCard.classList.add('swipe-left');
    }
    
    setTimeout(() => {
        generateCards();
    }, 500);
}

function swipeLeft() {
    if (currentCard) {
        currentCard.querySelector('.nope-overlay').style.opacity = 1;
        setTimeout(() => performSwipe('left'), 200);
    }
}

function swipeRight() {
    if (currentCard) {
        currentCard.querySelector('.like-overlay').style.opacity = 1;
        setTimeout(() => performSwipe('right'), 200);
    }
}

function superLike() {
    showToast('Super Like envoyé! ⭐');
    swipeRight();
}

function rewindCard() {
    if (appState.swipedProfiles.length > 0) {
        appState.swipedProfiles.pop();
        generateCards();
        showToast('Carte récupérée! ↩️');
    } else {
        showToast('Aucune carte à récupérer');
    }
}

function resetCards() {
    appState.swipedProfiles = [];
    generateCards();
    showToast('Profils réinitialisés! 🔄');
}

function boostProfile() {
    showToast('Profil boosté pour 30 minutes! ⚡');
}

// ========================================
// Système de Match
// ========================================
function showMatch(profile) {
    const modal = document.getElementById('match-modal');
    document.getElementById('match-name').textContent = profile.name;
    
    // Ajouter aux matchs
    if (!appState.matches.find(m => m.id === profile.id)) {
        appState.matches.push(profile);
    }
    
    // Ajouter une conversation
    if (!appState.conversations.find(c => c.id === profile.id)) {
        appState.conversations.push({
            id: profile.id,
            name: profile.name,
            lastMessage: "Nouveau match! 💕",
            time: "maintenant",
            unread: 1,
            online: profile.online,
            gradient: profile.gradient,
            messages: []
        });
    }
    
    modal.classList.remove('hidden');
}

function closeMatchModal() {
    document.getElementById('match-modal').classList.add('hidden');
}

function openChatFromMatch() {
    closeMatchModal();
    
    // Ouvrir le chat avec le dernier match
    if (appState.matches.length > 0) {
        const lastMatch = appState.matches[appState.matches.length - 1];
        openChat(lastMatch.id);
    }
}

// ========================================
// Messages et Conversations
// ========================================
function generateMatches() {
    const matchesScroll = document.getElementById('matches-scroll');
    matchesScroll.innerHTML = '';
    
    // Ajouter des matchs de démo si vide
    if (appState.matches.length === 0) {
        appState.matches = demoProfiles.slice(0, 5);
    }
    
    appState.matches.forEach((match, index) => {
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        matchItem.onclick = () => openChat(match.id);
        matchItem.innerHTML = `
            <div class="avatar ${match.online ? 'new' : ''}" style="background: ${match.gradient}">
                <i class="fas fa-user"></i>
                ${index < 2 ? '<span class="new-badge">NEW</span>' : ''}
            </div>
            <span>${match.name}</span>
        `;
        matchesScroll.appendChild(matchItem);
    });
}

function generateConversations() {
    const conversationsList = document.getElementById('conversations-list');
    conversationsList.innerHTML = '';
    
    // Ajouter des conversations de démo si vide
    if (appState.conversations.length === 0) {
        appState.conversations = [
            {
                id: 1,
                name: "Sarah",
                lastMessage: "Salut! Comment vas-tu? 😊",
                time: "10:30",
                unread: 2,
                online: true,
                typing: false,
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                messages: [
                    { text: "Salut!", sent: false, time: "10:25" },
                    { text: "Je vais bien, et toi?", sent: true, time: "10:26" },
                    { text: "Super! Tu fais quoi ce weekend?", sent: false, time: "10:28" },
                    { text: "Salut! Comment vas-tu? 😊", sent: false, time: "10:30" }
                ]
            },
            {
                id: 2,
                name: "Amina",
                lastMessage: "On se voit demain alors? 🎉",
                time: "Hier",
                unread: 0,
                online: false,
                typing: false,
                gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                messages: [
                    { text: "Hey!", sent: true, time: "15:00" },
                    { text: "Salut! 👋", sent: false, time: "15:05" },
                    { text: "On se voit demain alors? 🎉", sent: false, time: "15:30" }
                ]
            },
            {
                id: 3,
                name: "Lina",
                lastMessage: "Merci pour cette super soirée! 💕",
                time: "Lun",
                unread: 1,
                online: true,
                typing: true,
                gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                messages: [
                    { text: "C'était génial!", sent: true, time: "22:00" },
                    { text: "Merci pour cette super soirée! 💕", sent: false, time: "22:05" }
                ]
            },
            {
                id: 4,
                name: "Yasmine",
                lastMessage: "Oui, je suis d'accord avec toi!",
                time: "Dim",
                unread: 0,
                online: false,
                typing: false,
                gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                messages: [
                    { text: "Tu penses quoi de ça?", sent: true, time: "18:00" },
                    { text: "Oui, je suis d'accord avec toi!", sent: false, time: "18:30" }
                ]
            },
            {
                id: 5,
                name: "Nadia",
                lastMessage: "Photo envoyée 📷",
                time: "Sam",
                unread: 3,
                online: true,
                typing: false,
                gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                messages: [
                    { text: "Regarde ce que j'ai trouvé!", sent: false, time: "14:00" },
                    { text: "Photo envoyée 📷", sent: false, time: "14:01" }
                ]
            }
        ];
    }
    
    appState.conversations.forEach(conv => {
        const convItem = document.createElement('div');
        convItem.className = `conversation-item ${conv.unread > 0 ? 'unread' : ''}`;
        convItem.onclick = () => openChat(conv.id);
        convItem.innerHTML = `
            <div class="conversation-avatar ${conv.online ? 'online' : ''}" style="background: ${conv.gradient}">
                <i class="fas fa-user"></i>
                ${conv.typing ? `
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                ` : ''}
            </div>
            <div class="conversation-info">
                <h4>${conv.name}</h4>
                <p>
                    ${conv.typing ? '<i class="fas fa-pencil-alt"></i> En train d\'écrire...' : conv.lastMessage}
                </p>
            </div>
            <div class="conversation-meta">
                <span class="conversation-time">${conv.time}</span>
                ${conv.unread > 0 ? `<div class="unread-badge">${conv.unread}</div>` : ''}
            </div>
        `;
        conversationsList.appendChild(convItem);
    });
}

// Toggle search bar
function toggleMessageSearch() {
    const searchBar = document.getElementById('messages-search');
    if (searchBar.style.display === 'none') {
        searchBar.style.display = 'block';
        document.getElementById('search-conversation-input').focus();
    } else {
        searchBar.style.display = 'none';
    }
}

// Filter messages
function filterMessages(type) {
    document.querySelectorAll('.status-tab').forEach(tab => tab.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    const items = document.querySelectorAll('.conversation-item');
    items.forEach(item => {
        if (type === 'all') {
            item.style.display = 'flex';
        } else if (type === 'online') {
            const hasOnline = item.querySelector('.conversation-avatar.online');
            item.style.display = hasOnline ? 'flex' : 'none';
        } else if (type === 'unread') {
            const hasUnread = item.classList.contains('unread');
            item.style.display = hasUnread ? 'flex' : 'none';
        }
    });
}

let currentChatId = null;

function openChat(profileId) {
    currentChatId = profileId;
    const conversation = appState.conversations.find(c => c.id === profileId);
    
    if (!conversation) {
        const profile = appState.profiles.find(p => p.id === profileId);
        if (profile) {
            appState.conversations.push({
                id: profile.id,
                name: profile.name,
                lastMessage: "",
                time: "maintenant",
                unread: 0,
                online: profile.online,
                gradient: profile.gradient,
                messages: []
            });
        }
    }
    
    const conv = appState.conversations.find(c => c.id === profileId);
    if (conv) {
        document.getElementById('chat-name').textContent = conv.name;
        conv.unread = 0;
        generateChatMessages(conv.messages);
    }
    
    showPage('chat-page');
}

function generateChatMessages(messages) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${msg.sent ? 'sent' : 'received'}`;
        msgDiv.innerHTML = `
            ${msg.text}
            <div class="message-time">${msg.time}</div>
        `;
        chatMessages.appendChild(msgDiv);
    });
    
    // Scroll vers le bas
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    
    if (!text || !currentChatId) return;
    
    const conv = appState.conversations.find(c => c.id === currentChatId);
    if (conv) {
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        conv.messages.push({
            text: text,
            sent: true,
            time: time
        });
        
        conv.lastMessage = text;
        conv.time = time;
        
        generateChatMessages(conv.messages);
        input.value = '';
        
        // Simuler une réponse après 1-3 secondes
        setTimeout(() => simulateReply(conv), 1000 + Math.random() * 2000);
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// ========================================
// Chat Page Functions
// ========================================
function viewChatProfile() {
    const conv = appState.conversations.find(c => c.id === currentChatId);
    if (conv) {
        showToast(`Profil de ${conv.name} 👀`);
    }
}

function showChatOptions() {
    // Créer un menu d'options
    const existingMenu = document.querySelector('.chat-options-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'chat-options-menu';
    menu.innerHTML = `
        <div class="chat-option" onclick="blockUser()">
            <i class="fas fa-ban"></i> Bloquer
        </div>
        <div class="chat-option" onclick="reportUser()">
            <i class="fas fa-flag"></i> Signaler
        </div>
        <div class="chat-option" onclick="unmatchUser()">
            <i class="fas fa-heart-broken"></i> Unmatch
        </div>
        <div class="chat-option" onclick="clearChat()">
            <i class="fas fa-trash"></i> Effacer la conversation
        </div>
    `;
    document.querySelector('.chat-header').appendChild(menu);
    
    // Fermer le menu si on clique ailleurs
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!e.target.closest('.chat-options-menu') && !e.target.closest('.btn-more')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function blockUser() {
    showToast('Utilisateur bloqué 🚫');
    document.querySelector('.chat-options-menu')?.remove();
    showPage('messages-page');
}

function reportUser() {
    showToast('Signalement envoyé 🚩');
    document.querySelector('.chat-options-menu')?.remove();
}

function unmatchUser() {
    const conv = appState.conversations.find(c => c.id === currentChatId);
    if (conv) {
        appState.conversations = appState.conversations.filter(c => c.id !== currentChatId);
        appState.matches = appState.matches.filter(m => m.id !== currentChatId);
        showToast('Unmatch effectué 💔');
        showPage('messages-page');
    }
    document.querySelector('.chat-options-menu')?.remove();
}

function clearChat() {
    const conv = appState.conversations.find(c => c.id === currentChatId);
    if (conv) {
        conv.messages = [];
        generateChatMessages([]);
        showToast('Conversation effacée 🗑️');
    }
    document.querySelector('.chat-options-menu')?.remove();
}

function showAttachmentOptions() {
    const existingMenu = document.querySelector('.attachment-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'attachment-menu';
    menu.innerHTML = `
        <div class="attachment-option" onclick="sendPhoto()">
            <i class="fas fa-image"></i>
            <span>Photo</span>
        </div>
        <div class="attachment-option" onclick="sendGif()">
            <i class="fas fa-film"></i>
            <span>GIF</span>
        </div>
        <div class="attachment-option" onclick="sendLocation()">
            <i class="fas fa-map-marker-alt"></i>
            <span>Position</span>
        </div>
        <div class="attachment-option" onclick="sendVoice()">
            <i class="fas fa-microphone"></i>
            <span>Audio</span>
        </div>
    `;
    document.querySelector('.chat-input-container').appendChild(menu);
    
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!e.target.closest('.attachment-menu') && !e.target.closest('.chat-action-btn')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function sendPhoto() {
    addMessageToChat('📷 Photo envoyée', true);
    document.querySelector('.attachment-menu')?.remove();
}

function sendGif() {
    addMessageToChat('🎬 GIF envoyé', true);
    document.querySelector('.attachment-menu')?.remove();
}

function sendLocation() {
    addMessageToChat('📍 Position partagée', true);
    document.querySelector('.attachment-menu')?.remove();
}

function sendVoice() {
    addMessageToChat('🎤 Message vocal', true);
    document.querySelector('.attachment-menu')?.remove();
}

function addMessageToChat(text, isSent) {
    const conv = appState.conversations.find(c => c.id === currentChatId);
    if (conv) {
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        conv.messages.push({
            text: text,
            sent: isSent,
            time: time
        });
        
        conv.lastMessage = text;
        conv.time = time;
        
        generateChatMessages(conv.messages);
        
        if (isSent) {
            setTimeout(() => simulateReply(conv), 1500 + Math.random() * 2000);
        }
    }
}

const emojis = ['😊', '😂', '❤️', '😍', '🥰', '😘', '💕', '✨', '🔥', '👋', '🎉', '😎', '🤔', '😢', '😅', '💪', '👍', '🙏', '💯', '⭐'];

function showEmojiPicker() {
    const existingPicker = document.querySelector('.emoji-picker');
    if (existingPicker) {
        existingPicker.remove();
        return;
    }
    
    const picker = document.createElement('div');
    picker.className = 'emoji-picker';
    picker.innerHTML = emojis.map(emoji => `
        <span class="emoji-item" onclick="insertEmoji('${emoji}')">${emoji}</span>
    `).join('');
    
    document.querySelector('.chat-input-container').appendChild(picker);
    
    setTimeout(() => {
        document.addEventListener('click', function closePicker(e) {
            if (!e.target.closest('.emoji-picker') && !e.target.closest('.emoji-btn')) {
                picker.remove();
                document.removeEventListener('click', closePicker);
            }
        });
    }, 100);
}

function insertEmoji(emoji) {
    const input = document.getElementById('chat-input');
    input.value += emoji;
    input.focus();
}

const autoReplies = [
    "C'est super! 😊",
    "Ah oui? Dis m'en plus!",
    "Haha, trop drôle! 😂",
    "Je suis d'accord avec toi",
    "Intéressant! 🤔",
    "On devrait se voir un de ces jours!",
    "Tu fais quoi ce weekend?",
    "J'adore cette idée! ✨",
    "Merci! Tu es trop gentil(le) 💕",
    "C'est exactement ce que je pensais!"
];

function simulateReply(conv) {
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
    
    conv.messages.push({
        text: reply,
        sent: false,
        time: time
    });
    
    conv.lastMessage = reply;
    conv.time = time;
    
    if (currentChatId === conv.id) {
        generateChatMessages(conv.messages);
    }
}

// ========================================
// Profil et Préférences
// ========================================
function initializeEventListeners() {
    // Intérêts
    document.querySelectorAll('.interest-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('selected');
        });
    });
    
    // Sliders de préférences
    const ageMin = document.getElementById('age-min');
    const ageMax = document.getElementById('age-max');
    const ageDisplay = document.getElementById('age-range-display');
    
    if (ageMin && ageMax) {
        const updateAgeRange = () => {
            ageDisplay.textContent = `${ageMin.value} - ${ageMax.value} ans`;
        };
        ageMin.addEventListener('input', updateAgeRange);
        ageMax.addEventListener('input', updateAgeRange);
    }
    
    const distance = document.getElementById('distance');
    const distanceDisplay = document.getElementById('distance-display');
    
    if (distance) {
        distance.addEventListener('input', () => {
            distanceDisplay.textContent = `${distance.value} km`;
        });
    }
}

function showNotifications() {
    showToast('Notifications: 3 nouveaux likes! 💕');
}

// ========================================
// Navigation
// ========================================
function switchTab(tab) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    event.currentTarget.classList.add('active');
    
    if (tab === 'discover') {
        // Déjà sur la page principale
    } else if (tab === 'likes') {
        showToast('5 personnes t\'ont liké! 💕');
    }
}

// ========================================
// Utilitaires
// ========================================
function showToast(message) {
    // Supprimer les toasts existants
    document.querySelectorAll('.toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ========================================
// Gestion du stockage local
// ========================================
function saveToLocalStorage() {
    localStorage.setItem('loveDZ_user', JSON.stringify(appState.currentUser));
    localStorage.setItem('loveDZ_matches', JSON.stringify(appState.matches));
    localStorage.setItem('loveDZ_conversations', JSON.stringify(appState.conversations));
}

function loadFromLocalStorage() {
    const user = localStorage.getItem('loveDZ_user');
    const matches = localStorage.getItem('loveDZ_matches');
    const conversations = localStorage.getItem('loveDZ_conversations');
    
    if (user) appState.currentUser = JSON.parse(user);
    if (matches) appState.matches = JSON.parse(matches);
    if (conversations) appState.conversations = JSON.parse(conversations);
}

// Sauvegarder avant de fermer la page
window.addEventListener('beforeunload', saveToLocalStorage);

// ========================================
// Système de Likes
// ========================================
const demoLikesProfiles = [
    { id: 101, name: "Ines", age: 24, location: "Alger", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", time: "Il y a 2h", online: true },
    { id: 102, name: "Meriem", age: 22, location: "Oran", gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", time: "Il y a 5h", online: false },
    { id: 103, name: "Amira", age: 26, location: "Constantine", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", time: "Hier", online: true },
    { id: 104, name: "Fatima", age: 23, location: "Annaba", gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", time: "Hier", online: false },
    { id: 105, name: "Houda", age: 25, location: "Blida", gradient: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)", time: "Il y a 2j", online: true },
    { id: 106, name: "Sihem", age: 27, location: "Sétif", gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", time: "Il y a 2j", online: false },
    { id: 107, name: "Nour", age: 21, location: "Tlemcen", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", time: "Il y a 3j", online: true },
    { id: 108, name: "Amel", age: 28, location: "Béjaïa", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", time: "Il y a 3j", online: false },
    { id: 109, name: "Rym", age: 24, location: "Tizi Ouzou", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", time: "Il y a 4j", online: true },
    { id: 110, name: "Lamia", age: 26, location: "Mostaganem", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", time: "Il y a 5j", online: false },
    { id: 111, name: "Chaima", age: 23, location: "Chlef", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", time: "Il y a 6j", online: true },
    { id: 112, name: "Sabrina", age: 25, location: "Médéa", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", time: "Il y a 1sem", online: false }
];

const demoSuperLikes = [
    { id: 201, name: "Lilia", age: 25, location: "Alger", gradient: "linear-gradient(135deg, #00c6fb 0%, #005bea 100%)", time: "Il y a 1h", online: true },
    { id: 202, name: "Selma", age: 23, location: "Oran", gradient: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)", time: "Il y a 3h", online: true },
    { id: 203, name: "Dina", age: 27, location: "Constantine", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", time: "Hier", online: false }
];

function initializeDemoLikes() {
    appState.receivedLikes = [...demoLikesProfiles];
    appState.sentLikes = demoProfiles.slice(0, 8);
    appState.superLikes = [...demoSuperLikes];
}

function generateLikesGrid(type) {
    const grid = document.getElementById('likes-grid');
    const emptyState = document.getElementById('likes-empty');
    
    let profiles = [];
    let badgeType = 'heart';
    
    switch(type) {
        case 'received':
            profiles = appState.receivedLikes;
            badgeType = 'heart';
            break;
        case 'sent':
            profiles = appState.sentLikes;
            badgeType = 'heart';
            break;
        case 'superlikes':
            profiles = appState.superLikes;
            badgeType = 'star';
            break;
    }
    
    if (profiles.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    grid.innerHTML = profiles.map((profile, index) => {
        const isBlurred = !appState.isPremium && type === 'received' && index < 6;
        
        return `
            <div class="like-card ${isBlurred ? 'blurred' : ''}" data-profile-id="${profile.id}" onclick="${isBlurred ? 'showPremiumModal()' : `handleLikeCardClick(${profile.id}, '${type}')`}">
                <div class="like-card-image" style="background: ${profile.gradient}">
                    <i class="fas fa-user"></i>
                </div>
                <span class="like-card-time">${profile.time}</span>
                <div class="like-card-badge ${badgeType}">
                    <i class="fas fa-${badgeType}"></i>
                </div>
                ${isBlurred ? `
                    <div class="like-card-lock">
                        <i class="fas fa-lock"></i>
                        <span>Devenir Gold</span>
                    </div>
                ` : ''}
                <div class="like-card-overlay">
                    <div class="like-card-name">${profile.name}, ${profile.age}</div>
                    <div class="like-card-location">
                        <i class="fas fa-map-marker-alt"></i> ${profile.location}
                    </div>
                </div>
                ${!isBlurred && type === 'received' ? `
                    <div class="like-card-actions">
                        <button class="like-card-action reject" onclick="event.stopPropagation(); rejectLike(${profile.id})">
                            <i class="fas fa-times"></i>
                        </button>
                        <button class="like-card-action accept" onclick="event.stopPropagation(); acceptLike(${profile.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function switchLikesTab(type) {
    // Update active tab
    document.querySelectorAll('.likes-tab').forEach(tab => tab.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // Generate grid for selected type
    generateLikesGrid(type);
}

function handleLikeCardClick(profileId, type) {
    if (type === 'received') {
        // Show profile preview modal or accept/reject
        showToast('Affichage du profil...');
    } else if (type === 'sent') {
        showToast('En attente de réponse...');
    } else if (type === 'superlikes') {
        showToast('Super Like reçu! ⭐');
    }
}

function acceptLike(profileId) {
    const profile = appState.receivedLikes.find(p => p.id === profileId);
    if (profile) {
        // Remove from received likes
        appState.receivedLikes = appState.receivedLikes.filter(p => p.id !== profileId);
        
        // Add to matches
        appState.matches.push(profile);
        
        // Add conversation
        appState.conversations.unshift({
            id: profile.id,
            name: profile.name,
            lastMessage: "C'est un match! Dis bonjour 👋",
            time: "maintenant",
            unread: 1,
            online: profile.online,
            gradient: profile.gradient,
            messages: []
        });
        
        // Show match modal
        showMatchFromLike(profile);
        
        // Refresh grid
        generateLikesGrid('received');
        
        // Update badge count
        updateLikesBadge();
    }
}

function rejectLike(profileId) {
    appState.receivedLikes = appState.receivedLikes.filter(p => p.id !== profileId);
    generateLikesGrid('received');
    updateLikesBadge();
    showToast('Profil ignoré');
}

function showMatchFromLike(profile) {
    const modal = document.getElementById('match-modal');
    document.getElementById('match-name').textContent = profile.name;
    modal.classList.remove('hidden');
}

function updateLikesBadge() {
    const count = appState.receivedLikes.length;
    document.querySelectorAll('.likes-count-badge, .nav-badge').forEach(badge => {
        if (badge.closest('.likes-header') || badge.closest('.nav-item')) {
            badge.textContent = count;
        }
    });
    
    // Update tab counts
    const receivedTab = document.querySelector('.likes-tab:first-child .tab-count');
    const sentTab = document.querySelector('.likes-tab:nth-child(2) .tab-count');
    const superTab = document.querySelector('.likes-tab:last-child .tab-count');
    
    if (receivedTab) receivedTab.textContent = appState.receivedLikes.length;
    if (sentTab) sentTab.textContent = appState.sentLikes.length;
    if (superTab) superTab.textContent = appState.superLikes.length;
}

// ========================================
// Premium System
// ========================================
function showPremiumModal() {
    document.getElementById('premium-modal').classList.remove('hidden');
}

function closePremiumModal() {
    document.getElementById('premium-modal').classList.add('hidden');
}

function selectPlan(element) {
    document.querySelectorAll('.premium-plan').forEach(plan => {
        plan.classList.remove('selected');
    });
    element.classList.add('selected');
}

function subscribePremium() {
    appState.isPremium = true;
    localStorage.setItem('isPremium', 'true');
    closePremiumModal();
    showToast('Bienvenue dans LoveDZ Gold! 👑');
    
    // Hide premium banner and show active banner
    updatePremiumBanners();
    
    // Refresh likes grid to show unblurred profiles
    if (!document.getElementById('likes-page').classList.contains('hidden')) {
        generateLikesGrid('received');
    }
}

// Update premium banners visibility
function updatePremiumBanners() {
    const premiumBanner = document.getElementById('premium-banner');
    const activeBanner = document.getElementById('premium-active-banner');
    
    if (appState.isPremium) {
        if (premiumBanner) premiumBanner.classList.add('hidden');
        if (activeBanner) activeBanner.classList.remove('hidden');
    } else {
        if (premiumBanner) premiumBanner.classList.remove('hidden');
        if (activeBanner) activeBanner.classList.add('hidden');
    }
}

// Check premium status on load
function checkPremiumStatus() {
    const isPremium = localStorage.getItem('isPremium') === 'true';
    appState.isPremium = isPremium;
    updatePremiumBanners();
}
