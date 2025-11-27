import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InterviewHeader } from '@/components/interview/InterviewHeader';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, CheckCircle, XCircle } from 'lucide-react';

export function PreflightPage() {
  const navigate = useNavigate();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        
        const videoTrack = mediaStream.getVideoTracks()[0];
        const audioTrack = mediaStream.getAudioTracks()[0];
        
        setIsCameraOn(videoTrack?.enabled || false);
        setIsMicOn(audioTrack?.enabled || false);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        
        setCameraError(null);
        setMicError(null);
      } catch (err: any) {
        console.error('Failed to access camera/microphone:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError('Camera and microphone access was denied. Please allow access and try again.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError('No camera or microphone found. Please connect a device and try again.');
        } else {
          setCameraError('Failed to access camera and microphone. Please check your device settings.');
        }
      }
    };

    initMedia();

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update video element when stream changes
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

  const handleContinue = () => {
    if (isCameraOn && isMicOn) {
      navigate('/session/start');
    }
  };

  const canContinue = isCameraOn && isMicOn && !cameraError && !micError;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <InterviewHeader currentStep={4} totalSteps={6} stepLabel="Camera & Microphone Check" />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Camera & Microphone Check
            </h1>
            <p className="text-slate-600">
              Let's make sure your camera and microphone are working properly before we start.
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Video Preview */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                {stream && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                )}
                {!stream && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <VideoOff className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">No video feed</p>
                    </div>
                  </div>
                )}
                {!isCameraOn && stream && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <VideoOff className="w-16 h-16 mx-auto mb-2" />
                      <p className="text-sm">Camera Off</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Messages */}
              {cameraError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{cameraError}</p>
                </div>
              )}

              {/* Status Indicators */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 ${
                  isCameraOn ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    {isCameraOn ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="font-semibold text-slate-900">Camera</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {isCameraOn ? 'Camera is working' : 'Camera is off'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  isMicOn ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    {isMicOn ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="font-semibold text-slate-900">Microphone</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {isMicOn ? 'Microphone is working' : 'Microphone is off'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  type="button"
                  onClick={toggleCamera}
                  variant={isCameraOn ? "outline" : "default"}
                  startIcon={isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                >
                  {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
                </Button>
                <Button
                  type="button"
                  onClick={toggleMic}
                  variant={isMicOn ? "outline" : "default"}
                  startIcon={isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                >
                  {isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={() => navigate('/session/setup')}
                  variant="outline"
                  startIcon={<ArrowLeft className="w-5 h-5" aria-hidden="true" />}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleContinue}
                  disabled={!canContinue}
                  variant="primary"
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

