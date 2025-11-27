/**
 * AI Session Manager for Clarivue
 * Handles session lifecycle, WebRTC connection, and live transcript with JWT auth
 */

import { PipecatClient } from '@pipecat-ai/client-js';
import { SmallWebRTCTransport } from '@pipecat-ai/small-webrtc-transport';
import { aiSessionsService, type CreateSessionRequest } from '@/services/aiSessions/aiSessions.service';
import { sessionInvitesService } from '@/services/sessionInvites/sessionInvites.service';

export interface TranscriptMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO 8601 string
  speaker?: string; // Optional speaker name
}

export class SessionManager {
  private sessionId: string | null = null;
  private sessionLogId: string | null = null; // VirtualSessionLog ID for analysis
  private pcClient: PipecatClient | null = null;
  private startTime: number | null = null;
  private transcriptMessages: TranscriptMessage[] = [];
  private serverUrl: string;

  // Callbacks
  public onTranscriptUpdate: ((message: TranscriptMessage) => void) | null = null;
  public onStatusChange: ((status: string) => void) | null = null;
  public onError: ((errorMessage: string) => void) | null = null;
  public onSessionAutoEnded: (() => void) | null = null;

  constructor(serverUrl?: string) {
    // Default to localhost:8000 for local Docker setup, or use provided URL
    this.serverUrl = serverUrl || import.meta.env.VITE_AI_SESSIONS_URL || 'http://localhost:8000';
  }

  /**
   * Start session with job submission (Step 1: Token decrementation)
   * @param jobSubmissionId - Job submission ID
   * @returns Session start response with session_log_id and updated session_access_token
   */
  async startSessionWithJob(jobSubmissionId: string): Promise<{
    session_access_token: string;
    session_log_id: string;
    sessions_remaining: number;
  }> {
    try {
      const response = await sessionInvitesService.startSessionWithJob(jobSubmissionId);
      
      // Store session_log_id
      this.sessionLogId = response.session_log_id;
      
      // Update session_access_token in localStorage
      if (response.session_access_token) {
        localStorage.setItem('session_access_token', response.session_access_token);
      }
      
      return {
        session_access_token: response.session_access_token,
        session_log_id: response.session_log_id,
        sessions_remaining: response.sessions_remaining,
      };
    } catch (error: any) {
      console.error('Failed to start session with job:', error);
      const errorMsg = error?.message || 'Failed to start session';
      this.handleError(errorMsg);
      throw error;
    }
  }

  /**
   * Hydrate manager with an existing session log ID (when session was started earlier)
   */
  setSessionLogId(sessionLogId: string) {
    this.sessionLogId = sessionLogId;
  }

  /**
   * Create AI session (Step 2: WebRTC session creation)
   * @param formData - Session configuration
   * @returns Session ID
   */
  async startSession(formData: {
    session_type: string;
    duration_minutes: number;
    role_title?: string;
    job_description?: string;
    company_name?: string;
  }): Promise<string> {
    try {
      if (!this.sessionLogId) {
        throw new Error('Session log ID is required. Call startSessionWithJob first.');
      }

      // Create session via authenticated API call
      const requestData: CreateSessionRequest = {
        session_type: formData.session_type,
        duration_seconds: formData.duration_minutes * 60,
        session_log_id: this.sessionLogId, 
        // context: this.buildContext(formData),
      };

      const sessionData = await aiSessionsService.createSession(requestData);
      
      // Ensure we're using the session_id from the API response
      if (!sessionData.session_id) {
        throw new Error('Session ID not returned from API');
      }
      
      this.sessionId = sessionData.session_id;
      console.log('Session ID from API:', this.sessionId);

      // Persist session ID immediately so the completion page can close it
      if (this.sessionId) {
        localStorage.setItem('ai_session_id', this.sessionId);
        console.log('Persisted session ID to localStorage:', this.sessionId);
      }

      this.startTime = Date.now();

      this.updateStatus('Session created, connecting...');

      // Initialize WebRTC transport
      await this.initializeWebRTC();

      return this.sessionId;
    } catch (error: any) {
      console.error('Failed to start session:', error);
      const errorMsg = error?.response?.data?.error?.detail || error?.message || 'Failed to create session';
      this.handleError(errorMsg);
      throw error;
    }
  }

