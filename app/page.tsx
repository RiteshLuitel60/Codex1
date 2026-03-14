import { Hero } from "@/components/hero";
import { CountryCard } from "@/components/country-card";
import { WorldMap } from "@/components/world-map";
import { countries } from "@/data/sample-data";

export default function HomePage() {
  return (
    <div className="space-y-8 md:space-y-10">
      <Hero />
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <CountryCard key={country.code} country={country} />
        ))}
      </section>
      <WorldMap />
    </div>
  );
}
