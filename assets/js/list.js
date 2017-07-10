(function() {

  class List {
    constructor(route) {
      const pair = route.slice(1);
      const options = window.letterpairs.data[pair.toUpperCase()];

      this._container = document.createElement('div');
      this._container.className = 'list-container';

      this._heading = document.createElement('div');
      this._heading.appendChild(window.letterpairs.letterHeading(pair[0]));
      this._heading.appendChild(window.letterpairs.letterHeading(pair[1]));
      this._container.appendChild(this._heading);

      this._list = document.createElement('div');
      options.forEach((option) => {
        const elem = document.createElement('div');
        elem.className = 'option';
        elem.textContent = option;
        this._list.appendChild(elem);
      });
      this._container.appendChild(this._list);

      document.body.appendChild(this._container);
    }

    destroy() {
      // TODO: this.
      this._container.remove();
    }
  }

  window.letterpairs.List = List;

})();
