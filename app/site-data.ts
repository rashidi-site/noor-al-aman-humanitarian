export type Program = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  image: string;
  imageAlt: string;
  label: string;
};

export const programs: Program[] = [
  {
    slug: "shelter",
    title: "Shelter Assistance",
    shortTitle: "Shelter",
    summary:
      "Repairing and rebuilding fragile shelters so families have greater safety, privacy, and stability.",
    image: "/media/shelter-complete.webp",
    imageAlt: "A completed bamboo shelter",
    label: "Safer homes",
  },
  {
    slug: "widow-support",
    title: "Widow & Family Support",
    shortTitle: "Family support",
    summary:
      "Providing essential household assistance to widows and families facing severe economic hardship.",
    image: "/media/widow-support.webp",
    imageAlt: "A woman receiving a household support package",
    label: "Essential assistance",
  },
  {
    slug: "medical-support",
    title: "Medical Support",
    shortTitle: "Medical care",
    summary:
      "Helping vulnerable patients access urgent treatment and essential care during medical emergencies.",
    image: "/media/medical-support.webp",
    imageAlt: "A patient receiving hospital care for a bandaged leg",
    label: "Urgent care",
  },
];
