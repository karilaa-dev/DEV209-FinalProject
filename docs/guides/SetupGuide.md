# Setup Guide

This document provides instructions for setting up the development environment for the Music Playlist Creator application.

## Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn
-   Firebase account

## Steps

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure Firebase:

    -   Create a Firebase project at \[Firebase Console](https://console.firebase.google.com/).
    -   Enable Email/Password authentication in the Authentication section.
    -   Create a Firestore database in Test mode.
    -   Get your Firebase configuration (Project settings > General > Your apps > Firebase SDK snippet > Config).
    -   Create a `.env` file in the root directory based on the `.env.example` template.
    -   Add your Firebase configuration values to the `.env` file.

4.  Running Locally:

    ```bash
    npm run dev
    ```

    The application will be available at \[http://localhost:5173](http://localhost:5173).
