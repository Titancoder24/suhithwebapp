import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import { Star, MapPin, Languages, ArrowLeft } from "lucide-react";

const BANGALORE_AREAS = ["Jayanagar", "Indiranagar", "Whitefield", "HSR Layout", "Malleshwaram", "Koramangala", "JP Nagar", "Basavanagudi", "Electronic City", "Yelahanka"];
const LANGUAGES = ["Kannada", "Sanskrit", "Hindi", "Telugu", "Tamil", "English"];

export default function PriestList() {
  const [params, setParams] = useSearchParams();
  const pooja = params.get("pooja") || "";
  const area = params.get("area") || "";
  const language = params.get("language") || "";
  const [priests, setPriests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [poojaName, setPoojaName] = useState("");

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (pooja) q.set("pooja", pooja);
    if (area) q.set("area", area);
    if (language) q.set("language", language);
    api.get(`/priests?${q.toString()}`).then(({ data }) => { setPriests(data); setLoading(false); }).catch(() => setLoading(false));
    if (pooja) {
      api.get(`/poojas/${pooja}`).then(({ data }) => setPoojaName(data.name)).catch(() => {});
    } else {
      setPoojaName("");
    }
  }, [pooja, area, language]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  };

  return (
    <div className="pb-8">
      <header className="px-6 pt-6 pb-4">
        <Link to="/app" className="text-sm text-muted2 hover:text-saffron flex items-center gap-2 mb-3" data-testid="priest-list-back">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <h1 className="font-heading text-2xl text-ink">{poojaName ? `Priests for ${poojaName}` : "Verified Priests"}</h1>
        <p className="text-sm text-muted2 mt-1">{priests.length} available</p>
      </header>

      {/* Filters */}
      <div className="px-6 mb-5 space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-muted2 self-center whitespace-nowrap">Area:</span>
          <button data-testid="filter-area-all" onClick={()=>updateParam("area","")}
            className={`text-xs rounded-full px-3 py-1.5 whitespace-nowrap ${!area ? "bg-saffron text-white" : "bg-white border border-warmBorder text-muted2"}`}>All</button>
          {BANGALORE_AREAS.map(a => (
            <button key={a} data-testid={`filter-area-${a.replace(/\s+/g,'-').toLowerCase()}`} onClick={()=>updateParam("area", a)}
              className={`text-xs rounded-full px-3 py-1.5 whitespace-nowrap ${area===a ? "bg-saffron text-white" : "bg-white border border-warmBorder text-muted2"}`}>{a}</button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-muted2 self-center whitespace-nowrap">Language:</span>
          <button onClick={()=>updateParam("language","")}
            className={`text-xs rounded-full px-3 py-1.5 whitespace-nowrap ${!language ? "bg-saffron text-white" : "bg-white border border-warmBorder text-muted2"}`}>All</button>
          {LANGUAGES.map(l => (
            <button key={l} onClick={()=>updateParam("language", l)}
              className={`text-xs rounded-full px-3 py-1.5 whitespace-nowrap ${language===l ? "bg-saffron text-white" : "bg-white border border-warmBorder text-muted2"}`}>{l}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-6 space-y-3">
        {loading && <div className="text-center text-muted2 py-8">Loading priests…</div>}
        {!loading && priests.length === 0 && (
          <div className="bg-white border border-warmBorder rounded-xl p-6 text-center text-muted2">
            No verified priests match these filters yet. Try widening your search.
          </div>
        )}
        {priests.map(p => (
          <Link
            key={p.id}
            data-testid={`priest-card-${p.id}`}
            to={`/app/priests/${p.id}${pooja ? `?pooja=${pooja}` : ""}`}
            className="block bg-white border border-warmBorder rounded-xl p-4 warm-shadow hover:-translate-y-0.5 transition-transform"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-saffron/10 flex items-center justify-center shrink-0">
                {p.photo_url ? (
                  <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-heading text-2xl text-saffron">{p.name?.[0] || "P"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading text-lg text-ink leading-tight">{p.name}</div>
                <div className="flex items-center gap-1 text-xs text-muted2 mt-1">
                  <Star className="w-3 h-3 fill-marigold text-marigold" />
                  <span className="font-semibold text-ink">{p.rating_avg?.toFixed(1) || "New"}</span>
                  <span>· {p.rating_count || 0} reviews · {p.experience_years}+ yrs</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted2 mt-1 truncate">
                  <Languages className="w-3 h-3" /> {(p.languages || []).slice(0, 3).join(", ")}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted2 mt-1 truncate">
                  <MapPin className="w-3 h-3" /> {(p.service_areas || []).slice(0, 3).join(", ")}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
