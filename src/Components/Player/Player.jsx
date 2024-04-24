import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import {
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
  VolumeUp,
} from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton } from "@mui/material";
import styles from "./Player.module.scss";

const Player = ({
  selectedTrack,
  isPlaying,
  togglePlay,
  onEnded,
  onPrevious,
  onNext,
}) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [prevTime, setPrevTime] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // Состояние лайка

  // Получаем токен доступа из cookie
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token"))
    ?.split("=")[1];

  useEffect(() => {
    const loadAndPlayAudio = async () => {
      const audioElement = audioRef.current;
      if (audioElement && selectedTrack.audio_s3_url !== audioElement.src) {
        audioElement.src = selectedTrack.audio_s3_url;
        await audioElement.load();
        audioElement
          .play()
          .catch((error) => console.error("Error playing audio:", error));
      }
    };

    loadAndPlayAudio().catch((error) =>
      console.error("Error loading audio:", error)
    );

    return () => {
      // Cleanup if necessary
    };
  }, [selectedTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      audioRef.current.volume = volume;
    }
  }, [isPlaying, volume]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener("ended", handleTrackEnded);
      audioElement.addEventListener("timeupdate", updateTime);
      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.addEventListener("canplaythrough", handleCanPlayThrough);

      return () => {
        audioElement.removeEventListener("ended", handleTrackEnded);
        audioElement.removeEventListener("timeupdate", updateTime);
        audioElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioElement.removeEventListener(
          "canplaythrough",
          handleCanPlayThrough
        );
      };
    }
  }, []);

  const handleTrackEnded = () => {
    if (onEnded) {
      onEnded();
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
    setIsLoaded(true);
  };

  const updateTime = () => {
    const newTime = audioRef.current.currentTime;
    if (newTime > prevTime) {
      setCurrentTime(newTime);
      setPrevTime(newTime);
    }
  };

  const handleProgressBarMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleProgressBarMouseMove = (event) => {
    if (isMouseDown) {
      const clickedPosition =
        event.clientX - event.target.getBoundingClientRect().left;
      const progressBarWidth = event.target.clientWidth;
      const newTime = (clickedPosition / progressBarWidth) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setPrevTime(newTime);
    }
  };

  const handleProgressBarClick = (event) => {
    if (!isMouseDown) {
      const clickedPosition =
        event.clientX - event.target.getBoundingClientRect().left;
      const progressBarWidth = event.target.clientWidth;
      const newTime = (clickedPosition / progressBarWidth) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setPrevTime(newTime);
    }
  };

  const handleVolumeIconClick = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    if (!isNaN(newVolume) && newVolume >= 0 && newVolume <= 1) {
      setVolume(newVolume);
    }
  };

  const handleCanPlayThrough = () => {
    setIsLoaded(true);
  };

  const toggleLike = () => {
    // Проверяем наличие токена доступа
    if (accessToken) {
      setIsLiked(!isLiked);
      // Добавляем логику отправки запроса на сервер для добавления лайка
      if (!isLiked) {
        fetch(
          `http://127.0.0.1:8000/favorites/?track_id=${selectedTrack._id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to add like");
            }
            // Обработка успешного добавления лайка
          })
          .catch((error) => {
            console.error("Error adding like:", error);
            // Обработка ошибки при добавлении лайка
          });
      }
    } else {
      // Обработка случая, когда пользователь не вошел в аккаунт
      alert("Пожалуйста, войдите в аккаунт");
    }
  };

  return (
    <div className={styles.player}>
      <div
        className={styles.progressBar}
        onMouseDown={handleProgressBarMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleProgressBarMouseMove}
        onClick={handleProgressBarClick}
      >
        {isLoaded && (
          <div
            className={styles.progress}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        )}
      </div>
      <div className={styles.controls}>
        <div className={styles.trackInfo}>
          <img src={selectedTrack.image_s3_url} alt="Album Art" />
          <div>
            <p>{selectedTrack.track_name}</p>
            <p>{selectedTrack.artist}</p>
          </div>
        </div>
        <div>
          <IconButton onClick={onPrevious}>
            <SkipPrevious />
          </IconButton>
          <IconButton onClick={togglePlay}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton onClick={onNext}>
            <SkipNext />
          </IconButton>
        </div>

        <div className={styles.volumeControl}>
          <IconButton onClick={toggleLike}>
            {isLiked ? (
              <FavoriteIcon style={{ color: "#ff4081" }} />
            ) : (
              <FavoriteBorderIcon style={{ color: "#ff4081" }} />
            )}
          </IconButton>
          <IconButton onClick={handleVolumeIconClick}>
            <VolumeUp />
          </IconButton>
          {showVolumeSlider && (
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className={`${styles.volumeSlider} ${styles.vertical}`}
            />
          )}
        </div>
      </div>
      <audio ref={audioRef} onTimeUpdate={updateTime} />
    </div>
  );
};

Player.propTypes = {
  selectedTrack: PropTypes.shape({
    image_s3_url: PropTypes.string.isRequired,
    track_name: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    audio_s3_url: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired, // Добавляем проверку для _id
  }).isRequired,
  isPlaying: PropTypes.bool.isRequired,
  togglePlay: PropTypes.func.isRequired,
  onEnded: PropTypes.func,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
};

export default Player;
