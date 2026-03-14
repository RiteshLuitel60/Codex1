const events = [
  { country: "France", role: "Prime Minister", change: "Appointed", date: "2025-12-13" },
  { country: "Japan", role: "Prime Minister", change: "Elected", date: "2024-10-01" },
  { country: "South Africa", role: "President", change: "Reconfirmed", date: "2024-06-14" }
];

export default function TrackerPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Leadership Change Tracker</h1>
      <section className="glass rounded-2xl p-6">
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={`${event.country}-${event.date}`} className="flex items-center justify-between rounded-xl border border-white/10 p-4 text-sm">
              <span>{event.country} · {event.role}</span>
              <span className="text-white/60">{event.change} · {event.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
