# Music Playlist Creator - Code Documentation

## 1. Project Overview

The Music Playlist Creator is a React application that allows users to create and share music playlists with YouTube video links. Users can create, edit, and delete playlists, add YouTube videos to playlists with automatic thumbnail extraction, and reorder videos within playlists. The application uses Firebase for user authentication and data storage, and the YouTube API for video search.

## 2. Architecture and File Structure

The project is organized as a React application with the following directory structure:

```
├── public/                  # Static assets
├── src/                     # Source code
│   ├── components/          # Reusable React components
│   ├── context/             # React context for state management
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # React components for different pages
│   ├── services/            # API services for Firebase and YouTube
│   ├── styles/              # CSS styles
│   ├── App.jsx              # Main application component
│   ├── index.jsx            # Entry point for the React application
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

Key files and their purposes:

-   `src/App.jsx`: Main application component that defines the routing structure.
-   `src/components/`: Contains reusable React components such as `VideoItem`, `PlaylistCard`, `SearchBar`, etc.
-   `src/context/AuthContext.jsx`: Manages user authentication state using React Context.
-   `src/hooks/useVideoManagement.jsx`: Custom hook for managing video-related functionality.
-   `src/pages/`: Contains React components for different pages such as `HomePage`, `LoginPage`, `PlaylistDetailPage`, etc.
-   `src/services/`: Contains API services for interacting with Firebase and the YouTube API.
-   `src/styles/`: Contains CSS styles organized by component and page.

The application follows a component-based architecture with React components responsible for rendering UI elements and handling user interactions. React Context is used for managing global state, such as user authentication status. API services encapsulate the logic for interacting with external services such as Firebase and the YouTube API.
