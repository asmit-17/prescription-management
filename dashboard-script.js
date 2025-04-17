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
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const userAvatar = document.getElementById('userAvatar');
const welcomeUserName = document.getElementById('welcomeUserName');
const currentDate = document.getElementById('currentDate');
const activeMedsCount = document.getElementById('activeMedsCount');
const takenTodayCount = document.getElementById('takenTodayCount');
const upcomingDosesCount = document.getElementById('upcomingDosesCount');
const renewalNeededCount = document.getElementById('renewalNeededCount');
const medicationCards = document.getElementById('medicationCards');
const addMedBtn = document.getElementById('addMedBtn');
const addFirstMedBtn = document.getElementById('addFirstMedBtn');
const upcomingList = document.getElementById('upcomingList');
const renewalCards = document.getElementById('renewalCards');
const timeFilter = document.getElementById('timeFilter');
const chartFilter = document.getElementById('chartFilter');
const addMedModal = document.getElementById('addMedModal');
const closeMedModal = document.getElementById('closeMedModal');
const cancelMedBtn = document.getElementById('cancelMedBtn');
const medicationForm = document.getElementById('medicationForm');
const medFrequency = document.getElementById('medFrequency');
const customTimesContainer = document.getElementById('customTimesContainer');
const addTimeBtn = document.getElementById('addTimeBtn');
const medPrescription = document.getElementById('medPrescription');
const fileInfo = document.getElementById('fileInfo');
const reminderModal = document.getElementById('reminderModal');
const closeReminderModal = document.getElementById('closeReminderModal');
const reminderMedName = document.getElementById('reminderMedName');
const reminderMedDosage = document.getElementById('reminderMedDosage');
const reminderTime = document.getElementById('reminderTime');
const markTakenBtn = document.getElementById('markTakenBtn');
const markMissedBtn = document.getElementById('markMissedBtn');
const snoozeBtn = document.getElementById('snoozeBtn');
const confirmModal = document.getElementById('confirmModal');
const closeConfirmModal = document.getElementById('closeConfirmModal');
const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
const proceedConfirmBtn = document.getElementById('proceedConfirmBtn');
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');
const alertBox = document.getElementById('alertBox');
const darkModeToggle = document.getElementById('darkModeToggle');

// Global Variables
let currentUser = null;
let medications = [];
let upcomingDoses = [];
let renewalAlerts = [];
let adherenceData = {};
let currentReminder = null;
let confirmAction = null;
let fileToUpload = null;

// Initialize the dashboard
function initDashboard() {
    setupEventListeners();
    checkAuthState();
    setupDarkMode();
    updateCurrentDate();
    
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('ServiceWorker registration successful');
            }).catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
}

// Set up event listeners
function setupEventListeners() {
    // Sidebar toggle
    menuToggle.addEventListener('click', toggleSidebar);
    
    // Logout button
    logoutBtn.addEventListener('click', logoutUser);
    
    // Add medication buttons
    addMedBtn.addEventListener('click', openAddMedModal);
    addFirstMedBtn.addEventListener('click', openAddMedModal);
    
    // Medication form
    medFrequency.addEventListener('change', handleFrequencyChange);
    addTimeBtn.addEventListener('click', addCustomTimeInput);
    medPrescription.addEventListener('change', handleFileUpload);
    medicationForm.addEventListener('submit', saveMedication);
    
    // Modal controls
    closeMedModal.addEventListener('click', closeAddMedModal);
    cancelMedBtn.addEventListener('click', closeAddMedModal);
    closeReminderModal.addEventListener('click', closeReminder);
    closeConfirmModal.addEventListener('click', closeConfirmation);
    cancelConfirmBtn.addEventListener('click', closeConfirmation);
    
    // Reminder actions
    markTakenBtn.addEventListener('click', () => handleReminderAction('taken'));
    markMissedBtn.addEventListener('click', () => handleReminderAction('missed'));
    snoozeBtn.addEventListener('click', snoozeReminder);
    
    // Filters
    timeFilter.addEventListener('change', filterUpcomingDoses);
    chartFilter.addEventListener('change', updateAdherenceChart);
    
    // Dark mode toggle
    darkModeToggle.addEventListener('change', toggleDarkMode);
}

// Check authentication state
function checkAuthState() {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            updateUserProfile(user);
            loadUserData();
            setupReminders();
        } else {
            // User is signed out, redirect to login
            window.location.href = 'index.html';
        }
    });
}

