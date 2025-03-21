# HomePage Component

The `HomePage` component is responsible for rendering the main landing page of the application. It displays a grid of playlists and a search bar for finding playlists.

## Functionality

-   Displays a grid of playlists using the `PlaylistGrid` component.
-   Provides a search bar for finding playlists.
-   Fetches playlists from Firebase using the `getAllPlaylists` service.
-   Handles pagination for loading more playlists.

## Components Used

-   `PlaylistGrid`: Displays a grid of playlists.
-   `SearchBar`: Provides a search input field.

## State Variables

-   `playlists`: An array of playlist objects (array).
-   `loading`: Indicates whether playlists are being loaded (boolean).
-   `error`: Stores any error messages (string).
-   `searchTerm`: The current search term (string).
-   `lastVisible`: The last visible document from the previous page (object).
-   `hasMore`: Indicates whether there are more playlists to load (boolean).

## Services Used

-   `getAllPlaylists`: Fetches playlists from Firebase.
-   `searchPlaylists`: Searches playlists in Firebase.
