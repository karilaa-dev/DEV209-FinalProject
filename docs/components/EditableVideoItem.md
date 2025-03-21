# EditableVideoItem Component

The `EditableVideoItem` component is responsible for rendering a video item that can be edited. It's used in the `EditPlaylistPage` to allow users to modify the title and description of videos in a playlist.

## Props

-   `video`: An object containing the video details:
    -   `title`: The title of the video (string).
    -   `url`: The URL of the video on YouTube (string, required).
    -   `thumbnailUrl`: The URL of the video thumbnail (string, optional).
    -   `description`: The description of the video (string, optional).
-   `index`: The index of the video in the playlist (number, required).
-   `onSave`: A function to be called when the video details are saved (function, required).
-   `onRemove`: A function to be called when the video is removed from the playlist (function, required).

## Functionality

-   Displays the video title and thumbnail.
-   Provides input fields for editing the video title and description.
-   Provides a "Save" button to save the changes.
-   Provides a "Remove" button to remove the video from the playlist.

## State Variables

-   `title`: The current title of the video (string).
-   `description`: The current description of the video (string).

## Example Usage

```jsx
<EditableVideoItem
    video={{
        title: "Video Title",
        url: "https://www.youtube.com/watch?v=VIDEO_ID",
        thumbnailUrl: "https://example.com/thumbnail.jpg",
        description: "Video Description",
    }}
    index={0}
    onSave={(updatedVideo) => console.log("Save video:", updatedVideo)}
    onRemove={() => console.log("Remove video")}
/>
