# GRIET Hub

A secure, institution-only platform that centralizes college clubs, events, and campus opportunities into a single verified system.

Built for the **GDGOC Hackathon (Open Innovation)**.

---

## Problem

Campus information is fragmented across WhatsApp groups, Instagram posts, posters, and word of mouth.  
There is no single trusted platform for clubs, events, recruitments, or announcements.

---

## Solution

**GRIET Hub** acts as a verified campus hub where:

- Students discover clubs and events in one place  
- Clubs manage their own content securely  
- Access is restricted to college email IDs  
- Notifications are personalized and non-intrusive  
- Past events are archived for continuity  

---

## Key Features

- Google authentication with college email restriction  
- Role-based access (students & club admins)  
- Club and event management with image uploads  
- Bookmark-based notifications  
- Upcoming & past events archive  
- Google Calendar integration  
- Read-only AI assistant (Gemini)  

---

## Tech Stack

- **Frontend:** React (Create React App)  
- **Backend:** Firebase (Authentication, Firestore, Storage)  
- **Hosting:** Firebase Hosting  
- **AI:** Gemini (read-only assistant)  

---

## Security

- No secret keys are committed to the repository  
- Firestore & Storage security rules are enforced  
- Firebase web API keys are used as intended (client-safe)  
- AI is treated as a support feature, not core logic  

---

## Setup Instructions

```bash
git clone <repo-url>
cd gdgoc
npm install
cp .env.example .env
npm start
```

## Environment Variables

Create a `.env` file in the project root using the following variables:

```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

## Hackathon Note

This project prioritizes completeness, security, and usability over over-claiming AI capabilities.
The current branch represents the final, stable submission for the hackathon.

## Team Details

**Team Member 1:**  
Aditya Vaasudev B

**Team Member 2:**  
Kamilla Sri Naga Sahaj

**Team Member 3:**  
Vineeth Reddy P

**Team Member 4:**  
Saketh Reddy J
