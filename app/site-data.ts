export type ProjectMedia = {
  url: string;
  type: "image" | "video";
  altText: string;
};

export type Program = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  image: string;
  imageAlt: string;
  video: string;
  gallery: ProjectMedia[];
  label: string;
  eyebrow: string;
  lead: string;
  body: string;
  bullets: string[];
  sortOrder: number;
  isPublished?: boolean;
  hasUnpublishedChanges?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export const ramadanIftarEventMedia: ProjectMedia[] = [
  {
    url: "/media/ramadan-iftar-community.webp",
    type: "image",
    altText: "Community members seated together for a shared Iftar meal",
  },
  {
    url: "/media/ramadan-iftar-children.webp",
    type: "image",
    altText:
      "Children seated around a shared Iftar meal before breaking their fast",
  },
  {
    url: "/media/ramadan-iftar-meal.webp",
    type: "image",
    altText:
      "An Iftar plate with chickpeas, fruit, dates, water, and juice",
  },
];

export const programs: Program[] = [
  {
    id: "program-shelter",
    slug: "shelter",
    title: "Shelter Assistance",
    shortTitle: "Shelter",
    summary:
      "Repairing and rebuilding fragile shelters so families have greater safety, privacy, and stability.",
    image: "/media/shelter-complete.webp",
    imageAlt: "A completed bamboo shelter",
    video: "",
    gallery: [
      {
        url: "/media/shelter-progress.webp",
        type: "image",
        altText: "A bamboo shelter under construction",
      },
      {
        url: "/media/shelter-before.webp",
        type: "image",
        altText: "A fragile shelter before rebuilding",
      },
      {
        url: "/media/shelter-interior.webp",
        type: "image",
        altText: "Interior of a completed bamboo shelter",
      },
      {
        url: "/media/shelter-complete.mp4",
        type: "video",
        altText: "Field video of a completed bamboo shelter",
      },
    ],
    label: "Safer homes",
    eyebrow: "Safer homes",
    lead:
      "Fragile shelter leaves families exposed to weather, insecurity, and a daily loss of privacy.",
    body:
      "Our shelter response supports repair and rebuilding with practical local materials. The work shown here moves from an exposed bamboo frame to enclosed walls, a finished floor, and a safer living space.",
    bullets: [
      "Needs-led repair and rebuilding",
      "Locally familiar materials and methods",
      "Privacy, weather protection, and safer living space",
    ],
    sortOrder: 1,
  },
  {
    id: "program-widow-support",
    slug: "widow-support",
    title: "Widow & Family Support",
    shortTitle: "Family support",
    summary:
      "Providing essential household assistance to widows and families facing severe economic hardship.",
    image: "/media/widow-support.webp",
    imageAlt: "A woman receiving a household support package",
    video: "",
    gallery: [],
    label: "Essential assistance",
    eyebrow: "Essential assistance",
    lead:
      "Widows and households without stable income can face acute difficulty meeting basic daily needs.",
    body:
      "This programme provides practical household support with discretion. Assistance is handed directly to recipients, and field documentation is selected to protect dignity.",
    bullets: [
      "Essential household support",
      "Direct, respectful delivery",
      "Privacy-conscious documentation",
    ],
    sortOrder: 2,
  },
  {
    id: "program-medical-support",
    slug: "medical-support",
    title: "Medical Support",
    shortTitle: "Medical care",
    summary:
      "Helping vulnerable patients access urgent treatment and essential care during medical emergencies.",
    image: "/media/medical-support.webp",
    imageAlt: "Both feet of a patient wrapped in medical bandages",
    video: "",
    gallery: [],
    label: "Urgent care",
    eyebrow: "Urgent care",
    lead:
      "A medical emergency can become a financial emergency for a family already living with hardship.",
    body:
      "Medical assistance focuses on urgent, clearly identified needs. Public-facing images are cropped to avoid exposing identity or graphic injury while still documenting that care took place.",
    bullets: [
      "Support during urgent treatment",
      "Attention to clearly identified medical needs",
      "Respectful handling of patient information",
    ],
    sortOrder: 3,
  },
  {
    id: "program-clean-water",
    slug: "clean-water",
    title: "Clean Water",
    shortTitle: "Clean water",
    summary:
      "Improving access to safer, more reliable water through practical community water points.",
    image: "/media/clean-water.webp",
    imageAlt: "Children washing their hands with water from a community hand pump",
    video: "",
    gallery: [],
    label: "Safe water",
    eyebrow: "Safe water",
    lead:
      "Reliable water access supports health, hygiene, and everyday safety for the whole community.",
    body:
      "Our clean-water work focuses on practical community water points that make safer water easier to reach. Field images are framed around the water source and its use, protecting the identity of children wherever possible.",
    bullets: [
      "Practical community water access",
      "Support for daily hygiene and household needs",
      "Privacy-conscious field documentation",
    ],
    sortOrder: 4,
  },
  {
    id: "program-education",
    slug: "education",
    title: "Education Support",
    shortTitle: "Education",
    summary:
      "Supporting basic learning in community classrooms where children can study in a simple, shared space.",
    image: "/media/education-support.webp",
    imageAlt: "Children studying together in a community classroom",
    video: "",
    gallery: [],
    label: "Learning",
    eyebrow: "Learning",
    lead:
      "A simple, welcoming place to learn can give children structure, confidence, and hope.",
    body:
      "Education support helps sustain basic lessons and community learning in modest local classrooms. Alongside basic education, our field records also document Quran and Arabic learning in community settings.",
    bullets: [
      "Basic learning in community classrooms",
      "Support for Quran and Arabic study",
      "Careful protection of children's privacy",
    ],
    sortOrder: 5,
  },
  {
    id: "program-food-assistance",
    slug: "food-assistance",
    title: "Food Assistance",
    shortTitle: "Food support",
    summary:
      "Providing essential food packages and prepared meals to families facing acute hardship.",
    image: "/media/food-assistance.webp",
    imageAlt: "Essential food supplies prepared for distribution",
    video: "",
    gallery: [],
    label: "Essential food",
    eyebrow: "Essential food",
    lead:
      "When household resources are stretched, dependable food support can protect health and ease immediate pressure.",
    body:
      "Our food response includes essential grocery packages and prepared meals, distributed directly and respectfully. Public-facing records focus on the assistance and shared activity rather than exposing individual hardship.",
    bullets: [
      "Essential household food packages",
      "Prepared meals for community needs",
      "Direct and respectful distribution",
    ],
    sortOrder: 6,
  },
  {
    id: "program-qurbani",
    slug: "qurbani",
    title: "Qurbani Meat Distribution",
    shortTitle: "Qurbani",
    summary:
      "Preparing and sharing Qurbani meat with families facing hardship through respectful seasonal distribution.",
    image: "/media/qurbani-distribution.webp",
    imageAlt: "Packaged Qurbani meat portions prepared for distribution",
    video: "",
    gallery: [],
    label: "Seasonal support",
    eyebrow: "Seasonal support",
    lead:
      "Qurbani creates an opportunity to share nourishing food with families who may rarely be able to afford meat.",
    body:
      "Our seasonal response supports careful preparation, portioning, and distribution of Qurbani meat to households facing hardship. Public documentation focuses on packaged family portions rather than slaughter or graphic processing.",
    bullets: [
      "Seasonal Qurbani meat support",
      "Family portions prepared for distribution",
      "Respectful, non-graphic public documentation",
    ],
    sortOrder: 7,
  },
  {
    id: "program-ramadan-iftar",
    slug: "ramadan-iftar",
    title: "Ramadan Iftar & Food Support",
    shortTitle: "Iftar support",
    summary:
      "Providing nourishing Iftar meals and essential Ramadan food support to families facing hardship.",
    image: "/media/ramadan-iftar-support.webp",
    imageAlt:
      "Rice, cooking oil, milk, dates, and other Ramadan food supplies prepared for distribution",
    video: "",
    gallery: [
      {
        url: "/media/ramadan-iftar-supplies.webp",
        type: "image",
        altText:
          "Rice, sugar, cooking oil, milk powder, dates, and other Ramadan supplies arranged before packing",
      },
      {
        url: "/media/ramadan-iftar-packages.webp",
        type: "image",
        altText:
          "Prepared Ramadan food packages ready for distribution to families",
      },
      ...ramadanIftarEventMedia,
    ],
    label: "Ramadan support",
    eyebrow: "Ramadan support",
    lead:
      "For families living with hardship, the cost of a nourishing Iftar and essential Ramadan food can be difficult to meet.",
    body:
      "Our Ramadan Iftar programme provides prepared meals and essential food support to vulnerable families and individuals. Assistance is organised and delivered respectfully, with public documentation focused on the food and distribution process rather than personal hardship.",
    bullets: [
      "Nourishing Iftar meals during Ramadan",
      "Essential Ramadan food packages for families",
      "Direct distribution with dignity and care",
    ],
    sortOrder: 8,
  },
];

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  contentType: string;
  size: number;
  altText: string;
  createdAt: string;
  isProtected?: boolean;
};

