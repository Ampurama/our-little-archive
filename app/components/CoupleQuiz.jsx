"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Heart, PencilLine, Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { STARTER_QUESTIONS } from "../data";
import useStoredState from "../hooks/useStoredState";

export default function CoupleQuiz() {
  const [questions, setQuestions] = useStoredState("ruang-kita-quiz", STARTER_QUESTIONS);
  const [pointerTilt, setPointerTilt] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState("idle");
  const [editing, setEditing] = useState(false);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const currentQuestion = questions[index];
  const starterSignature = JSON.stringify(STARTER_QUESTIONS);

  useEffect(() => {
    const signatureKey = "ruang-kita-quiz-starter-signature-v3";
    try {
      if (window.localStorage.getItem(signatureKey) === starterSignature) return;
      const saved = JSON.parse(window.localStorage.getItem("ruang-kita-quiz") || "[]");
      const starterIds = new Set(STARTER_QUESTIONS.map((question) => question.id));
      const customQuestions = saved.filter((question) => !starterIds.has(question.id));
      const migratedQuestions = [...STARTER_QUESTIONS, ...customQuestions];
      window.localStorage.setItem("ruang-kita-quiz", JSON.stringify(migratedQuestions));
      setQuestions(migratedQuestions);
      window.localStorage.setItem(signatureKey, starterSignature);
    } catch {}
  }, [setQuestions, starterSignature]);

  function trackPointer(event) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointerTilt({
      x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -4,
      y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 5,
    });
  }

  function updateQuestion(questionId, updater) {
    setQuestions((current) => current.map((question) => question.id === questionId ? updater(question) : question));
  }

  function startQuiz() {
    if (!questions.length || questions.some((question) => !question.question.trim() || question.options.some((option) => !option.trim()))) return;
    setScore(0);
    setIndex(0);
    setChoice(null);
    setMode("play");
  }

  function advanceQuiz() {
    if (choice === null) return;
    const nextScore = score + (choice === questions[index].correctIndex ? 1 : 0);
    setScore(nextScore);
    if (index === questions.length - 1) {
      setFinalScore(nextScore);
      setMode("done");
      return;
    }
    setIndex((current) => current + 1);
    setChoice(null);
  }

  return (
    <section className="feature-view quiz-view" style={{ "--quiz-tilt-x": `${pointerTilt.x}deg`, "--quiz-tilt-y": `${pointerTilt.y}deg` }} onPointerMove={trackPointer} onPointerLeave={() => setPointerTilt({ x: 0, y: 0 })}>
      <div className="feature-heading">
        <div><p className="eyebrow">03 <span className="eyebrow-rule" /> EDISI KENANGAN</p><h1>Seberapa kenal <em>kita?</em></h1></div>
        <button className="quiet-button quiz-edit-button" onClick={() => { setEditing((value) => !value); setMode("idle"); }}>
          {editing ? <Check size={15} /> : <PencilLine size={15} />} {editing ? "Selesai mengatur" : "Atur pertanyaan"}
        </button>
      </div>

      {editing ? (
        <div className="quiz-editor">
          <div className="editor-intro"><Sparkles size={17} /><p>Ubah pertanyaan dan jawaban supaya cuma kalian yang tahu mana yang benar.</p></div>
          {questions.map((question, questionIndex) => (
            <fieldset className="question-editor" key={question.id}>
              <legend>PERTANYAAN {String(questionIndex + 1).padStart(2, "0")}</legend>
              <input className="question-input" value={question.question} onChange={(event) => updateQuestion(question.id, (item) => ({ ...item, question: event.target.value }))} aria-label={`Pertanyaan ${questionIndex + 1}`} />
              {question.options.map((option, optionIndex) => (
                <label className="option-editor" key={optionIndex}>
                  <input type="radio" name={`correct-${question.id}`} checked={question.correctIndex === optionIndex} onChange={() => updateQuestion(question.id, (item) => ({ ...item, correctIndex: optionIndex }))} aria-label={`Tandai jawaban ${optionIndex + 1} sebagai benar`} />
                  <input value={option} onChange={(event) => updateQuestion(question.id, (item) => ({ ...item, options: item.options.map((answer, answerIndex) => answerIndex === optionIndex ? event.target.value : answer) }))} aria-label={`Jawaban ${optionIndex + 1}`} />
                </label>
              ))}
              <button type="button" className="delete-question" onClick={() => setQuestions((current) => current.filter((item) => item.id !== question.id))}><Trash2 size={13} /> Hapus pertanyaan</button>
            </fieldset>
          ))}
          <button type="button" className="add-question-button" onClick={() => setQuestions((current) => [...current, { id: `q${Date.now()}`, question: "Pertanyaan baru", options: ["Jawaban A", "Jawaban B", "Jawaban C"], correctIndex: 0 }])}><Plus size={15} /> Tambah pertanyaan</button>
        </div>
      ) : mode === "done" ? (
        <div className="quiz-result">
          <span className="result-sparkle"><Heart size={26} fill="currentColor" /></span>
          <p className="eyebrow">HASIL KUIS KALIAN</p>
          <div className="result-score">{finalScore}<span>/{questions.length}</span></div>
          <h2>{finalScore === questions.length ? "Wah, hafal di luar kepala." : finalScore >= questions.length / 2 ? "Lumayan kenal, lanjutkan kencannya." : "Saatnya bikin lebih banyak cerita."}</h2>
          <p>Yang penting, selalu ada hal baru untuk dipelajari tentang satu sama lain.</p>
          <button className="primary-button" onClick={() => setMode("idle")}>Main lagi <RotateCcw size={15} /></button>
        </div>
      ) : mode === "play" && currentQuestion ? (
        <div className="quiz-card">
          <div className="quiz-progress"><span>PERTANYAAN {String(index + 1).padStart(2, "0")}</span><span>{String(questions.length).padStart(2, "0")}</span><div><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div></div>
          <h2 key={index}>{currentQuestion.question}</h2>
          <div className="quiz-options">{currentQuestion.options.map((option, optionIndex) => <button key={optionIndex} className={`quiz-option ${choice === optionIndex ? "chosen" : ""}`} onClick={() => setChoice(optionIndex)}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>{option}{choice === optionIndex && <Check size={16} />}</button>)}</div>
          <button className="primary-button" disabled={choice === null} onClick={advanceQuiz}>{index === questions.length - 1 ? "Lihat hasil" : "Lanjut"} <ArrowRight size={15} /></button>
        </div>
      ) : (
        <div className="quiz-intro">
          <div className="quiz-stamp"><Sparkles size={34} strokeWidth={1.3} /><span>{questions.length} PERTANYAAN<br />TENTANG KITA</span></div>
          <div className="quiz-start-copy"><p className="eyebrow">TIDAK ADA NILAI RAPOR</p><h2>Yang penting<br /><em>ingat ceritanya.</em></h2><p>Pilih jawaban yang paling cocok. Pertanyaannya bisa kalian ubah dulu supaya makin personal.</p><button className="primary-button" disabled={!questions.length} onClick={startQuiz}>Mulai kuis <ArrowRight size={16} /></button></div>
        </div>
      )}
      {!editing && mode === "idle" && <p className="quiz-demo-note">Pertanyaan contoh bisa disesuaikan lewat tombol “Atur pertanyaan”.</p>}
    </section>
  );
}
