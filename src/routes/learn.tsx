import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markLearnComplete, loadData } from "@/lib/storage";

interface LearnSection {
  id: string;
  title: string;
  content: string[];
  quiz?: { question: string; options: string[]; correct: number };
}

const SECTIONS: LearnSection[] = [
  {
    id: "structure",
    title: "Atomic Structure",
    content: [
      "Every atom is made of three types of particles: protons, neutrons, and electrons.",
      "Protons and neutrons form the nucleus at the center. Electrons orbit around the nucleus in shells.",
      "The number of protons determines which element an atom is. For example, 1 proton = Hydrogen, 6 protons = Carbon.",
    ],
    quiz: {
      question: "What determines which element an atom is?",
      options: ["Number of electrons", "Number of protons", "Number of neutrons", "Total mass"],
      correct: 1,
    },
  },
  {
    id: "protons",
    title: "Protons",
    content: [
      "Protons are positively charged particles found in the nucleus.",
      "The number of protons is called the atomic number. It uniquely identifies each element.",
      "Protons have a relative mass of 1 atomic mass unit (amu).",
    ],
    quiz: {
      question: "What charge do protons carry?",
      options: ["Negative", "Neutral", "Positive", "Variable"],
      correct: 2,
    },
  },
  {
    id: "neutrons",
    title: "Neutrons",
    content: [
      "Neutrons have no electric charge — they are neutral.",
      "They help stabilize the nucleus. Without enough neutrons, atoms can become unstable.",
      "Atoms of the same element can have different numbers of neutrons. These are called isotopes.",
    ],
    quiz: {
      question: "What are atoms of the same element with different neutron counts called?",
      options: ["Ions", "Isotopes", "Isomers", "Allotropes"],
      correct: 1,
    },
  },
  {
    id: "electrons",
    title: "Electrons",
    content: [
      "Electrons are tiny, negatively charged particles that orbit the nucleus.",
      "They are arranged in shells (energy levels). The first shell holds up to 2 electrons, the second and third hold up to 8 each.",
      "When an atom has equal protons and electrons, it is electrically neutral. If not, it becomes an ion.",
    ],
    quiz: {
      question: "How many electrons can the first shell hold?",
      options: ["1", "2", "8", "18"],
      correct: 1,
    },
  },
  {
    id: "shells",
    title: "Electron Shells",
    content: [
      "Electrons fill shells from the inside out. The innermost shell fills first.",
      "Shell 1: up to 2 electrons. Shell 2: up to 8. Shell 3: up to 8 (simplified model).",
      "The electrons in the outermost shell are called valence electrons. They determine how an atom bonds with others.",
    ],
    quiz: {
      question: "Which electrons determine bonding behavior?",
      options: ["Core electrons", "Valence electrons", "All electrons equally", "Neutrons"],
      correct: 1,
    },
  },
];

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — Atom Structure Simulator" },
      { name: "description", content: "Learn about atomic structure, protons, neutrons, and electrons" },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const section = SECTIONS[currentIndex];
  const completedSections = loadData().learnProgress;

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    if (section.quiz && index === section.quiz.correct) {
      markLearnComplete(section.id);
    }
  };

  const goNext = () => {
    if (currentIndex < SECTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="px-4 pt-6 pb-8 max-w-lg mx-auto">
      <h1 className="text-lg font-bold text-foreground mb-1">Learn</h1>
      <p className="text-xs text-muted-foreground mb-5">
        {currentIndex + 1} of {SECTIONS.length}
      </p>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-5">
        {SECTIONS.map((s, i) => (
          <div
            key={s.id}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i === currentIndex
                ? "bg-primary"
                : completedSections.includes(s.id)
                  ? "bg-stable"
                  : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-5 min-h-[320px]">
        <div className="flex items-center gap-2 mb-4">
          {completedSections.includes(section.id) && (
            <CheckCircle2 className="w-4 h-4 text-stable" />
          )}
          <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
        </div>

        <div className="space-y-3 mb-6">
          {section.content.map((text, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">{text}</p>
          ))}
        </div>

        {section.quiz && (
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground mb-3">{section.quiz.question}</p>
            <div className="space-y-2">
              {section.quiz.options.map((opt, i) => {
                let style = "bg-secondary text-secondary-foreground";
                if (showResult && i === section.quiz!.correct) {
                  style = "bg-stable/20 text-stable border-stable/30";
                } else if (showResult && i === selectedAnswer && i !== section.quiz!.correct) {
                  style = "bg-destructive/20 text-destructive border-destructive/30";
                }
                return (
                  <button
                    key={i}
                    onClick={() => !showResult && handleAnswer(i)}
                    disabled={showResult}
                    className={`w-full text-left text-sm px-4 py-2.5 rounded-xl border border-transparent transition-colors ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {showResult && (
              <p className={`text-xs mt-3 ${selectedAnswer === section.quiz.correct ? "text-stable" : "text-destructive"}`}>
                {selectedAnswer === section.quiz.correct ? "Correct! ✓" : "Not quite. The correct answer is highlighted."}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={goPrev} disabled={currentIndex === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button variant="default" size="sm" onClick={goNext} disabled={currentIndex === SECTIONS.length - 1}>
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