  // /**
  //  * Build context object based on session type
  //  */
  // private buildContext(formData: {
  //   role_title?: string;
  //   job_description?: string;
  //   company_name?: string;
  // }): CreateSessionRequest['context'] {
  //   const context: CreateSessionRequest['context'] = {};

  //   if (formData.role_title) {
  //     context.role_title = formData.role_title;
  //   }

  //   if (formData.job_description) {
  //     context.job_description = formData.job_description;
  //   }

  //   if (formData.company_name) {
  //     context.company_name = formData.company_name;
  //   }

  //   return context;
  // }

  /**
   * Initialize WebRTC connection with PipecatClient
   */
  private async initializeWebRTC(): Promise<void> {
    try {
      if (!this.sessionId) {
        throw new Error('No session ID available');
      }

      this.updateStatus('Initializing WebRTC...');

      // Create Pipecat client with session-specific transport URL
      // The session_id in the URL query parameter authenticates the WebRTC connection
      this.pcClient = new PipecatClient({
        transport: new SmallWebRTCTransport({
          webrtcUrl: `${this.serverUrl}/v1/ai-sessions/${this.sessionId}/offer`,
        }),
        enableMic: true,
        enableCam: false,
        callbacks: this.getCallbacks(),
      });

      // Initialize devices first
      this.updateStatus('Initializing devices...');
      await this.pcClient.initDevices();

      // Reset audio element before connecting (in case of previous session)
      const audioElement = document.getElementById('bot-audio') as HTMLAudioElement;
      if (audioElement) {
        const oldStream = audioElement.srcObject as MediaStream | null;
        if (oldStream) {
          oldStream.getTracks().forEach(track => track.stop());
        }
        audioElement.srcObject = null;
      }

      // Connect to session
      this.updateStatus('Connecting to AI...');
      await this.pcClient.connect();

      this.updateStatus('Connected');
    } catch (error: any) {
      console.error('WebRTC initialization failed:', error);
      this.handleError('Failed to establish connection');
      throw error;
    }
  }

  /**
   * Get callbacks for PipecatClient
   */
  private getCallbacks() {
    return {
      onConnected: () => {
        console.log('Client connected');
        this.updateStatus('Connected');
      },
      onDisconnected: () => {
        console.log('Client disconnected');
        this.updateStatus('Disconnected');

        // Trigger auto-end event if session was disconnected by backend
        if (this.onSessionAutoEnded) {
          this.onSessionAutoEnded();
        }
      },
      onTransportStateChanged: (state: string) => {
        console.log(`Transport state: ${state}`);
        this.updateStatus(`Transport: ${state}`);
      },
      onBotReady: () => {
        console.log('Bot ready');
        this.updateStatus('AI Ready');
      },
      onUserTranscript: (data: { final: boolean; text: string }) => {
        if (data.final) {
          this.addTranscriptMessage('user', data.text);
        }
      },
      onBotTranscript: (data: { text: string }) => {
        this.addTranscriptMessage('assistant', data.text);
      },
      onError: (error: any) => {
        console.error('Client error:', error);
        const errorMessage = error?.message || error?.detail || String(error) || 'Connection error';
        this.handleError(errorMessage);
      },
      onTrackStarted: (track: MediaStreamTrack, participant?: { local?: boolean }) => {
        if (!participant?.local && track.kind === 'audio') {
          console.log('Audio track started:', {
            id: track.id,
            enabled: track.enabled,
            readyState: track.readyState,
            label: track.label,
          });
          // Set up audio playback
          this.setupAudioTrack(track);
        }
      },
    };
  }

