// Tiny wrapper around window.pcTrack that GA4 + Meta Pixel both consume.
// Guarantees safe no-op if analytics IDs weren't injected at build time.
export function track(event, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.pcTrack === "function") {
      window.pcTrack(event, params);
    }
  } catch (_) { /* swallow */ }
}

// Semantic helpers so screens don't sprinkle magic strings
export const analytics = {
  pageView: (path) => track("page_view", { page_path: path }),
  poojaSelected: (slug) => track("select_content", { content_type: "pooja", item_id: slug }),
  priestViewed: (id) => track("view_item", { item_id: id, item_type: "priest" }),
  bookingStarted: (priestId, poojaSlug) => track("begin_checkout", { priest_id: priestId, pooja_slug: poojaSlug }),
  bookingConfirmed: (booking) => track("purchase", {
    transaction_id: booking.id,
    value: booking.total_amount || booking.price,
    currency: "INR",
    items: [{
      item_id: booking.pooja_slug,
      item_name: booking.pooja_name,
      price: booking.total_amount || booking.price,
      quantity: 1,
    }],
  }),
  bookingCancelled: (id, refund) => track("refund", { transaction_id: id, value: refund, currency: "INR" }),
  disputeRaised: (category) => track("dispute_raised", { category }),
};
