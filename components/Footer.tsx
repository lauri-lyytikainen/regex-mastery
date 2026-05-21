import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t-2 border-foreground py-4 mt-auto">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <span className="font-bold">
          &copy; {new Date().getFullYear()} Regex Mastery
        </span>
        <nav className="flex gap-4">
          <Link href="/learn" className="hover:underline">Learn</Link>
          <Link href="/cheatsheet" className="hover:underline">Cheatsheet</Link>
          <Link href="/playground" className="hover:underline">Playground</Link>
        </nav>
      </div>
    </footer>
  );
}