  /**
   * Set up audio track for playback
   */
  private setupAudioTrack(track: MediaStreamTrack): void {
    try {
      console.log('Setting up audio track:', track.id, track.enabled, track.readyState);
      
      // Ensure track is enabled
      if (!track.enabled) {
        track.enabled = true;
      }

      const audioElement = (document.getElementById('bot-audio') as HTMLAudioElement) || this.createAudioElement();
      const stream = audioElement.srcObject as MediaStream | null;

      // Stop old tracks if they exist and are different
      if (stream) {
        const oldTrack = stream.getAudioTracks()[0];
        if (oldTrack?.id === track.id) {
          // Same track, but ensure it's still enabled and playing
          console.log('Same track, ensuring playback');
          if (audioElement.paused) {
            audioElement.play().catch(err => {
              console.warn('Audio play failed:', err);
            });
          }
          return;
        }
        // Stop all old tracks before setting new stream
        stream.getTracks().forEach(t => {
          console.log('Stopping old track:', t.id);
          t.stop();
        });
      }

      // Create new stream with the new track
      const newStream = new MediaStream([track]);
      
      // Set volume to max and ensure not muted BEFORE setting srcObject
      audioElement.volume = 1.0;
      audioElement.muted = false;
      audioElement.autoplay = true;
      
      // Set the stream
      audioElement.srcObject = newStream;
      
      // Log audio element state
      console.log('Audio element state:', {
        paused: audioElement.paused,
        muted: audioElement.muted,
        volume: audioElement.volume,
        readyState: audioElement.readyState,
        srcObject: audioElement.srcObject,
        trackCount: newStream.getAudioTracks().length,
        trackEnabled: track.enabled,
        trackReadyState: track.readyState,
      });
      
      // Wait for the stream to be ready, then play
      const tryPlay = () => {
        if (audioElement.readyState >= 2) { // HAVE_CURRENT_DATA or higher
          const playPromise = audioElement.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Audio playback started successfully');
                // Verify it's actually playing
                setTimeout(() => {
                  console.log('Audio element after play:', {
                    paused: audioElement.paused,
                    currentTime: audioElement.currentTime,
                    readyState: audioElement.readyState,
                    muted: audioElement.muted,
                    volume: audioElement.volume,
                  });
                }, 100);
              })
              .catch(err => {
                console.error('Audio autoplay failed:', err);
                // Try to play again after a short delay
                setTimeout(() => {
                  audioElement.play().catch(e => {
                    console.error('Retry audio play failed:', e);
                  });
                }, 500);
              });
          }
        } else {
          // Wait for ready state
          audioElement.addEventListener('canplay', tryPlay, { once: true });
          // Also try after a short delay as fallback
          setTimeout(() => {
            if (audioElement.paused) {
              tryPlay();
            }
          }, 100);
        }
      };
      
      // Try to play immediately or wait for canplay
      tryPlay();

      // Listen for track ended event
      track.onended = () => {
        console.log('Audio track ended');
      };

      track.onmute = () => {
        console.warn('Audio track muted');
      };

      track.onunmute = () => {
        console.log('Audio track unmuted');
      };
    } catch (error) {
      console.error('Error setting up audio track:', error);
    }
  }

  /**
   * Create audio element if it doesn't exist
   */
  private createAudioElement(): HTMLAudioElement {
    let audioElement = document.getElementById('bot-audio') as HTMLAudioElement;

    if (!audioElement) {
      audioElement = document.createElement('audio');
      audioElement.id = 'bot-audio';
      audioElement.autoplay = true;
      audioElement.volume = 1.0;
      audioElement.muted = false;
      
      // Add event listeners for debugging
      audioElement.addEventListener('loadedmetadata', () => {
        console.log('Audio metadata loaded:', {
          duration: audioElement.duration,
          readyState: audioElement.readyState,
          paused: audioElement.paused,
          muted: audioElement.muted,
          volume: audioElement.volume,
        });
      });
      
      audioElement.addEventListener('play', () => {
        console.log('Audio element play event fired');
      });
      
      audioElement.addEventListener('pause', () => {
        console.log('Audio element pause event fired');
      });
      
      audioElement.addEventListener('volumechange', () => {
        console.log('Audio volume changed:', {
          volume: audioElement.volume,
          muted: audioElement.muted,
        });
      });
      
      audioElement.addEventListener('canplay', () => {
        console.log('Audio can play - attempting to play');
        if (audioElement.paused) {
          audioElement.play().catch(err => {
            console.error('Auto-play on canplay failed:', err);
          });
        }
      });
      
      document.body.appendChild(audioElement);
      console.log('Audio element created and appended to body');
    } else {
      // Ensure existing element is properly configured
      audioElement.volume = 1.0;
      audioElement.muted = false;
      audioElement.autoplay = true;
    }

    return audioElement;
  }

  /**
   * Add message to transcript
   */
  private addTranscriptMessage(role: 'user' | 'assistant', text: string): void {
    const message: TranscriptMessage = {
      role,
      content: text,
      timestamp: new Date().toISOString(),
      speaker: role === 'user' ? 'User' : undefined,
    };

    this.transcriptMessages.push(message);

    if (this.onTranscriptUpdate) {
      this.onTranscriptUpdate(message);
    }
  }

  /**
   * Update session status
   */
  private updateStatus(status: string): void {
    if (this.onStatusChange) {
      this.onStatusChange(status);
    }
  }

  /**
   * Handle errors
   */
  private handleError(errorMessage: string): void {
    if (this.onError) {
      this.onError(errorMessage);
    }
  }

  /**
   * Get elapsed time in seconds
   */
  getElapsedTime(): number {
    if (!this.startTime) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Disconnect WebRTC without closing the session
   * Useful when navigating to completion page
   */
  async disconnect(): Promise<void> {
    try {
      if (this.pcClient && (this.pcClient as any).state !== 'disconnected') {
        await this.pcClient.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting WebRTC:', error);
    }
  }

  /**
   * End the current session
   * @param autoEnded - Whether the session ended automatically (timer expired)
   */
  async endSession(autoEnded: boolean = false): Promise<void> {
    try {
      this.updateStatus('Ending session...');

      // Disconnect PipecatClient if not already disconnected
      await this.disconnect();

      // Wait a moment for backend to save transcript to Redis
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the /close endpoint to finalize session and retrieve transcript
      if (this.sessionId) {
        try {
          await aiSessionsService.closeSession(this.sessionId);
          console.log('Session closed successfully on backend');
        } catch (error) {
          console.error('Error calling /close endpoint:', error);
          // Continue anyway - session may already be closed
        }
      }

      this.updateStatus(autoEnded ? 'Session ended automatically' : 'Session ended');
    } catch (error) {
      console.error('Error ending session:', error);
      // Still consider it ended
      this.updateStatus('Session ended');
    }
  }

  /**
   * Get session status from server
   */
  async getSessionStatus(): Promise<{ session_id: string; status: string; elapsed_time?: number; remaining_time?: number }> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    return await aiSessionsService.getSessionStatus(this.sessionId);
  }

  /**
   * Get full transcript from server
   */
  async getTranscript(): Promise<TranscriptMessage[]> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    const response = await aiSessionsService.getTranscript(this.sessionId);
    return response.transcript || [];
  }

  /**
   * Download transcript as JSON file
   */
  async downloadTranscript(): Promise<void> {
    try {
      const transcript = await this.getTranscript();
      const blob = new Blob([JSON.stringify(transcript, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `session-${this.sessionId}-transcript.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download transcript:', error);
      this.handleError('Failed to download transcript');
    }
  }

  /**
   * Clean up session resources
   */
  async cleanup(): Promise<void> {
    if (this.pcClient) {
      try {
        await this.pcClient.disconnect();
        if (typeof (this.pcClient as any).close === 'function') {
          await (this.pcClient as any).close();
        }
      } catch (error) {
        console.error('Failed to disconnect Pipecat client during cleanup:', error);
      }
      this.pcClient = null;
    }

    // Clean up audio element
    const audioElement = document.getElementById('bot-audio') as HTMLAudioElement;
    if (audioElement) {
      const stream = audioElement.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      audioElement.srcObject = null;
    }

    this.sessionId = null;
    this.sessionLogId = null;
    this.startTime = null;
    this.transcriptMessages = [];
  }

  /**
   * Get session log ID
   * @returns {string|null} Session log ID
   */
  getSessionLogId(): string | null {
    return this.sessionLogId;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Completely destroy the WebRTC session (used when closing)
   */
  async destroy(): Promise<void> {
    try {
      if (this.pcClient) {
        try {
          await this.pcClient.disconnect();
        } catch (disconnectError) {
          console.warn('Error disconnecting Pipecat client during destroy:', disconnectError);
        }

        if (typeof (this.pcClient as any).close === 'function') {
          try {
            await (this.pcClient as any).close();
          } catch (closeError) {
            console.warn('Error closing Pipecat client during destroy:', closeError);
          }
        }

        this.pcClient = null;
      }
    } catch (error) {
      console.error('Failed to completely destroy session:', error);
    }
  }
}

