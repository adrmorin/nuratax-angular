import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VoiceService {
  private audioContext: AudioContext | null = null;
  private isSpeaking = false;
  private currentSource: AudioBufferSourceNode | null = null;

  constructor() {}

  async getAudioContext() {
    if (!this.audioContext && (window as any).AudioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return this.audioContext;
  }

  private decodeBase64(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const numChannels = 1;
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, 24000);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  }

  getSpeakingStatus() {
    return this.isSpeaking;
  }

  async pause() {
    const ctx = await this.getAudioContext();
    if (!ctx) return; // 🔥 protección
    if (ctx.state === 'running') await ctx.suspend();
  }

  async resume() {
    const ctx = await this.getAudioContext();
    if (!ctx) return; // 🔥 protección
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  stop() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (_) {
        // no-op
      }
      this.currentSource = null;
    }
    this.isSpeaking = false;
    this.audioContext?.resume();
  }

  async speak(text: string, onStart?: () => void, onEnd?: () => void) {
    this.stop();

    if (!text) return;

    try {
      this.isSpeaking = true;
      if (onStart) onStart();

      const synth = window.speechSynthesis;
      if (!synth) {
        this.isSpeaking = false;
        if (onEnd) onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.lang = 'es-ES';
      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      synth.speak(utterance);
    } catch (error) {
      console.error('TTS Error:', error);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }
}
