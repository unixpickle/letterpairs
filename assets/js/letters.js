(function() {

  function letterColor(letter) {
    const rowColors = [
      '#fff',
      '#ffc000',
      '#6add50',
      '#eb5664',
      '#2158e4',
      '#dce320',
    ];
    let idx = window.letterpairs.letters.indexOf(letter);
    if (idx < 0) {
      idx = 0;
    }
    return rowColors[Math.floor(idx / 4)];
  }

  function letterHeading(letter) {
    const span = document.createElement('span');
    span.className = 'letter-heading';
    span.style.color = letterColor(letter);
    span.textContent = letter.toUpperCase();
    return span;
  }

  window.letterpairs.letters = 'abcdefghijklmnopqrstuvwx';
  window.letterpairs.letterColor = letterColor;
  window.letterpairs.letterHeading = letterHeading;

})();
