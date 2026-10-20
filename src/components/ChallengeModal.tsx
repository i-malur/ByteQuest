import { useState, useEffect, useCallback } from 'react';
import {
  type Challenge,
  type QuizChallenge,
  type CodeChallenge,
  type LanguageId,
  getChallenge,
  getLanguage,
} from '../data/challenges';
import { X, CheckCircle2, XCircle, Lightbulb, Trophy } from 'lucide-react';

interface ChallengeModalProps {
  open: boolean;
  language: LanguageId;
  challengeIndex: number;
  kind: 'terminal' | 'bug';
  onClose: () => void;
  onAnswer: (correct: boolean) => void;
}

export default function ChallengeModal({
  open,
  language,
  challengeIndex,
  kind,
  onClose,
  onAnswer,
}: ChallengeModalProps) {
  const challenge = getChallenge(language, challengeIndex);
  const lang = getLanguage(language);

  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [blankAnswers, setBlankAnswers] = useState<string[]>([]);
  const [codeRevealed, setCodeRevealed] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected(null);
      setRevealed(false);
      setCodeRevealed(false);
      if (challenge?.kind === 'code') {
        setBlankAnswers(new Array((challenge as CodeChallenge).blanks.length).fill(''));
      } else {
        setBlankAnswers([]);
      }
    }
  }, [open, challengeIndex, language, challenge]);

  const submitQuiz = useCallback(
    (idx: number) => {
      if (revealed || !challenge || challenge.kind !== 'quiz') return;
      setSelected(idx);
      setRevealed(true);
      const correct = idx === (challenge as QuizChallenge).correctIndex;
      onAnswer(correct);
    },
    [revealed, challenge, onAnswer],
  );

  const submitCode = useCallback(() => {
    if (codeRevealed || !challenge || challenge.kind !== 'code') return;
    const code = challenge as CodeChallenge;
    const allCorrect = code.blanks.every((blank, i) => {
      const val = (blankAnswers[i] ?? '').trim().toLowerCase();
      const accepted = [blank.answer, ...(blank.alternatives ?? [])].map((s) => s.toLowerCase());
      return accepted.includes(val);
    });
    setCodeRevealed(true);
    onAnswer(allCorrect);
  }, [codeRevealed, challenge, blankAnswers, onAnswer]);

  if (!open || !challenge) return null;

  const isBug = kind === 'bug';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl rounded-2xl border-2 shadow-2xl overflow-hidden"
        style={{ borderColor: lang.color, background: '#0f172a' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ background: lang.color, color: lang.accent }}
        >
          <div className="flex items-center gap-2 font-bold">
            <span className="text-lg">{lang.icon}</span>
            <span>{lang.name}</span>
            <span className="text-xs opacity-80 font-normal">
              · {isBug ? 'Combate de Bug' : 'Terminal'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="opacity-80 hover:opacity-100 transition"
            style={{ color: lang.accent }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {challenge.kind === 'quiz' ? (
            <QuizView
              challenge={challenge as QuizChallenge}
              selected={selected}
              revealed={revealed}
              onSelect={submitQuiz}
            />
          ) : (
            <CodeView
              challenge={challenge as CodeChallenge}
              blankAnswers={blankAnswers}
              setBlankAnswers={setBlankAnswers}
              revealed={codeRevealed}
              onSubmit={submitCode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function QuizView({
  challenge,
  selected,
  revealed,
  onSelect,
}: {
  challenge: QuizChallenge;
  selected: number | null;
  revealed: boolean;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-semibold text-slate-100 leading-snug">
        {challenge.question}
      </div>
      <div className="grid gap-2">
        {challenge.options.map((opt, i) => {
          const isCorrect = i === challenge.correctIndex;
          const isSelected = i === selected;
          let cls = 'border-slate-600 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200';
          if (revealed) {
            if (isCorrect) cls = 'border-emerald-500 bg-emerald-500/15 text-emerald-300';
            else if (isSelected) cls = 'border-red-500 bg-red-500/15 text-red-300';
            else cls = 'border-slate-700 bg-slate-800/30 text-slate-400';
          }
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => onSelect(i)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition ${cls} ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="font-mono text-sm">{opt}</span>
              {revealed && isCorrect && <CheckCircle2 size={18} className="ml-auto text-emerald-400" />}
              {revealed && isSelected && !isCorrect && <XCircle size={18} className="ml-auto text-red-400" />}
            </button>
          );
        })}
      </div>
      {revealed && <Explanation text={challenge.explanation} correct={selected === challenge.correctIndex} />}
    </div>
  );
}

function CodeView({
  challenge,
  blankAnswers,
  setBlankAnswers,
  revealed,
  onSubmit,
}: {
  challenge: CodeChallenge;
  blankAnswers: string[];
  setBlankAnswers: (v: string[]) => void;
  revealed: boolean;
  onSubmit: () => void;
}) {
  const allFilled = blankAnswers.every((a) => a.trim().length > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-slate-300">{challenge.prompt}</div>

      {/* Terminal-style code block */}
      <div className="rounded-xl bg-slate-950 border border-slate-700 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 border-b border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-slate-400 font-mono">bytequest@terminal</span>
        </div>
        <div className="p-4 font-mono text-sm leading-relaxed">
          <CodeWithBlanks
            template={challenge.template}
            blankAnswers={blankAnswers}
            setBlankAnswers={setBlankAnswers}
            revealed={revealed}
            blanks={challenge.blanks}
          />
        </div>
      </div>

      {!revealed && (
        <button
          disabled={!allFilled}
          onClick={onSubmit}
          className="self-end px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 border border-cyan-400 text-white font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Verificar resposta
        </button>
      )}

      {revealed && (
        <Explanation
          text={challenge.explanation}
          correct={challenge.blanks.every((blank, i) => {
            const val = (blankAnswers[i] ?? '').trim().toLowerCase();
            const accepted = [blank.answer, ...(blank.alternatives ?? [])].map((s) => s.toLowerCase());
            return accepted.includes(val);
          })}
        />
      )}
    </div>
  );
}

function CodeWithBlanks({
  template,
  blankAnswers,
  setBlankAnswers,
  revealed,
  blanks,
}: {
  template: string;
  blankAnswers: string[];
  setBlankAnswers: (v: string[]) => void;
  revealed: boolean;
  blanks: CodeChallenge['blanks'];
}) {
  const parts = template.split('___');

  return (
    <pre className="text-slate-200 whitespace-pre-wrap break-words">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <BlankInput
              value={blankAnswers[i] ?? ''}
              onChange={(v) => {
                const next = [...blankAnswers];
                next[i] = v;
                setBlankAnswers(next);
              }}
              revealed={revealed}
              correctAnswer={blanks[i]?.answer ?? ''}
              disabled={revealed}
            />
          )}
        </span>
      ))}
    </pre>
  );
}

