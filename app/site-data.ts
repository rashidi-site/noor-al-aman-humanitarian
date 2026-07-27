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
  {
    slug: "clean-water",
    title: "Clean Water",
    shortTitle: "Clean water",
    summary:
      "Improving access to safer, more reliable water through practical community water points.",
    image: "/media/clean-water.webp",
    imageAlt: "Children washing their hands with water from a community hand pump",
    label: "Safe water",
  },
  {
    slug: "education",
    title: "Education Support",
    shortTitle: "Education",
    summary:
      "Supporting basic learning in community classrooms where children can study in a simple, shared space.",
    image: "/media/education-support.webp",
    imageAlt: "Children studying together in a community classroom",
    label: "Learning",
  },
  {
    slug: "food-assistance",
    title: "Food Assistance",
    shortTitle: "Food support",
    summary:
      "Providing essential food packages and prepared meals to families facing acute hardship.",
    image: "/media/food-assistance.webp",
    imageAlt: "Essential food supplies prepared for distribution",
    label: "Essential food",
  },
];
