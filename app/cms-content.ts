export type ContentFieldType =
  | "text"
  | "textarea"
  | "image"
  | "video"
  | "email"
  | "tel"
  | "url";

export type ContentField = {
  key: string;
  label: string;
  type: ContentFieldType;
  help?: string;
};

export type ContentGroup = {
  title: string;
  description: string;
  fields: ContentField[];
};

export type ContentPage = {
  id: string;
  title: string;
  description: string;
  groups: ContentGroup[];
};

export const contentPages: ContentPage[] = [
  {
    id: "home",
    title: "Home",
    description: "Main introduction, featured images, working approach, and video.",
    groups: [
      {
        title: "Hero Section",
        description: "The first section visitors see when the website opens.",
        fields: [
          { key: "home.heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "home.heroTitle", label: "Main title", type: "textarea" },
          { key: "home.heroIntro", label: "Introduction", type: "textarea" },
          { key: "home.heroImage", label: "Main image", type: "image" },
        ],
      },
      {
        title: "Purpose",
        description: "A short introduction to the organisation's purpose.",
        fields: [
          { key: "home.purposeEyebrow", label: "Eyebrow", type: "text" },
          { key: "home.purposeTitle", label: "Title", type: "textarea" },
          { key: "home.purposeLead", label: "Featured introduction", type: "textarea" },
          { key: "home.purposeBody", label: "Description", type: "textarea" },
          { key: "home.focusEyebrow", label: "Projects eyebrow", type: "text" },
          { key: "home.focusTitle", label: "Projects title", type: "textarea" },
        ],
      },
      {
        title: "Field Story",
        description: "Authentic before-and-after images from the shelter project.",
        fields: [
          { key: "home.storyEyebrow", label: "Eyebrow", type: "text" },
          { key: "home.storyTitle", label: "Title", type: "textarea" },
          { key: "home.storyLead", label: "Featured introduction", type: "textarea" },
          { key: "home.storyBody", label: "Description", type: "textarea" },
          { key: "home.storyBeforeImage", label: "Work-in-progress image", type: "image" },
          { key: "home.storyAfterImage", label: "Completed work image", type: "image" },
        ],
      },
      {
        title: "How We Work",
        description: "The three core working principles.",
        fields: [
          { key: "home.processEyebrow", label: "Eyebrow", type: "text" },
          { key: "home.processTitle", label: "Title", type: "textarea" },
          { key: "home.processIntro", label: "Short introduction", type: "textarea" },
          { key: "home.process1Title", label: "Principle 1 title", type: "text" },
          { key: "home.process1Body", label: "Principle 1 description", type: "textarea" },
          { key: "home.process2Title", label: "Principle 2 title", type: "text" },
          { key: "home.process2Body", label: "Principle 2 description", type: "textarea" },
          { key: "home.process3Title", label: "Principle 3 title", type: "text" },
          { key: "home.process3Body", label: "Principle 3 description", type: "textarea" },
        ],
      },
      {
        title: "Video and Call to Action",
        description: "The field video and final message on the page.",
        fields: [
          { key: "home.videoUrl", label: "Video", type: "video" },
          { key: "home.videoPoster", label: "Video cover image", type: "image" },
          { key: "home.videoEyebrow", label: "Video eyebrow", type: "text" },
          { key: "home.videoTitle", label: "Video title", type: "textarea" },
          { key: "home.videoLead", label: "Video description", type: "textarea" },
          { key: "home.videoNote", label: "Media note", type: "text" },
          { key: "home.ctaEyebrow", label: "Final eyebrow", type: "text" },
          { key: "home.ctaTitle", label: "Final title", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "about",
    title: "About",
    description: "Mission, vision, values, and responsible storytelling content.",
    groups: [
      {
        title: "Page Introduction",
        description: "The top section of the About page.",
        fields: [
          { key: "about.heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "about.heroTitle", label: "Main title", type: "textarea" },
          { key: "about.heroIntro", label: "Introduction", type: "textarea" },
          { key: "about.heroImage", label: "Main image", type: "image" },
        ],
      },
      {
        title: "Mission and Vision",
        description: "The organisation's direction and purpose.",
        fields: [
          { key: "about.missionEyebrow", label: "Mission eyebrow", type: "text" },
          { key: "about.missionTitle", label: "Mission title", type: "textarea" },
          { key: "about.missionText", label: "Mission statement", type: "textarea" },
          { key: "about.visionEyebrow", label: "Vision eyebrow", type: "text" },
          { key: "about.visionTitle", label: "Vision title", type: "textarea" },
          { key: "about.visionText", label: "Vision statement", type: "textarea" },
        ],
      },
      {
        title: "Values",
        description: "The four core values.",
        fields: [
          { key: "about.valuesEyebrow", label: "Eyebrow", type: "text" },
          { key: "about.valuesTitle", label: "Title", type: "textarea" },
          { key: "about.value1Title", label: "Value 1 title", type: "text" },
          { key: "about.value1Body", label: "Value 1 description", type: "textarea" },
          { key: "about.value2Title", label: "Value 2 title", type: "text" },
          { key: "about.value2Body", label: "Value 2 description", type: "textarea" },
          { key: "about.value3Title", label: "Value 3 title", type: "text" },
          { key: "about.value3Body", label: "Value 3 description", type: "textarea" },
          { key: "about.value4Title", label: "Value 4 title", type: "text" },
          { key: "about.value4Body", label: "Value 4 description", type: "textarea" },
        ],
      },
      {
        title: "Dignity and Partnership",
        description: "Responsible media and the final message.",
        fields: [
          { key: "about.dignityImage", label: "Image", type: "image" },
          { key: "about.dignityEyebrow", label: "Eyebrow", type: "text" },
          { key: "about.dignityTitle", label: "Title", type: "textarea" },
          { key: "about.dignityLead", label: "Featured introduction", type: "textarea" },
          { key: "about.dignityBody", label: "Description", type: "textarea" },
          { key: "about.ctaEyebrow", label: "Final eyebrow", type: "text" },
          { key: "about.ctaTitle", label: "Final title", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "projects",
    title: "Projects",
    description: "Introduction and field records for the Projects page. Individual projects are managed in the Projects tab.",
    groups: [
      {
        title: "Page Introduction",
        description: "The top section of the Projects page.",
        fields: [
          { key: "projects.heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "projects.heroTitle", label: "Main title", type: "textarea" },
          { key: "projects.heroIntro", label: "Introduction", type: "textarea" },
          { key: "projects.heroImage", label: "Main image", type: "image" },
        ],
      },
      {
        title: "Field Records",
        description: "Three images documenting the stages of the shelter project.",
        fields: [
          { key: "projects.recordsEyebrow", label: "Eyebrow", type: "text" },
          { key: "projects.recordsTitle", label: "Title", type: "textarea" },
          { key: "projects.recordsIntro", label: "Introduction", type: "textarea" },
          { key: "projects.gallery1Image", label: "Image 1", type: "image" },
          { key: "projects.gallery1Label", label: "Image 1 label", type: "text" },
          { key: "projects.gallery2Image", label: "Image 2", type: "image" },
          { key: "projects.gallery2Label", label: "Image 2 label", type: "text" },
          { key: "projects.gallery3Image", label: "Image 3", type: "image" },
          { key: "projects.gallery3Label", label: "Image 3 label", type: "text" },
          { key: "projects.ctaEyebrow", label: "Final eyebrow", type: "text" },
          { key: "projects.ctaTitle", label: "Final title", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "donate",
    title: "Support",
    description: "Core content for responsible giving and other ways to support.",
    groups: [
      {
        title: "Page Introduction",
        description: "The top section of the Support page.",
        fields: [
          { key: "donate.heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "donate.heroTitle", label: "Main title", type: "textarea" },
          { key: "donate.heroIntro", label: "Introduction", type: "textarea" },
          { key: "donate.heroImage", label: "Main image", type: "image" },
          { key: "donate.introEyebrow", label: "Support eyebrow", type: "text" },
          { key: "donate.introTitle", label: "Support title", type: "textarea" },
          { key: "donate.introLead", label: "Featured introduction", type: "textarea" },
          { key: "donate.introBody", label: "Description", type: "textarea" },
        ],
      },
      {
        title: "Verification and Transparency",
        description: "Guidance to review before making a contribution.",
        fields: [
          { key: "donate.givingImage", label: "Image", type: "image" },
          { key: "donate.givingEyebrow", label: "Eyebrow", type: "text" },
          { key: "donate.givingTitle", label: "Title", type: "textarea" },
          { key: "donate.givingStep1", label: "Step 1", type: "textarea" },
          { key: "donate.givingStep2", label: "Step 2", type: "textarea" },
          { key: "donate.givingStep3", label: "Step 3", type: "textarea" },
          { key: "donate.transparencyTitle", label: "Transparency title", type: "text" },
          { key: "donate.transparencyText", label: "Transparency note", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    description: "Contact copy, verified contact details, and social links.",
    groups: [
      {
        title: "Page Introduction",
        description: "The top and introductory sections of the Contact page.",
        fields: [
          { key: "contact.heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "contact.heroTitle", label: "Main title", type: "textarea" },
          { key: "contact.heroIntro", label: "Introduction", type: "textarea" },
          { key: "contact.heroImage", label: "Main image", type: "image" },
          { key: "contact.introEyebrow", label: "Contact eyebrow", type: "text" },
          { key: "contact.introTitle", label: "Contact title", type: "textarea" },
          { key: "contact.introLead", label: "Featured introduction", type: "textarea" },
          { key: "contact.noticeTitle", label: "Verification note title", type: "text" },
          { key: "contact.noticeText", label: "Verification note", type: "textarea" },
        ],
      },
      {
        title: "Verified Contact Details",
        description: "Enter only official, verified information. Empty fields will not appear on the website.",
        fields: [
          { key: "contact.email", label: "Email", type: "email" },
          { key: "contact.phone", label: "Phone", type: "tel" },
          {
            key: "contact.whatsapp",
            label: "WhatsApp link or number",
            type: "text",
            help: "Example: +8801… or https://wa.me/…",
          },
          { key: "contact.location", label: "Location or area", type: "text" },
          { key: "contact.facebook", label: "Facebook link", type: "url" },
          { key: "contact.instagram", label: "Instagram link", type: "url" },
          { key: "contact.youtube", label: "YouTube link", type: "url" },
        ],
      },
      {
        title: "Privacy and Final Message",
        description: "A note about protecting sensitive information.",
        fields: [
          { key: "contact.privacyEyebrow", label: "Eyebrow", type: "text" },
          { key: "contact.privacyTitle", label: "Title", type: "textarea" },
          { key: "contact.privacyText", label: "Description", type: "textarea" },
          { key: "contact.ctaEyebrow", label: "Final eyebrow", type: "text" },
          { key: "contact.ctaTitle", label: "Final title", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "global",
    title: "Footer",
    description: "The organisation message displayed at the bottom of every page.",
    groups: [
      {
        title: "Footer Content",
        description: "Short introduction and media policy.",
        fields: [
          { key: "global.footerTagline", label: "Short introduction", type: "textarea" },
          { key: "global.footerCommitment", label: "Organisation commitment", type: "textarea" },
        ],
      },
    ],
  },
];

export const siteContentDefaults: Record<string, string> = {
  "home.heroEyebrow": "Community-led humanitarian response",
  "home.heroTitle": "Relief that protects dignity.",
  "home.heroIntro":
    "Noor Al-Aman Humanitarian stands with vulnerable families through practical support, local understanding, and compassionate action.",
  "home.heroImage": "/media/shelter-complete.webp",
  "home.purposeEyebrow": "Our purpose",
  "home.purposeTitle": "Human care, grounded in real needs.",
  "home.purposeLead":
    "We support families affected by displacement, poverty, fragile shelter, food insecurity, limited access to water and learning, medical emergencies, and seasonal needs in Bangladesh.",
  "home.purposeBody":
    "Our approach begins with listening. Assistance is shaped around urgent needs, delivered respectfully, and documented carefully.",
  "home.focusEyebrow": "Where we focus",
  "home.focusTitle": "Practical support for vulnerable families",
  "home.storyEyebrow": "Field story",
  "home.storyTitle": "From an exposed frame to a safer home",
  "home.storyLead":
    "Shelter work is more than construction. It restores privacy, protection, and a measure of stability for a family.",
  "home.storyBody":
    "These real field photographs document a bamboo shelter during construction and after completion. The design uses familiar local materials and practical building methods.",
  "home.storyBeforeImage": "/media/shelter-progress.webp",
  "home.storyAfterImage": "/media/shelter-complete.webp",
  "home.processEyebrow": "How we work",
  "home.processTitle": "Simple principles. Responsible action.",
  "home.processIntro":
    "Every response should respect the people it is intended to serve.",
  "home.process1Title": "Listen locally",
  "home.process1Body":
    "Understand the family's situation before deciding what support is appropriate.",
  "home.process2Title": "Respond practically",
  "home.process2Body":
    "Focus on useful assistance that addresses a clear and immediate need.",
  "home.process3Title": "Document carefully",
  "home.process3Body":
    "Record delivery while protecting personal dignity and avoiding unnecessary exposure.",
  "home.videoUrl": "/media/shelter-complete.mp4",
  "home.videoPoster": "/media/shelter-interior.webp",
  "home.videoEyebrow": "A record of the work",
  "home.videoTitle": "Real progress, shown with care",
  "home.videoLead":
    "This short field video shows the interior of a completed shelter. It is shared to demonstrate the work without exposing the family receiving support.",
  "home.videoNote":
    "Authentic field media • No staged imagery • Privacy-conscious selection",
  "home.ctaEyebrow": "Stand with dignity",
  "home.ctaTitle": "Help turn compassion into practical support.",

  "about.heroEyebrow": "About Noor Al-Aman",
  "about.heroTitle": "Compassion shaped by local understanding.",
  "about.heroIntro":
    "We are a community-led humanitarian initiative focused on practical, dignified support for vulnerable families.",
  "about.heroImage": "/media/shelter-interior.webp",
  "about.missionEyebrow": "Our mission",
  "about.missionTitle": "Respond to urgent needs with care and accountability.",
  "about.missionText":
    "Our mission is to help vulnerable people meet essential needs while protecting their dignity, privacy, and agency.",
  "about.visionEyebrow": "Our vision",
  "about.visionTitle": "Communities where hardship does not erase hope.",
  "about.visionText":
    "We envision timely, trustworthy humanitarian support that strengthens safety and helps families move forward.",
  "about.valuesEyebrow": "Our values",
  "about.valuesTitle": "The standards behind every response",
  "about.value1Title": "Dignity",
  "about.value1Body":
    "People are never reduced to images of hardship. Privacy and respect guide how assistance is delivered and documented.",
  "about.value2Title": "Compassion",
  "about.value2Body":
    "We meet families with empathy and listen before deciding what support is most useful.",
  "about.value3Title": "Accountability",
  "about.value3Body":
    "We value clear needs assessment, responsible use of support, and honest communication about the work.",
  "about.value4Title": "Local knowledge",
  "about.value4Body":
    "Community context informs priorities, materials, delivery, and the practical design of each response.",
  "about.dignityImage": "/media/widow-support.webp",
  "about.dignityEyebrow": "Dignity in practice",
  "about.dignityTitle":
    "Responsible storytelling is part of humanitarian care.",
  "about.dignityLead":
    "The people receiving assistance are people first. Their hardship should never become a spectacle.",
  "about.dignityBody":
    "We select authentic field images carefully, avoid publishing graphic material, remove hidden location data, and favour photographs that do not expose a person's identity.",
  "about.ctaEyebrow": "Work with us",
  "about.ctaTitle": "Partnership begins with shared principles.",

  "projects.heroEyebrow": "Our projects",
  "projects.heroTitle": "Focused responses to real needs.",
  "projects.heroIntro":
    "Our current work reflects needs documented through authentic field records: safer shelter, family assistance, medical care, clean water, education, food support, and seasonal Qurbani distribution.",
  "projects.heroImage": "/media/shelter-progress.webp",
  "projects.recordsEyebrow": "Field records",
  "projects.recordsTitle": "A shelter project, documented step by step",
  "projects.recordsIntro":
    "Real photographs from the same body of work show the need, construction, and completed result.",
  "projects.gallery1Image": "/media/shelter-before.webp",
  "projects.gallery1Label": "Before rebuilding",
  "projects.gallery2Image": "/media/shelter-progress.webp",
  "projects.gallery2Label": "During construction",
  "projects.gallery3Image": "/media/shelter-complete.webp",
  "projects.gallery3Label": "Completed shelter",
  "projects.ctaEyebrow": "Support practical work",
  "projects.ctaTitle": "Help a documented need become a dignified response.",

  "donate.heroEyebrow": "Support our work",
  "donate.heroTitle": "Give with compassion. Give with confidence.",
  "donate.heroIntro":
    "Responsible support should be connected to a clear need, a verified channel, and transparent communication.",
  "donate.heroImage": "/media/food-assistance.webp",
  "donate.introEyebrow": "Your support matters",
  "donate.introTitle": "Help turn urgent needs into practical assistance.",
  "donate.introLead":
    "Support can help a family move toward safer shelter, meet essential household needs, access medical treatment, find safer water, continue learning, receive food assistance, or benefit from seasonal Qurbani distribution.",
  "donate.introBody":
    "Verified donation instructions are not published on this page yet. Please request the current official giving route before transferring funds, and never rely on an unverified personal account shared by a third party.",
  "donate.givingImage": "/media/clean-water.webp",
  "donate.givingEyebrow": "Before you give",
  "donate.givingTitle": "Use only a verified Noor Al-Aman channel.",
  "donate.givingStep1":
    "Request the current official donation instructions.",
  "donate.givingStep2": "Confirm the purpose of your contribution.",
  "donate.givingStep3":
    "Keep the confirmation or receipt for your records.",
  "donate.transparencyTitle": "Transparency note",
  "donate.transparencyText":
    "This website does not currently process online payments. Donation options will be added only after the relevant channel and public information have been verified.",

  "contact.heroEyebrow": "Contact",
  "contact.heroTitle": "Start a thoughtful conversation.",
  "contact.heroIntro":
    "We welcome enquiries from responsible partners, supporters, volunteers, and media professionals who share our commitment to dignity.",
  "contact.heroImage": "/media/shelter-interior.webp",
  "contact.introEyebrow": "Get in touch",
  "contact.introTitle": "Choose the right conversation.",
  "contact.introLead":
    "Clear enquiries help us respond with the right information and protect the privacy of the families involved in our work.",
  "contact.noticeTitle": "Contact details are being verified",
  "contact.noticeText":
    "Direct email and official social links will appear here once confirmed. Please do not send funds or sensitive personal information through an unverified account.",
  "contact.email": "",
  "contact.phone": "",
  "contact.whatsapp": "",
  "contact.location": "",
  "contact.facebook": "",
  "contact.instagram": "",
  "contact.youtube": "",
  "contact.privacyEyebrow": "Please protect privacy",
  "contact.privacyTitle":
    "Do not include sensitive personal details in an initial enquiry.",
  "contact.privacyText":
    "Please avoid sending medical records, identification documents, full addresses, payment details, or photographs of children until an official and appropriate communication route has been confirmed.",
  "contact.ctaEyebrow": "Learn more",
  "contact.ctaTitle": "See how compassion becomes practical work.",

  "global.footerTagline": "Serving humanity with compassion and dignity.",
  "global.footerCommitment":
    "We share field media selectively, protect personal dignity, and do not publish sensitive identifying information.",
};