// Update user profile in the header
function updateUserProfile(user) {
    userName.textContent = user.displayName || user.email;
    welcomeUserName.textContent = user.displayName || 'User';
    
    if (user.photoURL) {
        userAvatar.src = user.photoURL;
    } else {
        // Use placeholder avatar with initials
        const initials = user.displayName ? 
            user.displayName.split(' ').map(n => n[0]).join('') : 
            user.email[0].toUpperCase();
        userAvatar.src = `https://via.placeholder.com/40/4a6fa5/ffffff?text=${initials}`;
    }
}

// Load user data from Firestore
function loadUserData() {
    if (!currentUser) return;
    
    // Load medications
    db.collection('users').doc(currentUser.uid).collection('medications')
        .where('status', '==', 'active')
        .onSnapshot(snapshot => {
            medications = [];
            snapshot.forEach(doc => {
                medications.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            updateMedicationCards();
            updateQuickStats();
            generateUpcomingDoses();
            checkForRenewals();
        });
    
    // Load adherence data
    db.collection('users').doc(currentUser.uid).collection('adherence')
        .doc('weekly')
        .onSnapshot(doc => {
            if (doc.exists) {
                adherenceData = doc.data();
                updateAdherenceChart();
            }
        });
}

// Update medication cards in the UI
function updateMedicationCards() {
    if (medications.length === 0) {
        medicationCards.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-prescription-bottle-alt"></i>
                <p>No medications added yet</p>
                <button class="add-med-btn" id="addFirstMedBtn">
                    <i class="fas fa-plus"></i> Add Your First Medication
                </button>
            </div>
        `;
        
        document.getElementById('addFirstMedBtn').addEventListener('click', openAddMedModal);
        return;
    }
    
    medicationCards.innerHTML = '';
    
    medications.forEach(med => {
        const nextDose = getNextDose(med);
        const status = getMedicationStatus(med);
        
        const medCard = document.createElement('div');
        medCard.className = 'med-card';
        medCard.innerHTML = `
            <div class="med-card-header">
                <div>
                    <div class="med-name">${med.name}</div>
                    <div class="med-dosage">${med.dosage} ${med.form}</div>
                </div>
                <div class="med-actions">
                    <button class="med-action-btn edit-btn" data-id="${med.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="med-action-btn delete-btn" data-id="${med.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="med-schedule">
                <div class="schedule-item">
                    <i class="fas fa-sync-alt"></i>
                    <span>${formatFrequency(med.frequency)}</span>
                </div>
                <div class="schedule-item next-dose">
                    <i class="fas fa-bell"></i>
                    <span>Next dose: ${nextDose ? formatTime(nextDose) : 'No upcoming doses'}</span>
                </div>
            </div>
            <div class="med-footer">
                <span class="med-status ${status.class}">${status.text}</span>
                ${nextDose ? `<button class="take-btn" data-id="${med.id}">Take Now</button>` : ''}
            </div>
        `;
        
        medicationCards.appendChild(medCard);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => editMedication(e.target.closest('button').dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => confirmDeleteMedication(e.target.closest('button').dataset.id));
    });
    
    document.querySelectorAll('.take-btn').forEach(btn => {
        btn.addEventListener('click', (e) => showReminderForMedication(e.target.closest('button').dataset.id));
    });
}

// Update quick stats cards
function updateQuickStats() {
    activeMedsCount.textContent = medications.length;
    
    // Calculate taken today (simplified for demo)
    const takenToday = medications.reduce((count, med) => {
        return count + (med.lastTaken && isToday(new Date(med.lastTaken)) ? 1 : 0);
    }, 0);
    takenTodayCount.textContent = takenToday;
    
    // Calculate upcoming doses
    upcomingDosesCount.textContent = upcomingDoses.length;
    
    // Calculate renewals needed (simplified for demo)
    const renewalNeeded = medications.reduce((count, med) => {
        return count + (getMedicationStatus(med).class === 'danger' ? 1 : 0);
    }, 0);
    renewalNeededCount.textContent = renewalNeeded;
}

// Generate upcoming doses list
function generateUpcomingDoses() {
    upcomingDoses = [];
    
    medications.forEach(med => {
        const nextDose = getNextDose(med);
        if (nextDose) {
            upcomingDoses.push({
                medicationId: med.id,
                name: med.name,
                dosage: med.dosage,
                time: nextDose,
                form: med.form
            });
        }
    });
    
    // Sort by time
    upcomingDoses.sort((a, b) => a.time - b.time);
    
    filterUpcomingDoses();
}

// Filter upcoming doses based on selected time filter
function filterUpcomingDoses() {
    const filter = timeFilter.value;
    let filteredDoses = [...upcomingDoses];
    const now = new Date();
    
    if (filter === 'today') {
        filteredDoses = filteredDoses.filter(dose => isSameDay(dose.time, now));
    } else if (filter === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        filteredDoses = filteredDoses.filter(dose => isSameDay(dose.time, tomorrow));
    } else if (filter === 'week') {
        const endOfWeek = new Date();
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        filteredDoses = filteredDoses.filter(dose => dose.time <= endOfWeek);
    }
    
    updateUpcomingDosesList(filteredDoses);
}

// Update upcoming doses list in the UI
function updateUpcomingDosesList(doses) {
    if (doses.length === 0) {
        upcomingList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clock"></i>
                <p>No upcoming doses scheduled</p>
            </div>
        `;
        return;
    }
    
    upcomingList.innerHTML = '';
    
    doses.forEach(dose => {
        const doseItem = document.createElement('div');
        doseItem.className = 'upcoming-item';
        doseItem.innerHTML = `
            <div class="upcoming-time">${formatTime(dose.time)}</div>
            <div class="upcoming-med">
                <div class="upcoming-med-name">${dose.name}</div>
                <div class="upcoming-med-dosage">${dose.dosage} ${dose.form}</div>
            </div>
            <button class="upcoming-action" data-id="${dose.medicationId}">
                <i class="fas fa-bell"></i>
            </button>
        `;
        
        upcomingList.appendChild(doseItem);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.upcoming-action').forEach(btn => {
        btn.addEventListener('click', (e) => showReminderForMedication(e.target.closest('button').dataset.id));
    });
}

// Check for medications needing renewal
function checkForRenewals() {
    renewalAlerts = [];
    const now = new Date();
    
    medications.forEach(med => {
        if (med.endDate) {
            const endDate = new Date(med.endDate);
            const daysRemaining = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));
            
            if (daysRemaining <= 7) {
                renewalAlerts.push({
                    medicationId: med.id,
                    name: med.name,
                    dosage: med.dosage,
                    form: med.form,
                    endDate: med.endDate,
                    daysRemaining: daysRemaining,
                    status: daysRemaining <= 3 ? 'danger' : 'warning'
                });
            }
        }
    });
    
    updateRenewalAlerts();
}

// Update renewal alerts in the UI
function updateRenewalAlerts() {
    if (renewalAlerts.length === 0) {
        renewalCards.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>No renewals needed at this time</p>
            </div>
        `;
        return;
    }
    
    renewalCards.innerHTML = '';
    
    renewalAlerts.forEach(alert => {
        const alertCard = document.createElement('div');
        alertCard.className = `renewal-card ${alert.status}`;
        alertCard.innerHTML = `
            <div class="renewal-med">
                <div class="renewal-med-name">${alert.name}</div>
                <div class="renewal-med-info">${alert.dosage} ${alert.form} • Ends ${formatDate(alert.endDate)}</div>
            </div>
            <div class="renewal-status">
                ${alert.daysRemaining > 0 ? `${alert.daysRemaining} days left` : 'Expired'}
            </div>
            <button class="renewal-btn">Request Renewal</button>
        `;
        
        renewalCards.appendChild(alertCard);
    });
    
    // Add event listeners to renewal buttons
    document.querySelectorAll('.renewal-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => requestRenewal(renewalAlerts[index].medicationId));
    });
}

// Update adherence chart
function updateAdherenceChart() {
    const ctx = document.getElementById('adherenceChart').getContext('2d');
    const filter = chartFilter.value;
    let data = {};
    let labels = [];
    let values = [];
    
    if (filter === 'week') {
        data = adherenceData.weekly || {};
        labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        values = labels.map((_, i) => data[i] || 0);
    } else if (filter === 'month') {
        // Simplified for demo - would normally get monthly data
        data = adherenceData.weekly || {};
        const weeksInMonth = 4;
        labels = Array(weeksInMonth).fill().map((_, i) => `Week ${i + 1}`);
        values = labels.map((_, i) => Math.floor(Math.random() * 100));
    } else if (filter === 'year') {
        // Simplified for demo - would normally get yearly data
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        values = labels.map(() => Math.floor(Math.random() * 100));
    }
    
    // Destroy previous chart if it exists
    if (window.adherenceChart) {
        window.adherenceChart.destroy();
    }
    
    window.adherenceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Adherence %',
                data: values,
                backgroundColor: values.map(val => 
                    val >= 90 ? 'rgba(40, 167, 69, 0.7)' :
                    val >= 75 ? 'rgba(255, 193, 7, 0.7)' :
                    'rgba(220, 53, 69, 0.7)'
                ),
                borderColor: values.map(val => 
                    val >= 90 ? 'rgba(40, 167, 69, 1)' :
                    val >= 75 ? 'rgba(255, 193, 7, 1)' :
                    'rgba(220, 53, 69, 1)'
                ),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '% adherence';
                        }
                    }
                }
            }
        }
    });
}

// Medication Form Functions
function openAddMedModal() {
    addMedModal.classList.add('active');
    medicationForm.reset();
    customTimesContainer.style.display = 'none';
    customTimesContainer.innerHTML = `
        <label>Custom Times</label>
        <div class="time-inputs">
            <div class="time-input">
                <input type="time" class="custom-time">
                <button type="button" class="remove-time-btn"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <button type="button" class="add-time-btn" id="addTimeBtn">
            <i class="fas fa-plus"></i> Add Another Time
        </button>
    `;
    
    // Set default start date to today
    document.getElementById('medStartDate').valueAsDate = new Date();
    
    // Re-add event listeners
    document.getElementById('addTimeBtn').addEventListener('click', addCustomTimeInput);
    document.querySelector('.remove-time-btn').addEventListener('click', removeCustomTimeInput);
}

function closeAddMedModal() {
    addMedModal.classList.remove('active');
}

function handleFrequencyChange() {
    if (medFrequency.value === 'custom') {
        customTimesContainer.style.display = 'block';
    } else {
        customTimesContainer.style.display = 'none';
    }
}

function addCustomTimeInput() {
    const timeInputs = document.querySelector('.time-inputs');
    const newTimeInput = document.createElement('div');
    newTimeInput.className = 'time-input';
    newTimeInput.innerHTML = `
        <input type="time" class="custom-time">
        <button type="button" class="remove-time-btn"><i class="fas fa-times"></i></button>
    `;
    timeInputs.appendChild(newTimeInput);
    
    // Add event listener to remove button
    newTimeInput.querySelector('.remove-time-btn').addEventListener('click', removeCustomTimeInput);
}

function removeCustomTimeInput(e) {
    // Don't remove the last time input
    if (document.querySelectorAll('.time-input').length > 1) {
        e.target.closest('.time-input').remove();
    }
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        fileInfo.textContent = file.name;
        fileToUpload = file;
    } else {
        fileInfo.textContent = 'No file selected';
        fileToUpload = null;
    }
}

async function saveMedication(e) {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const medData = {
        name: document.getElementById('medName').value.trim(),
        dosage: document.getElementById('medDosage').value.trim(),
        form: document.getElementById('medForm').value,
        frequency: medFrequency.value,
        instructions: document.getElementById('medInstructions').value.trim(),
        startDate: document.getElementById('medStartDate').value,
        endDate: document.getElementById('medEndDate').value || null,
        prescriber: document.getElementById('medPrescriber').value.trim(),
        status: 'active',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastTaken: null
    };
    
    // Handle custom times if frequency is custom
    if (medFrequency.value === 'custom') {
        const times = Array.from(document.querySelectorAll('.custom-time'))
            .map(input => input.value)
            .filter(time => time);
        
        if (times.length === 0) {
            showAlert('Please add at least one custom time', 'error');
            return;
        }
        
        medData.customTimes = times;
    }
    
    try {
        // Upload prescription file if selected
        if (fileToUpload) {
            const filePath = `prescriptions/${currentUser.uid}/${Date.now()}_${fileToUpload.name}`;
            const fileRef = storage.ref(filePath);
            await fileRef.put(fileToUpload);
            medData.prescriptionUrl = await fileRef.getDownloadURL();
        }
        
        // Save medication to Firestore
        await db.collection('users').doc(currentUser.uid).collection('medications').add(medData);
        
        showAlert('Medication added successfully!', 'success');
        closeAddMedModal();
    } catch (error) {
        console.error('Error saving medication:', error);
        showAlert('Failed to add medication. Please try again.', 'error');
    }
}

function editMedication(medId) {
    const med = medications.find(m => m.id === medId);
    if (!med) return;
    
    openAddMedModal();
    
    // Fill form with medication data
    document.getElementById('medName').value = med.name;
    document.getElementById('medDosage').value = med.dosage;
    document.getElementById('medForm').value = med.form;
    document.getElementById('medFrequency').value = med.frequency;
    document.getElementById('medInstructions').value = med.instructions || '';
    document.getElementById('medStartDate').value = med.startDate;
    document.getElementById('medEndDate').value = med.endDate || '';
    document.getElementById('medPrescriber').value = med.prescriber || '';
    
    // Handle frequency-specific fields
    if (med.frequency === 'custom' && med.customTimes) {
        customTimesContainer.style.display = 'block';
        const timeInputs = document.querySelector('.time-inputs');
        timeInputs.innerHTML = '';
        
        med.customTimes.forEach((time, index) => {
            const timeInput = document.createElement('div');
            timeInput.className = 'time-input';
            timeInput.innerHTML = `
                <input type="time" class="custom-time" value="${time}">
                <button type="button" class="remove-time-btn"><i class="fas fa-times"></i></button>
            `;
            timeInputs.appendChild(timeInput);
            
            // Add event listener to remove button
            timeInput.querySelector('.remove-time-btn').addEventListener('click', removeCustomTimeInput);
        });
        
        // Add one empty time input if no custom times exist
        if (med.customTimes.length === 0) {
            addCustomTimeInput();
        }
    }
    
    // TODO: Handle file upload display for existing prescription
}

function confirmDeleteMedication(medId) {
    currentReminder = medId;
    confirmAction = 'delete';
    confirmTitle.textContent = 'Delete Medication';
    confirmMessage.textContent = 'Are you sure you want to delete this medication? This action cannot be undone.';
    confirmModal.classList.add('active');
}

async function deleteMedication(medId) {
    try {
        await db.collection('users').doc(currentUser.uid).collection('medications').doc(medId).delete();
        showAlert('Medication deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting medication:', error);
        showAlert('Failed to delete medication', 'error');
    }
}

function requestRenewal(medId) {
    const med = medications.find(m => m.id === medId);
    if (!med) return;
    
    // In a real app, this would send a request to the doctor/pharmacy
    showAlert(`Renewal requested for ${med.name}`, 'success');
}

// Reminder Functions
function setupReminders() {
    // Check for reminders every minute
    setInterval(checkForReminders, 60000);
    
    // Check immediately on load
    checkForReminders();
}

function checkForReminders() {
    const now = new Date();
    
    medications.forEach(med => {
        const nextDose = getNextDose(med);
        if (nextDose && Math.abs(nextDose - now) < 60000) { // Within 1 minute
            showReminder(med, nextDose);
        }
    });
}

function getNextDose(med) {
    if (!med.startDate) return null;
    
    const startDate = new Date(med.startDate);
    const now = new Date();
    
    if (med.endDate && new Date(med.endDate) < now) {
        return null; // Medication has ended
    }
    
    if (med.frequency === 'once') {
        return startDate > now ? startDate : null;
    }
    
    // For demo purposes, we'll just show the next occurrence today
    // In a real app, you'd calculate based on the actual schedule
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (med.frequency === 'daily' || med.frequency === 'once') {
        // Default times for daily medications
        const defaultTimes = ['08:00', '12:00', '20:00']; // 8AM, 12PM, 8PM
        const times = med.frequency === 'custom' && med.customTimes ? med.customTimes : defaultTimes;
        
        for (const time of times) {
            const [hours, minutes] = time.split(':').map(Number);
            const doseTime = new Date(today);
            doseTime.setHours(hours, minutes, 0, 0);
            
            if (doseTime > now) {
                return doseTime;
            }
        }
        
        // If all times today have passed, return first time tomorrow
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [hours, minutes] = times[0].split(':').map(Number);
        tomorrow.setHours(hours, minutes, 0, 0);
        return tomorrow;
    }
    
    // For weekly medications, you'd check the specific day(s) of the week
    // For this demo, we'll just return null for weekly medications
    return null;
}

function showReminder(med, time) {
    currentReminder = {
        medicationId: med.id,
        time: time
    };
    
    reminderMedName.textContent = med.name;
    reminderMedDosage.textContent = `${med.dosage} ${med.form}`;
    reminderTime.textContent = formatTime(time);
    
    reminderModal.classList.add('active');
    
    // Play notification sound
    playNotificationSound();
    
    // Send push notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Time to take ${med.name}`, {
            body: `${med.dosage} ${med.form} is due now`,
            icon: 'https://via.placeholder.com/48/4a6fa5/ffffff?text=MT'
        });
    }
}

