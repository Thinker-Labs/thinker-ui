"use client";
/* Thinker Avatar: a small character with eyes that shows what an agent is doing.
   Built on open-bot-avatar (MIT, Dominik Scholz), vendored in src/vendor/open-bot-avatar. */
import { useEffect, useRef } from "react";
import { mountAvatar, type MountedAvatar } from "@/vendor/open-bot-avatar/dom";
import type { AvatarDefinition, AvatarMood, AvatarState } from "@/vendor/open-bot-avatar";

export type ThinkerAvatarState = AvatarState;
export type ThinkerAvatarMood = AvatarMood;

export function ThinkerAvatar({
  definition,
  state = "idle",
  mood = "neutral",
  material = "fluffy",
  color,
  size = 160,
  followPointer = true,
  still = false,
  label,
}: {
  definition: AvatarDefinition;
  state?: ThinkerAvatarState;
  mood?: ThinkerAvatarMood;
  material?: "fluffy" | "flat";
  color?: string;
  size?: number;
  followPointer?: boolean;
  still?: boolean;
  label?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const mounted = useRef<MountedAvatar | null>(null);
  const options = { definition, state, mood, material, color, followPointer, still, label: label ?? definition.name };
  const latest = useRef(options);
  latest.current = options;
  useEffect(() => {
    if (!host.current) return;
    mounted.current = mountAvatar(host.current, latest.current);
    return () => { mounted.current?.destroy(); mounted.current = null; };
  }, [definition.id, material, still]);
  useEffect(() => { mounted.current?.update({ state, mood, color, followPointer, label: label ?? definition.name }); }, [state, mood, color, followPointer, label, definition.name]);
  return <div ref={host} style={{ width: size, height: size }} />;
}
