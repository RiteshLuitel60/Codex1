import Link from "next/link";

export default function NotFound() {
  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="text-xl font-semibold">Country profile not found.</h2>
      <p className="mt-2 text-white/70">Try the directory to continue exploring verified entries.</p>
      <Link href="/" className="mt-4 inline-block underline">
        Return to directory
      </Link>
    </div>
  );
}
