// === SESSION & COUNTDOWN ===
function initSession() {
  const name = document.getElementById('user-name')?.value?.trim();
  const key = document.getElementById('user-key')?.value?.trim();

  if (!name || !key) {
    alert('⚠️ Nama dan key aktivasi wajib diisi.');
    return;
  }

  // Ganti dengan key yang valid — sekarang hardcode RC-RX25
  if (key !== 'RC-RX25') {
    alert('⚠️ Key aktivasi salah. Hubungi owner untuk mendapatkan key yang valid.');
    return;
  }

  const now = new Date().getTime();
  localStorage.setItem('apreconix_user', JSON.stringify({ name, activatedAt: now }));

  // Sembunyikan splash, tampilkan UI
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('main-ui').classList.add('visible');

  startCountdown();
}

function startCountdown() {
  const data = JSON.parse(localStorage.getItem('apreconix_user'));
  if (!data || !data.activatedAt) return;

  const activated = data.activatedAt;
  const expiry = activated + (5 * 24 * 60 * 60 * 1000);
  const countdownEl = document.getElementById('countdown');

  const update = () => {
    const now = new Date().getTime();
    const diff = expiry - now;

    if (diff <= 0) {
      document.body.innerHTML = `
        <div style="text-align:center; padding:50px; color:#f00; font-family:'Orbitron'; font-size:1.8rem; background:#000;">
          WAKTU LANGGANAN HABIS<br><br>
          ${new Date().toLocaleString('id-ID')}
        </div>`;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    countdownEl.textContent = `⏳ Sisa: ${days}d ${hours}j ${mins}m`;
    setTimeout(update, 60000);
  };
  update();
}

// === LOAD CHECK ===
window.addEventListener('load', () => {
  const user = localStorage.getItem('apreconix_user');
  if (user) {
    try {
      const data = JSON.parse(user);
      if (data && typeof data.activatedAt === 'number') {
        document.getElementById('splash').classList.add('hidden');
        document.getElementById('main-ui').classList.add('visible');
        startCountdown();
        return;
      }
    } catch (e) {
      console.warn('Session corrupt, clearing...');
      localStorage.removeItem('apreconix_user');
    }
  }
  // Jika tidak valid, biarkan splash tetap tampil
});

// === TABS ===
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// === MENU ===
function toggleMenu() {
  document.getElementById('side-menu').classList.toggle('active');
}

function showSubMenu(type) {
  toggleMenu();
  const el = document.getElementById('submenu-content');
  el.style.display = 'block';

  if (type === 'log') {
    const logs = JSON.parse(localStorage.getItem('apreconix_logs') || '[]');
    const logText = logs.length ? logs.join('\n') : '[Belum ada aktivitas]';
    el.innerHTML = `
      <h2>📁 LOG AKTIVITAS</h2>
      <hr>
      <pre style="color:#0f0; background:#000; padding:15px; border-radius:8px; overflow:auto;">${logText}</pre>
      <button onclick="this.parentElement.style.display='none'" style="margin-top:15px; background:#0f0; color:#000; border:none; padding:8px 15px; border-radius:6px;">TUTUP</button>
    `;
  } else if (type === 'cs') {
    el.innerHTML = `<h2>🛠️ CUSTOMER SUPPORT</h2><p>Sedang dalam pengembangan.</p><button onclick="this.parentElement.style.display='none'">KEMBALI</button>`;
  } else {
    el.innerHTML = `<h2>🧠 AI MODULE</h2><p>Fitur AI sedang dalam pengembangan.</p><button onclick="this.parentElement.style.display='none'">KEMBALI</button>`;
  }
}

// === MOCK SUBMIT ===
function submitOsint() {
  const phone = document.getElementById('osint-phone').value.trim();
  const name = document.getElementById('osint-name').value.trim();
  const nik = document.getElementById('osint-nik').value.trim();

  if (!phone || !name) { alert('Isi minimal nomor & nama target'); return; }

  const log = `[OSINT] ${name} | ${phone} | ${nik || '–'} | ${new Date().toLocaleString('id-ID')}`;
  addToConsole(log);
  saveToLog(log);
}

function submitSpam() {
  const num = document.getElementById('spam-number').value.trim();
  const type = document.querySelector('input[name="spam-type"]:checked')?.value;
  if (!num || !type) { alert('Isi nomor & pilih metode spam'); return; }

  const label = { sms: 'SMS', wa: 'WhatsApp', pair: 'Pairing Hack', call: 'Telepon' };
  const log = `[SPAM] ${label[type]} → ${num} | ${new Date().toLocaleString('id-ID')}`;
  addToConsole(log);
  saveToLog(log);
}

function addToConsole(msg) {
  const box = document.getElementById('console-log');
  const p = document.createElement('p');
  p.className = 'log';
  p.textContent = msg;
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
}

function saveToLog(msg) {
  const logs = JSON.parse(localStorage.getItem('apreconix_logs') || '[]');
  logs.push(msg);
  localStorage.setItem('apreconix_logs', JSON.stringify(logs));
}
