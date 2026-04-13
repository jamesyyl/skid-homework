"use client";

export type SeedChatState = {
  title?: string;
  prefillMessage?: string;
  contextMessage?: string;
  sourceId?: string;
  model?: string;
};

export function encodeSeedChat(seed: SeedChatState) {
  try {
    const json = JSON.stringify(seed);
    return btoa(encodeURIComponent(json));
  } catch (error) {
    console.warn("Failed to encode seed chat payload", error);
    return "";
  }
}

export function decodeSeedChat(value: string): SeedChatState | null {
  if (!value) return null;

  try {
    const json = decodeURIComponent(atob(value));
    return JSON.parse(json) as SeedChatState;
  } catch (error) {
    console.warn("Failed to decode seed chat payload", error);
    return null;
  }
}
