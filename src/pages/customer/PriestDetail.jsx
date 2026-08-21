import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Languages, ArrowLeft, Award, Sparkles } from "lucide-react";

export default function PriestDetail() {
  const { priestId } = useParams();
  const [params] = useSearchParams();
  const preselectedPooja = params.get("pooja");
  const [priest, setPriest] = useState(null);
  const [poojas, setPoojas] = useState([]);

  useEffect(() => {
    api.get(`/priests/${priestId}`).then(({ data }) => setPriest(data)).catch(() => {});
    api.get("/poojas").then(({ data }) => setPoojas(data)).catch(() => {});
  }, [priestId]);

  if (!priest) return <div className="p-6 text-muted2" data-testid="priest-loading">Loading…</div>;

  const offeredPoojas = poojas.filter(p => (priest.poojas_offered || []).includes(p.slug));

  return (
    <div className="pb-8">
      {/* Hero */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-saffron/20 to-marigold/30"></div>
        <Link to="/app/priests" className="absolute top-4 left-4 bg-white/90 rounded-full p-2 warm-shadow" data-testid="priest-detail-back">
          <ArrowLeft className="w-4 h-4 text-ink" />
        </Link>
        <div className="px-6 -mt-14 relative">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-saffron/20 border-4 border-cotton flex items-center justify-center">
            {priest.photo_url ? (
              <img src={priest.photo_url} alt={priest.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-heading text-4xl text-saffron">{priest.name?.[0] || "P"}</span>
            )}
          </div>
          <h1 className="font-heading text-2xl text-ink mt-3">{priest.name}</h1>
          <div className="flex items-center gap-1 text-sm text-muted2 mt-1">
            <Star className="w-4 h-4 fill-marigold text-marigold" />
            <span className="font-semibold text-ink">{priest.rating_avg?.toFixed(1) || "New"}</span>
            <span>· {priest.rating_count || 0} reviews</span>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="px-6 mt-5 grid grid-cols-3 gap-2">
        <InfoCell icon={Award} label="Experience" value={`${priest.experience_years || 0}+ yrs`} />
        <InfoCell icon={Languages} label="Languages" value={(priest.languages || []).length} />
        <InfoCell icon={Sparkles} label="Poojas" value={(priest.poojas_offered || []).length} />
      </div>

      {/* Bio */}
      {priest.bio && (
        <section className="px-6 mt-6">
          <h2 className="font-heading text-lg text-ink mb-2">About</h2>
          <p className="text-sm text-muted2 leading-relaxed">{priest.bio}</p>
        </section>
      )}

      {/* Areas + Languages */}
      <section className="px-6 mt-6 space-y-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted2 mb-2">Service Areas</div>
          <div className="flex flex-wrap gap-2">
            {(priest.service_areas || []).map(a => (
              <span key={a} className="text-xs bg-white border border-warmBorder rounded-full px-3 py-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-saffron" /> {a}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted2 mb-2">Languages</div>
          <div className="flex flex-wrap gap-2">
            {(priest.languages || []).map(l => (
              <span key={l} className="text-xs bg-white border border-warmBorder rounded-full px-3 py-1">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Offered Poojas */}
      <section className="px-6 mt-6">
        <h2 className="font-heading text-lg text-ink mb-3">Poojas performed</h2>
        <div className="space-y-2">
          {offeredPoojas.map(p => (
            <div key={p.id} className="bg-white border border-warmBorder rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-ink">{p.name}</div>
                <div className="text-xs text-muted2">{p.duration_hours}h · ₹{p.base_price.toLocaleString("en-IN")}</div>
              </div>
              <Link to={`/app/book/${priest.id}?pooja=${p.slug}`} data-testid={`book-pooja-${p.slug}`}>
                <Button size="sm" className="rounded-full bg-saffron hover:bg-saffron-dark text-white h-9 px-4">Book</Button>
              </Link>
            </div>
          ))}
          {offeredPoojas.length === 0 && (
            <div className="text-sm text-muted2">Priest hasn't listed poojas yet.</div>
          )}
        </div>
      </section>

      {/* Reviews */}
      {priest.reviews && priest.reviews.length > 0 && (
        <section className="px-6 mt-6">
          <h2 className="font-heading text-lg text-ink mb-3">What families say</h2>
          <div className="space-y-2">
            {priest.reviews.map(r => (
              <div key={r.id} className="bg-white border border-warmBorder rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-semibold text-sm text-ink">{r.customer_name}</div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_,i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-marigold text-marigold" : "text-warmBorder"}`} />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted2">{r.comment}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sticky book button (default pooja) */}
      {preselectedPooja && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6">
          <Link to={`/app/book/${priest.id}?pooja=${preselectedPooja}`}>
            <Button data-testid="priest-detail-book-btn" className="w-full h-12 rounded-full bg-saffron hover:bg-saffron-dark text-white font-semibold saffron-shadow">
              Continue booking
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function InfoCell({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-warmBorder rounded-xl p-3 text-center">
      <Icon className="w-4 h-4 text-saffron mx-auto mb-1" />
      <div className="text-[10px] uppercase tracking-widest text-muted2">{label}</div>
      <div className="font-heading text-lg text-ink">{value}</div>
    </div>
  );
}
