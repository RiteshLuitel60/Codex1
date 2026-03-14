import { notFound } from 'next/navigation';
import { SourcePanel } from '@/components/source-panel';
import { Timeline } from '@/components/timeline';
import { getCountryBySlug } from '@/lib/data';
import { formatConfidence } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CountryPage({ params }: { params: { slug: string } }) {
  const country = await getCountryBySlug(params.slug);

  if (!country) {
    notFound();
  }

  const currentLeaders = country.leaderAssignments.filter((assignment) => assignment.isCurrent);
  const citations = currentLeaders.flatMap((assignment) =>
    assignment.citations.map((citation) => ({
      id: citation.id,
      url: citation.url,
      sourceName: citation.source.name,
      trustScore: citation.trustScore,
      retrievedAt: citation.retrievedAt.toISOString()
    }))
  );

  const timeline = country.leaderAssignments.map((assignment) => ({
    leader: assignment.leader.fullName,
    role: assignment.role,
    start: assignment.assumedOfficeAt.toISOString().slice(0, 10),
    end: assignment.isCurrent ? undefined : assignment.updatedAt.toISOString().slice(0, 10)
  }));

  return (
    <div className="space-y-8">
      <header className="surface-card rounded-3xl p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">{country.region}</p>
        <h1 className="mt-2 font-display text-4xl text-[color:var(--text-1)] md:text-5xl">
          {country.flagEmoji} {country.name}
        </h1>
        <p className="mt-3 max-w-3xl text-muted">{country.profile}</p>
      </header>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="surface-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[color:var(--text-1)]">Government Overview</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">Government type</dt><dd className="text-[color:var(--text-1)]">{country.governmentType}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Last verified</dt><dd className="text-[color:var(--text-1)]">{country.verificationSnapshots[0]?.capturedAt.toLocaleString() ?? 'Pending'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Confidence</dt><dd style={{ color: 'var(--accent-2)' }}>{formatConfidence(country.verificationSnapshots[0]?.confidenceScore ?? 0)}</dd></div>
          </dl>
        </article>

        <article className="surface-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[color:var(--text-1)]">Current Leaders by Role</h2>
          <div className="mt-4 space-y-4 text-sm">
            {currentLeaders.map((assignment) => (
              <div key={assignment.id} className="rounded-xl border border-[var(--panel-border)] p-4">
                <p className="font-semibold text-[color:var(--text-1)]">{assignment.role}</p>
                <p className="text-[color:var(--text-1)]">{assignment.officialTitle}: {assignment.leader.fullName}</p>
                <p className="text-muted">Assumed office: {assignment.assumedOfficeAt.toISOString().slice(0, 10)}</p>
                <p className="text-muted">Predecessor: {assignment.predecessor ?? 'N/A'}</p>
                <p className="text-muted">Affiliation: {assignment.leader.party ?? 'Independent / not declared'}</p>
                <p className="text-muted">{assignment.leader.profile}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <SourcePanel citations={citations} />
      <Timeline items={timeline} />
    </div>
  );
}
