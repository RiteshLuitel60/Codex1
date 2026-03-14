const items = [
  {
    title: '1. Live source acquisition',
    body: 'Country metadata is fetched from REST Countries while current role holders are pulled from Wikidata and cross-checked against the curated Wikipedia current-heads list.'
  },
  {
    title: '2. Agreement-weighted confidence',
    body: 'Role confidence increases when independent sources agree on the same person and is penalized when they diverge.'
  },
  {
    title: '3. Conflict escalation',
    body: 'Any unresolved role or cross-source disagreement generates an OPEN conflict record with structured evidence for admin review.'
  },
  {
    title: '4. Persistence and audit trail',
    body: 'Refresh sync writes normalized country, assignment, citation, and verification snapshot records into Prisma for historical tracking and exports.'
  }
];

export default function MethodologyPage() {
  return (
    <div className="space-y-6">
      <header className="surface-card rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-muted">Rules Engine</p>
        <h1 className="mt-2 font-display text-5xl leading-tight text-[color:var(--text-1)]">Methodology & Verification Policy</h1>
      </header>
      {items.map((item) => (
        <section key={item.title} className="surface-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[color:var(--text-1)]">{item.title}</h2>
          <p className="mt-2 text-muted">{item.body}</p>
        </section>
      ))}
    </div>
  );
}
