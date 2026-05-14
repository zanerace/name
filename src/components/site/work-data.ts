export type WorkProject = {
  id: string;
  num: string;
  title: string;
  titleLines?: readonly [string, string];
  desc: string;
  tag: string;
  year: string;
  coverImage: string;
  alt: string;
  body: string;
};

export const workProjects: WorkProject[] = [
  {
    id: "gradual-sans",
    num: "01",
    title: "Gradual Sans",
    desc: "A variable display family exploring optical scaling between text and headline.",
    tag: "Type Design",
    year: "2025",
    coverImage: "/work/01.jpg",
    alt: "Type specimen for Gradual Sans",
    body: "Gradual Sans explores the tension between editorial delicacy and display impact. The system was developed as a flexible family for both long-form narrative and campaign-scale typography.",
  },
  {
    id: "climate-change",
    num: "02",
    title: "Climate Change Exhibition",
    titleLines: ["Climate Change", "Exhibition"],
    desc: "Identity and campaign for a touring museum exhibition on environmental loss.",
    tag: "Identity / Campaign",
    year: "2025",
    coverImage: "/work/02.png",
    alt: "Climate Change exhibition poster",
    body: "The exhibition identity balances urgency with restraint through high-contrast typography, sober pacing, and an image system designed to travel across print, digital, and environmental formats.",
  },
  {
    id: "lunacast",
    num: "03",
    title: "LunaCast",
    desc: "Product identity, interface, and motion system for a lunar-cycle podcast app.",
    tag: "UX / Motion",
    year: "2024",
    coverImage: "/work/03.png",
    alt: "LunaCast app screens",
    body: "LunaCast unifies interface rhythm, tonal branding, and product animation around lunar phases. The system prioritizes calm navigation and a consistent motion grammar across playback states.",
  },
  {
    id: "rwanda",
    num: "04",
    title: "Rwanda",
    desc: "Visual identity rooted in Imigongo geometry for a hospitality brand.",
    tag: "Identity",
    year: "2024",
    coverImage: "/work/rwanda-cover.png",
    alt: "Rwanda identity mark on textured paper",
    body: "The brand system translates Imigongo-inspired structure into contemporary hospitality touchpoints, from stationery to environmental graphics, with careful attention to cultural reference and craft.",
  },
];

export function getWorkProjectById(projectId: string) {
  return workProjects.find((project) => project.id === projectId);
}
