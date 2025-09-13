import React, { useEffect, useState } from 'react'
import { db } from './firebase'
import { ref, onValue, push, set, update, remove } from 'firebase/database'

// Modern CSS Styles
const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f8fffe',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#2d3748',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#2f855a',
    fontSize: '2.5rem',
    fontWeight: '700',
    textShadow: '0 2px 4px rgba(47, 133, 90, 0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  roomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: '1px solid #e2e8f0'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: 'white'
  },
  inputFocus: {
    borderColor: '#48bb78',
    boxShadow: '0 0 0 3px rgba(72, 187, 120, 0.1)'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(72, 187, 120, 0.2)'
  },
  buttonHover: {
    backgroundColor: '#38a169',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(72, 187, 120, 0.3)'
  },
  buttonSecondary: {
    backgroundColor: 'white',
    color: '#48bb78',
    border: '2px solid #48bb78'
  },
  addBox: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: '1px solid #e2e8f0'
  },
  categoryButtons: {
    display: 'flex',
    gap: '10px',
    margin: '20px 0',
    flexWrap: 'wrap'
  },
  categoryButton: {
    padding: '10px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '500'
  },
  categoryButtonActive: {
    backgroundColor: '#48bb78',
    color: 'white',
    borderColor: '#48bb78'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    marginBottom: '20px',
    outline: 'none',
    backgroundColor: 'white'
  },
  wordList: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: '1px solid #e2e8f0'
  },
  categoryHeader: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2f855a',
    marginTop: '30px',
    marginBottom: '15px',
    paddingBottom: '8px',
    borderBottom: '2px solid #c6f6d5'
  },
  wordItem: {
    padding: '16px',
    margin: '8px 0',
    backgroundColor: '#f7fafc',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #e2e8f0'
  },
  wordItemHover: {
    backgroundColor: '#edf7ed',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)'
  },
  quiz: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto'
  },
  quizCard: {
    marginBottom: '30px'
  },
  quizQuestion: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '20px'
  },
  quizInput: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    marginBottom: '20px',
    outline: 'none'
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  feedback: {
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px'
  },
  feedbackCorrect: {
    backgroundColor: '#c6f6d5',
    color: '#2f855a',
    border: '1px solid #9ae6b4'
  },
  feedbackWrong: {
    backgroundColor: '#fed7d7',
    color: '#c53030',
    border: '1px solid #fbb6ce'
  },
  hint: {
    backgroundColor: '#edf7ed',
    padding: '15px',
    borderRadius: '8px',
    fontStyle: 'italic',
    color: '#2f855a',
    marginBottom: '15px'
  },
  score: {
    display: 'inline-block',
    backgroundColor: '#48bb78',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '8px'
  }
}

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
  const [category, setCategory] = useState('')

  const [editing, setEditing] = useState(null)

  const [current, setCurrent] = useState(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [usedHint, setUsedHint] = useState(false)

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
    setTerm(''); setTranslation(''); setExample(''); setCategory('')
  }

  const addWord = () => {
    let t = term.trim()
    const tr = translation.trim()
    const ex = example.trim()
    if (!t || !tr || !ex) {
      alert('Kelime, çeviri ve örnek zorunlu')
      return
    }
    if (!category) {
      alert('Kategori seçimi zorunlu')
      return
    }
    
    // İsim kategorisi için artikel kontrolü
    if (category === 'İsim') {
      const hasArticle = /^(der|die|das)\s+/i.test(t)
      if (!hasArticle) {
        alert('İsimler için artikel (der, die, das) zorunludur')
        return
      }
    } else {
      // İsim dışındaki kategoriler için küçük harfle başlat
      t = t.charAt(0).toLowerCase() + t.slice(1)
    }
    
    const key = normalize(t)
    const exists = words.some(w => normalize(w.term) === key)
    if (exists) {
      alert('Bu kelime zaten var')
      return
    }
    const w = { term: t, translation: tr, example: ex, category: category, score: 0, createdAt: Date.now() }
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
    setShowHint(false)
    setUsedHint(false)
  }

  const submitAnswer = () => {
    if (!current || !answer.trim()) return
    let ok = false
    if (current.mode === 'de->tr') {
      // Türkçe cevabı kontrol et - birden fazla karşılığı destekle
      const userAnswer = answer.trim().toLowerCase()
      const possibleAnswers = current.translation
        .split(/[,\s]+/) // virgül veya boşlukla ayır
        .map(ans => ans.trim().toLowerCase())
        .filter(ans => ans.length > 0) // boş stringleri filtrele
      ok = possibleAnswers.includes(userAnswer)
    } else {
      // Almanca cevabı kontrol et → artikel dahil
      ok = answer.trim().toLowerCase() === current.term.trim().toLowerCase()
    }
    setFeedback(ok ? 'correct' : 'wrong')
    const updates = { lastAsked: Date.now() }
    if (ok) {
      // İpucu kullanılmadıysa 2 puan, kullanıldıysa 1 puan
      const points = usedHint ? 1 : 2
      updates.score = (current.score || 0) + points
    } else {
      updates.score = Math.max((current.score||0)-1, 0)
    }
    update(ref(db, `rooms/${room}/words/${current.id}`), updates)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && answer.trim() && !feedback) {
      submitAnswer()
    }
  }


  const updateWord = (w) => {
    const payload = { term: w.term, translation: w.translation, example: w.example, category: w.category }
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

  // Kelimeleri kategorilere göre grupla
  const categories = ['İsim', 'Sıfat', 'Fiil', 'Zarf', 'Edat']
  const groupedWords = categories.reduce((acc, cat) => {
    acc[cat] = filteredWords.filter(w => w.category === cat)
    return acc
  }, {})

  
  return (
    <div className="app" style={styles.app}>
      <h2 style={styles.header}>VocabShare Web</h2>
      <div style={{position: 'absolute', top: '10px', right: '10px', fontSize: '12px', color: '#999'}}>
        v{Date.now()}
      </div>
      <div className="room-row" style={styles.roomRow}>
        <input 
          value={room} 
          onChange={e=>setRoom(e.target.value)} 
          placeholder="Oda kodu" 
          style={styles.input}
        />
        <button style={styles.button} onClick={()=>{}}>Katıl</button>
        <button 
          style={{...styles.button, ...(tab==='list' ? styles.buttonHover : {})}} 
          onClick={()=>setTab(tab==='list'?'quiz':'list')}
        >
          {tab==='list'?'Quiz':'Liste'}
        </button>
      </div>
      {tab==='list' ? (
        <>
          <div className="add-box" style={styles.addBox}>
            <input 
              value={term} 
              onChange={e=>setTerm(e.target.value)} 
              placeholder="Kelime (örn: der Arzt)" 
              style={styles.input}
            />
            <input 
              value={translation} 
              onChange={e=>setTranslation(e.target.value)} 
              placeholder="Çeviri" 
              style={styles.input}
            />
            <input 
              value={example} 
              onChange={e=>setExample(e.target.value)} 
              placeholder="Örnek cümle" 
              style={styles.input}
            />
            
            {/* Kategori seçim butonları */}
            <div className="category-buttons" style={styles.categoryButtons}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    ...styles.categoryButton,
                    ...(category === cat ? styles.categoryButtonActive : {})
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <button style={styles.button} onClick={addWord}>Ekle</button>
          </div>

          {/* 🔎 Arama kutusu */}
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Ara (Almanca veya Türkçe)"
            style={styles.searchInput}
          />

          <ul className="word-list" style={styles.wordList}>
            {categories.map(category => (
              <div key={category}>
                {groupedWords[category].length > 0 && (
                  <>
                    <h3 style={styles.categoryHeader}>{category}</h3>
                    {groupedWords[category].map(w=>(
                      <li 
                        key={w.id} 
                        onClick={()=>setEditing(w)} 
                        style={{
                          ...styles.wordItem,
                          ...(editing && editing.id === w.id ? styles.wordItemHover : {})
                        }}
                      >
                        <b>{w.term}</b> - {w.translation}
                        <div><i>{w.example}</i></div>
                        <span className="score" style={styles.score}>⭐ {w.score||0}</span>
                      </li>
                    ))}
                  </>
                )}
              </div>
            ))}
            {filteredWords.length===0 && <p>Sonuç yok</p>}
          </ul>

          {editing && (
            <div className="modal" style={styles.modal}>
              <div className="modal-content" style={styles.modalContent}>
                <h3>Düzenle</h3>
                <input 
                  value={editing.term} 
                  onChange={e=>setEditing({...editing, term:e.target.value})} 
                  style={styles.input}
                />
                <input 
                  value={editing.translation} 
                  onChange={e=>setEditing({...editing, translation:e.target.value})} 
                  style={styles.input}
                />
                <input 
                  value={editing.example} 
                  onChange={e=>setEditing({...editing, example:e.target.value})} 
                  style={styles.input}
                />
                
                {/* Kategori seçim butonları */}
                <div className="category-buttons" style={styles.categoryButtons}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setEditing({...editing, category: cat})}
                      style={{
                        ...styles.categoryButton,
                        ...(editing.category === cat ? styles.categoryButtonActive : {})
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                <button style={styles.button} onClick={()=>updateWord(editing)}>Kaydet</button>
                <button style={{...styles.button, color:'red'}} onClick={()=>deleteWord(editing)}>Sil</button>
                <button style={styles.button} onClick={()=>setEditing(null)}>Kapat</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="quiz" style={styles.quiz}>
          {current ? (
            <div className="quiz-card" style={styles.quizCard}>
              {current.mode === 'de->tr' ? (
                <>
                  <h3 style={styles.quizQuestion}>{current.term}</h3>
                  <input 
                    value={answer} 
                    onChange={e=>setAnswer(e.target.value)} 
                    onKeyPress={handleKeyPress}
                    placeholder="Türkçe çeviri?" 
                    style={styles.quizInput}
                  />
                </>
              ) : (
                <>
                  <h3 style={styles.quizQuestion}>{current.translation}</h3>
                  <input 
                    value={answer} 
                    onChange={e=>setAnswer(e.target.value)} 
                    onKeyPress={handleKeyPress}
                    placeholder="Almanca kelime?" 
                    style={styles.quizInput}
                  />
                </>
              )}
              
              {!feedback && (
                <>
                  <button style={styles.button} onClick={submitAnswer} disabled={!answer.trim()}>Cevapla</button>
                  <button 
                    style={{...styles.button, ...(showHint ? {} : styles.buttonHover)}} 
                    onClick={()=>{setShowHint(true); setUsedHint(true)}}
                    disabled={showHint}
                  >
                    💡 İpucu
                  </button>
                </>
              )}
              
              {showHint && <p style={{color:'#666', fontStyle:'italic'}}>💡 {current.example}</p>}
              
              {feedback==='correct' && (
                <div style={{...styles.feedback, ...styles.feedbackCorrect}}>
                  <p>Doğru 🎉 (+{usedHint ? 1 : 2} puan)</p>
                  <p><strong>Çeviri:</strong> {current.mode==='de->tr' ? current.term : current.translation}</p>
                  <p><strong>Örnek:</strong> <i>{current.example}</i></p>
                </div>
              )}
              
              {feedback==='wrong' && (
                <div style={{...styles.feedback, ...styles.feedbackWrong}}>
                  <p>Yanlış (-1 puan)</p>
                  <p><strong>Doğru cevap:</strong> {current.mode==='de->tr' ? current.translation : current.term}</p>
                  <p><strong>Örnek:</strong> <i>{current.example}</i></p>
                </div>
              )}
              
            </div>
          ) : <p>Kelime yok</p>}
          <button style={styles.button} onClick={pickNext}>Sonraki</button>
        </div>
      )}
    </div>
  )
}
