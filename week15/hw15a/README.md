# HW15-A — Google OAuth 2.0

**ICS 385 — Spring 2026**

## Overview

A stand-alone Express application demonstrating federated authentication using the `passport-google-oauth20` strategy. A user can sign in with their Google account; their identity is persisted to MongoDB and managed via server-side sessions.

---

## Screenshots

### Google Consent Screen
![Google Consent Screen](/week15/hw15a/screenshots/GoogleConsentScreen.png)

### Profile Page (Authenticated)
![Profile Page](/week15/hw15a/screenshots/ProfilePage.png)

### MongoDB Atlas — User Document
![MongoDB User Document](/week15/hw15a/screenshots/hw15aUsersCollectionMongoDB.png)

---

## Reflection
Honestly, this assignment was much more straightforward than I was anticipating after our lecture! The build was simple and familiar: I just set up the structure, wired things up, and it...worked. 
I feel like adding OAuth takes the pressure of storing credentials off my hands. Also, it allows me to gain more user information than I was originally with my own login setup (I was just getting emails and passwords, now I also have a name). 
I'm thankful for AI's help in the Google Cloud Console setup...I think this reflection would read MUCH differently without it, as well as for the debugging help with getting the MongoStore recognized as a class instead of an object! With that said, extra responsibility is added with OAuth due to having to setup and managing things in Google Cloud Console. Helpful, but more secret keys, more to remember, more to keep from slipping through to GitHub. Also, I think eventually it costs money once the free tokens run out, so that's another thing to consider. 

---

## AI Tools Used

Claude (Anthropic) was used during this assignment to assist with project setup, debugging `connect-mongo` import errors, and understanding the assignment. All code was reviewed and is understood by the author. Per syllabus GenAI policy, Claude's assistance is disclosed here.