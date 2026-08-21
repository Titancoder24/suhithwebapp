import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, XCircle, Eye, FileText, Clock } from "lucide-react";
import AuthedImage from "@/components/AuthedImage";

export default function AdminPriests() {
  const [status, setStatus] = useState("pending");
  const [priests, setPriests] = useState([]);
  const [viewing, setViewing] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = () => {
    api.get(`/admin/priests?status=${status}`).then(({ data }) => setPriests(data)).catch(() => {});
  };
  useEffect(() => { load(); }, [status]);

  const openPriest = async (p) => {
    try {
      const { data } = await api.get(`/admin/priests/${p.id}`);
      setViewing(data);
    } catch {
      setViewing(p);
    }
  };

  const verify = async (priestId, action, note = "") => {
    try {
      await api.post(`/admin/priests/${priestId}/verify`, { status: action, note });
      toast.success(action === "verified" ? "Priest verified" : "Priest rejected");
      setViewing(null); setRejectReason("");
      load();
    } catch { toast.error("Action failed"); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-4xl text-ink">Priests</h1>
        <p className="text-sm text-muted2 mt-1">Review, verify and manage priest profiles with full document + audit view.</p>
      </div>

      <Tabs value={status} onValueChange={setStatus} className="mb-4">
        <TabsList>
          <TabsTrigger data-testid="admin-tab-pending" value="pending">Pending</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-verified" value="verified">Verified</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-rejected" value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-white border border-warmBorder rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Languages</TableHead>
              <TableHead>Areas</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {priests.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted2 py-8">No priests in this status.</TableCell></TableRow>
            )}
            {priests.map((p) => (
              <TableRow key={p.id} data-testid={`admin-priest-row-${p.id}`}>
                <TableCell className="font-semibold text-ink">{p.name}</TableCell>
                <TableCell className="text-sm">+91 {p.phone}</TableCell>
                <TableCell className="text-sm">{p.experience_years}+ yrs</TableCell>
                <TableCell className="text-xs text-muted2">{(p.languages || []).join(", ")}</TableCell>
                <TableCell className="text-xs text-muted2">{(p.service_areas || []).slice(0, 2).join(", ")}{p.service_areas?.length > 2 && "…"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" data-testid={`admin-view-priest-${p.id}`} onClick={() => openPriest(p)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    {status === "pending" && (
                      <Button size="sm" data-testid={`admin-verify-${p.id}`} onClick={() => verify(p.id, "verified")}
                        className="bg-saffron hover:bg-saffron-dark text-white h-8">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewing?.name}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4 text-sm">
              {/* Profile summary */}
              <div className="flex gap-4">
                {viewing.photo_file_id ? (
                  <AuthedImage
                    fileId={viewing.photo_file_id}
                    alt={viewing.name}
                    className="w-20 h-20 rounded-full object-cover border border-warmBorder"
                  />
                ) : viewing.photo_url ? (
                  <img src={viewing.photo_url} alt={viewing.name} className="w-20 h-20 rounded-full object-cover border border-warmBorder" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-warmBorder/30" />
                )}
                <div className="flex-1 space-y-1">
                  <div><span className="text-muted2">Phone:</span> +91 {viewing.phone}</div>
                  <div><span className="text-muted2">Experience:</span> {viewing.experience_years} yrs</div>
                  <div><span className="text-muted2">Bio:</span> {viewing.bio || "—"}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted2">Languages:</span><br />{(viewing.languages || []).join(", ") || "—"}</div>
                <div><span className="text-muted2">Poojas:</span><br />{(viewing.poojas_offered || []).join(", ") || "—"}</div>
                <div className="col-span-2"><span className="text-muted2">Areas:</span> {(viewing.service_areas || []).join(", ") || "—"}</div>
                {(viewing.pan_last4 || viewing.aadhaar_last4) && (
                  <div className="col-span-2 text-xs text-muted2">
                    {viewing.pan_last4 && <>PAN: •••• {viewing.pan_last4} &nbsp;</>}
                    {viewing.aadhaar_last4 && <>Aadhaar: •••• {viewing.aadhaar_last4}</>}
                  </div>
                )}
              </div>

              {/* Documents */}
              <div className="pt-3 border-t border-warmBorder">
                <div className="font-semibold text-ink mb-2 inline-flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Documents
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {viewing.id_proof_file_id && (
                    <div data-testid="admin-doc-idproof">
                      <div className="text-xs text-muted2 mb-1">ID proof</div>
                      <AuthedImage
                        fileId={viewing.id_proof_file_id}
                        alt="ID proof"
                        className="w-full h-24 object-cover rounded-lg border border-warmBorder"
                        fallback={
                          <div className="w-full h-24 rounded-lg border border-warmBorder flex items-center justify-center bg-warmBorder/20">
                            <FileText className="w-6 h-6 text-muted2" />
                          </div>
                        }
                      />
                    </div>
                  )}
                  {(viewing.certificate_file_ids || []).map((cid, i) => (
                    <div key={cid} data-testid={`admin-doc-cert-${i}`}>
                      <div className="text-xs text-muted2 mb-1">Certificate {i + 1}</div>
                      <AuthedImage
                        fileId={cid}
                        alt={`Certificate ${i + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-warmBorder"
                        fallback={
                          <div className="w-full h-24 rounded-lg border border-warmBorder flex items-center justify-center bg-warmBorder/20">
                            <FileText className="w-6 h-6 text-muted2" />
                          </div>
                        }
                      />
                    </div>
                  ))}
                  {viewing.id_proof_url && !viewing.id_proof_file_id && (
                    <a href={viewing.id_proof_url} target="_blank" rel="noreferrer"
                      className="text-xs text-saffron underline self-center">
                      Legacy ID link
                    </a>
                  )}
                  {!viewing.id_proof_file_id && !viewing.certificate_file_ids?.length && !viewing.id_proof_url && (
                    <div className="col-span-3 text-xs text-muted2">No documents uploaded yet.</div>
                  )}
                </div>
              </div>

              {/* Audit trail */}
              {(viewing.kyc_audit_log || []).length > 0 && (
                <div className="pt-3 border-t border-warmBorder">
                  <div className="font-semibold text-ink mb-2 inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Audit trail
                  </div>
                  <ul className="space-y-1.5" data-testid="admin-audit-log">
                    {viewing.kyc_audit_log.slice().reverse().map((e, i) => (
                      <li key={i} className="text-xs text-muted2 border-l-2 border-warmBorder pl-3">
                        <div className="text-ink font-medium">
                          {e.status} <span className="text-muted2 font-normal">by {e.actor_role || "system"}</span>
                        </div>
                        <div>{new Date(e.at).toLocaleString()}</div>
                        {e.note && <div className="italic">"{e.note}"</div>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              {status === "pending" && (
                <div className="pt-4 border-t border-warmBorder space-y-3">
                  <Textarea placeholder="Reject reason (if declining)…" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                  <div className="flex gap-2">
                    <Button data-testid="admin-modal-verify" onClick={() => verify(viewing.id, "verified")}
                      className="flex-1 bg-saffron hover:bg-saffron-dark text-white rounded-full">
                      <ShieldCheck className="w-4 h-4 mr-2" /> Verify
                    </Button>
                    <Button data-testid="admin-modal-reject" onClick={() => verify(viewing.id, "rejected", rejectReason)}
                      variant="outline" className="flex-1 rounded-full border-red-300 text-red-700 hover:bg-red-50">
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
