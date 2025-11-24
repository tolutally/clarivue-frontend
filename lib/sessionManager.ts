/**
 * AI Session Manager for Clarivue
 * Handles session lifecycle, WebRTC connection, and live transcript with JWT auth
 */

import { PipecatClient } from '@pipecat-ai/client-js';
import { SmallWebRTCTransport } from '@pipecat-ai/small-webrtc-transport';
import { aiSessionsService, type CreateSessionRequest } from '@/services/aiSessions/aiSessions.service';

export interface TranscriptMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export class SessionManager {
  private sessionId: string | null = null;
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
   * Start a new AI session
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
      // Create session via authenticated API call
      const requestData: CreateSessionRequest = {
        session_type: formData.session_type,
        duration_seconds: formData.duration_minutes * 60,
        context: this.buildContext(formData),
      };

      const sessionData = await aiSessionsService.createSession(requestData);
      this.sessionId = sessionData.session_id;
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

  /**
   * Build context object based on session type
   */
  private buildContext(formData: {
    role_title?: string;
    job_description?: string;
    company_name?: string;
  }): CreateSessionRequest['context'] {
    const context: CreateSessionRequest['context'] = {};

    if (formData.role_title) {
      context.role_title = formData.role_title;
    }

    if (formData.job_description) {
      context.job_description = formData.job_description;
    }

    if (formData.company_name) {
      context.company_name = formData.company_name;
    }

    return context;
  }

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
          webrtcUrl: `${this.serverUrl}/api/ai-sessions/${this.sessionId}/offer`,
        }),
        enableMic: true,
        enableCam: false,
        callbacks: this.getCallbacks(),
      });

      // Initialize devices first
      this.updateStatus('Initializing devices...');
      await this.pcClient.initDevices();

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
          console.log('Audio track started');
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
    const audioElement = (document.getElementById('bot-audio') as HTMLAudioElement) || this.createAudioElement();
    const stream = audioElement.srcObject as MediaStream | null;

    if (stream) {
      const oldTrack = stream.getAudioTracks()[0];
      if (oldTrack?.id === track.id) return;
    }

    audioElement.srcObject = new MediaStream([track]);
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
      document.body.appendChild(audioElement);
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
      timestamp: Date.now(),
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
  cleanup(): void {
    if (this.pcClient) {
      this.pcClient.disconnect();
      this.pcClient = null;
    }

    this.sessionId = null;
    this.startTime = null;
    this.transcriptMessages = [];
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }
}

