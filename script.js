function showCurrentTime() {
    const now = new Date(); // create object whith hour and date actualy
    const hours = now.getHours();   // cath the hours
    const minutes = now.getMinutes(); // cath the minutes 
    const seconds = now.getSeconds();  // cath the seconds 

    // format the time with two digits

    const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('hour').textContent = timeFormatted

    console.log(`Current time: ${timeFormatted}`);

    //New block, format the date

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayweek = daysOfWeek[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    const dateFormatted = `${dayweek}, ${day} of ${month} of ${year}`;
    document.getElementById('date').textContent = dateFormatted;

};

setInterval(showCurrentTime, 1000);

showCurrentTime();


// tema começa no modo escuro
document.body.classList.add('dark');

// pega o botão
const botaoTema = document.getElementById('toggle-theme');

// função para trocar texto do botão
function atualizarTextoBotao() {
  if (document.body.classList.contains('dark')) {
    botaoTema.textContent = '☀️ Light Mode';
  } else {
    botaoTema.textContent = '🌙 Dark Mode';
  }
}

// evento de clique no botão
botaoTema.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
  atualizarTextoBotao(); // atualiza o texto do botão
});

// garante que o texto inicial seja correto
atualizarTextoBotao();


let seconds = 0;
let ativeTimer = false;
let intervalTimer = null;

function formatTime(segundos) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}: ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function uptadeTimer() {
    document.getElementById('time').textContent = formatTime(seconds);
}

function start() {
    if (!ativeTimer) {
        ativeTimer = true;
        intervalTimer = setInterval(() => {
            seconds++;
            uptadeTimer();
        }, 1000);
    }
}

function pause() {
    ativeTimer = false;
    clearInterval(intervalTimer)
}

function reset() {
    pause();
    seconds = 0;
    uptadeTimer();
}


const buttonMode = document.getElementById('change-mode');

buttonMode.addEventListener('click', () => {
  const relogio = document.getElementById('hour');
  const data = document.getElementById('date');
  const cronometro = document.getElementById('timer');

  if (cronometro.style.display === 'none') {
    // Mostrar cronômetro, esconder relógio
    relogio.style.display = 'none';
    data.style.display = 'none';
    cronometro.style.display = 'block';
    buttonMode.textContent = '🕒 Use Watch';
  } else {
    // Mostrar relógio, esconder cronômetro
    relogio.style.display = 'block';
    data.style.display = 'block';
    cronometro.style.display = 'none';
    buttonMode.textContent = '⏱️ Use Stopwatch';
  }
});

