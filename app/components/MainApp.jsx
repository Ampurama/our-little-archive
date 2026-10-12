"use client";

import { useEffect, useState } from "react";
import AppShell from "./AppShell";
import IntroScreen from "./IntroScreen";
import TogetherCounter from "./TogetherCounter";
import ThankYouVideo from "./ThankYouVideo";
import PhotoJourney from "./PhotoJourney";
import HomeDashboard from "./HomeDashboard";
import LetterExperience from "./LetterExperience";
import DatePlanner from "./DatePlanner";
import CoupleQuiz from "./CoupleQuiz";
import MemoryMap from "./MemoryMap";
import CountdownExperience from "./CountdownExperience";
import SupabaseAccess from "./SupabaseAccess";
import { DAILY_MESSAGES, STARTER_MEMORIES, STARTER_PLANS, STARTER_SPECIAL, getDailyMessage } from "../data";
import useStoredState from "../hooks/useStoredState";
import useAmbientSound from "../hooks/useAmbientSound";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";

const STARTER_MEMORIES_SIGNATURE = JSON.stringify(STARTER_MEMORIES);
const MEMORY_STORAGE_KEYS = [
  "ruang-kita-memories-v5",
  "ruang-kita-memories-v4",
  "ruang-kita-memories-v3",
  "ruang-kita-memories-v2",
  "ruang-kita-memories",
];

export default function MainApp() {
  const ambientSound = useAmbientSound();
  const [showTogetherCounter, setShowTogetherCounter] = useState(false);
  const [showThankYouVideo, setShowThankYouVideo] = useState(false);
  const [showPhotoJourney, setShowPhotoJourney] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [authReady, setAuthReady] = useState(!supabaseConfigured);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isCoupleMember, setIsCoupleMember] = useState(false);
  const [membershipError, setMembershipError] = useState(false);
  const [plans, setPlans] = useStoredState("ruang-kita-plans", STARTER_PLANS);
  const [memories, setMemories] = useStoredState("ruang-kita-memories-v5", STARTER_MEMORIES);
  const [special, setSpecial] = useStoredState("ruang-kita-special", STARTER_SPECIAL);
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) return undefined;

    let active = true;

    async function resolveSession(session) {
      if (!active) return;
      const user = session?.user ?? null;
      setAuthenticatedUser(user);

      if (!user) {
        setIsCoupleMember(false);
        setMembershipError(false);
        setAuthReady(true);
        return;
      }

      setAuthReady(false);
      const { data, error } = await supabase
        .from("couple_members")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;
      setIsCoupleMember(Boolean(data));
      setMembershipError(Boolean(error));
      setAuthReady(true);
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.warn("Supabase session could not be read:", error.message);
      resolveSession(data?.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => resolveSession(session), 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const signatureKey = "ruang-kita-memories-starter-signature";

    try {
      if (window.localStorage.getItem(signatureKey) === STARTER_MEMORIES_SIGNATURE) return;

      let savedMemories = [];
      for (const key of MEMORY_STORAGE_KEYS) {
        const saved = window.localStorage.getItem(key);
        if (!saved) continue;
        try {
          savedMemories = JSON.parse(saved);
        } catch {}
        break;
      }

      const starterIds = new Set(STARTER_MEMORIES.map((memory) => memory.id));
      const customMemories = savedMemories.filter((memory) => !starterIds.has(memory.id));
      setMemories([...STARTER_MEMORIES, ...customMemories]);
      window.localStorage.setItem(signatureKey, STARTER_MEMORIES_SIGNATURE);
    } catch {}
  }, [setMemories]);

  useEffect(() => {
    if (window.localStorage.getItem("ruang-kita-memories-v4") !== null) return;

    const previousKeys = ["ruang-kita-memories-v3", "ruang-kita-memories-v2", "ruang-kita-memories"];
    const existingMemories = previousKeys.flatMap((key) => {
      try {
        return JSON.parse(window.localStorage.getItem(key) || "[]");
      } catch {
        return [];
      }
    });
    const seenIds = new Set(STARTER_MEMORIES.map((memory) => memory.id));
    const customMemories = existingMemories.filter((memory) => {
      const isOldDemo = ["m1", "m2", "m3", "m4"].includes(memory.id) && memory.image?.includes("images.unsplash.com");
      if (isOldDemo || seenIds.has(memory.id)) return false;
      seenIds.add(memory.id);
      return true;
    });

    if (customMemories.length) setMemories([...STARTER_MEMORIES, ...customMemories]);
  }, [setMemories]);

  const timeLeft = special.date ? Math.max(0, new Date(`${special.date}T00:00:00`).getTime() - (now || 0)) : 0;
  const countdown = {
    days: now ? Math.floor(timeLeft / 86400000) : null,
    hours: now ? Math.floor((timeLeft % 86400000) / 3600000) : null,
    minutes: now ? Math.floor((timeLeft % 3600000) / 60000) : null,
  };
  const dailyMessage = DAILY_MESSAGES.length ? getDailyMessage(now) : "";

  if (supabaseConfigured && !authReady) return <main className="sync-loading">Membuka ruang kita...</main>;
  if (supabaseConfigured && (!authenticatedUser || !isCoupleMember)) {
    return <SupabaseAccess user={authenticatedUser} isMember={isCoupleMember} membershipError={membershipError} onSignOut={() => supabase.auth.signOut()} />;
  }

  if (!showTogetherCounter) return <IntroScreen onEnter={() => setShowTogetherCounter(true)} onUserGesture={ambientSound.resume} />;
  if (!showThankYouVideo) return <TogetherCounter onContinue={() => { ambientSound.resume(); setShowThankYouVideo(true); }} />;
  if (!showPhotoJourney) return <ThankYouVideo onContinue={() => { ambientSound.resume(); setShowPhotoJourney(true); }} />;
  if (!hasEntered) return <PhotoJourney memories={memories} onFinish={() => setHasEntered(true)} />;

  let view;
  switch (activeView) {
    case "letter":
      view = <LetterExperience />;
      break;
    case "dates":
      view = <DatePlanner plans={plans} setPlans={setPlans} />;
      break;
    case "quiz":
      view = <CoupleQuiz />;
      break;
    case "map":
      view = <MemoryMap memories={memories} setMemories={setMemories} />;
      break;
    case "countdown":
      view = <CountdownExperience special={special} setSpecial={setSpecial} countdown={countdown} dailyMessage={dailyMessage} />;
      break;
    default:
      view = <HomeDashboard memories={memories} onNavigate={setActiveView} />;
  }

  return <AppShell activeView={activeView} onNavigate={setActiveView} specialTitle={special.title}>{view}</AppShell>;
}
