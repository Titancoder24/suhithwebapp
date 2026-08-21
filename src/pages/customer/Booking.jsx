import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import api from "@/lib/api";
import { analytics } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, CheckCircle2, Minus, Plus, ShoppingBag } from "lucide-react";

// Fix default marker icon (Leaflet issue with webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TIME_SLOTS = ["06:00", "07:30", "09:00", "10:30", "16:00", "17:30", "19:00"];
const BLR_CENTER = [12.9716, 77.5946];

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) { setPosition([e.latlng.lat, e.latlng.lng]); },
  });
  return position ? <Marker position={position} /> : null;
}

export default function Booking() {
  const { priestId } = useParams();
  const [params] = useSearchParams();
  const poojaSlug = params.get("pooja");

  const [priest, setPriest] = useState(null);
  const [pooja, setPooja] = useState(null);
  const [addOnCatalog, setAddOnCatalog] = useState([]);
  const [cart, setCart] = useState({}); // { addOnId: qty }
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [position, setPosition] = useState(BLR_CENTER);
  const [creating, setCreating] = useState(false);
  const [paying, setPaying] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    api.get(`/priests/${priestId}`).then(({ data }) => setPriest(data)).catch(() => {});
    if (poojaSlug) api.get(`/poojas/${poojaSlug}`).then(({ data }) => setPooja(data)).catch(() => {});
    api.get("/booking/add-ons").then(({ data }) => setAddOnCatalog(data.add_ons || [])).catch(() => {});
  }, [priestId, poojaSlug]);

  const addOnList = useMemo(
    () => Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => ({ id, qty })),
    [cart]
  );

  const totals = useMemo(() => {
    if (!pooja) return { pooja_price: 0, addons: 0, subtotal: 0, gst: 0, base: 0 };
    const addonsTotal = addOnList.reduce((sum, { id, qty }) => {
      const cat = addOnCatalog.find(a => a.id === id);
      return sum + (cat ? cat.price * qty : 0);
    }, 0);
    const subtotal = pooja.base_price + addonsTotal;
    const base = +(subtotal / 1.18).toFixed(2);
    const gst = +(subtotal - base).toFixed(2);
    return { pooja_price: pooja.base_price, addons: addonsTotal, subtotal, gst, base };
  }, [pooja, addOnList, addOnCatalog]);

  const bumpAddOn = (id, delta) => {
    const cat = addOnCatalog.find(a => a.id === id);
    if (!cat) return;
    setCart(prev => {
      const next = Math.max(0, Math.min(cat.max_qty, (prev[id] || 0) + delta));
      return { ...prev, [id]: next };
    });
  };

  const submit = async () => {
    if (!date || !time || !address) return toast.error("Please fill date, time and address");
    setCreating(true);
    try {
      const { data } = await api.post("/bookings", {
        priest_id: priestId,
        pooja_slug: poojaSlug,
        booking_date: date.toISOString().slice(0, 10),
        booking_time: time,
        address, landmark, notes, customer_email: email,
        lat: position[0], lng: position[1],
        add_ons: addOnList,
      });
      setPaying(true);
      analytics.bookingStarted(priestId, poojaSlug);
      setTimeout(async () => {
        try {
          const { data: paid } = await api.post(`/bookings/${data.id}/pay`);
          setConfirmedBooking(paid);
          analytics.bookingConfirmed(paid);
          toast.success("Booking confirmed!");
        } catch (e) {
          toast.error("Payment failed");
        } finally { setPaying(false); setCreating(false); }
      }, 1200);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Booking failed");
      setCreating(false);
    }
  };

  if (!priest || !pooja) return <div className="p-6 text-muted2">Loading…</div>;

  if (confirmedBooking) {
    return (
      <div className="p-6 text-center pt-16" data-testid="booking-confirmed">
        <div className="w-20 h-20 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-saffron" />
        </div>
        <h1 className="font-heading text-3xl text-ink">Booking confirmed</h1>
        <p className="text-sm text-muted2 mt-2">
          {confirmedBooking.priest_name} will perform {confirmedBooking.pooja_name} on{" "}
          <span className="text-ink font-semibold">{confirmedBooking.booking_date} at {confirmedBooking.booking_time}</span>.
        </p>
        <div className="bg-white border border-warmBorder rounded-xl p-4 mt-6 text-left text-sm space-y-1">
          <div className="flex justify-between"><span className="text-muted2">Booking ID</span><span className="font-mono text-xs">{confirmedBooking.id.slice(0,8)}</span></div>
          {confirmedBooking.invoice_no && (
            <div className="flex justify-between"><span className="text-muted2">Invoice #</span><span className="font-mono text-xs">{confirmedBooking.invoice_no}</span></div>
          )}
          <div className="flex justify-between"><span className="text-muted2">Payment</span><span className="text-green-700 font-semibold">Paid ₹{(confirmedBooking.total_amount || confirmedBooking.price).toLocaleString("en-IN")}</span></div>
        </div>
        <div className="mt-8 space-y-2">
          <Link to="/app/bookings"><Button data-testid="view-bookings-btn" className="w-full rounded-full bg-saffron hover:bg-saffron-dark text-white h-12 font-semibold">View my bookings</Button></Link>
          <Link to="/app"><Button variant="outline" className="w-full rounded-full h-12">Back to home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-48">
      <header className="px-6 pt-6 pb-4">
        <Link to={`/app/priests/${priestId}`} className="text-sm text-muted2 hover:text-saffron flex items-center gap-2 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to priest
        </Link>
        <h1 className="font-heading text-2xl text-ink">Book {pooja.name}</h1>
        <p className="text-sm text-muted2 mt-1">with {priest.name} · Base ₹{pooja.base_price.toLocaleString("en-IN")}</p>
      </header>

      <div className="px-6 space-y-6">
        {/* Date */}
        <div>
          <Label>Select date</Label>
          <div className="bg-white border border-warmBorder rounded-xl mt-2 p-2 inline-block">
            <Calendar
              data-testid="booking-calendar"
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => {
                const today = new Date(); today.setHours(0,0,0,0);
                if (d < today) return true;
                const iso = d.toISOString().slice(0,10);
                return (priest.blocked_dates || []).includes(iso);
              }}
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <Label>Time slot</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger data-testid="booking-time" className="mt-2 h-12"><SelectValue placeholder="Choose time slot" /></SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Add-ons */}
        <div data-testid="booking-addons">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-saffron" /> ಹೆಚ್ಚುವರಿ ಸೇರ್ಪಡೆಗಳು · Add-ons (optional)</Label>
          </div>
          <div className="mt-2 space-y-2">
            {addOnCatalog.map(a => {
              const qty = cart[a.id] || 0;
              return (
                <div key={a.id} data-testid={`addon-${a.id}`} className="bg-white border border-warmBorder rounded-xl p-3 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-ink">{a.name}</div>
                    <div className="text-[11px] text-muted2 mt-0.5 line-clamp-2">{a.description}</div>
                    <div className="text-xs text-saffron font-semibold mt-1">₹{a.price.toLocaleString("en-IN")} / {a.unit}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      data-testid={`addon-${a.id}-minus`}
                      onClick={() => bumpAddOn(a.id, -1)}
                      disabled={qty === 0}
                      className="w-8 h-8 rounded-full bg-cotton border border-warmBorder flex items-center justify-center disabled:opacity-40"
                    ><Minus className="w-3.5 h-3.5" /></button>
                    <span data-testid={`addon-${a.id}-qty`} className="w-6 text-center font-mono text-sm">{qty}</span>
                    <button
                      data-testid={`addon-${a.id}-plus`}
                      onClick={() => bumpAddOn(a.id, 1)}
                      disabled={qty >= a.max_qty}
                      className="w-8 h-8 rounded-full bg-saffron/10 border border-saffron/30 text-saffron flex items-center justify-center disabled:opacity-40"
                    ><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Address */}
        <div>
          <Label>Address</Label>
          <Textarea data-testid="booking-address" value={address} onChange={(e)=>setAddress(e.target.value)}
            placeholder="Flat / house no, street, area, Bengaluru" className="mt-2 min-h-[80px]" />
        </div>
        <div>
          <Label>Landmark (optional)</Label>
          <Input data-testid="booking-landmark" value={landmark} onChange={(e)=>setLandmark(e.target.value)}
            placeholder="Near ABC temple" className="mt-2 h-11" />
        </div>
        <div>
          <Label>Email for invoice (optional)</Label>
          <Input data-testid="booking-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
            placeholder="you@example.com" className="mt-2 h-11" />
        </div>

        {/* Map */}
        <div>
          <Label>Drop a pin on the map</Label>
          <div className="text-xs text-muted2 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Tap map to mark your exact location</div>
          <div className="mt-2 h-56 rounded-xl overflow-hidden border border-warmBorder" data-testid="booking-map">
            <MapContainer center={BLR_CENTER} zoom={12} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
        </div>

        <div>
          <Label>Notes for the priest (optional)</Label>
          <Textarea data-testid="booking-notes" value={notes} onChange={(e)=>setNotes(e.target.value)}
            placeholder="Any special requests, family details..." className="mt-2 min-h-[70px]" />
        </div>

        {/* Cart breakdown */}
        <div className="bg-white border border-warmBorder rounded-xl p-4 text-sm" data-testid="cart-breakdown">
          <div className="flex justify-between"><span className="text-muted2">{pooja.name}</span><span>₹{totals.pooja_price.toLocaleString("en-IN")}</span></div>
          {addOnList.map(({ id, qty }) => {
            const cat = addOnCatalog.find(a => a.id === id);
            if (!cat) return null;
            return (
              <div key={id} className="flex justify-between mt-1">
                <span className="text-muted2">{cat.name_en || cat.name.split("·")[1]?.trim() || cat.name} × {qty}</span>
                <span>₹{(cat.price * qty).toLocaleString("en-IN")}</span>
              </div>
            );
          })}
          <div className="flex justify-between mt-2 pt-2 border-t border-warmBorder text-xs text-muted2">
            <span>Includes GST 18% (₹{totals.gst.toLocaleString("en-IN")})</span>
          </div>
          <div className="flex justify-between mt-2 text-ink font-semibold">
            <span>Total</span>
            <span className="font-heading text-lg text-saffron">₹{totals.subtotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Sticky pay bar */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-white/95 backdrop-blur-xl border-t border-warmBorder">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-muted2">Total (incl. 18% GST)</div>
          <div className="font-heading text-2xl text-saffron" data-testid="cart-total">₹{totals.subtotal.toLocaleString("en-IN")}</div>
        </div>
        <Button
          data-testid="booking-pay-btn"
          disabled={creating || paying}
          onClick={submit}
          className="w-full h-12 rounded-full bg-saffron hover:bg-saffron-dark text-white font-semibold saffron-shadow"
        >
          {paying ? "Processing payment…" : creating ? "Creating booking…" : "Confirm & Pay (mock)"}
        </Button>
        <p className="text-[10px] text-muted2 text-center mt-2">Payment is simulated in this demo. No card required.</p>
      </div>
    </div>
  );
}
