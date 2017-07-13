(function() {

  const BACKSPACE_KEY = 8;
  const ESCAPE_KEY = 27;
  const PLUS_KEY = 187;

  class List {
    constructor(route) {
      this._pair = route.slice(1);

      this._container = document.createElement('div');
      this._container.className = 'list-container';

      this._backArrow = document.createElement('button');
      this._backArrow.className = 'back-button';
      this._backArrow.addEventListener('click', () => letterpairs.navigateTo('/'));

      this._createHeading();
      this._createList();
      this._createAddButton();

      document.body.appendChild(this._container);
      document.body.appendChild(this._backArrow);

      this._keyListener = (e) => {
        if (e.which === ESCAPE_KEY) {
          window.letterpairs.navigateTo('/');
        } else if (e.which === BACKSPACE_KEY) {
          window.letterpairs.navigateTo(route.slice(0, 2));
        } else if (e.which === PLUS_KEY) {
          this._addOption();
        }
      };
      window.addEventListener('keydown', this._keyListener);
    }

    destroy() {
      this._container.remove();
      this._backArrow.remove();
      window.removeEventListener('keydown', this._keyListener);
    }

    _createHeading() {
      this._heading = document.createElement('div');
      this._heading.appendChild(window.letterpairs.letterHeading(this._pair[0]));
      this._heading.appendChild(window.letterpairs.letterHeading(this._pair[1]));
      this._container.appendChild(this._heading);
    }

    _createList() {
      const options = window.letterpairs.data[this._pair.toUpperCase()];
      this._list = document.createElement('div');
      options.forEach((option) => {
        const elem = document.createElement('div');
        elem.className = 'option';

        const elemText = document.createElement('label');
        elemText.textContent = option;
        elem.appendChild(elemText);

        const elemButton = document.createElement('button');
        elemButton.className = 'delete-button';
        elemButton.addEventListener('click', () => {
          this._deleteOption(option);
        });
        elem.appendChild(elemButton);

        this._list.appendChild(elem);
      });
      this._container.appendChild(this._list);
    }

    _createAddButton() {
      const button = document.createElement('button');
      button.className = 'add-button';
      button.addEventListener('click', () => this._addOption());
      this._container.appendChild(button);
    }

    _addOption() {
      const addition = prompt('Enter term for ' + this._pair.toUpperCase());
      if (!addition) {
        return;
      }

      this._applyMutator((data) => {
        const dupPair = pairForTerm(data, addition);
        if (dupPair) {
          const confirmation = confirm('That term is already used in ' +
            dupPair + '. Would you like to replace it?');
          if (!confirmation) {
            return data;
          }
        }
        Object.keys(data).forEach((key) => {
          data[key] = data[key].filter((x) => {
            return x.toLowerCase() !== addition.toLowerCase();
          });
        });
        var list = data[this._pair.toUpperCase()];
        list.splice(0, 0, addition);
        return data;
      });
    }

    _deleteOption(option) {
      this._applyMutator((data) => {
        var list = data[this._pair.toUpperCase()];
        list.splice(list.indexOf(option), 1);
        return data;
      });
    }

    _applyMutator(mutator) {
      window.letterpairs.mutateData(mutator)
        .then(() => {
          window.letterpairs.refresh();
        }).catch((e) => {
          alert('Error updating: ' + e);
        });
    }
  }

  function pairForTerm(data, term) {
    return Object.keys(data).find((key) => {
      return data[key].find((x) => x.toLowerCase() == term.toLowerCase());
    });
  }

  window.letterpairs.List = List;

})();
