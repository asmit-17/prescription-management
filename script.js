// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVpNLC9RjQ3JJvwI58Ui8thweO5kQ394Y",
    authDomain: "prescription-management-846f6.firebaseapp.com",
    projectId: "prescription-management-846f6",
    storageBucket: "prescription-management-846f6.firebasestorage.app",
    messagingSenderId: "906142061841",
    appId: "1:906142061841:web:9f547e95f1872f546f28b0",
    measurementId: "G-JWKDJ0BED7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const signupLink = document.getElementById('signupLink');
const loginLink = document.getElementById('loginLink');
const togglePassword = document.getElementById('togglePassword');
const toggleSignupPassword = document.getElementById('toggleSignupPassword');
const passwordInput = document.getElementById('password');
const signupPasswordInput = document.getElementById('signupPassword');
const googleLogin = document.getElementById('googleLogin');
const facebookLogin = document.getElementById('facebookLogin');
const signupSubmit = document.getElementById('signupSubmit');
const alertBox = document.getElementById('alertBox');

// Toggle between login and signup forms
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});



loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});



// Dark Mode Toggle Functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved user preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// Listen for toggle changes
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});

// ====== IMAGE SWITCHING CODE ======
const lightImage = document.querySelector('.light-image');
const darkImage = document.querySelector('.dark-image');

// Set initial image based on current theme
if (currentTheme === 'dark') {
    lightImage.classList.add('hidden');
    darkImage.classList.remove('hidden');
}

// Update images when toggle changes
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        lightImage.classList.add('hidden');
        darkImage.classList.remove('hidden');
    } else {
        lightImage.classList.remove('hidden');
        darkImage.classList.add('hidden');
    }
});
// ====== END OF IMAGE SWITCHING CODE ======

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye-slash');
});

toggleSignupPassword.addEventListener('click', () => {
    const type = signupPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    signupPasswordInput.setAttribute('type', type);
    toggleSignupPassword.classList.toggle('fa-eye-slash');
});

// Show alert message
function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = 'alert show ' + type;
    
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 5000);
}

// Validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Update password requirements UI
    document.getElementById('req-length').classList.toggle('valid', requirements.length);
    document.getElementById('req-uppercase').classList.toggle('valid', requirements.uppercase);
    document.getElementById('req-lowercase').classList.toggle('valid', requirements.lowercase);
    document.getElementById('req-number').classList.toggle('valid', requirements.number);
    document.getElementById('req-special').classList.toggle('valid', requirements.special);
    
    return Object.values(requirements).every(Boolean);
}

// Real-time validation for login form
document.getElementById('email').addEventListener('input', (e) => {
    const email = e.target.value;
    const errorElement = document.getElementById('emailError');
    const inputContainer = e.target.parentElement;
    
    if (email === '') {
        errorElement.textContent = '';
        inputContainer.classList.remove('error', 'success');
        return;
    }
    
    if (!validateEmail(email)) {
        errorElement.textContent = 'Please enter a valid email address (e.g., user@example.com)';
        inputContainer.classList.add('error');
        inputContainer.classList.remove('success');
    } else {
        errorElement.textContent = '';
        inputContainer.classList.add('success');
        inputContainer.classList.remove('error');
    }
});

document.getElementById('password').addEventListener('input', (e) => {
    const password = e.target.value;
    const errorElement = document.getElementById('passwordError');
    const inputContainer = e.target.parentElement;
    
    if (password === '') {
        errorElement.textContent = '';
        inputContainer.classList.remove('error', 'success');
        return;
    }
    
    if (password.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters';
        inputContainer.classList.add('error');
        inputContainer.classList.remove('success');
    } else {
        errorElement.textContent = '';
        inputContainer.classList.add('success');
        inputContainer.classList.remove('error');
    }
});

