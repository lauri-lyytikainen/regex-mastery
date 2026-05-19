"use client";

import { useState, useEffect, useRef } from "react";
import { chapters } from "@/lib/levels";
import { getCompletedLevels, markLevelCompleted, clearProgress } from "@/lib/progress";
import { Card } from "@/components/retroui/Card";
import Header from "@/components/Header";
import { Button } from "@/components/retroui/Button";
import { Progress } from "@/components/retroui/Progress";
import RegexEditor from "@/components/RegexEditor";
import { Lock, CheckCircle2, ChevronRight, RotateCcw, Lightbulb } from "lucide-react";

export default function LearnPage() {
  const [currentChapterId, setCurrentChapterId] = useState(1);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [currentPattern, setCurrentPattern] = useState("");
  const [currentFlags, setCurrentFlags] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const justCompletedRef = useRef(false);

  useEffect(() => {
    const completed = getCompletedLevels();
    setCompletedLevels(completed);
    setHydrated(true);

    // Resume at first incomplete level
    for (const chapter of chapters) {
      for (let i = 0; i < chapter.levels.length; i++) {
        if (!completed.has(chapter.levels[i].id)) {
          setCurrentChapterId(chapter.id);
          setCurrentLevelIndex(i);
          const lvl = chapter.levels[i];
          setCurrentFlags((lvl.initialFlags ?? lvl.solutionFlags ?? "g").split(""));
          return;
        }
      }
    }
    // All done — stay on last level
    const last = chapters[chapters.length - 1];
    setCurrentChapterId(last.id);
    setCurrentLevelIndex(last.levels.length - 1);
  }, []);

  const currentChapter = chapters.find((c) => c.id === currentChapterId)!;
  const currentLevel = currentChapter.levels[currentLevelIndex];
  const isInfoLevel = currentLevel.type === "info";

  const isChapterUnlocked = (chapterId: number): boolean => {
    if (chapterId === 1) return true;
    const prevChapter = chapters.find((c) => c.id === chapterId - 1);
    if (!prevChapter) return false;
    return prevChapter.levels.every((l) => completedLevels.has(l.id));
  };

  const chapterCompletedCount = (chapterId: number): number => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return 0;
    return chapter.levels.filter((l) => completedLevels.has(l.id)).length;
  };

  const checkSolution = (): boolean => {
    if (isInfoLevel) return false;
    if (!currentPattern || !currentLevel.solutionRegex || !currentLevel.text) return false;
    try {
      const userRegex = new RegExp(currentPattern, currentFlags.join(""));
      const solutionRegex = new RegExp(currentLevel.solutionRegex, currentLevel.solutionFlags);
      const userMatches = currentLevel.text.match(userRegex) || [];
      const solutionMatches = currentLevel.text.match(solutionRegex) || [];
      if (userMatches.length === 0 && solutionMatches.length === 0) return false;
      if (userMatches.length !== solutionMatches.length) return false;
      return userMatches.every((val, i) => val === solutionMatches[i]);
    } catch {
      return false;
    }
  };

  const isCorrect = checkSolution();

  // Save progress when a challenge level is solved
  useEffect(() => {
    if (isCorrect && !completedLevels.has(currentLevel.id) && !justCompletedRef.current) {
      justCompletedRef.current = true;
      markLevelCompleted(currentLevel.id);
      setCompletedLevels((prev) => new Set([...prev, currentLevel.id]));
    }
    if (!isCorrect) {
      justCompletedRef.current = false;
    }
  }, [isCorrect, currentLevel.id, completedLevels]);

  const navigateTo = (chapterId: number, levelIndex: number) => {
    const chapter = chapters.find((c) => c.id === chapterId)!;
    const level = chapter.levels[levelIndex];
    setCurrentChapterId(chapterId);
    setCurrentLevelIndex(levelIndex);
    setCurrentPattern("");
    const startFlags = level.initialFlags ?? level.solutionFlags ?? "g";
    setCurrentFlags(startFlags.split(""));
    setShowHint(false);
    justCompletedRef.current = false;
  };

  const completeInfoLevel = () => {
    if (!completedLevels.has(currentLevel.id)) {
      markLevelCompleted(currentLevel.id);
      setCompletedLevels((prev) => new Set([...prev, currentLevel.id]));
    }
  };

  const handleNext = () => {
    if (isInfoLevel) completeInfoLevel();
    if (currentLevelIndex < currentChapter.levels.length - 1) {
      navigateTo(currentChapterId, currentLevelIndex + 1);
    } else {
      const nextChapter = chapters.find((c) => c.id === currentChapterId + 1);
      if (nextChapter && isChapterUnlocked(nextChapter.id)) {
        navigateTo(nextChapter.id, 0);
      }
    }
  };

  const handlePrev = () => {
    if (currentLevelIndex > 0) {
      navigateTo(currentChapterId, currentLevelIndex - 1);
    } else {
      const prevChapter = chapters.find((c) => c.id === currentChapterId - 1);
      if (prevChapter) {
        navigateTo(prevChapter.id, prevChapter.levels.length - 1);
      }
    }
  };

  const handleChapterClick = (chapterId: number) => {
    if (!isChapterUnlocked(chapterId)) return;
    const chapter = chapters.find((c) => c.id === chapterId)!;
    const firstIncomplete = chapter.levels.findIndex((l) => !completedLevels.has(l.id));
    const targetIndex = firstIncomplete === -1 ? chapter.levels.length - 1 : firstIncomplete;
    navigateTo(chapterId, targetIndex);
  };

  const handleReset = () => {
    if (!confirm("Reset all progress? This cannot be undone.")) return;
    clearProgress();
    setCompletedLevels(new Set());
    navigateTo(1, 0);
  };

  const isFirstLevel = currentChapterId === 1 && currentLevelIndex === 0;
  const isLastLevel =
    currentChapterId === chapters[chapters.length - 1].id &&
    currentLevelIndex === currentChapter.levels.length - 1;
  const canAdvance = isInfoLevel || isCorrect || completedLevels.has(currentLevel.id);
  const isLastInChapter = currentLevelIndex === currentChapter.levels.length - 1;

  const chapterProgress =
    (chapterCompletedCount(currentChapterId) / currentChapter.levels.length) * 100;
  const totalLevels = chapters.reduce((sum, c) => sum + c.levels.length, 0);
  const totalCompleted = completedLevels.size;

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Chapter tabs */}
      <div className="w-full border-b-2 border-border bg-background sticky top-0 z-10 overflow-x-auto">
        <div className="max-w-3xl mx-auto px-4 py-2 flex gap-1 min-w-max">
          {chapters.map((chapter) => {
            const unlocked = isChapterUnlocked(chapter.id);
            const completed = chapterCompletedCount(chapter.id);
            const isActive = chapter.id === currentChapterId;
            const allDone = completed === chapter.levels.length;

            return (
              <button
                key={chapter.id}
                onClick={() => handleChapterClick(chapter.id)}
                disabled={!unlocked}
                className={[
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded border-2 text-sm font-bold transition-all",
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : unlocked
                      ? "bg-background text-foreground border-border hover:border-foreground cursor-pointer"
                      : "bg-background text-muted-foreground border-border opacity-40 cursor-not-allowed",
                ].join(" ")}
              >
                {!unlocked ? (
                  <Lock className="h-3 w-3" />
                ) : allDone ? (
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                ) : null}
                <span className="hidden sm:inline">{chapter.title}</span>
                <span className="sm:hidden">{chapter.id}</span>
                {unlocked && !allDone && (
                  <span className="text-xs opacity-60">
                    {completed}/{chapter.levels.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 flex flex-col items-center grow justify-center gap-4 py-6">
        {/* Progress bar */}
        <div className="w-full max-w-2xl">
          <div className="flex justify-between mb-1 text-sm font-bold">
            <span>
              Level {currentLevelIndex + 1} of {currentChapter.levels.length}
            </span>
            <span>{Math.round(chapterProgress)}% of chapter</span>
          </div>
          <Progress value={chapterProgress} />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{currentChapter.concept}</span>
            <span>{totalCompleted}/{totalLevels} total</span>
          </div>
        </div>

        {isInfoLevel ? (
          /* Info level — no editor, show examples */
          <Card className="w-full max-w-2xl">
            <Card.Header>
              <div className="flex items-start justify-between gap-2">
                <Card.Title>
                  {currentLevel.title}
                </Card.Title>
                {completedLevels.has(currentLevel.id) && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                )}
              </div>
              <Card.Description className="mt-1">{currentLevel.description}</Card.Description>
            </Card.Header>
            {currentLevel.examples && currentLevel.examples.length > 0 && (
              <Card.Content className="pt-0">
                <div className="border-t border-border pt-3 space-y-2.5">
                  {currentLevel.examples.map((ex, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <code className="font-mono bg-muted border border-border px-2 py-0.5 rounded text-xs whitespace-nowrap shrink-0">
                        {ex.code}
                      </code>
                      <span className="text-sm text-muted-foreground leading-snug">{ex.note}</span>
                    </div>
                  ))}
                </div>
              </Card.Content>
            )}
          </Card>
        ) : (
          /* Challenge level */
          <>
            <Card className="w-full max-w-2xl">
              <Card.Header>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Card.Title>
                      {currentLevel.title}
                    </Card.Title>
                    <Card.Description className="mt-1">{currentLevel.description}</Card.Description>
                  </div>
                  {completedLevels.has(currentLevel.id) && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  )}
                </div>
                {currentLevel.hint && (
                  <div className="mt-2">
                    {showHint ? (
                      <p className="text-sm text-muted-foreground bg-muted/30 rounded p-2 border border-border">
                        {currentLevel.hint}
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
              </Card.Header>
            </Card>
            <RegexEditor
              key={currentLevel.id}
              initialPattern=""
              initialFlags={(currentLevel.initialFlags ?? currentLevel.solutionFlags ?? "g").split("") as ("g" | "i" | "m")[]}
              text={currentLevel.text ?? ""}
              onChange={(pattern, flags) => {
                setCurrentPattern(pattern);
                setCurrentFlags(flags);
              }}
              isCorrect={isCorrect}
            />
          </>
        )}

        <div className="flex justify-between w-full max-w-2xl">
          <Button onClick={handlePrev} disabled={isFirstLevel}>
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLastLevel || !canAdvance}
            className={!canAdvance ? "opacity-50" : ""}
          >
            {!canAdvance && <Lock className="h-4 w-4 mr-2 inline" />}
            {isInfoLevel ? (
              <>
                Continue <ChevronRight className="h-4 w-4 ml-1 inline" />
              </>
            ) : isLastInChapter && !isLastLevel ? (
              <>
                Next Chapter <ChevronRight className="h-4 w-4 ml-1 inline" />
              </>
            ) : (
              "Next Level"
            )}
          </Button>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
        >
          <RotateCcw className="h-3 w-3" />
          Reset progress
        </button>
      </div>
    </div>
  );
}
