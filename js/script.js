const tanah = document.querySelectorAll('.tanah');
const tikus = document.querySelectorAll('.tikus');
const papanSkor = document.querySelector('.papan-skor');
const pop = document.querySelector('#pop');

let tanahSebelumnya;
let selesai;
let skor;
let sisaWaktu = 30;
let level = 1;

function updateWaktu() {
  const waktuElement = document.getElementById('waktu');
  waktuElement.textContent = `Sisa Waktu: ${sisaWaktu} Detik`;
  waktuElement.style.fontSize = '20px'; 
  waktuElement.style.color = 'black'; 
}

function updateLevel() {
  const levelElement = document.getElementById('level');
  levelElement.textContent = level;
}

function kurangiWaktu() {
  if (sisaWaktu > 0) {
    sisaWaktu--;
    updateWaktu();
    setTimeout(kurangiWaktu, 1000);
  } else {
    selesai = true;
    tampilkanNotifikasiGameOver();
  }
}

function tutupNotifikasi() {
    const gameOverNotification = document.querySelector('.game-over-notification');
    if (gameOverNotification) {
        gameOverNotification.remove();
    }
}

function pilihKarakter() {
  const dialog = document.createElement('div');
  dialog.classList.add('dialog');

  const gambar1 = document.createElement('img');
  gambar1.src = 'img/tikus.png';
  gambar1.alt = 'Tikus 1';
  gambar1.addEventListener('click', () => {
    pilihTikus(gambar1.src);
    dialog.remove();
    showNotification();
  });

  const gambar2 = document.createElement('img');
  gambar2.src = 'img/tikus2.png';
  gambar2.alt = 'Tikus 2';
  gambar2.addEventListener('click', () => {
    pilihTikus(gambar2.src);
    dialog.remove();
    showNotification();
  });

  const gambar3 = document.createElement('img');
  gambar3.src = 'img/tikus3.png';
  gambar3.alt = 'Tikus 3';
  gambar3.addEventListener('click', () => {
    pilihTikus(gambar3.src);
    dialog.remove();
    showNotification();
  });

  dialog.appendChild(gambar1);
  dialog.appendChild(gambar2);
  dialog.appendChild(gambar3);

  document.body.appendChild(dialog);
}

function showNotification() {
  const notification = document.createElement('div');
  notification.classList.add('notification-card');
  notification.textContent = "Anda telah berhasil memilih karakter!";

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000); 

  const notifikasiAudio = document.getElementById('notifikasiAudio');
  notifikasiAudio.play();
}

function pilihTikus(gambarSrc) {
  const tikus = document.querySelectorAll('.tikus');
  tikus.forEach(t => {
    t.style.backgroundImage = `url('${gambarSrc}')`;
  });
}

function randomTanah(tanah) {
  const t = Math.floor(Math.random() * tanah.length);
  const tRandom = tanah[t];
  if (tRandom == tanahSebelumnya) {
    randomTanah(tanah);
  }
  tanahSebelumnya = tRandom;
  return tRandom;
}

function randomWaktu(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function munculkanTikus(min, max) {
  const tRandom = randomTanah(tanah);
  const wRandom = randomWaktu(min, max);
  tRandom.classList.add('muncul');

  setTimeout(() => {
    tRandom.classList.remove('muncul');
    if (!selesai) {
      munculkanTikus(min, max);
    }
  }, wRandom);
}

function mulai() {
  selesai = false;
  skor = 0;
  sisaWaktu = 30;
  papanSkor.textContent = 0;
  updateLevel(); 

  const backgroundAudio = document.getElementById('background-audio');
  backgroundAudio.play();

  document.body.className = '';

  switch (level) {
    case 1:
      document.body.classList.add('level-1');
      tanah.forEach(t => {
        t.classList.remove('muncul');
      });
      munculkanTikus(1500, 2000);
      break;
    case 2:
      document.body.classList.add('level-2');
      tanah.forEach(t => {
        t.classList.remove('muncul');
      });
      munculkanTikus(1000, 1300);
      break;
    case 3:
      document.body.classList.add('level-3');
      tanah.forEach(t => {
        t.classList.remove('muncul');
      });
      munculkanTikus(800, 1000);
      break;
  }

  kurangiWaktu();
  setTimeout(() => {
    selesai = true;
    updateWaktu();
    backgroundAudio.start();
  }, 30000);
}


function pukul() {
  if (this.parentNode.classList.contains('muncul')) {
    skor++;
    this.parentNode.classList.remove('muncul');
    pop.play();
    papanSkor.textContent = skor;
  }
}

function lanjutKeLevel(nextLevel) {
  level = nextLevel;
  mulai();
  tutupNotifikasi();
}

tikus.forEach(t => {
  t.addEventListener('click', pukul);
});

function tampilkanNotifikasiGameOver() {
  pauseBackgroundAudio();

  const gameOverNotification = document.createElement('div');
  gameOverNotification.classList.add('game-over-notification');

  let buttonHtml = '';
  let additionalMessage = '';

  if (level === 3) {
    additionalMessage = "<p style='color: black;'>Pemain telah menyelesaikan semua level!</p>";
  } else if (level < 3) {
    buttonHtml = `<button onclick="lanjutKeLevel(${level + 1})">LANJUT KE LEVEL ${level + 1}</button>`;
  }

  gameOverNotification.innerHTML = `
        <div class="game-over-content">
        <h2>${level === 3 ? 'Game Over!' : 'Berhasil!'}</h2>
            <p>Skor Akhir: ${skor}</p>
            ${additionalMessage}
            <div class="button-container">
                ${buttonHtml}
                <button onclick="tutupNotifikasi()">Tutup</button>
            </div>
        </div>
    `;

  document.body.appendChild(gameOverNotification);

  const notifikasiAudio = document.getElementById('notifikasiAudio');
  notifikasiAudio.play();
}

function tampilkanDeskripsi() {
  const deskripsi = "Cara Main:<br><br>1. Pilih karakter tikus.<br>2. Klik tombol 'Mulai'.<br>3. Pukul tikus yang muncul dengan mengkliknya.<br>4. Kumpulkan skor sebanyak mungkin sebelum waktu habis.";

  const notifikasi = document.createElement('div');
  notifikasi.classList.add('notifikasi');
  
  const deskripsiElement = document.createElement('p');
  deskripsiElement.innerHTML = deskripsi;
  
  const okButton = document.createElement('button');
  okButton.textContent = 'OK!';
  okButton.onclick = () => {
    notifikasi.remove();
  };

  notifikasi.appendChild(deskripsiElement);
  notifikasi.appendChild(okButton);
  
  document.body.appendChild(notifikasi);

  const notifikasiAudio = document.getElementById('notifikasiAudio');
  notifikasiAudio.play();
}


function pauseBackgroundAudio() {
  const backgroundAudio = document.getElementById('background-audio');
  backgroundAudio.pause();
}