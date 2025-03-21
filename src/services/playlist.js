import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db } from "./firebase";
import { handleServiceError } from "./utils";

/**
 * Create a new playlist
 * @param {object} playlistData - The data for the new playlist
 * @param {string} userId - The ID of the user creating the playlist
 * @returns {Promise<object>} - Promise that resolves with the new playlist data
 */
export const createPlaylist = async (playlistData, userId) => {
  try {
    const playlistWithUser = {
      ...playlistData,
      userId,
      isHidden: playlistData.isHidden || false, // Add support for hiding playlists
      isFavorite: playlistData.isFavorite || false, // Add support for favorite playlists
      viewCount: 0, // Initialize viewCount to 0
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "playlists"), playlistWithUser);
    return { id: docRef.id, ...playlistWithUser };
  } catch (error) {
    return handleServiceError(error, "Error creating playlist");
  }
};

/**
 * Get a playlist by ID
 * @param {string} playlistId - The ID of the playlist to retrieve
 * @returns {Promise<object>} - Promise that resolves with the playlist data
 */
export const getPlaylist = async (playlistId) => {
  try {
    const playlistDoc = await getDoc(doc(db, "playlists", playlistId));
    
    if (playlistDoc.exists()) {
      return { playlist: { id: playlistDoc.id, ...playlistDoc.data() } };
    } else {
      return { error: "Playlist not found" };
    }
  } catch (error) {
    return handleServiceError(error, "Error getting playlist");
  }
};

/**
 * Update a playlist
 * @param {string} playlistId - The ID of the playlist to update
 * @param {object} playlistData - The data to update the playlist with
 * @returns {Promise<object>} - Promise that resolves with a success flag
 */
export const updatePlaylist = async (playlistId, playlistData) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    
    await updateDoc(playlistRef, {
      ...playlistData,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return handleServiceError(error, "Error updating playlist");
  }
};

/**
 * Delete a playlist
 * @param {string} playlistId - The ID of the playlist to delete
 * @returns {Promise<object>} - Promise that resolves with a success flag
 */
export const deletePlaylist = async (playlistId) => {
  try {
    await deleteDoc(doc(db, "playlists", playlistId));
    return { success: true };
  } catch (error) {
    return handleServiceError(error, "Error deleting playlist");
  }
};

/**
 * Get user playlists
 * @param {string} userId - The ID of the user whose playlists to retrieve
 * @returns {Promise<object>} - Promise that resolves with an object containing the user's playlists
 */
export const getUserPlaylists = async (userId) => {
  try {
    // Fixed to handle the index building error
    // Use a simple query until the index is built
    // Just filter by userId without ordering
    const q = query(
      collection(db, "playlists"),
      where("userId", "==", userId)
      // Removed orderBy until the index is built
    );
    
    const querySnapshot = await getDocs(q);
    const playlists = [];
    
    querySnapshot.forEach((doc) => {
      playlists.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort the data in memory after fetching
    playlists.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    return { playlists };
  } catch (error) {
    return handleServiceError(error, "Error getting user playlists");
  }
};

/**
 * Get all playlists with pagination
 * @param {object|null} lastVisible - The last visible document from the previous page
 * @param {number} itemsPerPage - The number of items to return per page
 * @returns {Promise<object>} - Promise that resolves with an object containing the playlists and the last visible document
 */
export const getAllPlaylists = async (lastVisible = null, itemsPerPage = 8) => {
  try {
    console.log(`getAllPlaylists called with lastVisible: ${lastVisible ? 'exists' : 'null'}, itemsPerPage: ${itemsPerPage}`);

    let q;

    // Modified query to avoid Firestore index error
    // We'll fetch playlists ordered by createdAt and filter out hidden ones in memory
    if (lastVisible) {
      q = query(
        collection(db, "playlists"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        // Fetch more items than requested to account for filtering
        limit(itemsPerPage * 2)
      );
    } else {
      q = query(
        collection(db, "playlists"),
        orderBy("createdAt", "desc"),
        // Fetch more items than requested to account for filtering
        limit(itemsPerPage * 2)
      );
    }

    const querySnapshot = await getDocs(q);
    const allPlaylists = [];

    querySnapshot.forEach((doc) => {
      allPlaylists.push({ id: doc.id, ...doc.data() });
    });

    // Filter out hidden playlists in memory
    const playlists = allPlaylists
      .filter(playlist => playlist.isHidden !== true)
      .slice(0, itemsPerPage);

    // Find the last visible document that wasn't filtered out
    const lastVisibleIndex = allPlaylists.findIndex(playlist => 
      playlist.id === playlists[playlists.length - 1]?.id
    );
    
    const lastDoc = lastVisibleIndex >= 0 ? querySnapshot.docs[lastVisibleIndex] : null;

    console.log(`Fetched ${allPlaylists.length} total playlists, filtered to ${playlists.length}, lastDoc: ${lastDoc ? 'exists' : 'null'}`);

    return {
      playlists,
      lastVisible: lastDoc
    };
  } catch (error) {
    return handleServiceError(error, "Failed to load playlists");
  }
};

/**
 * Search playlists
 * @param {string} searchTerm - The search term to use
 * @returns {Promise<object>} - Promise that resolves with an object containing the matching playlists
 */
export const searchPlaylists = async (searchTerm) => {
  try {
    // Firestore doesn't support full-text search natively
    // This is a simple implementation that gets all playlists and filters them
    // In a production app, you might want to use Algolia or a similar service
    const querySnapshot = await getDocs(
      query(collection(db, "playlists"), where("isHidden", "!=", true))
    );
    const playlists = [];
    const searchTermLower = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Check if playlist name or description matches
      const playlistMatches = 
        data.name.toLowerCase().includes(searchTermLower) ||
        (data.description && data.description.toLowerCase().includes(searchTermLower));
      
      // Only include playlists that match by name or description
      // No longer searching in videos
      if (playlistMatches) {
        playlists.push({ id: doc.id, ...data });
      }
    });
    
    return { playlists };
  } catch (error) {
    return handleServiceError(error, "Error searching playlists");
  }
};

/**
 * Add a video to a playlist
 * @param {string} playlistId - The ID of the playlist to add the video to
 * @param {object} videoData - The data for the video to add
 * @returns {Promise<object>} - Promise that resolves with a success flag
 */
export const addVideoToPlaylist = async (playlistId, videoData) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistRef);
    
    if (!playlistDoc.exists()) {
      return { error: "Playlist not found" };
    }
    
    const playlistData = playlistDoc.data();
    const videos = playlistData.videos || [];
    
    // Add the new video
    const updatedVideos = [...videos, { ...videoData, addedAt: new Date().toISOString() }];
    
    await updateDoc(playlistRef, {
      videos: updatedVideos,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return handleServiceError(error, "Error adding video to playlist");
  }
};

