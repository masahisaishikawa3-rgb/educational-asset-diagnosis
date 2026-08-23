import { useEffect, useMemo, useState } from 'react'
import { axisLabels, links, questions, recommendations } from './config/diagnosis'
import { track } from './lib/analytics'
import { calculateDiagnosis } from './lib/diagnosis'
import { clearAnswers, loadAnswers, saveAnswers } from './lib/session'
import type { Answers, Axis, DiagnosisResult } from './types'

type Screen = 'landing' | 'question' | 'result'

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>(() => loadAnswers())
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    track('diagnosis_view')
  }, [])

  useEffect(() => {
    saveAnswers(answers)
  }, [answers])

  const currentQuestion = questions[questionIndex]
  const currentAnswer = answers[currentQuestion?.id]

  function startDiagnosis() {
    setScreen('question')
    setQuestionIndex(0)
    setError('')
    track('diagnosis_start')
  }

  function chooseAnswer(score: number) {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: score }))
    track('diagnosis_answer', { question_id: currentQuestion.id, answer_score: score })
  }

  function goNext() {
    if (!currentAnswer) return
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1)
      return
    }

    try {
      const nextResult = calculateDiagnosis(answers)
      setResult(nextResult)
      setScreen('result')
      setError('')
      track('diagnosis_complete', {
        level: nextResult.level.level,
        diagnosis_type: nextResult.primaryType.name,
        total_score: nextResult.totalScore,
      })
      window.scrollTo({ top: 0, behavior: 'instant' })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '診断結果を計算できませんでした。')
    }
  }

  function restart() {
    clearAnswers()
    setAnswers({})
    setResult(null)
    setQuestionIndex(0)
    setError('')
    setScreen('landing')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (screen === 'landing') return <Landing onStart={startDiagnosis} />

  if (screen === 'question') {
    return (
      <QuestionScreen
        index={questionIndex}
        answers={answers}
        error={error}
        onAnswer={chooseAnswer}
        onBack={() => questionIndex === 0 ? setScreen('landing') : setQuestionIndex((index) => index - 1)}
        onNext={goNext}
      />
    )
  }

  return result ? <ResultScreen result={result} onRestart={restart} /> : <Recovery onRestart={restart} />
}

function Brand() {
  return (
    <div className="brand" aria-label="教育資産化ラボ">
      <span className="brand-mark" aria-hidden="true">A</span>
      <span><strong>ADOP CONTEXT</strong><small>教育資産化ラボ</small></span>
    </div>
  )
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="landing-shell">
      <header className="site-header"><Brand /><span className="header-note">現在地を知る、最初の3分</span></header>
      <section className="hero">
        <div className="eyebrow"><span /> 教育資産化診断</div>
        <h1>御社の社内知識は、<br /><em>「教育資産」</em>として<br className="mobile-only" />活用できていますか？</h1>
        <p className="hero-lead">12問・約3分で、社内知識の現在地を整理します。</p>

        <div className="outcomes" aria-label="診断でわかること">
          <div><span>01</span><p>教育資産化の<br />現在地</p></div>
          <div><span>02</span><p>現在の<br />ボトルネック</p></div>
          <div><span>03</span><p>次に取り組む<br />べきこと</p></div>
        </div>

        <button className="primary-button hero-button" onClick={onStart}>診断を始める <span>→</span></button>
        <p className="privacy-note"><span>✓</span> 個人情報の入力は不要です</p>
      </section>

      <section className="definition">
        <p className="section-kicker">WHAT IS EDUCATIONAL ASSET?</p>
        <div>
          <h2>教育資産化とは？</h2>
          <p>社内資料やノウハウを、社員が理解し、判断や行動に生かせる形に整え、継続的に活用できる状態にすることです。</p>
        </div>
      </section>
    </main>
  )
}

function QuestionScreen({ index, answers, error, onAnswer, onBack, onNext }: {
  index: number
  answers: Answers
  error: string
  onAnswer: (score: number) => void
  onBack: () => void
  onNext: () => void
}) {
  const question = questions[index]
  const answer = answers[question.id]
  const progress = ((index + 1) / questions.length) * 100

  return (
    <main className="question-shell">
      <header className="question-header">
        <Brand />
        <span className="question-count"><strong>{String(index + 1).padStart(2, '0')}</strong> / {questions.length}</span>
      </header>
      <div className="progress-track" aria-label={`進捗 ${index + 1}/${questions.length}`}><span style={{ width: `${progress}%` }} /></div>

      <section className="question-content">
        <p className="axis-label"><span>{question.axis}</span> {axisLabels[question.axis]}</p>
        <h1>{question.prompt}</h1>
        <div className="answer-list" role="radiogroup" aria-label={question.prompt}>
          {question.options.map((option, optionIndex) => {
            const selected = answer === option.score
            return (
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                className={`answer-card ${selected ? 'selected' : ''}`}
                key={option.score}
                onClick={() => onAnswer(option.score)}
              >
                <span className="answer-letter">{String.fromCharCode(65 + optionIndex)}</span>
                <span className="answer-text">{option.label}</span>
                <span className="radio-dot" aria-hidden="true" />
              </button>
            )
          })}
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
      </section>

      <footer className="question-actions">
        <button className="text-button" onClick={onBack}>← 戻る</button>
        <button className="primary-button next-button" onClick={onNext} disabled={!answer}>
          {index === questions.length - 1 ? '診断結果を見る' : '次へ'} <span>→</span>
        </button>
      </footer>
    </main>
  )
}

