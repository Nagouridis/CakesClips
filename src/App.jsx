import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const FOLDER_ID = import.meta.env.VITE_FOLDER_ID;

const GAMES = ["Monster Hunter Wilds", "Valorant", "Fall Guys", "Peak"];

function getGameName(filename) {
  return GAMES.find((game) => filename.startsWith(game)) || "Other";
}

function groupByGame(videos) {
  const groups = {};
  videos.forEach((video) => {
    const game = getGameName(video.name);
    if (!groups[game]) groups[game] = [];
    groups[game].push(video);
  });
  return groups;
}

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
        setVideos(data.files || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const grouped = groupByGame(videos);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

    
      <header className="bg-gray-900 border-b border-gray-800 px-8 py-5">
        <h1 className="text-3xl font-bold tracking-wide text-white">🎮 Cakes Clips</h1>
        <p className="text-gray-400 text-sm mt-1">A collection of my best game moments</p>
      </header>

      <main className="px-8 py-8 space-y-12">
        {loading && (
          <p className="text-gray-400 text-center mt-20 text-lg">Loading clips...</p>
        )}

        {GAMES.filter((game) => grouped[game]).map((game) => (
          <section key={game}>
            <div className="flex items-center gap-4 mb-5">
              <h2 className="text-xl font-bold text-white">{game}</h2>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                {grouped[game].length} clips
              </span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {grouped[game].map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
                >
                  <iframe
                    src={`https://drive.google.com/file/d/${video.id}/preview`}
                    width="100%"
                    height="200"
                    style={{ pointerEvents: "none", display: "block" }}
                    allow="autoplay"
                  />
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {video.name.replace(game, "").trim() || video.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {grouped["Other"] && (
          <section>
            <div className="flex items-center gap-4 mb-5">
              <h2 className="text-xl font-bold text-white">Other</h2>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                {grouped["Other"].length} clips
              </span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {grouped["Other"].map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
                >
                  <iframe
                    src={`https://drive.google.com/file/d/${video.id}/preview`}
                    width="100%"
                    height="200"
                    style={{ pointerEvents: "none", display: "block" }}
                    allow="autoplay"
                  />
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-200 truncate">{video.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl overflow-hidden w-full max-w-3xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <p className="font-semibold text-white truncate">{selectedVideo.name}</p>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white text-xl transition-colors"
              >
                x
              </button>
            </div>
            <iframe
              src={`https://drive.google.com/file/d/${selectedVideo.id}/preview`}
              width="100%"
              height="450"
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;