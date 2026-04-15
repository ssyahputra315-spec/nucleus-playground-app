export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  category: string;
  shells: number[];
}

export const ELEMENTS: ElementData[] = [
  { atomicNumber: 1, symbol: "H", name: "Hydrogen", category: "Nonmetal", shells: [1] },
  { atomicNumber: 2, symbol: "He", name: "Helium", category: "Noble Gas", shells: [2] },
  { atomicNumber: 3, symbol: "Li", name: "Lithium", category: "Alkali Metal", shells: [2, 1] },
  { atomicNumber: 4, symbol: "Be", name: "Beryllium", category: "Alkaline Earth", shells: [2, 2] },
  { atomicNumber: 5, symbol: "B", name: "Boron", category: "Metalloid", shells: [2, 3] },
  { atomicNumber: 6, symbol: "C", name: "Carbon", category: "Nonmetal", shells: [2, 4] },
  { atomicNumber: 7, symbol: "N", name: "Nitrogen", category: "Nonmetal", shells: [2, 5] },
  { atomicNumber: 8, symbol: "O", name: "Oxygen", category: "Nonmetal", shells: [2, 6] },
  { atomicNumber: 9, symbol: "F", name: "Fluorine", category: "Halogen", shells: [2, 7] },
  { atomicNumber: 10, symbol: "Ne", name: "Neon", category: "Noble Gas", shells: [2, 8] },
  { atomicNumber: 11, symbol: "Na", name: "Sodium", category: "Alkali Metal", shells: [2, 8, 1] },
  { atomicNumber: 12, symbol: "Mg", name: "Magnesium", category: "Alkaline Earth", shells: [2, 8, 2] },
  { atomicNumber: 13, symbol: "Al", name: "Aluminium", category: "Post-transition", shells: [2, 8, 3] },
  { atomicNumber: 14, symbol: "Si", name: "Silicon", category: "Metalloid", shells: [2, 8, 4] },
  { atomicNumber: 15, symbol: "P", name: "Phosphorus", category: "Nonmetal", shells: [2, 8, 5] },
  { atomicNumber: 16, symbol: "S", name: "Sulfur", category: "Nonmetal", shells: [2, 8, 6] },
  { atomicNumber: 17, symbol: "Cl", name: "Chlorine", category: "Halogen", shells: [2, 8, 7] },
  { atomicNumber: 18, symbol: "Ar", name: "Argon", category: "Noble Gas", shells: [2, 8, 8] },
  { atomicNumber: 19, symbol: "K", name: "Potassium", category: "Alkali Metal", shells: [2, 8, 8, 1] },
  { atomicNumber: 20, symbol: "Ca", name: "Calcium", category: "Alkaline Earth", shells: [2, 8, 8, 2] },
];

export function getElementByProtons(protons: number): ElementData | null {
  return ELEMENTS.find(e => e.atomicNumber === protons) || null;
}

export function distributeElectrons(count: number): number[] {
  const shellCapacities = [2, 8, 8, 8];
  const shells: number[] = [];
  let remaining = count;
  for (const cap of shellCapacities) {
    if (remaining <= 0) break;
    const inShell = Math.min(remaining, cap);
    shells.push(inShell);
    remaining -= inShell;
  }
  if (remaining > 0) {
    shells.push(remaining);
  }
  return shells;
}

export function isStable(protons: number, neutrons: number, electrons: number): boolean {
  if (protons !== electrons) return false;
  if (protons === 0) return false;
  if (protons === 1) return neutrons === 0 || neutrons === 1;
  if (protons <= 20) {
    const ratio = neutrons / protons;
    return ratio >= 0.8 && ratio <= 1.5;
  }
  return false;
}
