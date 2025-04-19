MedTrack - Medication Management System
Introduction
MedTrack is a comprehensive medication management system designed to help users track their medications, set reminders, and manage their health regimen. The application provides features for adding medications, scheduling doses, tracking adherence, and receiving renewal alerts. It solves the problem of medication non-adherence by providing timely reminders and a centralized platform for medication management.

Project Type
Fullstack (Frontend + Backend)

Deployed App
Frontend: [Deployed URL here]
Backend: [Firebase Console URL here]
Database: [Firebase Firestore URL here]

Directory Structure
medtrack/
├─ dashboard.html # Main dashboard page
├─ dashboard-styles.css # Dashboard styles
├─ dashboard-script.js # Dashboard functionality
├─ index.html # Login/signup page
├─ styles.css # Login page styles
├─ script.js # Login/signup functionality
├─ manifest.json # PWA configuration
├─ images/ # Contains all project images
│ ├─ clock_with_meds.jpg
│ ├─ clock_with_meds(DM).jpg

Video Walkthrough
[Attach video walkthrough demonstrating features]

Features
Medication Management: Add, edit, and delete medications with dosage information

Dose Scheduling: Set custom schedules for each medication

Reminders: Get notifications for upcoming doses

Adherence Tracking: Visual charts showing medication adherence rates

Renewal Alerts: Notifications for expiring or low medications

Dark Mode: User-friendly dark/light mode toggle

Responsive Design: Works on mobile and desktop devices

Design Decisions & Assumptions
Used Firebase for authentication and data storage for quick implementation

Designed a clean, intuitive UI with medication cards for easy scanning

Implemented a dark mode for user comfort

Assumed users would primarily access via mobile devices

Used Chart.js for data visualization for quick implementation

Installation & Getting Started
To run MedTrack locally:

bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd medtrack

# Install live server (if needed)
npm install -g live-server

# Start the application
live-server
Note: You'll need to configure your own Firebase project and update the configuration in dashboard-script.js

Usage
Sign up or log in using the login page

Add your medications with dosage and schedule information

View upcoming doses on the dashboard

Get reminders when it's time to take your medication

Track your adherence over time using the charts

Credentials
Test user:

Email: test@example.com

Password: test1234

APIs Used
Firebase Authentication

Firebase Firestore

Firebase Storage

Chart.js for data visualization

Font Awesome for icons

Technology Stack
Frontend: HTML5, CSS3, JavaScript

UI Framework: Custom CSS with responsive design

Charts: Chart.js

Authentication: Firebase Auth

Database: Firebase Firestore

Storage: Firebase Storage

Icons: Font Awesome

Future Enhancements
Push notifications for medication reminders

Integration with pharmacy APIs for automatic refills

Family member management for caregivers

Medication interaction checker

Exportable reports for healthcare providers
