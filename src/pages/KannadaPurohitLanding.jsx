import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Om } from "@/components/Om";
import { KarnatakaFlag, MadeInKarnatakaBadge } from "@/components/KarnatakaFlag";
import { CheckCircle2, X, Phone, MessageCircle, ArrowRight, ShieldCheck, Sparkles, IndianRupee, Calendar, MapPin } from "lucide-react";

/**
 * ಪುರೋಹಿತ ಸಂಪರ್ಕ · ಕನ್ನಡ ಪುಟ
 * Kannada-only long-form landing for pathashala grads, village purohits,
 * and self-taught scholars who prefer reading in their mother tongue.
 * ~30-second read, warm Kannadiga voice.
 */
export default function KannadaPurohitLanding() {
  return (
    <div className="min-h-screen bg-cotton text-ink font-kannada" lang="kn">
      {/* Sacred border */}
      <div className="sacred-border w-full" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-cotton/90 backdrop-blur-lg border-b border-warmBorder/60">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center saffron-shadow relative">
              <Om className="text-white text-2xl" />
              <KarnatakaFlag size="sm" className="absolute -bottom-1.5 -right-1.5 ring-2 ring-cotton rounded-[3px]" />
            </div>
            <div>
              <div className="font-heading text-xl text-saffron leading-none">ಪುರೋಹಿತ ಸಂಪರ್ಕ</div>
              <div className="text-[11px] text-muted2 mt-1 flex items-center gap-1.5">
                <KarnatakaFlag size="sm" /> ಬೆಂಗಳೂರಿನಿಂದ · ಕರ್ನಾಟಕ
              </div>
            </div>
          </Link>
          <Link to="/" className="text-xs text-muted2 hover:text-saffron underline underline-offset-2">
            English &nbsp;→
          </Link>
        </div>
      </header>

      {/* Hero — Kannadiga voice, warm greeting */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <div className="inline-flex items-center gap-2 bg-marigold/20 border border-mysoreGold/50 rounded-full px-3 py-1 text-xs font-semibold text-hoysala mb-4">
          <KarnatakaFlag size="md" /> ಕರ್ನಾಟಕದ ಶಾಸ್ತ್ರ ಪಂಡಿತರಿಗಾಗಿ ಒಂದು ವಿನಂತಿ
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.1] tracking-tight">
          ನಮಸ್ಕಾರ, <span className="text-saffron">ಗುರುಗಳೇ.</span>
        </h1>

        <div className="mt-6 text-lg text-ink leading-relaxed max-w-2xl space-y-4">
          <p>
            ನೀವು ಹಲವು ವರ್ಷಗಳ ಕಾಲ <b className="text-kumkuma">ಶಾಸ್ತ್ರ, ವೇದ, ಸಂಸ್ಕೃತ</b> ಕಲಿತಿದ್ದೀರಿ.
            ಗುರುಕುಲದಲ್ಲಿಯೋ, ಪಾಠಶಾಲೆಯಲ್ಲಿಯೋ, ನಿಮ್ಮ ಅಜ್ಜ-ತಂದೆಯರಿಂದಲೋ ಆ ಜ್ಞಾನ ಬಂದಿದೆ.
          </p>
          <p>
            ಆದರೆ ಈ ಜ್ಞಾನಕ್ಕೆ ಸರಿಯಾದ ಬೆಲೆ, ಸ್ಥಿರವಾದ ಆದಾಯ, ಗೌರವಪೂರ್ಣ ಬದುಕು ಸಿಗುತ್ತಿಲ್ಲ ಎಂಬ ನೋವು ನಿಮಗೂ ಇರಬಹುದು.
            ಆ ನೋವಿಗೆ ಪರಿಹಾರ ಕೊಡಲಿಕ್ಕೇ <b className="text-saffron">ಪುರೋಹಿತ ಸಂಪರ್ಕ</b> ಹುಟ್ಟಿಕೊಂಡಿದೆ.
          </p>
        </div>
      </section>

      {/* One-line manifesto */}
      <section className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white border-2 border-mysoreGold/40 rounded-2xl p-6 md:p-8 mysore-shadow relative overflow-hidden">
          <div className="absolute -right-4 top-2 text-[180px] leading-none opacity-5 select-none pointer-events-none">ॐ</div>
          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-muted2 mb-2">ನಮ್ಮ ಒಪ್ಪಂದ ಸರಳ</div>
            <div className="font-heading text-2xl md:text-3xl text-ink leading-snug">
              &ldquo;ನಿಮ್ಮ ಬಳಿ <span className="text-kumkuma">ಪ್ರತಿಭೆ</span> ಇದ್ದರೆ ಸಾಕು.<br />
              ಉಳಿದದ್ದೆಲ್ಲಾ ನಾವು ನೋಡಿಕೊಳ್ಳುತ್ತೇವೆ.&rdquo;
            </div>
            <div className="mt-3 text-sm text-muted2">
              — ರೆಫರೆನ್ಸ್, ತಂಡದ ಒತ್ತಡ, ಶಿಫಾರಸ್ಸು — ಇವು ಯಾವುದೂ ನಮಗೆ ಬೇಡ.
            </div>
          </div>
        </div>
      </section>

      {/* Who qualifies */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-kumkuma font-semibold">ನೀವು ಇವರಲ್ಲಿ ಒಬ್ಬರೇ?</div>
          <h2 className="font-heading text-3xl text-ink mt-1">ಅರ್ಹತೆ — ಈ ನಾಲ್ಕರಲ್ಲಿ ಒಂದೇ ಒಂದು ಸಾಕು</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "ಪಾಠಶಾಲೆ / ವೇದ ಗುರುಕುಲ", desc: "ಶುಕ್ಲ-ಯಜುಸ್, ಕೃಷ್ಣ-ಯಜುಸ್, ಋಗ್ ಅಥವಾ ಸಾಮ — ಯಾವುದೇ ಪಾಠಶಾಲೆಯಲ್ಲಿ ಕಲಿತಿದ್ದೀರಿ." },
            { title: "ಗುರುಗಳ ಬಳಿ ಸ್ವತಃ ಕಲಿತವರು", desc: "ನಿಮ್ಮ ತಂದೆ / ಅಜ್ಜ / ಪೂರ್ವಜರಿಂದ ಪರಂಪರೆಯಾಗಿ ಪೂಜಾ ಪದ್ಧತಿ ಬಂದಿದೆ." },
            { title: "ಗ್ರಾಮ / ಊರಿನ ಪುರೋಹಿತರು", desc: "ವರ್ಷಗಳಿಂದ ಊರಿನಲ್ಲಿ ಪೂಜೆ ಮಾಡಿಸುತ್ತಿದ್ದೀರಿ — ಈಗ ಇಡೀ ಬೆಂಗಳೂರು ನಿಮ್ಮ ಗ್ರಾಹಕ." },
            { title: "ಯುವ ಪಂಡಿತರು — ಸ್ವಂತ ಅಧ್ಯಯನ", desc: "ಪುಸ್ತಕ, ಗುರುಗಳ ಶ್ರವಣ, ಆನ್‌ಲೈನ್ ಪಾಠಗಳಿಂದ ಶಾಸ್ತ್ರ ಕಲಿತಿದ್ದೀರಿ." },
          ].map((c) => (
            <div key={c.title} className="bg-white border border-warmBorder rounded-2xl p-5 warm-shadow">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-saffron/10 border border-saffron/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-saffron" />
                </div>
                <div>
                  <div className="font-heading text-lg text-ink">{c.title}</div>
                  <div className="text-sm text-muted2 mt-1 leading-relaxed">{c.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What we DON'T ask */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-white to-chandana/40 border-2 border-mysoreGold/30 rounded-2xl p-6 md:p-8">
          <div className="text-xs uppercase tracking-widest text-kumkuma font-semibold mb-2">ನಾವು ಕೇಳದೇ ಇರುವ ವಿಷಯಗಳು</div>
          <h2 className="font-heading text-2xl md:text-3xl text-ink leading-snug">
            ಈ ಆರು ವಿಷಯಗಳಿಗಾಗಿ ನೀವು <span className="text-kumkuma">ಚಿಂತಿಸಬೇಡಿ</span>
          </h2>
          <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              "ಶಿಫಾರಸ್ಸು ಪತ್ರ",
              "ಬ್ರೋಕರ್ ನೆಟ್‌ವರ್ಕ್",
              "ಇನ್ನೊಂದು ತಂಡಕ್ಕೆ ಸೇರುವಿಕೆ",
              "ಹಿಂದಿನ ಗಿಗ್‌ಗಳ ಪುರಾವೆ",
              "ಕಾಲೇಜು ಪದವಿ",
              "ಇಂಗ್ಲಿಷ್ ಸಾಮರ್ಥ್ಯ",
            ].map((no) => (
              <div key={no} className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-2">
                <X className="w-4 h-4 text-red-700 shrink-0" />
                <span className="text-sm font-semibold text-red-800 line-through">{no}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted2 italic leading-relaxed">
            ನಾವು ಬಯಸುವುದು ಒಂದೇ — ನೀವು ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ಪೂಜೆ ಮಾಡಬಲ್ಲಿರಾ? ಗ್ರಾಹಕರೊಂದಿಗೆ ಗೌರವದಿಂದ ವರ್ತಿಸಬಲ್ಲಿರಾ? ಅಷ್ಟೇ.
          </div>
        </div>
      </section>

      {/* Benefits — big grid */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-xs uppercase tracking-widest text-kumkuma font-semibold mb-2">ನಿಮಗೆ ಸಿಗುವ ಪ್ರಯೋಜನ</div>
        <h2 className="font-heading text-3xl md:text-4xl text-ink">ನೀವೇ ನಿಮ್ಮ <span className="text-saffron">ಸ್ವಂತ ಮಠ.</span></h2>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {[
            {
              icon: IndianRupee, tone: "kumkuma",
              title: "100% ದಕ್ಷಿಣೆ ನಿಮಗೇ",
              desc: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಒಂದೇ ಒಂದು ರೂಪಾಯಿಯನ್ನೂ ಕಡಿತಗೊಳಿಸುವುದಿಲ್ಲ. ದಕ್ಷಿಣೆ ಸಂಪೂರ್ಣವಾಗಿ ನಿಮಗೆ.",
            },
            {
              icon: Calendar, tone: "hoysala",
              title: "ನಿಮ್ಮ ಪಂಚಾಂಗ, ನಿಮ್ಮ ಸಮಯ",
              desc: "ಯಾವ ದಿನ ಬೇಕೋ ಆ ದಿನ ಬ್ಲಾಕ್ ಮಾಡಿ. ಯಾವ ಪೂಜೆ ಬೇಕೋ ಅಷ್ಟೇ ಸ್ವೀಕರಿಸಿ.",
            },
            {
              icon: MapPin, tone: "mysoreGold-dark",
              title: "ಇಡೀ ಬೆಂಗಳೂರು / ಕರ್ನಾಟಕ / ಭಾರತ ನಿಮ್ಮ ಗ್ರಾಹಕ",
              desc: "ಈಗ ನಿಮ್ಮ ಬೀದಿ, ನಿಮ್ಮ ಊರು ದಾಟಿ — ಎಲ್ಲಿಂದಲಾದರೂ ಗ್ರಾಹಕರು ನಿಮ್ಮನ್ನು ಬುಕ್ ಮಾಡಬಹುದು.",
            },
            {
              icon: ShieldCheck, tone: "saffron",
              title: "ಗ್ಯಾರಂಟೀಡ್ ಪೇಮೆಂಟ್",
              desc: "ಗ್ರಾಹಕರು ಮೊದಲೇ ಪಾವತಿ ಮಾಡುತ್ತಾರೆ. ಪೂಜೆ ಮುಗಿದ ತಕ್ಷಣ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಬರುತ್ತದೆ.",
            },
            {
              icon: Sparkles, tone: "kumkuma",
              title: "ನಿಮ್ಮ ಬ್ರ್ಯಾಂಡ್ ಅನ್ನೇ ನೀವು ಬೆಳೆಸಿ",
              desc: "ರೇಟಿಂಗ್, ವಿಮರ್ಶೆಗಳಿಂದ ನಿಮ್ಮದೇ ಗುರುತು. ಗ್ರಾಹಕರು ನಿಮ್ಮನ್ನೇ ಹುಡುಕಿ ಬರುತ್ತಾರೆ.",
            },
            {
              icon: CheckCircle2, tone: "hoysala",
              title: "ಗೌರವಪೂರ್ಣ ಸಂಬಂಧ",
              desc: "ಯಾವುದೇ ಮಧ್ಯವರ್ತಿ ಇಲ್ಲ. ನಿಮ್ಮ ಜ್ಞಾನಕ್ಕೆ, ಶ್ರಮಕ್ಕೆ ಸಮಾಜದಿಂದ ಸರಿಯಾದ ಗೌರವ.",
            },
          ].map((b) => (
            <div key={b.title} className="bg-white border border-warmBorder rounded-2xl p-5 warm-shadow">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-saffron/10 border border-saffron/30 flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-saffron" />
                </div>
                <div>
                  <div className="font-heading text-lg text-ink">{b.title}</div>
                  <div className="text-sm text-muted2 mt-1 leading-relaxed">{b.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Income breakdown */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-gradient-to-br from-hoysala via-kumkuma to-saffron-dark rounded-3xl p-8 md:p-12 text-cotton relative overflow-hidden">
          <div className="absolute inset-0 text-[420px] leading-none font-sanskrit text-white opacity-5 select-none pointer-events-none flex items-center justify-end pr-8">ॐ</div>
          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-marigold font-semibold mb-2">ಎಷ್ಟು ಸಂಪಾದನೆ?</div>
            <h2 className="font-heading text-3xl md:text-4xl leading-tight">
              ಪೂರ್ಣಕಾಲಿಕ ಪುರೋಹಿತರಿಗೆ<br />
              <span className="text-marigold">₹40,000 – ₹80,000 / ತಿಂಗಳಿಗೆ</span>
            </h2>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              <div className="bg-cotton/10 backdrop-blur border border-cotton/20 rounded-xl p-4">
                <div className="text-xs text-cotton/70 uppercase tracking-widest">ಸಣ್ಣ ಪೂಜೆ</div>
                <div className="font-heading text-xl mt-1 text-marigold">₹1,500 – ₹2,500</div>
                <div className="text-[11px] text-cotton/60 mt-0.5">ಗಣೇಶ, ಸತ್ಯನಾರಾಯಣ, ನಾಮಕರಣ</div>
              </div>
              <div className="bg-cotton/10 backdrop-blur border border-cotton/20 rounded-xl p-4">
                <div className="text-xs text-cotton/70 uppercase tracking-widest">ಮಧ್ಯಮ ಪೂಜೆ</div>
                <div className="font-heading text-xl mt-1 text-marigold">₹3,000 – ₹5,000</div>
                <div className="text-[11px] text-cotton/60 mt-0.5">ಗೃಹಪ್ರವೇಶ, ಆಯುಷ್ ಹೋಮ</div>
              </div>
              <div className="bg-cotton/10 backdrop-blur border border-cotton/20 rounded-xl p-4">
                <div className="text-xs text-cotton/70 uppercase tracking-widest">ದೊಡ್ಡ ಪೂಜೆ / ಹೋಮ</div>
                <div className="font-heading text-xl mt-1 text-marigold">₹6,000 – ₹15,000</div>
                <div className="text-[11px] text-cotton/60 mt-0.5">ರುದ್ರಾಭಿಷೇಕ, ನವಗ್ರಹ, ವಿವಾಹ</div>
              </div>
            </div>
            <div className="mt-6 text-sm text-cotton/70 max-w-2xl leading-relaxed">
              ತಿಂಗಳಿಗೆ 20-30 ಪೂಜೆಗಳನ್ನು ಮಾಡಿದರೆ ₹50,000-70,000 ಸುಲಭ. ವಿಶೇಷ ಹೋಮ / ಹಬ್ಬಗಳ ಸಮಯದಲ್ಲಿ ಇನ್ನೂ ಹೆಚ್ಚು.
            </div>
          </div>
        </div>
      </section>

      {/* How to sign up */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-xs uppercase tracking-widest text-kumkuma font-semibold mb-2">ನೊಂದಣಿ ಪ್ರಕ್ರಿಯೆ</div>
        <h2 className="font-heading text-3xl md:text-4xl text-ink">ಕೇವಲ <span className="text-saffron">3 ಹಂತಗಳಲ್ಲಿ</span> ನೀವು ಸಿದ್ಧ</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { n: "01", t: "ಫೋನ್ ಸಂಖ್ಯೆಯಿಂದ ಲಾಗಿನ್", d: "ಒಂದು ಒಟಿಪಿ. ಪಾಸ್‌ವರ್ಡ್ ಬೇಡ. ನೊಂದಣಿಗೆ 2 ನಿಮಿಷ." },
            { n: "02", t: "ನಿಮ್ಮ ಪರಿಚಯ ಸಲ್ಲಿಸಿ", d: "ಫೋಟೋ, ಆಧಾರ್ ಕಾರ್ಡ್, ಅನುಭವ, ಭಾಷೆಗಳು, ಪೂಜಾ ಪ್ರವೀಣ್ಯತೆಗಳು." },
            { n: "03", t: "48 ಗಂಟೆಯಲ್ಲಿ ಪರಿಶೀಲನೆ", d: "ನಮ್ಮ ಆಡ್ಮಿನ್ ಪರಿಶೀಲಿಸಿ ಒಪ್ಪುತ್ತಾರೆ. ನಂತರ ಗ್ರಾಹಕರು ನಿಮ್ಮನ್ನು ಬುಕ್ ಮಾಡಬಹುದು." },
          ].map((s) => (
            <div key={s.n} className="bg-white border border-warmBorder rounded-2xl p-6 warm-shadow relative">
              <div className="text-5xl font-heading text-marigold/40 leading-none">{s.n}</div>
              <div className="mt-3 font-heading text-xl text-ink">{s.t}</div>
              <div className="mt-2 text-sm text-muted2 leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center bg-gradient-to-br from-marigold/15 to-chandana rounded-3xl p-8 md:p-12 border-2 border-mysoreGold/30 mysore-shadow relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 text-[300px] leading-none font-sanskrit text-hoysala select-none pointer-events-none flex items-center justify-center">ॐ</div>
          <div className="relative">
            <h2 className="font-heading text-3xl md:text-5xl text-ink leading-tight">
              ಪ್ರತಿಭೆ ಇದೆಯೇ?<br />
              <span className="text-kumkuma">ಈಗಲೇ ಬನ್ನಿ.</span>
            </h2>
            <p className="mt-4 text-base text-muted2 max-w-xl mx-auto leading-relaxed">
              ನಿಮ್ಮ ಜ್ಞಾನಕ್ಕೆ ಸರಿಯಾದ ವೇದಿಕೆ ಸಿಗಬೇಕು. ನಿಮ್ಮ ಶ್ರಮಕ್ಕೆ ಸರಿಯಾದ ಪ್ರತಿಫಲ ಬರಬೇಕು. ಇದೇ ನಮ್ಮ ವಚನ.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/login?role=priest">
                <Button data-testid="kn-purohit-cta"
                  className="rounded-full bg-saffron hover:bg-saffron-dark text-white px-8 py-6 text-base font-bold saffron-shadow transition-transform hover:-translate-y-0.5">
                  <Om className="text-white text-lg mr-2" /> ಈಗಲೇ ನೊಂದಾಯಿಸಿ <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:+918047001234">
                <Button variant="outline" className="rounded-full border-2 border-hoysala text-hoysala hover:bg-white px-8 py-6 text-base font-bold">
                  <Phone className="w-4 h-4 mr-2" /> +91 80 4700 1234
                </Button>
              </a>
              <a href="https://wa.me/918047001234?text=%E0%B2%A8%E0%B2%AE%E0%B2%B8%E0%B3%8D%E0%B2%95%E0%B2%BE%E0%B2%B0.%20%E0%B2%AA%E0%B3%81%E0%B2%B0%E0%B3%8B%E0%B2%B9%E0%B2%BF%E0%B2%A4%20%E0%B2%B8%E0%B2%82%E0%B2%AA%E0%B2%B0%E0%B3%8D%E0%B2%95%E0%B2%A6%E0%B2%B2%E0%B3%8D%E0%B2%B2%E0%B2%BF%20%E0%B2%A8%E0%B3%8B%E0%B2%82%E0%B2%A6%E0%B2%A3%E0%B2%BF%20%E0%B2%AE%E0%B2%BE%E0%B2%A1%E0%B2%B2%E0%B3%81%20%E0%B2%AC%E0%B2%AF%E0%B2%B8%E0%B3%81%E0%B2%A4%E0%B3%8D%E0%B2%A4%E0%B3%87%E0%B2%A8%E0%B3%86.">
                <Button variant="outline" className="rounded-full border-2 border-green-600 text-green-700 hover:bg-green-50 px-8 py-6 text-base font-bold">
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp ನಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ
                </Button>
              </a>
            </div>

            <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-xs text-muted2">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-kumkuma" /> KYC ಪ್ರಮಾಣಿತ</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-saffron" /> 5 ನಿಮಿಷದ ನೊಂದಣಿ</span>
              <span className="flex items-center gap-1"><MadeInKarnatakaBadge /></span>
            </div>

            <div className="mt-8 font-sanskrit text-hoysala text-lg" lang="sa">
              ॥ ಸತ್ಯಂ ಶಿವಂ ಸುಂದರಂ ॥
            </div>
            <div className="text-xs text-muted2 italic mt-1">ಶುಭಮಸ್ತು · ನಿಮ್ಮ ಶ್ರೇಯಸ್ಸಿಗಾಗಿ</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-hoysala text-cotton mt-4">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center relative">
              <Om className="text-white text-2xl" />
              <KarnatakaFlag size="sm" className="absolute -bottom-1.5 -right-1.5 ring-2 ring-hoysala rounded-[3px]" />
            </div>
            <div>
              <div className="font-heading text-xl">ಪುರೋಹಿತ ಸಂಪರ್ಕ</div>
              <div className="text-xs text-cotton/60">ಬೆಂಗಳೂರು · ಕರ್ನಾಟಕ · 2024ರಿಂದ</div>
            </div>
          </div>
          <div className="text-sm text-cotton/70 leading-relaxed max-w-xl">
            ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹುಟ್ಟಿದ ಈ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್, ವೇದ-ಶಾಸ್ತ್ರ ಕಲಿತ ಪ್ರತಿಯೊಬ್ಬ ಪಂಡಿತರಿಗೂ ಗೌರವಪೂರ್ಣ ಜೀವನೋಪಾಯವನ್ನು ಕೊಡುವ ಗುರಿ ಹೊಂದಿದೆ.
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-cotton/60">
            <Link to="/" className="hover:text-marigold underline underline-offset-2">English site</Link>
            <span>·</span>
            <a href="#top" className="hover:text-marigold">Top</a>
            <span>·</span>
            <a href="tel:+918047001234" className="hover:text-marigold">+91 80 4700 1234</a>
            <span>·</span>
            <a href="mailto:namaste@purohithconnect.com" className="hover:text-marigold">namaste@purohithconnect.com</a>
          </div>
          <div className="mt-6 text-xs text-cotton/50">© 2026 Purohith Connect Technologies Pvt Ltd</div>
        </div>
      </footer>
    </div>
  );
}
