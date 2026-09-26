import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Compass, RotateCcw } from 'lucide-react';
import {
  calculateResults,
  QUESTIONS,
  type DirectionId,
} from './data/careerCompass';

type Screen = 'welcome' | 'quiz' | 'results';

function BrandHeader() {
  return (
    <header className="cc-header">
      <div className="cc-mark" aria-label="Career Compass">
        <span className="cc-mark-symbol" aria-hidden="true">
          <Compass size={18} strokeWidth={1.8} />
        </span>
        <span>Career Compass</span>
      </div>
      <span className="cc-header-note">A guided starting point</span>
    </header>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="cc-main">
      <section className="cc-welcome-grid" aria-labelledby="welcome-title">
        <div>
          <span className="cc-kicker">Make room for curiosity</span>
          <h1 className="cc-title" id="welcome-title">
            Find a direction
            <br />
            worth <em>exploring.</em>
          </h1>
          <p className="cc-lead">
            Answer eight quick questions about what sounds interesting to you. Career Compass
            helps you notice patterns and turn them into a few possible next steps.
          </p>
          <div className="cc-actions">
            <button
              type="button"
              className="cc-primary-btn"
              onClick={onStart}
              data-testid="button-start-quiz"
            >
              Start the quiz
              <ArrowRight size={17} aria-hidden="true" />
            </button>
            <span className="cc-microcopy">About 2 minutes · no sign-in needed</span>
          </div>
          <p className="cc-microcopy" style={{ marginTop: '1.25rem', maxWidth: '27rem' }}>
            This is a reflection tool, not a prediction or professional assessment. There is no
            “right” answer.
          </p>
        </div>

        <div className="cc-compass-card" aria-label="A compass illustration">
          <span className="cc-compass-label top">NOTICE</span>
          <span className="cc-compass-label bottom">EXPLORE</span>
          <span className="cc-compass-label left">ASK</span>
          <span className="cc-compass-label right">TRY</span>
          <div className="cc-compass-illustration" aria-hidden="true">
            <span className="cc-compass-arrow" />
          </div>
        </div>
      </section>
    </main>
  );
}

