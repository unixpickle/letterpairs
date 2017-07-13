(function() {

  const BACKSPACE_KEY = 8;
  const ESCAPE_KEY = 27;

  class LetterPicker {
    constructor(path) {
      this._curLetter = path.slice(1);
      this._keyListeners = [];
      this._setupGrid();

      if (this._curLetter) {
        this._backArrow = document.createElement('button');
        this._backArrow.className = 'back-button picker-back-button';
        this._backArrow.addEventListener('click', () => letterpairs.navigateTo('/'));
        document.body.appendChild(this._backArrow);
      }

      if (path.length === 2) {
        this._addKeyListener((e) => {
          if (e.which === ESCAPE_KEY || e.which === BACKSPACE_KEY) {
            window.letterpairs.navigateTo('/');
          }
        });
      }
    }

    destroy() {
      this._grid.remove();
      if (this._backArrow) {
        this._backArrow.remove();
      }
      this._keyListeners.forEach((x) => {
        window.removeEventListener('keydown', x);
      });
    }

    _setupGrid(curLetter) {
      this._grid = document.createElement('table');
      const tbody = document.createElement('tbody');
      for (let row = 0; row < 6; ++row) {
        let rowElem = document.createElement('tr');
        for (let col = 0; col < 4; ++col) {
          const letter = window.letterpairs.letters[col + row*4];
          const colElem = document.createElement('td');

          colElem.textContent = letter.toUpperCase();
          if (letter === this._curLetter) {
            colElem.className = 'selected';
          }
          colElem.addEventListener('click', () => {
            this._pickedLetter(letter);
          });

          this._addKeyListener((e) => {
            if ((e.key === letter || e.key === 'z' && letter === 'x') &&
                !e.metaKey && !e.ctrlKey && !e.altKey) {
              this._pickedLetter(letter);
            }
          });

          rowElem.appendChild(colElem);
          rowElem.style.color = window.letterpairs.letterColor(letter);
        }
        tbody.appendChild(rowElem);
      }

      this._grid.appendChild(tbody);
      document.body.appendChild(this._grid);
    }

    _pickedLetter(letter) {
      window.letterpairs.navigateTo('/'+this._curLetter+letter);
    }

    _addKeyListener(listener) {
      this._keyListeners.push(listener);
      window.addEventListener('keydown', listener);
    }
  }

  window.letterpairs.LetterPicker = LetterPicker;

})();
