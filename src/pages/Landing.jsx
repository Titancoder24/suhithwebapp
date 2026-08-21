import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import api from "@/lib/api";
import {
  ShieldCheck, Sparkles, Star, Flame, Languages, PackageCheck,
  Calendar, Award, MapPin, Phone, Mail, Instagram, ArrowRight,
  CheckCircle2, IndianRupee, Users, BookOpen,
} from "lucide-react";
import { Om, DEITIES } from "@/components/Om";
import { Kalasha, Deepa, HoysalaBand } from "@/components/KarnatakaMotifs";
import { KarnatakaFlag, MadeInKarnatakaBadge } from "@/components/KarnatakaFlag";

/* ------------- Content — pan-India Hindu Shubh Karya focus ------------- */

const HOW_STEPS = [
  {
    n: "01", t: "Choose your pooja",
    d: "Browse Hindu traditions loved across India — from Satya Narayan Katha to Griha Pravesh — or ask PuroMitra AI for a family-specific recommendation.",
    tag: "ಗಣೇಶ · Ganesha",
  },
  {
    n: "02", t: "Pick a verified purohit",
    d: "Filter by language, tradition and locality. Every purohit is KYC-verified, Veda-trained and rated by real families.",
    tag: "ಶಾರದಾ · Sharada",
  },
  {
    n: "03", t: "Confirm & receive grace",
    d: "Pick your muhurta, mark your address, pay securely by UPI. Samagri arrives before the purohit — no last-minute market runs.",
    tag: "ಲಕ್ಷ್ಮಿ · Lakshmi",
  },
];

