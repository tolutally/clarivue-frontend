export interface BotStatusData {
  bot_id: string;
  status: string;
}

export interface BotJoinedData {
  bot_id: string;
  meeting_id: string;
}

export interface BotLeftData {
  bot_id: string;
  recording?: {
    duration?: number;
  };
}

export interface TranscriptReadyData {
  bot_id: string;
  transcript?: {
    url?: string;
  };
}

export interface RecordingReadyData {
  bot_id: string;
  recording?: {
    url?: string;
  };
}

export type WebhookData =
  | { event: "bot.status_change"; data: BotStatusData }
  | { event: "bot.joined"; data: BotJoinedData }
  | { event: "bot.left"; data: BotLeftData }
  | { event: "transcript.ready"; data: TranscriptReadyData }
  | { event: "recording.ready"; data: RecordingReadyData };
