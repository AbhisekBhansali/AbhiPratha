// (Kept lightweight: no external GIF dependency on the main page)

const noMessages = [
  "No",
  "Pratha… sure? 🤔",
  "Kitty please... 🥺",
  "CPA Shab, please reconsider 😌📊",
  "If you say no, Abhi will be sad... 😢",
  "Please??? 💔",
  "Don't do this to your Abhi...",
  "Last chance, Kitty! 😭",
  "Hehe... catch me if you can 😜"
]

const yesTeasePokes = [
  "One time 'No'... just for fun, Kitty 😏",
  "Go on, press No once 👀 (if you can)",
  "CPA Shab might want to audit the No button 😈",
  "Click No… I dare you 😏"
]

/** ✅ Your memories */
const floatyWords = [
  "Rao Jodha Park 👑",
  "Delhi📊",
  "Elance 💗💙",
  "Manali📸",
  "Dubai Flight💞",
  "Jaipur Flight",
  "Bengluru💞",
  "Marathalli",
  "Hanuman ji🚩",
  "🛕Mysuru💞🚗",
  "Puri🚩",
  "Coorg🚗",
  "Eon 🚗",
  "Blu📊",
  "CPA📊",
  "Aadrik💘",
  "Aadrik 🤗",
  "Dubai Flight💞",
  "Dubai😌",
  "94103🏡",
  "DK📊"
]

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const floatyEmojis = ["🩷","💙","🦚","🪷","🪔","✨","🥰","🌸","🏜️","🎶","💍","😌"]

const yesBtn = document.getElementById('yes-btn')
const noBtn  = document.getElementById('no-btn')

// MAIN music (after invite opens)
const music = document.getElementById('bg-music')

// INVITE overlay music (optional)
const inviteMusic = document.getElementById('invite-music')

// CPA Shab modal wiring
const cpaBadge  = document.getElementById('cpa-badge')
const cpaModal  = document.getElementById('cpa-modal')
const printAudit = document.getElementById('print-audit')

// Invite overlay
const inviteOverlay = document.getElementById('invitation-overlay')
const openInviteBtn = document.getElementById('open-invite')
const feathersLayer = document.querySelector('.feathers')

// ✅ NEW: words layer for continuous stream
const wordsLayer = document.querySelector('.words')

/* ---------------------- AUDIO HELPERS ---------------------- */

function safePlay(audioEl) {
  if (!audioEl) return Promise.resolve()
  try {
    audioEl.muted = false
    const p = audioEl.play()
    if (p && typeof p.catch === "function") return p.catch(() => {})
  } catch (e) {}
  return Promise.resolve()
}

function safePause(audioEl) {
  if (!audioEl) return
  try { audioEl.pause() } catch (e) {}
}

function resetAudio(audioEl) {
  if (!audioEl) return
  try { audioEl.currentTime = 0 } catch (e) {}
}

/* ---------------------- WORD POP (single) ---------------------- */

function popFloatyWord(text) {
  try {
    const el = document.createElement('div')
    el.className = 'floaty floaty-word'
    el.textContent = text
    el.style.left = `${Math.random() * (window.innerWidth - 40)}px`
    el.style.top  = `${Math.random() * (window.innerHeight * 0.45) + window.innerHeight * 0.25}px`
    el.style.fontSize = `${14 + Math.random() * 10}px`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1600)
  } catch (e) {}
}

function popRandomMemoryWord(chance = 0.65) {
  if (!floatyWords || floatyWords.length === 0) return
  if (Math.random() > chance) return
  const w = floatyWords[Math.floor(Math.random() * floatyWords.length)]
  popFloatyWord(w)
}

/* ---------------------- ✅ CONTINUOUS WORD FLOATERS (like feathers) ---------------------- */

function createWordFloaters(count = 10) {
  if (!wordsLayer) return
  if (!floatyWords || floatyWords.length === 0) return

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = 'word-floater'
    el.textContent = floatyWords[Math.floor(Math.random() * floatyWords.length)]

    const dur = 10 + Math.random() * 10           // 10s - 20s
    const x = (Math.random() * 100).toFixed(2) + 'vw'
    const drift = (-120 + Math.random() * 240).toFixed(1) + 'px'
    const delay = `${-(Math.random() * dur)}s`    // negative delay => already in motion on load

    el.style.left = x
    el.style.setProperty('--dur', `${dur}s`)
    el.style.setProperty('--drift', drift)
    el.style.setProperty('--x', '0px')
    el.style.setProperty('--delay', delay)

    // slight size variation
    el.style.fontSize = `${13 + Math.random() * 9}px`

    wordsLayer.appendChild(el)
  }
}

