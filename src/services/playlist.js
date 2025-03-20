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

// Create a new playlist
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
    console.error("Error creating playlist: ", error);
    return { error };
  }
};

// Get a playlist by ID
export const getPlaylist = async (playlistId) => {
  try {
    const playlistDoc = await getDoc(doc(db, "playlists", playlistId));
    
    if (playlistDoc.exists()) {
      return { playlist: { id: playlistDoc.id, ...playlistDoc.data() } };
    } else {
      return { error: "Playlist not found" };
    }
  } catch (error) {
    return { error };
  }
};

// Update a playlist
export const updatePlaylist = async (playlistId, playlistData) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    
    await updateDoc(playlistRef, {
      ...playlistData,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Delete a playlist
export const deletePlaylist = async (playlistId) => {
  try {
    await deleteDoc(doc(db, "playlists", playlistId));
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Get user playlists
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
    return { error };
  }
};

// Get all playlists with pagination
export const getAllPlaylists = async (lastVisible = null, itemsPerPage = 8) => {
  try {
    let q;
    
    if (lastVisible) {
      q = query(
        collection(db, "playlists"),
        // Add filter to exclude hidden playlists
        where("isHidden", "!=", true),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(itemsPerPage)
      );
    } else {
      q = query(
        collection(db, "playlists"),
        // Add filter to exclude hidden playlists
        where("isHidden", "!=", true),
        orderBy("createdAt", "desc"),
        limit(itemsPerPage)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const playlists = [];
    
    querySnapshot.forEach((doc) => {
      playlists.push({ id: doc.id, ...doc.data() });
    });
    
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { 
      playlists,
      lastVisible: lastDoc
    };
  } catch (error) {
    // Add fallback logic for index errors
    if (error.code === 'failed-precondition') {
      // Handle the index building error by fetching without ordering
      const simpleQuery = query(
        collection(db, "playlists"),
        where("isHidden", "!=", true),
        limit(itemsPerPage)
      );
      
      const querySnapshot = await getDocs(simpleQuery);
      const playlists = [];
      
      querySnapshot.forEach((doc) => {
        playlists.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort in memory
      playlists.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      return { 
        playlists: playlists.slice(0, itemsPerPage),
        lastVisible: null, // Disable pagination temporarily
        indexBuilding: true
      };
    }
    return { error };
  }
};

// Search playlists
export const searchPlaylists = async (searchTerm) => {
  try {
    // Firestore doesn't support full-text search natively
    // This is a simple implementation that gets all playlists and filters them
    // In a production app, you might want to use Algolia or a similar service
    const querySnapshot = await getDocs(
      query(collection(db, "playlists"), where("isHidden", "!=", true))
    );
    const playlists = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (data.description && data.description.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        playlists.push({ id: doc.id, ...data });
      }
    });
    
    return { playlists };
  } catch (error) {
    return { error };
  }
};

// Add a video to a playlist
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
    return { error };
  }
};

// Remove a video from a playlist
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
    return { error };
  }
};

// Update a video's info in a playlist
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
    return { error };
  }
};

// Update view count for a playlist
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
    console.error("Error updating view count: ", error);
    return { error };
  }
};

// Update playlists without viewCount field
export const updatePlaylistsWithoutViewCount = async () => {
  try {
    // Get all playlists
    const querySnapshot = await getDocs(collection(db, "playlists"));
    
    // Update playlists without viewCount
    const updatePromises = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.viewCount === undefined) {
        updatePromises.push(
          updateDoc(doc.ref, { viewCount: 0 })
        );
      }
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    return { 
      success: true, 
      updatedCount: updatePromises.length 
    };
  } catch (error) {
    console.error("Error updating playlists without view count: ", error);
    return { error };
  }
};
