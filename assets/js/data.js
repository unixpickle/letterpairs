(function() {

  window.letterpairs.mutateData = (mutator) => {
    return fetch('/params')
      .then((resp) => resp.json())
      .then((oldData) => {
        const newData = mutator(oldData);
        const req = new Request('/update', {
          method: 'post',
          body: JSON.stringify(newData)
        });
        return fetch(req).then(() => window.letterpairs.data = newData);
      });
  };

})();