function ResultScreen({ result, onRestart }: { result: DiagnosisResult; onRestart: () => void }) {
  const articles = recommendations[result.primaryType.axis] ?? []
  const secondaryLabel = result.secondaryWeakTypes.map((type) => `「${axisLabels[type.axis]}」`).join('、')

  return (
    <main className="result-shell">
      <header className="site-header result-header"><Brand /><button className="text-button" onClick={onRestart}>診断をやり直す</button></header>

      <section className="result-hero">
        <p className="result-kicker">DIAGNOSIS RESULT</p>
        <p className="result-overline">御社の教育資産化レベル</p>
        <div className="level-lockup">
          <span>LEVEL</span><strong>{result.level.level}</strong>
        </div>
        <h1>{result.level.name}</h1>
        <p>{result.level.description}</p>
        <a className="scroll-hint" href="#detail">もう少し詳しく見る <span>↓</span></a>
      </section>

      <section className="result-section detail-section" id="detail">
        <div className="section-heading">
          <p className="section-number">01</p><div><p className="section-kicker">CURRENT STATE</p><h2>教育資産化の4つの状態</h2></div>
        </div>
        <div className="score-layout">
          <div className="axis-bars">
            {(Object.keys(axisLabels) as Axis[]).map((axis) => (
              <div className="axis-row" key={axis}>
                <div className="axis-row-label"><span>{axisLabels[axis]}</span><strong>{result.axisScores[axis]} <small>/ 12</small></strong></div>
                <div className="axis-track"><span style={{ width: `${(result.axisScores[axis] / 12) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <aside className="bottleneck-card">
            <p>現在の最大ボトルネック</p>
            <span className="type-badge">TYPE {result.primaryType.axis}</span>
            <h3>{axisLabels[result.primaryType.axis]}</h3>
            <strong>{result.primaryType.heading}</strong>
            <p>{result.primaryType.description}</p>
            {secondaryLabel && <p className="secondary-note">{secondaryLabel}にも同程度の改善余地があります。</p>}
          </aside>
        </div>
      </section>

      <section className="result-section prescription-section">
        <div className="section-heading">
          <p className="section-number">02</p><div><p className="section-kicker">FIRST STEPS</p><h2>まず取り組む3つ</h2></div>
        </div>
        <div className="action-list">
          {result.primaryType.actions.map((action, index) => (
            <article key={action}><span>{String(index + 1).padStart(2, '0')}</span><h3>{action}</h3></article>
          ))}
        </div>
      </section>

      <section className="result-section recommendation-section">
        <div className="section-heading">
          <p className="section-number">03</p><div><p className="section-kicker">RECOMMENDED</p><h2>今の御社におすすめの記事</h2></div>
        </div>
        {articles.length > 0 ? (
          <div className="article-grid">
            {articles.map((article) => (
              <article className="article-card" key={article.title}>
                <p className="candidate-label">おすすめ記事</p>
                <h3>{article.title}</h3>
                <p>{article.reason}</p>
                <a href={article.url} target="_blank" rel="noreferrer" onClick={() => track('diagnosis_recommendation_click', { diagnosis_type: result.primaryType.name, article_url: article.url })}>記事を読む →</a>
              </article>
            ))}
          </div>
        ) : <div className="pending-card"><p>この記事は現在選定中です。</p><span>正式な記事が決まり次第、ここに表示されます。</span></div>}
      </section>

      <section className="next-action-section">
        <p className="section-kicker light">NEXT ACTION</p>
        <h2>次は、実際の社内資料で<br />確認してみる</h2>
        <p>御社で使っているPDF・Word・PowerPointを使い、「読む資料」がどのように「学べる教育資産」へ変わるか確認できます。</p>
        <button className="light-button" disabled={!links.primaryCta} onClick={() => track('diagnosis_primary_cta_click', { level: result.level.level, diagnosis_type: result.primaryType.name })}>自社資料で教育資産化を試す <span>→</span></button>
        {!links.primaryCta && <small>正式な体験導線は現在準備中です</small>}
      </section>

      <section className="secondary-action">
        <p>教育資産化そのものをもう少し知りたい方へ</p>
        <a href={links.secondaryCta} target="_blank" rel="noreferrer" onClick={() => track('diagnosis_secondary_cta_click')}>教育資産化について詳しく読む →</a>
      </section>
    </main>
  )
}

function Recovery({ onRestart }: { onRestart: () => void }) {
  return <main className="recovery"><Brand /><h1>診断結果を表示できませんでした</h1><p>回答が揃っていない可能性があります。最初からもう一度お試しください。</p><button className="primary-button" onClick={onRestart}>最初からやり直す</button></main>
}

export default App
