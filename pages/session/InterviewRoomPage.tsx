import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { LogOut, User, Sparkles, Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionManager, type TranscriptMessage } from '@/lib/sessionManager';
import { useToast } from '@/hooks/useToast';

export function InterviewRoomPage() {
  const navigate = useNavigate();
  const { sessionData, clearSession } = useSession();
  const toast = useToast();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
  const [transcriptMessages, setTranscriptMessages] = useState<TranscriptMessage[]>([]);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<MediaStream | null>(null);
  const sessionManagerRef = useRef<SessionManager | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);
  const timerInitializedRef = useRef(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);

  // Initialize AI session
  useEffect(() => {
    const initializeSession = async () => {
      if (hasInitializedRef.current) {
        console.log('InterviewRoomPage already initialized - skipping duplicate run');
        return;
      }
      if (!sessionData?.session_access_token || !sessionData?.time_limit_minutes) {
        setSessionError('Missing session data. Please start over.');
        setIsInitializing(false);
        return;
      }

      if (!sessionData?.session_log_id) {
        setSessionError('Session is not initialized. Please return to the previous step and start the interview again.');
        setIsInitializing(false);
        return;
      }

      try {
        setIsInitializing(true);
        setSessionError(null);
        hasInitializedRef.current = true;

        // Create session manager (uses localhost:8000 by default for local Docker)
        const sessionManager = new SessionManager();
        sessionManagerRef.current = sessionManager;

        // Set up callbacks
        sessionManager.onStatusChange = (status) => {
          setConnectionStatus(status);
          if ((status === 'Connected' || status === 'AI Ready') && !timerInitializedRef.current) {
            sessionStartTimeRef.current = Date.now();
            timerInitializedRef.current = true;
            setSessionStarted(true);
            setIsInitializing(false);
            console.log('Timer initialized from status change at', sessionStartTimeRef.current);
          } else if (status === 'Connected' || status === 'AI Ready') {
            setIsInitializing(false);
          }
        };

        sessionManager.onTranscriptUpdate = (message) => {
          setTranscriptMessages((prev) => [...prev, message]);
        };

        sessionManager.onError = (errorMessage) => {
          let readableError: string;
          if (typeof errorMessage === 'string') {
            readableError = errorMessage;
          } else if (errorMessage && typeof errorMessage === 'object' && 'message' in errorMessage) {
            const msg = (errorMessage as { message?: string }).message;
            readableError = msg && typeof msg === 'string' ? msg : JSON.stringify(errorMessage);
          } else {
            readableError = String(errorMessage ?? 'Unknown error');
          }
          setSessionError(readableError);
          toast.error('Session Error', readableError);
          setIsInitializing(false);
        };

        sessionManager.onSessionAutoEnded = () => {
          toast.error('Session Ended', 'Your interview session has ended automatically.');
          handleLeaveInterview(true);
        };

        console.log('Using session_log_id from context:', sessionData.session_log_id);
        sessionManager.setSessionLogId(sessionData.session_log_id);

        // STEP 2: Create WebRTC session
        // Map session_type to valid API values: 'interview_prep', 'sales_practice', 'coaching', or 'presentation'
        const mapSessionType = (type: string | null | undefined): string => {
          if (!type) return 'interview_prep'; // Default to interview_prep
          
          // Map common variations to valid types
          const normalized = type.toLowerCase().trim();
          if (normalized === 'interview' || normalized === 'interview_prep') {
            return 'interview_prep';
          }
          if (normalized === 'sales' || normalized === 'sales_practice') {
            return 'sales_practice';
          }
          if (normalized === 'coaching') {
            return 'coaching';
          }
          if (normalized === 'presentation') {
            return 'presentation';
          }
          
          // If it's already a valid type, return as-is
          if (['interview_prep', 'sales_practice', 'coaching', 'presentation'].includes(normalized)) {
            return normalized;
          }
          
          // Default fallback
          return 'interview_prep';
        };
        
        const sessionType = mapSessionType(sessionData.session_type);
        const durationMinutes = sessionData.time_limit_minutes || 30;
        
        // Clear any old session ID first
        localStorage.removeItem('ai_session_id');
        
        const sessionId = await sessionManager.startSession({
          session_type: sessionType,
          duration_minutes: durationMinutes,
          role_title: sessionData.role_title || undefined,
          job_description: sessionData.job_description || undefined,
        });

        console.log('WebRTC session started, session ID from API:', sessionId);

        // Store session ID for completion page - ensure it's the actual session_id from API
        if (sessionId && typeof sessionId === 'string' && sessionId.length > 0) {
          localStorage.setItem('ai_session_id', sessionId);
          console.log('Stored actual session ID in localStorage:', sessionId);
        } else {
          console.error('Invalid session ID returned from startSession():', sessionId);
          throw new Error('Failed to get valid session ID from API');
        }

        console.log('Session creation complete, awaiting AI Ready to start timer');
      } catch (error: any) {
        hasInitializedRef.current = false;
        console.error('Failed to initialize session:', error);
        const errorMsg = error?.message || 'Failed to start interview session';
        setSessionError(errorMsg);
        toast.error('Session Error', errorMsg);
        setIsInitializing(false);
      }
    };

    initializeSession();

    // Cleanup on unmount
    return () => {
      timerInitializedRef.current = false;
      sessionStartTimeRef.current = null;
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (sessionManagerRef.current) {
        sessionManagerRef.current.destroy().catch(err => {
          console.error('Error during session manager cleanup:', err);
        });
        sessionManagerRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Timer effect - runs when session starts
  useEffect(() => {
    console.log('Timer effect running, sessionStarted:', sessionStarted, 'startTimeRef:', sessionStartTimeRef.current);
    
    if (!sessionStarted) {
      console.log('Timer effect: session not started yet, waiting...');
      return;
    }
    
    if (!sessionStartTimeRef.current) {
      console.warn('Timer effect: session started but no startTime ref');
      return;
    }

    // Clear any existing timer
    if (timerIntervalRef.current) {
      console.log('Timer effect: clearing existing timer');
      clearInterval(timerIntervalRef.current);
    }

    // Update immediately to show 00:00
    setElapsedTime(0);

    // Start the timer interval
    console.log('Setting up timer interval, startTime:', sessionStartTimeRef.current);
    
    timerIntervalRef.current = setInterval(() => {
      if (sessionStartTimeRef.current) {
        const elapsed = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
        console.log('Timer tick:', elapsed, 'seconds');
        setElapsedTime(elapsed);
      } else {
        console.warn('Timer tick but no startTime ref');
      }
    }, 1000);

    console.log('Timer started, startTime:', sessionStartTimeRef.current, 'interval ID:', timerIntervalRef.current);

    // Cleanup timer on unmount or when session ends
    return () => {
      console.log('Timer effect cleanup');
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [sessionStarted]); // Re-run when session starts

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
      } catch (error) {
        console.error('Failed to initialize media:', error);
        toast.error('Media Error', 'Failed to access camera or microphone. Please check your permissions.');
      }
    };

    initMedia();

    return () => {
      // Clean up media tracks on unmount
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped media track on unmount:', track.kind, track.id);
        });
        setStream(null);
      }
      if (screenShareRef.current) {
        screenShareRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped screen share track on unmount:', track.kind, track.id);
        });
        screenShareRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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
      } catch (error) {
        console.error('Failed to start screen share:', error);
      }
    }
  };

  const handleLeaveInterview = async (autoEnded: boolean = false) => {
    const manager = sessionManagerRef.current;
    const sessionId = manager?.getSessionId();

    // Stop all media tracks immediately
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped media track:', track.kind, track.id);
      });
      setStream(null);
    }

    if (screenShareRef.current) {
      screenShareRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped screen share track:', track.kind, track.id);
      });
      screenShareRef.current = null;
      setIsScreenSharing(false);
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Tear down WebRTC as quickly as possible to stop offer calls
    if (manager) {
      try {
        await manager.destroy();
        console.log('Session manager destroyed, WebRTC connections closed');
      } catch (error) {
        console.error('Error destroying session manager:', error);
        try {
          await manager.cleanup();
        } catch (cleanupError) {
          console.error('Error during cleanup fallback:', cleanupError);
        }
      }
      sessionManagerRef.current = null;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    timerInitializedRef.current = false;
    sessionStartTimeRef.current = null;
    setSessionStarted(false);
    setElapsedTime(0);

    if (sessionId) {
      localStorage.setItem('ai_session_id', sessionId);
    }

    navigate('/session/complete', { replace: true });
  };

  // Show error state
  if (sessionError && !isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Error</h2>
          <p className="text-gray-600 mb-6">{sessionError}</p>
          <Button onClick={() => handleLeaveInterview()} variant="destructive" className="w-full">
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

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
            {isInitializing && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{connectionStatus}</span>
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowLeaveModal(true)}
            variant="destructive"
            size="sm"
            startIcon={<LogOut className="w-4 h-4" />}
            disabled={isInitializing}
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

            {/* AI Avatar Section */}
            <div className="relative bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">AI Interviewer</span>
              </div>

              {isInitializing ? (
                <div className="text-center p-8">
                  <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
                  <p className="text-white text-lg font-medium mb-2">Connecting to AI...</p>
                  <p className="text-white/60 text-sm">{connectionStatus}</p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white text-lg font-medium mb-2">AI Interviewer</p>
                  <p className="text-white/60 text-sm mb-4">{connectionStatus}</p>
                  
                  {/* Transcript Preview */}
                  {transcriptMessages.length > 0 && (
                    <div className="mt-4 max-h-32 overflow-y-auto text-left bg-black/20 rounded-lg p-3 text-xs text-white/80">
                      {transcriptMessages.slice(-3).map((msg, idx) => (
                        <div key={idx} className="mb-1">
                          <span className="font-semibold">{msg.role === 'user' ? 'You' : 'AI'}:</span>{' '}
                          <span>{msg.content}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                onClick={() => {
                  setShowLeaveModal(false);
                  handleLeaveInterview();
                }}
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
