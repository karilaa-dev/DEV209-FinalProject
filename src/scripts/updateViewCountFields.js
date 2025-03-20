import { updatePlaylistsWithoutViewCount } from "../services/playlist.js";

// Run the update function
const updateViewCounts = async () => {
  console.log("Starting update of playlists without viewCount field...");
  
  try {
    const result = await updatePlaylistsWithoutViewCount();
    
    if (result.error) {
      console.error("Error updating playlists:", result.error);
    } else {
      console.log(`Successfully updated ${result.updatedCount} playlists.`);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
  
  console.log("Update process completed.");
};

// Execute the update
updateViewCounts();
