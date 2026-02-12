// 20 original Bebras-style questions for P5/P6/S1/S2.
// Each question includes: level, topic, qType, details (teacher-visible).

window.QUESTION_BANK = [
  // -------------------------
  // P5 (11 years old) -- 5 Qs
  // -------------------------
  {
    id: "P5-01",
    level: "P5",
    topic: "Sequencing",
    qType: "Order / process",
    details: "Tests reasoning about step order and constraints (can’t close box before inserting items).",
    title: "Packing order",
    points: 3,
    prompt:
      "A robot packs a snack box.\n\n" +
      "Steps available:\n" +
      "1) Put the sandwich into the box\n" +
      "2) Close the box\n" +
      "3) Put the note into the box\n\n" +
      "Which order always works?",
    options: ["1, 2, 3", "3, 1, 2", "2, 1, 3", "1, 3, 2"],
    answerIndex: 3
  },
  {
    id: "P5-02",
    level: "P5",
    topic: "Patterns",
    qType: "Next in sequence",
    details: "Finds a repeating pattern and predicts a later position.",
    title: "Sticker pattern",
    points: 3,
    prompt:
      "A sticker machine prints this pattern repeatedly:\n\n" +
      "Circle, Circle, Square, Circle, Circle, Square, ...\n\n" +
      "What is the 9th sticker?",
    options: ["Circle", "Square", "Triangle", "It cannot be known"],
    answerIndex: 1
  },
  {
    id: "P5-03",
    level: "P5",
    topic: "Logic",
    qType: "If rule",
    details: "Applies a simple if/otherwise rule carefully.",
    title: "Ticket rule",
    points: 3,
    prompt:
      "A game gives a ticket based on the number you roll:\n" +
      "If the number is 1 or 2, you get a BLUE ticket.\n" +
      "Otherwise, you get a RED ticket.\n\n" +
      "You roll a 4. What ticket do you get?",
    options: ["BLUE", "RED", "Both", "None"],
    answerIndex: 1
  },
  {
    id: "P5-04",
    level: "P5",
    topic: "Spatial reasoning",
    qType: "Rotation",
    details: "Mentally rotates an object by 90° steps.",
    title: "Turn the arrow",
    points: 3,
    prompt:
      "An arrow points UP. You turn it right (clockwise) twice.\n\n" +
      "Where does it point now?",
    options: ["Up", "Down", "Left", "Right"],
    answerIndex: 1
  },
  {
    id: "P5-05",
    level: "P5",
    topic: "Information",
    qType: "Counting states",
    details: "Counts how many outcomes exist for multiple ON/OFF choices.",
    title: "Light switches",
    points: 3,
    prompt:
      "You have 3 light switches. Each switch can be ON or OFF.\n\n" +
      "How many different switch patterns are possible?",
    options: ["3", "6", "8", "9"],
    answerIndex: 2
  },

  // -------------------------
  // P6 (12 years old) -- 5 Qs
  // -------------------------
  {
    id: "P6-01",
    level: "P6",
    topic: "Grids / paths",
    qType: "Shortest path",
    details: "Finds a shortest path length on a grid while avoiding obstacles.",
    title: "Shortest safe walk",
    points: 4,
    prompt:
      "You are at S and want to reach T.\n" +
      "You can move up/down/left/right.\n" +
      "You cannot step on #.\n\n",
    art:
`S . . .
# # . #
. . . #
. # . T`,
    options: ["6 steps", "7 steps", "8 steps", "9 steps"],
    answerIndex: 1
  },
  {
    id: "P6-02",
    level: "P6",
    topic: "Loops",
    qType: "Repeated action",
    details: "Simulates a loop and computes the final total.",
    title: "Stamping cards",
    points: 4,
    prompt:
      "A machine starts at 0 points.\n" +
      "It repeats 5 times:\n" +
      "Add 2 points.\n\n" +
      "How many points at the end?",
    options: ["7", "8", "9", "10"],
    answerIndex: 3
  },
  {
    id: "P6-03",
    level: "P6",
    topic: "Sorting",
    qType: "Minimum swaps (adjacent)",
    details: "Counts the minimum neighbouring swaps needed to sort (inversions).",
    title: "Neighbour swaps",
    points: 4,
    prompt:
      "You have: 2 4 1 3\n" +
      "You may swap only neighbouring numbers.\n\n" +
      "Minimum swaps to sort into 1 2 3 4?",
    options: ["2", "3", "4", "5"],
    answerIndex: 1
  },
  {
    id: "P6-04",
    level: "P6",
    topic: "Conditions",
    qType: "Rule with priority",
    details: "Special-case rule overrides normal scoring.",
    title: "Bonus points",
    points: 4,
    prompt:
      "A quiz gives points like this:\n" +
      "- Correct answer: +2\n" +
      "- Extra bonus: If you answer correctly AND in under 10 seconds, you get +5 total (not +2).\n\n" +
      "You answer correctly in 8 seconds. How many points do you get?",
    options: ["2", "5", "7", "10"],
    answerIndex: 1
  },
  {
    id: "P6-05",
    level: "P6",
    topic: "Networks",
    qType: "Count shortest routes",
    details: "Counts distinct shortest routes in a small network.",
    title: "Two-step routes",
    points: 4,
    prompt:
      "A can connect to B and C.\n" +
      "B can connect to D.\n" +
      "C can connect to D.\n\n" +
      "How many different shortest routes are there from A to D?",
    options: ["1", "2", "3", "4"],
    answerIndex: 1
  },

  // -------------------------
  // S1 (13 years old) -- 5 Qs
  // -------------------------
  {
    id: "S1-01",
    level: "S1",
    topic: "Debugging",
    qType: "Edge case / equality",
    details: "Tests understanding of comparisons when values are equal.",
    title: "Pick the larger number",
    points: 5,
    prompt:
      "A student writes this rule to return the larger of A and B:\n\n" +
      "If A > B, return A\n" +
      "Else return B\n\n" +
      "What does this rule return when A = 3 and B = 3?",
    options: ["3", "B", "It crashes", "It returns nothing"],
    answerIndex: 1
  },
  {
    id: "S1-02",
    level: "S1",
    topic: "Binary",
    qType: "Bit counting",
    details: "Uses 2^n outcomes for n bits.",
    title: "How many codes?",
    points: 5,
    prompt:
      "A locker code uses exactly 4 bits (0/1).\n\n" +
      "How many different codes are possible?",
    options: ["4", "8", "12", "16"],
    answerIndex: 3
  },
  {
    id: "S1-03",
    level: "S1",
    topic: "Algorithms",
    qType: "Trace a procedure",
    details: "Traces a branching procedure across fixed iterations.",
    title: "Even-odd machine",
    points: 5,
    prompt:
      "Start with the number 10.\n" +
      "Repeat exactly 3 times:\n" +
      "- If the number is even, divide by 2\n" +
      "- If the number is odd, add 3\n\n" +
      "What is the final number?",
    options: ["4", "5", "6", "7"],
    answerIndex: 0
  },
  {
    id: "S1-04",
    level: "S1",
    topic: "Data representation",
    qType: "Encoding size",
    details: "Computes bits needed: pixels × bits per pixel.",
    title: "Pixel storage",
    points: 5,
    prompt:
      "A 5×5 black/white image uses 1 bit per pixel.\n\n" +
      "How many bits are needed in total?",
    options: ["10", "15", "20", "25"],
    answerIndex: 3
  },
  {
    id: "S1-05",
    level: "S1",
    topic: "Logic",
    qType: "OR condition",
    details: "Understands OR: either condition is enough.",
    title: "Club entry rule",
    points: 5,
    prompt:
      "A club rule says:\n" +
      "You may enter if you have a PASS OR you are with a TEACHER.\n\n" +
      "You have no pass, but you are with a teacher.\n" +
      "Can you enter?",
    options: ["Yes", "No", "Only on weekends", "Not enough information"],
    answerIndex: 0
  },

  // -------------------------
  // S2 (14 years old) -- 5 Qs
  // -------------------------
  {
    id: "S2-01",
    level: "S2",
    topic: "Efficiency",
    qType: "Compare strategies",
    details: "Chooses strategy with fewer checks in the worst case (binary search idea).",
    title: "Finding a name",
    points: 6,
    prompt:
      "A list has 100 names.\n" +
      "Strategy A: start from the top and check one by one.\n" +
      "Strategy B: the list is sorted, so you can repeatedly check the middle and cut the list in half.\n\n" +
      "In the worst case, which strategy uses fewer checks?",
    options: ["A", "B", "Same", "Cannot compare"],
    answerIndex: 1
  },
  {
    id: "S2-02",
    level: "S2",
    topic: "Graphs / routing",
    qType: "Cheapest path (weighted)",
    details: "Finds minimum total cost, not minimum number of steps.",
    title: "Cheapest route",
    points: 6,
    prompt:
      "A delivery bot can travel these paths (cost in minutes):\n" +
      "A→B (2), A→C (5), B→D (6), C→D (1), B→C (1)\n\n" +
      "What is the cheapest cost from A to D?",
    options: ["6", "7", "8", "9"],
    answerIndex: 2
  },
  {
    id: "S2-03",
    level: "S2",
    topic: "Invariants",
    qType: "Parity / impossible state",
    details: "Flipping 2 tiles keeps number of black tiles even.",
    title: "Colour flips",
    points: 6,
    prompt:
      "You have 6 tiles in a row, all WHITE.\n" +
      "One move flips exactly 2 neighbouring tiles (WHITE↔BLACK).\n\n" +
      "After any number of moves, which situation is impossible?",
    options: [
      "0 black tiles",
      "1 black tile",
      "2 black tiles",
      "4 black tiles"
    ],
    answerIndex: 1
  },
  {
    id: "S2-04",
    level: "S2",
    topic: "Strings",
    qType: "Pattern matching (overlaps)",
    details: "Counts substring occurrences allowing overlaps.",
    title: "Counting blocks",
    points: 6,
    prompt:
      "A code is: ABABABAA\n\n" +
      "How many times does the block 'ABA' appear if overlaps ARE allowed?",
    options: ["1", "2", "3", "4"],
    answerIndex: 2
  },
  {
    id: "S2-05",
    level: "S2",
    topic: "Cryptography basics",
    qType: "Caesar shift decode",
    details: "Decodes by shifting letters backward by 3.",
    title: "Shift message",
    points: 6,
    prompt:
      "A message uses this rule:\n" +
      "A→D, B→E, C→F, ... (each letter shifts forward by 3)\n\n" +
      "The coded word is: KHOOR\n" +
      "What is the original word?",
    options: ["HELLO", "KELLY", "HOLLY", "KHOOR"],
    answerIndex: 0
  }
];
