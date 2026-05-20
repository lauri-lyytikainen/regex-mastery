"use client";

import { Badge } from "./retroui/Badge";
import Link from "next/link";
import { Switch } from "./retroui/Switch";
import { Menu } from "./retroui/Menu";
import { MenuIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/challenges", label: "Challenges" },
  { href: "/cheatsheet", label: "Cheatsheet" },
  { href: "/playground", label: "Playground" },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();

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
            <Badge variant="outline" className="hidden lg:block">
              <h1 className="text-2xl font-bold">Regex Mastery</h1>
            </Badge>
          </div>
        </Link>

        <nav className="hidden sm:flex flex-row gap-4 lg:gap-8 flex-1 justify-center mt-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-bold text-base border-b-2 border-transparent hover:border-primary transition-colors pb-1"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              aria-label="Toggle dark mode"
            />
            <Moon className="h-4 w-4" />
          </div>

          <Menu>
            <Menu.Trigger className="sm:hidden border-2 border-foreground p-1.5 rounded cursor-pointer">
              <MenuIcon className="h-5 w-5" />
            </Menu.Trigger>
            <Menu.Content className="z-50 right-0">
              {navLinks.map(({ href, label }) => (
                <Menu.Item key={href}>
                  <Link href={href} className="block w-full font-bold px-1">
                    {label}
                  </Link>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu>
        </div>
      </div>
    </header>
  );
}
