export const pricingPlans = [
  {
    name: 'Starter',
    price: 0,
    period: 'forever',
    description: 'For individual real-time analysis',
    features: [
      'Browser-based live sessions',
      'Camera and microphone signal scoring',
      'Local session history',
      'Text report exports',
      'No backend required',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Professional',
    price: 49,
    period: 'month',
    description: 'For creators and researchers',
    features: [
      'Unlimited local sessions',
      'Advanced signal dashboard',
      'Engagement recommendations',
      'Session comparison',
      'Report downloads',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    period: 'month',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Team review workflow',
      'Admin analytics',
      'Backend integration path',
      'SSO-ready architecture',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const futureVisions = [
  {
    icon: 'infrastructure',
    title: 'Engagement Infrastructure',
    horizon: 'Every digital room becomes measurable.',
    description: 'Teams will understand attention, confidence, and participation as live operational signals instead of post-meeting guesses.',
    pulse: 'Workflows',
  },
  {
    icon: 'business',
    title: 'Smarter Business Decisions',
    horizon: 'Meetings turn into momentum maps.',
    description: 'Sales, training, research, and leadership teams can see where energy rises, where clarity drops, and where action should happen next.',
    pulse: 'Strategy',
  },
  {
    icon: 'brand',
    title: 'Brand Engagement Engines',
    horizon: 'Audiences stop being anonymous.',
    description: 'Brands can shape launches, demos, and stories around real attention patterns while respecting privacy and transparent measurement.',
    pulse: 'Growth',
  },
  {
    icon: 'collaboration',
    title: 'Collaborative Feedback Loops',
    horizon: 'Feedback arrives while it still matters.',
    description: 'Creators, educators, and teams get live guidance that helps them adapt tone, pacing, and delivery in the moment.',
    pulse: 'Live',
  },
];

export const useCases = [
  {
    icon: 'creator',
    title: 'Creators Who Command the Room',
    kicker: 'Record sharper. Present stronger.',
    description: 'Tune your framing, voice energy, and attention flow so every session lands with confidence.',
  },
  {
    icon: 'education',
    title: 'Learning That Stays Alive',
    kicker: 'Keep focus in motion.',
    description: 'Spot attention dips during study, tutoring, or remote classes and adjust before momentum fades.',
  },
  {
    icon: 'research',
    title: 'Research With Real Signals',
    kicker: 'See the moment clearly.',
    description: 'Capture attention, focus stability, and signal confidence while conversations are still fresh.',
  },
  {
    icon: 'people',
    title: 'People Teams With Better Readouts',
    kicker: 'Review with clarity.',
    description: 'Use session quality, voice activity, and participation patterns to support structured interviews.',
  },
  {
    icon: 'marketing',
    title: 'Pitches With More Pulse',
    kicker: 'Find the parts that spark.',
    description: 'Measure real-time attention and voice interaction while rehearsing presentations or testing pitches.',
  },
  {
    icon: 'student',
    title: 'Students Building Deep Focus',
    kicker: 'Train your best study state.',
    description: 'Watch focus stability and session quality during deep work blocks, then improve the next round.',
  },
];
