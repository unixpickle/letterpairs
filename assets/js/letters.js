(function() {

  function letterColor(letter) {
    const rowColors = [
      '#fff',
      'rgb(255, 143, 44)',
      'rgb(106, 221, 80)',
      'rgb(243, 85, 99)',
      'rgb(25, 163, 242)',
      'rgb(220, 227, 32)',
    ];
    let idx = window.letterpairs.letters.indexOf(letter);
    if (idx < 0) {
      idx = 0;
    }
    return rowColors[Math.floor(idx / 4)];
  }

  function letterHeading(letter) {
    const heading = document.createElement('a');
    heading.className = 'letter-heading';
    heading.style.color = letterColor(letter);
    heading.textContent = letter.toUpperCase();
    heading.href = '/' + letter;
    return heading;
  }

  window.letterpairs.letters = 'abcdefghijklmnopqrstuvwx';
  window.letterpairs.letterColor = letterColor;
  window.letterpairs.letterHeading = letterHeading;

})();
