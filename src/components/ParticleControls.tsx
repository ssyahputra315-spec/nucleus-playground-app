import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ParticleControlsProps {
  protons: number;
  neutrons: number;
  electrons: number;
  onChangeProtons: (v: number) => void;
  onChangeNeutrons: (v: number) => void;
  onChangeElectrons: (v: number) => void;
}

function ParticleRow({
  label,
  value,
  color,
  onAdd,
  onRemove,
}: {
  label: string;
  value: number;
  color: string;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2 min-w-[100px]">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onRemove}
          disabled={value <= 0}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-8 text-center font-mono text-sm text-foreground">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onAdd}
          disabled={value >= 20}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export function ParticleControls({
  protons, neutrons, electrons,
  onChangeProtons, onChangeNeutrons, onChangeElectrons,
}: ParticleControlsProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Particles
      </h3>
      <ParticleRow
        label="Protons"
        value={protons}
        color="#ef4444"
        onAdd={() => onChangeProtons(protons + 1)}
        onRemove={() => onChangeProtons(protons - 1)}
      />
      <ParticleRow
        label="Neutrons"
        value={neutrons}
        color="#94a3b8"
        onAdd={() => onChangeNeutrons(neutrons + 1)}
        onRemove={() => onChangeNeutrons(neutrons - 1)}
      />
      <ParticleRow
        label="Electrons"
        value={electrons}
        color="#60a5fa"
        onAdd={() => onChangeElectrons(electrons + 1)}
        onRemove={() => onChangeElectrons(electrons - 1)}
      />
    </div>
  );
}
