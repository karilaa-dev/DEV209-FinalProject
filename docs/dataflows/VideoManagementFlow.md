# Video Management Flow

This document describes the video management flow within a playlist in the Music Playlist Creator application.

## Adding a Video

1.  The user navigates to the `EditPlaylistPage` for a specific playlist.
2.  The user searches for a video using the `YouTubeSearch` component.
3.  The user selects a video from the search results.
4.  The `addVideoToPlaylist` function in `playlist.js` is called to add the video to the playlist in Firebase.
5.  If the video addition is successful, the playlist is updated and the new video is displayed in the list.

## Removing a Video

1.  The user navigates to the `EditPlaylistPage` for a specific playlist.
2.  The user clicks the "Remove" button for a specific video.
3.  The `removeVideoFromPlaylist` function in `playlist.js` is called to remove the video from the playlist in Firebase.
4.  If the video removal is successful, the playlist is updated and the video is removed from the list.

## Reordering Videos

1.  The user navigates to the `EditPlaylistPage` for a specific playlist.
2.  The user drags and drops a video to a new position in the list.
3.  The `updatePlaylist` function in `playlist.js` is called to update the order of videos in the playlist in Firebase.
4.  If the playlist update is successful, the playlist is updated and the videos are displayed in the new order.

## Editing a Video

1. The user navigates to the `EditPlaylistPage` for a specific playlist.
2. The user clicks the "Edit" button for a specific video.
3. The user modifies the video title and description.
4. The `updateVideoInPlaylist` function in `playlist.js` is called to update the video information in Firebase.
5. If the video update is successful, the playlist is updated and the new video information is displayed.
