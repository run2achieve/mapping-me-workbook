import { ReflectionWorkbookConfig } from "./ReflectionWorkbookApp";

export const discoveringMyValuesConfig: ReflectionWorkbookConfig = {
  storageKey: "mapping-me-discovering-my-values",
  title: "Discovering My Values",
  eyebrow: "Mapping Me",
  description: "A gentle workbook for noticing what matters, what drains, and what feels worth protecting.",
  privacyNote: "Your values notes save in this browser on this device. They are not uploaded.",
  cardsTitle: "Small clues about what matters",
  cardsIntro:
    "Values are not homework answers.\nThey often show up in small clues:\nirritation, relief, admiration,\nloyalty, resistance,\nor the tiny things you keep returning to.",
  promptsTitle: "Prompts for noticing values",
  promptsIntro:
    "Use these as starting points. The goal is not to rank your life perfectly; it is to notice what keeps asking for your attention.",
  notesTitle: "A place for unfinished values",
  notesIntro:
    "This page can hold fragments: words that feel important, contradictions, things you are not ready to decide, and values that only appear in certain contexts.",
  noteLabel: "Loose values notes",
  valueBank: {
    title: "Value bank",
    intro:
      "Click a value once for This is my value, click again for Maybe, click a third time to clear it. You can choose as many or as few as you want.",
    categories: [
      {
        id: "basic-wellbeing",
        title: "Basic needs & wellbeing",
        values: [
          "Acceptance",
          "Balance",
          "Calmness",
          "Comfort",
          "Contentment",
          "Health",
          "Hygiene",
          "Peace",
          "Pleasantness",
          "Relaxation",
          "Rest",
          "Security",
          "Serenity",
          "Silence",
          "Simplicity",
          "Stability",
          "Stillness",
          "Tranquility"
        ]
      },
      {
        id: "connection-care",
        title: "Connection & care",
        values: [
          "Affection",
          "Appreciation",
          "Approachability",
          "Availability",
          "Belonging",
          "Benevolence",
          "Camaraderie",
          "Care",
          "Charity",
          "Closeness",
          "Compassion",
          "Connection",
          "Cooperation",
          "Cordiality",
          "Courtesy",
          "Empathy",
          "Encouragement",
          "Family",
          "Friendliness",
          "Generosity",
          "Giving",
          "Helpfulness",
          "Hospitality",
          "Intimacy",
          "Kindness",
          "Love",
          "Loyalty",
          "Sharing",
          "Solidarity",
          "Support",
          "Sympathy",
          "Teamwork",
          "Trust",
          "Warmth"
        ]
      },
      {
        id: "honesty-integrity",
        title: "Honesty, integrity & trust",
        values: [
          "Accuracy",
          "Acknowledgement",
          "Candor",
          "Commitment",
          "Congruency",
          "Correctness",
          "Credibility",
          "Dependability",
          "Dignity",
          "Directness",
          "Discretion",
          "Duty",
          "Fidelity",
          "Frankness",
          "Honesty",
          "Honor",
          "Integrity",
          "Reliability",
          "Respect",
          "Sincerity",
          "Soundness",
          "Thoroughness",
          "Trustworthiness",
          "Truth"
        ]
      },
      {
        id: "justice-impact",
        title: "Justice, access & impact",
        values: [
          "Accessibility",
          "Altruism",
          "Contribution",
          "Diversity",
          "Fairness",
          "Giving",
          "Impartiality",
          "Impact",
          "Justice",
          "Liberation",
          "Making a difference",
          "Philanthropy",
          "Service",
          "Selflessness",
          "Unity",
          "Usefulness",
          "Utility"
        ]
      },
      {
        id: "autonomy-direction",
        title: "Autonomy & self-direction",
        values: [
          "Adaptability",
          "Assertiveness",
          "Assurance",
          "Certainty",
          "Choice",
          "Control",
          "Conviction",
          "Decisiveness",
          "Direction",
          "Firmness",
          "Flexibility",
          "Freedom",
          "Independence",
          "Liberty",
          "Open-mindedness",
          "Openness",
          "Privacy",
          "Proactivity",
          "Self-control",
          "Self-reliance",
          "Willfulness",
          "Willingness"
        ]
      },
      {
        id: "growth-learning",
        title: "Growth, learning & wisdom",
        values: [
          "Awareness",
          "Challenge",
          "Clarity",
          "Clear-mindedness",
          "Consciousness",
          "Curiosity",
          "Depth",
          "Discovery",
          "Education",
          "Experience",
          "Exploration",
          "Fascination",
          "Growth",
          "Guidance",
          "Insightfulness",
          "Inspiration",
          "Intelligence",
          "Intuition",
          "Knowledge",
          "Learning",
          "Mastery",
          "Mindfulness",
          "Open-mindedness",
          "Perceptiveness",
          "Reflection",
          "Understanding",
          "Vision",
          "Wisdom",
          "Wonder"
        ]
      },
      {
        id: "creativity-expression",
        title: "Creativity, play & expression",
        values: [
          "Amusement",
          "Articulacy",
          "Beauty",
          "Charm",
          "Creativity",
          "Delight",
          "Dreaming",
          "Elegance",
          "Enjoyment",
          "Entertainment",
          "Expressiveness",
          "Fashion",
          "Flow",
          "Fun",
          "Grace",
          "Humor",
          "Imagination",
          "Originality",
          "Outlandishness",
          "Passion",
          "Playfulness",
          "Pleasure",
          "Recreation",
          "Silliness",
          "Spontaneity",
          "Surprise",
          "Uniqueness",
          "Variety",
          "Wittiness"
        ]
      },
      {
        id: "energy-adventure",
        title: "Energy, courage & adventure",
        values: [
          "Activeness",
          "Adventure",
          "Agility",
          "Alertness",
          "Ambition",
          "Audacity",
          "Boldness",
          "Bravery",
          "Buoyancy",
          "Courage",
          "Daring",
          "Determination",
          "Drive",
          "Dynamism",
          "Eagerness",
          "Energy",
          "Enthusiasm",
          "Excitement",
          "Exhilaration",
          "Fearlessness",
          "Fierceness",
          "Fortitude",
          "Heroism",
          "Intensity",
          "Intrepidness",
          "Liveliness",
          "Nerve",
          "Perkiness",
          "Resilience",
          "Resolve",
          "Speed",
          "Spunk",
          "Strength",
          "Vigor",
          "Vitality",
          "Vivacity",
          "Zeal"
        ]
      },
      {
        id: "skill-excellence",
        title: "Skill, excellence & craft",
        values: [
          "Accomplishment",
          "Achievement",
          "Adroitness",
          "Being the best",
          "Brilliance",
          "Capability",
          "Carefulness",
          "Cleverness",
          "Completion",
          "Concentration",
          "Confidence",
          "Dexterity",
          "Diligence",
          "Discipline",
          "Effectiveness",
          "Efficiency",
          "Endurance",
          "Excellence",
          "Expertise",
          "Focus",
          "Industry",
          "Ingenuity",
          "Inventiveness",
          "Meticulousness",
          "Perfection",
          "Precision",
          "Preparedness",
          "Professionalism",
          "Resourcefulness",
          "Rigor",
          "Skillfulness",
          "Success",
          "Thoroughness"
        ]
      },
      {
        id: "order-practicality",
        title: "Order, practicality & stewardship",
        values: [
          "Cleanliness",
          "Consistency",
          "Continuity",
          "Decorum",
          "Economy",
          "Expediency",
          "Financial independence",
          "Frugality",
          "Investing",
          "Neatness",
          "Order",
          "Organization",
          "Practicality",
          "Pragmatism",
          "Prudence",
          "Punctuality",
          "Reason",
          "Reasonableness",
          "Realism",
          "Structure",
          "Temperance",
          "Thrift",
          "Tidiness",
          "Timeliness"
        ]
      },
      {
        id: "recognition-influence",
        title: "Recognition, influence & leadership",
        values: [
          "Affluence",
          "Attractiveness",
          "Celebrity",
          "Charm",
          "Coolness",
          "Dominance",
          "Fame",
          "Leadership",
          "Looking good",
          "Majesty",
          "Persuasiveness",
          "Poise",
          "Polish",
          "Popularity",
          "Potency",
          "Power",
          "Recognition",
          "Refinement",
          "Richness",
          "Significance",
          "Supremacy",
          "Victory",
          "Wealth",
          "Winning"
        ]
      },
      {
        id: "spiritual-meaning",
        title: "Spirituality, meaning & reverence",
        values: [
          "Awe",
          "Devotion",
          "Devoutness",
          "Faith",
          "Holiness",
          "Hopefulness",
          "Humility",
          "Piety",
          "Purity",
          "Religiousness",
          "Reverence",
          "Ritual",
          "Sacredness",
          "Sacrifice",
          "Spirit",
          "Spirituality",
          "Thankfulness",
          "Transcendence",
          "Virtue"
        ]
      }
    ]
  },
  cards: [
    {
      id: "friction",
      title: "Friction can be a clue",
      text: "When something feels wrong, it may be pointing toward a value that is being crowded, rushed, or ignored.",
      notice: "Notice: what kind of situation makes you quietly tense?",
      color: "#EE5A3A"
    },
    {
      id: "relief",
      title: "Relief has information",
      text: "A moment of relief can show what your nervous system, attention, or sense of self has been needing.",
      notice: "Notice: what makes your shoulders drop a little?",
      color: "#166E66"
    },
    {
      id: "protect",
      title: "What you protect",
      text: "The things you defend, save, repair, or make room for often reveal values before you can name them.",
      notice: "Notice: what do you keep making space for?",
      color: "#6B4A9E"
    },
    {
      id: "admire",
      title: "Admiration points somewhere",
      text: "People, places, tools, and communities you admire may carry qualities you want near your own life.",
      notice: "Notice: what do you admire without needing to become it?",
      color: "#F4A82C"
    },
    {
      id: "cost",
      title: "Cost matters",
      text: "A value is allowed to be real even when living it costs energy. The cost is information, not failure.",
      notice: "Notice: which values need support, pacing, or boundaries?",
      color: "#FF8FB1"
    },
    {
      id: "season",
      title: "What matters can shift",
      text: "Some values stay steady. Others become more important in certain seasons, relationships, bodies, or environments.",
      notice: "Notice: what matters more right now than it used to?",
      color: "#335F55"
    }
  ],
  prompts: [
    {
      id: "hard-no",
      title: "The hard no",
      prompt: "When you feel a strong no, what might that no be trying to protect?",
      examples: ["Fairness", "Autonomy", "Rest", "Privacy", "Precision", "A slower pace"]
    },
    {
      id: "tiny-loyalty",
      title: "Tiny loyalty",
      prompt: "What small thing do you keep doing because it feels right, even if nobody notices?",
      examples: ["Checking on someone", "Keeping a ritual", "Making things accurate", "Leaving space", "Choosing comfort"]
    },
    {
      id: "worth-the-cost",
      title: "Worth the cost",
      prompt: "Which values still feel worth choosing, even when they take extra energy, time, courage, or consequences?",
      examples: ["Honesty", "Creativity", "Justice", "Care", "Freedom", "Learning"]
    },
    {
      id: "ordinary-good",
      title: "Ordinary good",
      prompt: "Think of a day that was not perfect but felt more like yours. What values were present?",
      examples: ["Enough quiet", "Useful work", "Honest conversation", "Choice", "Play", "Clear expectations"]
    },
    {
      id: "admired-values",
      title: "Values I notice in others",
      prompt: "What values do you admire in other people that you might also want more of in your own life?",
      examples: ["Courage", "Kindness", "Freedom", "Creativity", "Calm", "Honesty"]
    }
  ]
};

