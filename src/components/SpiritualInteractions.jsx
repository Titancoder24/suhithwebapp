import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const SOUND_KEY = "purohith-sound-enabled";
const CHIMES = [
  [261.63, 392, 523.25], [293.66, 440, 587.33], [329.63, 493.88, 659.25],
  [349.23, 523.25, 698.46], [392, 587.33, 783.99], [220, 329.63, 440],
  [246.94, 369.99, 493.88], [277.18, 415.3, 554.37], [311.13, 466.16, 622.25],
  [196, 293.66, 392], [233.08, 349.23, 466.16], [174.61, 261.63, 349.23],
];

function playChime(context, notes) {
  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
  master.connect(context.destination);

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.055);
    gain.gain.setValueAtTime(index === 0 ? 0.62 : 0.28, now + index * 0.055);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55 + index * 0.055);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now + index * 0.055);
    oscillator.stop(now + 0.62 + index * 0.055);
  });
}

export default function SpiritualInteractions() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(SOUND_KEY) !== "false");
  const contextRef = useRef(null);
  const lastSoundRef = useRef(-1);

  useEffect(() => {
    const onActivate = (event) => {
      if (!enabled || event.defaultPrevented) return;
      const target = event.target.closest("button, a[href], [role='button']");
      if (!target || target.dataset.sound === "off" || target.disabled) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      contextRef.current ||= new AudioContext();
      if (contextRef.current.state === "suspended") contextRef.current.resume();
      let next = Math.floor(Math.random() * CHIMES.length);
      if (next === lastSoundRef.current) next = (next + 1) % CHIMES.length;
      lastSoundRef.current = next;
      playChime(contextRef.current, CHIMES[next]);
    };
    document.addEventListener("click", onActivate, true);
    return () => document.removeEventListener("click", onActivate, true);
  }, [enabled]);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(SOUND_KEY, String(next));
  };

  return (
    <button
      type="button"
      data-sound="off"
      onClick={toggle}
      className="sound-toggle"
      aria-label={enabled ? "Mute spiritual interaction sounds" : "Enable spiritual interaction sounds"}
      title={enabled ? "Spiritual sounds on" : "Spiritual sounds off"}
    >
      {enabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
    </button>
  );
}
