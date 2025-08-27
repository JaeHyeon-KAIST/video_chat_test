import { captureVideoFrame } from './openai';
import { findOrCreateChatRoom } from './chatRoomManager';
import { uploadVideo } from '../api/video';
import { saveChatRoom } from '../api/chat';

// 비디오 재생/일시정지 핸들러
export const createVideoToggleHandler = (
  videoRef,
  videoUrl,
  videoId,
  isPlaying,
  setIsPlaying,
  chatRooms,
  setChatRooms,
  setCurrentChatRoomId
) => {
  return async () => {
    if (videoRef.current && videoUrl) {
      if (isPlaying) {
        videoRef.current.pause();
        // 비디오가 일시정지될 때 채팅방 찾기 또는 생성
        const frameData = captureVideoFrame(videoRef, videoUrl);
        if (frameData) {
          const frameTime = new Date();
          const videoCurrentTime = videoRef.current.currentTime;

          const { room, isNew } = findOrCreateChatRoom(chatRooms, frameData, frameTime, videoCurrentTime);

          if (isNew) {
            // 새 채팅방 생성
            setChatRooms((prev) => [...prev, room]);
            console.log('새 채팅방 생성 - 프레임 캡처 완료:', Math.round(frameData.length / 1024), 'KB');

            if (videoId) {
              try {
                await saveChatRoom(room, videoId);
              } catch (error) {
                console.error('Failed to save new chat room to backend:', error);
              }
            }
          } else {
            console.log('기존 채팅방으로 이동:', room.name);
          }

          // 해당 채팅방으로 이동
          setCurrentChatRoomId(room.id);
        }
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
};

// 비디오 일시정지 핸들러 (비디오 컨트롤에서 직접 호출)
export const createVideoPauseHandler = (
  videoRef,
  videoUrl,
  videoId,
  setIsPlaying,
  chatRooms,
  setChatRooms,
  setCurrentChatRoomId,
  setShowChatRoomList
) => {
  return async () => {
    setIsPlaying(false);
    // 일시정지 시 채팅방 생성
    if (videoRef.current && videoUrl) {
      const frameData = captureVideoFrame(videoRef, videoUrl);
      if (frameData) {
        const frameTime = new Date();
        const videoCurrentTime = videoRef.current.currentTime;

        const { room, isNew } = findOrCreateChatRoom(chatRooms, frameData, frameTime, videoCurrentTime);

        if (isNew) {
          setChatRooms((prev) => [...prev, room]);
          console.log('새 채팅방 생성 - 프레임 캡처 완료:', Math.round(frameData.length / 1024), 'KB');

          try {
            await saveChatRoom(room, videoId);
          } catch (error) {
            console.error('Failed to save new chat room to backend:', error);
          }
        } else {
          console.log('기존 채팅방으로 이동:', room.name);
        }

        setCurrentChatRoomId(room.id);
        // 채팅방 목록 모달이 열려있다면 닫기
        setShowChatRoomList(false);
      }
    }
  };
};

// 비디오 재생 핸들러 (비디오 컨트롤에서 직접 호출)
export const createVideoPlayHandler = (setIsPlaying) => {
  return () => {
    setIsPlaying(true);
  };
};

// 파일 업로드 핸들러
export const createFileUploadHandler = (setVideoFile, setVideoUrl, setVideoId, setIsPlaying) => {
  return async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsPlaying(false);

      try {
        const title = file.name || 'untitled';
        const metadata = {
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };

        // 서버 업로드 실행
        const result = await uploadVideo(file, title, metadata);
        console.log('업로드 완료:', result);

        if (result?.video_id) {
          setVideoId(result.video_id);
        }
      } catch (err) {
        console.error('업로드 실패:', err);
        alert('영상 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } else {
      alert('비디오 파일만 업로드 가능합니다.');
    }
  };
};

// 업로드 클릭 핸들러
export const createUploadClickHandler = (fileInputRef) => {
  return () => {
    fileInputRef.current?.click();
  };
};