export const exploringIdentityBeliefsConfig: ReflectionWorkbookConfig = {
  storageKey: "mapping-me-exploring-identity-beliefs",
  title: "Exploring Identity & Beliefs",
  eyebrow: "Mapping Me",
  description: "A workbook for gently exploring self-stories, roles, belonging, and beliefs that may still be changing.",
  privacyNote: "Your identity notes save in this browser on this device. They are not uploaded.",
  cardsTitle: "Identity as a living map",
  cardsIntro:
    "Identity does not need to become one polished sentence. It can be a map of roles, histories, communities, needs, boundaries, and beliefs in motion.",
  promptsTitle: "Prompts for identity and belief",
  promptsIntro:
    "These prompts are invitations, not a demand for certainty. Let contradictions sit on the page without forcing them to resolve.",
  notesTitle: "A place for becoming",
  notesIntro:
    "Use this space for words you are trying on, stories you are questioning, and beliefs that feel supportive, outdated, or still forming.",
  noteLabel: "Loose identity and belief notes",
  cards: [
    {
      id: "many-rooms",
      title: "Many rooms",
      text: "You may feel different in different rooms. That can be information about safety, language, sensory load, and expectation.",
      notice: "Notice: where do you feel more like yourself?",
      color: "#C85C43"
    },
    {
      id: "old-story",
      title: "Old stories leave marks",
      text: "Some self-beliefs began as survival strategies, feedback, labels, or repeated misunderstandings.",
      notice: "Notice: which belief sounds older than you feel now?",
      color: "#335F55"
    },
    {
      id: "belonging",
      title: "Belonging can be specific",
      text: "Belonging may not mean fitting everywhere. It may mean finding places where fewer parts of you need to disappear.",
      notice: "Notice: what parts of you get more room with certain people?",
      color: "#8E6A89"
    },
    {
      id: "mask",
      title: "Masks are information",
      text: "A mask may have helped you get through. Exploring it does not require shame or a sudden reveal.",
      notice: "Notice: what does the mask protect, hide, or make possible?",
      color: "#D6A33E"
    },
    {
      id: "both-and",
      title: "Both can be true",
      text: "Identity often includes both-and: proud and tired, capable and supported, private and connected, certain and unsure.",
      notice: "Notice: which two truths need to sit side by side?",
      color: "#6B4A9E"
    },
    {
      id: "chosen-language",
      title: "Chosen language",
      text: "The words you use for yourself can be precise, temporary, playful, clinical, cultural, private, or shared.",
      notice: "Notice: which words feel spacious, and which feel too tight?",
      color: "#EE5A3A"
    }
  ],
  prompts: [
    {
      id: "self-story",
      title: "A self-story I inherited",
      prompt: "What is a story about you that you did not fully choose? What parts still help, and what parts feel too small?",
      examples: ["Too sensitive", "Independent", "Difficult", "Gifted", "Quiet", "Responsible", "A lot"]
    },
    {
      id: "belief-body",
      title: "Where beliefs live",
      prompt: "When you say a belief about yourself, what happens in your body: softening, bracing, blankness, heat, curiosity?",
      examples: ["I need to earn rest", "I am allowed support", "I am too much", "I can take up space"]
    },
    {
      id: "community",
      title: "Community signals",
      prompt: "What tells you that a space, group, or relationship has room for your real needs?",
      examples: ["Direct communication", "Low pressure", "Shared humor", "Sensory respect", "Repair after mistakes"]
    },
    {
      id: "trying-on",
      title: "Trying on language",
      prompt: "Which words, labels, or descriptions are you curious about trying on without committing forever?",
      examples: ["Neurodivergent", "Disabled", "Sensitive", "Creative", "System thinker", "Private", "In progress"]
    }
  ]
};

