(function() {

  const ESCAPE_KEY = 8;

  class List {
    constructor(route) {
      const pair = route.slice(1);

      this._container = document.createElement('div');
      this._container.className = 'list-container';

      this._createHeading(pair);
      this._createList(pair);
      this._createAddButton(pair);

      document.body.appendChild(this._container);

      this._keyListener = (e) => {
        if (e.which === ESCAPE_KEY) {
          window.letterpairs.navigateTo('/');
        }
      };
      window.addEventListener('keypress', this._keyListener);
    }

    destroy() {
      this._container.remove();
      window.removeEventListener('keypress', this._keyListener);
    }

    _createHeading(pair) {
      this._heading = document.createElement('div');
      this._heading.appendChild(window.letterpairs.letterHeading(pair[0]));
      this._heading.appendChild(window.letterpairs.letterHeading(pair[1]));
      this._container.appendChild(this._heading);
    }

    _createList(pair) {
      const options = window.letterpairs.data[pair.toUpperCase()];
      this._list = document.createElement('div');
      options.forEach((option) => {
        const elem = document.createElement('div');
        elem.className = 'option';
        elem.textContent = option;
        this._list.appendChild(elem);
      });
      this._container.appendChild(this._list);
    }

    _createAddButton(pair) {
      const button = document.createElement('button');
      button.className = 'add-button';
      button.addEventListener('click', () => {
        const addition = prompt('Enter puzzle name');
        if (!addition) {
          return;
        }

        let data = window.letterpairs.data;
        const dupPair = Object.keys(data).find((key) => {
          return data[key].find((x) => x.toLowerCase() == addition.toLowerCase());
        });
        if (dupPair) {
          alert('That term is already used in ' + dupPair);
          return
        }

        // TODO: make a copy of the data to better handle
        // addition failures.

        var list = window.letterpairs.data[pair.toUpperCase()];
        list.splice(0, 0, addition);

        window.letterpairs.setData(window.letterpairs.data)
          .then(() => {
            window.letterpairs.refresh();
          }).catch((e) => {
            alert('Error adding entry: ' + e);
          })
      });
      this._container.appendChild(button);
    }
  }

  window.letterpairs.List = List;

})();
