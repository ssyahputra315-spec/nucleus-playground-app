export interface AtomState {
  protons: number;
  neutrons: number;
  electrons: number;
}

export interface ChallengeProgress {
  [challengeId: string]: { completed: boolean; stars: number };
}

export interface AppData {
  lastAtom: AtomState | null;
  challenges: ChallengeProgress;
  learnProgress: string[];
}

const STORAGE_KEY = "atom-simulator-data";

function getDefaultData(): AppData {
  return {
    lastAtom: null,
    challenges: {},
    learnProgress: [],
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return { ...getDefaultData(), ...JSON.parse(raw) };
  } catch {
    return getDefaultData();
  }
}

export function saveData(data: Partial<AppData>) {
  const current = loadData();
  const merged = { ...current, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function saveAtomState(atom: AtomState) {
  saveData({ lastAtom: atom });
}

export function saveChallengeResult(id: string, stars: number) {
  const data = loadData();
  data.challenges[id] = { completed: true, stars };
  saveData({ challenges: data.challenges });
}

export function markLearnComplete(sectionId: string) {
  const data = loadData();
  if (!data.learnProgress.includes(sectionId)) {
    data.learnProgress.push(sectionId);
    saveData({ learnProgress: data.learnProgress });
  }
}
