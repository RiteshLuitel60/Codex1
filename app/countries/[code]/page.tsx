import { notFound } from "next/navigation";
import { SourcePanel } from "@/components/source-panel";
import { Timeline } from "@/components/timeline";
import { countryDetails } from "@/data/sample-data";

export function generateStaticParams() {
  return Object.keys(countryDetails).map((code) => ({ code }));
}

export default function CountryPage({ params }: { params: { code: string } }) {
  const detail = countryDetails[params.code];

  if (!detail) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">
              {detail.name} <span className="ml-1 text-4xl">{detail.flagEmoji}</span>
            </h1>
            <p className="mt-2 text-sm text-white/70">{detail.region} · {detail.governmentType}</p>
          </div>
          <div className="rounded-xl border border-white/15 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Credibility</p>
            <p className="text-2xl font-semibold text-aurora">{detail.confidenceScore}%</p>
            <p className="mt-1 text-xs text-white/60">Last verified {detail.lastVerifiedAt}</p>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-sm text-white/80">{detail.neutralProfile}</p>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-xl font-medium">Current Leadership</h2>
        <div className="mt-4 space-y-4">
          {detail.leaders.map((leader) => (
            <article key={`${leader.role}-${leader.name}`} className="rounded-xl border border-white/10 p-4">
              <p className="text-sm text-white/60">{leader.role}</p>
              <p className="mt-1 text-lg font-medium">{leader.name}</p>
              <p className="text-sm text-white/80">{leader.officialTitle}</p>
              <p className="mt-2 text-xs text-white/65">Assumed office: {leader.assumedOffice}</p>
              <p className="text-xs text-white/65">Predecessor: {leader.predecessor}</p>
              {leader.affiliation && <p className="text-xs text-white/65">Affiliation: {leader.affiliation}</p>}
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <SourcePanel sources={detail.citations} />
        <Timeline entries={detail.timeline} />
      </div>
    </div>
  );
}
