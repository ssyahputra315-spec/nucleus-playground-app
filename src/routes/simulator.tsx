import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AtomVisualization } from "@/components/AtomVisualization";
import { ParticleControls } from "@/components/ParticleControls";
import { AtomInfoPanel } from "@/components/AtomInfoPanel";
import { loadData, saveAtomState } from "@/lib/storage";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Atom Builder — Atom Structure Simulator" },
      { name: "description", content: "Build and visualize atoms with protons, neutrons, and electrons" },
    ],
  }),
  component: SimulatorPage,
});

function SimulatorPage() {
  const [protons, setProtons] = useState(0);
  const [neutrons, setNeutrons] = useState(0);
  const [electrons, setElectrons] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data = loadData();
    if (data.lastAtom) {
      setProtons(data.lastAtom.protons);
      setNeutrons(data.lastAtom.neutrons);
      setElectrons(data.lastAtom.electrons);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveAtomState({ protons, neutrons, electrons });
    }
  }, [protons, neutrons, electrons, loaded]);

  const handleReset = () => {
    setProtons(0);
    setNeutrons(0);
    setElectrons(0);
  };

  return (
    <div className="px-4 pt-6 pb-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-foreground">Atom Builder</h1>
        <button
          onClick={handleReset}
          className="text-xs text-muted-foreground px-3 py-1.5 rounded-lg bg-secondary hover:bg-accent transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-3 mb-4">
        <AtomVisualization protons={protons} neutrons={neutrons} electrons={electrons} />
      </div>

      <div className="space-y-3">
        <ParticleControls
          protons={protons}
          neutrons={neutrons}
          electrons={electrons}
          onChangeProtons={setProtons}
          onChangeNeutrons={setNeutrons}
          onChangeElectrons={setElectrons}
        />
        <AtomInfoPanel protons={protons} neutrons={neutrons} electrons={electrons} />
      </div>
    </div>
  );
}
