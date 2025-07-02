import React, { useState, useRef } from 'react';
import VideoPlayer from './components/VideoPlayer';
import ChatSection from './components/ChatSection';
import ChatRoomList from './components/ChatRoomList';
import ApiKeyModal from './components/ApiKeyModal';
import IntroSection from './components/IntroSection';
import { getCurrentChatRoom } from './utils/chatRoomManager';
import {
  createVideoToggleHandler,
  createFileUploadHandler,
  createUploadClickHandler,
  createVideoPauseHandler,
  createVideoPlayHandler,
} from './utils/videoHandlers';
import { createSendMessageHandler, createKeyPressHandler, createApiKeySubmitHandler } from './utils/messageHandlers';
import { createSwitchChatRoomHandler, createDeleteChatRoomHandler } from './utils/chatRoomHandlers';
import './App.css';

function App() {
  // 상태 관리
  const [chatRooms, setChatRooms] = useState([]);
  const [currentChatRoomId, setCurrentChatRoomId] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [showChatRoomList, setShowChatRoomList] = useState(false);

  // refs
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // 핸들러 생성
  const handleVideoToggle = createVideoToggleHandler(
    videoRef,
    videoUrl,
    isPlaying,
    setIsPlaying,
    chatRooms,
    setChatRooms,
    setCurrentChatRoomId
  );

  const handleFileUpload = createFileUploadHandler(setVideoFile, setVideoUrl, setIsPlaying);

  const handleUploadClick = createUploadClickHandler(fileInputRef);

  const handleVideoPlay = createVideoPlayHandler(setIsPlaying);

  const handleVideoPause = createVideoPauseHandler(
    videoRef,
    videoUrl,
    setIsPlaying,
    chatRooms,
    setChatRooms,
    setCurrentChatRoomId,
    setShowChatRoomList
  );

  const handleSendMessage = createSendMessageHandler(
    inputMessage,
    setInputMessage,
    chatRooms,
    setChatRooms,
    currentChatRoomId,
    isApiKeySet,
    apiKey,
    videoFile,
    setIsLoading
  );

  const handleKeyPress = createKeyPressHandler(handleSendMessage);

  const handleApiKeySubmit = createApiKeySubmitHandler(
    apiKey,
    setIsApiKeySet,
    chatRooms,
    setChatRooms,
    currentChatRoomId
  );

  const handleSwitchChatRoom = createSwitchChatRoomHandler(setCurrentChatRoomId, setShowChatRoomList);

  const handleDeleteChatRoom = createDeleteChatRoomHandler(
    chatRooms,
    setChatRooms,
    currentChatRoomId,
    setCurrentChatRoomId
  );

  return (
    <div className='app-container'>
      <VideoPlayer
        videoFile={videoFile}
        videoUrl={videoUrl}
        isPlaying={isPlaying}
        videoRef={videoRef}
        fileInputRef={fileInputRef}
        onVideoToggle={handleVideoToggle}
        onVideoPlay={handleVideoPlay}
        onVideoPause={handleVideoPause}
        onFileUpload={handleFileUpload}
        onUploadClick={handleUploadClick}
      />

      {currentChatRoomId ? (
        <>
          <ChatSection
            currentChatRoom={getCurrentChatRoom(chatRooms, currentChatRoomId)}
            chatRooms={chatRooms}
            inputMessage={inputMessage}
            isApiKeySet={isApiKeySet}
            isLoading={isLoading}
            onInputChange={setInputMessage}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            onShowApiModal={() => setShowApiModal(true)}
            onShowChatRoomList={() => setShowChatRoomList(true)}
          />
          {showChatRoomList && (
            <ChatRoomList
              chatRooms={chatRooms}
              currentChatRoomId={currentChatRoomId}
              onSwitchRoom={handleSwitchChatRoom}
              onDeleteRoom={handleDeleteChatRoom}
              onClose={() => setShowChatRoomList(false)}
            />
          )}
        </>
      ) : (
        <IntroSection isApiKeySet={isApiKeySet} onShowApiModal={() => setShowApiModal(true)} />
      )}

      {showApiModal && (
        <ApiKeyModal
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onSubmit={handleApiKeySubmit}
          onClose={() => setShowApiModal(false)}
        />
      )}
    </div>
  );
}

export default App;
