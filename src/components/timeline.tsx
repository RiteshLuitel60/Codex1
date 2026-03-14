type TimelineItem = {
  leader: string;
  role: string;
  start: string;
  end?: string;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <section className="glass rounded-2xl p-6">
      <h3 className="text-xl font-semibold">Historical leadership timeline</h3>
      <ol className="mt-4 space-y-4 border-l border-slate-300 pl-4 dark:border-slate-700">
        {items.map((item, index) => (
          <li key={`${item.leader}-${index}`} className="relative">
            <span className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full bg-aurora-1" />
            <p className="font-medium">{item.leader}</p>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {item.role} · {item.start} {item.end ? `– ${item.end}` : '– Present'}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
