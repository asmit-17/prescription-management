# MedTrack - Medication Management System

## Introduction
MedTrack is a comprehensive medication management web application designed to help users track their medications, set reminders, and maintain their medication adherence. The application provides an intuitive interface for managing prescriptions, scheduling doses, and receiving timely reminders to ensure users never miss a dose.

## Project Type
Frontend with Firebase Backend

## Deployed App
https://prescriptionmanager.netlify.app/

## Directory Structure
```
medtrack/
├─ index.html
├─ dashboard.html
├─ styles.css
├─ dashboard-styles.css
├─ script.js
├─ dashboard-script.js
├─ sw.js
├─ manifest.json
├─ images/
│  ├─ clock with meds.jpg
│  ├─ clock with meds(DM).jpg
```

## Video Walkthrough of the project
https://drive.google.com/file/d/1OWkFaI9V8UHZQ9o9uz8GWzn9XzQZGcI3/view?usp=drive_link

## Video Walkthrough of the QnA
https://youtu.be/6nPWm2mHO60?si=sx4Mojk-5c3zqqcs

## Features
- **User Authentication**: Secure login and registration with email/password, Google, and Facebook
- **Medication Dashboard**: Overview of all active medications with quick stats
- **Medication Management**: Add, edit, and delete medications with detailed information
- **Dose Scheduling**: Set custom schedules for medication doses
- **Reminders**: Receive timely notifications for upcoming doses
- **Adherence Tracking**: Visual charts to monitor medication adherence
- **Renewal Alerts**: Get notified when medications need to be renewed
- **Medication History**: View complete history of medication intake
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Responsive Design**: Optimized for both desktop and mobile devices
- **PWA Support**: Install as a standalone application on supported devices

## Design Decisions & Assumptions
- **Firebase Integration**: Utilized Firebase for authentication, database, and storage to provide a secure and scalable backend solution
- **Real-time Updates**: Implemented real-time data synchronization to ensure users always have the most up-to-date information
- **Offline Support**: Added service worker for caching assets to enable basic functionality without internet connection
- **User Experience**: Designed with a focus on simplicity and ease of use, with clear visual indicators for medication status
- **Accessibility**: Incorporated high contrast options and clear typography for better readability
- **Security**: Implemented secure authentication methods and data protection measures

## Installation & Getting Started
1. Clone the repository
```bash
git clone https://github.com/yourusername/medtrack.git
cd medtrack
```

```markdown project="MedTrack" file="README.md"
...
```

2. Install dependencies (if using npm)


```shellscript
npm install
```

3. Configure Firebase

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password, Google, Facebook)
3. Set up Firestore Database
4. Update the Firebase configuration in script.js and dashboard-script.js with your project credentials



4. Run the application


```shellscript
# If using a local server like http-server
npx http-server
```

5. Open the application in your browser


```plaintext
http://localhost:8080
```

## Usage

1. **Registration/Login**: Create an account or log in using email, Google, or Facebook
2. **Adding Medications**: Click "Add Medication" button on the dashboard to add a new medication
3. **Setting Reminders**: Configure medication frequency and custom times for reminders
4. **Tracking Adherence**: View adherence charts to monitor your medication compliance
5. **Managing Medications**: Edit or delete medications as needed from the dashboard
6. **Viewing History**: Check your medication history to see past doses


## Credentials

For testing purposes, you can use the following credentials:

- Email: abcd@gmail.com
- Password: Asm@121212


## APIs Used

- Firebase Authentication API
-  apiKey: "AIzaSyBVpNLC9RjQ3JJvwI58Ui8thweO5kQ394Y"
- Firebase Storage API


## API Endpoints

As this application uses Firebase, it doesn't have traditional REST API endpoints. Instead, it interacts with Firebase services:

- **Authentication**: Firebase Authentication for user management
- **Database**: Firestore collections for storing medication data

- `/users/{userId}/medications` - Store user medications
- `/users/{userId}/adherence` - Store adherence data



- **Storage**: Firebase Storage for prescription images


## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Firebase (Authentication, Firestore, Storage)
- Font Awesome for icons

