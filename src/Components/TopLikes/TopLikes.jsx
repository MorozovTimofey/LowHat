import PropTypes from "prop-types";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import styles from "../../styles/TopList.module.scss"; // Import styles from shared module

const TopLikes = ({ tracks, onClick }) => {
  const handleTrackClick = (index) => {
    onClick(index);
  };

  return (
    <ul>
      {tracks.map((track, index) => (
        <li
          key={index}
          className={styles.trackItem}
          onClick={() => handleTrackClick(index)}
        >
          <span className={styles.position}>{index + 1}</span>{" "}
          <img
            src={track.image_s3_url}
            alt="Album Art"
            className={styles.trackImage}
          />
          <div className={styles.trackInfo}>
            <p className={styles.trackName}>
              <span>{track.track_name}</span> - {track.artist}
            </p>
            <p>Прослушиваний: {track.listens}</p>
          </div>
          <div className={styles.likeInfo}>
            <p>{track.likes}</p>
            <FavoriteBorderIcon className={styles.likeIcon} />
          </div>
        </li>
      ))}
    </ul>
  );
};

TopLikes.propTypes = {
  tracks: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TopLikes;
