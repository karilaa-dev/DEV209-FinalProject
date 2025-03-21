# YouTubeSearch Component

The `YouTubeSearch` component is responsible for providing a search interface for YouTube videos. It allows users to search for videos and select them to add to a playlist.

## Props

-   `onVideoSelect`: A function to be called when a video is selected from the search results (function, required).

## Functionality

-   Displays a search input field.
-   Fetches search results from the YouTube API using the `searchYouTubeVideos` service.
-   Displays a list of search results.
-   Calls the `onVideoSelect` function when a video is selected.

## State Variables

-   `searchTerm`: The current search term (string).
-   `searchResults`: An array of search results (array).
-   `loading`: Indicates whether search results are being loaded (boolean).
-   `error`: Stores any error messages (string).

## Services Used

-   `searchYouTubeVideos`: Fetches search results from the YouTube API.

## Example Usage

```jsx
<YouTubeSearch onVideoSelect={(video) => console.log("Selected video:", video)} />