function showReminderForMedication(medId) {
    const med = medications.find(m => m.id === medId);
    if (!med) return;
    
    const nextDose = getNextDose(med);
    if (!nextDose) return;
    
    showReminder(med, nextDose);
}

function closeReminder() {
    reminderModal.classList.remove('active');
    currentReminder = null;
}

async function handleReminderAction(action) {
    if (!currentReminder || !currentUser) return;
    
    const medRef = db.collection('users').doc(currentUser.uid)
        .collection('medications').doc(currentReminder.medicationId);
    
    try {
        const now = new Date();
        
        if (action === 'taken') {
            await medRef.update({
                lastTaken: now
            });
            showAlert('Medication marked as taken', 'success');
        } else if (action === 'missed') {
            await medRef.update({
                lastMissed: now
            });
            showAlert('Medication marked as missed', 'warning');
        }
        
        // Update adherence data (simplified for demo)
        const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
        const adherenceRef = db.collection('users').doc(currentUser.uid)
            .collection('adherence').doc('weekly');
            
        if (action === 'taken') {
            await adherenceRef.set({
                [dayOfWeek]: firebase.firestore.FieldValue.increment(1)
            }, { merge: true });
        }
        
        closeReminder();
    } catch (error) {
        console.error('Error updating medication:', error);
        showAlert('Failed to update medication', 'error');
    }
}

