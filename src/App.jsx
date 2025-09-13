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
    padding: '10px',
    maxWidth: '100vw',
    overflowX: 'hidden'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2f855a',
    fontSize: '2rem',
    fontWeight: '700',
    textShadow: '0 2px 4px rgba(47, 133, 90, 0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  roomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: 'white',
    width: '100%',
    boxSizing: 'border-box',
    minWidth: '0'
  },
  inputFocus: {
    borderColor: '#48bb78',
    boxShadow: '0 0 0 3px rgba(72, 187, 120, 0.1)'
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(72, 187, 120, 0.2)',
    whiteSpace: 'nowrap'
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
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: '1px solid #e2e8f0'
  },
  categoryButtons: {
    display: 'flex',
    gap: '8px',
    margin: '15px 0',
    flexWrap: 'wrap'
  },
  categoryButton: {
    padding: '8px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: 'white',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  categoryButtonActive: {
    backgroundColor: '#48bb78',
    color: 'white',
    borderColor: '#48bb78'
  },
  categoryTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: '1px solid #e2e8f0'
  },
  categoryTab: {
    padding: '10px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  categoryTabActive: {
    backgroundColor: '#48bb78',
    color: 'white',
    borderColor: '#48bb78',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(72, 187, 120, 0.2)'
  },
  errorMessage: {
    backgroundColor: '#fed7d7',
    color: '#c53030',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #fbb6ce',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '15px',
    outline: 'none',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  wordList: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: '1px solid #e2e8f0',
    listStyle: 'none',
    margin: 0
  },
  categoryHeader: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2f855a',
    marginTop: '20px',
    marginBottom: '10px',
    paddingBottom: '6px',
    borderBottom: '2px solid #c6f6d5'
  },
  wordItem: {
    padding: '12px',
    margin: '6px 0',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #e2e8f0',
    listStyle: 'none'
  },
  wordItemHover: {
    backgroundColor: '#edf7ed',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 20
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    position: 'relative'
  },
  quiz: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  quizCard: {
    marginBottom: '25px'
  },
  quizQuestion: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '15px',
    wordBreak: 'break-word'
  },
  quizInput: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '15px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '15px',
    flexWrap: 'wrap'
  },
  feedback: {
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    textAlign: 'left'
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
    padding: '12px',
    borderRadius: '6px',
    fontStyle: 'italic',
    color: '#2f855a',
    marginBottom: '12px'
  },
  score: {
    display: 'inline-block',
    backgroundColor: '#48bb78',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '15px',
    fontSize: '11px',
    fontWeight: '600',
    marginTop: '6px'
  },
  version: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '10px',
    color: '#999'
  }
}

function normalize(input) {
  return input.trim().toLowerCase().replace(/^(der|die|das)\s+/, '')
}

function weightFor(w) {
  const s = w.score || 0
  return 1 / (1 + s)
}

