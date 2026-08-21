import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Phone, User } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="font-heading text-3xl text-ink">Profile</h1>
      </header>

      <div className="bg-white border border-warmBorder rounded-xl p-6 warm-shadow">
        <div className="w-16 h-16 rounded-full bg-saffron/10 flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-saffron" />
        </div>
        <div className="font-heading text-xl text-ink">{user?.name || "Devotee"}</div>
        <div className="flex items-center gap-1 text-sm text-muted2 mt-1">
          <Phone className="w-3.5 h-3.5" /> +91 {user?.phone}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="bg-white border border-warmBorder rounded-xl p-4">
          <div className="text-xs uppercase tracking-widest text-muted2">Account</div>
          <div className="font-semibold text-ink mt-1 capitalize">{user?.role}</div>
        </div>
        <Button
          data-testid="profile-logout"
          onClick={() => { logout(); navigate("/"); }}
          variant="outline"
          className="w-full rounded-full h-12 border-warmBorder text-ink"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign out
        </Button>
      </div>

      <div className="mt-8 text-center text-xs text-muted2">
        <div className="font-sanskrit text-saffron text-3xl mb-2">ॐ</div>
        <div className="font-heading text-saffron text-base mb-1">Purohith Connect</div>
        <div className="font-sanskrit text-ink" lang="sa">सर्वे भवन्तु सुखिनः</div>
        <div className="mt-1">Sacred rituals, delivered to your doorstep.</div>
      </div>
    </div>
  );
}