function snoozeReminder() {
    if (!currentReminder) return;
    
    // Set a timeout to show the reminder again in 10 minutes
    setTimeout(() => {
        const med = medications.find(m => m.id === currentReminder.medicationId);
        if (med) {
            const newTime = new Date();
            newTime.setMinutes(newTime.getMinutes() + 10);
            showReminder(med, newTime);
        }
    }, 600000); // 10 minutes
    
    showAlert('Reminder snoozed for 10 minutes', 'info');
    closeReminder();
}

function playNotificationSound() {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.play().catch(e => console.log('Audio playback failed:', e));
}

// Confirmation Dialog Functions
function showConfirmation(title, message, action) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmAction = action;
    confirmModal.classList.add('active');
}

function closeConfirmation() {
    confirmModal.classList.remove('active');
    confirmAction = null;
}

// Proceed with the confirmed action
proceedConfirmBtn.addEventListener('click', () => {
    if (confirmAction === 'delete' && currentReminder) {
        deleteMedication(currentReminder);
    }
    
    closeConfirmation();
});

// Utility Functions
function updateCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = new Date().toLocaleDateString('en-US', options);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTime(date) {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatFrequency(frequency) {
    const frequencyMap = {
        once: 'Once daily',
        twice: 'Twice daily',
        thrice: 'Three times daily',
        weekly: 'Weekly',
        as_needed: 'As needed',
        custom: 'Custom schedule'
    };
    return frequencyMap[frequency] || frequency;
}

function getMedicationStatus(med) {
    if (!med.endDate) {
        return { text: 'Active', class: '' };
    }
    
    const endDate = new Date(med.endDate);
    const now = new Date();
    const daysRemaining = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 0) {
        return { text: 'Expired', class: 'danger' };
    } else if (daysRemaining <= 3) {
        return { text: 'Expires soon', class: 'danger' };
    } else if (daysRemaining <= 7) {
        return { text: 'Needs renewal', class: 'warning' };
    } else {
        return { text: 'Active', class: '' };
    }
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() && 
           date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear();
}

// UI Functions
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

function logoutUser() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch(error => {
        console.error('Error signing out:', error);
        showAlert('Failed to logout. Please try again.', 'error');
    });
}

function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = 'alert show ' + type;
    
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 5000);
}

// Dark Mode Functions
function setupDarkMode() {
    // Check for saved user preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
}

function toggleDarkMode() {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);