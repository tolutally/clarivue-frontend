import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBackend } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/interview/PageHeader';
import { InterviewHeader } from '../../components/interview/InterviewHeader';
import { VideoPreview } from '../../components/interview/VideoPreview';
import { CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

/**
 * PreflightPage
 * 
 * Route: /session/:sessionId/preflight
 * 
 * Purpose: Test camera/microphone and collect consent.
 * 
 * Flow:
 * 1. Request camera/mic access via getUserMedia
 * 2. Show video preview with controls
 * 3. Collect consent checkbox
 * 4. POST to /api/session/:sessionId/preflight
 * 5. On success → navigate to /session/:sessionId/interview
 */
export function PreflightPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraOk, setCameraOk] = useState(false);
  const [micOk, setMicOk] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStreamReady = (mediaStream: MediaStream) => {
    setStream(mediaStream);
    
    // Check if video and audio tracks are available
    const videoTracks = mediaStream.getVideoTracks();
    const audioTracks = mediaStream.getAudioTracks();
    
    setCameraOk(videoTracks.length > 0 && videoTracks[0].enabled);
    setMicOk(audioTracks.length > 0 && audioTracks[0].enabled);
    setDeviceError(null);
  };

  const handleStreamError = (err: Error) => {
    setDeviceError(err.message);
    setCameraOk(false);
    setMicOk(false);
  };

  const handleSubmit = async () => {
    if (!consent) {
      setError('Please accept the terms to continue');
      return;
    }

    if (!sessionId) {
      setError('Invalid session');
      return;
    }

    // Warn if devices aren't working
    if (!cameraOk || !micOk) {
      const confirmed = window.confirm(
        'Your camera or microphone may not be working properly. Do you want to continue anyway?'
      );
      if (!confirmed) return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await backend.interviews.submitPreflight(sessionId, {
        consent: true,
        deviceInfo: {
          cameraOk,
          micOk,
        },
      });
      
      // Success - navigate to interview room
      navigate(`/session/${sessionId}/interview`);
    } catch (err) {
      console.error('Failed to submit preflight:', err);
      setError('Failed to start interview. Please try again.');
      setLoading(false);
    }
  };

  const allDevicesOk = cameraOk && micOk;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <InterviewHeader currentStep={5} totalSteps={7} stepLabel="Camera & Mic Check" />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">

        <PageHeader
          title="Camera & Microphone Check"
          subtitle="Let's make sure everything is working before we start the interview."
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Video Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Video Preview
            </h3>
            
            <VideoPreview
              onStreamReady={handleStreamReady}
              onError={handleStreamError}
            />

            {/* Device Status */}
            <div className="mt-4 space-y-2">
              <div className={`flex items-center gap-2 text-sm ${cameraOk ? 'text-green-700' : 'text-gray-500'}`}>
                {cameraOk ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span>Camera: {cameraOk ? 'Working' : 'Not detected'}</span>
              </div>
              
              <div className={`flex items-center gap-2 text-sm ${micOk ? 'text-green-700' : 'text-gray-500'}`}>
                {micOk ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span>Microphone: {micOk ? 'Working' : 'Not detected'}</span>
              </div>
            </div>

            {deviceError && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">{deviceError}</p>
              </div>
            )}
          </div>

          {/* Right: Consent & Instructions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Before You Begin
            </h3>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              {/* Interview Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  What to expect:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-0.5">•</span>
                    <span>You'll be interviewed by an AI interviewer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-0.5">•</span>
                    <span>The interview typically lasts 15-30 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-0.5">•</span>
                    <span>You'll receive detailed feedback after completion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-0.5">•</span>
                    <span>Your responses will be recorded for analysis</span>
                  </li>
                </ul>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  💡 Interview Tips
                </h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Find a quiet, well-lit space</li>
                  <li>• Speak clearly and at a normal pace</li>
                  <li>• Use the STAR method for behavioral questions</li>
                  <li>• Be authentic and honest in your responses</li>
                </ul>
              </div>

              {/* Consent */}
              <div className="border-t border-gray-200 pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-5 h-5 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
                  />
                  <span className="text-sm text-gray-700">
                    I understand this mock interview uses AI and will be recorded for analysis and feedback purposes. 
                    I consent to the recording and processing of my interview responses.
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/session/${sessionId}/setup`)}
                  className="flex items-center gap-2 px-6 py-4 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!consent || loading}
                  className="flex-1 bg-[var(--primary)] text-white px-6 py-4 rounded-lg font-medium text-lg hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Starting Interview...
                    </>
                  ) : (
                    <>
                      {!allDevicesOk && <AlertTriangle className="w-5 h-5" />}
                      I'm Ready, Start Interview
                    </>
                  )}
                </button>
              </div>

              {!allDevicesOk && !deviceError && (
                <p className="text-xs text-amber-600 text-center">
                  Some devices may not be working properly, but you can continue
                </p>
              )}
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
