(function() {

  let currentView = null;

  function showRoute(route) {
    document.title = routeTitle(route);
    if (currentView) {
      currentView.destroy();
    }
    if (route.length >= 3) {
      currentView = new window.letterpairs.List(route);
    } else {
      currentView = new window.letterpairs.LetterPicker(route);
    }
  }

  function navigateTo(route) {
    history.pushState({}, routeTitle(route), route);
    showRoute(route);
  }

  function refresh() {
    navigateTo(location.pathname);
  }

  function routeTitle(route) {
    if (route.length < 2) {
      return 'BLD';
    } else {
      return 'BLD - ' + route.slice(1);
    }
  }

  ['load', 'popstate'].forEach((evt) => {
    window.addEventListener('load', () => showRoute(location.pathname));
    window.addEventListener('popstate', () => showRoute(location.pathname));
  });

  window.letterpairs.navigateTo = navigateTo;
  window.letterpairs.refresh = refresh;

})();
