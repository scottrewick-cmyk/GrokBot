import { useMemo, useState } from "react";
import { DemoBanner, LanderFoot, SoftCta } from "./shared.jsx";

export function QuizLander({ brief, onCta }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = brief.quizQuestions;
  const done = step >= questions.length;
  const current = questions[step];

  const summary = useMemo(() => {
    return questions
      .map((q) => {
        const opt = q.options.find((o) => o.id === answers[q.id]);
        return opt ? opt.label : null;
      })
      .filter(Boolean);
  }, [answers, questions]);

  return (
    <article className="lp lp-quiz">
      <DemoBanner>Marketing demo · not a diagnosis · not medical advice</DemoBanner>
      <p className="lp-stubchip">Condensed outline · quiz family</p>

      <header className="lp-quiz__head">
        <p className="lp-kicker">A hallway consult</p>
        <h1>{brief.quizHeadline}</h1>
        <p className="lp-dek">{brief.quizDek}</p>
      </header>

      <div className="lp-quiz__progress" aria-hidden="true">
        {questions.map((q, i) => (
          <span key={q.id} className={i <= step ? "is-on" : undefined} />
        ))}
      </div>

      {!done ? (
        <section className="lp-quiz__card">
          <p className="lp-quiz__step">
            Question {step + 1} of {questions.length}
          </p>
          <h2>{current.prompt}</h2>
          <div className="lp-quiz__opts">
            {current.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={answers[current.id] === opt.id ? "is-picked" : undefined}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, [current.id]: opt.id }));
                  setStep((s) => s + 1);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="lp-quiz__result">
          <h2>{brief.quizResultTitle}</h2>
          <p>{brief.quizResultBody}</p>
          {summary.length > 0 && (
            <ul className="lp-quiz__echo">
              {summary.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
          <SoftCta brief={brief} onCta={onCta} />
          <button
            type="button"
            className="lp-quiz__reset"
            onClick={() => {
              setStep(0);
              setAnswers({});
            }}
          >
            Ask again
          </button>
        </section>
      )}

      <LanderFoot brief={brief} />
    </article>
  );
}
