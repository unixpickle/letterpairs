(function() {

  window.letterpairs.setData = (data) => {
    const req = new Request('/update', {
      method: 'post',
      body: JSON.stringify(data)
    });
    return fetch(req);
  };

})();
