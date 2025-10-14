import { api, APIError } from "encore.dev/api";
import log from "encore.dev/log";
import db from "../db";

interface RecallWebhookRequest {
  event: string;
  data: any;
}

interface WebhookResponse {
  success: boolean;
}

export const recall = api<RecallWebhookRequest, WebhookResponse>(
  { expose: true, method: "POST", path: "/webhooks/recall" },
  async (req) => {
    log.info("Received Recall webhook", { event: req.event });

    try {
      switch (req.event) {
        case "bot.status_change":
          await handleBotStatusChange(req.data);
          break;
        
        case "bot.joined":
          await handleBotJoined(req.data);
          break;
        
        case "bot.left":
          await handleBotLeft(req.data);
          break;
        
        case "transcript.ready":
          await handleTranscriptReady(req.data);
          break;
        
        case "recording.ready":
          await handleRecordingReady(req.data);
          break;
        
        default:
          log.warn("Unknown webhook event", { event: req.event });
      }

      return { success: true };
    } catch (err) {
      log.error("Error processing webhook", { error: err, event: req.event });
      throw APIError.internal("Failed to process webhook");
    }
  }
);

async function handleBotStatusChange(data: any) {
  const { bot_id, status } = data;
  
  if (!bot_id) {
    log.warn("No bot_id in bot.status_change event");
    return;
  }

  const interview = await db.queryRow<{ id: bigint }>`
    SELECT id FROM interviews WHERE recall_bot_id = ${bot_id}
  `;

  if (!interview) {
    log.warn("Interview not found for bot_id", { bot_id });
    return;
  }

  await db.exec`
    UPDATE interviews 
    SET status = ${status}, updated_at = NOW() 
    WHERE recall_bot_id = ${bot_id}
  `;

  log.info("Updated interview status", { bot_id, status });
}

async function handleBotJoined(data: any) {
  const { bot_id, meeting_id } = data;
  
  if (!bot_id) {
    log.warn("No bot_id in bot.joined event");
    return;
  }

  const interview = await db.queryRow<{ id: bigint }>`
    SELECT id FROM interviews WHERE recall_bot_id = ${bot_id}
  `;

  if (!interview) {
    log.warn("Interview not found for bot_id", { bot_id });
    return;
  }

  await db.exec`
    UPDATE interviews 
    SET status = 'recording', 
        recall_meeting_id = ${meeting_id},
        conducted_at = NOW(),
        updated_at = NOW() 
    WHERE recall_bot_id = ${bot_id}
  `;

  log.info("Bot joined meeting", { bot_id, meeting_id });
}

async function handleBotLeft(data: any) {
  const { bot_id, recording } = data;
  
  if (!bot_id) {
    log.warn("No bot_id in bot.left event");
    return;
  }

  const interview = await db.queryRow<{ id: bigint }>`
    SELECT id FROM interviews WHERE recall_bot_id = ${bot_id}
  `;

  if (!interview) {
    log.warn("Interview not found for bot_id", { bot_id });
    return;
  }

  const duration = recording?.duration || null;

  await db.exec`
    UPDATE interviews 
    SET status = 'processing', 
        duration = ${duration},
        updated_at = NOW() 
    WHERE recall_bot_id = ${bot_id}
  `;

  log.info("Bot left meeting", { bot_id, duration });
}

async function handleTranscriptReady(data: any) {
  const { bot_id, transcript } = data;
  
  if (!bot_id) {
    log.warn("No bot_id in transcript.ready event");
    return;
  }

  const interview = await db.queryRow<{ id: bigint }>`
    SELECT id FROM interviews WHERE recall_bot_id = ${bot_id}
  `;

  if (!interview) {
    log.warn("Interview not found for bot_id", { bot_id });
    return;
  }

  const transcriptUrl = transcript?.url || null;

  await db.exec`
    UPDATE interviews 
    SET transcript_url = ${transcriptUrl},
        raw_recall_data = ${JSON.stringify(data)},
        updated_at = NOW() 
    WHERE recall_bot_id = ${bot_id}
  `;

  log.info("Transcript ready", { bot_id, interview_id: interview.id });
  
  if (transcriptUrl) {
    try {
      const { analysis } = await import("~encore/clients");
      await analysis.process({ interviewId: Number(interview.id) });
      log.info("Automated analysis triggered", { interview_id: interview.id });
    } catch (error) {
      log.error("Failed to trigger automated analysis", { interview_id: interview.id, error });
    }
  }
}

async function handleRecordingReady(data: any) {
  const { bot_id, recording } = data;
  
  if (!bot_id) {
    log.warn("No bot_id in recording.ready event");
    return;
  }

  const interview = await db.queryRow<{ id: bigint; transcript_url: string | null }>`
    SELECT id, transcript_url FROM interviews WHERE recall_bot_id = ${bot_id}
  `;

  if (!interview) {
    log.warn("Interview not found for bot_id", { bot_id });
    return;
  }

  const videoUrl = recording?.url || null;

  await db.exec`
    UPDATE interviews 
    SET video_url = ${videoUrl},
        status = 'completed',
        raw_recall_data = ${JSON.stringify(data)},
        updated_at = NOW() 
    WHERE recall_bot_id = ${bot_id}
  `;

  log.info("Recording ready", { bot_id, video_url: videoUrl });
  
  if (interview.transcript_url) {
    try {
      const { analysis } = await import("~encore/clients");
      await analysis.process({ interviewId: Number(interview.id) });
      log.info("Automated analysis triggered from recording.ready", { interview_id: interview.id });
    } catch (error) {
      log.error("Failed to trigger automated analysis", { interview_id: interview.id, error });
    }
  }
}
