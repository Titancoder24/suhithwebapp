/**
 * Om component + Deity blessings
 * Purohith Connect — Shubh Karyas only (no death ceremonies)
 * Emphasis: 75% Kannada + Sanskrit, 25% English
 */
export function Om({ className = "" }) {
  return (
    <span className={`font-sanskrit leading-none ${className}`} aria-label="Om">ॐ</span>
  );
}

export function Mantra({ text, className = "" }) {
  return (
    <span className={`font-sanskrit ${className}`} lang="sa">{text}</span>
  );
}

export function Kannada({ text, className = "" }) {
  return (
    <span className={`font-kannada ${className}`} lang="kn">{text}</span>
  );
}

// Deities — each with Sanskrit mantra AND Kannada name
export const DEITIES = [
  { key: "ganesha", name: "Ganesha", kannada: "ಗಣೇಶ", mantra: "ॐ ಗಂ ಗಣಪತಯೇ ನಮಃ", english: "Om Gam Ganapataye Namah", meaning: "Remover of obstacles" },
  { key: "shiva", name: "Shiva", kannada: "ಶಿವ", mantra: "ॐ ನಮಃ ಶಿವಾಯ", english: "Om Namah Shivaya", meaning: "Adoration to Shiva" },
  { key: "rama", name: "Sri Rama", kannada: "ಶ್ರೀರಾಮ", mantra: "ಜೈ ಶ್ರೀ ರಾಮ", english: "Jai Sri Ram", meaning: "Victory to Lord Rama" },
  { key: "hanuman", name: "Hanuman", kannada: "ಆಂಜನೇಯ", mantra: "ಜೈ ಹನುಮಾನ್", english: "Jai Hanuman", meaning: "Strength and devotion" },
  { key: "durga", name: "Durgaparameshwari", kannada: "ದುರ್ಗಾಪರಮೇಶ್ವರಿ", mantra: "ॐ ದುಂ ದುರ್ಗಾಯೈ ನಮಃ", english: "Om Dum Durgayai Namah", meaning: "The divine mother" },
  { key: "sharada", name: "Sringeri Sharada", kannada: "ಶೃಂಗೇರಿ ಶಾರದಾ", mantra: "ॐ ಐಂ ಸರಸ್ವತ್ಯೈ ನಮಃ", english: "Om Aim Saraswatyai Namah", meaning: "Goddess of wisdom" },
  { key: "lakshmi", name: "Lakshmi", kannada: "ಲಕ್ಷ್ಮಿ", mantra: "ॐ ಶ್ರೀಂ ಮಹಾಲಕ್ಷ್ಮ್ಯೈ ನಮಃ", english: "Om Shrim Mahalakshmyai Namah", meaning: "Prosperity and grace" },
  { key: "vishnu", name: "Vishnu", kannada: "ವಿಷ್ಣು", mantra: "ॐ ನಮೋ ನಾರಾಯಣಾಯ", english: "Om Namo Narayanaya", meaning: "Preserver of the universe" },
];

export function DeityChip({ deity, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-white border border-warmBorder px-3 py-1.5 text-xs ${className}`}>
      <Om className="text-saffron text-base" />
      <span className="font-kannada text-ink" lang="kn">{deity.kannada}</span>
      <span className="text-muted2 hidden sm:inline">· {deity.name}</span>
    </span>
  );
}
