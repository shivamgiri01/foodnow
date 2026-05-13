import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { GoogleAuthProvider, browserLocalPersistence, getAuth, onAuthStateChanged, reload, setPersistence, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = window.FIREBASE_CONFIG || null;
    const firebaseReady = Boolean(firebaseConfig?.apiKey && firebaseConfig?.authDomain && firebaseConfig?.projectId && firebaseConfig?.appId);
    const firebaseApp = firebaseReady ? initializeApp(firebaseConfig) : null;
    const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
    const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null;
    const googleProvider = firebaseAuth ? new GoogleAuthProvider() : null;

    const imagesByCategory = {
        Pizza: [
            "img/food-items/pizza-1.webp",
            "img/food-items/pizza-2.jpg",
            "img/food-items/pizza-3.webp",
            "img/food-items/pizza-4.jpg"
        ],
        Burger: [
            "img/food-items/burger-1.jpeg",
            "img/food-items/burger-2.jpg",
            "img/food-items/burger-3.webp",
            "img/food-items/burger-4.jpg"
        ],
        Momo: [
            "img/food-items/momos-1.jpg",
            "img/food-items/momos-2.webp",
            "img/food-items/momos-3.jpg",
            "img/food-items/momos-4.webp"
        ],
        Roll: [
            "img/food-items/roll-1.jpg",
            "img/food-items/roll-2.jpg",
            "img/food-items/roll-3.webp",
            "img/food-items/roll-4.jpg"
        ],
        Chowmin: [
            "img/food-items/chowmin-1.jpg",
            "img/food-items/chowmin-2.webp",
            "img/food-items/chowmin-3.jpg",
            "img/food-items/chowmin-4.jpg"
        ],
        Drink: [
            "img/food-items/drink-1.jpg",
            "img/food-items/drink-2.webp",
            "img/food-items/drink-3.jpg",
            "img/food-items/drink-4.jpg"
        ]
    };

    function imageFor(category, index) {
        const categoryImages = imagesByCategory[category] || [];
        return categoryImages[index] || categoryImages[0] || '';
    }

    const foodData = [
        { id: 1, name: "Cheese Pizza", category: "Pizza", price: 199, description: "Classic cheese pizza with tomato sauce, mozzarella and veggies.", imageUrl: imageFor("Pizza", 0), keywords: ["pizza", "cheese", "margherita", "veg"] },
        { id: 2, name: "Veggie Pizza", category: "Pizza", price: 269, description: "Loaded with capsicum, onion, tomato, corn and extra mozzarella.", imageUrl: imageFor("Pizza", 1), keywords: ["pizza", "farmhouse", "vegetable", "veg"] },
        { id: 3, name: "Paneer Pizza", category: "Pizza", price: 299, description: "Spiced paneer, onion, capsicum, mozzarella and creamy sauce.", imageUrl: imageFor("Pizza", 2), keywords: ["pizza", "paneer", "creamy", "spicy"] },
        { id: 4, name: "Cheese Burst Pizza", category: "Pizza", price: 329, description: "Soft crust filled with molten cheese and topped with veggies and extra mozzarella.", imageUrl: imageFor("Pizza", 3), keywords: ["pizza", "cheese burst", "cheesy"] },

        { id: 7, name: "Aloo Tikki Burger", category: "Burger", price: 69, description: "Crispy aloo tikki with onion, tomato and tangy house sauce.", imageUrl: imageFor("Burger", 0), keywords: ["burger", "aloo tikki", "veg"] },
        { id: 8, name: "Cheese Burger", category: "Burger", price: 89, description: "Veg cheese slice, fresh and creamy burger sauce.", imageUrl: imageFor("Burger", 1), keywords: ["burger", "cheese", "veg"] },
        { id: 9, name: "Crispy Veg Burger", category: "Burger", price: 99, description: "Crunchy veg patty with mayo and fried buns.", imageUrl: imageFor("Burger", 2), keywords: ["burger", "crispy", "veg"] },
        { id: 10, name: "Paneer Burger", category: "Burger", price: 129, description: "Paneer slice, onion rings and mildly spicy sauce.", imageUrl: imageFor("Burger", 3), keywords: ["burger", "paneer", "spicy"] },

        { id: 13, name: "Steamed Veg Momos", category: "Momo", price: 89, description: "Soft momos filled with mixed vegetables and served with red chutney.", imageUrl: imageFor("Momo", 0), keywords: ["momo", "momos", "steamed", "veg"] },
        { id: 14, name: "Fried Momos", category: "Momo", price: 109, description: "Crispy fried momos with juicy vegetable filling and spicy dip.", imageUrl: imageFor("Momo", 1), keywords: ["momo", "fried", "crispy"] },
        { id: 15, name: "Tandoori Momos", category: "Momo", price: 139, description: "Momos made in tandoori style, masala and grilled for spicy flavour.", imageUrl: imageFor("Momo", 2), keywords: ["momo", "tandoori", "spicy"] },
        { id: 16, name: "Kurkure Momos", category: "Momo", price: 149, description: "Extra crunchy momos coated and fried", imageUrl: imageFor("Momo", 3), keywords: ["momo", "kurkure", "crunchy"] },

        { id: 19, name: "Veg Spring Roll", category: "Roll", price: 79, description: "Crispy roll stuffed with cabbage, capsicum and noodles.", imageUrl: imageFor("Roll", 0), keywords: ["roll", "spring roll", "veg"] },
        { id: 20, name: "Paneer Roll", category: "Roll", price: 129, description: "Soft wrap filled with paneer tikka, onion and  mayo.", imageUrl: imageFor("Roll", 1), keywords: ["roll", "paneer", "wrap"] },
        { id: 21, name: "Cheese Corn Roll", category: "Roll", price: 119, description: "Creamy cheese and corn filling wrapped in a crispy roll.", imageUrl: imageFor("Roll", 2), keywords: ["roll", "cheese", "corn"] },
        { id: 22, name: "Veg Roll", category: "Roll", price: 109, description: "Vegetables, onion and sauces rolled in soft paratha.", imageUrl: imageFor("Roll", 3), keywords: ["roll", "tandoori", "veg"] },

        { id: 25, name: "Veg Chowmin", category: "Chowmin", price: 89, description: "Classic street-style noodles tossed with fresh vegetables.", imageUrl: imageFor("Chowmin", 0), keywords: ["chowmin", "chowmein", "noodles", "veg"] },
        { id: 26, name: "Schezwan Chowmin", category: "Chowmin", price: 109, description: "Chowmin tossed in fiery Schezwan sauce with crunchy vegetables.", imageUrl: imageFor("Chowmin", 1), keywords: ["chowmin", "schezwan", "spicy", "noodles"] },
        { id: 27, name: "Paneer Chowmin", category: "Chowmin", price: 129, description: "Chowmin mixed with paneer cubes, vegetables and soy chilli sauce.", imageUrl: imageFor("Chowmin", 2), keywords: ["chowmin", "paneer", "noodles"] },
        { id: 28, name: "Singapuri Chowmin", category: "Chowmin", price: 119, description: "Chowmin mixed with paneer, spring onion and vegetables.", imageUrl: imageFor("Chowmin", 3), keywords: ["singapuri", "chowmin", "noodles"] },

        { id: 31, name: "Mango Lassi", category: "Drink", price: 89, description: "Fresh mango lassi with milk and a rich fruity finish.", imageUrl: imageFor("Drink", 0), keywords: ["drink", "mango", "lassi"] },
        { id: 32, name: "Lemon Tea", category: "Drink", price: 99, description: "Refreshing iced lemon tea with lemon and light sweetness.", imageUrl: imageFor("Drink", 1), keywords: ["drink", "lemon tea", "lemon"] },
        { id: 33, name: "Cold Coffee", category: "Drink", price: 69, description: "Chilled creamy coffee blended smooth and served cold.", imageUrl: imageFor("Drink", 2), keywords: ["drink", "coffee", "cold coffee"] },
        { id: 34, name: "Masala Lemonade", category: "Drink", price: 59, description: "Tangy lemonade with Indian masala and mint.", imageUrl: imageFor("Drink", 3), keywords: ["drink", "lemonade", "masala"] }
    ];

    const topPickIds = [1, 3, 7, 13, 19, 20, 25, 31];
    let cart = [];

    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const cartCountElements = document.querySelectorAll('.cart-count');
    const menuGrid = document.getElementById('menu-grid-container');
    const featuredGrid = document.getElementById('featured-grid-container');
    const menuSearchInput = document.getElementById('menu-search-input');
    const heroSearchInput = document.getElementById('hero-search-input');
    const cartContentWrapper = document.getElementById('cart-content-wrapper');
    const checkoutForm = document.getElementById('checkout-form');
    const contactForm = document.getElementById('contact-form');
    const profileSetupCard = document.getElementById('profile-setup-card');
    const profileFormCard = document.getElementById('profile-form-card');
    const profileForm = document.getElementById('profile-form');
    const profilePageTitle = document.getElementById('profile-page-title');
    const profilePageCopy = document.getElementById('profile-page-copy');
    const profileDashboard = document.getElementById('profile-dashboard');
    const profileOrdersPanel = document.getElementById('profile-orders-panel');
    const profileName = document.getElementById('profile-name');
    const profilePhone = document.getElementById('profile-phone');
    const profileCity = document.getElementById('profile-city');
    const profileGender = document.getElementById('profile-gender');
    const profileStatus = document.getElementById('profile-status');
    const profilePhotoInput = document.getElementById('profile-photo');
    const profilePhotoPreview = document.getElementById('profile-photo-preview');
    const profilePhotoPlaceholder = document.getElementById('profile-photo-placeholder');
    const profileCardAvatarImage = document.getElementById('profile-card-avatar-image');
    const profileCardAvatarPlaceholder = document.getElementById('profile-card-avatar-placeholder');
    const profileCardName = document.getElementById('profile-card-name');
    const profileCardHandle = document.getElementById('profile-card-handle');
    const profileCardLogoutBtn = document.getElementById('profile-card-logout-btn');
    const profileAvatarImage = document.getElementById('profile-avatar-image');
    const profileAvatarFallback = document.getElementById('profile-avatar-fallback');
    const headerLogoutBtn = document.getElementById('header-logout-btn');
    const pageGoogleAuthBtn = document.getElementById('page-google-auth-btn');
    const profileIconLink = document.getElementById('profile-icon-link');
    const profileOrdersList = document.getElementById('profile-orders-list');
    const paymentDoneBtn = document.getElementById('payment-done-btn');

    let currentUser = null;
    let currentProfile = null;
    let userProfileUnsubscribe = null;
    let profileEditorMode = null;
    let selectedProfilePhotoFile = null;
    let pendingAvatarDataUrlPromise = null;
    let activeProfilePreviewObjectUrl = '';
    if (googleProvider) {
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });
    }

    function init() {
        loadCartFromStorage();
        renderMenu(foodData);
        renderFeatured();
        updateCartUI();
        if (window.AOS) {
            window.AOS.init({
                once: true,
                duration: 760,
                offset: 70,
                easing: 'ease-out-cubic',
                anchorPlacement: 'top-bottom'
            });
        }
        navigateTo(window.location.hash.substring(1) || 'home', false);
        setupEventListeners();
        bindFirebaseAuth();
    }

    async function bindFirebaseAuth() {
        if (!firebaseAuth) {
            updateAuthUI(false);
            setProfileSetupVisibility(false);
            return;
        }

        try {
            await setPersistence(firebaseAuth, browserLocalPersistence);
        } catch (error) {
            console.warn('Could not enable auth persistence.', error);
        }

        onAuthStateChanged(firebaseAuth, async user => {
            currentUser = user || null;
            if (userProfileUnsubscribe) {
                userProfileUnsubscribe();
                userProfileUnsubscribe = null;
            }

            if (!user) {
                currentProfile = null;
                profileEditorMode = null;
                selectedProfilePhotoFile = null;
                pendingAvatarDataUrlPromise = null;
                updateAuthUI(false);
                setProfileSetupVisibility(false);
                if (profileStatus) profileStatus.textContent = 'Profile not completed yet.';
                updateAvatarUI('');
                renderProfileOrders();
                return;
            }

            const authPhotoURL = getAuthPhotoUrl(user);
            await ensureUserProfile(user);
            const userRef = doc(firebaseDb, 'users', user.uid);
            const snap = await getDoc(userRef);
            currentProfile = snap.exists()
                ? {
                    ...snap.data(),
                    googlePhotoURL: snap.data()?.googlePhotoURL || authPhotoURL || '',
                    photoURL: snap.data()?.photoURL || authPhotoURL || '',
                    avatarDataUrl: snap.data()?.avatarDataUrl || snap.data()?.avatarUrl || ''
                }
                : {
                    googlePhotoURL: authPhotoURL || '',
                    photoURL: authPhotoURL || '',
                    avatarDataUrl: ''
                };
            updateAvatarUI(getCurrentAvatarUrl());
            updateAuthUI(isProfileComplete(currentProfile));
            listenToUserProfile(user.uid);
            renderProfileOrders();
            if (!isProfileComplete(currentProfile)) {
                profileEditorMode = 'complete';
                showProfileEditor('complete');
                navigateTo('login');
            } else {
                profileEditorMode = null;
                setProfileSetupVisibility(false);
            }
        });
    }

    function updateAuthUI(isProfileReady) {
        const authLinks = document.querySelectorAll('.login-btn');
        authLinks.forEach(link => {
            link.textContent = isProfileReady ? 'Logout' : 'Login / Sign Up';
            link.dataset.action = isProfileReady ? 'logout' : 'login';
            link.classList.toggle('is-cta', isProfileReady);
        });

        if (profileIconLink) profileIconLink.style.display = 'inline-flex';
        if (headerLogoutBtn) headerLogoutBtn.style.display = currentUser ? 'inline-flex' : 'none';
        updateProfileCardSummary();
        updateAvatarUI(getCurrentAvatarUrl());
        if (profileEditorMode === 'edit') {
            if (profilePageTitle) profilePageTitle.textContent = 'Edit Profile';
            if (profilePageCopy) profilePageCopy.textContent = 'Update your details and save changes.';
        } else if (currentUser && !isProfileReady) {
            if (profilePageTitle) profilePageTitle.textContent = 'Complete Profile';
            if (profilePageCopy) profilePageCopy.textContent = 'Fill in the details below to complete your profile.';
        } else {
            if (profilePageTitle) profilePageTitle.textContent = 'Login / Sign Up';
            if (profilePageCopy) profilePageCopy.textContent = 'Continue with Google to create or access your account.';
        }
        if (pageGoogleAuthBtn) pageGoogleAuthBtn.textContent = currentUser ? 'Reconnect Google' : 'Continue with Google';
        updateProfileLayout();
    }

    function setProfileSetupVisibility(showForm) {
        if (profileSetupCard) profileSetupCard.style.display = showForm ? 'none' : 'block';
        if (profileFormCard) profileFormCard.style.display = showForm ? 'block' : 'none';
        renderProfileOrders();
    }

    function showProfileEditor(mode = 'edit') {
        profileEditorMode = mode;
        if (profileSetupCard) profileSetupCard.style.display = 'none';
        if (profileFormCard) profileFormCard.style.display = 'block';
        if (profileStatus) profileStatus.hidden = true;
        updateAuthUI(isProfileComplete(currentProfile));
        syncProfileForm();
        renderProfileOrders();
    }

    function hideProfileEditor() {
        profileEditorMode = null;
        setProfileSetupVisibility(false);
        updateAuthUI(isProfileComplete(currentProfile));
        renderProfileOrders();
    }

    function updateProfileLayout() {
        const isLoggedIn = Boolean(currentUser);
        if (profileDashboard) {
            profileDashboard.classList.toggle('is-logged-out', !isLoggedIn);
        }
        if (profileOrdersPanel) {
            profileOrdersPanel.hidden = !isLoggedIn;
        }
    }

    function getCurrentAvatarUrl() {
        return currentProfile?.avatarDataUrl
            || currentProfile?.avatarUrl
            || currentProfile?.profile?.avatarUrl
            || currentProfile?.googlePhotoURL
            || currentProfile?.profile?.googlePhotoURL
            || currentProfile?.photoURL
            || currentProfile?.profile?.photoURL
            || getAuthPhotoUrl(currentUser)
            || '';
    }

    function getAuthPhotoUrl(user) {
        return user?.photoURL || user?.providerData?.find(provider => provider?.photoURL)?.photoURL || '';
    }

    function updateAvatarUI(url) {
        const safeUrl = url || '';
        if (profileAvatarImage) {
            if (safeUrl) {
                profileAvatarImage.src = safeUrl;
                profileAvatarImage.style.display = 'block';
            } else {
                profileAvatarImage.removeAttribute('src');
                profileAvatarImage.style.display = 'none';
            }
        }
        if (profileAvatarFallback) {
            profileAvatarFallback.style.display = safeUrl ? 'none' : 'block';
        }
    }

    function getProfileCardAvatarUrl() {
        return currentProfile?.avatarDataUrl
            || currentProfile?.avatarUrl
            || currentProfile?.googlePhotoURL
            || currentProfile?.photoURL
            || getAuthPhotoUrl(currentUser)
            || '';
    }

    function getProfileDisplayName() {
        return currentProfile?.name
            || currentUser?.displayName
            || currentUser?.email?.split('@')?.[0]
            || 'FoodNow User';
    }

    function getProfileDisplayHandle() {
        const fromEmail = currentUser?.email?.split('@')?.[0];
        const base = fromEmail || currentProfile?.name || 'foodnow';
        return `@${String(base).toLowerCase().replace(/\s+/g, '')}`;
    }

    function updateProfileCardSummary(avatarOverride = '') {
        if (profileCardName) profileCardName.textContent = getProfileDisplayName();
        if (profileCardHandle) profileCardHandle.textContent = getProfileDisplayHandle();
        const avatarUrl = avatarOverride || getProfileCardAvatarUrl();
        if (profileCardAvatarImage) {
            if (avatarUrl) {
                profileCardAvatarImage.src = avatarUrl;
                profileCardAvatarImage.style.display = 'block';
            } else {
                profileCardAvatarImage.removeAttribute('src');
                profileCardAvatarImage.style.display = 'none';
            }
        }
        if (profileCardAvatarPlaceholder) {
            profileCardAvatarPlaceholder.style.display = avatarUrl ? 'none' : 'flex';
            profileCardAvatarPlaceholder.textContent = (getProfileDisplayName().slice(0, 2) || 'FN').toUpperCase();
        }
    }

    function revokeActiveProfilePreviewObjectUrl() {
        if (activeProfilePreviewObjectUrl) {
            URL.revokeObjectURL(activeProfilePreviewObjectUrl);
            activeProfilePreviewObjectUrl = '';
        }
    }

    async function fileToAvatarDataUrl(file, maxSize = 256, quality = 0.86) {
        if (!file) return '';

        const image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Could not read profile picture.'));
            reader.onload = () => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Could not process profile picture.'));
                img.src = String(reader.result || '');
            };
            reader.readAsDataURL(file);
        });

        const width = image.width || 1;
        const height = image.height || 1;
        const scale = Math.min(1, maxSize / Math.max(width, height));
        const targetWidth = Math.max(1, Math.round(width * scale));
        const targetHeight = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Canvas unavailable for avatar resize.');
        }

        context.drawImage(image, 0, 0, targetWidth, targetHeight);
        return canvas.toDataURL('image/jpeg', quality);
    }

    function isProfileComplete(profile) {
        if (!profile) return false;
        return Boolean(profile.name && profile.phone && profile.city && profile.gender);
    }

    async function ensureUserProfile(user) {
        if (!firebaseDb) return;
        const userRef = doc(firebaseDb, 'users', user.uid);
        const authPhotoURL = getAuthPhotoUrl(user);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
                googlePhotoURL: authPhotoURL,
                photoURL: authPhotoURL,
                avatarUrl: '',
                avatarDataUrl: '',
                name: user.displayName || '',
                phone: '',
                city: '',
                gender: '',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }, { merge: true });
        } else {
            const currentData = snap.data() || {};
            const currentGooglePhotoURL = currentData.googlePhotoURL || '';
            if (authPhotoURL && currentGooglePhotoURL !== authPhotoURL) {
                await setDoc(userRef, {
                    googlePhotoURL: authPhotoURL,
                    photoURL: authPhotoURL,
                    updatedAt: serverTimestamp()
                }, { merge: true });
            }
        }
    }

    function listenToUserProfile(uid) {
        if (!firebaseDb) return;
        const userRef = doc(firebaseDb, 'users', uid);
        userProfileUnsubscribe = onSnapshot(userRef, snap => {
            currentProfile = snap.exists()
                ? {
                    ...snap.data(),
                    googlePhotoURL: snap.data()?.googlePhotoURL || getAuthPhotoUrl(currentUser) || '',
                    photoURL: snap.data()?.photoURL || getAuthPhotoUrl(currentUser) || '',
                    avatarDataUrl: snap.data()?.avatarDataUrl || snap.data()?.avatarUrl || ''
                }
                : null;
            syncProfileForm();
            updateAuthUI(isProfileComplete(currentProfile));
            renderProfileOrders();
            if (profileStatus && !isProfileComplete(currentProfile)) {
                profileStatus.hidden = true;
            }
        });
    }

    function syncProfileForm() {
        if (!currentProfile) return;
        if (profileName) profileName.value = currentProfile.name || currentUser?.displayName || '';
        if (profilePhone) profilePhone.value = currentProfile.phone || '';
        if (profileCity) profileCity.value = currentProfile.city || '';
        if (profileGender) profileGender.value = currentProfile.gender || '';
        updateAvatarPreview(getCurrentAvatarUrl());
    }

    function updateAvatarPreview(url) {
        const safeUrl = url || '';
        if (profilePhotoPreview) {
            if (safeUrl) {
                profilePhotoPreview.src = safeUrl;
                profilePhotoPreview.style.display = 'block';
            } else {
                profilePhotoPreview.removeAttribute('src');
                profilePhotoPreview.style.display = 'none';
            }
        }
        if (profilePhotoPlaceholder) {
            profilePhotoPlaceholder.style.display = safeUrl ? 'none' : 'flex';
        }
    }

    function loadCartFromStorage() {
        const storedCart = localStorage.getItem('foodNowCart');
        cart = storedCart ? JSON.parse(storedCart) : [];
    }

    function getCurrentOrderStorageKey() {
        if (!currentUser?.uid) return '';
        return `foodNowOrders:${currentUser.uid}`;
    }

    function loadOrderHistory() {
        const storageKey = getCurrentOrderStorageKey();
        if (!storageKey) return [];

        const storedOrders = localStorage.getItem(storageKey);
        return storedOrders ? JSON.parse(storedOrders) : [];
    }

    function saveOrderHistory(orders) {
        const storageKey = getCurrentOrderStorageKey();
        if (!storageKey) return;
        localStorage.setItem(storageKey, JSON.stringify(orders));
    }

    function addOrderToHistory(orderDetails) {
        if (!currentUser?.uid) return;
        const existingOrders = loadOrderHistory();
        existingOrders.unshift(orderDetails);
        saveOrderHistory(existingOrders);
    }

    function savePendingOrder(orderDetails) {
        localStorage.setItem('foodNowPendingOrder', JSON.stringify(orderDetails));
    }

    function loadPendingOrder() {
        const storedOrder = localStorage.getItem('foodNowPendingOrder');
        return storedOrder ? JSON.parse(storedOrder) : null;
    }

    function clearPendingOrder() {
        localStorage.removeItem('foodNowPendingOrder');
    }

    function formatOrderDate(dateValue) {
        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) return 'Just now';
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    function renderProfileOrdersLegacy() {
        if (!profileOrdersList) return;

        if (!currentUser) {
            profileOrdersList.innerHTML = '<div class="profile-orders-empty">Login karne ke baad yahan aapke saare orders full details ke saath dikhेंगे.</div>';
            return;
        }

        const orders = loadOrderHistory();
        if (!orders.length) {
            profileOrdersList.innerHTML = '<div class="profile-orders-empty">Abhi tak koi order place nahi hua. Menu se order karke history yahan dekh sakte ho.</div>';
            return;
        }

        profileOrdersList.innerHTML = orders.map(order => `
            <article class="profile-order-card">
                <div class="profile-order-top">
                    <div>
                        <h3>Order #${normalizeOrderId(order.orderId)}</h3>
                        <div class="profile-order-meta">
                            <span>${formatOrderDate(order.createdAt)}</span>
                            <span>${order.items?.length || 0} items</span>
                        </div>
                    </div>
                    <div class="profile-order-total">Rs. ${Number(order.total || 0).toFixed(2)}</div>
                </div>

                <div class="profile-order-items">
                    ${(order.items || []).map(item => `
                        <div class="profile-order-item">
                            <div>
                                <strong>${item.name}</strong>
                                <span>${item.category} · Qty ${item.quantity}</span>
                            </div>
                            <strong>${formatPrice(item.price * item.quantity)}</strong>
                        </div>
                    `).join('')}
                </div>

                <div class="profile-order-breakdown">
                    <div class="profile-order-row">
                        <span>Subtotal</span>
                        <span>Rs. ${Number(order.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div class="profile-order-row">
                        <span>Tax (5%)</span>
                        <span>Rs. ${Number(order.tax || 0).toFixed(2)}</span>
                    </div>
                    <div class="profile-order-row">
                        <span>Delivery Charges</span>
                        <span>Rs. ${Number(order.delivery || 0).toFixed(2)}</span>
                    </div>
                    <div class="profile-order-row total">
                        <span>Total Paid</span>
                        <span>Rs. ${Number(order.total || 0).toFixed(2)}</span>
                    </div>
                </div>

                <div class="profile-order-customer">
                    <div><strong>Name:</strong> ${order.name}</div>
                    <div><strong>Phone:</strong> ${order.phone}</div>
                    <div><strong>Address:</strong> ${order.address}</div>
                </div>
            </article>
        `).join('');
    }

    function renderProfileOrders() {
        if (!profileOrdersList) return;

        updateProfileLayout();

        if (!currentUser) {
            profileOrdersList.innerHTML = '';
            return;
        }

        const orders = loadOrderHistory();
        if (!orders.length) {
            profileOrdersList.innerHTML = '<div class="profile-orders-empty">Abhi tak koi order place nahi hua. Menu se order karke history yahan dekh sakte ho.</div>';
            return;
        }

        profileOrdersList.innerHTML = orders.map((order, index) => `
            <details class="profile-order-card"${index === 0 ? ' open' : ''}>
                <summary class="profile-order-summary">
                    <div class="profile-order-summary-main">
                        <h3>Order #${normalizeOrderId(order.orderId)}</h3>
                        <div class="profile-order-meta">
                            <span>${formatOrderDate(order.createdAt)}</span>
                            <span>${order.items?.length || 0} items</span>
                        </div>
                    </div>
                    <div class="profile-order-summary-side">
                        <div class="profile-order-total">Rs. ${Number(order.total || 0).toFixed(2)}</div>
                        <span class="profile-order-toggle" aria-hidden="true">v</span>
                    </div>
                </summary>

                <div class="profile-order-content">
                    <div class="profile-order-section">
                        <div class="profile-order-section-title">Items</div>
                        <div class="profile-order-items">
                            ${(order.items || []).map(item => `
                                <div class="profile-order-item">
                                    <div>
                                        <strong>${item.name}</strong>
                                        <span>${item.category} - Qty ${item.quantity}</span>
                                    </div>
                                    <strong>${formatPrice(item.price * item.quantity)}</strong>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="profile-order-section">
                        <div class="profile-order-section-title">Payment Summary</div>
                        <div class="profile-order-breakdown">
                            <div class="profile-order-row">
                                <span>Subtotal</span>
                                <span>Rs. ${Number(order.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div class="profile-order-row">
                                <span>Tax (5%)</span>
                                <span>Rs. ${Number(order.tax || 0).toFixed(2)}</span>
                            </div>
                            <div class="profile-order-row">
                                <span>Delivery Charges</span>
                                <span>Rs. ${Number(order.delivery || 0).toFixed(2)}</span>
                            </div>
                            <div class="profile-order-row total">
                                <span>Total Paid</span>
                                <span>Rs. ${Number(order.total || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="profile-order-section">
                        <div class="profile-order-section-title">Delivery Details</div>
                        <div class="profile-order-customer">
                            <div><strong>Name:</strong> ${order.name}</div>
                            <div><strong>Phone:</strong> ${order.phone}</div>
                            <div><strong>Address:</strong> ${order.address}</div>
                        </div>
                    </div>
                </div>
            </details>
        `).join('');
    }

    function renderPaymentSummary() {
        const summaryContainer = document.getElementById('payment-summary-items');
        const totalElement = document.getElementById('payment-summary-total');
        if (!summaryContainer || !totalElement) return;

        const pendingOrder = loadPendingOrder();
        if (!pendingOrder) {
            summaryContainer.innerHTML = '<p class="summary-empty">No pending payment found.</p>';
            totalElement.textContent = 'Rs. 0.00';
            return;
        }

        summaryContainer.innerHTML = (pendingOrder.items || []).map(item => `
            <div class="summary-item">
                <div class="summary-item-info">${item.name}<span>(x${item.quantity})</span></div>
                <span class="summary-item-price">${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');

        totalElement.textContent = `Rs. ${Number(pendingOrder.total || 0).toFixed(2)}`;
    }

    function navigateTo(pageId, updateHistory = true) {
        pages.forEach(page => page.classList.remove('active'));

        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
        } else {
            document.getElementById('page-home').classList.add('active');
            pageId = 'home';
        }

        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });

        if (pageId === 'menu' && menuSearchInput && !menuSearchInput.value.trim()) {
            renderMenu(foodData);
        }

        if (updateHistory) {
            const nextHash = `#${pageId}`;
            if (window.location.hash !== nextHash) {
                window.history.pushState({ pageId }, '', nextHash);
            }
        }
        closeMobileNav();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (pageId === 'cart') renderCartPage();
        if (pageId === 'checkout') renderCheckoutSummary();
        if (pageId === 'payment') renderPaymentSummary();
        if (pageId === 'login') renderProfileOrders();
    }

    function openMobileNav() {
        mobileNav.classList.add('open');
        mobileNavOverlay.classList.add('open');
    }

    function closeMobileNav() {
        mobileNav.classList.remove('open');
        mobileNavOverlay.classList.remove('open');
    }

    function formatPrice(price) {
        return `Rs. ${Number(price).toFixed(0)}`;
    }

    function createProductCard(item, animationOptions = null) {
        const card = document.createElement('div');
        card.className = 'product-card card';
        if (animationOptions?.type) {
            card.setAttribute('data-aos', animationOptions.type);
        }
        if (animationOptions?.delay !== undefined) {
            card.setAttribute('data-aos-delay', String(animationOptions.delay));
        }
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" class="product-card-image">
            <div class="product-card-content">
                <h3>${item.name}</h3>
                <span class="category">${item.category}</span>
                <p class="description">${item.description}</p>
                <div class="product-card-footer">
                    <span class="price">${formatPrice(item.price)}</span>
                    <button class="btn btn-small add-to-cart-btn" data-id="${item.id}">Add</button>
                </div>
            </div>
        `;
        return card;
    }

    function renderMenu(items, searchTerm = '') {
        if (!menuGrid) return;
        menuGrid.innerHTML = '';

        if (items.length === 0) {
            renderNoResults(searchTerm);
            return;
        }

        items.forEach(item => menuGrid.appendChild(createProductCard(item)));
    }

    function renderFeatured() {
        if (!featuredGrid) return;
        featuredGrid.innerHTML = '';

        topPickIds
            .map(id => foodData.find(item => item.id === id))
            .filter(Boolean)
            .forEach((item, index) => {
                featuredGrid.appendChild(createProductCard(item, {
                    type: 'foodnow-reveal',
                    delay: index * 90
                }));
            });

        if (window.AOS) {
            window.AOS.refreshHard();
        }
    }

    function renderNoResults(searchTerm) {
        const suggestions = findSuggestions(searchTerm);
        const noResults = document.createElement('div');
        noResults.className = 'menu-no-results';
        noResults.innerHTML = `
            <h3>Sorry, we don't have this at this moment.</h3>
            <p>${suggestions.length ? 'You can try these available items instead.' : 'Please try another food name.'}</p>
        `;
        menuGrid.appendChild(noResults);

        suggestions.forEach(item => menuGrid.appendChild(createProductCard(item)));
    }

    function findSuggestions(searchTerm) {
        const words = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
        if (words.length === 0) return foodData.slice(0, 3);

        const scored = foodData
            .map(item => {
                const haystack = `${item.name} ${item.category} ${item.description} ${item.keywords.join(' ')}`.toLowerCase();
                const score = words.reduce((total, word) => {
                    if (haystack.includes(word)) return total + 2;
                    if (word.length > 3 && haystack.includes(word.slice(0, 4))) return total + 1;
                    return total;
                }, 0);
                return { item, score };
            })
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(result => result.item);

        return (scored.length ? scored : foodData.slice(0, 3)).slice(0, 3);
    }

    function filterMenu(searchTerm) {
        const query = searchTerm.toLowerCase().trim();
        if (!query) {
            renderMenu(foodData);
            return;
        }

        const filteredItems = foodData.filter(item => {
            const searchableText = `${item.name} ${item.category} ${item.description} ${item.keywords.join(' ')}`.toLowerCase();
            return searchableText.includes(query);
        });

        renderMenu(filteredItems, query);
    }

    function addToCart(itemId) {
        const numericItemId = parseInt(itemId, 10);
        const existingItem = cart.find(item => item.id === numericItemId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            const itemToAdd = foodData.find(item => item.id === numericItemId);
            if (itemToAdd) cart.push({ ...itemToAdd, quantity: 1 });
        }

        showToast(existingItem ? 'Quantity updated' : 'Added to cart!');
        saveCartToStorage();
        updateCartUI();
    }

    function updateCartQuantity(itemId, action) {
        const numericItemId = parseInt(itemId, 10);
        const itemInCart = cart.find(item => item.id === numericItemId);
        if (!itemInCart) return;

        if (action === 'increase') itemInCart.quantity++;
        if (action === 'decrease') itemInCart.quantity--;

        if (itemInCart.quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        saveCartToStorage();
        updateCartUI();
    }

    function removeFromCart(itemId) {
        const numericItemId = parseInt(itemId, 10);
        cart = cart.filter(item => item.id !== numericItemId);
        saveCartToStorage();
        updateCartUI();
        if (document.getElementById('page-cart').classList.contains('active')) renderCartPage();
    }

    function saveCartToStorage() {
        localStorage.setItem('foodNowCart', JSON.stringify(cart));
    }

    function calculateTotalPrice() {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(cartCountElement => {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
        });

        if (document.getElementById('page-cart').classList.contains('active')) renderCartPage();
    }

    function clearCart() {
        cart = [];
        saveCartToStorage();
        updateCartUI();
    }

    function renderCartPage() {
        if (cart.length === 0) {
            cartContentWrapper.innerHTML = `
                <div class="empty-cart-message card">
                    <h2>Your cart is empty!</h2>
                    <p>Looks like you haven't added anything yet.</p>
                    <a href="#" class="btn btn-primary nav-link" data-page="menu">Browse Menu</a>
                </div>
            `;
            return;
        }

        const subtotal = calculateTotalPrice();
        const tax = subtotal * 0.05;
        const deliveryFee = 30;
        const total = subtotal + tax + deliveryFee;

        cartContentWrapper.innerHTML = `
            <div class="cart-container">
                <div class="cart-items">
                    ${cart.map(item => `
                        <div class="cart-item card">
                            <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                            <div class="cart-item-info">
                                <h3>${item.name}</h3>
                                <span class="price">${formatPrice(item.price)}</span>
                            </div>
                            <div class="cart-item-actions">
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                                    <span class="quantity-amount">${item.quantity}</span>
                                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                                </div>
                                <a class="cart-item-remove" data-action="remove" data-id="${item.id}">
                                    <svg class="icon" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="cart-summary card">
                    <h3>Bill Details</h3>
                    <div class="summary-row"><span>Item Total</span><span>${formatPrice(subtotal)}</span></div>
                    <div class="summary-row"><span>Delivery Fee</span><span>${formatPrice(deliveryFee)}</span></div>
                    <div class="summary-row"><span>Taxes (5% GST)</span><span>Rs. ${tax.toFixed(2)}</span></div>
                    <div class="summary-row total"><span>To Pay</span><span class="total-price">Rs. ${total.toFixed(2)}</span></div>
                    <a href="#" class="btn btn-primary checkout-btn nav-link" data-page="checkout">Proceed to Checkout</a>
                </div>
            </div>
        `;
    }

    function renderCheckoutSummary() {
        const summaryContainer = document.getElementById('checkout-summary-items');
        const totalElement = document.getElementById('checkout-summary-total');
        if (!summaryContainer || !totalElement) return;

        if (cart.length === 0) {
            summaryContainer.innerHTML = '<p>Your cart is empty.</p>';
            totalElement.textContent = 'Rs. 0.00';
            return;
        }

        summaryContainer.innerHTML = cart.map(item => `
            <div class="summary-item">
                <div class="summary-item-info">${item.name}<span>(x${item.quantity})</span></div>
                <span class="summary-item-price">${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');

        const subtotal = calculateTotalPrice();
        const total = subtotal + subtotal * 0.05 + 30;
        totalElement.textContent = `Rs. ${total.toFixed(2)}`;
    }

    function normalizeOrderId(orderId) {
        const numericOrderId = Number.parseInt(String(orderId).replace(/\D/g, ''), 10);
        if (Number.isNaN(numericOrderId)) {
            return String(Math.floor(Math.random() * 100) + 1);
        }

        return String(Math.min(100, Math.max(1, numericOrderId)));
    }

    function renderOrderSuccessPage(details) {
        document.getElementById('success-order-id').textContent = `#${normalizeOrderId(details.orderId)}`;
        document.getElementById('success-user-name').textContent = details.name;
        document.getElementById('success-user-phone').textContent = details.phone;
        document.getElementById('success-user-address').textContent = details.address;
        document.getElementById('success-total-price').textContent = `Rs. ${details.total}`;
        localStorage.removeItem('foodNowOrderDetails');
    }

    function validateCheckoutForm() {
        let isValid = true;
        const name = document.getElementById('checkout-name').value;
        const phoneInput = document.getElementById('checkout-phone');
        const phone = phoneInput.value;
        const address = document.getElementById('checkout-address').value;
        const nameError = document.getElementById('name-error');
        const phoneError = document.getElementById('phone-error');
        const addressError = document.getElementById('address-error');

        if (phoneInput) {
            phoneInput.value = phone.replace(/\D/g, '').slice(0, 10);
        }

        if (!/^[a-zA-Z\s]+$/.test(name) || name.trim().length === 0) {
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }

        if (!/^\d{10}$/.test(phone)) {
            phoneError.style.display = 'block';
            isValid = false;
        } else {
            phoneError.style.display = 'none';
        }

        if (address.trim().length < 10) {
            addressError.style.display = 'block';
            isValid = false;
        } else {
            addressError.style.display = 'none';
        }

        return isValid;
    }

    function getRandomOrderId() {
        return String(Math.floor(Math.random() * 100) + 1);
    }

    function enforceCheckoutPhoneLimit() {
        const phoneInput = document.getElementById('checkout-phone');
        if (!phoneInput) return;

        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    }

    function enforceProfilePhoneLimit() {
        if (!profilePhone) return;

        profilePhone.value = profilePhone.value.replace(/\D/g, '').slice(0, 10);
    }

    function handleCheckoutSubmit(e) {
        e.preventDefault();
        if (!validateCheckoutForm()) return;

        if (cart.length === 0) {
            showToast('Your cart is empty. Add items to place an order.', 'error');
            return;
        }

        const subtotal = calculateTotalPrice();
        const tax = subtotal * 0.05;
        const delivery = 30;
        const total = (subtotal + tax + delivery).toFixed(2);
        const orderDetails = {
            orderId: getRandomOrderId(),
            name: document.getElementById('checkout-name').value,
            phone: document.getElementById('checkout-phone').value,
            address: document.getElementById('checkout-address').value,
            subtotal,
            tax,
            delivery,
            total,
            items: cart.map(item => ({ ...item })),
            createdAt: new Date().toISOString(),
            paymentMethod: 'UPI',
            paymentStatus: 'pending'
        };

        savePendingOrder(orderDetails);
        navigateTo('payment');
    }

    async function persistOrderToDatabase(orderDetails) {
        if (!firebaseDb) return;

        await addDoc(collection(firebaseDb, 'order'), {
            ...orderDetails,
            userId: currentUser?.uid || '',
            userEmail: currentUser?.email || '',
            paymentMethod: 'UPI',
            paymentStatus: 'paid',
            createdAt: serverTimestamp()
        });
    }

    async function handlePaymentDone() {
        const pendingOrder = loadPendingOrder();
        if (!pendingOrder) {
            showToast('No pending payment found.', 'error');
            navigateTo('checkout');
            return;
        }

        pendingOrder.paymentStatus = 'paid';
        localStorage.setItem('foodNowOrderDetails', JSON.stringify(pendingOrder));
        addOrderToHistory(pendingOrder);
        clearPendingOrder();
        clearCart();
        checkoutForm?.reset();
        navigateTo('order-success');
        renderOrderSuccessPage(pendingOrder);

        try {
            await persistOrderToDatabase(pendingOrder);
        } catch (error) {
            showToast('Order confirmed, but database save failed. Check Firestore rules.', 'error');
        }
    }

    async function handleGoogleAuth() {
        if (!firebaseAuth || !googleProvider) {
            showToast('Firebase config missing. Please fill window.FIREBASE_CONFIG.', 'error');
            return;
        }

        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider);
            await reload(result.user).catch(() => {});
            await ensureUserProfile(result.user);
            const userRef = doc(firebaseDb, 'users', result.user.uid);
            const snap = await getDoc(userRef);
            currentProfile = snap.exists() ? snap.data() : null;
            updateAvatarUI(getAuthPhotoUrl(result.user) || getCurrentAvatarUrl());
            updateAuthUI(isProfileComplete(currentProfile));
            if (!isProfileComplete(currentProfile)) {
                showProfileEditor('complete');
                navigateTo('login');
            } else {
                hideProfileEditor();
                navigateTo('home');
            }
            showToast('Google account connected!');
        } catch (error) {
            showToast(error?.message || 'Google sign in failed.', 'error');
        }
    }

    async function handleProfileSave(e) {
        e.preventDefault();
        if (!firebaseAuth?.currentUser || !firebaseDb) {
            showToast('Please sign in first.', 'error');
            hideProfileEditor();
            navigateTo('home');
            return;
        }

        const name = profileName?.value.trim() || '';
        const phone = (profilePhone?.value || '').replace(/\D/g, '');
        const city = profileCity?.value || '';
        const gender = profileGender?.value || '';

        if (name.length < 2) {
            showToast('Name must be at least 2 characters.', 'error');
            hideProfileEditor();
            navigateTo('home');
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            showToast('Phone number must be exactly 10 digits.', 'error');
            hideProfileEditor();
            navigateTo('home');
            return;
        }

        if (!['Delhi', 'UP'].includes(city)) {
            showToast('City must be Delhi or UP.', 'error');
            hideProfileEditor();
            navigateTo('home');
            return;
        }

        if (!['Male', 'Female'].includes(gender)) {
            showToast('Gender must be Male or Female.', 'error');
            hideProfileEditor();
            navigateTo('home');
            return;
        }

        try {
            const authPhotoURL = getAuthPhotoUrl(firebaseAuth.currentUser);
            const googlePhotoURL = currentProfile?.googlePhotoURL || authPhotoURL || '';
            let avatarUrl = currentProfile?.avatarDataUrl || currentProfile?.avatarUrl || '';
            let photoURL = currentProfile?.photoURL || googlePhotoURL || '';

            if (pendingAvatarDataUrlPromise) {
                avatarUrl = await pendingAvatarDataUrlPromise;
                photoURL = avatarUrl || photoURL;
            } else if (selectedProfilePhotoFile) {
                avatarUrl = await fileToAvatarDataUrl(selectedProfilePhotoFile);
                photoURL = avatarUrl || photoURL;
            }

            await setDoc(doc(firebaseDb, 'users', firebaseAuth.currentUser.uid), {
                uid: firebaseAuth.currentUser.uid,
                email: firebaseAuth.currentUser.email || '',
                displayName: firebaseAuth.currentUser.displayName || '',
                googlePhotoURL,
                photoURL,
                avatarUrl,
                avatarDataUrl: avatarUrl,
                name,
                phone,
                city,
                gender,
                updatedAt: serverTimestamp()
            }, { merge: true });

            currentProfile = {
                ...(currentProfile || {}),
                uid: firebaseAuth.currentUser.uid,
                email: firebaseAuth.currentUser.email || '',
                displayName: firebaseAuth.currentUser.displayName || '',
                googlePhotoURL,
                photoURL,
                avatarUrl,
                avatarDataUrl: avatarUrl,
                name,
                phone,
                city,
                gender
            };
            selectedProfilePhotoFile = null;
            pendingAvatarDataUrlPromise = null;
            revokeActiveProfilePreviewObjectUrl();
            if (profilePhotoInput) profilePhotoInput.value = '';
            updateAvatarUI(avatarUrl || googlePhotoURL || photoURL);
            updateAvatarPreview(avatarUrl || googlePhotoURL || photoURL);
            updateAuthUI(true);
            if (profileStatus) {
                profileStatus.textContent = 'Profile saved. You are ready to use the site.';
                profileStatus.hidden = false;
            }
            showToast('Profile saved!');
            hideProfileEditor();
            navigateTo('home');
        } catch (error) {
            showToast(error?.message || 'Profile save failed.', 'error');
            hideProfileEditor();
            navigateTo('home');
        }
    }

    async function handleContactSubmit(e) {
        e.preventDefault();

        if (!firebaseDb) {
            showToast('Firebase config missing. Contact message save nahi ho paaya.', 'error');
            return;
        }

        const name = document.getElementById('contact-name')?.value.trim() || '';
        const email = document.getElementById('contact-email')?.value.trim() || '';
        const message = document.getElementById('contact-message')?.value.trim() || '';

        if (!name || !email || !message) {
            showToast('Please fill name, email and message.', 'error');
            return;
        }

        try {
            await addDoc(collection(firebaseDb, 'messages'), {
                name,
                email,
                message,
                userId: currentUser?.uid || '',
                createdAt: serverTimestamp()
            });

            contactForm?.reset();
            showToast("Thanks for feedback , we'll contact soon!");
        } catch (error) {
            showToast(error?.message || 'Message save failed.', 'error');
        }
    }

    function setupEventListeners() {
        document.body.addEventListener('click', e => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                const pageId = navLink.dataset.page;

                if (pageId) {
                    if (navLink.classList.contains('login-btn')) {
                        if (navLink.dataset.action === 'logout') {
                            if (firebaseAuth) signOut(firebaseAuth).catch(() => {});
                        } else {
                            navigateTo('login');
                        }
                        return;
                    }
                    if (navLink.dataset.category) {
                        const category = navLink.dataset.category;
                        menuSearchInput.value = category;
                        filterMenu(category);
                        navigateTo('menu');
                    } else if (navLink.id === 'profile-icon-link' || navLink.classList.contains('profile-icon-link')) {
                        navigateTo('login');
                        if (currentUser) {
                            if (isProfileComplete(currentProfile)) {
                                showProfileEditor('edit');
                            } else {
                                showProfileEditor('complete');
                            }
                        }
                    } else {
                        if (pageId === 'menu') {
                            menuSearchInput.value = '';
                            renderMenu(foodData);
                        }
                        navigateTo(pageId);
                    }
                }
            }

            const mobileNavLink = e.target.closest('.mobile-nav-link');
            if (mobileNavLink) {
                e.preventDefault();
                const pageId = mobileNavLink.dataset.page;
                if (mobileNavLink.classList.contains('login-btn')) {
                    if (mobileNavLink.dataset.action === 'logout') {
                        if (firebaseAuth) signOut(firebaseAuth).catch(() => {});
                    } else {
                        navigateTo('login');
                    }
                    return;
                }
                if (pageId === 'menu') {
                    menuSearchInput.value = '';
                    renderMenu(foodData);
                }
                if (mobileNavLink.id === 'profile-icon-link' || mobileNavLink.classList.contains('profile-icon-link')) {
                    navigateTo('login');
                    if (currentUser) {
                        if (isProfileComplete(currentProfile)) {
                            showProfileEditor('edit');
                        } else {
                            showProfileEditor('complete');
                        }
                    }
                    return;
                }
                if (pageId) navigateTo(pageId);
            }

            const cartIcon = e.target.closest('.cart-icon');
            if (cartIcon) {
                e.preventDefault();
                navigateTo('cart');
            }
        });

        hamburger.addEventListener('click', openMobileNav);
        mobileNavClose.addEventListener('click', closeMobileNav);
        mobileNavOverlay.addEventListener('click', closeMobileNav);

        menuSearchInput.addEventListener('input', () => filterMenu(menuSearchInput.value));

        heroSearchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const searchTerm = heroSearchInput.value;
                menuSearchInput.value = searchTerm;
                filterMenu(searchTerm);
                navigateTo('menu');
            }
        });

        menuGrid.addEventListener('click', e => {
            const btn = e.target.closest('.add-to-cart-btn');
            if (btn) {
                e.preventDefault();
                addToCart(btn.dataset.id);
            }
        });

        featuredGrid.addEventListener('click', e => {
            const btn = e.target.closest('.add-to-cart-btn');
            if (btn) {
                e.preventDefault();
                addToCart(btn.dataset.id);
            }
        });

        cartContentWrapper.addEventListener('click', e => {
            const quantityBtn = e.target.closest('.quantity-btn');
            if (quantityBtn) {
                e.preventDefault();
                updateCartQuantity(quantityBtn.dataset.id, quantityBtn.dataset.action);
                return;
            }

            const removeBtn = e.target.closest('.cart-item-remove');
            if (removeBtn) {
                e.preventDefault();
                removeFromCart(removeBtn.dataset.id);
            }
        });

        if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckoutSubmit);
        paymentDoneBtn?.addEventListener('click', handlePaymentDone);
        if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
        document.getElementById('checkout-phone')?.addEventListener('input', enforceCheckoutPhoneLimit);
        profilePhone?.addEventListener('input', enforceProfilePhoneLimit);

        pageGoogleAuthBtn?.addEventListener('click', handleGoogleAuth);
        headerLogoutBtn?.addEventListener('click', () => {
            if (firebaseAuth) signOut(firebaseAuth).catch(() => {});
        });
        profileCardLogoutBtn?.addEventListener('click', () => {
            if (firebaseAuth) signOut(firebaseAuth).catch(() => {});
        });
        if (profileForm) profileForm.noValidate = true;
        profileForm?.addEventListener('submit', handleProfileSave);
        profilePhotoInput?.addEventListener('change', e => {
            const file = e.target.files?.[0] || null;
            selectedProfilePhotoFile = file;
            pendingAvatarDataUrlPromise = null;
            revokeActiveProfilePreviewObjectUrl();
            if (file) {
                pendingAvatarDataUrlPromise = fileToAvatarDataUrl(file)
                    .then((url) => {
                        updateAvatarPreview(url);
                        updateAvatarUI(url);
                        return url;
                    })
                    .catch((error) => {
                        pendingAvatarDataUrlPromise = null;
                        showToast(error?.message || 'Avatar processing failed.', 'error');
                        throw error;
                    });
                const localPreview = URL.createObjectURL(file);
                activeProfilePreviewObjectUrl = localPreview;
                updateAvatarPreview(localPreview);
                updateAvatarUI(localPreview);
                updateProfileCardSummary(localPreview);
            } else {
                updateAvatarPreview(getCurrentAvatarUrl());
                updateAvatarUI(getCurrentAvatarUrl());
                updateProfileCardSummary();
            }
        });

        profileAvatarImage?.addEventListener('error', () => {
            profileAvatarImage.removeAttribute('src');
            profileAvatarImage.style.display = 'none';
        });

        window.addEventListener('popstate', () => {
            const pageId = window.location.hash.substring(1) || 'home';
            navigateTo(pageId, false);
        });
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    init();
});
