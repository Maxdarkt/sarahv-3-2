// Fonction génrale - Interval + pause
$(document).ready(function () {
    //On cache toutes les autres div
    const initSlide = (slide = 1) => {
      $(".mini-slide_1").hide()
      $("#dots-1 > span").removeClass("dots-active")
      $(".mini-slide_2").hide()
      $("#dots-2 > span").removeClass("dots-active")
      $(".mini-slide_3").hide()
      $("#dots-3 > span").removeClass("dots-active")
      $(".mini-slide_4").hide()
      $("#dots-4 > span").removeClass("dots-active")
      $(".mini-slide_5").hide()
      $("#dots-5 > span").removeClass("dots-active")
      $(".mini-slide_" + slide).show()
      $("#dots-" + slide + " > span").addClass("dots-active")
    }

    var isMobile = false
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      isMobile = true
    }
    var isPaused = false
    if(!isMobile){
      //Mise en pause du slide
      $(".mini-slide").on("mouseenter", () => {
          isPaused = true
      })
      $(".mini-slide").on("mouseleave", () => {
          isPaused = false
      })
    } else {
      $(".mini-slide").on("click", () => {
        if(isPaused){
          isPaused = false
        } else {
          isPaused = true
        }
      })
    }

    // we init slide to 1
    var slide = 1

    const timer = () => {
      if (!isPaused) {
        if (slide == 1) {
            $(".mini-slide_1").fadeOut(0)
            $("#dots-1 > span").removeClass("dots-active")
            $(".mini-slide_2").fadeIn(500)
            $("#dots-2 > span").addClass("dots-active")
            slide++
        } else if (slide == 2) {
            $(".mini-slide_2").fadeOut(0)
            $("#dots-2 > span").removeClass("dots-active")
            $(".mini-slide_3").fadeIn(500)
            $("#dots-3 > span").addClass("dots-active")
            slide++
        } else if (slide == 3) {
            $(".mini-slide_3").fadeOut(0)
            $("#dots-3 > span").removeClass("dots-active")
            $(".mini-slide_4").fadeIn(500)
            $("#dots-4 > span").addClass("dots-active")
            slide++
        } else if (slide == 4) {
            $(".mini-slide_4").fadeOut(0)
            $("#dots-4 > span").removeClass("dots-active")
            $(".mini-slide_5").fadeIn(500)
            $("#dots-5 > span").addClass("dots-active")
            slide++
        } else if (slide == 5) {
          $(".mini-slide_5").fadeOut(0)
          $("#dots-5 > span").removeClass("dots-active")
          $(".mini-slide_1").fadeIn(500)
          $("#dots-1 > span").addClass("dots-active")
          slide = 1
      }
      }
    }
    // on stocke la fonction setInterval
    let interval
    // on déclenche ou arrête l'interval
    const launchTimer = (start = true) => {
      if(start) {
        interval = setInterval(timer, 4000)
      } else {
        clearInterval(interval)
      }
    }
    
    // Algorithme pour délcencher le timer, gérer les actions (prev, net, goTo)
    const miniSlide = (goTo, action) => {
      isPaused = false
      if(goTo) {
        // on stoppe l'interval de temps
        launchTimer(false)
        // on replace la nouelle slide
        initSlide(goTo)
        // on remplace le numéro de la slide par la nouvelle
        slide = goTo
        // on relance le timer
        launchTimer()
      } else if(action === 1 || action === -1) {
        // on stoppe l'interval de temps
        launchTimer(false)
        // on gère les cas particulier 0 et 4
        let goToSlide
        if(slide + action === 5) {
          goToSlide = 1
        } else if( slide + action === 0) {
          goToSlide = 4
        } else {
          goToSlide = slide + action
        }
        // on replace la nouelle slide
        initSlide(goToSlide)
        // on remplace le numéro de la slide par la nouvelle
        slide = goToSlide
        // on relance le timer
        launchTimer()
      } else {
        initSlide()
        launchTimer()
      }
    }

    //Déclenchement du timer
    var removeScrollBis = true
    window.onscroll = function () {
      if (document.documentElement.scrollTop > 130 && removeScrollBis) {
        isPaused = false
        miniSlide()
        removeScrollBis = false
      }
    }

    // EVENT click on button 
    $(".slide-prev").on("click", function() {
      miniSlide(null, -1)
    })
    $(".slide-next").on("click", function() {
      miniSlide(null, 1)
    })
    $("#dots-1").on("click", function() {
      miniSlide(1)
    })
    $("#dots-2").on("click", function() {
      miniSlide(2)
    })
    $("#dots-3").on("click", function() {
      miniSlide(3)
    })
    $("#dots-4").on("click", function() {
      miniSlide(4)
    })
    $("#dots-5").on("click", function() {
      miniSlide(5)
    })
//------------------------------------------------------//
//----------Arret du slide en mode DEV------------------//
//------------------------------------------------------//
// Partie du code à commenter en mode Production ->
  // var dev = 1
  // initSlide()
  // $(".mini-slide").on("click", () => {
  //   dev = dev++ !== 5 ? dev++ : 1
  //   initSlide(dev)
  //   console.log(dev)
  // })
// Partie du code à commenter en mode Production
//----------FIN Arret du slide en mode DEV------------------//
})