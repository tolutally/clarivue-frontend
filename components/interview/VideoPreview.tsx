import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff } from 'lucide-react';

interface VideoPreviewProps {
  onStreamReady?: (stream: MediaStream) => void;
  onError?: (error: Error) => void;
}

/**
 * VideoPreview Component
 * 
 * Handles camera/microphone access and displays live video preview.
 * Used in preflight checks and interview room.
 */
export function VideoPreview({ onStreamReady, onError }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startStream = async () => {
      try {
        setLoading(true);
        setError(null);

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        onStreamReady?.(mediaStream);
        setLoading(false);
      } catch (err) {
        const error = err as Error;
        console.error('Failed to access media devices:', error);
        
        let errorMessage = 'Failed to access camera and microphone.';
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera and microphone access denied. Please grant permissions in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera or microphone found. Please connect a device and try again.';
        }
        
        setError(errorMessage);
        onError?.(error);
        setLoading(false);
      }
    };

    startStream();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onStreamReady, onError]);

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  if (loading) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-sm">Accessing camera...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-red-50 border-2 border-red-200 rounded-lg overflow-hidden flex items-center justify-center p-6">
        <div className="text-center">
          <CameraOff className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-800 text-sm mb-2 font-medium">Camera Access Error</p>
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover mirror"
      />
      
      {!videoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <CameraOff className="w-12 h-12 text-gray-400" />
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-all ${
            videoEnabled
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-red-600 hover:bg-red-500 text-white'
          }`}
          aria-label={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {videoEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
        </button>
        
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full transition-all ${
            audioEnabled
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-red-600 hover:bg-red-500 text-white'
          }`}
          aria-label={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