// Real-time validation for signup form
document.getElementById('signupName').addEventListener('input', (e) => {
    const name = e.target.value;
    const errorElement = document.getElementById('nameError');
    const inputContainer = e.target.parentElement;
    
    if (name === '') {
        errorElement.textContent = '';
        inputContainer.classList.remove('error', 'success');
        return;
    }
    
    if (name.length < 2) {
        errorElement.textContent = 'Name must be at least 2 characters';
        inputContainer.classList.add('error');
        inputContainer.classList.remove('success');
    } else {
        errorElement.textContent = '';
        inputContainer.classList.add('success');
        inputContainer.classList.remove('error');
    }
});

document.getElementById('signupEmail').addEventListener('input', (e) => {
    const email = e.target.value;
    const errorElement = document.getElementById('signupEmailError');
    const inputContainer = e.target.parentElement;
    
    if (email === '') {
        errorElement.textContent = '';
        inputContainer.classList.remove('error', 'success');
        return;
    }
    
    if (!validateEmail(email)) {
        errorElement.textContent = 'Please enter a valid email address (e.g., user@example.com)';
        inputContainer.classList.add('error');
        inputContainer.classList.remove('success');
    } else {
        errorElement.textContent = '';
        inputContainer.classList.add('success');
        inputContainer.classList.remove('error');
    }
});

document.getElementById('signupPassword').addEventListener('input', (e) => {
    const password = e.target.value;
    const errorElement = document.getElementById('signupPasswordError');
    const inputContainer = e.target.parentElement;
    
    if (password === '') {
        errorElement.textContent = '';
        inputContainer.classList.remove('error', 'success');
        return;
    }
    
    if (!validatePassword(password)) {
        errorElement.textContent = 'Password does not meet requirements';
        inputContainer.classList.add('error');
        inputContainer.classList.remove('success');
    } else {
        errorElement.textContent = '';
        inputContainer.classList.add('success');
        inputContainer.classList.remove('error');
    }
});

document.getElementById('confirmPassword').addEventListener('input', (e) => {
    const confirmPassword = e.target.value;
    const password = document.getElementById('signupPassword').value;
    const errorElement = document.getElementById('confirmPasswordError');
    const inputContainer = e.target.parentElement;
    
    if (confirmPassword === '') {
        errorElement.textContent = '';
        inputContainer.classList.remove('error', 'success');
        return;
    }
    
    if (confirmPassword !== password) {
        errorElement.textContent = 'Passwords do not match';
        inputContainer.classList.add('error');
        inputContainer.classList.remove('success');
    } else {
        errorElement.textContent = '';
        inputContainer.classList.add('success');
        inputContainer.classList.remove('error');
    }
});

// Login with email and password
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate before submission
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        document.getElementById('email').focus();
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        document.getElementById('password').focus();
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            showAlert('Login successful!', 'success');
            // Redirect to dashboard after successful login
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            showAlert(errorMessage, 'error');
        });
});

// Sign up with email and password
signupSubmit.addEventListener('click', () => {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate before submission
    if (name.length < 2) {
        showAlert('Name must be at least 2 characters', 'error');
        document.getElementById('signupName').focus();
        return;
    }
    
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        document.getElementById('signupEmail').focus();
        return;
    }
    
    if (!validatePassword(password)) {
        showAlert('Password does not meet requirements', 'error');
        document.getElementById('signupPassword').focus();
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        document.getElementById('confirmPassword').focus();
        return;
    }
    
    if (!document.getElementById('agreeTerms').checked) {
        showAlert('You must agree to the terms and conditions', 'error');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            
            // Update user profile with display name
            return user.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            showAlert('Account created successfully!', 'success');
            // Redirect to dashboard after successful signup
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            showAlert(errorMessage, 'error');
        });
});

// Google login
googleLogin.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            // This gives you a Google Access Token
            const credential = result.credential;
            const token = credential.accessToken;
            const user = result.user;
            
            showAlert('Google login successful!', 'success');
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            showAlert(errorMessage, 'error');
        });
});

// Facebook login
facebookLogin.addEventListener('click', () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            // This gives you a Facebook Access Token
            const credential = result.credential;
            const token = credential.accessToken;
            const user = result.user;
            
            showAlert('Facebook login successful!', 'success');
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            showAlert(errorMessage, 'error');
        });
});

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});