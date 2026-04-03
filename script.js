/* ============================================================
   PORTOFOLIO APRIANSYAH — script.js
   Firebase Realtime Database + Google Login + Edit Mode
   ============================================================ */

// ─── AUTHORIZED EMAILS (tambah email di sini) ───
const AUTHORIZED_EMAILS = [
  "yayankyayank158@gmail.com",
  // "emailkedua@gmail.com",  ← uncomment dan ganti jika ada email lain
];

// ─── FIREBASE CONFIG ───
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set, onValue }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey:            "AIzaSyA9fY6tbPd4X5BIbKaKoV2rwz_nO4lnX_g",
  authDomain:        "zanovaproject27.firebaseapp.com",
  databaseURL:       "https://zanovaproject27-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "zanovaproject27",
  storageBucket:     "zanovaproject27.firebasestorage.app",
  messagingSenderId: "676724554287",
  appId:             "1:676724554287:web:5f0c8c14586b3fae0124da",
};

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const db       = getDatabase(app);
const provider = new GoogleAuthProvider();

/* ══════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════ */

onAuthStateChanged(auth, (user) => {
  if (user && AUTHORIZED_EMAILS.includes(user.email.toLowerCase())) {
    onLoginSuccess(user);
  } else {
    onLoggedOut();
  }
});

window.loginWithGoogle = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    const email  = result.user.email.toLowerCase();
    if (!AUTHORIZED_EMAILS.includes(email)) {
      await signOut(auth);
      showToast(`❌ Akses ditolak untuk ${email}`, 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('❌ Login gagal: ' + err.message, 'error');
  }
};

window.logout = async function () {
  await signOut(auth);
};

function onLoginSuccess(user) {
  const loginPanel = document.getElementById('login-panel');
  const userPanel  = document.getElementById('user-panel');
  const userAvatar = document.getElementById('user-avatar');
  const userName   = document.getElementById('user-name');
  if (loginPanel) loginPanel.style.display = 'none';
  if (userPanel)  userPanel.style.display  = 'flex';
  if (userAvatar) userAvatar.src = user.photoURL || '';
  if (userName)   userName.textContent = user.displayName || user.email;
  document.querySelectorAll('.edit-btn').forEach(btn => btn.style.display = 'inline-flex');
  showToast(`✅ Login sebagai ${user.displayName}`, 'success');
}

function onLoggedOut() {
  const loginPanel = document.getElementById('login-panel');
  const userPanel  = document.getElementById('user-panel');
  if (loginPanel) loginPanel.style.display = 'flex';
  if (userPanel)  userPanel.style.display  = 'none';
  document.querySelectorAll('.edit-btn').forEach(btn => btn.style.display = 'none');
}

/* ══════════════════════════════════════════════
   FIREBASE DATABASE
══════════════════════════════════════════════ */

const FIELDS = ['name', 'ttl', 'alamat', 'school', 'cita'];

function loadDataFromFirebase() {
  const dataRef = ref(db, 'portfolio');
  onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    FIELDS.forEach(field => {
      if (data[field]) {
        const el = document.getElementById('editable-' + field);
        if (el) el.textContent = data[field];
      }
    });
  });
}

async function saveFieldToFirebase(field, value) {
  try {
    await set(ref(db, `portfolio/${field}`), value);
    showToast('✅ Tersimpan!', 'success');
  } catch (err) {
    console.error(err);
    showToast('❌ Gagal menyimpan: ' + err.message, 'error');
  }
}

/* ══════════════════════════════════════════════
   EDIT MODAL
══════════════════════════════════════════════ */

window.openEditModal = function (field, currentValue) {
  const modal   = document.getElementById('edit-modal');
  const input   = document.getElementById('edit-input');
  const title   = document.getElementById('edit-modal-title');
  const saveBtn = document.getElementById('edit-save-btn');
  if (!modal || !input) return;

  const labels = {
    name:   'Edit Nama',
    ttl:    'Edit Tempat, Tanggal Lahir',
    alamat: 'Edit Alamat',
    school: 'Edit Sekolah',
    cita:   'Edit Cita-Cita',
  };

  title.textContent = labels[field] || 'Edit';
  input.value = currentValue || '';
  modal.style.display = 'flex';
  input.focus();

  saveBtn.onclick = async () => {
    const newVal = input.value.trim();
    if (!newVal) return;
    await saveFieldToFirebase(field, newVal);
    modal.style.display = 'none';
  };
};

window.closeEditModal = function () {
  const modal = document.getElementById('edit-modal');
  if (modal) modal.style.display = 'none';
};

/* ══════════════════════════════════════════════
   UI UTILITIES
══════════════════════════════════════════════ */

function showToast(msg, type) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast ' + type;
  toast.style.display = 'block';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.display = 'none'; }, 3200);
}

/* ══════════════════════════════════════════════
   LOADING SCREEN
══════════════════════════════════════════════ */

window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(triggerReveal, 200);
  }, 2000);
});

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  triggerReveal();
});

/* ── SCROLL REVEAL ── */
function triggerReveal() {
  document.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
      setTimeout(() => el.classList.add('visible'), i * 80);
    }
  });
}

/* ── ACCORDION ── */
function initAccordion() {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.contains('active');
      document.querySelectorAll('.accordion-btn').forEach(other => {
        other.classList.remove('active');
        other.nextElementSibling.style.maxHeight = '0';
      });
      if (!isActive) {
        btn.classList.add('active');
        btn.nextElementSibling.style.maxHeight = btn.nextElementSibling.scrollHeight + 'px';
      }
    });
  });
}

/* ── DARK/LIGHT TOGGLE ── */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  if (toggleBtn) toggleBtn.textContent = saved === 'dark' ? '🌙' : '☀️';
  if (!toggleBtn) return;
  toggleBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggleBtn.textContent = next === 'dark' ? '🌙' : '☀️';
  });
}

/* ── NAVBAR ANIMATION ── */
function initNavAnimation() {
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.style.cssText = 'opacity:0;transform:translateX(-16px)';
    requestAnimationFrame(() => {
      logo.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      logo.style.opacity = '1';
      logo.style.transform = 'translateX(0)';
    });
  }
  document.querySelectorAll('nav ul li').forEach((li, i) => {
    li.style.cssText = 'opacity:0;transform:translateY(-12px)';
    setTimeout(() => {
      li.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      li.style.opacity = '1';
      li.style.transform = 'translateY(0)';
    }, 100 + i * 100);
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  triggerReveal();
  initAccordion();
  initThemeToggle();
  initNavAnimation();
  loadDataFromFirebase();

  const modal = document.getElementById('edit-modal');
  if (modal) modal.addEventListener('click', e => {
    if (e.target === modal) closeEditModal();
  });
});
