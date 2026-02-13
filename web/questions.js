// 15 curated Bebras-style computational thinking questions.
// Sorted by increasing difficulty (points: 3 → 4 → 5 → 6).

window.QUESTION_BANK = [

  // =====================  3 points — Easy  =====================

  {
    id: "Q01",
    topic: "Sequencing",
    qType: "mcq",
    title: "\ud83d\udce6 Packing Order",
    points: 3,
    prompt:
      "A robot \ud83e\udd16 packs a snack box.\n\n" +
      "Steps available:\n" +
      "  1\ufe0f\u20e3  Put the sandwich \ud83e\udd6a into the box\n" +
      "  2\ufe0f\u20e3  Close the box \ud83d\udce6\n" +
      "  3\ufe0f\u20e3  Put the note \ud83d\udcdd into the box\n\n" +
      "Which order always works?",
    options: ["1, 2, 3", "3, 1, 2", "2, 1, 3", "1, 3, 2"],
    answerIndex: 3
  },
  {
    id: "Q02",
    topic: "Patterns",
    qType: "mcq",
    title: "\ud83d\udd35 Sticker Pattern",
    points: 3,
    prompt:
      "A sticker machine prints this pattern over and over:\n\n" +
      "\u2b55 \u2b55 \u25fb\ufe0f \u2b55 \u2b55 \u25fb\ufe0f \u2b55 \u2b55 \u25fb\ufe0f \u2026\n\n" +
      "What is the 9th sticker?",
    options: ["\u2b55 Circle", "\u25fb\ufe0f Square", "\ud83d\udd3a Triangle", "Cannot be known"],
    answerIndex: 1
  },
  {
    id: "Q03",
    topic: "Logic",
    qType: "mcq",
    title: "\ud83e\udd16 Robot Detective",
    points: 3,
    prompt:
      "A robot was spotted at the museum \ud83c\udfdb\ufe0f\n" +
      "The security camera \ud83d\udcf9 shows:\n\n" +
      "  \u2022 The robot had WHEELS (not legs)\n" +
      "  \u2022 The robot was painted BLUE \ud83d\udd35\n" +
      "  \u2022 The robot had NO antenna\n\n" +
      "Which statement below is TRUE?",
    options: [
      "The robot had legs AND was painted blue",
      "The robot had wheels AND had an antenna",
      "The robot was painted red OR had wheels",
      "The robot had legs OR had an antenna"
    ],
    answerIndex: 2
  },
  {
    id: "Q04",
    topic: "Combinatorics",
    qType: "mcq",
    title: "\ud83d\udca1 Light Switches",
    points: 3,
    prompt:
      "You have 3 light switches \ud83d\udca1\n" +
      "Each switch can be ON or OFF.\n\n" +
      "How many different switch patterns are possible?",
    options: ["3", "6", "8", "9"],
    answerIndex: 2
  },

  // =====================  4 points — Medium  =====================

  {
    id: "Q05",
    topic: "Grids & Paths",
    qType: "mcq",
    title: "\ud83d\uddfa\ufe0f Shortest Safe Walk",
    points: 4,
    prompt:
      "You are at S (green) and want to reach T (red).\n" +
      "You can move \u2b06\ufe0f\u2b07\ufe0f\u2b05\ufe0f\u27a1\ufe0f one square at a time.\n" +
      "You cannot step on the dark walls.\n\n" +
      "What is the shortest safe path?",
    illustration:
      '<svg viewBox="0 0 200 200" width="220" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:10px 0">' +
        '<style>.c{rx:6}.o{fill:#e2e8f0}.w{fill:#374151}.t{text-anchor:middle;dominant-baseline:central;font:bold 16px system-ui;fill:#fff}</style>' +
        '<rect class="c" x="1" y="1" width="48" height="48" fill="#22c55e"/><text class="t" x="25" y="25">S</text>' +
        '<rect class="c o" x="51" y="1" width="48" height="48"/>' +
        '<rect class="c o" x="101" y="1" width="48" height="48"/>' +
        '<rect class="c o" x="151" y="1" width="48" height="48"/>' +
        '<rect class="c w" x="1" y="51" width="48" height="48"/>' +
        '<rect class="c w" x="51" y="51" width="48" height="48"/>' +
        '<rect class="c o" x="101" y="51" width="48" height="48"/>' +
        '<rect class="c w" x="151" y="51" width="48" height="48"/>' +
        '<rect class="c o" x="1" y="101" width="48" height="48"/>' +
        '<rect class="c o" x="51" y="101" width="48" height="48"/>' +
        '<rect class="c o" x="101" y="101" width="48" height="48"/>' +
        '<rect class="c w" x="151" y="101" width="48" height="48"/>' +
        '<rect class="c o" x="1" y="151" width="48" height="48"/>' +
        '<rect class="c w" x="51" y="151" width="48" height="48"/>' +
        '<rect class="c o" x="101" y="151" width="48" height="48"/>' +
        '<rect class="c" x="151" y="151" width="48" height="48" fill="#ef4444"/><text class="t" x="175" y="175">T</text>' +
      '</svg>',
    options: ["6 steps", "7 steps", "8 steps", "9 steps"],
    answerIndex: 1
  },
  {
    id: "Q06",
    topic: "Algorithms",
    qType: "mcq",
    title: "\ud83c\udf3f Magic Garden",
    points: 4,
    prompt:
      "A magical bush \ud83c\udf3f starts the morning with 10 berries.\n\n" +
      "Rules:\n" +
      "  \ud83d\udc26 Bird visits \u2192 bush grows 3 more berries\n" +
      "  \ud83d\udc3f\ufe0f Squirrel visits \u2192 eats 2 berries\n" +
      "  \ud83e\udd8a Fox visits \u2192 half the berries fall off (round down)\n\n" +
      "Today\u2019s visitors in order:  \ud83d\udc26  \ud83d\udc26  \ud83d\udc3f\ufe0f  \ud83e\udd8a  \ud83d\udc26\n\n" +
      "How many berries at the end of the day?",
    options: ["7", "8", "10", "12"],
    answerIndex: 2
  },
  {
    id: "Q07",
    topic: "Networks",
    qType: "mcq",
    title: "\ud83d\udd17 Two-step Routes",
    points: 4,
    prompt:
      "Look at the network below.\n" +
      "A connects to B and C.\n" +
      "B connects to D.   C connects to D.\n\n" +
      "How many different shortest routes are there from A \u2192 D?",
    illustration:
      '<svg viewBox="0 0 240 140" width="260" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:10px 0">' +
        '<defs><marker id="a7" viewBox="0 0 10 6" refX="9" refY="3" markerWidth="7" markerHeight="5" orient="auto"><path d="M0,0L10,3L0,6z" fill="#64748b"/></marker></defs>' +
        '<line x1="55" y1="70" x2="96" y2="30" stroke="#64748b" stroke-width="2" marker-end="url(#a7)"/>' +
        '<line x1="55" y1="70" x2="96" y2="110" stroke="#64748b" stroke-width="2" marker-end="url(#a7)"/>' +
        '<line x1="144" y1="22" x2="185" y2="62" stroke="#64748b" stroke-width="2" marker-end="url(#a7)"/>' +
        '<line x1="144" y1="118" x2="185" y2="78" stroke="#64748b" stroke-width="2" marker-end="url(#a7)"/>' +
        '<circle cx="40" cy="70" r="20" fill="#3b82f6"/><text x="40" y="72" text-anchor="middle" dominant-baseline="central" fill="#fff" font-weight="bold" font-size="16" font-family="system-ui">A</text>' +
        '<circle cx="120" cy="20" r="20" fill="#3b82f6"/><text x="120" y="22" text-anchor="middle" dominant-baseline="central" fill="#fff" font-weight="bold" font-size="16" font-family="system-ui">B</text>' +
        '<circle cx="120" cy="120" r="20" fill="#3b82f6"/><text x="120" y="122" text-anchor="middle" dominant-baseline="central" fill="#fff" font-weight="bold" font-size="16" font-family="system-ui">C</text>' +
        '<circle cx="200" cy="70" r="20" fill="#ef4444"/><text x="200" y="72" text-anchor="middle" dominant-baseline="central" fill="#fff" font-weight="bold" font-size="16" font-family="system-ui">D</text>' +
      '</svg>',
    options: ["1", "2", "3", "4"],
    answerIndex: 1
  },
  {
    id: "Q08",
    topic: "Sequencing",
    qType: "ordering",
    title: "\ud83d\udc68\u200d\ud83c\udf73 Recipe Robot",
    points: 4,
    prompt:
      "A cooking robot must follow these steps in the right order.\n" +
      "The steps have been shuffled!\n\n" +
      "Rules:\n" +
      "  \u2022 Fill the pot before boiling water\n" +
      "  \u2022 Boil water before adding pasta\n" +
      "  \u2022 Add pasta before draining\n" +
      "  \u2022 Drain before adding sauce\n\n" +
      "Click the steps in the correct order (first \u2192 last).",
    orderItems: [
      { id: "drain",  text: "\ud83e\uddc6 Drain the pasta" },
      { id: "sauce",  text: "\ud83c\udf45 Add sauce" },
      { id: "boil",   text: "\ud83d\udca8 Boil the water" },
      { id: "fill",   text: "\ud83d\udeb0 Fill pot with water" },
      { id: "pasta",  text: "\ud83c\udf5d Put pasta in the pot" }
    ],
    correctOrder: ["fill", "boil", "pasta", "drain", "sauce"]
  },

  // =====================  5 points — Hard  =====================

  {
    id: "Q09",
    topic: "Algorithms",
    qType: "mcq",
    title: "\u2699\ufe0f Even-Odd Machine",
    points: 5,
    prompt:
      "Start with the number 10.\n\n" +
      "Repeat exactly 3 times:\n" +
      "  \u2022 If the number is even \u27a1\ufe0f divide by 2\n" +
      "  \u2022 If the number is odd  \u27a1\ufe0f add 3\n\n" +
      "What is the final number?",
    options: ["4", "5", "6", "7"],
    answerIndex: 0
  },
  {
    id: "Q10",
    topic: "Efficiency",
    qType: "numerical-input",
    title: "\ud83d\udc8e Treasure Hunt",
    points: 5,
    prompt:
      "A robot \ud83e\udd16 searches for a hidden gem \ud83d\udc8e in a row of 32 locked boxes (numbered 1\u201332).\n\n" +
      "Each time it opens a box, it is told:\n" +
      "  \u2b05\ufe0f  \u201cThe gem is in a LOWER-numbered box\u201d\n" +
      "  \u27a1\ufe0f  \u201cThe gem is in a HIGHER-numbered box\u201d\n" +
      "  \ud83c\udf89  \u201cFOUND IT!\u201d\n\n" +
      "The robot always checks the middle box of the remaining range.\n\n" +
      "In the WORST case, how many boxes must the robot open?",
    expectedAnswer: 5
  },
  {
    id: "Q11",
    topic: "Data Types",
    qType: "drag-and-drop",
    title: "\ud83c\udccf Ricca Card Challenge",
    points: 5,
    prompt:
      "Barbara collects monster cards \ud83c\udccf\n" +
      "A card shows properties like the monster\u2019s name, a number, or whether it has teeth.\n\n" +
      "Assign each property to its correct data type.\n" +
      "Drag the items to the matching boxes.",
    draggableItems: [
      { id: "prop-1", text: "Has decimals" },
      { id: "prop-2", text: "True or False" },
      { id: "prop-3", text: "Whole numbers" },
      { id: "prop-4", text: "Text characters" }
    ],
    dropTargets: [
      { id: "target-1", text: "Integer" },
      { id: "target-2", text: "Float" },
      { id: "target-3", text: "Boolean" },
      { id: "target-4", text: "String" }
    ],
    correctMappings: {
      "prop-3": "target-1",
      "prop-1": "target-2",
      "prop-2": "target-3",
      "prop-4": "target-4"
    }
  },
  {
    id: "Q12",
    topic: "Logic",
    qType: "grid-selection",
    title: "\u26f5 Beaver Tom\u2019s Parking",
    points: 5,
    prompt:
      "Beaver Tom \ud83e\uddab helps park boats \u26f5 in a water park.\n" +
      "He needs to find spaces for a boat that wants to stay for 2 days in a row (Fri\u2013Sat or Sat\u2013Sun).\n\n" +
      "The grid shows which spaces are FREE or BOOKED.\n\n" +
      "Click ALL the FREE cells that are part of a 2-consecutive-day free block.",
    grid: [
      ["", "Friday", "Saturday", "Sunday"],
      ["Space 1", "FREE", "BOOKED", "FREE"],
      ["Space 2", "BOOKED", "FREE", "FREE"],
      ["Space 3", "FREE", "FREE", "BOOKED"]
    ],
    selectableItems: [
      "space1-friday", "space1-sunday",
      "space2-saturday", "space2-sunday",
      "space3-friday", "space3-saturday"
    ],
    correctAnswers: ["space2-saturday", "space2-sunday", "space3-friday", "space3-saturday"]
  },

  // =====================  6 points — Hardest  =====================

  {
    id: "Q13",
    topic: "Graphs",
    qType: "mcq",
    title: "\ud83d\uddfa\ufe0f Cheapest Route",
    points: 6,
    prompt:
      "A delivery bot \ud83e\udd16 can travel between locations.\n" +
      "Each path has a cost in minutes (shown on the edges).\n\n" +
      "What is the cheapest cost from A to D?",
    illustration:
      '<svg viewBox="0 0 260 160" width="280" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:10px 0">' +
        '<defs><marker id="a13" viewBox="0 0 10 6" refX="9" refY="3" markerWidth="7" markerHeight="5" orient="auto"><path d="M0,0L10,3L0,6z" fill="#64748b"/></marker></defs>' +
        '<line x1="58" y1="72" x2="103" y2="35" stroke="#64748b" stroke-width="2" marker-end="url(#a13)"/>' +
        '<rect x="63" y="40" width="20" height="16" rx="4" fill="#fef3c7"/><text x="73" y="50" text-anchor="middle" dominant-baseline="central" fill="#92400e" font-weight="bold" font-size="12" font-family="system-ui">2</text>' +
        '<line x1="58" y1="88" x2="103" y2="125" stroke="#64748b" stroke-width="2" marker-end="url(#a13)"/>' +
        '<rect x="63" y="102" width="20" height="16" rx="4" fill="#fef3c7"/><text x="73" y="112" text-anchor="middle" dominant-baseline="central" fill="#92400e" font-weight="bold" font-size="12" font-family="system-ui">6</text>' +
        '<line x1="148" y1="28" x2="193" y2="72" stroke="#64748b" stroke-width="2" marker-end="url(#a13)"/>' +
        '<rect x="163" y="38" width="20" height="16" rx="4" fill="#fef3c7"/><text x="173" y="48" text-anchor="middle" dominant-baseline="central" fill="#92400e" font-weight="bold" font-size="12" font-family="system-ui">7</text>' +
        '<line x1="148" y1="132" x2="193" y2="88" stroke="#64748b" stroke-width="2" marker-end="url(#a13)"/>' +
        '<rect x="163" y="106" width="20" height="16" rx="4" fill="#fef3c7"/><text x="173" y="116" text-anchor="middle" dominant-baseline="central" fill="#92400e" font-weight="bold" font-size="12" font-family="system-ui">3</text>' +
        '<line x1="128" y1="48" x2="128" y2="110" stroke="#64748b" stroke-width="2" marker-end="url(#a13)"/>' +
        '<rect x="132" y="70" width="20" height="16" rx="4" fill="#fef3c7"/><text x="142" y="80" text-anchor="middle" dominant-baseline="central" fill="#92400e" font-weight="bold" font-size="12" font-family="system-ui">1</text>' +
        '<circle cx="40" cy="80" r="22" fill="#3b82f6"/><text x="40" y="82" text-anchor="middle" dominant-baseline="central" fill="#fff" font-weight="bold" font-size="16" font-family="system-ui">A</text>' +
        '<circle cx="128" cy="25" r="22" fill="#3b82f6"/><text x="128" y="27" text-anchor="middle" dominant-baseline="central" fill="#fff" font-weight="bold" font-size="16" font-family="system-ui">B</text>' +
        '<circle cx="128" cy="135" r="22" fill="#3b82f6"/><text x="128" y="137" text-anchor="middle" dominant-baseline="central" fill="#fff" font-weight="bold" font-size="16" font-family="system-ui">C</text>' +
        '<circle cx="218" cy="80" r="22" fill="#ef4444"/><text x="218" y="82" text-anchor="middle" dominant-baseline="central" fill="#fff" font-weight="bold" font-size="16" font-family="system-ui">D</text>' +
      '</svg>',
    options: ["6 min", "7 min", "9 min", "12 min"],
    answerIndex: 0
  },
  {
    id: "Q14",
    topic: "Invariants",
    qType: "mcq",
    title: "\u2b1c\u2b1b Colour Flips",
    points: 6,
    prompt:
      "You have 6 tiles in a row, all WHITE \u2b1c\n" +
      "One move flips exactly 2 neighbouring tiles (\u2b1c\u2194\u2b1b).\n\n" +
      "After any number of moves, which situation is IMPOSSIBLE?",
    illustration:
      '<div style="margin:10px 0;line-height:1.8">' +
        '<div style="font-size:22px;letter-spacing:6px">\u2b1c\u2b1c\u2b1c\u2b1c\u2b1c\u2b1c <span style="font-size:13px;color:#666;letter-spacing:0">\u2190 Start</span></div>' +
        '<div style="font-size:13px;color:#666;margin:2px 0">Example \u2014 flip tiles 3 & 4:</div>' +
        '<div style="font-size:22px;letter-spacing:6px">\u2b1c\u2b1c\u2b1b\u2b1b\u2b1c\u2b1c <span style="font-size:13px;color:#666;letter-spacing:0">\u2190 After 1 move</span></div>' +
      '</div>',
    options: [
      "0 black tiles",
      "1 black tile",
      "2 black tiles",
      "4 black tiles"
    ],
    answerIndex: 1
  },
  {
    id: "Q15",
    topic: "Cryptography",
    qType: "mcq",
    title: "\ud83d\udd10 Shift Message",
    points: 6,
    prompt:
      "A secret message \ud83d\udd10 uses this rule:\n" +
      "A\u2192D,  B\u2192E,  C\u2192F,  \u2026  (each letter shifts forward by 3)\n\n" +
      "The coded word is:  KHOOR\n\n" +
      "What is the original word?",
    options: ["HELLO", "KELLY", "HOLLY", "KHOOR"],
    answerIndex: 0
  }
];
