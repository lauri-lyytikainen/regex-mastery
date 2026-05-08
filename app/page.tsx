"use client";

import { Card } from "@/components/retroui/Card";
import Header from "@/components/Header";
import { Input } from "@/components/retroui/Input";
import { Button } from "@/components/retroui/Button";
import { Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />
      <div className="container mx-auto px-4 flex flex-col items-center grow justify-center gap-4">
        <Card className="w-full max-w-md">
          <Card.Header>
            <Card.Title>Level 1</Card.Title>
            <Card.Description>
              This is where the level explanation will go.
            </Card.Description>
          </Card.Header>
        </Card>
        <Card className="w-full max-w-md">
          <Card.Header>
            <Card.Title>Text</Card.Title>
            <div className="max-h-48 overflow-y-auto rounded  p-3 text-sm leading-6 whitespace-pre-wrap bg-background">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
              risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
              nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
              ligula massa, varius a, semper congue, euismod non, mi. Donec
              vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam
              sit amet orci eget eros faucibus tincidunt. Duis leo. Sed
              fringilla mauris sit amet nibh. Donec sodales sagittis magna.
              Praesent blandit laoreet nibh. Fusce convallis metus id felis
              luctus adipiscing. Pellentesque habitant morbi tristique senectus
              et netus et malesuada fames ac turpis egestas. Vestibulum tortor
              quam, feugiat vitae, ultricies eget, tempor sit amet, ante.
            </div>
          </Card.Header>
        </Card>
        <Input
          placeholder="Enter your regex here..."
          className="w-full max-w-md mb-4"
        />
        <div className="flex justify-between w-full max-w-md">
          <Button>Previous Level</Button>
          <Button disabled>
            <Lock className="h-4 w-4 mr-2" />
            Next Level
          </Button>
        </div>
      </div>
    </div>
  );
}
