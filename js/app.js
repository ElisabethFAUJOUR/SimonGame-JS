/**
 * @property {Array} sequence - All the sequences said by Simon
 * @property {object} colors  - The four colors of the game 
 */

const app = {

  colors: [
    'red',
    'green',
    'blue',
    'yellow'
  ],

  sequence: [],

  indexPlayer: 0,

  init: function () {
    app.hideRetryButton();
    app.drawCells();
    app.handleClickGoButton();
  },

  /**
   * Create the four cells for the four colors / Event click on the color 
   */
  drawCells: function () {
    const playgroundElem = document.getElementById('playground');
    for (const color of app.colors) {
      const cellElem = document.createElement('div');
      cellElem.className = 'cell';
      cellElem.id = color;
      cellElem.style.backgroundColor = color;
      playgroundElem.appendChild(cellElem);
      cellElem.addEventListener('click', app.handlePlayerClick);
    }
  },

  /**
   * Animation reducing cell's width, then resets after 150 ms
   * @param {string} color - color 
   */
  bumpCell: function (color) {
    document.getElementById(color).style.borderWidth = '45px';
    setTimeout(() => {
      document.getElementById(color).style.borderWidth = '0';
    }, 150);
  },

  /**
   * Show the message and hide the button Go
   * @param {string} message - message display for the player 
   */
  showMessage: function (message) {
    const messageElement = document.getElementById('message');
    const startButton = document.getElementById('go');
    startButton.classList.add('hidden');
    messageElement.textContent = message;
    messageElement.classList.remove('hidden');
  },

  /**
   * Color sequence display 
   * @param {string} sequence - array that save the color sequence
   */
  simonSays: function (sequence) { // if sequence isn't empty
    if (sequence && sequence.length) { // show the message "Mémorisez la séquence"
      app.showMessage('Mémorisez bien !'); // after 500ms, bump the first cell
      setTimeout(app.bumpCell, 500, sequence[0]); // plays the rest of the sequence after a longer pause (recursive function) until all colors have been displayed (slice(1) = sequence - 1 element)
      setTimeout(app.simonSays, 850, sequence.slice(1)); // if sequence empty// if sequence empty
    } else {
      app.showMessage('A vous !');
    }
  },

  /**
   * Add a random color to the "Simon Says" sequence and play the sequence
   */
  nextSequence: function () {
    const random = Math.floor(Math.random() * app.colors.length); // get a random number between 0 and 3 (four colors)
    app.sequence.push(app.colors[random]); // push the corresponding color to the sequence
    app.showMessage('A vous !'); // show the message "Reproduisez la séquence"
    app.simonSays(app.sequence); // start the new "Simon Says" sequence
  },

  /**
   * Message indicating score at endgame
   */
  showResult: function () {
    const score = app.sequence.length;
    document.querySelector('#result').textContent = `Votre score est de : ${score}`;
  },

  /**
   * End the game and give the score
   */
  endgame: function () {
    const score = app.sequence.length;
    app.showResult(`Partie terminée. Votre score : ${score}`);
    app.showRetryButton();
  },

  /**
   * Reset the sequence and start a new game => create a sequence of 3 random colors
   */
  newGame: function () {
    app.hideRetryButton();
    document.querySelector('#result').textContent = '';
    app.sequence = [];
    app.indexPlayer = 0;
    for (let index = 0; index < 3; index++) {
      const random = Math.floor(Math.random() * app.colors.length); // get a random number between 0 and 3v
      app.sequence.push(app.colors[random]); // add the corresponding color to the sequence
    }

    app.simonSays(app.sequence);

    const cells = document.getElementsByClassName('cell');
    for (const cell of cells) {
      cell.addEventListener('click', app.handlePlayerClick);
    }
  },

  hideRetryButton: function() {
    const retryButton = document.getElementById('retry');
    retryButton.classList.add('hidden');
  },

  showRetryButton: function () {
    const retryButton = document.getElementById('retry');
    retryButton.textContent = 'Perdu ! REJOUER';
    retryButton.classList.remove('hidden');
    retryButton.addEventListener('click', app.newGame);
  },

  /**
   * Player reproduces the color sequence by clicking on cells 
   */
  handlePlayerClick: function (event) {
    const clickedColor = event.target;
    const expectedColor = app.sequence[app.indexPlayer];

    app.bumpCell(clickedColor.id);

    if (clickedColor.id !== expectedColor) {
      app.endgame();
    } else {
      if (app.indexPlayer < app.sequence.length - 1) {
        app.indexPlayer++;
      } else {
        app.indexPlayer = 0;
        app.nextSequence();
      }
    }
  },

  /**
   * Listen event Click Go Button => start a new game
   */
  handleClickGoButton: function () {
    document.getElementById('go').addEventListener('click', app.newGame);
  },
};

// Launch init when DOM is ready
document.addEventListener('DOMContentLoaded', app.init);
