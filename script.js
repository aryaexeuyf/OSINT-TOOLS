// Cek apakah sudah login
if (localStorage.getItem('user')) {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  startTimer();
} else {
  document.getElementById('app').style.display = 'none';
}

function login() {
  const name = document.getElementById('name').value.trim();
  const key = document.getElementById('key').value.trim();

  if (!name) { alert('⚠️ Masukkan nama'); return; }
  if (!key) { alert('⚠️ Masukkan key aktivasi'); return; }
  if (key !== 'RC-RX25') { alert('⚠️ Key salah. Hubungi owner.'); return; }

  // Simpan sesi
  localStorage.setItem('user', JSON.stringify({
    name: name,
    time: Date.now()
  }));

  // Tampilkan app
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  startTimer();
}

function startTimer() {
  const user = JSON.parse(localStorage.getItem('user'));
  const expiry = user.time + (5 * 24 * 60 * 60 * 1000);

  function update() {
    const now = Date.now();
    if (now >= expiry) {
      document.body.innerHTML = `<div style="padding:50px;text-align:center;color:red;font-family:Arial;font-size:1.8rem;background:#000;">WAKTU LANGGANAN HABIS<br><br>${new Date().toLocaleString('id-ID')}</div>`;
      return;
    }

    const diff = expiry - now;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    document.getElementById('timer').innerText = `⏳ ${d}d ${h}j ${m}m`;
    setTimeout(update, 60000);
  }
  update();
}

// Tab navigation
function showTab(id) {
  document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  event.target.classList.add('active');
}

// Menu
function toggleMenu() {
  document.getElementById('menu').classList.toggle('active');
}

// Log
function log(msg) {
  const el = document.getElementById('log');
  el.innerHTML += '\n' + msg;
  el.scrollTop = el.scrollHeight;
}

function runOsint() {
  const p = document.getElementById('phone1').value.trim();
  const n = document.getElementById('name1').value.trim();
  if (!p || !n) { alert('Isi nomor & nama'); return; }
  const msg = `[OSINT] ${n} | ${p} | ${new Date().toLocaleTimeString()}`;
  log(msg);
  saveLog(msg);
}

function runSpam() {
  const p = document.getElementById('phone2').value.trim();
  const m = document.querySelector('input[name="m"]:checked')?.value;
  if (!p || !m) { alert('Isi nomor & pilih metode'); return; }
  const names = { sms: 'SMS', wa: 'WhatsApp', pair: 'Pairing', call: 'Telepon' };
  const msg = `[SPAM] ${names[m]} → ${p} | ${new Date().toLocaleTimeString()}`;
  log(msg);
  saveLog(msg);
}

function saveLog(msg) {
  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push(msg);
  localStorage.setItem('logs', JSON.stringify(logs));
}

function openLog() {
  toggleMenu();
  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  alert(logs.length ? logs.join('\n\n') : 'Belum ada aktivitas.');
}

function devMsg(name) {
  toggleMenu();
  alert(`${name} sedang dalam pengembangan.`);
}