function QuizScreen({
  answers,
  questionIndex,
  onAnswer,
  onBack,
  onNext,
}: {
  answers: Array<DirectionId | null>;
  questionIndex: number;
  onAnswer: (directionId: DirectionId) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [showRequired, setShowRequired] = useState(false);
  const question = QUESTIONS[questionIndex];
  const selectedAnswer = answers[questionIndex];
  const progress = ((questionIndex + 1) / QUESTIONS.length) * 100;

  const chooseAnswer = (directionId: DirectionId) => {
    setShowRequired(false);
    onAnswer(directionId);
  };

  const advance = () => {
    if (!selectedAnswer) {
      setShowRequired(true);
      return;
    }
    onNext();
  };

  return (
    <main className="cc-main">
      <div className="cc-page-heading">
        <span className="cc-kicker">Your quick compass</span>
        <h1>Follow what catches your attention.</h1>
        <p>
          Choose the answer that feels most interesting right now. You can always go back and
          change your mind.
        </p>
      </div>

      <section className="cc-quiz-card" aria-labelledby="question-title">
        <div className="cc-quiz-meta">
          <span data-testid="text-question-count">
            Question {questionIndex + 1} of {QUESTIONS.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div
          className="cc-progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={QUESTIONS.length}
          aria-valuenow={questionIndex + 1}
          aria-label={`Question ${questionIndex + 1} of ${QUESTIONS.length}`}
        >
          <div className="cc-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <h2 className="cc-question" id="question-title" key={questionIndex}>
          {question.question}
        </h2>

        <div className="cc-answer-list" role="radiogroup" aria-labelledby="question-title">
          {question.answers.map((answer, answerIndex) => {
            const selected = selectedAnswer === answer.directionId;
            return (
              <button
                type="button"
                className={`cc-answer${selected ? ' selected' : ''}`}
                key={answer.directionId}
                onClick={() => chooseAnswer(answer.directionId)}
                role="radio"
                aria-checked={selected}
                data-testid={`button-answer-${questionIndex + 1}-${answerIndex + 1}`}
              >
                <span className="cc-answer-marker" aria-hidden="true">
                  {selected ? <Check size={14} strokeWidth={2.7} /> : String.fromCharCode(65 + answerIndex)}
                </span>
                <span>{answer.text}</span>
              </button>
            );
          })}
        </div>

        <div className="cc-quiz-footer">
          <button
            type="button"
            className="cc-back-btn"
            onClick={onBack}
            disabled={questionIndex === 0}
            data-testid="button-back-question"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back
          </button>
          <div style={{ textAlign: 'right' }}>
            {showRequired && (
              <p
                role="alert"
                data-testid="status-answer-required"
                style={{ color: '#b74d47', fontSize: '0.78rem', margin: '0 0 0.45rem' }}
              >
                Choose one to continue.
              </p>
            )}
            <button
              type="button"
              className="cc-primary-btn"
              onClick={advance}
              data-testid={questionIndex === QUESTIONS.length - 1 ? 'button-see-results' : 'button-next-question'}
            >
              {questionIndex === QUESTIONS.length - 1 ? 'See my directions' : 'Next'}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ResultsScreen({ answers, onRestart }: { answers: Array<DirectionId | null>; onRestart: () => void }) {
  const results = useMemo(() => calculateResults(answers), [answers]);
  const topScore = results[0]?.normalized ?? 0;
  const leaders = results.filter((result) => result.normalized === topScore);
  const nextDirection = results.find((result) => result.normalized < topScore) ?? results[0];
  const leaderNames = leaders.map((leader) => leader.name).join(' and ');

  return (
    <main className="cc-main">
      <section className="cc-results-header" aria-labelledby="results-title">
        <span className="cc-kicker">Your pattern, not a prescription</span>
        <h1 id="results-title">
          {leaders.length > 1 ? 'A few directions stand out.' : 'A direction to explore.'}
        </h1>
        <p>
          Your answers suggest some themes worth trying on for size. Think of these as invitations
          to learn more, not a definitive career choice.
        </p>
      </section>

      <div className="cc-results-grid">
        <div>
          <article className="cc-feature-card" data-testid="card-leading-direction">
            <span className="cc-feature-label">
              {leaders.length > 1 ? 'Co-leading directions' : 'Strongest relative fit'}
            </span>
            <h2 className="cc-feature-title" data-testid="text-leading-direction">
              {leaderNames}
            </h2>
            <p className="cc-feature-description">
              {leaders.length > 1
                ? 'Your choices landed in more than one place equally. That mix is useful: look for projects where these interests can meet.'
                : leaders[0].description}
            </p>
          </article>

          <article className="cc-secondary-result" data-testid="card-second-direction">
            <span className="cc-feature-label">Another direction to explore</span>
            <h2 data-testid="text-second-direction">{nextDirection.name}</h2>
            <p>{nextDirection.description}</p>
          </article>
        </div>

        <section className="cc-score-card" aria-labelledby="scores-title">
          <h2 id="scores-title">Your full compass</h2>
          <p className="cc-score-note">
            Relative fit is your points divided by the number of questions that offered this
            direction. This keeps categories comparable.
          </p>
          {results.map((result) => {
            const percentage = Math.round(result.normalized * 100);
            const leading = result.normalized === topScore;
            return (
              <div className={`cc-score-row${leading ? ' leading' : ''}`} key={result.id} data-testid={`row-score-${result.id}`}>
                <div className="cc-score-row-top">
                  <span>{result.name}</span>
                  <strong>{percentage}%</strong>
                </div>
                <div className="cc-score-track" aria-hidden="true">
                  <div className="cc-score-fill" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <div className="cc-results-actions">
        <p className="cc-microcopy">Small experiments are a good next step: follow one curiosity and see where it leads.</p>
        <button type="button" className="cc-primary-btn" onClick={onRestart} data-testid="button-take-quiz-again">
          <RotateCcw size={16} aria-hidden="true" />
          Take the quiz again
        </button>
      </div>
      <p className="cc-honesty-note">
        Career Compass is designed for reflection and exploration. Scores are relative to the
        answer opportunities in this quiz, not a measure of ability or future success.
      </p>
    </main>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<DirectionId | null>>(() =>
    Array.from({ length: QUESTIONS.length }, () => null),
  );

  const startQuiz = () => {
    setQuestionIndex(0);
    setAnswers(Array.from({ length: QUESTIONS.length }, () => null));
    setScreen('quiz');
  };

  const selectAnswer = (directionId: DirectionId) => {
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = directionId;
      return next;
    });
  };

  const goNext = () => {
    if (questionIndex === QUESTIONS.length - 1) {
      setScreen('results');
      return;
    }
    setQuestionIndex((current) => current + 1);
  };

  const goBack = () => {
    setQuestionIndex((current) => Math.max(0, current - 1));
  };

  return (
    <div className="cc-shell">
      <BrandHeader />
      {screen === 'welcome' && <WelcomeScreen onStart={startQuiz} />}
      {screen === 'quiz' && (
        <QuizScreen
          answers={answers}
          questionIndex={questionIndex}
          onAnswer={selectAnswer}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {screen === 'results' && <ResultsScreen answers={answers} onRestart={startQuiz} />}
    </div>
  );
}

export default App;