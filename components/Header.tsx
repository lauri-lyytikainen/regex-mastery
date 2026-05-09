import { Badge } from "./retroui/Badge";
import { Button } from "./retroui/Button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-background py-4">
      <div className="relative container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <Badge variant="surface">
          <Link href="/">
            <h1 className="text-3xl font-bold">Regex Mastery</h1>
          </Link>
        </Badge>
        <div className="mt-4 flex flex-row gap-2 lg:mt-0 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
          <Link href="/learn" passHref>
            <Button variant="link">Learn</Button>
          </Link>
          <Button variant="link">Challenges</Button>
          <Button variant="link">Cheatsheet</Button>
          <Button variant="link">Playground</Button>
        </div>
      </div>
    </header>
  );
}
