let seconds = 0;
let milliseconds = 0;
let ativeTimer = false;
let intervalTimer = null;

function showCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const secondsNow = now.getSeconds().toString().padStart(2, '0');
  document.getElementById('hour').textContent = `${hours}:${minutes}:${secondsNow}`;

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayWeek = daysOfWeek[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  document.getElementById('date').textContent = `${dayWeek}, ${day} of ${month} of ${year}`;
}
setInterval(showCurrentTime, 1000);
showCurrentTime();

function formatTime(seconds, milliseconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const ms = milliseconds % 100;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

function updateTimer() {
  document.getElementById('time').textContent = formatTime(seconds, milliseconds);
}

function start() {
  if (!ativeTimer) {
    ativeTimer = true;
    intervalTimer = setInterval(() => {
      milliseconds++;
      if (milliseconds === 100) {
        milliseconds = 0;
        seconds++;
      }
      updateTimer();
    }, 10);
  }
}

function pause() {
  ativeTimer = false;
  clearInterval(intervalTimer);
}

function reset() {
  pause();
  seconds = 0;
  milliseconds = 0;
  updateTimer();
}

document.getElementById('change-mode').addEventListener('click', () => {
  const relogio = document.getElementById('hour');
  const data = document.getElementById('date');
  const cronometro = document.getElementById('timer');
  const button = document.getElementById('change-mode');

  if (cronometro.style.display === 'none') {
    relogio.style.display = 'none';
    data.style.display = 'none';
    cronometro.style.display = 'block';
    button.textContent = 'Use Watch';
  } else {
    relogio.style.display = 'block';
    data.style.display = 'block';
    cronometro.style.display = 'none';
    button.textContent = 'Use Stopwatch';
  }
});

// Alternar tema
document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('theme-dark');
});

// Horários Internacionais
function updateWorldClocks() {
  const zones = {
    london: 'Europe/London',
    newyork: 'America/New_York',
    tokyo: 'Asia/Tokyo',
    sydney: 'Australia/Sydney'
  };

  for (const id in zones) {
    const time = new Date().toLocaleTimeString('en-US', {
      timeZone: zones[id],
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    document.getElementById(id).textContent = `${id.charAt(0).toUpperCase() + id.slice(1)}: ${time}`;
  }
}
setInterval(updateWorldClocks, 1000);
updateWorldClocks();

// Clima com proxy de segurança
function getWeatherByLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiKey = "4d029778610ca352a10a88dcf60e5246"; // sua chave válida
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt`;

        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error("Falha ao buscar clima");
            }
            return response.json();
          })
          .then(data => {
            const cidade = data.name;
            const temperatura = Math.round(data.main.temp);
            const descricao = data.weather[0].description;
            document.getElementById('weather').textContent =
              `📍 ${cidade}: ${temperatura}°C, ${descricao}`;
          })
          .catch(error => {
            document.getElementById('weather').textContent =
              '❌ Erro ao obter o clima (falha na conexão).';
          });
      },
      error => {
        document.getElementById('weather').textContent =
          '⛔ Permissão de localização negada.';
      }
    );
  } else {
    document.getElementById('weather').textContent =
      '⚠️ Geolocalização não suportada.';
  }
}

window.addEventListener("DOMContentLoaded", () => {
  getWeatherByLocation();
});
