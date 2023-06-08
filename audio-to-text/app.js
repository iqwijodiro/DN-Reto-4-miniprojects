const msgEl = document.getElementById('msg');
const listen = document.querySelector('#listen');
const stopBtn = document.querySelector('#stop');


const randomNum = getRandomNumber();

// Generate random number
function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

console.log('Number:', randomNum);

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();
recognition.lang = 'es-ES' // Definimos el idioma a procesar

let listening; // Bandera para saber si está escuchando

listen.addEventListener('click', () => {
  // Comenzar reconocimiento
  recognition.start();
  listening = true
  console.log('started')
})
stopBtn.addEventListener('click', () => {
  // Detener el reconocimiento
  recognition.stop();
  listening = false
  console.log('aborted')
  msgEl.innerHTML += '<div>Vuelve a iniciar el servicio para escuchar</div>';
})

// // Escuchamos el evento result que es lo obtenido del reconocimiento
recognition.addEventListener('result', onSpeak);

// // Terminamos la captura del audio e iniciamos el procesamiento del audio
recognition.addEventListener('end', () => recognition.start());

// Capturar el audio del usuario
function onSpeak(evt) {
  const msg = evt.results[0][0].transcript;
  console.log(msg)

  writeMessage(msg);
  checkNumber(msg);
}

// Escribir el mensaje
function writeMessage(msg) {
  if (listening) {
    msgEl.innerHTML = `
      <div>Dijiste: </div>
      <span class="box">${msg}</span>
    `
  }
}

// Comparar mensaje con un numero
function checkNumber(msg) {
  const num = +msg;

  if (listening) {
    // Valida si es un nro valido
    if (Number.isNaN(num) && listening) {
      msgEl.innerHTML += '<div>Ese no es un numero válido</div>';
      return;
    }
  
    // Valida el rango
    if (num > 100 || num < 1) {
      msgEl.innerHTML += '<div>El numero debe ser entre 1 y 100</div>';
      return;
    }
  
    // Compara con el nro a adivinar
    if (num === randomNum) {
      document.body.innerHTML = `
        <h2>Felicidades, has adivinado <br><br>
        era el ${num}</h2>
        <button class="play-again" id="play-again">Jugar de nuevo</button>
      `;
    } else if (num > randomNum) {
      msgEl.innerHTML += '<div>Intenta con uno más bajo</div>';
    } else {
      msgEl.innerHTML += '<div>Intenta con uno más alto</div>';
    }
  }

}

document.body.addEventListener('click', e => {
  if (e.target.id == 'play-again') {
    window.location.reload();
  }
});