// Change this count if you want more/less words on screen
createWordFloaters(12)

/* ---------------------- INVITE FLOW ---------------------- */

function primeInviteAudioOnce() {
  if (!inviteMusic) return

  inviteMusic.volume = 0.45
  inviteMusic.muted = false

  const starter = () => {
    safePlay(inviteMusic)
    document.removeEventListener('click', starter)
    document.removeEventListener('touchstart', starter)
  }
  document.addEventListener('click', starter, { once: true })
  document.addEventListener('touchstart', starter, { once: true, passive: true })
}

function enterRoyalInvite() {
  if (!inviteOverlay) return
  if (inviteOverlay.classList.contains('opening')) return

  inviteOverlay.classList.add('opening')

  safePause(inviteMusic)
  resetAudio(inviteMusic)

  if (music) {
    music.volume = 0.28
    music.muted = false
    safePlay(music)
  }

  popRandomMemoryWord(1)

  setTimeout(() => {
    inviteOverlay.remove()
    document.body.classList.remove('locked')
  }, 1200)
}

if (inviteOverlay) {
  primeInviteAudioOnce()

  inviteOverlay.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'open-invite' || e.target === inviteOverlay)) {
      enterRoyalInvite()
    }
  })
}

if (openInviteBtn) {
  openInviteBtn.addEventListener('click', (e) => {
    e.preventDefault()
    enterRoyalInvite()
  })
}

/* ---------------------- FEATHERS ---------------------- */

function createFeathers(count = 11) {
  if (!feathersLayer) return

  const featherSvg = (seed=0) => `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="rgba(120,115,245,0.95)"/>
          <stop offset="0.5" stop-color="rgba(0,206,209,0.85)"/>
          <stop offset="1" stop-color="rgba(255,110,196,0.92)"/>
        </linearGradient>
        <radialGradient id="eye${seed}" cx="45%" cy="35%" r="55%">
          <stop offset="0" stop-color="rgba(255,255,255,0.92)"/>
          <stop offset="0.25" stop-color="rgba(255,215,0,0.75)"/>
          <stop offset="0.55" stop-color="rgba(0,206,209,0.70)"/>
          <stop offset="1" stop-color="rgba(120,115,245,0.0)"/>
        </radialGradient>
      </defs>
      <path d="M78 16c-9 6-18 17-22 30-5 15-3 33 7 53 9 19-1 19-10 9-10-11-19-27-21-46-2-16 3-33 14-45 9-10 20-13 32-1Z"
            fill="url(#g${seed})" opacity="0.85"/>
      <path d="M53 19c-8 10-12 23-12 36 0 18 7 36 20 52"
            fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="64" cy="36" rx="20" ry="16" fill="url(#eye${seed})" opacity="0.9"/>
      <ellipse cx="64" cy="36" rx="7" ry="6" fill="rgba(20,20,30,0.55)"/>
      <circle cx="66" cy="34" r="2.3" fill="rgba(255,255,255,0.9)"/>
    </svg>
  `

  for (let i=0; i<count; i++) {
    const el = document.createElement('div')
    el.className = 'feather'
    const dur = 12 + Math.random() * 10
    const rot = (-35 + Math.random() * 70).toFixed(1)
    const x = (Math.random() * 100).toFixed(2) + 'vw'
    const drift = (-120 + Math.random() * 240).toFixed(1) + 'px'
    el.style.left = x
    el.style.setProperty('--dur', `${dur}s`)
    el.style.setProperty('--rot', `${rot}deg`)
    el.style.setProperty('--x', '0px')
    el.style.setProperty('--drift', drift)
    el.style.animationDelay = `${-(Math.random() * dur)}s`
    el.innerHTML = featherSvg(i+1)
    feathersLayer.appendChild(el)
  }
}

createFeathers()

/* ---------------------- MUSIC DEFAULTS ---------------------- */

if (music) {
  music.muted = true
  music.volume = 0.28

  if (!inviteOverlay) {
    music.play().then(() => {
      music.muted = false
    }).catch(() => {
      document.addEventListener('click', () => {
        music.muted = false
        safePlay(music)
      }, { once: true })
    })
  }
}

