(function() {

  window.letterpairs.setData = (data) => {
    const req = new Request('https://api.acme.com/users.json', {
      method: 'post',
      body: JSON.stringify(data)
    });
    return fetch(req);
  };

})();
