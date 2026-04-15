export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "build" | "fix" | "identify";
  target?: { protons: number; neutrons: number; electrons: number };
  broken?: { protons: number; neutrons: number; electrons: number };
  correctAnswer?: string;
  options?: string[];
  difficulty: number;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "Build Hydrogen",
    description: "Create a Hydrogen atom (1 proton, 0 neutrons, 1 electron)",
    type: "build",
    target: { protons: 1, neutrons: 0, electrons: 1 },
    difficulty: 1,
  },
  {
    id: "c2",
    title: "Build Helium",
    description: "Create a Helium atom (2 protons, 2 neutrons, 2 electrons)",
    type: "build",
    target: { protons: 2, neutrons: 2, electrons: 2 },
    difficulty: 1,
  },
  {
    id: "c3",
    title: "Fix Carbon",
    description: "This Carbon atom has the wrong number of electrons. Fix it!",
    type: "fix",
    broken: { protons: 6, neutrons: 6, electrons: 4 },
    target: { protons: 6, neutrons: 6, electrons: 6 },
    difficulty: 2,
  },
  {
    id: "c4",
    title: "Identify the Element",
    description: "An atom has 8 protons. What element is it?",
    type: "identify",
    correctAnswer: "Oxygen",
    options: ["Carbon", "Nitrogen", "Oxygen", "Fluorine"],
    difficulty: 1,
  },
  {
    id: "c5",
    title: "Build Nitrogen",
    description: "Create a Nitrogen atom (7 protons, 7 neutrons, 7 electrons)",
    type: "build",
    target: { protons: 7, neutrons: 7, electrons: 7 },
    difficulty: 2,
  },
  {
    id: "c6",
    title: "Fix Sodium",
    description: "This Sodium atom is missing neutrons. Fix it to be stable!",
    type: "fix",
    broken: { protons: 11, neutrons: 8, electrons: 11 },
    target: { protons: 11, neutrons: 12, electrons: 11 },
    difficulty: 2,
  },
  {
    id: "c7",
    title: "Identify the Element",
    description: "An atom has 2 protons and 2 neutrons. What is it?",
    type: "identify",
    correctAnswer: "Helium",
    options: ["Hydrogen", "Helium", "Lithium", "Beryllium"],
    difficulty: 1,
  },
  {
    id: "c8",
    title: "Build Neon",
    description: "Create a Neon atom (10 protons, 10 neutrons, 10 electrons)",
    type: "build",
    target: { protons: 10, neutrons: 10, electrons: 10 },
    difficulty: 3,
  },
  {
    id: "c9",
    title: "Build Calcium",
    description: "Create a Calcium atom (20 protons, 20 neutrons, 20 electrons)",
    type: "build",
    target: { protons: 20, neutrons: 20, electrons: 20 },
    difficulty: 3,
  },
  {
    id: "c10",
    title: "Identify the Element",
    description: "An atom has 6 protons and 6 electrons. What element?",
    type: "identify",
    correctAnswer: "Carbon",
    options: ["Boron", "Carbon", "Nitrogen", "Oxygen"],
    difficulty: 2,
  },
];
