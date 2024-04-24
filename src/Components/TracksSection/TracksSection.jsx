import { useState, useEffect } from "react";
import TopListens from "../TopListens/TopListens";
import TopLikes from "../TopLikes/TopLikes";
import styles from "./TracksSection.module.scss";
import Player from "../../Components/Player/Player";
import withPlayerHandling from "../../HOC/withPlayerHandling"; // Импортируем HOC для обработки плеера

const TracksSection = () => {
  const [tracks, setTracks] = useState([]);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/tracks/")
      .then((response) => response.json())
      .then((data) => setTracks(data))
      .catch((error) => console.error("Error fetching tracks:", error));
  }, []);

  const handleTrackClick = (trackId) => {
    const index = tracks.findIndex((track) => track._id === trackId);
    setSelectedTrackIndex(index);
    setIsPlaying(true);
    fetch(`http://127.0.0.1:8000/tracks/${trackId}/listen`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error updating listens:", error));
  };

  const handleTrackEnd = () => {
    if (selectedTrackIndex !== null && selectedTrackIndex < tracks.length - 1) {
      setSelectedTrackIndex(selectedTrackIndex + 1);
      setIsPlaying(true);
    }
    if (selectedTrackIndex !== null) {
      const trackId = tracks[selectedTrackIndex]._id;
      fetch(`http://127.0.0.1:8000/tracks/${trackId}/listen`, {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error updating listens:", error));
    }
  };

  const sortedTracksByListens = [...tracks].sort(
    (a, b) => b.listens - a.listens
  );
  const sortedTracksByLikes = [...tracks].sort((a, b) => b.likes - a.likes);

  return (
    <section className={styles.tracksSection}>
      <div className={styles.topListens}>
        <h2 className={styles.topLabel}>Топ по прослушиваниям</h2>
        <TopListens
          tracks={sortedTracksByListens.slice(0, 10)}
          onClick={(index) =>
            handleTrackClick(sortedTracksByListens[index]._id)
          }
        />
      </div>
      <div className={styles.topLikes}>
        <h2 className={styles.topLabel}>Топ по лайкам</h2>
        <TopLikes
          tracks={sortedTracksByLikes.slice(0, 10)}
          onClick={(index) => handleTrackClick(sortedTracksByLikes[index]._id)}
        />
      </div>
      {selectedTrackIndex !== null && (
        <Player
          selectedTrack={tracks[selectedTrackIndex]}
          isPlaying={isPlaying}
          togglePlay={() => setIsPlaying(!isPlaying)}
          onEnded={handleTrackEnd}
        />
      )}
    </section>
  );
};

// Оборачиваем компонент TracksSection в HOC для обработки плеера
export default withPlayerHandling(TracksSection);
