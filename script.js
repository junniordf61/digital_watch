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