const FEATURES = [
  { icon: ShieldCheck, title: "Shubh Karyas Only",              subtitleKn: "ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಮಾತ್ರ",   desc: "Housewarming, marriage, naming, birthday, festival poojas — auspicious ceremonies only. No antyeshti or pitru karya." },
  { icon: BookOpen,    title: "Vedic Tradition Represented",    subtitleKn: "ವೈದಿಕ ಪರಂಪರೆ",              desc: "Purohits trained in Shukla-Yajur, Krishna-Yajur, Rig and Sama pathashalas — across Smartha, Sri Vaishnava, Madhwa and Vaidika sampradaya lineages." },
  { icon: PackageCheck, title: "Samagri Included",              subtitleKn: "ಪೂಜಾ ಸಾಮಗ್ರಿ ಸಹಿತ",         desc: "Ready-to-use kalasha, mango leaf toran, kumkuma, akshata, ghee, coconut, betel — everything arranged and delivered." },
  { icon: Award,       title: "KYC-Verified Purohits",          subtitleKn: "ಪ್ರಮಾಣಿತ ಪುರೋಹಿತರು",       desc: "Every purohit is Veda-tested, background-checked and manually approved before appearing on the platform." },
  { icon: IndianRupee, title: "Transparent Pricing",            subtitleKn: "ಸ್ಪಷ್ಟ ದರ",                   desc: "Fixed price upfront — purohit fee + samagri + dakshina all bundled. What you see is what you pay." },
  { icon: Languages,   title: "In Your Language",               subtitleKn: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ",           desc: "Sanskrit for the vidhi + Kannada, English, Hindi, Marathi, Tamil, Telugu, Bengali, Malayalam — matched to your family." },
];

/* Some images need custom crop anchoring — where the visual subject lives */
const POOJA_IMG_POSITION = {
  "rudrabhishek": "center center",    // Shivalinga sits in the middle of the frame
  "ayudha-pooja": "center center",    // Deity portraits behind tools — middle
};

const POOJA_FALLBACK_IMAGES = {
  "satyanarayan": "/ritual-kalasha-v2.png",
  "griha-pravesh": "/landing-family-ceremony-v3.webp",
  "ganesh": "/ritual-kalasha-v2.png",
  "navagraha": "/ritual-havan-v2.png",
  "rudrabhishek": "/ritual-havan-v2.png",
  "lakshmi": "/ritual-kalasha-v2.png",
  "ayushya-homam": "/ritual-havan-v2.png",
  "namakaran": "/landing-family-ceremony-v3.webp",
  "ayudha-pooja": "/ritual-havan-v2.png",
  "vivaha": "/landing-family-ceremony-v3.webp",
};

/* Pooja meta — Kannada name FIRST (primary), then supporting info */
const POOJA_META = {
  "satyanarayan":   { kn: "ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ",   deityKn: "ಶ್ರೀ ಸತ್ಯನಾರಾಯಣ", occasion: "Purnima Vrat / Katha",   tone: "gold" },
  "griha-pravesh":  { kn: "ಗೃಹ ಪ್ರವೇಶ ಪೂಜೆ",    deityKn: "ವಾಸ್ತು ಪುರುಷ",     occasion: "Housewarming",           tone: "chandana" },
  "ganesh":         { kn: "ಗೌರಿ ಗಣೇಶ ವ್ರತ",         deityKn: "ಶ್ರೀ ಗೌರಿ + ಗಣೇಶ",   occasion: "Bhadrapada · Chaturthi", tone: "kumkuma" },
  "navagraha":      { kn: "ನವಗ್ರಹ ಶಾಂತಿ",         deityKn: "ನವ-ಗ್ರಹ ದೇವತಾ",   occasion: "Dosha Shanti · Parihara", tone: "banana" },
  "rudrabhishek":   { kn: "ರುದ್ರಾಭಿಷೇಕ",           deityKn: "ಶ್ರೀ ಮಹಾದೇವ",       occasion: "Shivratri · Somvar",      tone: "hoysala" },
  "lakshmi":        { kn: "ವರಮಹಾಲಕ್ಷ್ಮಿ ವ್ರತ",   deityKn: "ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮಿ",      occasion: "Shravana Shukravara",     tone: "gold" },
  "ayushya-homam":  { kn: "ಆಯುಷ್ ಹೋಮ",           deityKn: "ಆಯುರ್ ದೇವತಾ",       occasion: "First birthday",          tone: "kumkuma" },
  "namakaran":      { kn: "ನಾಮಕರಣ",                deityKn: "ಗಣೇಶ + ಗೌರಿ",         occasion: "11th day naming",         tone: "chandana" },
  "ayudha-pooja":   { kn: "ಆಯುಧ ಪೂಜೆ",            deityKn: "ಶ್ರೀ ದುರ್ಗಾ",          occasion: "Navratri · Vijayadashami", tone: "kumkuma" },
  "vivaha":         { kn: "ವಿವಾಹ",                  deityKn: "ಅಗ್ನಿ ದೇವತಾ",         occasion: "Marriage samskara",       tone: "gold" },
};

const TESTIMONIALS = [
  { name: "Meera Iyer",       area: "Jayanagar · Bengaluru",   rating: 5, pooja: "Satyanarayan Katha", text: "The purohit chanted every mantra in Sanskrit and paused to explain in Kannada for my mother. Samagri arrived an hour before — kalasha, mango leaves, kumkuma, everything perfect. Truly divine experience." },
  { name: "Rakesh Sharma",    area: "Vasant Kunj · Delhi",     rating: 5, pooja: "Griha Pravesh",       text: "We just moved into our new apartment. Booked Griha Pravesh two days in advance — the panditji explained every step in Hindi, guided us on vastu, and completed within the muhurta. Highly recommend." },
  { name: "Bhavana Shastry",  area: "Vidyaranyapuram · Mysuru", rating: 5, pooja: "Ayudha Pooja",       text: "For Navratri we booked Ayudha Pooja. Purohit arrived with all Devi mantras memorised, decorated the vehicles with kumkuma-hoo, and finished within 90 minutes. Feels like the temple came home." },
  { name: "Priya Deshpande",  area: "Andheri West · Mumbai",   rating: 5, pooja: "Lakshmi Puja",       text: "Diwali Lakshmi puja at home — brahmin panditji was punctual, spoke both Marathi and Hindi, and made my elderly in-laws feel completely at ease. Prasad and dakshina arrangements were seamless." },
  { name: "Arindam Ghosh",    area: "Salt Lake · Kolkata",      rating: 5, pooja: "Namakaran",          text: "For our daughter's naming ceremony we found a purohit who did the vidhi in Sanskrit + Bengali explanations. Very rare online. The care taken with the sankalpa was moving." },
  { name: "Ganesh Kamath",    area: "Kadri · Mangaluru",       rating: 5, pooja: "Rudrabhishek",       text: "Coastal traditions matter to us. The purohit knew our family paddhati inside out, chanted in Sanskrit, spoke to us in Tulu. First time an online service actually respected our parampara." },
];

const FEATURED_PRIESTS = [
  { name: "Sri Ramachandra Sharma",   sub: "ಶ್ರೀ ರಾಮಚಂದ್ರ ಶರ್ಮ",   exp: 32, langs: ["Kannada", "Sanskrit", "Tamil"], specialty: "Vivaha · Ayushya Homa · Rudrabhishek", tradition: "Smartha Vedic",   rating: 4.9, reviews: 187, area: "Bengaluru · South India", image: "/purohit-ramachandra-v1.webp" },
  { name: "Pandit Ramesh Shukla",     sub: "ಪಂಡಿತ್ ರಮೇಶ ಶುಕ್ಲ",   exp: 28, langs: ["Hindi", "Sanskrit", "English"], specialty: "Griha Pravesh · Satyanarayan · Vastu", tradition: "Kashi Vedic",      rating: 4.9, reviews: 214, area: "Delhi NCR · North India", image: "/purohit-ramesh-v1.webp" },
  { name: "Acharya Suresh Trivedi",   sub: "ಆಚಾರ್ಯ ಸುರೇಶ ತ್ರಿವೇದಿ", exp: 36, langs: ["Marathi", "Hindi", "Sanskrit"], specialty: "Lakshmi Puja · Navagraha · Havan",       tradition: "Vaidika",           rating: 5.0, reviews: 129, area: "Mumbai · Pune · West India", image: "/purohit-suresh-v1.webp" },
];

const MUHURAT = [
  { date: "Feb 26", tithiKn: "ಮಹಾ ಶಿವರಾತ್ರಿ",         tithi: "Maha Shivratri",              pooja: "Rudrabhishek" },
  { date: "Mar 14", tithiKn: "ಫಾಲ್ಗುಣ ಪೂರ್ಣಿಮಾ",     tithi: "Phalguna Purnima · Holi",     pooja: "Satya Narayan Katha" },
  { date: "Mar 30", tithiKn: "ಯುಗಾದಿ · ಚೈತ್ರ ಪ್ರತಿಪದಾ", tithi: "Ugadi · Chaitra Pratipada",  pooja: "Panchang Shravanam" },
  { date: "Apr 06", tithiKn: "ಶ್ರೀ ರಾಮ ನವಮಿ",         tithi: "Sri Rama Navami",             pooja: "Rama Katha + Pooja" },
  { date: "Aug 08", tithiKn: "ನಾಗರ ಪಂಚಮಿ",           tithi: "Nag Panchami",                pooja: "Naga Devata Pooja" },
  { date: "Aug 22", tithiKn: "ವರಮಹಾಲಕ್ಷ್ಮಿ ವ್ರತ",     tithi: "Varamahalakshmi Vrata",       pooja: "Lakshmi Vratam" },
  { date: "Sep 21", tithiKn: "ಗಣೇಶ ಚತುರ್ಥಿ",         tithi: "Ganesh Chaturthi",            pooja: "Ganesh Sthapana" },
  { date: "Oct 02", tithiKn: "ಆಯುಧ ಪೂಜೆ · ವಿಜಯದಶಮಿ", tithi: "Ayudha Puja · Vijayadashami", pooja: "Vaahana + Shastra Pooja" },
];

const LOCAL_LANDING_POOJAS = [
  { id: "local-satyanarayan", slug: "satyanarayan", name: "Satyanarayan Pooja", description: "A complete katha and pooja for family blessings and prosperity.", category: "Festival", duration_hours: 2, base_price: 2100, image_url: "/ritual-kalasha-v2.png" },
  { id: "local-griha", slug: "griha-pravesh", name: "Griha Pravesh", description: "Begin life in your new home with a traditional Vedic ceremony.", category: "Home", duration_hours: 3, base_price: 5100, image_url: "/hero-purohit-v2.png" },
  { id: "local-ganesh", slug: "ganesh", name: "Ganesh Pooja", description: "Invite auspicious beginnings with Ganapati puja and blessings.", category: "Festival", duration_hours: 1, base_price: 1500, image_url: "/ritual-kalasha-v2.png" },
  { id: "local-rudra", slug: "rudrabhishek", name: "Rudrabhishek", description: "A focused Shiva abhishekam for peace, clarity, and renewal.", category: "Shanti", duration_hours: 2, base_price: 2500, image_url: "/ritual-havan-v2.png" },
];

const FAQS = [
  { q: "Do you perform pitru karya, tarpana, shraddha or antyeshti rituals?", a: "No. Purohith Connect is dedicated to Shubh Karyas (auspicious ceremonies) only — Griha Pravesh, Satya Narayan Katha, Namakaran, Ayushya Homa, Vivaha, Rudrabhishek, Lakshmi Puja, Ayudha Puja, Navagraha Shanti and festival poojas. For pitru karya please consult your family purohit or local temple directly." },
  { q: "Are your purohits genuinely qualified?", a: "Yes. Every purohit is Veda-trained (Yajur / Rig / Sama pathashala), background-verified, ID-proof checked and manually approved. Most have 15+ years of experience conducting home rituals across India — Delhi, Mumbai, Bengaluru, Chennai, Kolkata and beyond." },
  { q: "Which traditions and sampradayas do your purohits represent?", a: "Kashi Vedic (Varanasi), Smartha, Sri Vaishnava, Madhwa, Vaishnava, Vaidika, and Shaiva sampradaya priests are on the platform. Filter by language and tradition at booking so you get a purohit who matches your family paddhati." },
  { q: "Which languages will the pooja be conducted in?", a: "Sanskrit for the vidhi + your family's spoken language for meaning. Priests fluent in Hindi, Kannada, Marathi, Bengali, Tamil, Telugu, Gujarati, Malayalam, Konkani and English are available — filter by language when booking." },
  { q: "What is included in the pooja fee?", a: "Purohit's dakshina + all samagri (kalasha, mango leaves, kumkuma, akshata, agarbatti, ghee, coconut, betel, camphor, panchamrit ingredients) + end-to-end coordination. You provide only the ritual space and any personal offerings you wish." },
  { q: "How far in advance should I book?", a: "Weekdays: 24 hours ideal. Festival days (Ugadi, Ram Navami, Ganesh Chaturthi, Navratri, Diwali, Shivratri, Varamahalakshmi): 5-7 days in advance — slots fill fast during festival seasons." },
  { q: "Which cities do you serve?", a: "Bengaluru (all neighbourhoods) currently in full service. Expanding to Mysuru, Mumbai, Delhi NCR, Pune, Hyderabad, Chennai and Kolkata in 2026. If your city isn't listed, message us — we may already have a matching purohit nearby." },
  { q: "Can I request a purohit from a specific tradition or region?", a: "Absolutely. Kashi Vedic, Smartha, Sri Vaishnava, Madhwa, Vaidika and other lineage priests are all on the platform. Chat with our team or use PuroMitra AI to find the right match for your family gotra and paddhati." },
  { q: "Do you cover office, shop, vehicle and Ayudha poojas?", a: "Yes — Ayudha Puja for vehicles and instruments on Vijayadashami, shop opening, office Griha Pravesh, laptop/tools pooja — all covered. These are Shubh Karyas central to Hindu tradition across India." },
];

const STATS = [
  { label: "Poojas performed",  value: "500+" },
  { label: "Verified purohits", value: "120+" },
  { label: "Avg rating",        value: "4.8★" },
  { label: "Cities & languages", value: "8+" },
];

/* Pooja tile colour tokens — icon-based, no photography */
const TONE_STYLES = {
  gold:      { bg: "bg-[#fff6dc]", ring: "border-mysoreGold/40", icon: "text-mysoreGold-dark", label: "text-mysoreGold-dark" },
  kumkuma:   { bg: "bg-[#fff0ec]", ring: "border-kumkuma/35",    icon: "text-kumkuma",         label: "text-kumkuma" },
  chandana:  { bg: "bg-[#f3ead7]", ring: "border-chandana-dark", icon: "text-hoysala",         label: "text-hoysala" },
  banana:    { bg: "bg-[#edf2e8]", ring: "border-banana/40",     icon: "text-banana-dark",     label: "text-banana-dark" },
  hoysala:   { bg: "bg-[#efeeeb]", ring: "border-hoysala/30",    icon: "text-hoysala",         label: "text-hoysala" },
};

export default function Landing() {
  const [mantraIdx, setMantraIdx] = useState(0);
  const [poojas, setPoojas] = useState([]);

  useEffect(() => {
    const t = setInterval(() => setMantraIdx((i) => (i + 1) % DEITIES.length), 3200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    api.get("/poojas").then(({ data }) => setPoojas(data)).catch(() => setPoojas(LOCAL_LANDING_POOJAS));
  }, []);

  const currentMantra = DEITIES[mantraIdx];

  return (
    <div className="landing-modern min-h-screen bg-white overflow-hidden relative">

      <div className="sacred-border w-full relative z-10" />

      {/* Header */}
      <header className="landing-header sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-black/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center saffron-shadow relative">
              <Om className="text-white text-2xl" />
              <KarnatakaFlag size="sm" className="absolute -bottom-1.5 -right-1.5 ring-2 ring-cotton rounded-[3px]" />
            </div>
            <div>
              <div className="font-heading text-xl md:text-2xl text-saffron leading-none">Purohith Connect</div>
              <div className="text-[11px] text-muted2 mt-1 flex items-center gap-1.5">
                <KarnatakaFlag size="sm" />
                <span>Made in Bengaluru · Karnataka</span>
              </div>
            </div>
          </a>
          <nav className="hidden xl:flex items-center gap-7 text-sm font-medium text-ink">
            <a href="#mission" className="hover:text-kumkuma transition-colors">Mission</a>
            <a href="#join-purohit" className="hover:text-kumkuma transition-colors font-semibold text-hoysala">
              Join as Purohit
            </a>
            <a href="#poojas" className="hover:text-kumkuma transition-colors">Poojas</a>
            <a href="#priests" className="hover:text-kumkuma transition-colors">Purohits</a>
            <a href="#how" className="hover:text-kumkuma transition-colors">How it works</a>
            <a href="#faq" className="hover:text-kumkuma transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login?role=priest" className="hidden lg:inline xl:hidden 2xl:inline">
              <Button data-testid="header-priest-cta"
                variant="outline"
                className="rounded-full border-mysoreGold text-hoysala hover:bg-marigold/20 h-10 px-4 text-sm font-semibold">
                <span className="font-kannada mr-1" lang="kn">ಪುರೋಹಿತರೇ</span> · Join as Purohit
              </Button>
            </Link>
            <Link to="/login">
              <Button data-testid="header-book-cta" className="rounded-full bg-saffron hover:bg-saffron-dark text-white px-5 h-10 font-semibold saffron-shadow">
                <Om className="text-white text-base mr-1.5" /> Book Pooja
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div id="top" />
      {/* HERO — mission-first: empowering Vedic scholars from Karnataka */}
      <section className="landing-hero max-w-6xl mx-auto px-6 pt-16 pb-16 relative z-10">
        <div className="landing-hero-photo hidden lg:block absolute right-6 top-16 bottom-16 w-[34%] overflow-hidden rounded-lg bg-[#ebe7dc] border border-black/10">
          <img
            src="/landing-family-ceremony-v3.webp"
            alt="Vedic purohit conducting a havan"
            className="w-full h-full object-cover"
          />
          <div className="absolute left-5 right-5 bottom-5 bg-white/95 border border-black/10 rounded-lg p-4">
            <div className="font-sanskrit text-kumkuma text-lg" lang="sa">ॐ हनुमते नमः</div>
            <div className="text-xs text-muted2 mt-1">Begin every shubh karya with faith and clarity.</div>
          </div>
        </div>
        <div className="max-w-2xl xl:max-w-[62%] animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-white border border-mysoreGold/50 rounded-full px-3 py-1 mb-4 text-xs font-semibold text-mysoreGold-dark">
            <KarnatakaFlag size="md" />
            <span className="font-kannada" lang="kn">ಬೆಂಗಳೂರಿನಿಂದ</span>
            <span>· Made in Bengaluru, Karnataka</span>
          </div>
          <div className="mb-6 inline-flex items-center gap-2 bg-saffron/10 border border-saffron/30 rounded-full px-3 py-1 text-xs font-semibold text-saffron-dark" data-testid="shubh-karya-badge">
            <span className="font-kannada text-sm" lang="kn">ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಮಾತ್ರ</span>
            <span>· Shubh Karyas only · No antyeshti / pitru karya</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.05] tracking-normal">
            Empowering our <span className="text-saffron">Vedic Purohits.</span><br />
            <span className="text-kumkuma">Bringing Shastra</span> home.
          </h1>

          <div className="mt-4 text-lg text-hoysala font-semibold">
            <span className="font-kannada" lang="kn">ಶಾಸ್ತ್ರ ಪಂಡಿತರಿಗೆ ಗೌರವಪೂರ್ಣ ಉದ್ಯೋಗ</span>
            <span className="mx-2 text-muted2">·</span>
            <span>Dignified livelihood for Shastra scholars</span>
          </div>

          <div className="mt-3 text-base text-kumkuma">
            <span className="font-kannada" lang="kn">ಶುಭಮಸ್ತು</span>
            <span className="mx-2 text-muted2">·</span>
            <span className="italic">Shubham Bhavatu</span>
          </div>
          <div className="text-xs text-muted2 mt-1 italic">&ldquo;May all be auspicious&rdquo;</div>

          <div className="mt-6 border-l-2 border-mysoreGold pl-4">
            <div className="font-sanskrit text-lg text-ink leading-relaxed" lang="sa">
              ॐ सर्वे भवन्तु सुखिनः<br />सर्वे सन्तु निरामयाः
            </div>
            <div className="text-xs text-muted2 mt-1 italic">
              &ldquo;May all be happy · May all be free from illness&rdquo;
            </div>
          </div>

          <p className="mt-6 text-base md:text-lg text-muted2 max-w-xl">
            Purohith Connect was born in Bengaluru to give trained Vedic scholars — who have spent lifetimes mastering Shastra and Vedas — a modern platform to reach families across India. Every booking directly funds a purohit&apos;s household.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login">
              <Button data-testid="landing-book-cta"
                className="rounded-full bg-saffron hover:bg-saffron-dark text-white px-7 py-6 text-base font-semibold saffron-shadow transition-transform hover:-translate-y-0.5">
                <Om className="text-white text-lg mr-2" /> Book a Pooja
              </Button>
            </Link>
            <Link to="/login?role=priest">
              <Button data-testid="hero-priest-cta"
                variant="outline"
                className="rounded-full border-2 border-mysoreGold text-hoysala hover:bg-marigold/30 px-7 py-6 text-base font-semibold">
                <span className="font-kannada mr-2" lang="kn">ಪುರೋಹಿತರೇ</span> Join as Purohit <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted2">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-kumkuma" /> KYC-verified</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-marigold fill-marigold" /> 4.8 avg rating</div>
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-mysoreGold" /> PuroMitra AI</div>
            <div className="flex items-center gap-2"><KarnatakaFlag size="md" /> Rooted in Karnataka</div>
          </div>

          <div className="mt-3 max-w-xl space-y-3">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-kumkuma font-semibold mb-1">Poojas &amp; Vratas</div>
              <div className="font-kannada text-ink text-[15px] leading-relaxed" lang="kn">
                ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ · ಗೃಹ ಪ್ರವೇಶ · ಗಣೇಶ ಪೂಜೆ · ಲಕ್ಷ್ಮಿ ಪೂಜೆ · ರುದ್ರಾಭಿಷೇಕ · ವರಮಹಾಲಕ್ಷ್ಮಿ ವ್ರತ · ಆಯುಧ ಪೂಜೆ
              </div>
              <div className="text-sm text-muted2 mt-1">
                Satya Narayan Katha · Griha Pravesh · Ganesh Pooja · Lakshmi Pooja · Rudrabhishek · Varamahalakshmi Vrata · Ayudha Puja
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-mysoreGold-dark font-semibold mb-1">Homa &amp; Havan</div>
              <div className="font-kannada text-ink text-[15px] leading-relaxed" lang="kn">
                ನವಗ್ರಹ ಶಾಂತಿ · ಆಯುಷ್ ಹೋಮ · ಸುದರ್ಶನ ಹೋಮ · ವಾಸ್ತು ಹೋಮ · ಚಂಡಿಕಾ ಹೋಮ · ಮೃತ್ಯುಂಜಯ ಹವನ
              </div>
              <div className="text-sm text-muted2 mt-1">
                Navagraha Shanti · Ayush Homa · Sudarshan Homa · Vastu Homa · Chandika Homa · Mrityunjaya Havan
              </div>
            </div>
            <p className="text-sm md:text-base text-muted2 pt-1">
              across India — fixed pricing, samagri included, and <strong className="text-kumkuma">PuroMitra AI</strong> to guide you.
            </p>
          </div>

        </div>
      </section>

      {/* MISSION — priest empowerment story */}
      <section id="mission" className="max-w-6xl mx-auto px-6 py-12 relative z-10 scroll-mt-24">
        <div className="bg-white border border-black/10 rounded-lg p-8 md:p-12 mysore-shadow" data-testid="mission-section">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-marigold/20 border border-mysoreGold/40 rounded-full px-3 py-1 text-xs font-semibold text-hoysala mb-4">
                <span className="font-kannada" lang="kn">ನಮ್ಮ ಉದ್ದೇಶ</span> · Our Mission
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-ink leading-tight">
                A dignified livelihood for every purohit who has learnt <span className="text-kumkuma">Shastra &amp; Veda.</span>
              </h2>
              <p className="mt-4 text-base text-muted2 leading-relaxed">
                Generations of scholars in Karnataka spend 12–18 years mastering the Vedas, Sanskrit, Karma-Kanda and family paddhati — only to find limited, unstable earnings. Purohith Connect exists to change that.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white border border-mysoreGold/40 rounded-xl p-4">
                  <div className="text-3xl font-heading text-kumkuma">₹40k+</div>
                  <div className="text-xs text-muted2 mt-1">Avg monthly earning target per full-time purohit</div>
                </div>
                <div className="bg-white border border-mysoreGold/40 rounded-xl p-4">
                  <div className="text-3xl font-heading text-hoysala">100%</div>
                  <div className="text-xs text-muted2 mt-1">Kannada, Sanskrit & pan-Indian traditions welcome</div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/login?role=priest">
                  <Button data-testid="mission-priest-cta"
                    className="rounded-full bg-hoysala hover:bg-hoysala/80 text-cotton px-6 py-5 text-sm font-semibold">
                    <span className="font-kannada mr-2" lang="kn">ಪುರೋಹಿತರೇ, ನೊಂದಾಯಿಸಿ</span> · Register as Purohit
                  </Button>
                </Link>
                <a href="#priests">
                  <Button variant="outline" className="rounded-full border-mysoreGold text-hoysala hover:bg-chandana/40 px-6 py-5 text-sm font-semibold">
                    Meet our purohits
                  </Button>
                </a>
              </div>
            </div>
            <div className="w-full md:w-72 shrink-0">
              <div className="bg-white border-2 border-marigold/50 rounded-2xl p-5 warm-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <KarnatakaFlag size="lg" withGandaBerunda />
                  <div>
                    <div className="font-heading text-sm text-ink leading-tight">Rooted in Karnataka</div>
                    <div className="text-[10px] text-muted2 uppercase tracking-widest">Bengaluru HQ</div>
                  </div>
                </div>
                <ul className="text-xs text-muted2 space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-kumkuma mt-0.5 shrink-0" />Kannada-first UI, Sanskrit paddhati</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-kumkuma mt-0.5 shrink-0" />Smartha · Sri Vaishnava · Madhwa · Vaidika</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-kumkuma mt-0.5 shrink-0" />Purohits earn 100% of Dakshina — 0 skim</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-kumkuma mt-0.5 shrink-0" />Built by Bengaluru families, for Hindu families</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PUROHIT EMPOWERMENT — "Be your own firm" */}
      <section id="join-purohit" className="landing-priest-marketplace max-w-6xl mx-auto px-6 py-14 relative z-10 scroll-mt-24">
        <div className="relative overflow-hidden rounded-3xl border-2 border-kumkuma/30 warm-shadow" data-testid="join-purohit-section">
          {/* Backdrop */}
            <div className="absolute inset-0 bg-[#7f1820]" />
            <img src="/landing-purohit-arrival-v2.webp" alt="A Vedic purohit arriving for a family ceremony" className="landing-priest-arrival absolute inset-y-0 right-0 h-full w-[62%] object-cover" />
          <div className="absolute inset-0 opacity-10 text-[420px] leading-none font-sanskrit text-white select-none pointer-events-none flex items-center justify-end pr-8">ॐ</div>

          <div className="relative p-8 md:p-14 text-cotton">
            <div className="grid md:grid-cols-5 gap-8 items-start">
              {/* Left — Message (3/5 width) */}
              <div className="md:col-span-3">
                <div className="inline-flex items-center gap-2 bg-marigold/20 border border-marigold/50 rounded-full px-3 py-1 text-xs font-semibold text-marigold mb-5" data-testid="talent-badge">
                  <KarnatakaFlag size="md" />
                  <span className="font-kannada" lang="kn">ಪ್ರತಿಭೆಯಿದ್ದರೆ ಸಾಕು</span>
                  <span>· Have the talent? That&apos;s all you need.</span>
                </div>

                <h2 className="font-heading text-4xl md:text-5xl leading-[1.05] tracking-tight">
                  Own your <span className="text-marigold">firm.</span><br />
                  Not somebody else&apos;s <span className="text-marigold">shift.</span>
                </h2>

                <div className="mt-5 border-l-2 border-marigold pl-4">
                  <div className="font-kannada text-lg leading-relaxed" lang="kn">
                    ನಿಮ್ಮ ಶಾಸ್ತ್ರ ಜ್ಞಾನವೇ ನಿಮ್ಮ ಬಂಡವಾಳ.<br />
                    ರೆಫರೆನ್ಸ್ ಬೇಡ. ತಂಡಕ್ಕೆ ಸೇರಬೇಕಿಲ್ಲ. ನಿಮ್ಮ ಸ್ವಂತ ಮಠವೇ ನೀವು.
                  </div>
                  <div className="text-sm text-cotton/70 italic mt-2">
                    Your knowledge of Shastra is your capital. No references. No teams to join. You are your own institution.
                  </div>
                </div>

                <div className="mt-7 grid sm:grid-cols-2 gap-3">
                  {[
                    { kn: "ಸ್ವತಂತ್ರ ವ್ಯವಸಾಯ", en: "Be your own firm — no employer, no shift roster" },
                    { kn: "ಶಿಫಾರಸು ಬೇಕಿಲ್ಲ", en: "No references, no gatekeepers — pure talent gets you in" },
                    { kn: "100% ದಕ್ಷಿಣೆ", en: "Keep 100% of your Dakshina. Zero platform skim." },
                    { kn: "ನಿಮ್ಮ ಪಂಚಾಂಗ, ನಿಮ್ಮ ಸಮಯ", en: "Set your own calendar, block dates freely, refuse any booking" },
                    { kn: "ಇಡೀ ಭಾರತ ನಿಮ್ಮ ಗ್ರಾಹಕ", en: "All of India can hire you — not just your street" },
                    { kn: "ಗ್ಯಾರಂಟೀಡ್ ಪೇಮೆಂಟ್", en: "Payment guaranteed by the platform — no more chasing families" },
                  ].map((item) => (
                    <div key={item.en} className="flex items-start gap-2 bg-cotton/10 backdrop-blur-sm border border-cotton/20 rounded-xl px-3 py-2.5">
                      <CheckCircle2 className="w-4 h-4 text-marigold shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold font-kannada" lang="kn">{item.kn}</div>
                        <div className="text-xs text-cotton/70 leading-snug mt-0.5">{item.en}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/login?role=priest">
                    <Button data-testid="join-purohit-cta"
                      className="rounded-full bg-marigold hover:bg-marigold/90 text-hoysala px-8 py-6 text-base font-bold shadow-2xl shadow-marigold/40 transition-transform hover:-translate-y-0.5">
                      <span className="font-kannada mr-2 text-lg" lang="kn">ಈಗಲೇ ನೊಂದಾಯಿಸಿ</span>
                      Grab your opportunity <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/kn/purohit" data-testid="kn-read-more">
                    <Button variant="outline"
                      className="rounded-full border-2 border-marigold text-marigold hover:bg-cotton/10 hover:text-marigold px-6 py-6 text-sm font-bold bg-transparent">
                      <span className="font-kannada text-base" lang="kn">ಕನ್ನಡದಲ್ಲಿ ಓದಿ</span>
                      <span className="mx-2 opacity-60">·</span>
                      Read in Kannada
                    </Button>
                  </Link>
                  <a href="tel:+918047001234" className="text-cotton/80 text-sm underline underline-offset-4 hover:text-marigold">
                    Or call us · +91 80 4700 1234
                  </a>
                </div>

                <div className="mt-4 text-xs text-cotton/60 max-w-lg leading-relaxed">
                  Sign-up takes 5 minutes. Upload one ID + one photo. Get KYC-verified within 48 hours. First booking usually within 7 days.
                </div>
              </div>

              {/* Right — Talent = All You Need visual card (2/5 width) */}
              <div className="md:col-span-2">
                <div className="bg-cotton text-ink rounded-2xl p-6 border-4 border-marigold warm-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center">
                      <Om className="text-white text-xl" />
                    </div>
                    <div>
                      <div className="font-heading text-lg text-ink leading-tight">Pure Talent Portal</div>
                      <div className="text-[10px] text-muted2 uppercase tracking-widest">No degrees required</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-kumkuma mt-0.5 shrink-0" />
                      <span><b>Learnt at a Pathashala?</b> You qualify.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-kumkuma mt-0.5 shrink-0" />
                      <span><b>Trained by your Guru at home?</b> You qualify.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-kumkuma mt-0.5 shrink-0" />
                      <span><b>Village purohit for 20 years?</b> You qualify.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-kumkuma mt-0.5 shrink-0" />
                      <span><b>Young graduate, self-studied?</b> You qualify.</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-mysoreGold/40">
                    <div className="text-xs uppercase tracking-widest text-muted2 mb-2">What we DON&apos;T ask for</div>
                    <div className="flex flex-wrap gap-1.5">
                      {["References", "Broker network", "Team affiliation", "Prior gigs", "College degree", "English fluency"].map((no) => (
                        <span key={no} className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 line-through font-semibold">{no}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 bg-gradient-to-br from-marigold/30 to-saffron/20 rounded-xl p-3 border border-marigold/40">
                    <div className="text-xs text-muted2">Full-time earning potential</div>
                    <div className="font-heading text-2xl text-kumkuma mt-1">₹40,000 – ₹80,000 /mo</div>
                    <div className="text-[10px] text-muted2 mt-1">Based on 20-30 poojas/month at Bengaluru avg rates</div>
                  </div>
                </div>

                <div className="mt-4 text-center text-xs text-cotton/70">
                  <span className="font-kannada" lang="kn">ಪ್ರತಿಭೆಯಿದ್ದರೆ, ನೀವೇ ಬ್ರ್ಯಾಂಡ್</span>
                  <br/>
                  If you have the talent, you are the brand.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mantra strip */}
      <section className="max-w-6xl mx-auto px-6 py-6 relative z-10">
        <div key={mantraIdx} data-testid="mantra-strip" className="animate-fade-up inline-flex items-center gap-3 bg-white border border-mysoreGold/40 rounded-full px-4 py-2 mysore-shadow">
          <Om className="text-kumkuma text-xl" />
          <span className="font-sanskrit text-ink text-base" lang="sa">{currentMantra.mantra}</span>
          <span className="text-xs text-muted2 hidden sm:inline">· {currentMantra.english} · {currentMantra.meaning}</span>
        </div>
      </section>

      {/* Stats bar */}
      <section className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 chandana-panel border border-mysoreGold/40 rounded-2xl p-6 mysore-shadow">
          {STATS.map((s) => (
            <div key={s.label} className="text-center border-r last:border-r-0 border-mysoreGold/30 px-2">
              <div className="font-heading text-3xl md:text-4xl text-kumkuma">{s.value}</div>
              <div className="text-[11px] uppercase tracking-widest text-muted2 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* UNDER THE DIVINE GRACE OF — Sri Manjunatha Swamy */}
      <section className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <div className="chandana-panel rounded-2xl p-5 border border-mysoreGold/40 mysore-shadow max-w-3xl" data-testid="grace-manjunatha">
          <div className="grid grid-cols-[110px_1fr] md:grid-cols-[150px_1fr] gap-5 items-center">
            <div className="relative bg-[#f6f3ea] aspect-[3/4] overflow-hidden rounded-xl">
              <img
                src="/ritual-kalasha-v2.png"
                alt="Kalasha and diya prepared for a Vedic ritual"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-mysoreGold-dark">Under the divine grace of</div>
              <div className="font-kannada text-2xl text-kumkuma mt-1" lang="kn">ಶ್ರೀ ಮಂಜುನಾಥ ಸ್ವಾಮಿ</div>
              <div className="font-heading text-xl text-ink mt-0.5">Sri Manjunatha Swamy · Dharmasthala</div>
              <p className="text-sm text-muted2 mt-2 leading-relaxed">
                Every booking on Purohith Connect begins with a silent smarana of the Lord who bestows Dharma to our platform and our families.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="font-kannada text-hoysala text-sm" lang="kn">॥ ॐ ನಮಃ ಶಿವಾಯ ॥</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deity chips — universal Hindu deities */}
      <section className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-mysoreGold-dark mb-2">Blessed by</div>
          <div className="font-kannada text-2xl text-kumkuma mb-6" lang="kn">ಇಷ್ಟ ದೇವತೆಗಳು · Ishta Devatas</div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {DEITIES.map((d) => (
            <span key={d.key} data-testid={`deity-${d.key}`}
              className="inline-flex items-center gap-2 bg-white border border-mysoreGold/40 rounded-full px-4 py-2 text-sm text-ink hover:border-kumkuma transition-colors">
              <Om className="text-kumkuma text-base" />
              <span className="text-ink">{d.name}</span>
            </span>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6"><HoysalaBand className="my-8" /></div>

      {/* POPULAR POOJAS — image cards, Kannada first */}
      <section id="poojas" className="max-w-6xl mx-auto px-6 py-12 relative z-10 scroll-mt-24">
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Kalasha className="w-5 h-6 text-mysoreGold-dark" />
              <div className="font-kannada text-xl text-kumkuma" lang="kn">ಪೂಜೆಗಳು · Poojas</div>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl text-ink">Shubh Karyas we perform</h2>
            <p className="text-sm text-muted2 mt-2 max-w-xl">From daily nithya karma to once-in-a-lifetime samskaras — every ritual conducted per Vedic paddhati, with fixed transparent pricing. <span className="font-semibold text-kumkuma">Auspicious ceremonies only.</span></p>
          </div>
          <Link to="/login" className="text-kumkuma font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            See all poojas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {poojas.map((p) => {
            const meta = POOJA_META[p.slug] || { kn: p.name, deityKn: "", occasion: p.category, tone: "chandana" };
            const t = TONE_STYLES[meta.tone] || TONE_STYLES.chandana;
            const fallbackImage = POOJA_FALLBACK_IMAGES[p.slug] || "/ritual-kalasha-v2.png";
            return (
              <Link key={p.id} to="/login" data-testid={`landing-pooja-${p.slug}`}
                className={`group bg-white border ${t.ring} rounded-2xl overflow-hidden mysore-shadow hover:-translate-y-1 hover:border-kumkuma/60 transition-all`}>
                {/* Image tile with warm unifying overlay */}
                <div className={`h-40 relative overflow-hidden ${t.bg}`}>
                  <img
                    src={p.image_url || fallbackImage}
                    alt={p.name}
                    loading="lazy"
                    onError={(event) => {
                      if (!event.currentTarget.src.endsWith(fallbackImage)) event.currentTarget.src = fallbackImage;
                    }}
                    className="w-full h-full object-cover mix-blend-multiply opacity-95 group-hover:scale-105 transition-transform duration-500"
                    style={{
                      filter: "saturate(0.85) contrast(0.95) sepia(0.08)",
                      objectPosition: POOJA_IMG_POSITION[p.slug] || "center top",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-hoysala/45 via-transparent to-transparent" />
                  <Om className={`absolute top-3 left-3 text-3xl text-white/85 drop-shadow`} />
                  <div className="absolute bottom-3 right-3 bg-kumkuma text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                    ₹{p.base_price.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="p-4">
                  {/* Kannada FIRST */}
                  <div className={`font-kannada text-lg leading-tight ${t.label}`} lang="kn">{meta.kn}</div>
                  {/* English SECOND */}
                  <div className="font-heading text-base text-ink mt-0.5 leading-tight">{p.name}</div>
                  <div className="text-xs text-muted2 mt-1">{meta.occasion} · {p.duration_hours}h</div>
                  <p className="text-sm text-muted2 mt-2 line-clamp-2">{p.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* WHY */}
      <section className="landing-benefits chandana-panel border-y border-mysoreGold/40 py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <div className="font-kannada text-xl text-kumkuma mb-1" lang="kn">ವಿಶೇಷತೆಗಳು · Why choose us</div>
            <h2 className="font-heading text-3xl md:text-4xl text-ink">Why families across India choose us</h2>
            <p className="text-sm text-muted2 mt-2 max-w-2xl">Six reasons Hindu families from Delhi to Bengaluru, Mumbai to Kolkata trust us for their <em>Shubh Karyas</em>.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-mysoreGold/40 p-6 bg-white hover:border-kumkuma transition-colors">
                <div className="w-11 h-11 rounded-full bg-kumkuma/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-kumkuma" />
                </div>
                <div className="font-kannada text-xs text-mysoreGold-dark mb-1" lang="kn">{f.subtitleKn}</div>
                <div className="font-heading text-lg text-ink">{f.title}</div>
                <p className="text-sm text-muted2 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-16 relative z-10 scroll-mt-24">
        <div className="mb-10">
          <div className="font-kannada text-xl text-kumkuma mb-1" lang="kn">ವಿಧಿ · How it works</div>
          <h2 className="font-heading text-3xl md:text-4xl text-ink">How it works</h2>
          <p className="text-sm text-muted2 mt-2">Three sacred steps between you and your ritual.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {HOW_STEPS.map((s) => (
            <div key={s.n} className="bg-white border border-mysoreGold/40 rounded-2xl p-6 mysore-shadow relative overflow-hidden">
              <div className="absolute -top-4 -right-2 font-heading text-7xl text-kumkuma/10 select-none">{s.n}</div>
              <div className="font-heading text-3xl text-kumkuma relative z-10">{s.n}</div>
              <div className="font-heading text-xl text-ink mt-3">{s.t}</div>
              <p className="text-sm text-muted2 mt-2 leading-relaxed">{s.d}</p>
              <div className="mt-4 text-xs text-mysoreGold-dark flex items-center gap-1.5">
                <Om className="text-base text-kumkuma" />
                <span>{s.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PuroMitra AI banner */}
      <section className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-kumkuma via-kumkuma-dark to-hoysala text-white p-8 md:p-12 relative">
          <div className="absolute -right-10 -top-10 font-sanskrit text-[280px] text-white/5 select-none pointer-events-none">ॐ</div>
          <div className="grid md:grid-cols-3 gap-6 items-center relative">
            <div className="md:col-span-2">
              <div className="text-xs uppercase tracking-widest opacity-80">Your Vedic AI Companion</div>
              <h3 className="font-heading text-3xl md:text-4xl mt-2">Meet PuroMitra</h3>
              <div className="mt-1 font-sanskrit text-sm text-white/85" lang="sa">पुरोमित्र — the friend at your side for every shubh karya</div>
              <p className="text-sm md:text-base mt-3 opacity-95 max-w-xl">
                Not sure which pooja fits your occasion? Ask <strong>PuroMitra</strong> — trained on Hindu Vedic traditions across India, family paddhatis and regional customs — to guide you in seconds. From naming ceremony to Ayudha Puja, wedding to housewarming, we&apos;ll match ritual to need.
              </p>
              <Link to="/login">
                <Button data-testid="landing-ai-cta" className="mt-6 rounded-full bg-white text-kumkuma hover:bg-chandana px-6 h-11 font-semibold">
                  <Sparkles className="w-4 h-4 mr-2" /> Ask PuroMitra
                </Button>
              </Link>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="w-40 h-40 rounded-full bg-white/15 backdrop-blur flex items-center justify-center border border-white/30">
                <Om className="text-white text-8xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRIESTS */}
      <section id="priests" className="max-w-6xl mx-auto px-6 py-16 relative z-10 scroll-mt-24">
        <div className="mb-10">
          <div className="font-kannada text-xl text-kumkuma mb-1" lang="kn">ಪುರೋಹಿತರು · Purohits</div>
          <h2 className="font-heading text-3xl md:text-4xl text-ink">Meet our featured purohits</h2>
          <p className="text-sm text-muted2 mt-2 max-w-xl">Every purohit on Purohith Connect has been personally interviewed, Veda-tested and background-verified — from Delhi&apos;s Kashi Vedic tradition to Bengaluru&apos;s Smartha Vedic tradition.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED_PRIESTS.map((p) => (
            <Link key={p.name} to="/login" className="purohit-profile bg-white border border-mysoreGold/40 rounded-2xl overflow-hidden mysore-shadow group" aria-label={`View ${p.name}'s profile`}>
              <div className="purohit-profile-photo">
                <img src={p.image} alt={`${p.name}, ${p.tradition} purohit`} loading="lazy" />
                <div className="purohit-availability"><span /> Available for bookings</div>
              </div>
              <div className="purohit-profile-body">
                <div className="flex-1 min-w-0">
                  <div className="font-kannada text-sm text-kumkuma" lang="kn">{p.sub}</div>
                  <div className="font-heading text-lg text-ink leading-tight mt-0.5">{p.name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted2 mt-1">
                    <Star className="w-3.5 h-3.5 fill-marigold text-marigold" />
                    <span className="font-semibold text-ink">{p.rating}</span>
                    <span>· {p.reviews} · {p.exp}+ yrs</span>
                  </div>
                </div>
              <div className="mt-4 inline-flex items-center gap-1 bg-hoysala/10 text-hoysala text-[10px] uppercase tracking-widest px-2 py-1 rounded-full">
                <BookOpen className="w-3 h-3" /> {p.tradition}
              </div>
              <div className="mt-3 text-xs text-mysoreGold-dark font-semibold">{p.specialty}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.langs.map(l => (
                  <span key={l} className="text-[10px] bg-chandana border border-mysoreGold/40 rounded-full px-2 py-0.5 text-hoysala">{l}</span>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted2 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.area}</div>
                <div className="purohit-profile-link">View profile <ArrowRight className="w-4 h-4" /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS — pan India */}
      <section className="landing-testimonials chandana-panel border-y border-mysoreGold/40 py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <div className="font-kannada text-xl text-kumkuma mb-1" lang="kn">ಅನುಭವಗಳು · Family experiences</div>
            <h2 className="font-heading text-3xl md:text-4xl text-ink">Voices from families across India</h2>
            <p className="text-sm text-muted2 mt-2 max-w-2xl">Delhi, Mumbai, Bengaluru, Mysuru, Kolkata, Mangaluru — one platform, many paramparas.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl border border-mysoreGold/40 p-6 bg-white relative">
                <div className="absolute top-4 right-4 font-sanskrit text-4xl text-kumkuma/10 select-none">॥</div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_,j) => <Star key={j} className="w-4 h-4 fill-marigold text-marigold" />)}
                </div>
                <p className="text-sm text-ink leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-kumkuma/10 flex items-center justify-center">
                    <Om className="text-kumkuma text-lg" />
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-sm">{t.name}</div>
                    <div className="text-xs text-muted2">{t.area} · {t.pooja}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MUHURAT */}
      <section id="muhurat" className="max-w-6xl mx-auto px-6 py-16 relative z-10 scroll-mt-24">
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="font-kannada text-xl text-kumkuma mb-1" lang="kn">ಮುಹೂರ್ತ · Muhurta</div>
            <h2 className="font-heading text-3xl md:text-4xl text-ink">Upcoming auspicious dates</h2>
            <p className="text-sm text-muted2 mt-2">Plan ahead — book your purohit early for these sacred days.</p>
          </div>
          <Calendar className="w-8 h-8 text-mysoreGold-dark" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MUHURAT.map((m, i) => (
            <div key={i} className="bg-white border border-mysoreGold/40 rounded-2xl p-5 mysore-shadow relative overflow-hidden">
              <div className="absolute -top-3 -right-3 font-sanskrit text-6xl text-kumkuma/10 select-none">ॐ</div>
              <div className="text-xs uppercase tracking-widest text-muted2">{m.date}</div>
              <div className="font-kannada text-base text-kumkuma mt-1" lang="kn">{m.tithiKn}</div>
              <div className="font-heading text-sm text-ink mt-0.5">{m.tithi}</div>
              <div className="mt-3 text-sm font-semibold text-kumkuma">{m.pooja}</div>
              <Link to="/login" className="mt-4 text-xs text-kumkuma font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Book slot <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN AS PRIEST */}
      <section className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-hoysala via-hoysala-dark to-kumkuma-dark text-white p-8 md:p-12 relative">
          <div className="absolute -left-10 -bottom-10 font-sanskrit text-[240px] text-white/5 select-none pointer-events-none">ॐ</div>
          <div className="grid md:grid-cols-3 gap-6 items-center relative">
            <div className="md:col-span-2">
              <div className="text-xs uppercase tracking-widest opacity-80 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> For Purohits
              </div>
              <h3 className="font-heading text-3xl md:text-4xl mt-2">Serve devotees. Grow your practice.</h3>
              <p className="text-sm md:text-base mt-3 opacity-95 max-w-2xl">
                Join 120+ Vedic purohits — Kashi Vedic, Smartha, Sri Vaishnava, Madhwa, Vaidika — earning consistent bookings across India. Zero platform fee for the first 30 days. Set your own availability, service areas and specialities.
              </p>
              <Link to="/login?role=priest">
                <Button data-testid="landing-priest-signup" className="mt-6 rounded-full bg-white text-kumkuma hover:bg-chandana px-6 h-11 font-semibold">
                  Apply as Purohit <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="hidden md:flex flex-col gap-3">
              {["KYC support included", "Weekly earnings payout", "Language + tradition matching"].map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-marigold" /> {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-16 relative z-10 scroll-mt-24">
        <div className="mb-10 text-center">
          <div className="font-sanskrit text-xl text-kumkuma mb-1" lang="sa">प्रश्नाः</div>
          <h2 className="font-heading text-3xl md:text-4xl text-ink">Frequently asked</h2>
          <p className="text-sm text-muted2 mt-2">Everything you may want to know before your first booking.</p>
        </div>
        <Accordion type="single" collapsible className="bg-white border border-mysoreGold/40 rounded-2xl px-6 mysore-shadow">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-mysoreGold/25 last:border-b-0" data-testid={`faq-${i}`}>
              <AccordionTrigger className="text-base font-heading text-ink text-left py-5 hover:no-underline hover:text-kumkuma">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted2 leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center relative">
          <div className="flex items-center justify-center gap-6 mb-4">
            <Deepa className="w-12 h-16 text-kumkuma" />
            <div className="font-sanskrit text-6xl text-mysoreGold" lang="sa">ॐ</div>
            <Deepa className="w-12 h-16 text-kumkuma" />
          </div>
          <h2 className="font-heading text-3xl md:text-5xl text-ink max-w-3xl mx-auto leading-tight">
            Begin your family&apos;s next <span className="text-kumkuma">Shubh Karya</span> with reverence.
          </h2>
          <p className="text-sm md:text-base text-muted2 mt-4 max-w-xl mx-auto">
            Hundreds of Hindu families across India choose Purohith Connect for their sacred moments.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login">
              <Button data-testid="final-book-cta" className="rounded-full bg-saffron hover:bg-saffron-dark text-white px-8 py-6 text-base font-semibold saffron-shadow">
                <Om className="text-white text-lg mr-2" /> Book your first pooja
              </Button>
            </Link>
            <a href="#poojas">
              <Button variant="outline" className="rounded-full border-mysoreGold text-hoysala hover:bg-chandana/50 px-8 py-6 text-base font-semibold">
                Browse catalog
              </Button>
            </a>
          </div>
          <div className="mt-8 font-sanskrit text-ink text-lg" lang="sa">
            ॥ शुभमस्तु ॥ समस्त सन्मंगलानि भवन्तु ॥
          </div>
          <div className="text-xs text-muted2 italic mt-1">May all be auspicious · May every well-being come to pass</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-hoysala text-cotton mt-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-saffron flex items-center justify-center relative">
                <Om className="text-white text-2xl" />
                <KarnatakaFlag size="sm" className="absolute -bottom-1.5 -right-1.5 ring-2 ring-hoysala rounded-[3px]" />
              </div>
              <div>
                <div className="font-heading text-2xl">Purohith Connect</div>
                <div className="text-xs text-cotton/60 flex items-center gap-1.5 mt-0.5">
                  <KarnatakaFlag size="sm" />
                  <span>Bengaluru · Karnataka · Since 2024</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-cotton/70 leading-relaxed max-w-md">
              Born in Bengaluru to create dignified livelihoods for Vedic scholars who have mastered Shastra and Vedas. Every booking directly funds a purohit&apos;s household — Kannada-first, pan-India traditions welcomed.
            </p>
            <div className="mt-5">
              <MadeInKarnatakaBadge tone="dark" />
            </div>
            <div className="font-sanskrit text-mysoreGold-light mt-6 text-lg" lang="sa">॥ सत्यं शिवं सुन्दरम् ॥</div>
            <div className="text-xs text-cotton/50 italic mt-1">Truth · Auspiciousness · Beauty</div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-cotton/60 mb-4">Explore</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#poojas" className="text-cotton/80 hover:text-marigold">Poojas</a></li>
              <li><a href="#priests" className="text-cotton/80 hover:text-marigold">Priests</a></li>
              <li><a href="#how" className="text-cotton/80 hover:text-marigold">How it works</a></li>
              <li><a href="#muhurat" className="text-cotton/80 hover:text-marigold">Muhurat</a></li>
              <li><a href="#faq" className="text-cotton/80 hover:text-marigold">FAQ</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-cotton/60 mb-4">Contact</div>
            <ul className="space-y-3 text-sm text-cotton/80">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-marigold" /> +91 80 4700 1234</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-marigold" /> namaste@purohithconnect.com</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-marigold" /> Bengaluru, Karnataka</li>
              <li className="flex items-center gap-2"><Instagram className="w-4 h-4 text-marigold" /> @purohithconnect</li>
            </ul>
            <div className="mt-6 flex gap-2">
              <Link to="/login">
                <Button className="rounded-full bg-saffron hover:bg-saffron-dark text-white h-9 px-4 text-xs font-semibold">
                  Book Pooja
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline" className="rounded-full border-cotton/20 text-cotton hover:bg-cotton/10 h-9 px-4 text-xs" data-testid="footer-admin">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-cotton/10">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-cotton/50">
            <div>© 2026 Purohith Connect Technologies Pvt Ltd · All rights reserved</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-marigold">Privacy</a>
              <a href="#" className="hover:text-marigold">Terms</a>
              <a href="#" className="hover:text-marigold">Refund Policy</a>
            </div>
          </div>
        </div>
        <div className="sacred-border w-full opacity-40" />
      </footer>
    </div>
  );
}
