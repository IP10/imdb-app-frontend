$(function () {
  // console.log("js");
  var logged_in = getKey("is_logged");
  // console.log(logged_in);
  if (logged_in == false || logged_in == undefined){
    window.open(' index.html', '_top');
  }
  else if (logged_in == true){
    window.open('movies/movies.html', '_top');
  }
  else{
    console.log('root');
  }
  // console.log(window.location.pathname);
  let BASE_URL = 'https://sample-imdb.herokuapp.com/api/';
  function setKey(key, value) {
    localStorage.setItem(key, btoa(value));
  }
  function getKey(key, value) {
    return atob(localStorage.getItem(key));
  }

});