export const checkingInWithMyBodyConfig: ReflectionWorkbookConfig = {
  storageKey: "mapping-me-checking-in-with-my-body",
  title: "Checking-In With My Body",
  eyebrow: "Mapping Me",
  description: "A workbook for gently noticing body signals, energy, sensory load, and needs without turning them into a test.",
  privacyNote: "Your body check-in notes save in this browser on this device. They are not uploaded.",
  cardsTitle: "Body signals as messages",
  cardsIntro:
    "Body check-ins are not about doing them perfectly. They are a way to notice signals that may arrive quietly, late, loudly, or all at once.",
  promptsTabLabel: "Body needs scan",
  promptsTitle: "Body needs scan",
  promptsIntro:
    "When you feel off but cannot tell why, scan a few body basics before trying to explain everything.",
  notesTabLabel: "Body cues",
  notesTitle: "Body cues I notice",
  notesIntro:
    "Save body cues you notice over time: sensations, patterns, needs, triggers, or small things that helped.",
  noteLabel: "What cue did you notice?",
  noteEntries: {
    addButtonLabel: "Add a body cue",
    entryTitle: "Body cue",
    placeholder: "Example: tight jaw, heavy eyes, restless legs, stomach drop, shallow breathing...",
    detailLabel: "My insights",
    detailPlaceholder: "What did you learn about this cue? What might it need? What helps when it shows up?",
    emptyText: "No body cues saved yet."
  },
  cards: [
    {
      id: "signal-volume",
      title: "Signal volume changes",
      text: "Some body signals whisper until they suddenly shout. Late noticing is a pattern to work with, not a character flaw.",
      notice: "Notice: which signals tend to arrive late?",
      color: "#166E66"
    },
    {
      id: "neutral-body",
      title: "Neutral counts",
      text: "A check-in does not need to find a problem. Neutral, okay, blank, or hard to tell are all valid readings.",
      notice: "Notice: what does okay feel like, if anything?",
      color: "#D6A33E"
    },
    {
      id: "body-context",
      title: "Context shapes the body",
      text: "Light, sound, hunger, temperature, pressure, people, transitions, and uncertainty can all change body messages.",
      notice: "Notice: what changed around you before the body changed?",
      color: "#EE5A3A"
    },
    {
      id: "micro-need",
      title: "Micro-needs matter",
      text: "Small needs are easier to miss: water, posture, texture, bathroom, fresh air, movement, quiet, or a pause.",
      notice: "Notice: what small adjustment would make this moment 5 percent easier?",
      color: "#FF8FB1"
    },
    {
      id: "energy-shape",
      title: "Body and brain talk",
      text: "Your body can affect your thoughts, focus, and mood. Hunger, tension, noise, pain, or rest can change what your brain has available.",
      notice: "Notice: what might your body be telling your brain right now?",
      color: "#6B4A9E"
    },
    {
      id: "permission",
      title: "Permission to respond",
      text: "A body signal does not have to be extreme before it deserves a response.",
      notice: "Notice: what would you do if the signal already counted?",
      color: "#335F55"
    }
  ],
  checklist: {
    categories: [
      {
        id: "basic-needs",
        title: "Basic needs",
        items: [
          { id: "body-hungry", label: "I might be hungry" },
          { id: "body-thirsty", label: "I might be thirsty" },
          { id: "body-bathroom", label: "I may need the bathroom" }
        ]
      },
      {
        id: "rest",
        title: "Rest and substances",
        items: [
          { id: "body-sleepy", label: "I feel sleepy, heavy, or mentally tired" },
          { id: "body-caffeine", label: "Caffeine or sugar might be affecting me" },
          { id: "body-alcohol", label: "Alcohol might be affecting me" }
        ]
      },
      {
        id: "body-state",
        title: "Body state and health",
        items: [
          { id: "body-temperature", label: "I am too hot or too cold" },
          { id: "body-medication", label: "Medication may be affecting me" },
          { id: "body-illness", label: "Illness, allergies, or hormones may be affecting me" }
        ]
      },
      {
        id: "pain-movement",
        title: "Pain and movement",
        items: [
          { id: "body-pain", label: "Something hurts" },
          { id: "body-jaw-shoulders", label: "My jaw, neck, or shoulders feel tight" },
          { id: "body-need-walk", label: "I may need to change position, stretch, or walk" }
        ]
      },
      {
        id: "mood-body",
        title: "Emotion or sensory load",
        items: [
          { id: "body-mood-off", label: "My mood feels off, even if I cannot name why" },
          { id: "body-overwhelmed", label: "I feel overwhelmed or close to shutting down" },
          { id: "body-sensory", label: "Noise, light, texture, or crowding feels like too much" }
        ]
      }
    ]
  },
  prompts: []
};

