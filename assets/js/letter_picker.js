(function() {

  class LetterPicker {
    constructor(path) {
      this._curLetter = path.slice(1);
      this._setupGrid();
      this._mouseListeners = [];
    }

    destroy() {
      this._grid.remove();
      if (this._backArrow) {
        this._backArrow.remove();
      }
      this._mouseListeners.forEach((x) => {
        window.removeEventListener('keypress', x);
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
  }

  window.letterpairs.LetterPicker = LetterPicker;

})();
