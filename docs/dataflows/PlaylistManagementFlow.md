# Playlist Management Flow

This document describes the playlist management flow in the Music Playlist Creator application.

## Creating a Playlist

1.  The user navigates to the `CreatePlaylistPage`.
2.  The user enters the playlist name and description.
3.  The `createPlaylist` function in `playlist.js` is called to create a new playlist in Firebase.
4.  If the playlist creation is successful, the user is redirected to the new `PlaylistDetailPage`.

## Editing a Playlist

1.  The user navigates to the `EditPlaylistPage` for a specific playlist.
2.  The user can modify the playlist name and description.
3.  The user can add videos to the playlist using the `YouTubeSearch` component.
4.  The user can reorder videos in the playlist using drag and drop.
5.  The user can remove videos from the playlist.
6.  The `updatePlaylist` function in `playlist.js` is called to update the playlist in Firebase.
7.  If the playlist update is successful, the user is redirected to the `PlaylistDetailPage`.

## Viewing a Playlist

1. The user navigates to the `PlaylistDetailPage` for a specific playlist.
2. The `getPlaylist` function in `playlist.js` is called to retrieve the playlist data from Firebase.
3. The playlist name, description, and videos are displayed.

## Deleting a Playlist

1. The user navigates to the `EditPlaylistPage` for a specific playlist.
2. The user clicks the "Delete Playlist" button.
3. The `deletePlaylist` function in `playlist.js` is called to delete the playlist from Firebase.
4. If the playlist deletion is successful, the user is redirected to the `HomePage`.
