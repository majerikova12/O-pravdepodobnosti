  var pomp = false;
  function je_prihlaseny(){
    $.ajax({
      method: "POST",
      url: "je_prihlaseny.php"
    })
      .done(function(msg) {
        if (msg){
          var result = JSON.parse(msg);
          pomp = true;
          document.getElementById("google_profil").style.display = "inline";
          document.getElementById("google_profil").innerHTML = "Ste prihlásený ako <br><strong>"+result.meno+" "+result.priezvisko+"</strong>";
          clearInterval(timer);
          timer=setInterval(je_odhlaseny,3000);
        }
      });
  }
  function je_odhlaseny(){
    $.ajax({
      method: "POST",
      url: "je_odhlaseny.php"
    })
      .done(function(msg) {
        if (msg){
          clearInterval(timer);
          pomp = false;
          document.getElementById("google_profil").style.display = "none";
          timer=setInterval(je_prihlaseny,3000);
        }
      });
  }
  var timer = setInterval(je_prihlaseny,3000);
  function onSignIn(googleUser) {
    if (pomp){  
      $.ajax({
        method: "POST",
        url: "odhlasenie.php"
      })
        .done(function() {
          googleUser.disconnect();
          pomp = false;
          document.getElementById("google_profil").style.display = "none";
          clearInterval(timer);
          timer=setInterval(je_prihlaseny,3000);
        });
    } else{
      $.ajax({
        method: "POST",
        url: "prihlasenie.php",
        data: {id_token: googleUser.getAuthResponse().id_token}
      })
        .done(function(msg) {
          console.log(msg);
          var profile = googleUser.getBasicProfile();
          pomp = true;
          document.getElementById("google_profil").style.display = "inline";
          document.getElementById("google_profil").innerHTML = "Ste prihlásený ako <br><strong>"+profile.getName()+"</strong>";
          clearInterval(timer);
          timer=setInterval(je_odhlaseny,3000);
        });
    }
  };