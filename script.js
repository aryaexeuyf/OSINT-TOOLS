// === SESSION & COUNTDOWN ===
function initSession() {
  const name = document.getElementById('user-name').value;
  const phone = document.getElementById('user-phone').value;
  const pin = document.getElementById('user-pin').value;

  if (!name || !phone || pin !== 'RC-RX25') {
    alert('Pastikan data lengkap dan PIN benar: RC-RX25');
    return;
  }

  const now = new Date().getTime();
  localStorage.setItem('apreconix_user', JSON.stringify({ name, phone, activatedAt: now }));
  document.getElementById('splash').classList.remove('active');
  document.getElementById('main-ui').classList.remove('hidden');
  startCountdown();
}

function startCountdown() {
  const data = JSON.parse(localStorage.getItem('apreconix_user'));
  if (!data) return;

  const activated = data.activatedAt;
  const expiry = activated + (5 * 24 * 60 * 60 * 1000); // 5 days
  const countdownEl = document.getElementById('countdown');

  const update = () => {
    const now = new Date().getTime();
    const diff = expiry - now;

    if (diff <= 0) {
      document.body.innerHTML = '<div style="text-align:center; padding:50px; color:#f00; font-family:Orbitron; font-size:2rem;">WAKTU LANGGANAN HABIS<br><br>' + new Date().toLocaleString('id-ID') + '</div>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    countdownEl.textContent = `⏳ Sisa: ${days}d ${hours}j ${mins}m`;
    setTimeout(update, 60000); // update per menit
  };
  update();
}

// Check if already logged in
window.onload = () => {
  const user = localStorage.getItem('apreconix_user');
  if (user) {
    document.getElementById('splash').classList.remove('active');
    document.getElementById('main-ui').classList.remove('hidden');
    startCountdown();
  }
};

// === TAB NAVIGATION ===
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// === MENU TOGGLE ===
function toggleMenu() {
  document.getElementById('side-menu').classList.toggle('active');
}

function showSubMenu(type) {
  toggleMenu();
  const content = document.getElementById('submenu-content');
  content.style.display = 'block';

  if (type === 'log') {
    content.innerHTML = `
      <h2>📁 LOG AKTIVITAS</h2>
      <p><i>Menampilkan riwayat perintah OSINT & Spam dari user ini.</i></p>
      <hr>
      <pre id="log-display">[Belum ada aktivitas]</pre>
      <button onclick="this.parentElement.style.display='none'">TUTUP</button>
    `;
    // Nanti bisa diisi dari localStorage atau Firebase
  } else if (type === 'cs') {
    content.innerHTML = `<h2>🛠️ CUSTOMER SUPPORT</h2><p>Sedang dalam pengembangan.</p><button onclick="this.parentElement.style.display='none'">KEMBALI</button>`;
  } else if (type === 'ai') {
    content.innerHTML = `<h2>🧠 AI MODULE</h2><p>Fitur AI sedang dalam pengembangan.</p><button onclick="this.parentElement.style.display='none'">KEMBALI</button>`;
  }
}

// === MOCK SUBMIT FUNCTIONS ===
function submitOsint() {
  const phone = document.getElementById('osint-phone').value;
  const name = document.getElementById('osint-name').value;
  const nik = document.getElementById('osint-nik').value;
  if (!phone || !name) { alert('Isi minimal nomor & nama'); return; }

  const log = `[OSINT] Target: ${name} | ${phone} | ${nik || 'NIK tidak diisi'} | ${new Date().toLocaleString()}`;
  addToConsole(log);
  // Simpan ke log lokal (nanti ke Firebase)
  saveToLog(log);
}

function submitSpam() {
  const num = document.getElementById('spam-number').value;
  const type = document.querySelector('input[name="spam-type"]:checked')?.value;
  if (!num || !type) { alert('Isi nomor & pilih metode'); return; }

  const types = { sms: 'SMS', wa: 'WhatsApp', pair: 'Pairing Hack', call: 'Telepon' };
  const log = `[SPAM] ${types[type]} ke ${num} | ${new Date().toLocaleString()}`;
  addToConsole(log);
  saveToLog(log);
}

function addToConsole(msg) {
  const logBox = document.getElementById('console-log');
  const p = document.createElement('p');
  p.className = 'log';
  p.textContent = msg;
  logBox.appendChild(p);
  logBox.scrollTop = logBox.scrollHeight;
}

function saveToLog(msg) {
  let logs = JSON.parse(localStorage.getItem('apreconix_logs') || '[]');
  logs.push(msg);
  localStorage.setItem('apreconix_logs', JSON.stringify(logs));
}
