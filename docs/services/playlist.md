# Playlist Service Documentation (playlist.js)

The `playlist.js` service handles playlist management using Firebase Firestore. It provides functions for creating, reading, updating, and deleting playlists, as well as managing videos within playlists.

## Functions

### `createPlaylist(playlistData, userId)`

Creates a new playlist.

#### Parameters

-   `playlistData` (object): The data for the new playlist.
-   `userId` (string): The ID of the user creating the playlist.

#### Returns

A Promise that resolves with an object containing:

-   `id` (string): The ID of the new playlist.
-   `...playlistWithUser` (object): The playlist data, including the new ID.
-   `error` (string): An error message, or null if the creation was successful.

### `getPlaylist(playlistId)`

Gets a playlist by ID.

#### Parameters

-   `playlistId` (string): The ID of the playlist to retrieve.

#### Returns

A Promise that resolves with an object containing:

-   `playlist` (object): The playlist data.
-   `error` (string): An error message, or null if the retrieval was successful.

### `updatePlaylist(playlistId, playlistData)`

Updates a playlist.

#### Parameters

-   `playlistId` (string): The ID of the playlist to update.
-   `playlistData` (object): The data to update the playlist with.

#### Returns

A Promise that resolves with an object containing:

-   `success` (boolean): True if the update was successful.
-   `error` (string): An error message, or null if the update was successful.

### `deletePlaylist(playlistId)`

Deletes a playlist.

#### Parameters

-   `playlistId` (string): The ID of the playlist to delete.

#### Returns

A Promise that resolves with an object containing:

-   `success` (boolean): True if the deletion was successful.
-   `error` (string): An error message, or null if the deletion was successful.

### `getUserPlaylists(userId)`

Gets user playlists.

#### Parameters

-   `userId` (string): The ID of the user whose playlists to retrieve.

#### Returns

A Promise that resolves with an object containing:

-   `playlists` (array): An array of playlist objects.
-   `error` (string): An error message, or null if the retrieval was successful.

### `getAllPlaylists(lastVisible = null, itemsPerPage = 8)`

Gets all playlists with pagination.

#### Parameters

-   `lastVisible` (object, optional): The last visible document from the previous page.
-   `itemsPerPage` (number, optional): The number of items to return per page.

#### Returns

A Promise that resolves with an object containing:

-   `playlists` (array): An array of playlist objects.
-   `lastVisible` (object): The last visible document from the current page.
-   `error` (string): An error message, or null if the retrieval was successful.

### `searchPlaylists(searchTerm)`

Searches playlists.

#### Parameters

-   `searchTerm` (string): The search term to use.

#### Returns

A Promise that resolves with an object containing:

-   `playlists` (array): An array of playlist objects that match the search term.
-   `error` (string): An error message, or null if the search was successful.

### `addVideoToPlaylist(playlistId, videoData)`

Adds a video to a playlist.

#### Parameters

-   `playlistId` (string): The ID of the playlist to add the video to.
-   `videoData` (object): The data for the video to add.

#### Returns

A Promise that resolves with an object containing:

-   `success` (boolean): True if the addition was successful.
-   `error` (string): An error message, or null if the addition was successful.

### `removeVideoFromPlaylist(playlistId, videoIndex)`

Removes a video from a playlist.

#### Parameters

-   `playlistId` (string): The ID of the playlist to remove the video from.
-   `videoIndex` (number): The index of the video to remove.

#### Returns

A Promise that resolves with an object containing:

-   `success` (boolean): True if the removal was successful.
-   `error` (string): An error message, or null if the removal was successful.

### `updateVideoInPlaylist(playlistId, videoIndex, updatedVideoData)`

Updates a video's information in a playlist.

#### Parameters

-   `playlistId` (string): The ID of the playlist containing the video.
-   `videoIndex` (number): The index of the video to update.
-   `updatedVideoData` (object): The data to update the video with.

#### Returns

A Promise that resolves with an object containing:

-   `success` (boolean): True if the update was successful.
-   `video` (object): The updated video data.
-   `error` (string): An error message, or null if the update was successful.

### `updateViewCount(playlistId)`

Updates view count for a playlist

#### Parameters

-   `playlistId` (string): The ID of the playlist to update the view count for

#### Returns

A Promise that resolves with an object containing:

-   `success` (boolean): True if the update was successful.
-   `error` (string): An error message, or null if the update was successful.
