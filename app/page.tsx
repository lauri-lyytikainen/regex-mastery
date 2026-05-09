"use client";

import Header from "@/components/Header";
import { Button } from "@/components/retroui/Button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="grow flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold mb-6 text-center">
          Master Regular Expressions
        </h1>
        <p className="text-lg mb-8 max-w-xl text-center text-muted-foreground">
          Learn, practice, and master Regex through interactive levels and
          challenges.
        </p>
        <Link href="/learn" passHref>
          <Button size="lg">
            Start Learning Now
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </main>
    </div>
  );
}
