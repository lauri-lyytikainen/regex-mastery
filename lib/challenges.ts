export type Difficulty = "easy" | "medium" | "hard";

export interface Challenge {
  id: number;
  title: string;
  story: string;
  task: string;
  text: string;
  solutionRegex: string;
  solutionFlags: string;
  hint: string;
  difficulty: Difficulty;
  category: string;
}

export const challenges: Challenge[] = [
  // ── EASY ───────────────────────────────────────────────────────────────────

  {
    id: 1,
    title: "Operation Email Drop",
    difficulty: "easy",
    category: "Data Extraction",
    story:
      "A security researcher has discovered a raw text dump from a compromised server. " +
      "The data contains sensitive user information mixed with log noise. " +
      "Your mission: extract every valid email address so affected users can be notified immediately.",
    task: "Match all valid email addresses in the text.",
    text: `=== SERVER DUMP #4821 - CONFIDENTIAL ===
From: admin@company.com - Account flagged suspicious
Forwarded to: security@cybercorp.net and ciso@firm.io
Complaint from: john.doe+work@example.co.uk re: data exposure
Contact billing@payments.org for refund requests
Automated alerts: monitor@systems.dev and alerts@ops.io
--- Invalid entries (do not match) ---
@@broken-address, @no-local-part, missing-at-sign, just.text`,
    solutionRegex: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
    solutionFlags: "g",
    hint:
      "Email addresses follow local-part@domain.tld. The local part allows letters, digits, dots, underscores, percent signs, plus signs, and hyphens.",
  },

  {
    id: 2,
    title: "Trending Extraction",
    difficulty: "easy",
    category: "Text Processing",
    story:
      "A social media analytics platform suffered an API outage mid-scrape. " +
      "You've recovered raw post text from the cache and need to extract all hashtags " +
      "to rebuild the trending topics dashboard before the morning report.",
    task:
      "Match all hashtags — # followed by a letter, then any word characters. " +
      "Tags like #123 that start with a digit do not count.",
    text: `Just hit a new PR at the gym! #fitness #gains #mondaymotivation
The sunset tonight was absolutely unreal #nature #photography #nofilter
Can't believe how good this coffee is #coffee #morningvibes
Heading to the #concert tonight, been waiting months! #music #livemusic
--- Do not match these ---
#123notahashtag (starts with digit)
## double-hash (no letter after the second #)`,
    solutionRegex: "#[a-zA-Z]\\w*",
    solutionFlags: "g",
    hint:
      "Hashtags start with # followed by a letter [a-zA-Z], then any word characters (\\w*). " +
      "\\w matches letters, digits, and underscores.",
  },

  {
    id: 3,
    title: "The Time Vault",
    difficulty: "easy",
    category: "Data Extraction",
    story:
      "An old hospital records system stores dates in MM/DD/YYYY format embedded within plain-text patient notes. " +
      "You need to extract every date from this document to reconstruct a chronological timeline for a legal audit.",
    task:
      "Match all dates in MM/DD/YYYY format — exactly 2 digits, a slash, 2 digits, a slash, then 4 digits.",
    text: `PATIENT RECORD #4821 - Dr. Martinez
Admitted: 03/15/2023. Initial assessment completed same day.
Blood work ordered on 03/16/2023, results received 03/18/2023.
Surgery scheduled: 04/02/2023 (pending approval from 03/22/2023 review board).
Follow-up appointments: 05/15/2023 and 06/30/2023.
Last known vaccination on record: 11/08/2022.
--- These should NOT match ---
Text dates like "March 15" or timestamps like 09:30:00 or short form 3/5/23`,
    solutionRegex: "\\d{2}/\\d{2}/\\d{4}",
    solutionFlags: "g",
    hint:
      "Use \\d{2} for exactly two digits and \\d{4} for four digits. Separate the groups with literal forward slashes /.",
  },

  {
    id: 4,
    title: "The Color Code",
    difficulty: "easy",
    category: "Data Extraction",
    story:
      "A design system's token file was partially corrupted during a botched migration. " +
      "The designers need you to extract all 6-digit hex color codes so they can rebuild " +
      "the color palette before the product launch tomorrow.",
    task:
      "Match every 6-digit hex color code: # followed by exactly 6 hexadecimal characters (0-9, a-f, A-F).",
    text: `/* Design System Tokens v2.1 - CORRUPTED */
--color-primary:    #ff5733;
--color-secondary:  #1a1a2e;
--color-accent:     #ffd700;
--color-surface:    #ffffff;
--color-error:      #dc143c;
--color-success:    #28a745;
--color-text:       #2c3e50;
--color-muted:      #6c757d;
/* INVALID - do not match */
/* #fff (3-digit shorthand)  */
/* #XXYYZZ (invalid hex chars) */
/* color: rgba(255, 99, 71, 0.5) */`,
    solutionRegex: "#[0-9a-fA-F]{6}",
    solutionFlags: "g",
    hint:
      "Hex digits run from 0-9 and a-f (or A-F). A 6-digit color code is # followed by exactly {6} of them.",
  },

  // ── MEDIUM ─────────────────────────────────────────────────────────────────

  {
    id: 5,
    title: "The Contact Crisis",
    difficulty: "medium",
    category: "Data Extraction",
    story:
      "Your company's legacy CRM exported contact records with phone numbers in three different formats — all jammed into the same field. " +
      "Before the data can be imported into the new system, every US phone number needs to be extracted. " +
      "The formats are: (xxx) xxx-xxxx, xxx-xxx-xxxx, and xxx.xxx.xxxx.",
    task:
      "Match all US phone numbers across the three formats. The area code may or may not have parentheses.",
    text: `=== CONTACT EXPORT v1.4 ===
Alice Chen:   (415) 555-0182  - West Coast sales
Bob Torres:   650-555-0134    - Engineering
Carol Davis:  415.555.0167    - Product design
Main office:  (800) 555-0100  - Reception
Support line: 1-800-555-0199  (toll-free - the leading 1 is not part of the format)
Fax machine:  650.555.0188    - Accounts
--- INVALID - do not match ---
555-12345 (too many digits in last group)
(123) 456 (missing last group)
not-a-number`,
    solutionRegex: "\\(?\\d{3}\\)?[-.\\s]\\d{3}[-.\\s]\\d{4}",
    solutionFlags: "g",
    hint:
      "Area code: \\(?\\d{3}\\)? (optional parens around 3 digits). " +
      "Separator: [-. ] — use a character class with hyphen, dot, and \\s (whitespace). " +
      "Then 3 digits, separator, 4 digits.",
  },

  {
    id: 6,
    title: "The Link Labyrinth",
    difficulty: "medium",
    category: "Data Extraction",
    story:
      "A web crawler dumped its raw output — a mix of scraped text, metadata, and URLs all jumbled together. " +
      "You need to extract every URL (http and https) from the mess so the link checker can process them. " +
      "URLs end at whitespace — no trailing punctuation to worry about.",
    task:
      "Match all URLs starting with http:// or https://. Assume URLs contain no spaces.",
    text: `=== CRAWLER OUTPUT - run #2847 ===
Documentation portal: https://docs.example.com/getting-started
Legacy API endpoint:  http://api.legacy.org/v1/users?limit=50&page=1
Source repository:    https://github.com/myorg/myrepo
Community forum post: https://stackoverflow.com/questions/123456
Internal dashboard:   http://internal.corp/admin/metrics
Research paper:       https://arxiv.org/abs/1706.03762
Status monitor:       https://status.example.io/incidents`,
    solutionRegex: "https?://\\S+",
    solutionFlags: "g",
    hint:
      "URLs start with http:// or https:// (the s is optional with ?). " +
      "\\S+ matches any non-whitespace sequence — URLs run until the first space or line break.",
  },

  {
    id: 7,
    title: "The Error Oracle",
    difficulty: "medium",
    category: "Text Processing",
    story:
      "Your monitoring system crashed and left you with a raw server log file. " +
      "You need to surface only the ERROR and WARN level lines — complete lines from the timestamp bracket to the end — " +
      "so the on-call engineer can assess incident severity without reading every entry.",
    task:
      "Match complete log lines that are at ERROR or WARN level. Each line starts with a timestamp in square brackets. " +
      "Use the multiline flag so ^ and $ anchor to each line.",
    text: `[2024-01-15 09:23:11] INFO: Server started successfully on port 8080
[2024-01-15 09:23:45] ERROR: Database connection refused on host db-primary
[2024-01-15 09:24:01] WARN: Memory usage at 87% - approaching critical limit
[2024-01-15 09:24:35] INFO: Health check passed (latency: 12ms)
[2024-01-15 09:25:12] ERROR: Request timeout after 30s on /api/users
[2024-01-15 09:26:00] WARN: Slow query detected - execution time: 4200ms
[2024-01-15 09:26:45] INFO: Cache refreshed successfully (1284 entries)
[2024-01-15 09:27:03] INFO: Scheduled backup completed`,
    solutionRegex: "^\\[.*?\\] (?:ERROR|WARN):.*$",
    solutionFlags: "gm",
    hint:
      "Use ^ and $ anchors with the m (multiline) flag to match full lines. " +
      "\\[.*?\\] matches the timestamp bracket (.*? is lazy to stop at the first ]). " +
      "(?:ERROR|WARN) uses non-capturing alternation.",
  },

  {
    id: 8,
    title: "The Document Decoder",
    difficulty: "medium",
    category: "Text Processing",
    story:
      "A static site generator needs to auto-build a table of contents from a Markdown file. " +
      "Your task: extract every heading at levels 1, 2, and 3 (lines that start with one, two, or three # characters). " +
      "Level 4 and deeper headings should be excluded from the TOC.",
    task:
      "Match all Markdown headings at levels H1 through H3. " +
      "Use the multiline flag to anchor the # characters to the start of each line.",
    text: `# Getting Started with the API
Welcome to our comprehensive API reference.
## Authentication
All API requests must include a valid Authorization header.
### API Keys
Generate your personal API key from the developer dashboard.
### OAuth 2.0
For third-party app integrations, implement the OAuth 2.0 flow.
## Making Requests
All requests go to the base URL: https://api.example.com/v2
# Advanced Topics
For power users and enterprise integrations.
### Rate Limiting
We enforce a limit of 100 requests per minute per API key.
#### Deep Dive: Token Buckets
This level-4 heading should NOT be matched.`,
    solutionRegex: "^#{1,3} .+",
    solutionFlags: "gm",
    hint:
      "#{1,3} matches 1 to 3 # characters (greedy, so #### would match ### then fail on the literal space). " +
      "Add a literal space after the hashes, then .+ for the heading text. " +
      "Enable the m flag so ^ anchors to each line start.",
  },

  // ── HARD ───────────────────────────────────────────────────────────────────

  {
    id: 9,
    title: "The Network Nexus",
    difficulty: "hard",
    category: "Validation",
    story:
      "A firewall log contains a mix of valid and invalid IP addresses from a suspected intrusion. " +
      "Your task: extract only valid IPv4 addresses where every octet is strictly between 0 and 255. " +
      "A naive \\d+ would happily match 256 or 999 — you need octet range validation built into the regex.",
    task:
      "Match only valid IPv4 addresses. Each octet must be 0-255. " +
      "Addresses like 256.x.x.x or 192.168.300.5 must not match.",
    text: `=== FIREWALL LOG - 2024-01-15 ===
ALLOW 192.168.1.100 -> 10.0.0.1    [internal traffic]
DENY  256.168.0.1                   [first octet out of range]
ALLOW 172.16.254.1 -> 8.8.8.8      [DNS request]
DENY  192.168.300.5                 [third octet out of range]
ALLOW 203.0.113.42 -> 198.51.100.0 [external approved]
DENY  999.999.999.999               [all octets invalid]
ALLOW 127.0.0.1                     [localhost]`,
    solutionRegex:
      "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b",
    solutionFlags: "g",
    hint:
      "Each octet is one of three ranges: 250-255 → 25[0-5], 200-249 → 2[0-4]\\d, 0-199 → [01]?\\d\\d?. " +
      "Use \\b word boundaries and repeat the octet+dot pattern {3} times for the first three octets.",
  },

  {
    id: 10,
    title: "The Currency Filter",
    difficulty: "hard",
    category: "Text Processing",
    story:
      "A financial reporting system needs to extract only prices denominated in USD or EUR from a mixed-currency transaction log. " +
      "Using a lookahead assertion, match dollar amounts that are immediately followed by USD or EUR — " +
      "but not other currencies. The $ sign should be part of the match.",
    task:
      "Match dollar amounts (like $10.99) only when they are immediately followed by a space and then USD or EUR. " +
      "Use a positive lookahead so the currency code is checked but not included in the match.",
    text: `=== TRANSACTION REPORT - Q4 2024 ===
Item A (Electronics):  $10.99 USD  - approved for export
Item B (Software):     $20.00 EUR  - approved for export
Item C (Import fee):   $5.50 GBP   - rejected: wrong currency
Item D (Alt symbol):   15.00 EUR   - rejected: missing dollar sign
Item E (Hardware):     $100.00 USD - approved for export
Item F (Service):      $7.25 JPY   - rejected: wrong currency
Item G (License):      $49.99 EUR  - approved for export`,
    solutionRegex: "\\$\\d+\\.\\d{2}(?= (?:USD|EUR))",
    solutionFlags: "g",
    hint:
      "Use \\$ for the dollar sign, \\d+\\.\\d{2} for the amount, then (?= ...) for a positive lookahead. " +
      "Inside the lookahead, a literal space then (?:USD|EUR) matches either currency without capturing.",
  },

  {
    id: 11,
    title: "The Tag Extractor",
    difficulty: "hard",
    category: "Text Processing",
    story:
      "A web scraper is pulling article content from HTML. " +
      "It needs to extract text wrapped in matching HTML open and close tags — but only inline elements with no nested tags inside. " +
      "Mismatched pairs like <p>text</h2> must not match. " +
      "Use a backreference to ensure the closing tag matches the opening one.",
    task:
      "Match any HTML element where the opening and closing tags are the same tag name (e.g., <p>text</p>). " +
      "The element content must not contain any child tags.",
    text: `<article>
  <h1>The Quest for Perfect Regex</h1>
  <p>Once upon a time, in a world of unstructured text...</p>
  <h2>Chapter 1: The Beginning</h2>
  <p>A developer sat down with a log file and a dream.</p>
  <div>This div content should also be matched.</div>
  <p>Mismatched tags: this paragraph closes wrong</h2>
  <span>Span elements count too!</span>
  <section>
    <p>Nested paragraph - the section tag itself will not match.</p>
  </section>
</article>`,
    solutionRegex: "<(\\w+)>[^<]+<\\/\\1>",
    solutionFlags: "g",
    hint:
      "Capture the tag name with (\\w+). Use [^<]+ for text containing no inner tags (no < character). " +
      "Close with <\\/\\1> where \\1 is a backreference to the captured opening tag name.",
  },

  {
    id: 12,
    title: "The Word Stutterer",
    difficulty: "hard",
    category: "Text Processing",
    story:
      "A word processor's proofreader needs to flag accidentally repeated words — " +
      "like 'the the' or 'is is' — that commonly slip in during fast editing. " +
      "Use a backreference to detect when any word immediately follows itself, separated only by whitespace. " +
      "The check should be case-insensitive so 'The the' is also caught.",
    task:
      "Match any instance of a word immediately repeated (separated by whitespace). " +
      "The match must include both the first and second occurrence. Use the case-insensitive flag.",
    text: `The project report was was completed ahead of schedule.
Please check check the attached document for errors.
A final final version has been submitted to the committee.
The the status update is still pending from the client.
This line is perfectly fine with no repeated words.
Interestingly, this sentence has a repeated repeated word too!
Note: hyphenated back-to-back does not count as repetition.`,
    solutionRegex: "\\b(\\w+)\\s+\\1\\b",
    solutionFlags: "gi",
    hint:
      "Capture a word with (\\w+), allow whitespace between repetitions with \\s+, " +
      "then use \\1 as a backreference to match the same word again. " +
      "Enable the i flag for case-insensitive matching so 'The the' is caught.",
  },
];
