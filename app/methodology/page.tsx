const pillars = [
  "Source reliability scoring with weighted domain trust and recency.",
  "Conflict detection when candidate leaders disagree on role name, office date, or predecessor.",
  "Human-in-the-loop resolution through admin queue before publication.",
  "Immutable snapshots for every verified refresh run."
];

export default function MethodologyPage() {
  return (
    <div className="glass rounded-3xl p-8">
      <h1 className="text-3xl font-semibold">Methodology & Verification</h1>
      <p className="mt-4 max-w-3xl text-white/75">
        World Leaders Atlas ranks each citation by provenance, institutional legitimacy, and update freshness. We prioritize official government publications, then trusted intergovernmental and editorial references.
      </p>
      <ul className="mt-6 space-y-3 text-sm text-white/85">
        {pillars.map((pillar) => (
          <li key={pillar} className="rounded-xl border border-white/10 p-4">{pillar}</li>
        ))}
      </ul>
    </div>
  );
}
