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
      <h1 className="font-display text-5xl leading-tight text-ink dark:text-slate-100">Methodology & Verification Policy</h1>
      {items.map((item) => (
        <section key={item.title} className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-ink dark:text-slate-100">{item.title}</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{item.body}</p>
        </section>
      ))}
    </div>
  );
}
