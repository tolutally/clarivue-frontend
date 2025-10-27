import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { OnboardingLayout } from '@/components/mockinterviews/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  XCircle, 
  Mic, 
  Video, 
  Wifi, 
  Sun, 
  Volume2,
  Play,
  AlertCircle,
  Loader2
} from 'lucide-react';
import backend from '~backend/client';

type PermissionStatus = 'untested' | 'granted' | 'denied';

export function InterviewReadyPage() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const jdId = searchParams.get('jdId');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [micStatus, setMicStatus] = useState<PermissionStatus>('untested');
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>('untested');
  const [micTested, setMicTested] = useState(false);
  const [cameraTested, setCameraTested] = useState(false);
  const [testingMic, setTestingMic] = useState(false);
  const [testingCamera, setTestingCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const [audioLevel, setAudioLevel] = useState(0);

  const [checklist, setChecklist] = useState({
    quietEnvironment: false,
    goodLighting: false,
    stableInternet: false
  });

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const testMicrophone = async () => {
    setTestingMic(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus('granted');
      setMicTested(true);

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      streamRef.current = stream;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 255) * 200));
          animationRef.current = requestAnimationFrame(updateLevel);
        }
      };

      updateLevel();

      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setAudioLevel(0);
      }, 5000);

    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setMicStatus('denied');
      setError('Microphone access denied. Please enable it in your browser settings.');
    } finally {
      setTestingMic(false);
    }
  };

  const testCamera = async () => {
    setTestingCamera(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStatus('granted');
      setCameraTested(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }, 5000);

    } catch (err: any) {
      console.error('Camera access denied:', err);
      setCameraStatus('denied');
      setError('Camera access denied. You can continue with audio only, or enable camera in your browser settings.');
    } finally {
      setTestingCamera(false);
    }
  };

  const canProceed = micStatus === 'granted' && micTested;

  const handleStartInterview = async () => {
    if (!canProceed) {
      setError('Please test your microphone before starting the interview.');
      return;
    }

    if (!jdId || !token) {
      setError('Missing required information. Please go back and try again.');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const response = await backend.mockinterviews.createInterviewSession({
        token,
        jdId: parseInt(jdId),
        devicePermissions: {
          microphoneGranted: micStatus === 'granted',
          cameraGranted: cameraStatus === 'granted',
          microphoneTested: micTested,
          cameraTested: cameraTested
        }
      });

      if (response.success && response.sessionUrl) {
        navigate(response.sessionUrl);
      } else {
        setError(response.message || 'Failed to create interview session');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <OnboardingLayout currentStep={6} totalSteps={6}>
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            You're All Set! 🎉
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Just a few quick checks before we start your mock interview. Make sure your environment is ready.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm text-red-800 dark:text-red-200">{error}</div>
          </div>
        )}

        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Pre-Interview Checklist
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="quietEnvironment"
                checked={checklist.quietEnvironment}
                onCheckedChange={(checked) => setChecklist({ ...checklist, quietEnvironment: checked === true })}
              />
              <div className="flex-1">
                <Label htmlFor="quietEnvironment" className="flex items-center gap-2 cursor-pointer">
                  <Volume2 className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <span>Quiet environment secured</span>
                </Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Find a quiet space free from distractions and background noise.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="goodLighting"
                checked={checklist.goodLighting}
                onCheckedChange={(checked) => setChecklist({ ...checklist, goodLighting: checked === true })}
              />
              <div className="flex-1">
                <Label htmlFor="goodLighting" className="flex items-center gap-2 cursor-pointer">
                  <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <span>Good lighting available</span>
                </Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Ensure your face is well-lit and clearly visible on camera.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="stableInternet"
                checked={checklist.stableInternet}
                onCheckedChange={(checked) => setChecklist({ ...checklist, stableInternet: checked === true })}
              />
              <div className="flex-1">
                <Label htmlFor="stableInternet" className="flex items-center gap-2 cursor-pointer">
                  <Wifi className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <span>Stable internet connection</span>
                </Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Connect to a reliable WiFi or ethernet connection.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Device Permissions Test
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">
                    Microphone <span className="text-red-500" aria-label="required">*</span>
                  </h4>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {micStatus === 'granted' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
                  ) : micStatus === 'denied' ? (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" aria-hidden="true" />
                  )}
                  <span className={`text-sm ${
                    micStatus === 'granted' 
                      ? 'text-green-600 dark:text-green-400' 
                      : micStatus === 'denied'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {micStatus === 'granted' 
                      ? 'Access granted' 
                      : micStatus === 'denied'
                      ? 'Access denied'
                      : 'Not tested'}
                  </span>
                </div>
                {testingMic && audioLevel > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Speak to test your microphone:</p>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${audioLevel}%` }}
                        role="progressbar"
                        aria-valuenow={audioLevel}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Microphone volume level"
                      />
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={testMicrophone}
                disabled={testingMic}
                variant={micStatus === 'granted' ? 'outline' : 'default'}
                size="sm"
                className="gap-2"
              >
                {testingMic ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" aria-hidden="true" />
                    Test
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">
                    Camera <span className="text-slate-500 text-sm font-normal">(Optional)</span>
                  </h4>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {cameraStatus === 'granted' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
                  ) : cameraStatus === 'denied' ? (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" aria-hidden="true" />
                  )}
                  <span className={`text-sm ${
                    cameraStatus === 'granted' 
                      ? 'text-green-600 dark:text-green-400' 
                      : cameraStatus === 'denied'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {cameraStatus === 'granted' 
                      ? 'Access granted' 
                      : cameraStatus === 'denied'
                      ? 'Access denied'
                      : 'Not tested'}
                  </span>
                </div>
                {testingCamera && (
                  <div className="mt-2">
                    <video 
                      ref={videoRef} 
                      className="w-full max-w-xs rounded-lg border-2 border-slate-300 dark:border-slate-700"
                      muted
                      playsInline
                      aria-label="Camera preview"
                    />
                  </div>
                )}
              </div>
              <Button
                onClick={testCamera}
                disabled={testingCamera}
                variant={cameraStatus === 'granted' ? 'outline' : 'default'}
                size="sm"
                className="gap-2"
              >
                {testingCamera ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" aria-hidden="true" />
                    Test
                  </>
                )}
              </Button>
            </div>
          </div>

          {micStatus === 'denied' && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Microphone access is required.</strong> To enable it:
              </p>
              <ul className="text-sm text-amber-800 dark:text-amber-200 mt-2 ml-4 list-disc space-y-1">
                <li>Click the camera icon in your browser's address bar</li>
                <li>Allow microphone access for this site</li>
                <li>Refresh the page and test again</li>
              </ul>
            </div>
          )}
        </Card>

        <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                What to Expect
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Your interview will last approximately <strong>30-45 minutes</strong>. You'll be asked questions based on the job description you provided. Take your time, speak clearly, and remember - this is practice!
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleStartInterview} 
            disabled={!canProceed || creating}
            size="lg"
            className="gap-2 px-8"
          >
            {creating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                Preparing Interview...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" aria-hidden="true" />
                Start Mock Interview
              </>
            )}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