/**
 * Remove a video from a playlist
 * @param {string} playlistId - The ID of the playlist to remove the video from
 * @param {number} videoIndex - The index of the video to remove
 * @returns {Promise<object>} - Promise that resolves with a success flag
 */
export const removeVideoFromPlaylist = async (playlistId, videoIndex) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistRef);
    
    if (!playlistDoc.exists()) {
      return { error: "Playlist not found" };
    }
    
    const playlistData = playlistDoc.data();
    const videos = playlistData.videos || [];
    
    // Remove the video at the specified index
    const updatedVideos = videos.filter((_, index) => index !== videoIndex);
    
    await updateDoc(playlistRef, {
      videos: updatedVideos,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return handleServiceError(error, "Error removing video from playlist");
  }
};

/**
 * Update a video's info in a playlist
 * @param {string} playlistId - The ID of the playlist containing the video
 * @param {number} videoIndex - The index of the video to update
 * @param {object} updatedVideoData - The data to update the video with
 * @returns {Promise<object>} - Promise that resolves with a success flag and the updated video data
 */
export const updateVideoInPlaylist = async (playlistId, videoIndex, updatedVideoData) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistRef);
    
    if (!playlistDoc.exists()) {
      return { error: "Playlist not found" };
    }
    
    const playlistData = playlistDoc.data();
    const videos = playlistData.videos || [];
    
    if (videoIndex < 0 || videoIndex >= videos.length) {
      return { error: "Video index out of bounds" };
    }
    
    // Update the video at the specified index, preserving other properties like addedAt
    const updatedVideos = [...videos];
    updatedVideos[videoIndex] = {
      ...videos[videoIndex],
      ...updatedVideoData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(playlistRef, {
      videos: updatedVideos,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, video: updatedVideos[videoIndex] };
  } catch (error) {
    return handleServiceError(error, "Error updating video in playlist");
  }
};

/**
 * Update view count for a playlist
 * @param {string} playlistId - The ID of the playlist to update the view count for
 * @returns {Promise<object>} - Promise that resolves with a success flag
 */
export const updateViewCount = async (playlistId) => {
  try {
    const playlistDocRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistDocRef);
    
    if (!playlistDoc.exists()) {
      return { error: "Playlist not found" };
    }
    
    const currentViewCount = playlistDoc.data().viewCount || 0;
    
    await updateDoc(playlistDocRef, {
      viewCount: currentViewCount + 1
    });
    
    return { success: true };
  } catch (error) {
    return handleServiceError(error, "Error updating view count");
  }
};
