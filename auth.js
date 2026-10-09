// auth.js - Authentication logic with console logs for debugging

import { Auth, RouteGuard } from './app.js';

console.log('Auth module loaded');

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function showMessage(message, type = 'error') {
    const messageEl = document.getElementById('authMessage');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
        messageEl.style.display = 'block';
        console.log(`Message: ${message} (${type})`);
    }
}

function hideMessage() {
    const messageEl = document.getElementById('authMessage');
    if (messageEl) {
        messageEl.style.display = 'none';
    }
}

function setLoading(button, isLoading) {
    if (button) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            // Restore original text if needed
        }
    }
}

// ==========================================
// PASSWORD VISIBILITY TOGGLE
// ==========================================

document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.closest('.input-icon').querySelector('input');
        if (input) {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        }
    });
});

// ==========================================
// LOGIN FORM HANDLER
// ==========================================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    console.log('Login form found');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        hideMessage();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = this.querySelector('button[type="submit"]');

        console.log('Email:', email);

        if (!email || !password) {
            showMessage('Please fill in all fields');
            return;
        }

        setLoading(submitBtn, true);

        try {
            console.log('Attempting login...');
            const result = await Auth.signIn(email, password);
            console.log('Login result:', result);
            
            if (result.success) {
                showMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showMessage(result.error);
                setLoading(submitBtn, false);
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage(error.message);
            setLoading(submitBtn, false);
        }
    });
} else {
    console.warn('Login form not found on this page');
}

// ==========================================
// SIGNUP FORM HANDLER
// ==========================================

const signupForm = document.getElementById('signupForm');
if (signupForm) {
    console.log('Signup form found');
    
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Signup form submitted');
        hideMessage();

        const displayName = document.getElementById('displayName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsCheck = document.getElementById('termsCheck');
        const submitBtn = this.querySelector('button[type="submit"]');

        if (!displayName || !email || !password || !confirmPassword) {
            showMessage('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match');
            return;
        }

        if (termsCheck && !termsCheck.checked) {
            showMessage('Please agree to the Terms of Service');
            return;
        }

        setLoading(submitBtn, true);

        try {
            console.log('Attempting signup...');
            const result = await Auth.signUp(email, password, displayName);
            console.log('Signup result:', result);
            
            if (result.success) {
                showMessage('Account created! Please verify your email. Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showMessage(result.error);
                setLoading(submitBtn, false);
            }
        } catch (error) {
            console.error('Signup error:', error);
            showMessage(error.message);
            setLoading(submitBtn, false);
        }
    });
} else {
    console.warn('Signup form not found on this page');
}

// ==========================================
// GOOGLE SIGN IN
// ==========================================

document.querySelectorAll('#googleSignIn').forEach(button => {
    button.addEventListener('click', async function() {
        console.log('Google sign in clicked');
        hideMessage();
        setLoading(this, true);

        try {
            const result = await Auth.signInWithGoogle();
            console.log('Google sign in result:', result);
            
            if (result.success) {
                showMessage('Sign in successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showMessage(result.error);
                setLoading(this, false);
            }
        } catch (error) {
            console.error('Google sign in error:', error);
            showMessage(error.message);
            setLoading(this, false);
        }
    });
});

// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotLink = document.getElementById('forgotPassword');
if (forgotLink) {
    forgotLink.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        
        if (!email) {
            showMessage('Please enter your email address first');
            return;
        }

        const confirmed = confirm(`Send password reset email to ${email}?`);
        if (!confirmed) return;

        try {
            const result = await Auth.resetPassword(email);
            if (result.success) {
                showMessage('Password reset email sent! Check your inbox.', 'success');
            } else {
                showMessage(result.error);
            }
        } catch (error) {
            showMessage(error.message);
        }
    });
}

// ==========================================
// AUTH STATE OBSERVER
// ==========================================

Auth.onAuthStateChanged((user) => {
    const currentPage = RouteGuard.getCurrentPage();
    console.log('Auth state changed. User:', user ? user.email : 'null', 'Page:', currentPage);
    
    // If user is logged in and on login or signup page, redirect to home
    if (user && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        console.log('Redirecting from auth page to home');
        window.location.href = 'index.html';
    }
});