export const processingMyEmotionsConfig: ReflectionWorkbookConfig = {
  storageKey: "mapping-me-processing-my-emotions",
  title: "Processing My Emotions",
  eyebrow: "Mapping Me",
  description: "A workbook for noticing emotions, making room for mixed feelings, and finding gentle ways to respond.",
  privacyNote: "Your emotion notes save in this browser on this device. They are not uploaded.",
  cardsTitle: "Emotions as information, not instructions",
  cardsIntro:
    "An emotion can be real without being the whole story. This workbook is for making space around feelings before deciding what they mean.",
  promptsTitle: "Prompts for emotional processing",
  promptsIntro:
    "Use these prompts slowly. The aim is not to fix the feeling quickly; it is to notice its shape, context, message, and possible next support.",
  notesTitle: "A place for emotional weather",
  notesIntro:
    "This space can hold contradictions, body clues, unfinished sentences, and feelings that do not yet have clean names.",
  noteLabel: "Loose emotion notes",
  cards: [
    {
      id: "name-lightly",
      title: "Name it lightly",
      text: "A feeling name can be a temporary label, not a final diagnosis of the moment.",
      notice: "Notice: does the label make more room or make the feeling tighter?",
      color: "#EE5A3A"
    },
    {
      id: "mixed-feelings",
      title: "Mixed feelings count",
      text: "Relief and grief, anger and care, excitement and dread can sit in the same room.",
      notice: "Notice: which two feelings are both asking to be believed?",
      color: "#6B4A9E"
    },
    {
      id: "body-entry",
      title: "The body may know first",
      text: "Emotion can arrive as heat, pressure, restlessness, tears, blankness, or a sudden need to leave.",
      notice: "Notice: where did the feeling show up before it had words?",
      color: "#166E66"
    },
    {
      id: "aftershock",
      title: "Aftershocks are real",
      text: "Some emotions arrive after the event, once there is enough safety or quiet to feel them.",
      notice: "Notice: what are you feeling later that you could not feel then?",
      color: "#F4A82C"
    },
    {
      id: "signal-not-command",
      title: "Signal, not command",
      text: "A feeling may point toward a need, boundary, loss, value, or fear. It does not have to choose your action alone.",
      notice: "Notice: what might this feeling be protecting or requesting?",
      color: "#FF8FB1"
    },
    {
      id: "small-response",
      title: "Small response",
      text: "Processing can be a glass of water, a note, a pause, a message draft, a walk, or letting the feeling be witnessed.",
      notice: "Notice: what would help the feeling move one inch?",
      color: "#335F55"
    }
  ],
  prompts: [
    {
      id: "feeling-shape",
      title: "Feeling shape",
      prompt: "If this emotion had a shape, texture, speed, color, or temperature, what would it be?",
      examples: ["Sharp", "Heavy", "Hot", "Foggy", "Buzzing", "Flat", "Tangled", "Softening"]
    },
    {
      id: "before-during-after",
      title: "Before, during, after",
      prompt: "What was happening before the feeling appeared, while it was strongest, and after it shifted?",
      examples: ["A transition", "Too much noise", "A message", "A misunderstanding", "A memory", "A deadline"]
    },
    {
      id: "need-underneath",
      title: "Need underneath",
      prompt: "What need might be sitting underneath this feeling, even if the need is not easy to meet right now?",
      examples: ["Rest", "Repair", "Clarity", "Control", "Comfort", "Privacy", "Reassurance", "Justice"]
    },
    {
      id: "safe-expression",
      title: "Safe expression",
      prompt: "What is one way this feeling could be expressed without turning into harm, pressure, or performance?",
      examples: ["Write a messy note", "Move", "Cry", "Draw", "Say one sentence", "Ask for space", "Use humor carefully"]
    }
  ]
};

