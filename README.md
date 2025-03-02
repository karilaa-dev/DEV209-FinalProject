# Music Playlist Creator

A React application that allows users to create and share music playlists with YouTube video links.

## Features

- User authentication with Firebase (email/password)
- Create, edit, and delete playlists
- Add YouTube videos to playlists with automatic thumbnail extraction
- Responsive design with 4 playlists per row on desktop
- Infinite scroll for browsing playlists
- Search functionality for finding playlists

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-folder>
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Email/Password authentication in the Authentication section
   - Create a Firestore database in Test mode
   - Get your Firebase configuration (Project settings > General > Your apps > Firebase SDK snippet > Config)
   - Open `src/services/firebase.js` and replace the placeholder values with your Firebase configuration

## Running Locally

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## Testing with Firebase without Deployment

There are two main ways to test Firebase functionality locally:

### Option 1: Using Production Firebase with Local Development

1. Set up your Firebase project as described in the Setup section
2. Add your Firebase configuration to `src/services/firebase.js`
3. Run the local development server (`npm run dev`)
4. The app will connect to your production Firebase project while running locally

### Option 2: Using Firebase Emulators

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
   - Select Firestore and Authentication emulators
   - Choose your Firebase project
   - Accept the default ports or configure as needed

4. Update `src/services/firebase.js` to use emulators:
   - Uncomment the emulator connection code:
```javascript
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}
```

5. Start the emulators:
```bash
firebase emulators:start
```

6. In another terminal, run the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

The build files will be in the `dist` directory, which you can then deploy to your hosting provider of choice.

## Firestore Data Structure

### Users Collection
- Document ID: User's UID from Firebase Authentication
- Fields:
  - `username`: String
  - `email`: String
  - `createdAt`: Timestamp

### Playlists Collection
- Document ID: Auto-generated
- Fields:
  - `name`: String
  - `description`: String (optional)
  - `userId`: String (reference to user)
  - `creatorName`: String
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp
  - `videos`: Array of Objects
    - `url`: String (YouTube URL)
    - `title`: String
    - `description`: String (optional)
    - `thumbnailUrl`: String
    - `addedAt`: Timestamp

## Firestore Indexes

There might be a delay when composite indexes are first being built. The application includes fallback logic to handle this case. If you see error messages related to indexes, you can:

1. Wait for the indexes to build (can take a few minutes)
2. Manually create the required indexes in Firebase Console:
   - Go to Firestore > Indexes > Composite
   - Add index for collection `playlists`:
     - Fields: `userId` (Ascending), `createdAt` (Descending)
     - Query scope: Collection

## Known Limitations

- Firestore doesn't support full-text search natively. The search feature in this app does client-side filtering, which isn't ideal for large datasets. In a production app, consider using services like Algolia or Elastic Search.
- The app uses a simple authentication approach. For production use, consider adding more secure options and validation.
