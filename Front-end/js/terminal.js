import LocalEchoController from '../js/import/local-echo/local-echo.js';

let localEcho;
const term = new Terminal();

/**
 * Initialize terminal.
 *
 * @author Guilherme da Silva Martin
 */
function initTerminal() {
  joinRoom();
  term.open(document.getElementById('terminal'));
  localEcho = new LocalEchoController(term);

  term.write('Welcome to RTCode \r\n');
  term.write('\r\n');
}

/**
 * Handle terminal keyups
 *
 * @author Guilherme da Silva Martin
 */
$('#terminal').on('keyup', (e) => {});

/**
 * Returns the name of the room sent by parameter
 *
 * @author Guilherme da Silva Martin
 */
function getRoomName() {
  let url = window.location.href;
  let roomName = url.split('/').reverse()[0];

  return roomName;
}

/**
 * Handle receiving new terminal data
 *
 * @author Guilherme da Silva Martin
 */
socket.on('term-data', (data) => {
  localEcho.println('\n' + data);
  handleUserInput();
});

/**
 * Handle receiving terminal key input
 *
 * @author Guilherme da Silva Martin
 */
socket.on('term-enter-data', (data) => {
  localEcho.print(data + '\n\r');
});

/**
 * Connects to desired room
 *
 * @author Guilherme da Silva Martin
 */
function joinRoom() {
  socket.emit('join-terminal', getRoomName());
}

/**
 * Handle user key input.
 *
 * @author Guilherme da Silva Martin
 */
function handleUserInput() {
  localEcho
    .read('~$ ')
    .then((input) => {
      socket.emit('cmd', [getRoomName(), input]);
      socket.emit('term-enter', [getRoomName(), input]);
    })
    .catch((error) => console.log(`Error reading: ${error}`));
}

/**
 * Runs as soon as the page is ready.
 *
 * @author Guilherme da Silva Martin
 */
$(document).ready(() => {
  initTerminal();
  handleUserInput();
});
