import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";

/**
 * PayNowButton — Razorpay Checkout with automatic mock-mode fallback.
 * In mock-mode the backend returns {mode:"mock"} and we simulate a paid state
 * by calling the legacy /bookings/{id}/pay endpoint (same as before).
 * In live-mode we open Razorpay Checkout and verify signature server-side.
 */
function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function PayNowButton({ booking, onPaid, className = "" }) {
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    try {
      const { data: order } = await api.post("/payments/razorpay/order", { booking_id: booking.id });

      // Mock-mode: use the existing legacy /pay endpoint so the whole flow still exercises.
      if (order.mode === "mock") {
        const { data: paid } = await api.post(`/bookings/${booking.id}/pay`);
        toast.success("Payment successful (mock)");
        onPaid?.(paid);
        return;
      }

      // Live-mode: load Razorpay Checkout
      const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ok || !window.Razorpay) return toast.error("Failed to load Razorpay");

      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Purohith Connect",
        description: booking.pooja_name || "Pooja booking",
        order_id: order.order_id,
        prefill: {
          name: booking.customer_name || "",
          contact: booking.customer_phone || "",
        },
        theme: { color: "#B0212B" }, // kumkuma
        handler: async (resp) => {
          try {
            const { data: verified } = await api.post("/payments/razorpay/verify", {
              booking_id: booking.id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            toast.success("Payment verified");
            onPaid?.(verified.booking);
          } catch {
            toast.error("Payment verification failed");
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.open();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      onClick={pay}
      disabled={busy}
      data-testid={`paynow-${booking.id}`}
      className={`bg-kumkuma hover:bg-kumkuma-dark text-white rounded-full ${className}`}
    >
      {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
      Pay ₹{(booking.price || 0).toLocaleString("en-IN")}
    </Button>
  );
}
