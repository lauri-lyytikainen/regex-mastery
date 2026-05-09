"use client";

import { useState } from "react";
import { levels } from "@/lib/levels";
import { Card } from "@/components/retroui/Card";
import Header from "@/components/Header";
import { Button } from "@/components/retroui/Button";
import { Progress } from "@/components/retroui/Progress";
import RegexEditor from "@/components/RegexEditor";
import { Lock } from "lucide-react";

export default function LearnPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentLevel = levels[currentIndex];

  const [currentPattern, setCurrentPattern] = useState("");
  const [currentFlags, setCurrentFlags] = useState<string[]>(
    currentLevel.solutionFlags.split(""),
  );

  const handleNext = () => {
    if (currentIndex < levels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentPattern("");
      setCurrentFlags(levels[currentIndex + 1].solutionFlags.split(""));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentPattern("");
      setCurrentFlags(levels[currentIndex - 1].solutionFlags.split(""));
    }
  };

  const checkSolution = (): boolean => {
    if (!currentPattern) return false;
    try {
      const userRegex = new RegExp(currentPattern, currentFlags.join(""));
      const solutionRegex = new RegExp(
        currentLevel.solutionRegex,
        currentLevel.solutionFlags,
      );

      const userMatches = currentLevel.text.match(userRegex) || [];
      const solutionMatches = currentLevel.text.match(solutionRegex) || [];

      if (userMatches.length === 0 && solutionMatches.length === 0)
        return false;
      if (userMatches.length !== solutionMatches.length) return false;
      return userMatches.every((val, index) => val === solutionMatches[index]);
    } catch {
      return false; // Invalid regex
    }
  };

  const isCorrect = checkSolution();

  const progressPercentage = ((currentIndex + 1) / levels.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div></div>
      <Header />
      <div className="w-full max-w-2xl mb-2 mx-auto px-4">
        <div className="flex justify-between mb-1 text-sm font-bold">
          <span>
            Level {currentIndex + 1} of {levels.length}
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} />
      </div>
      <div className="container mx-auto px-4 flex flex-col items-center grow justify-center gap-4">
        <Card className="w-full max-w-2xl">
          <Card.Header>
            <div>
              <Card.Title>
                Level {currentLevel.id}: {currentLevel.title}
              </Card.Title>
              <Card.Description>{currentLevel.description}</Card.Description>
            </div>
          </Card.Header>
        </Card>
        <RegexEditor
          key={currentLevel.id}
          initialPattern=""
          initialFlags={
            currentLevel.solutionFlags.split("") as ("g" | "i" | "m")[]
          }
          text={currentLevel.text}
          onChange={(pattern, flags) => {
            setCurrentPattern(pattern);
            setCurrentFlags(flags);
          }}
          isCorrect={isCorrect}
        />
        <div className="flex justify-between w-full max-w-2xl">
          <Button onClick={handlePrev} disabled={currentIndex === 0}>
            Previous Level
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex === levels.length - 1 || !isCorrect}
            className={!isCorrect ? "opacity-50" : ""}
          >
            {!isCorrect && <Lock className="h-4 w-4 mr-2 inline" />}
            Next Level
          </Button>
        </div>
      </div>
    </div>
  );
}
