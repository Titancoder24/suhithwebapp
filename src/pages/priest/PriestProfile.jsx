import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PriestProfile() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="font-heading text-3xl text-ink mb-2">Profile</h1>
      <p className="text-sm text-muted2 mb-6">Update your details, poojas offered and service areas.</p>
      <Button data-testid="priest-edit-profile" onClick={()=>navigate("/priest/onboarding")}
        className="rounded-full bg-saffron hover:bg-saffron-dark text-white font-semibold h-11 px-6">
        Edit profile
      </Button>
      <p className="text-xs text-muted2 mt-3">Note: editing profile will re-submit for admin verification.</p>
    </div>
  );
}