function BlankInput({
  value,
  onChange,
  revealed,
  correctAnswer,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  revealed: boolean;
  correctAnswer: string;
  disabled: boolean;
}) {
  const isCorrect = value.trim().toLowerCase() === correctAnswer.toLowerCase();
  let border = 'border-cyan-500/60';
  let bg = 'bg-cyan-500/10';
  if (revealed) {
    if (isCorrect) { border = 'border-emerald-500'; bg = 'bg-emerald-500/15'; }
    else { border = 'border-red-500'; bg = 'bg-red-500/15'; }
  }
  return (
    <input
      type="text"
      value={revealed && !isCorrect ? correctAnswer : value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`inline-block min-w-[80px] px-2 py-0.5 mx-0.5 rounded border-2 ${border} ${bg} text-cyan-200 font-mono text-sm outline-none focus:ring-2 focus:ring-cyan-400/40 transition`}
      style={{ width: `${Math.max(80, (revealed && !isCorrect ? correctAnswer : value).length * 8 + 20)}px` }}
    />
  );
}

function Explanation({ text, correct }: { text: string; correct: boolean }) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        correct
          ? 'border-emerald-500/40 bg-emerald-500/10'
          : 'border-amber-500/40 bg-amber-500/10'
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {correct ? (
          <Trophy size={18} className="text-emerald-400" />
        ) : (
          <Lightbulb size={18} className="text-amber-400" />
        )}
        <span className={`font-bold text-sm ${correct ? 'text-emerald-300' : 'text-amber-300'}`}>
          {correct ? 'Correto! +10 pontos' : 'Resposta incorreta'}
        </span>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
    </div>
  );
}
