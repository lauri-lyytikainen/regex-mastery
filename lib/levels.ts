export interface RegexLevel {
  id: number;
  title: string;
  description: string;
  text: string;
  solutionRegex: string;
  solutionFlags: string;
}

export const levels: RegexLevel[] = [
  {
    id: 1,
    title: "Literal Characters",
    description:
      "Match the word 'cat' exactly in the provided text. Regex is case-sensitive by default.",
    text: "The cat sat on the mat, but the CAt was not happy.",
    solutionRegex: "cat",
    solutionFlags: "g",
  },
  {
    id: 2,
    title: "Digits",
    description: "Use \\d to match all the digits (0-9) in the text.",
    text: "My phone number is 555-1234. I have 3 apples and 42 oranges.",
    solutionRegex: "\\d",
    solutionFlags: "g",
  },
  {
    id: 3,
    title: "Word Characters",
    description:
      "Use \\w to match any word character (letters, numbers, and underscores). Notice it does not match spaces or punctuation.",
    text: "User_Name123 is valid! But... why?",
    solutionRegex: "\\w+",
    solutionFlags: "g",
  },
  {
    id: 4,
    title: "Whitespace",
    description:
      "Use \\s to capture all whitespace characters (spaces, tabs, newlines).",
    text: "Here is a space \n and a new line \t and a tab.",
    solutionRegex: "\\s",
    solutionFlags: "g",
  },
  {
    id: 5,
    title: "The Dot",
    description:
      "The dot (.) matches any single character except a newline. Use it to match 'b-t', 'b.t', 'bat', 'b t', etc.",
    text: "bat bet bit bot but btt b.t b-t b t",
    solutionRegex: "b.t",
    solutionFlags: "g",
  },
];
