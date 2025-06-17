window.addEventListener("DOMContentLoaded", function () {
  let currentLanguage = "pt-BR";
  let seconds = 0,
      milliseconds = 0,
      activeTimer = false,
      intervalTimer = null;

  // 🌍 Relógios Mundiais
  function updateWorldClocks() {
    const now = new Date();
    document.querySelectorAll(".world-clock").forEach((el) => {
      const zone = el.getAttribute("data-zone");
      const time = now.toLocaleTimeString(currentLanguage, {
        timeZone: zone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      el.querySelector(".world-time").textContent = time;
    });
  }
  setInterval(updateWorldClocks, 1000);
  updateWorldClocks();

  // 🌤️ Clima automático
  async function loadWeather() {
    const el = document.getElementById("weather");
    if (!el) return;

    el.textContent = "⏳ Buscando localização precisa...";
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const geoData = await geoRes.json();
        const city = geoData.address.city || geoData.address.town || geoData.address.village || "Cidade desconhecida";
        const country = geoData.address.country_code?.toUpperCase() || "??";

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const weatherData = await weatherRes.json();
        const { temperature, windspeed, weathercode } = weatherData.current_weather;

        const conditionMap = {
          0: "☀️ Céu limpo", 1: "🌤️ Parcialmente nublado", 2: "⛅ Nublado", 3: "☁️ Muito nublado",
          45: "🌫️ Névoa", 51: "🌦️ Chuva leve", 61: "🌧️ Chuva moderada",
          71: "❄️ Neve leve", 95: "⛈️ Tempestade",
        };
        const condition = conditionMap[weathercode] || "🌡️ Clima variável";

        el.innerHTML = `
          <p><strong>${city}, ${country}</strong></p>
          <p>${condition}</p>
          <p>🌡️ ${temperature}°C | 💨 Vento: ${windspeed} km/h</p>
        `;
      }, () => {
        el.innerHTML = `<span style="color:red;">❌ Permissão de localização negada.</span>`;
      });
    } catch (err) {
      el.innerHTML = `<span style="color:red;">❌ Erro ao buscar clima.</span>`;
    }
  }

  // 🕒 Relógio Atual
  function showCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const secondsNow = now.getSeconds().toString().padStart(2, "0");
    const day = now.toLocaleDateString(currentLanguage, { weekday: "long" });
    const date = now.toLocaleDateString(currentLanguage, { day: "numeric", month: "long", year: "numeric" });

    const hourEl = document.getElementById("hour");
    const dateEl = document.getElementById("date");
    if (hourEl && dateEl) {
      hourEl.textContent = `${hours}:${minutes}:${secondsNow}`;
      dateEl.textContent = `${capitalize(day)}, ${date}`;
    }
  }
  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  setInterval(showCurrentTime, 1000);
  showCurrentTime();

  // ⏱️ Cronômetro
  function formatTime(seconds, milliseconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const ms = milliseconds % 100;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
  }
  function updateTimer() {
    const el = document.getElementById("time");
    if (el) el.textContent = formatTime(seconds, milliseconds);
  }
  window.start = function () {
    if (!activeTimer) {
      activeTimer = true;
      intervalTimer = setInterval(() => {
        milliseconds++;
        if (milliseconds === 100) {
          milliseconds = 0;
          seconds++;
        }
        updateTimer();
      }, 10);
    }
  };
  window.pause = function () {
    activeTimer = false;
    clearInterval(intervalTimer);
  };
  window.reset = function () {
    pause();
    seconds = 0;
    milliseconds = 0;
    updateTimer();
  };

  // ⏲️ Temporizador
  let timerInterval = null;
  let totalTimeInSeconds = 0;
  let remainingTime = 0;
  let isTimerRunning = false;
  function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60).toString().padStart(2, "0");
    const seconds = (remainingTime % 60).toString().padStart(2, "0");
    const display = document.getElementById("timer-display");
    if (display) display.textContent = `${minutes}:${seconds}`;
  }
  window.startTimer = function () {
    if (isTimerRunning) return;

    const inputMinutes = parseInt(document.getElementById("timer-minutes").value) || 0;
    const inputSeconds = parseInt(document.getElementById("timer-seconds").value) || 0;
    if (remainingTime <= 0) {
      totalTimeInSeconds = inputMinutes * 60 + inputSeconds;
      remainingTime = totalTimeInSeconds;
    }
    if (remainingTime <= 0) return;

    isTimerRunning = true;
    timerInterval = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        alert("⏰ Tempo encerrado!");
      }
    }, 1000);
    updateTimerDisplay();
  };
  window.pauseTimer = function () {
    clearInterval(timerInterval);
    isTimerRunning = false;
  };
  window.resetTimer = function () {
    pauseTimer();
    remainingTime = 0;
    totalTimeInSeconds = 0;
    updateTimerDisplay();
    document.getElementById("timer-display").textContent = "00:00";
  };

  // 🌐 Conversor de Horários
  function updateConvertedTime() {
    const from = document.getElementById("fromTimezone").value;
    const to = document.getElementById("toTimezone").value;
    const now = new Date();
    const fromTime = now.toLocaleTimeString(currentLanguage, { timeZone: from, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const toTime = now.toLocaleTimeString(currentLanguage, { timeZone: to, hour: "2-digit", minute: "2-digit", second: "2-digit" });

    document.getElementById("convertedTime").textContent = `${from} → ${to}: ${fromTime} → ${toTime}`;
  }
  document.getElementById("fromTimezone").addEventListener("change", updateConvertedTime);
  document.getElementById("toTimezone").addEventListener("change", updateConvertedTime);
  setInterval(updateConvertedTime, 1000);

  // 💱 Conversor de Moedas (CORRIGIDO - sem chave de API)
  function updateConvertedCurrency() {
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;
  const amount = parseFloat(document.getElementById("currencyAmount").value) || 1;

  const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Erro na requisição");
      return res.json();
    })
    .then(data => {
      const rate = data.rates[to];
      if (!rate) {
        document.getElementById("currencyResult").textContent = "Conversão indisponível.";
        return;
      }
      document.getElementById("currencyResult").textContent = `💱 ${amount} ${from} = ${rate.toFixed(2)} ${to}`;
    })
    .catch(err => {
      console.error("Erro no conversor:", err);
      document.getElementById("currencyResult").textContent = "Erro ao converter.";
    });
}


  document.getElementById("fromCurrency").addEventListener("change", updateConvertedCurrency);
  document.getElementById("toCurrency").addEventListener("change", updateConvertedCurrency);
  document.getElementById("currencyAmount").addEventListener("input", updateConvertedCurrency);

  // 🌙 Tema Claro/Escuro
  document.getElementById("toggle-theme")?.addEventListener("click", () => {
    const body = document.body;
    const isDark = body.classList.contains("theme-dark");
    body.classList.remove("theme-dark", "theme-light");
    body.classList.add(isDark ? "theme-light" : "theme-dark");
  });

  // 🔀 Alternância de Abas
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-tab");

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    tabContents.forEach((tab) => {
      tab.classList.remove("active");
      if (tab.id === `tab-${target}`) {
        tab.classList.add("active");

        if (target === "rates") loadCurrencyRates();
        if (target === "stocks") loadStockQuotes();
        if (target === "weather") loadWeather();
        if (target === "currency-converter") updateConvertedCurrency();
      }
    });
  });
});


  // 🌐 Idioma
  document.getElementById("language-select")?.addEventListener("change", (e) => {
    currentLanguage = e.target.value;
    updateTranslatedTexts();
    showCurrentTime();
    updateConvertedTime();
  });

  function updateTranslatedTexts() {
    const t = {
      "pt-BR": { changeTheme: "Mudar Tema", selectLang: "Idioma:" },
      en: { changeTheme: "Toggle Theme", selectLang: "Language:" },
      es: { changeTheme: "Cambiar Tema", selectLang: "Idioma:" },
      fr: { changeTheme: "Changer Thème", selectLang: "Langue :" },
    }[currentLanguage];

    document.getElementById("toggle-theme").textContent = t.changeTheme;
    document.querySelector("label[for='language-select']").textContent = t.selectLang;
  }

  document.querySelector('.tab-button[data-tab="clock"]')?.click();
});

