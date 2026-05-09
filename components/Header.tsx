import { Badge } from "./retroui/Badge";
import { Button } from "./retroui/Button";
import Link from "next/link";
import { Select } from "./retroui/Select";

export default function Header() {
  return (
    <header className="bg-background py-4 border-b-2 border-foreground">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <Link href="/">
          <div className="flex gap-4 items-center">
            <Badge
              variant="surface"
              className="aspect-square flex items-center justify-center px-2 text-2xl font-bold"
            >
              /g
            </Badge>
            <Badge variant="outline" className="hidden lg:block ">
              <h1 className="text-2xl font-bold">Regex Mastery</h1>
            </Badge>
          </div>
        </Link>

        <nav className="flex flex-row gap-4 lg:gap-8 flex-1 justify-center mt-1">
          <Link
            href="/learn"
            className="font-bold text-base border-b-2 border-transparent hover:border-primary transition-colors pb-1"
          >
            Learn
          </Link>
          <Link
            href="/challenges"
            className="font-bold text-base border-b-2 border-transparent hover:border-primary transition-colors pb-1"
          >
            Challenges
          </Link>
          <Link
            href="/cheatsheet"
            className="font-bold text-base border-b-2 border-transparent hover:border-primary transition-colors pb-1"
          >
            Cheatsheet
          </Link>
          <Link
            href="/playground"
            className="font-bold text-base border-b-2 border-transparent hover:border-primary transition-colors pb-1"
          >
            Playground
          </Link>
        </nav>

        <Select>
          <Select.Trigger className="min-w-0 w-20">
            <Select.Value placeholder="EN" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Item value="en">EN</Select.Item>
              <Select.Item value="fi">FI</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select>
      </div>
    </header>
  );
}