export const exploringBoundariesConfig: ReflectionWorkbookConfig = {
  storageKey: "mapping-me-exploring-boundaries",
  title: "Exploring Boundaries",
  eyebrow: "Mapping Me",
  description: "A workbook for noticing limits, access needs, consent, recovery, and what helps relationships stay workable.",
  privacyNote: "Your boundary notes save in this browser on this device. They are not uploaded.",
  cardsTitle: "Boundaries as care for access",
  cardsIntro:
    "Boundaries are not only hard lines. They can be pacing, clarity, sensory needs, communication preferences, recovery time, and consent.",
  promptsTitle: "Prompts for exploring boundaries",
  promptsIntro:
    "These prompts help you notice where a boundary may already exist in your body, behavior, energy, or resentment before it has language.",
  notesTitle: "A place for limits and room",
  notesIntro:
    "Use this space for boundary drafts, scripts, patterns, and the places where you are still learning what feels possible.",
  noteLabel: "Loose boundary notes",
  cards: [
    {
      id: "body-no",
      title: "The body no",
      text: "A boundary may show up as tension, delay, avoidance, shutdown, irritation, or a wish to disappear.",
      notice: "Notice: what does your early no feel like?",
      color: "#C85C43"
    },
    {
      id: "access",
      title: "Access needs are boundaries",
      text: "Needing clarity, quiet, time, direct language, or fewer transitions can be a boundary, not a preference to apologize for.",
      notice: "Notice: what condition makes participation more possible?",
      color: "#335F55"
    },
    {
      id: "yes-with-shape",
      title: "A yes can have shape",
      text: "Yes might mean yes for one hour, yes with notice, yes by text, yes if I can leave, or yes after I rest.",
      notice: "Notice: what shape would make your yes more honest?",
      color: "#D6A33E"
    },
    {
      id: "resentment-clue",
      title: "Resentment is a clue",
      text: "Resentment can point to an overextended yes, an unclear agreement, or a need that has been ignored too long.",
      notice: "Notice: where are you repeatedly giving past capacity?",
      color: "#6B4A9E"
    },
    {
      id: "repair",
      title: "Boundaries can include repair",
      text: "A boundary can protect a relationship by making expectations more visible and less dependent on guessing.",
      notice: "Notice: what would be easier if it were named earlier?",
      color: "#EE5A3A"
    },
    {
      id: "private-boundaries",
      title: "Private boundaries count",
      text: "Not every boundary needs an announcement. Some are choices about pacing, exposure, information, and recovery.",
      notice: "Notice: what boundary could be practiced quietly first?",
      color: "#8E6A89"
    }
  ],
  prompts: [
    {
      id: "capacity",
      title: "Capacity boundary",
      prompt: "Where do you often say yes before checking whether you have enough capacity?",
      examples: ["Time", "Social energy", "Sensory load", "Executive function", "Emotional labor", "Travel", "Messaging"]
    },
    {
      id: "communication",
      title: "Communication boundary",
      prompt: "What communication conditions help you stay clear, honest, and less overloaded?",
      examples: ["Text first", "Direct wording", "No surprise calls", "Time to answer", "Written details", "A clear ask"]
    },
    {
      id: "script",
      title: "Boundary script",
      prompt: "What is a sentence you could try that is specific, kind enough, and not over-explained?",
      examples: ["I need more notice", "I can do X, not Y", "I need to leave by 8", "Please send that in writing"]
    },
    {
      id: "aftercare",
      title: "Aftercare",
      prompt: "After a boundary is set, what support might help your body believe it was allowed?",
      examples: ["Quiet", "Reassurance", "Movement", "A note to self", "Food", "A trusted person", "No immediate re-entry"]
    }
  ]
};

