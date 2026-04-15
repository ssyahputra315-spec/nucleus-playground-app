import { createFileRoute, Link } from "@tanstack/react-router";
import { Atom, BookOpen, Trophy, Play } from "lucide-react";
import { loadData } from "@/lib/storage";
import { getElementByProtons } from "@/lib/elements";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [lastAtomName, setLastAtomName] = useState<string | null>(null);
  const [hasLastAtom, setHasLastAtom] = useState(false);

  useEffect(() => {
    const data = loadData();
    if (data.lastAtom && data.lastAtom.protons > 0) {
      setHasLastAtom(true);
      const el = getElementByProtons(data.lastAtom.protons);
      setLastAtomName(el ? el.name : `${data.lastAtom.protons}p`);
    }
  }, []);

  return (
    <div className="px-5 pt-12 pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-float-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 mb-4">
          <Atom className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Atom Simulator</h1>
        <p className="text-sm text-muted-foreground mt-1">Build & explore atomic structures</p>
      </div>

      {/* Last session */}
      {hasLastAtom && (
        <Link
          to="/simulator"
          className="block bg-card border border-border rounded-2xl p-4 mb-6 transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Continue building</p>
              <p className="text-sm font-semibold text-foreground">{lastAtomName}</p>
            </div>
            <span className="text-xs text-primary font-medium">Resume →</span>
          </div>
        </Link>
      )}

      {/* Main actions */}
      <div className="grid grid-cols-2 gap-3">
        <NavCard
          to="/simulator"
          icon={<Atom className="w-6 h-6" />}
          title="Build Atom"
          desc="Create any atom"
          color="bg-primary/15 text-primary"
        />
        <NavCard
          to="/learn"
          icon={<BookOpen className="w-6 h-6" />}
          title="Learn"
          desc="Atomic basics"
          color="bg-stable/15 text-stable"
        />
        <NavCard
          to="/challenges"
          icon={<Trophy className="w-6 h-6" />}
          title="Challenges"
          desc="Test your skills"
          color="bg-star-active/15 text-star-active"
        />
        <NavCard
          to="/explorer"
          icon={<span className="text-xl font-bold">⚛</span>}
          title="Elements"
          desc="Periodic table"
          color="bg-electron/15 text-electron"
        />
      </div>
    </div>
  );
}

function NavCard({
  to,
  icon,
  title,
  desc,
  color,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="bg-card border border-border rounded-2xl p-4 transition-transform active:scale-[0.97] block"
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </Link>
  );
}
