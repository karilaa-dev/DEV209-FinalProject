# YouTube API Service Documentation

The `youtube.js` service handles interactions with the YouTube Data API. It provides functions for searching YouTube videos and extracting video details.

## Functions

### `searchYouTubeVideos(query, maxResults = 5)`

Searches YouTube videos based on a query.

#### Parameters

-   `query` (string): The search query.
-   `maxResults` (number, optional): Maximum number of results to return. Default is 5.

#### Returns

A Promise that resolves with an object containing:

-   `videos` (array): An array of video objects, each containing:
    -   `id` (string): The video ID.
    -   `url` (string): The URL of the video on YouTube.
    -   `title` (string): The title of the video.
    -   `description` (string): The description of the video.
    -   `thumbnailUrl` (string): The URL of the video thumbnail.
    -   `channelTitle` (string): The title of the channel that uploaded the video.
    -   `publishedAt` (string): The date and time the video was published.
-   `error` (string): An error message, or null if the search was successful.

#### Example Usage

```javascript
import { searchYouTubeVideos } from '../services/youtube';

const searchResults = await searchYouTubeVideos('React tutorial', 10);

if (searchResults.error) {
    console.error('Error searching YouTube:', searchResults.error);
} else {
    console.log('Search results:', searchResults.videos);
}
```

### `getVideoDetails(videoId)`

Gets video details by ID.

#### Parameters

-   `videoId` (string): The YouTube video ID.

#### Returns

A Promise that resolves with an object containing:

-   `id` (string): The video ID.
-   `url` (string): The URL of the video on YouTube.
-   `title` (string): The title of the video.
-   `description` (string): The description of the video.
-   `thumbnailUrl` (string): The URL of the video thumbnail.
-   `channelTitle` (string): The title of the channel that uploaded the video.
-   `publishedAt` (string): The date and time the video was published.

#### Example Usage

```javascript
import { getVideoDetails } from '../services/youtube';

const videoDetails = await getVideoDetails('VIDEO_ID');

console.log('Video details:', videoDetails);
```

### `extractVideoId(url)`

Extracts YouTube video ID from a URL.

#### Parameters

-   `url` (string): YouTube video URL

#### Returns

YouTube video ID (string) or null if invalid

#### Example Usage

```javascript
import { extractVideoId } from '../services/youtube';

const videoId = extractVideoId('https://www.youtube.com/watch?v=VIDEO_ID');

console.log('Video ID:', videoId);
