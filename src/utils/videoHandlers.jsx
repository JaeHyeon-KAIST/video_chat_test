import { captureVideoFrame } from './openai';
import { findOrCreateChatRoom } from './chatRoomManager';

// 비디오 재생/일시정지 핸들러
export const createVideoToggleHandler = (
  videoRef,
  videoUrl,
  isPlaying,
  setIsPlaying,
  chatRooms,
  setChatRooms,
  setCurrentChatRoomId
) => {
  return () => {
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
  setIsPlaying,
  chatRooms,
  setChatRooms,
  setCurrentChatRoomId,
  setShowChatRoomList
) => {
  return () => {
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
export const createFileUploadHandler = (setVideoFile, setVideoUrl, setIsPlaying) => {
  return (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsPlaying(false);
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
