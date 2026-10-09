// profile.js - Profile management

import { Auth } from './app.js';

// ==========================================
// DOM Elements
// ==========================================

const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileStatus = document.getElementById('profileStatus');
const avatarInitial = document.getElementById('avatarInitial');
const avatarCircle = document.getElementById('avatarCircle');

const displayNameInput = document.getElementById('displayName');
const emailInput = document.getElementById('email');
const accountCreatedInput = document.getElementById('accountCreated');

const profileForm = document.getElementById('profileForm');
const updateBtn = document.getElementById('updateProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');

const messageEl = document.getElementById('profileMessage');

// ==========================================
// Helper Functions
// ==========================================

function showMessage(message, type = 'error') {
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `profile-message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

function hideMessage() {
    if (messageEl) {
        messageEl.style.display = 'none';
    }
}

function setLoading(button, isLoading) {
    if (button) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
}

function getInitial(name) {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
}

function getAvatarColor(name) {
    const colors = [
        '#3157e1', '#079669', '#e88b12', '#7c3aed', 
        '#db2777', '#dc4444', '#0891b2', '#059669'
    ];
    
    if (!name) return colors[0];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

// ==========================================
// Load User Profile
// ==========================================

function loadProfile(user) {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const displayName = user.displayName || user.email || 'User';
    const email = user.email || 'No email';
    const photoURL = user.photoURL || null;
    
    // Update UI
    profileName.textContent = displayName;
    profileEmail.textContent = email;
    avatarInitial.textContent = getInitial(displayName);
    
    // Set avatar color
    avatarCircle.style.background = `linear-gradient(135deg, ${getAvatarColor(displayName)}, ${getAvatarColor(displayName + 'light')})`;
    
    // Email verification status
    if (user.emailVerified) {
        profileStatus.textContent = '✓ Email Verified';
        profileStatus.className = 'profile-badge verified';
    } else {
        profileStatus.textContent = '⚠️ Email Not Verified';
        profileStatus.className = 'profile-badge unverified';
    }
    
    // Form fields
    displayNameInput.value = displayName;
    emailInput.value = email;
    
    // Account creation date
    if (user.metadata && user.metadata.creationTime) {
        const created = new Date(user.metadata.creationTime);
        accountCreatedInput.value = created.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}

// ==========================================
// Auth State Observer
// ==========================================

Auth.onAuthStateChanged((user) => {
    if (user) {
        loadProfile(user);
    } else {
        window.location.href = 'login.html';
    }
});

// ==========================================
// Update Profile
// ==========================================

profileForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideMessage();
    
    const newName = displayNameInput.value.trim();
    const currentUser = Auth.getCurrentUser();
    
    if (!currentUser) {
        showMessage('You must be logged in to update your profile');
        return;
    }
    
    if (!newName) {
        showMessage('Please enter a display name');
        return;
    }
    
    setLoading(updateBtn, true);
    
    try {
        const result = await Auth.updateUserProfile(newName, null);
        
        if (result.success) {
            showMessage('Profile updated successfully!', 'success');
            // Update UI
            profileName.textContent = newName;
            avatarInitial.textContent = getInitial(newName);
            avatarCircle.style.background = `linear-gradient(135deg, ${getAvatarColor(newName)}, ${getAvatarColor(newName + 'light')})`;
        } else {
            showMessage(result.error);
        }
    } catch (error) {
        showMessage(error.message);
    } finally {
        setLoading(updateBtn, false);
    }
});

// ==========================================
// Logout
// ==========================================

logoutBtn.addEventListener('click', async function() {
    if (confirm('Are you sure you want to logout?')) {
        const result = await Auth.signOut();
        if (result.success) {
            window.location.href = 'login.html';
        } else {
            showMessage(result.error);
        }
    }
});

// ==========================================
// Reset Password
// ==========================================

resetPasswordBtn.addEventListener('click', async function() {
    const user = Auth.getCurrentUser();
    if (!user || !user.email) {
        showMessage('No email address found');
        return;
    }
    
    if (confirm(`Send password reset email to ${user.email}?`)) {
        const result = await Auth.resetPassword(user.email);
        if (result.success) {
            showMessage('Password reset email sent! Check your inbox.', 'success');
        } else {
            showMessage(result.error);
        }
    }
});