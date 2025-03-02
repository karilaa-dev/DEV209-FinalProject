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
   - Create a `.env` file in the root directory based on the `.env.example` template
   - Add your Firebase configuration values to the `.env` file

## Running Locally

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## Environment Variables

This project uses environment variables to securely store Firebase configuration. The following files are used:

- `.env`: Contains your actual Firebase configuration (not committed to git)
- `.env.example`: A template showing the required environment variables (committed to git)

When setting up the project, copy `.env.example` to `.env` and add your Firebase credentials:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

## Testing with Firebase in Development

To test Firebase functionality in your local development environment:

1. Set up your Firebase project as described in the Setup section
2. Add your Firebase configuration to the `.env` file
3. Run the local development server (`npm run dev`)
4. The app will connect to your production Firebase project while running locally

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
