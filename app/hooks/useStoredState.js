"use client";

import { useEffect, useRef, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";

export default function useStoredState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);
  const [sessionReady, setSessionReady] = useState(!supabaseConfigured);
  const [userId, setUserId] = useState(null);
  const [remoteReady, setRemoteReady] = useState(false);
  const latestValue = useRef(value);
  const remoteValue = useRef(null);
  latestValue.current = value;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) setValue(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, ready, value]);

  useEffect(() => {
    if (!supabaseConfigured) return undefined;

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      remoteValue.current = null;
      setRemoteReady(false);
      setUserId(session?.user?.id ?? null);
      setSessionReady(true);
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) console.warn("Supabase session could not be read:", error.message);
      const session = data?.session;
      setUserId(session?.user?.id ?? null);
      setSessionReady(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabaseConfigured || !sessionReady || !ready) return undefined;
    if (!userId) {
      remoteValue.current = null;
      setRemoteReady(false);
      return undefined;
    }

    let active = true;
    let channel;

    const applyRemoteValue = (nextValue) => {
      const serialized = JSON.stringify(nextValue);
      if (serialized === remoteValue.current) return;
      remoteValue.current = serialized;
      setValue(nextValue);
    };

    channel = supabase
      .channel(`couple-state:${key}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "couple_state",
        filter: `state_key=eq.${key}`,
      }, (payload) => {
        if (payload.eventType === "DELETE" || payload.new?.value === undefined) return;
        applyRemoteValue(payload.new.value);
      })
      .subscribe();

    async function loadOrCreateSharedValue() {
      const { data, error } = await supabase
        .from("couple_state")
        .select("value")
        .eq("state_key", key)
        .maybeSingle();

      if (!active) return;
      if (error) {
        console.warn(`Supabase read failed for ${key}:`, error.message);
        setRemoteReady(true);
        return;
      }

      if (data?.value !== undefined) {
        applyRemoteValue(data.value);
      } else {
        let initialValue = latestValue.current;
        try {
          const localValue = window.localStorage.getItem(key);
          if (localValue !== null) initialValue = JSON.parse(localValue);
        } catch {}

        const { error: writeError } = await supabase.from("couple_state").upsert({
          state_key: key,
          value: initialValue,
          updated_at: new Date().toISOString(),
        });
        if (active && writeError) console.warn(`Supabase initial write failed for ${key}:`, writeError.message);
        if (!writeError) remoteValue.current = JSON.stringify(initialValue);
      }

      if (active) setRemoteReady(true);
    }

    loadOrCreateSharedValue();

    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [key, ready, sessionReady, userId]);

  useEffect(() => {
    if (!supabaseConfigured || !remoteReady || !userId) return undefined;
    const serialized = JSON.stringify(value);
    if (serialized === remoteValue.current) return undefined;

    let active = true;
    const timer = window.setTimeout(async () => {
      const { error } = await supabase.from("couple_state").upsert({
        state_key: key,
        value,
        updated_at: new Date().toISOString(),
      });
      if (!active) return;
      if (error) {
        console.warn(`Supabase write failed for ${key}:`, error.message);
        return;
      }
      remoteValue.current = serialized;
    }, 220);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [key, remoteReady, userId, value]);

  return [value, setValue];
}
