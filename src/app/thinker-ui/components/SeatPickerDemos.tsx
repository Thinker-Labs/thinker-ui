"use client";
import { useState } from "react";
import { SeatPicker } from "./SeatPicker";

export function SeatPickerDemo() {
  const [tickets, setTickets] = useState(2);
  const [seats, setSeats] = useState<string[]>([]);
  return (
    <div className="demo">
      <SeatPicker
        title="Evening screening"
        session="Fri 18 Dec · 21:15 · Hall 2"
        poster="/placeholders/poster.webp"
        screenImg="/placeholders/screen.jpg"
        tickets={tickets}
        onTicketsChange={setTickets}
        value={seats}
        onChange={setSeats}
      />
    </div>
  );
}
