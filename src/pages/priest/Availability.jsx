import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarX } from "lucide-react";

export default function Availability() {
  const [dates, setDates] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/priest/me").then(({ data }) => {
      if (data?.blocked_dates) {
        setDates(data.blocked_dates.map(d => new Date(d + "T00:00:00")));
      }
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.patch("/priest/availability", {
        blocked_dates: dates.map(d => d.toISOString().slice(0, 10)),
      });
      toast.success("Availability updated");
    } catch (e) {
      toast.error("Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink mb-2">Availability</h1>
      <p className="text-sm text-muted2 mb-6">Mark dates when you are <span className="font-semibold text-red-700">unavailable</span>. Customers won't be able to book on these dates.</p>

      <div className="bg-white border border-warmBorder rounded-xl p-4 inline-block">
        <Calendar
          data-testid="availability-calendar"
          mode="multiple"
          selected={dates}
          onSelect={setDates}
          disabled={(d) => {
            const today = new Date(); today.setHours(0,0,0,0);
            return d < today;
          }}
        />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <CalendarX className="w-4 h-4 text-red-700" />
        <div className="text-sm text-muted2"><span className="font-semibold text-ink">{dates.length}</span> dates blocked</div>
      </div>

      <Button data-testid="availability-save" onClick={save} disabled={saving}
        className="mt-6 rounded-full bg-saffron hover:bg-saffron-dark text-white font-semibold h-12 px-8">
        {saving ? "Saving…" : "Save availability"}
      </Button>
    </div>
  );
}
