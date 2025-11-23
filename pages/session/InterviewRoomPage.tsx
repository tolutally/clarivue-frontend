import { useState, useEffect, useRef } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { LogOut, User, Sparkles, Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function InterviewRoomPage() {
  const { sessionData, clearSession } = useSession();
  const [startTime] = useState(Date.now());
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<MediaStream | null>(null);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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
      } catch {}
    };

    initMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (screenShareRef.current) {
        screenShareRef.current.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenShareRef.current) {
        screenShareRef.current.getTracks().forEach(track => track.stop());
        screenShareRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

        screenShareRef.current = screenStream;
        setIsScreenSharing(true);

        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenShareRef.current = null;
        };
      } catch {}
    }
  };

  const handleLeaveInterview = () => {
    const originalToken = sessionData?.original_token;
    const sessionsRemaining = sessionData?.sessions_remaining;

    let targetUrl: string;
    const shouldClearSession =
      sessionsRemaining === 0 ||
      !originalToken ||
      sessionsRemaining === null ||
      sessionsRemaining === undefined;

    if (sessionsRemaining === 0) {
      targetUrl = '/login';
    } else if (!originalToken) {
      targetUrl = '/login';
    } else if (sessionsRemaining === null || sessionsRemaining === undefined) {
      targetUrl = '/login';
    } else if (sessionsRemaining > 0) {
      targetUrl = `/session/join?token=${originalToken}`;
    } else {
      targetUrl = '/login';
    }

    if (shouldClearSession) {
      clearSession();
    }

    window.location.href = targetUrl;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-white">Mock Interview</h1>
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
          </div>

          <Button
            onClick={() => setShowLeaveModal(true)}
            variant="destructive"
            size="sm"
            startIcon={<LogOut className="w-4 h-4" />}
          >
            Leave Interview
          </Button>
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
            <div className="relative bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-lg overflow-hidden flex items-center justify-center">
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
              <Button
                onClick={() => setShowLeaveModal(false)}
                variant="outline"
                className="flex-1"
              >
                Stay
              </Button>
              <Button
                onClick={handleLeaveInterview}
                variant="destructive"
                className="flex-1"
              >
                End Interview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

