import PropTypes from 'prop-types';
import { Upload, Play, Pause } from 'lucide-react';
import styles from './VideoPlayer.module.css';

const VideoPlayer = ({
  videoFile,
  videoUrl,
  isPlaying,
  videoRef,
  fileInputRef,
  onVideoToggle,
  onVideoPlay,
  onVideoPause,
  onVideoSeeking,
  onVideoSeeked,
  onFileUpload,
  onUploadClick,
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>비디오 플레이어</h1>
          <button onClick={onUploadClick} className={styles.uploadButton}>
            <Upload size={20} />
            영상 업로드
          </button>
        </div>

        <input ref={fileInputRef} type='file' accept='video/*' onChange={onFileUpload} style={{ display: 'none' }} />

        <div className={styles.container}>
          {videoUrl ? (
            <video
              key={videoUrl}
              ref={videoRef}
              src={videoUrl}
              className={styles.player}
              onPlay={onVideoPlay}
              onPause={onVideoPause}
              onSeeking={onVideoSeeking}
              onSeeked={onVideoSeeked}
              controls
            >
              비디오를 지원하지 않는 브라우저입니다.
            </video>
          ) : (
            <div className={styles.placeholder}>
              <div>
                <div className={styles.icon}>📹</div>
                <p className={styles.placeholderText}>비디오를 업로드해주세요</p>
              </div>
            </div>
          )}
        </div>

        {videoFile && (
          <div className={styles.fileInfo}>
            <p className={styles.detail}>
              <strong>파일명:</strong> {videoFile.name}
            </p>
            <p className={styles.detail}>
              <strong>크기:</strong> {(videoFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className={styles.detail}>
              <strong>형식:</strong> {videoFile.type}
            </p>
          </div>
        )}

        {videoUrl && (
          <div className={styles.controls}>
            <button onClick={onVideoToggle} className={styles.playButton}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? '일시정지' : '재생'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

VideoPlayer.propTypes = {
  videoFile: PropTypes.object,
  videoUrl: PropTypes.string,
  isPlaying: PropTypes.bool.isRequired,
  videoRef: PropTypes.object.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  onVideoToggle: PropTypes.func.isRequired,
  onVideoPlay: PropTypes.func.isRequired,
  onVideoPause: PropTypes.func.isRequired,
  onVideoSeeking: PropTypes.func.isRequired,
  onVideoSeeked: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  onUploadClick: PropTypes.func.isRequired,
};

export default VideoPlayer;
