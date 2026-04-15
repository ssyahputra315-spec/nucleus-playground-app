import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ELEMENTS } from "@/lib/elements";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAtomState } from "@/lib/storage";
import type { ElementData } from "@/lib/elements";

export const Route = createFileRoute("/explorer")({
  head: () => ({
    meta: [
      { title: "Element Explorer — Atom Structure Simulator" },
      { name: "description", content: "Browse and explore the first 20 elements of the periodic table" },
    ],
  }),
  component: ExplorerPage,
});

function ExplorerPage() {
  const [selected, setSelected] = useState<ElementData | null>(null);
  const navigate = useNavigate();

  const simulateElement = (el: ElementData) => {
    const neutrons = el.atomicNumber <= 2 ? el.atomicNumber : Math.round(el.atomicNumber * 1.1);
    saveAtomState({ protons: el.atomicNumber, neutrons: el.atomicNumber === 1 ? 0 : neutrons, electrons: el.atomicNumber });
    navigate({ to: "/simulator" });
  };

  return (
    <div className="px-4 pt-6 pb-8 max-w-lg mx-auto">
      <h1 className="text-lg font-bold text-foreground mb-1">Element Explorer</h1>
      <p className="text-xs text-muted-foreground mb-5">First 20 elements</p>

      <div className="grid grid-cols-4 gap-2">
        {ELEMENTS.map(el => (
          <button
            key={el.atomicNumber}
            onClick={() => setSelected(el)}
            className="bg-card border border-border rounded-xl p-3 text-center transition-all active:scale-95 hover:border-primary/50"
          >
            <span className="text-[10px] text-muted-foreground">{el.atomicNumber}</span>
            <p className="text-lg font-bold text-foreground leading-tight">{el.symbol}</p>
            <p className="text-[10px] text-muted-foreground truncate">{el.name}</p>
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div
            className="bg-card border border-border rounded-t-3xl p-6 w-full max-w-lg animate-float-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground">#{selected.atomicNumber}</p>
                <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
                <p className="text-sm text-muted-foreground">{selected.symbol} · {selected.category}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-secondary rounded-xl p-4 mb-4 space-y-2">
              <InfoRow label="Atomic Number" value={String(selected.atomicNumber)} />
              <InfoRow label="Electron Config" value={selected.shells.join(", ")} />
              <InfoRow label="Valence Electrons" value={String(selected.shells[selected.shells.length - 1])} />
            </div>

            <Button className="w-full" onClick={() => simulateElement(selected)}>
              Simulate this atom
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