export const originalMedia: MediaItem[] = [
  {
    id: "original-shelter-complete",
    name: "Completed shelter",
    url: "/media/shelter-complete.webp",
    contentType: "image/webp",
    size: 0,
    altText: "A completed bamboo shelter",
    createdAt: "2026-07-26T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-shelter-progress",
    name: "Shelter in progress",
    url: "/media/shelter-progress.webp",
    contentType: "image/webp",
    size: 0,
    altText: "A bamboo shelter under construction",
    createdAt: "2026-07-26T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-shelter-before",
    name: "Shelter before rebuilding",
    url: "/media/shelter-before.webp",
    contentType: "image/webp",
    size: 0,
    altText: "A fragile shelter before rebuilding",
    createdAt: "2026-07-26T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-shelter-interior",
    name: "Shelter interior",
    url: "/media/shelter-interior.webp",
    contentType: "image/webp",
    size: 0,
    altText: "Interior of a completed bamboo shelter",
    createdAt: "2026-07-26T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-widow-support",
    name: "Widow support",
    url: "/media/widow-support.webp",
    contentType: "image/webp",
    size: 0,
    altText: "A woman receiving household assistance",
    createdAt: "2026-07-26T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-medical-support",
    name: "Medical support",
    url: "/media/medical-support.webp",
    contentType: "image/webp",
    size: 0,
    altText: "A patient's feet wrapped in medical bandages",
    createdAt: "2026-07-26T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-clean-water",
    name: "Clean water",
    url: "/media/clean-water.webp",
    contentType: "image/webp",
    size: 0,
    altText: "A community hand pump providing clean water",
    createdAt: "2026-07-26T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-education",
    name: "Education support",
    url: "/media/education-support.webp",
    contentType: "image/webp",
    size: 0,
    altText: "Children studying in a community classroom",
    createdAt: "2026-07-26T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-food-assistance",
    name: "Food assistance",
    url: "/media/food-assistance.webp",
    contentType: "image/webp",
    size: 0,
    altText: "Food supplies prepared for distribution",
    createdAt: "2026-07-26T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-ramadan-iftar",
    name: "Ramadan Iftar support",
    url: "/media/ramadan-iftar-support.webp",
    contentType: "image/webp",
    size: 0,
    altText:
      "Ramadan food supplies including rice, oil, milk, and dates prepared for distribution",
    createdAt: "2026-07-28T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-ramadan-iftar-supplies",
    name: "Ramadan Iftar supplies",
    url: "/media/ramadan-iftar-supplies.webp",
    contentType: "image/webp",
    size: 0,
    altText:
      "Rice, sugar, cooking oil, milk powder, dates, and other Ramadan supplies arranged before packing",
    createdAt: "2026-07-28T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-ramadan-iftar-packages",
    name: "Ramadan food packages",
    url: "/media/ramadan-iftar-packages.webp",
    contentType: "image/webp",
    size: 0,
    altText: "Prepared Ramadan food packages ready for distribution to families",
    createdAt: "2026-07-28T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-ramadan-iftar-community",
    name: "Community Iftar gathering",
    url: "/media/ramadan-iftar-community.webp",
    contentType: "image/webp",
    size: 0,
    altText: "Community members seated together for a shared Iftar meal",
    createdAt: "2026-07-29T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-ramadan-iftar-children",
    name: "Children's Iftar gathering",
    url: "/media/ramadan-iftar-children.webp",
    contentType: "image/webp",
    size: 0,
    altText:
      "Children seated around a shared Iftar meal before breaking their fast",
    createdAt: "2026-07-29T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-ramadan-iftar-meal",
    name: "Prepared Iftar meal",
    url: "/media/ramadan-iftar-meal.webp",
    contentType: "image/webp",
    size: 0,
    altText:
      "An Iftar plate with chickpeas, fruit, dates, water, and juice",
    createdAt: "2026-07-29T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-qurbani",
    name: "Qurbani distribution",
    url: "/media/qurbani-distribution.webp",
    contentType: "image/webp",
    size: 0,
    altText: "Packaged Qurbani meat portions ready for distribution",
    createdAt: "2026-07-26T00:00:00.000Z",
    isProtected: true,
  },
  {
    id: "original-shelter-video",
    name: "Completed shelter video",
    url: "/media/shelter-complete.mp4",
    contentType: "video/mp4",
    size: 0,
    altText: "Field video of a completed bamboo shelter",
    createdAt: "2026-07-26T00:00:00.000Z",
    isProtected: true,
  },
];