export const whatILoveAboutMyselfConfig: ReflectionWorkbookConfig = {
  storageKey: "mapping-me-what-i-love-about-myself",
  title: "What I Love About Myself",
  eyebrow: "Mapping Me",
  description: "A workbook for noticing self-appreciation through tenderness, specificity, humor, survival, and everyday evidence.",
  privacyNote: "Your self-appreciation notes save in this browser on this device. They are not uploaded.",
  cardsTabLabel: "Things I like",
  cardsTitle: "Things I like about myself",
  cardsIntro:
    "Loving something about yourself does not have to sound grand. It can be specific, quiet, funny, practical, uncertain, or still growing.",
  promptsTabLabel: "Reflection prompts",
  promptsTitle: "Prompts for self-appreciation",
  promptsIntro:
    "Use these prompts to gather evidence gently. You do not need to become confident on command.",
  notesTabLabel: "Past moments",
  notesTitle: "Moments I still remember",
  notesIntro:
    "Write down something from the past that still makes you feel warm, moved, strong, brave, kind, or glad you were you.",
  noteLabel: "What happened, and what did you do that still feels impressive?",
  noteEntries: {
    addButtonLabel: "Add a memory",
    entryTitle: "Memory",
    placeholder: "Maybe it was years ago. What happened? What did you do? What did it take from you? Why does it still feel impressive now?",
    emptyText: "No older proof saved yet."
  },
  moments: {
    tabLabel: "Recent moments",
    title: "Recent moments I liked myself",
    intro: "Collect recent moments when you felt proud of yourself, glad you were you, or quietly impressed by what you did.",
    momentLabel: "What happened?",
    reasonLabel: "What did it show you about yourself?",
    momentPlaceholder: "A recent moment, tiny or big...",
    reasonPlaceholder: "What did this show about you?",
    addButtonLabel: "Add a moment",
    saveJpgLabel: "Save moments JPG",
    emptyText: "No moments saved yet."
  },
  cards: [
    {
      id: "specific",
      title: "Specific is stronger",
      text: "A specific appreciation can feel more believable than a huge statement. For example: I explain things clearly, I notice when a room feels off, I make people laugh, or I keep trying.",
      notice: "Notice: what is one specific thing you like about how you are?",
      color: "#FF8FB1"
    },
    {
      id: "survival",
      title: "Survival has skill in it",
      text: "Some parts of you formed to get through hard conditions. They may deserve respect, care, and a better place to exist.",
      notice: "Notice: what helped you survive, adapt, or keep going?",
      color: "#335F55"
    },
    {
      id: "joy",
      title: "What you keep choosing",
      text: "The things you return to can show what matters to you. Maybe you keep choosing art, fairness, learning, comfort, honesty, beauty, people, or quiet.",
      notice: "Notice: what do you keep choosing, and what do you like about that part of you?",
      color: "#F4A82C"
    },
    {
      id: "weird-good",
      title: "Very you, in a good way",
      text: "Maybe there is a specific habit, preference, joke, routine, or way of doing things that feels very you. It does not have to make sense to everyone.",
      notice: "Notice: what is one very you thing you actually like?",
      color: "#6B4A9E"
    },
    {
      id: "care",
      title: "What you do for people",
      text: "When someone matters to you, what do you do? Maybe you bring food, help solve a problem, stay with them, or say the honest thing kindly.",
      notice: "Notice: what is one specific thing you have done for someone?",
      color: "#EE5A3A"
    },
    {
      id: "not-useful",
      title: "Not everything needs to be useful",
      text: "You can like parts of yourself that are not about achievement: your laugh, softness, dramatic reactions, daydreaming, or tiny joys.",
      notice: "Notice: what part of you do you like, even if it is not useful or impressive?",
      color: "#166E66"
    }
  ],
  prompts: []
};

