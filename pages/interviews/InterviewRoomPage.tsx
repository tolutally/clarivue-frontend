import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBackend } from '../../contexts/AuthContext';
import { InterviewTimer } from '../../components/interview/InterviewTimer';
import { LoadingState } from '../../components/interview/LoadingState';
import { LogOut, User, Sparkles, Video, VideoOff, Mic, MicOff, Monitor, MonitorOff } from 'lucide-react';

/**
 * InterviewRoomPage
 * 
 * Route: /session/:sessionId/interview
 * 
 * Purpose: Main mock interview interface with WebRTC placeholder.
 * 
 * Layout:
 * - Header: Title, Timer, Leave button
 * - Main: Two video tiles (Student + AI Avatar)
 * - Bottom: State indicator
 * 
 * State machine: idle → asking → listening → thinking → [repeat] → finished
 * 
 * For MVP: Simulates state transitions. WebRTC integration comes later.
 */
export function InterviewRoomPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  
  const [rtcToken, setRtcToken] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  
  // Media controls
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<MediaStream | null>(null);

  // Initialize camera and microphone
  useEffect(() => {
    const initMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Failed to access camera/microphone:', err);
      }
    };

    initMedia();

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (screenShareRef.current) {
        screenShareRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const initialize = async () => {
      if (!sessionId) {
        navigate('/');
        return;
      }

      try {
        // Get RTC token
        const response = await backend.interviews.getRTCToken(sessionId);
        setRtcToken(response.token);
        setRoomUrl(response.roomUrl);
        
        console.log('RTC Token:', response.token);
        console.log('Room URL:', response.roomUrl);
        console.log('Connected to interview room (mocked)');
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize interview:', err);
        setLoading(false);
      }
    };

    initialize();
  }, [sessionId, backend, navigate]);

  // Toggle camera
  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenShareRef.current) {
        screenShareRef.current.getTracks().forEach(track => track.stop());
        screenShareRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        
        screenShareRef.current = screenStream;
        setIsScreenSharing(true);

        // Listen for when user stops sharing via browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenShareRef.current = null;
        };
      } catch (err) {
        console.error('Failed to start screen sharing:', err);
      }
    }
  };

  const handleLeaveInterview = async () => {
    if (!sessionId) return;

    try {
      await backend.interviews.completeInterview(sessionId);
      navigate(`/session/${sessionId}/complete`);
    } catch (err) {
      console.error('Failed to complete interview:', err);
      // Navigate anyway
      navigate(`/session/${sessionId}/complete`);
    }
  };

  if (loading) {
    return <LoadingState message="Connecting to interview room..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-white">Mock Interview</h1>
            <InterviewTimer startTime={startTime} />
          </div>
          
          <button
            onClick={() => setShowLeaveModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Leave Interview
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto h-full">
          {/* Video Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6 h-[calc(100vh-250px)]">
            {/* Student Video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
                <User className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">You</span>
              </div>
              
              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              
              {/* Camera Off Overlay */}
              {!isCameraOn && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <VideoOff className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">Camera Off</p>
                  </div>
                </div>
              )}
              
              {/* Video Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {/* Camera Toggle */}
                <button
                  onClick={toggleCamera}
                  className={`p-3 rounded-full transition-colors ${
                    isCameraOn 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                
                {/* Mic Toggle */}
                <button
                  onClick={toggleMic}
                  className={`p-3 rounded-full transition-colors ${
                    isMicOn 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                
                {/* Screen Share Toggle */}
                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-full transition-colors ${
                    isScreenSharing
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  title={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
                >
                  {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Mic Status Indicator */}
              {!isMicOn && (
                <div className="absolute top-4 right-4 bg-red-600 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <MicOff className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Muted</span>
                </div>
              )}
            </div>

            {/* AI Avatar Placeholder */}
            <div className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">AI Interviewer</span>
              </div>
              
              <div className="text-center p-8">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <p className="text-white text-lg font-medium mb-2">AI Avatar</p>
                <p className="text-white/60 text-sm">WebRTC integration placeholder</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Leave Interview Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              End Interview?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end this mock interview? Your progress will be saved.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Stay
              </button>
              <button
                onClick={handleLeaveInterview}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
