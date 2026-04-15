import { getElementByProtons, isStable, distributeElectrons } from "@/lib/elements";

interface AtomInfoPanelProps {
  protons: number;
  neutrons: number;
  electrons: number;
}

export function AtomInfoPanel({ protons, neutrons, electrons }: AtomInfoPanelProps) {
  const element = getElementByProtons(protons);
  const stable = isStable(protons, neutrons, electrons);
  const shells = distributeElectrons(electrons);

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Atom Info
      </h3>
      <div className="space-y-2">
        <InfoRow label="Element" value={element ? `${element.name} (${element.symbol})` : protons === 0 ? "—" : "Unknown"} />
        <InfoRow label="Atomic Number" value={String(protons)} />
        <InfoRow label="Mass Number" value={String(protons + neutrons)} />
        <InfoRow label="Electrons" value={String(electrons)} />
        <InfoRow label="Shell Config" value={shells.length > 0 ? shells.join(", ") : "—"} />
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">Stability</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            protons === 0
              ? "bg-muted text-muted-foreground"
              : stable
                ? "bg-stable/20 text-stable"
                : "bg-unstable/20 text-unstable"
          }`}>
            {protons === 0 ? "—" : stable ? "Stable" : "Unstable"}
          </span>
        </div>
        {element && (
          <InfoRow label="Category" value={element.category} />
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