// 📈 Cotações (bolsas)
async function loadStockQuotes() {
  const apikey = "d17mg09r01qtc1t9a580d17mg09r01qtc1t9a58g";
  const indices = {
    BITCOIN: { symbol: "BINANCE:BTCUSDT", label: "₿ Bitcoin" },
    ETHEREUM: { symbol: "BINANCE:ETHUSDT", label: "Ξ Ethereum" },
    NASDAQ: { symbol: "QQQ", label: "🇺🇸 NASDAQ (QQQ)" },
    "DOW JONES": { symbol: "DIA", label: "🇺🇸 Dow Jones (DIA)" },
    "S&P 500": { symbol: "SPY", label: "🇺🇸 S&P 500 (SPY)" },
    "NIKKEI 225": { symbol: "EWJ", label: "🇯🇵 Nikkei 225 (EWJ)" },
  };

  const container = document.getElementById("stock-quotes");
  container.innerHTML = "<p style='color:gray'>Carregando cotações via Finnhub...</p>";

  let output = "<div style='display: flex; flex-wrap: wrap; gap: 20px;'>";

  for (const [nome, info] of Object.entries(indices)) {
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${info.symbol}&token=${apikey}`);
      const data = await res.json();

      if (!data || !data.c || data.c === 0) {
        output += `<div class="stock-box"><h3>${info.label}</h3><p>❌ Dados indisponíveis</p></div>`;
        continue;
      }

      const precoAtual = data.c.toFixed(2);
      const precoAnterior = data.pc.toFixed(2);
      const variacao = (((data.c - data.pc) / data.pc) * 100).toFixed(2);
      const icone = variacao < 0 ? "📉" : "📈";
      const cor = variacao < 0 ? "red" : "limegreen";
      const horario = new Date().toLocaleString("pt-BR");

      output += `
        <div class="stock-box">
          <h3>${icone} ${info.label}</h3>
          <p><strong>Preço:</strong> ${precoAtual} USD</p>
          <p style="color:${cor};"><strong>Variação:</strong> ${variacao}%</p>
          <p><small>📅 Atualizado: ${horario}</small></p>
        </div>`;
    } catch (err) {
      output += `<div class="stock-box"><h3>${info.label}</h3><p>❌ Erro ao carregar</p></div>`;
    }
  }

  output += "</div>";
  container.innerHTML = output;
}

// ☰ Sidebar Toggle
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}


// 💹 Cotações de moedas (painel)
async function loadCurrencyRates() {
  const el = document.getElementById("rates-info");
  if (!el) return;

  el.innerHTML = "Carregando cotações...";
  try {
    const url = "https://api.exchangerate.host/latest?base=USD&symbols=BRL,EUR,GBP,AUD,CAD,JPY";
    const res = await fetch(url);
    const data = await res.json();

    const date = data.date;
    const rates = data.rates;
    const cards = [
      { flag: "🇧🇷", code: "BRL", nome: "Real" },
      { flag: "🇪🇺", code: "EUR", nome: "Euro" },
      { flag: "🇬🇧", code: "GBP", nome: "Libra" },
      { flag: "🇯🇵", code: "JPY", nome: "Iene" },
      { flag: "🇦🇺", code: "AUD", nome: "Dólar Australiano" },
      { flag: "🇨🇦", code: "CAD", nome: "Dólar Canadense" },
    ];

    el.innerHTML = `<p style="margin-bottom: 10px;">🗓️ Última atualização: ${date}</p><div class="rate-grid">`;

    for (const moeda of cards) {
      const valor = rates[moeda.code];
      el.innerHTML += `
        <div class="stock-box">
          <h3>${moeda.flag} ${moeda.nome} (${moeda.code})</h3>
          <p><strong>1 USD = ${valor.toFixed(2)} ${moeda.code}</strong></p>
        </div>`;
    }
    el.innerHTML += `</div>`;
  } catch (err) {
    el.innerHTML = "<span style='color: red;'>Erro ao carregar as cotações.</span>";
    console.error("Erro ao carregar cotações:", err);
  }
}
