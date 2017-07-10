(function() {

  window.letterpairs.mutateData = (mutator) => {
    const dataCopy = {};
    Object.keys(window.letterpairs.data).forEach((key) => {
      dataCopy[key] = window.letterpairs.data[key].slice();
    });
    const newData = mutator(dataCopy);
    const req = new Request('/update', {
      method: 'post',
      body: JSON.stringify(newData)
    });
    return fetch(req).then(() => window.letterpairs.data = newData);
  };

})();