export const myGettingStartedToolkitConfig: ReflectionWorkbookConfig = {
  storageKey: "mapping-me-my-getting-started-toolkit",
  title: "My Getting-Started Toolkit",
  eyebrow: "Mapping Me",
  description: "A workbook for collecting small tools that help tasks begin when starting feels sticky, foggy, or blocked.",
  privacyNote: "Your getting-started toolkit saves in this browser on this device. It is not uploaded.",
  cardsTitle: "Tools for crossing the start line",
  cardsIntro:
    "Starting is not always about motivation. Sometimes it needs less friction, a smaller first move, body support, clearer edges, or permission to begin badly.",
  promptsTitle: "Prompts for building the toolkit",
  promptsIntro:
    "Use these prompts to collect tools that actually help you start. Tiny, specific, repeatable tools are more useful than perfect plans.",
  notesTitle: "A place for start-up tools",
  notesIntro:
    "This space can hold scripts, rituals, first steps, friction points, body supports, and reminders that help you move from stuck to started.",
  noteLabel: "Loose getting-started toolkit notes",
  cards: [
    {
      id: "make-it-smaller",
      title: "Make it smaller than small",
      text: "The first step may need to be almost silly: open the file, put shoes near the door, write the title, touch the laundry basket.",
      notice: "Tool idea: what is the first visible action under two minutes?",
      color: "#EE5A3A"
    },
    {
      id: "lower-the-threshold",
      title: "Lower the threshold",
      text: "Starting can get easier when the setup is already waiting: tabs open, materials visible, water nearby, timer ready, instructions found.",
      notice: "Tool idea: what can be prepared before the hard moment?",
      color: "#F4A82C"
    },
    {
      id: "body-first",
      title: "Body first",
      text: "Sometimes the brain cannot start until the body has enough signal: movement, pressure, food, sound, quiet, temperature, or posture.",
      notice: "Tool idea: what body input helps you enter the task?",
      color: "#166E66"
    },
    {
      id: "permission-version",
      title: "The permission version",
      text: "A rough, partial, ugly, private, or ten-minute version can be a real start. Quality can come later.",
      notice: "Tool idea: what version is allowed to be imperfect?",
      color: "#6B4A9E"
    },
    {
      id: "external-spark",
      title: "External spark",
      text: "A start can come from outside: body doubling, a message, a countdown, a playlist, a calendar block, or a visible cue.",
      notice: "Tool idea: what external signal makes beginning more possible?",
      color: "#FF8FB1"
    },
    {
      id: "define-done-for-now",
      title: "Done for now",
      text: "Starting is easier when stopping is defined. A task can have a tiny finish line: one paragraph, ten dishes, one email draft.",
      notice: "Tool idea: what counts as enough for this round?",
      color: "#335F55"
    }
  ],
  prompts: [
    {
      id: "stuck-shape",
      title: "What kind of stuck is this?",
      prompt: "When you cannot start, what is the shape of the stuckness?",
      examples: ["Too many steps", "Unclear outcome", "Fear of doing it wrong", "No energy", "Boring", "Too big", "Transition is hard"]
    },
    {
      id: "first-move",
      title: "First move library",
      prompt: "For common tasks, what is the smallest first move that usually helps you cross from not-started to started?",
      examples: ["Open document", "Put item on desk", "Set 5-minute timer", "Write a messy list", "Stand up", "Send one text"]
    },
    {
      id: "friction-removal",
      title: "Friction removal",
      prompt: "What gets in the way before the task even begins, and what could remove one piece of friction?",
      examples: ["Find login", "Clear surface", "Choose clothes", "Charge device", "Get instructions", "Reduce noise", "Pick a time"]
    },
    {
      id: "starter-ritual",
      title: "Starter ritual",
      prompt: "What short ritual tells your brain and body that this is the beginning, not the whole task?",
      examples: ["Same playlist", "Tea", "Countdown", "Light change", "Stretch", "Body double", "One sentence plan"]
    },
    {
      id: "rescue-plan",
      title: "When I get stuck again",
      prompt: "If you freeze halfway through starting, what is the rescue plan that does not require shame?",
      examples: ["Ask for the next step", "Switch to body task", "Restart timer", "Make it visible", "Take a reset break", "Do the easiest piece"]
    }
  ]
};