function toggleMusic() {
  if (!music) return
  const btn = document.getElementById('music-toggle')

  if (musicPlaying) {
    music.pause()
    musicPlaying = false
    if (btn) btn.textContent = '🔇'
  } else {
    music.muted = false
    safePlay(music)
    musicPlaying = true
    if (btn) btn.textContent = '🔊'
  }
}

/* ---------------------- YES / NO ---------------------- */

function handleYesClick() {
  if (!runawayEnabled) {
    const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
    yesTeasedCount++
    showTeaseMessage(msg)
    popFloaty("😏")
    popRandomMemoryWord(0.85)
    return
  }
  burstConfettiHearts()
  window.location.href = 'main.html'
}

function showTeaseMessage(msg) {
  let toast = document.getElementById('tease-toast')
  toast.textContent = msg
  toast.classList.add('show')
  clearTimeout(toast._timer)
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
  noClickCount++

  popFloaty(noClickCount < 3 ? "🥺" : (noClickCount < 5 ? "💔" : "😈"))
  popRandomMemoryWord(0.75)

  const msgIndex = Math.min(noClickCount, noMessages.length - 1)
  noBtn.textContent = noMessages[msgIndex]

  const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
  const nextSize = Math.min(currentSize * 1.15, 48)
  yesBtn.style.fontSize = `${nextSize}px`
  const padY = Math.min(18 + noClickCount * 4, 40)
  const padX = Math.min(45 + noClickCount * 8, 84)
  yesBtn.style.padding = `${padY}px ${padX}px`

  if (noClickCount >= 2) {
    const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
    noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
  }

  if (noClickCount <= 3) burstConfettiHearts()

  if (noClickCount >= 5 && !runawayEnabled) {
    enableRunaway()
    runawayEnabled = true
    showTeaseMessage("Okay CPA Shab… the No button is now in escape mode 🏃‍♂️💨")
  }
}

/* ---------------------- MODAL ---------------------- */

function openModal() {
  if (!cpaModal) return
  cpaModal.setAttribute('aria-hidden', 'false')
  cpaModal.classList.add('show')
  document.body.classList.add('modal-open')
}

function closeModal() {
  if (!cpaModal) return
  cpaModal.setAttribute('aria-hidden', 'true')
  cpaModal.classList.remove('show')
  document.body.classList.remove('modal-open')
}

if (cpaBadge) {
  cpaBadge.addEventListener('click', () => {
    openModal()
    popFloaty('📊')
    popRandomMemoryWord(0.95)
  })
}

if (cpaModal) {
  cpaModal.addEventListener('click', (e) => {
    const t = e.target
    if (t && t.dataset && t.dataset.close === 'true') closeModal()
  })
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal()
})

if (printAudit) {
  printAudit.addEventListener('click', () => {
    burstConfettiHearts()
    showTeaseMessage("CPA Shab says: approved ✅ (No paperwork today 😄)")
    popRandomMemoryWord(1)
  })
}

/* ---------------------- RUNAWAY ---------------------- */

function enableRunaway() {
  noBtn.addEventListener('mouseover', runAway)
  noBtn.addEventListener('touchstart', runAway, { passive: true })
  noBtn.classList.add('runaway')
}

function runAway() {
  const margin = 20
  const btnW = noBtn.offsetWidth
  const btnH = noBtn.offsetHeight
  const maxX = window.innerWidth - btnW - margin
  const maxY = window.innerHeight - btnH - margin

  const randomX = Math.random() * maxX + margin / 2
  const randomY = Math.random() * maxY + margin / 2

  noBtn.style.position = 'fixed'
  noBtn.style.left = `${randomX}px`
  noBtn.style.top = `${randomY}px`
  noBtn.style.zIndex = '50'
}

/* ---------------------- EFFECTS ---------------------- */

function popFloaty(text) {
  try {
    const rect = (runawayEnabled ? yesBtn : noBtn).getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top
    const el = document.createElement('div')
    el.className = 'floaty'
    el.textContent = text
    el.style.left = `${x}px`
    el.style.top = `${y}px`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1200)
  } catch (e) {}
}

function burstConfettiHearts() {
  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div')
    el.className = 'floaty'
    el.textContent = floatyEmojis[Math.floor(Math.random() * floatyEmojis.length)]
    el.style.left = `${Math.random() * window.innerWidth}px`
    el.style.top = `${Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.2}px`
    el.style.animationDuration = `${0.8 + Math.random() * 0.6}s`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1500)
  }

  popRandomMemoryWord(1)
  popRandomMemoryWord(0.55)
}
