import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminBookings() {
  const [status, setStatus] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const q = status ? `?status=${status}` : "";
    api.get(`/admin/bookings${q}`).then(({ data }) => setBookings(data)).catch(() => {});
  }, [status]);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-heading text-4xl text-ink">Bookings</h1>
          <p className="text-sm text-muted2 mt-1">{bookings.length} bookings shown</p>
        </div>
        <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
          <SelectTrigger data-testid="admin-booking-filter" className="w-48"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-warmBorder rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pooja</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Priest</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted2 py-8">No bookings.</TableCell></TableRow>
            )}
            {bookings.map(b => (
              <TableRow key={b.id} data-testid={`admin-booking-row-${b.id}`}>
                <TableCell className="font-semibold text-ink">{b.pooja_name}</TableCell>
                <TableCell className="text-sm">{b.customer_name}<br/><span className="text-xs text-muted2">+91 {b.customer_phone}</span></TableCell>
                <TableCell className="text-sm">{b.priest_name}</TableCell>
                <TableCell className="text-sm">{b.booking_date} <span className="text-muted2">{b.booking_time}</span></TableCell>
                <TableCell className="text-saffron font-semibold">₹{(b.total_amount || b.price).toLocaleString("en-IN")}</TableCell>
                <TableCell className="capitalize text-sm">{b.status}</TableCell>
                <TableCell className="capitalize text-sm">
                  {b.payment_status}
                  {b.payment_status === "refunded" && b.refund_amount > 0 && (
                    <div className="text-[10px] text-blue-700">₹{b.refund_amount.toLocaleString("en-IN")} · {b.refund_percent}%</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
