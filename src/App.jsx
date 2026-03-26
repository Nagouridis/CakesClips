import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const FOLDER_ID = import.meta.env.VITE_FOLDER_ID;

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'video'&key=${API_KEY}&fields=files(id,name,thumbnailLink)`
        );
        const data = await res.json();
        console.log("Drive API response:", data);
        setVideos(data.files || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <h1>Cakes Clips</h1>

      {loading && <p>Loading videos...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            style={{ cursor: "pointer", border: "1px solid #ccc", padding: "8px" }}
          >
            <iframe
              src={`https://drive.google.com/file/d/${video.id}/preview`}
              width="100%"
              height="200"
              style={{ pointerEvents: "none", display: "block" }}
              allow="autoplay"
            />
            <p style={{ padding: "8px", textAlign: "center" }}>{video.name}</p>
          </div>
      ))}
      </div>

      {selectedVideo && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.8)", display: "flex",
          alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "white", padding: "16px", width: "800px" }}>
            <button onClick={() => setSelectedVideo(null)}>Close</button>
            <iframe
              src={`https://drive.google.com/file/d/${selectedVideo.id}/preview`}
              width="100%"
              height="450"
              allow="autoplay"
            />
            <p>{selectedVideo.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;