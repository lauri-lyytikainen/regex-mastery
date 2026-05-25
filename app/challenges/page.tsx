"use client";

import { useState, useEffect, useRef } from "react";
import { challenges, type Difficulty } from "@/lib/challenges";
import {
  getCompletedChallenges,
  markChallengeCompleted,
  clearChallengeProgress,
} from "@/lib/challengeProgress";
import { Card } from "@/components/retroui/Card";
import Header from "@/components/Header";
import { Button } from "@/components/retroui/Button";
import { Badge } from "@/components/retroui/Badge";
import { Progress } from "@/components/retroui/Progress";
import RegexEditor from "@/components/RegexEditor";
import { CheckCircle2, ArrowLeft, Lightbulb, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";
import type { Flag } from "@/lib/flags";

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "bg-green-500 text-white",
  medium: "bg-amber-500 text-white",
  hard: "bg-red-500 text-white",
};

type FilterValue = Difficulty | "all";

export default function ChallengesPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<Set<number>>(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState<FilterValue>("all");
  const [currentPattern, setCurrentPattern] = useState("");
  const [currentFlags, setCurrentFlags] = useState<Flag[]>(["g"]);
  const [showHint, setShowHint] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const justCompletedRef = useRef(false);

  useEffect(() => {
    setCompletedChallenges(getCompletedChallenges());
    setHydrated(true);
  }, []);

  const selectedChallenge = selectedId !== null ? challenges.find((c) => c.id === selectedId) ?? null : null;

  const filteredChallenges =
    difficultyFilter === "all"
      ? challenges
      : challenges.filter((c) => c.difficulty === difficultyFilter);

  const checkSolution = (): boolean => {
    if (!selectedChallenge || !currentPattern) return false;
    try {
      const userRegex = new RegExp(currentPattern, currentFlags.join(""));
      const solutionRegex = new RegExp(
        selectedChallenge.solutionRegex,
        selectedChallenge.solutionFlags,
      );
      const userMatches = selectedChallenge.text.match(userRegex) || [];
      const solutionMatches = selectedChallenge.text.match(solutionRegex) || [];
      if (userMatches.length === 0 && solutionMatches.length === 0) return false;
      if (userMatches.length !== solutionMatches.length) return false;
      return userMatches.every((val, i) => val === solutionMatches[i]);
    } catch {
      return false;
    }
  };

  const isCorrect = checkSolution();

  useEffect(() => {
    if (selectedId === null) return;
    if (isCorrect && !completedChallenges.has(selectedId) && !justCompletedRef.current) {
      justCompletedRef.current = true;
      markChallengeCompleted(selectedId);
      setCompletedChallenges((prev) => new Set([...prev, selectedId]));
    }
    if (!isCorrect) {
      justCompletedRef.current = false;
    }
  }, [isCorrect, selectedId, completedChallenges]);

  const openChallenge = (id: number) => {
    setSelectedId(id);
    setCurrentPattern("");
    setCurrentFlags(["g"]);
    setShowHint(false);
    justCompletedRef.current = false;
  };

  const goBack = () => {
    setSelectedId(null);
    setCurrentPattern("");
    setCurrentFlags(["g"]);
    setShowHint(false);
    justCompletedRef.current = false;
  };

  const navigateChallenge = (direction: "prev" | "next") => {
    if (!selectedChallenge) return;
    const currentIndex = challenges.findIndex((c) => c.id === selectedChallenge.id);
    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < challenges.length) {
      openChallenge(challenges[nextIndex].id);
    }
  };

  const handleReset = () => {
    if (!confirm("Reset all challenge progress? This cannot be undone.")) return;
    clearChallengeProgress();
    setCompletedChallenges(new Set());
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
      </div>
    );
  }

  const completedCount = completedChallenges.size;
  const totalCount = challenges.length;

  if (selectedChallenge) {
    const currentIndex = challenges.findIndex((c) => c.id === selectedChallenge.id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < challenges.length - 1;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="container mx-auto px-4 py-6 flex flex-col items-center gap-4 grow">
          {/* Top bar */}
          <div className="w-full max-w-2xl flex items-center gap-3 flex-wrap">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Challenges
            </button>
            <span className="text-muted-foreground text-sm">
              {currentIndex + 1} / {challenges.length}
            </span>
            <Badge variant="surface" size="sm" className={DIFFICULTY_COLORS[selectedChallenge.difficulty]}>
              {selectedChallenge.difficulty}
            </Badge>
            <Badge variant="outline" size="sm">
              {selectedChallenge.category}
            </Badge>
            {completedChallenges.has(selectedChallenge.id) && (
              <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
            )}
          </div>

          {/* Story card */}
          <Card className="w-full max-w-2xl">
            <Card.Header>
              <div className="flex items-start justify-between gap-2">
                <Card.Title>{selectedChallenge.title}</Card.Title>
                {completedChallenges.has(selectedChallenge.id) && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                )}
              </div>
              <Card.Description className="mt-2 leading-relaxed">
                {selectedChallenge.story}
              </Card.Description>
            </Card.Header>
            <Card.Content className="pt-0">
              <div className="border-t border-border pt-3">
                <p className="text-sm font-bold mb-1">Your task</p>
                <p className="text-sm text-muted-foreground">{selectedChallenge.task}</p>
              </div>
              {selectedChallenge.hint && (
                <div className="mt-3">
                  {showHint ? (
                    <p className="text-sm text-muted-foreground bg-muted/30 rounded p-2 border border-border">
                      {selectedChallenge.hint}
                    </p>
                  ) : (
                    <button
                      onClick={() => setShowHint(true)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Lightbulb className="h-3 w-3" />
                      Show hint
                    </button>
                  )}
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Editor */}
          <RegexEditor
            key={selectedChallenge.id}
            initialPattern=""
            initialFlags={["g"]}
            text={selectedChallenge.text}
            onChange={(pattern, flags) => {
              setCurrentPattern(pattern);
              setCurrentFlags(flags);
            }}
            isCorrect={isCorrect}
          />

          {/* Nav */}
          <div className="flex justify-between w-full max-w-2xl">
            <Button onClick={() => navigateChallenge("prev")} disabled={!hasPrev}>
              <ChevronLeft className="h-4 w-4 mr-1 inline" />
              Previous
            </Button>
            <Button onClick={() => navigateChallenge("next")} disabled={!hasNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-1 inline" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Selector view ───────────────────────────────────────────────────────────

  const easyCount = challenges.filter((c) => c.difficulty === "easy").length;
  const mediumCount = challenges.filter((c) => c.difficulty === "medium").length;
  const hardCount = challenges.filter((c) => c.difficulty === "hard").length;

  const easyDone = challenges.filter((c) => c.difficulty === "easy" && completedChallenges.has(c.id)).length;
  const mediumDone = challenges.filter((c) => c.difficulty === "medium" && completedChallenges.has(c.id)).length;
  const hardDone = challenges.filter((c) => c.difficulty === "hard" && completedChallenges.has(c.id)).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-6 grow">
        {/* Header section */}
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-3xl font-black">Challenges</h1>
          <p className="text-muted-foreground mt-1">
            Real-world regex problems. Write the pattern, match the text.
          </p>
          <div className="mt-3 flex flex-col items-center gap-1">
            <div className="flex gap-1 text-xs text-muted-foreground">
              <span>{completedCount} of {totalCount} solved</span>
            </div>
            <div className="w-48">
              <Progress value={(completedCount / totalCount) * 100} />
            </div>
          </div>
        </div>

        {/* Difficulty stats */}
        <div className="flex gap-3 flex-wrap justify-center">
          {[
            { label: "Easy", done: easyDone, total: easyCount, color: "bg-green-500" },
            { label: "Medium", done: mediumDone, total: mediumCount, color: "bg-amber-500" },
            { label: "Hard", done: hardDone, total: hardCount, color: "bg-red-500" },
          ].map(({ label, done, total, color }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm">
              <span className={`w-2 h-2 rounded-full ${color}`} />
              <span className="font-bold">{label}</span>
              <span className="text-muted-foreground">{done}/{total}</span>
            </div>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2 flex-wrap justify-center">
          {(["all", "easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={[
                "px-4 py-1.5 rounded border-2 text-sm font-bold transition-all capitalize",
                difficultyFilter === d
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground",
              ].join(" ")}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Challenge grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChallenges.map((challenge) => (
            <button
              key={challenge.id}
              onClick={() => openChallenge(challenge.id)}
              className="text-left group"
            >
              <Card className="h-full transition-shadow group-hover:shadow-md cursor-pointer group-hover:border-foreground">
                <Card.Header>
                  <div className="flex items-start justify-between gap-2">
                    <Card.Title className="text-base leading-snug">
                      {challenge.title}
                    </Card.Title>
                    {completedChallenges.has(challenge.id) && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <Badge
                      variant="surface"
                      size="sm"
                      className={DIFFICULTY_COLORS[challenge.difficulty]}
                    >
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {challenge.category}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Content className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {challenge.story}
                  </p>
                </Card.Content>
              </Card>
            </button>
          ))}
        </div>

        {completedCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset challenge progress
          </button>
        )}
      </div>
    </div>
  );
}
