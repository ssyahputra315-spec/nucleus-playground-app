import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CHALLENGES, type Challenge } from "@/lib/challenges";
import { loadData, saveChallengeResult } from "@/lib/storage";
import { Lock, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AtomVisualization } from "@/components/AtomVisualization";
import { ParticleControls } from "@/components/ParticleControls";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Challenges — Atom Structure Simulator" },
      { name: "description", content: "Test your knowledge of atomic structures with fun challenges" },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [progress, setProgress] = useState<Record<string, { completed: boolean; stars: number }>>({});

  useEffect(() => {
    setProgress(loadData().challenges);
  }, []);

  const getUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevId = CHALLENGES[index - 1].id;
    return !!progress[prevId]?.completed;
  };

  const refreshProgress = () => setProgress(loadData().challenges);

  if (activeChallenge) {
    return (
      <ChallengeActive
        challenge={activeChallenge}
        onBack={() => { setActiveChallenge(null); refreshProgress(); }}
      />
    );
  }

  return (
    <div className="px-4 pt-6 pb-8 max-w-lg mx-auto">
      <h1 className="text-lg font-bold text-foreground mb-5">Challenges</h1>
      <div className="space-y-3">
        {CHALLENGES.map((ch, i) => {
          const unlocked = getUnlocked(i);
          const result = progress[ch.id];
          return (
            <button
              key={ch.id}
              disabled={!unlocked}
              onClick={() => unlocked && setActiveChallenge(ch)}
              className={`w-full text-left bg-card border border-border rounded-2xl p-4 transition-all ${
                unlocked ? "active:scale-[0.98]" : "opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  result?.completed ? "bg-stable/15" : unlocked ? "bg-primary/15" : "bg-muted"
                }`}>
                  {!unlocked ? (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  ) : result?.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-stable" />
                  ) : (
                    <span className="text-sm font-bold text-primary">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{ch.title}</p>
                  <p className="text-xs text-muted-foreground">{ch.description}</p>
                </div>
                {result?.completed && (
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= result.stars ? "text-star-active fill-star-active" : "text-star-inactive"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChallengeActive({ challenge, onBack }: { challenge: Challenge; onBack: () => void }) {
  const [protons, setProtons] = useState(challenge.broken?.protons ?? 0);
  const [neutrons, setNeutrons] = useState(challenge.broken?.neutrons ?? 0);
  const [electrons, setElectrons] = useState(challenge.broken?.electrons ?? 0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [stars, setStars] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const checkBuildOrFix = () => {
    setAttempts(a => a + 1);
    if (
      challenge.target &&
      protons === challenge.target.protons &&
      neutrons === challenge.target.neutrons &&
      electrons === challenge.target.electrons
    ) {
      const s = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
      setStars(s);
      setCompleted(true);
      saveChallengeResult(challenge.id, s);
    }
  };

  const checkIdentify = (answer: string) => {
    setSelectedAnswer(answer);
    setAttempts(a => a + 1);
    if (answer === challenge.correctAnswer) {
      const s = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
      setStars(s);
      setCompleted(true);
      saveChallengeResult(challenge.id, s);
    }
  };

  if (completed) {
    return (
      <div className="px-4 pt-6 pb-8 max-w-lg mx-auto text-center">
        <div className="animate-float-in">
          <CheckCircle2 className="w-16 h-16 text-stable mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Challenge Complete!</h2>
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3].map(s => (
              <Star
                key={s}
                className={`w-8 h-8 animate-star-pop ${s <= stars ? "text-star-active fill-star-active" : "text-star-inactive"}`}
                style={{ animationDelay: `${s * 0.15}s` }}
              />
            ))}
          </div>
          <Button onClick={onBack}>Back to Challenges</Button>
        </div>
      </div>
    );
  }

  if (challenge.type === "identify") {
    return (
      <div className="px-4 pt-6 pb-8 max-w-lg mx-auto">
        <button onClick={onBack} className="text-sm text-muted-foreground mb-4">← Back</button>
        <h2 className="text-lg font-bold text-foreground mb-2">{challenge.title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{challenge.description}</p>
        <div className="space-y-2">
          {challenge.options?.map(opt => {
            let style = "bg-secondary text-secondary-foreground";
            if (selectedAnswer === opt) {
              style = opt === challenge.correctAnswer
                ? "bg-stable/20 text-stable"
                : "bg-destructive/20 text-destructive";
            }
            return (
              <button
                key={opt}
                onClick={() => !selectedAnswer && checkIdentify(opt)}
                className={`w-full text-left text-sm px-4 py-3 rounded-xl transition-colors ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {selectedAnswer && selectedAnswer !== challenge.correctAnswer && (
          <p className="text-xs text-destructive mt-3">Try again!</p>
        )}
        {selectedAnswer && selectedAnswer !== challenge.correctAnswer && (
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setSelectedAnswer(null)}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-8 max-w-lg mx-auto">
      <button onClick={onBack} className="text-sm text-muted-foreground mb-4">← Back</button>
      <h2 className="text-lg font-bold text-foreground mb-2">{challenge.title}</h2>
      <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>

      <div className="bg-card border border-border rounded-2xl p-3 mb-4">
        <AtomVisualization protons={protons} neutrons={neutrons} electrons={electrons} />
      </div>

      <ParticleControls
        protons={protons}
        neutrons={neutrons}
        electrons={electrons}
        onChangeProtons={setProtons}
        onChangeNeutrons={setNeutrons}
        onChangeElectrons={setElectrons}
      />

      <Button className="w-full mt-4" onClick={checkBuildOrFix}>
        Check Answer
      </Button>
      {attempts > 0 && !completed && (
        <p className="text-xs text-destructive mt-2 text-center">Not quite right. Keep trying!</p>
      )}
    </div>
  );
}
