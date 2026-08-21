import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

const EMPTY = { name: "", slug: "", description: "", duration_hours: 2, base_price: 2100, category: "general", image_url: "" };

export default function AdminPoojas() {
  const [poojas, setPoojas] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [open, setOpen] = useState(false);

  const load = () => api.get("/poojas").then(({ data }) => setPoojas(data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name || !form.slug) return toast.error("Name and slug required");
    try {
      await api.post("/admin/poojas", form);
      toast.success("Pooja added");
      setForm(EMPTY); setOpen(false); load();
    } catch (e) { toast.error(e?.response?.data?.detail || "Failed"); }
  };

  const remove = async (slug) => {
    if (!confirm("Deactivate this pooja?")) return;
    await api.delete(`/admin/poojas/${slug}`);
    toast.success("Pooja removed");
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-heading text-4xl text-ink">Pooja Catalog</h1>
          <p className="text-sm text-muted2 mt-1">{poojas.length} active poojas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="admin-add-pooja" className="rounded-full bg-saffron hover:bg-saffron-dark text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Pooja
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Pooja</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input data-testid="new-pooja-name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} /></div>
              <div><Label>Slug (unique)</Label><Input data-testid="new-pooja-slug" value={form.slug} onChange={(e)=>setForm({...form, slug: e.target.value.toLowerCase().replace(/\s+/g,"-")})} /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Duration (hours)</Label><Input type="number" step="0.5" value={form.duration_hours} onChange={(e)=>setForm({...form, duration_hours: parseFloat(e.target.value)||0})} /></div>
                <div><Label>Base price (₹)</Label><Input type="number" value={form.base_price} onChange={(e)=>setForm({...form, base_price: parseInt(e.target.value)||0})} /></div>
              </div>
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e)=>setForm({...form, image_url: e.target.value})} /></div>
              <Button data-testid="new-pooja-save" onClick={create} className="w-full rounded-full bg-saffron hover:bg-saffron-dark text-white">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border border-warmBorder rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {poojas.map(p => (
              <TableRow key={p.id} data-testid={`admin-pooja-row-${p.slug}`}>
                <TableCell className="font-semibold text-ink">{p.name}</TableCell>
                <TableCell className="text-sm capitalize">{p.category}</TableCell>
                <TableCell className="text-sm">{p.duration_hours}h</TableCell>
                <TableCell className="text-saffron font-semibold">₹{p.base_price.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" data-testid={`admin-delete-pooja-${p.slug}`} onClick={()=>remove(p.slug)} className="text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