// Kelime görüntüleme formatı (artikel küçük, isim büyük harf)
function formatTermDisplay(term, category) {
  if (category === 'İsim' || (!category)) {
    const match = term.match(/^(der|die|das)\s+(.+)$/i)
    if (match) {
      const artikel = match[1].toLowerCase()
      const noun = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase()
      return `${artikel} ${noun}`
    }
  }
  return term
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
  const [selectedCategory, setSelectedCategory] = useState('İsim') // 📁 seçili kategori
  const [errorMessage, setErrorMessage] = useState('') // ❌ hata mesajı

  // Version for cache busting
  const APP_VERSION = "2024-01-15-v2"

  const showError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000) // 5 saniye sonra kaybol
  }

  useEffect(() => {
    // Force reload if version changed
    const lastVersion = localStorage.getItem('app-version')
    if (lastVersion && lastVersion !== APP_VERSION) {
      localStorage.clear()
      window.location.reload(true)
    }
    localStorage.setItem('app-version', APP_VERSION)
  }, [])

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
      showError('Kelime, çeviri ve örnek zorunlu')
      return
    }
    if (!category) {
      showError('Kategori seçimi zorunlu')
      return
    }
    
    // İsim kategorisi için artikel kontrolü
    if (category === 'İsim') {
      const hasArticle = /^(der|die|das)\s+/i.test(t)
      if (!hasArticle) {
        showError('İsimler için artikel (der, die, das) zorunludur')
        return
      }
    } else {
      // İsim dışındaki kategoriler için küçük harfle başlat
      t = t.charAt(0).toLowerCase() + t.slice(1)
    }
    
    const key = normalize(t)
    const exists = words.some(w => normalize(w.term) === key)
    if (exists) {
      showError('Bu kelime zaten var')
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

  const handleFormKeyPress = (e) => {
    if (e.key === 'Enter' && term.trim() && translation.trim() && example.trim() && category) {
      e.preventDefault()
      addWord()
    }
  }


  const updateWord = (w) => {
    // Kategori seçimi kontrolü
    if (!w.category) {
      showError('Kategori seçimi zorunlu')
      return
    }
    
    // İsim kategorisi için artikel kontrolü
    let term = w.term.trim()
    if (w.category === 'İsim') {
      const hasArticle = /^(der|die|das)\s+/i.test(term)
      if (!hasArticle) {
        showError('İsimler için artikel (der, die, das) zorunludur')
        return
      }
    } else {
      // İsim dışındaki kategoriler için küçük harfle başlat
      term = term.charAt(0).toLowerCase() + term.slice(1)
    }
    
    const payload = { term: term, translation: w.translation, example: w.example, category: w.category }
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

  // Kelimeleri seçili kategoriye göre filtrele
  const categoryFilteredWords = filteredWords.filter(w => {
    if (selectedCategory === 'İsim') {
      return w.category === 'İsim' || !w.category // Kategorisi olmayan kelimeler de İsim'de
    }
    return w.category === selectedCategory
  })

  // Kelimeleri kategorilere göre grupla
  const categories = ['İsim', 'Sıfat', 'Fiil', 'Zarf', 'Edat']

  
  return (
    <div className="app" style={styles.app}>
      <div style={styles.version}>
        v{APP_VERSION}
      </div>
      <h2 style={styles.header}>VocabShare Web</h2>
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
          {/* Hata mesajı */}
          {errorMessage && (
            <div style={styles.errorMessage}>
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="add-box" style={styles.addBox}>
            <input 
              value={term} 
              onChange={e=>setTerm(e.target.value)} 
              onKeyDown={handleFormKeyPress}
              placeholder="Kelime (örn: der Arzt)" 
              style={{...styles.input, marginBottom: '15px'}}
            />
            <input 
              value={translation} 
              onChange={e=>setTranslation(e.target.value)} 
              onKeyDown={handleFormKeyPress}
              placeholder="Çeviri" 
              style={{...styles.input, marginBottom: '15px'}}
            />
            <input 
              value={example} 
              onChange={e=>setExample(e.target.value)} 
              onKeyDown={handleFormKeyPress}
              placeholder="Örnek cümle" 
              style={{...styles.input, marginBottom: '15px'}}
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
            
            <button 
              style={{
                ...styles.button,
                opacity: !category ? 0.5 : 1,
                cursor: !category ? 'not-allowed' : 'pointer'
              }} 
              onClick={addWord} 
              disabled={!category}
            >
              Ekle
            </button>
          </div>

          {/* 🔎 Arama kutusu */}
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Ara (Almanca veya Türkçe)"
            style={styles.searchInput}
          />

          {/* 📁 Kategori sekmeleri */}
          <div className="category-tabs" style={styles.categoryTabs}>
            {categories.map(cat => {
              const wordCount = filteredWords.filter(w => 
                cat === 'İsim' ? (w.category === cat || !w.category) : w.category === cat
              ).length
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    ...styles.categoryTab,
                    ...(selectedCategory === cat ? styles.categoryTabActive : {})
                  }}
                >
                  {cat} ({wordCount})
                </button>
              )
            })}
          </div>

          {/* 📝 Kelime listesi */}
          <div className="word-list" style={styles.wordList}>
            <h3 style={styles.categoryHeader}>{selectedCategory}</h3>
            {categoryFilteredWords.map(w=>(
              <div 
                key={w.id} 
                onClick={()=>setEditing(w)} 
                style={{
                  ...styles.wordItem,
                  ...(editing && editing.id === w.id ? styles.wordItemHover : {}),
                  ...(selectedCategory === 'İsim' && !w.category ? {
                    borderLeft: '4px solid #e53e3e',
                    backgroundColor: '#fef5e7'
                  } : {})
                }}
              >
                <div>
                  <b>{formatTermDisplay(w.term, w.category)}</b> - {w.translation}
                  {selectedCategory === 'İsim' && !w.category && (
                    <span style={{
                      backgroundColor: '#e53e3e',
                      color: 'white',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      marginLeft: '8px'
                    }}>
                      Kategorisiz
                    </span>
                  )}
                </div>
                <div><i>{w.example}</i></div>
                <span style={styles.score}>⭐ {w.score||0}</span>
              </div>
            ))}
            {categoryFilteredWords.length===0 && (
              <p>Bu kategoride kelime yok</p>
            )}
          </div>

          {editing && (
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
              onClick={(e) => e.target === e.currentTarget && setEditing(null)}
            >
              <div 
                style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '12px',
                  width: '100%',
                  maxWidth: '500px',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{marginTop: 0, marginBottom: 20}}>Düzenle</h3>
                <input 
                  value={editing.term} 
                  onChange={e=>setEditing({...editing, term:e.target.value})} 
                  style={{...styles.input, marginBottom: '15px'}}
                />
                <input 
                  value={editing.translation} 
                  onChange={e=>setEditing({...editing, translation:e.target.value})} 
                  style={{...styles.input, marginBottom: '15px'}}
                />
                <input 
                  value={editing.example} 
                  onChange={e=>setEditing({...editing, example:e.target.value})} 
                  style={{...styles.input, marginBottom: '15px'}}
                />
                
                {/* Kategori yoksa uyarı göster */}
                {!editing.category && (
                  <div style={{
                    backgroundColor: '#fed7d7',
                    color: '#c53030',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontSize: '14px'
                  }}>
                    ⚠️ Bu kelime henüz kategorize edilmemiş. Kaydetmek için kategori seçmelisiniz.
                  </div>
                )}
                
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
                
                <div style={styles.buttonGroup}>
                  <button 
                    style={{
                      ...styles.button,
                      opacity: !editing.category ? 0.5 : 1,
                      cursor: !editing.category ? 'not-allowed' : 'pointer'
                    }} 
                    onClick={()=>updateWord(editing)}
                    disabled={!editing.category}
                  >
                    Kaydet
                  </button>
                  <button style={{...styles.button, backgroundColor:'#e53e3e'}} onClick={()=>deleteWord(editing)}>Sil</button>
                  <button style={{...styles.button, ...styles.buttonSecondary}} onClick={()=>setEditing(null)}>Kapat</button>
                </div>
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
                  <h3 style={styles.quizQuestion}>{formatTermDisplay(current.term, current.category)}</h3>
                  <input 
                    value={answer} 
                    onChange={e=>setAnswer(e.target.value)} 
                    onKeyDown={handleKeyPress}
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
                    onKeyDown={handleKeyPress}
                    placeholder="Almanca kelime?" 
                    style={styles.quizInput}
                  />
                </>
              )}
              
              {!feedback && (
                <div style={styles.buttonGroup}>
                  <button style={styles.button} onClick={submitAnswer} disabled={!answer.trim()}>Cevapla</button>
                  <button 
                    style={{...styles.button, ...(showHint ? {} : styles.buttonHover)}} 
                    onClick={()=>{setShowHint(true); setUsedHint(true)}}
                    disabled={showHint}
                  >
                    💡 İpucu
                  </button>
                </div>
              )}
              
              {showHint && <p style={{color:'#666', fontStyle:'italic'}}>💡 {current.example}</p>}
              
              {feedback==='correct' && (
                <div style={{...styles.feedback, ...styles.feedbackCorrect}}>
                  <p>Doğru 🎉 (+{usedHint ? 1 : 2} puan)</p>
                  <p><strong>Çeviri:</strong> {current.mode==='de->tr' ? formatTermDisplay(current.term, current.category) : current.translation}</p>
                  <p><strong>Örnek:</strong> <i>{current.example}</i></p>
                </div>
              )}
              
              {feedback==='wrong' && (
                <div style={{...styles.feedback, ...styles.feedbackWrong}}>
                  <p>Yanlış (-1 puan)</p>
                  <p><strong>Doğru cevap:</strong> {current.mode==='de->tr' ? current.translation : formatTermDisplay(current.term, current.category)}</p>
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
