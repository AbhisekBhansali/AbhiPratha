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

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const floatyEmojis = ["🩷","💙","🦚","🪷","🪔","✨","🥰","🌸","🏜️","🎶","💍","😌"]

const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// CPA Shab modal wiring
const cpaBadge = document.getElementById('cpa-badge')
const cpaModal = document.getElementById('cpa-modal')
const printAudit = document.getElementById('print-audit')

const inviteOverlay = document.getElementById('invitation-overlay')
const openInviteBtn = document.getElementById('open-invite')
const feathersLayer = document.querySelector('.feathers')

function enterRoyalInvite(){
    if(!inviteOverlay) return
    if(inviteOverlay.classList.contains('opening')) return

    inviteOverlay.classList.add('opening')

    // start music on entry (more reliable than autoplay)
    try{
        music.muted = false
        music.volume = 0.28
        music.play().catch(() => {})
    }catch(e){}

    // Remove overlay after animation
    setTimeout(() => {
        inviteOverlay.remove()
        document.body.classList.remove('locked')
    }, 1200)
}

if(inviteOverlay){
    // Click anywhere to open
    inviteOverlay.addEventListener('click', (e) => {
        // allow clicks inside without closing immediately
        if(e.target && (e.target.id === 'open-invite' || e.target === inviteOverlay)){
            enterRoyalInvite()
        }
    })
}
if(openInviteBtn){
    openInviteBtn.addEventListener('click', (e) => {
        e.preventDefault()
        enterRoyalInvite()
    })
}

function createFeathers(count = 11){
    if(!feathersLayer) return
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
    for(let i=0;i<count;i++){
        const el = document.createElement('div')
        el.className = 'feather'
        const dur = 12 + Math.random()*10
        const rot = (-35 + Math.random()*70).toFixed(1)
        const x = (Math.random()*100).toFixed(2) + 'vw'
        const drift = (-120 + Math.random()*240).toFixed(1) + 'px'
        el.style.left = x
        el.style.setProperty('--dur', `${dur}s`)
        el.style.setProperty('--rot', `${rot}deg`)
        el.style.setProperty('--x', '0px')
        el.style.setProperty('--drift', drift)
        el.style.animationDelay = `${-(Math.random()*dur)}s`
        el.innerHTML = featherSvg(i+1)
        feathersLayer.appendChild(el)
    }
}

createFeathers()

// Music: start after opening the royal invite (fallback: try autoplay if overlay isn't present)
music.muted = true
music.volume = 0.28

if(!inviteOverlay){
    music.play().then(() => {
        music.muted = false
    }).catch(() => {
        document.addEventListener('click', () => {
            music.muted = false
            music.play().catch(() => {})
        }, { once: true })
    })
}

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        popFloaty("😏")
        return
    }
    // tiny pre-celebration
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

    // cute floating reactions near the buttons
    popFloaty(noClickCount < 3 ? "🥺" : (noClickCount < 5 ? "💔" : "😈"))

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button (cap it so it stays "web" and doesn't become a huge mobile block)
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    const nextSize = Math.min(currentSize * 1.15, 48) // cap ~3rem
    yesBtn.style.fontSize = `${nextSize}px`
    const padY = Math.min(18 + noClickCount * 4, 40)
    const padX = Math.min(45 + noClickCount * 8, 84)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Mascot reacts with a tiny burst instead of swapping GIFs
    if (noClickCount <= 3) burstConfettiHearts()

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
        showTeaseMessage("Okay CPA Shab… the No button is now in escape mode 🏃‍♂️💨")
    }
}

// --- Modal helpers ---
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
    })
}

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
    } catch (e) { /* ignore */ }
}

function burstConfettiHearts() {
    // super lightweight fallback (no external libs) -> sprinkle floating emojis
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
}
