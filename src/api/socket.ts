import { WS_URL } from './config';
import type { ClientEvent, ServerEvent } from './types';

type EventListener = (event: ServerEvent) => void;
type StatusListener = (connected: boolean) => void;

/**
 * Manages a single authenticated WebSocket connection to the backend, with
 * automatic reconnection and a periodic heartbeat. Components subscribe via
 * `onEvent` / `onStatus`.
 */
export class RealtimeClient {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private shouldRun = false;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private eventListeners = new Set<EventListener>();
  private statusListeners = new Set<StatusListener>();

  connect(token: string): void {
    this.token = token;
    this.shouldRun = true;
    this.open();
  }

  disconnect(): void {
    this.shouldRun = false;
    this.clearTimers();
    if (this.ws) {
      this.ws.onclose = null;
      try {
        this.ws.close();
      } catch {
        /* noop */
      }
      this.ws = null;
    }
    this.emitStatus(false);
  }

  send(event: ClientEvent): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    }
  }

  onEvent(listener: EventListener): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  onStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private open(): void {
    if (!this.token || !this.shouldRun) return;
    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(this.token)}`);
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.emitStatus(true);
      this.startHeartbeat();
    };

    ws.onmessage = (e) => {
      let event: ServerEvent;
      try {
        event = JSON.parse(String(e.data)) as ServerEvent;
      } catch {
        return;
      }
      for (const l of this.eventListeners) l(event);
    };

    ws.onerror = () => {
      /* close handler drives reconnection */
    };

    ws.onclose = () => {
      this.emitStatus(false);
      this.stopHeartbeat();
      this.ws = null;
      if (this.shouldRun) this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts += 1;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 15000);
    this.reconnectTimer = setTimeout(() => this.open(), delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.pingTimer = setInterval(() => this.send({ type: 'ping' }), 25000);
  }

  private stopHeartbeat(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private clearTimers(): void {
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private emitStatus(connected: boolean): void {
    for (const l of this.statusListeners) l(connected);
  }
}

export const realtime = new RealtimeClient();
