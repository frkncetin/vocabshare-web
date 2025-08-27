import React, { useEffect, useState } from 'react'
import { db } from './firebase'
import { ref, onValue, push, set, update, remove } from 'firebase/database'

function normalize(input) {
  return input.trim().toLowerCase().replace(/^(der|die|das)\s+/, '')
}

function weightFor(w) {
  const s = w.score || 0
  return 1 / (1 + s)
}

export default function App() {
  const [room, setRoom] = useState('demo')
  const [words, setWords] = useState([])
  const [tab, setTab] = useState('list')

  const [term, setTerm] = useState('')
  const [translation, setTranslation] = useState('')
  const [example, setExample] = useState('')

  const [editing, setEditing] = useState(null)

  const [current, setCurrent] = useState(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)

  const [search, setSearch] = useState('') // 🔎 arama filtresi

  useEffect(() => {
    const r = ref(db, `rooms/${room}/words`)
    return onValue(r, (snap) => {
      const val = snap.val() || {}
      const arr = Object.entries(val).map(([id, v]) => ({ id, ...v }))
      arr.sort((a,b) =>
        normalize(a.term).localeCompare(normalize(b.term))
      )
      setWords(arr)
    })
  }, [room])

  const resetForm = () => {
    setTerm(''); setTranslation(''); setExample('')
  }

  const addWord = () => {
    const t = term.trim()
    const tr = translation.trim()
    const ex = example.trim()
    if (!t || !tr || !ex) {
      alert('Kelime, çeviri ve örnek zorunlu')
      return
    }
    const key = normalize(t)
    const exists = words.some(w => normalize(w.term) === key)
    if (exists) {
      alert('Bu kelime zaten var')
      return
    }
    const w = { term: t, translation: tr, example: ex, score: 0, createdAt: Date.now() }
    const node = push(ref(db, `rooms/${room}/words`))
    set(node, w)
    resetForm()
  }

  const pickNext = () => {
    if (words.length===0) { setCurrent(null); return }
    const pool = words
    const weights = pool.map(weightFor)
    const sum = weights.reduce((a,b)=>a+b,0)
    let r = Math.random()*sum
    let chosen = pool[0]
    for (let i=0;i<pool.length;i++){
      r -= weights[i]
      if (r <= 0) { chosen = pool[i]; break }
    }
    // 🔄 rastgele yön seç (Almanca→Türkçe veya Türkçe→Almanca)
    const mode = Math.random() < 0.5 ? 'de->tr' : 'tr->de'
    setCurrent({ ...chosen, mode })
    setAnswer('')
    setFeedback(null)
  }

  const submitAnswer = () => {
    if (!current) return
    let ok = false
    if (current.mode === 'de->tr') {
      ok = normalize(answer) === normalize(current.translation)
    } else {
      ok = normalize(answer) === normalize(current.term)
    }
    setFeedback(ok ? 'correct' : 'wrong')
    const updates = { lastAsked: Date.now() }
    if (ok) updates.score = (current.score || 0) + 1
    else updates.score = Math.max((current.score||0)-1, 0)
    update(ref(db, `rooms/${room}/words/${current.id}`), updates)
    setTimeout(pickNext, 800)
  }

  const updateWord = (w) => {
    const payload = { term: w.term, translation: w.translation, example: w.example }
    update(ref(db, `rooms/${room}/words/${w.id}`), payload)
    setEditing(null)
  }

  const deleteWord = (w) => {
    remove(ref(db, `rooms/${room}/words/${w.id}`))
    setEditing(null)
  }

  // 🔎 arama filtresi (hem Almanca hem Türkçe)
  const filteredWords = words.filter(w =>
    normalize(w.term).includes(normalize(search)) ||
    normalize(w.translation).includes(normalize(search))
  )

  return (
    <div className="app">
      <h2>VocabShare Web</h2>
      <div className="room-row">
        <input value={room} onChange={e=>setRoom(e.target.value)} placeholder="Oda kodu" />
        <button onClick={()=>{}}>Katıl</button>
        <button onClick={()=>setTab(tab==='list'?'quiz':'list')}>{tab==='list'?'Quiz':'Liste'}</button>
      </div>
      {tab==='list' ? (
        <>
          <div className="add-box">
            <input value={term} onChange={e=>setTerm(e.target.value)} placeholder="Kelime (örn: der Arzt)" />
            <input value={translation} onChange={e=>setTranslation(e.target.value)} placeholder="Çeviri" />
            <input value={example} onChange={e=>setExample(e.target.value)} placeholder="Örnek cümle" />
            <button onClick={addWord}>Ekle</button>
          </div>

          {/* 🔎 Arama kutusu */}
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Ara (Almanca veya Türkçe)"
            style={{marginBottom:'1rem', padding:'0.5rem'}}
          />

          <ul className="word-list">
            {filteredWords.map(w=>(
              <li key={w.id} onClick={()=>setEditing(w)}>
                <b>{w.term}</b> - {w.translation}
                <div><i>{w.example}</i></div>
                <span className="score">⭐ {w.score||0}</span>
              </li>
            ))}
            {filteredWords.length===0 && <p>Sonuç yok</p>}
          </ul>

          {editing && (
            <div className="modal">
              <h3>Düzenle</h3>
              <input value={editing.term} onChange={e=>setEditing({...editing, term:e.target.value})} />
              <input value={editing.translation} onChange={e=>setEditing({...editing, translation:e.target.value})} />
              <input value={editing.example} onChange={e=>setEditing({...editing, example:e.target.value})} />
              <button onClick={()=>updateWord(editing)}>Kaydet</button>
              <button onClick={()=>deleteWord(editing)} style={{color:'red'}}>Sil</button>
              <button onClick={()=>setEditing(null)}>Kapat</button>
            </div>
          )}
        </>
      ) : (
        <div className="quiz">
          {current ? (
            <div className="quiz-card">
              {current.mode === 'de->tr' ? (
                <>
                  <h3>{current.term}</h3>
                  <input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Türkçe çeviri?" />
                </>
              ) : (
                <>
                  <h3>{current.translation}</h3>
                  <input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Almanca kelime?" />
                </>
              )}
              <button onClick={submitAnswer}>Cevapla</button>
              {feedback==='correct' && <p style={{color:'green'}}>Doğru 🎉</p>}
              {feedback==='wrong' && (
                <p style={{color:'red'}}>
                  Yanlış. Doğru: {current.mode==='de->tr' ? current.translation : current.term}
                </p>
              )}
            </div>
          ) : <p>Kelime yok</p>}
          <button onClick={pickNext}>Sonraki</button>
        </div>
      )}
    </div>
  )
}
