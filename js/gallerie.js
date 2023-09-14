//---------- Gestion de lma gallerie -----------//
//Maxdarkt
/*---------- Partie 1 ----------*/
/**
 * Ici on souahite ajouter du texte par dessus une galerie d'image 
 * qui est créé dynamiquement. Il faut donc repérer la taille et la 
 * position des images afin de se superposés par-dessus.
 */
// On cache les div textes
var hideAllSlides = () => {
    $("#texte-gallerie_1").hide()
    $("#texte-gallerie_2").hide()
    $("#texte-gallerie_3").hide()
    $("#texte-gallerie_4").hide()
}
hideAllSlides()

 function getWidthAndHeightOfScreen(){
    let screenWidth = window.innerWidth - 15
    let screenHeight = window.innerHeight - 15
    return {
        screenWidth,
        screenHeight
    }
}
async function reportWindowSize() {
    const screen = await getWidthAndHeightOfScreen()
    checkMobileOrDesktop(screen.screenWidth, screen.screenHeight)
}

window.onresize = reportWindowSize()

function checkMobileOrDesktop(screenWidth, screenHeight){
    var isMobile = false
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      isMobile = true
    }
    if(screenWidth <= 768 || isMobile){
        $('#box-picture_1').attr('href', 'img/gallery-1_filtre_M.png')
        $('#box-picture_2').attr('href', 'img/gallery-2_filtre_M.png')
        $('#box-picture_3').attr('href', 'img/gallery-3_filtre_M.png')
        $('#box-picture_4').attr('href', 'img/gallery-4_filtre_M.png')
    }
    else {
        checkWidthAndHeightOfScreen(screenWidth, screenHeight)
        //Afficher du texte sur les images dans la gallerie
        //var
        var imageCurrent = 0
        var removeScroll = false

        //Fonction afficher les slides -> Au click des vignettes = ouvertures gallerie
        var displayOneSlide = (item) => {
            $("#texte-gallerie_" + item).fadeIn(200)
        }

        //Fonction afficher et cacher une slide -> Slide de gauche à droite dans la gallerie
        var displayOneSlideAndHideOther = (display, hide) => {
            $("#texte-gallerie_" + hide).fadeOut(0)
            $("#texte-gallerie_" + display).fadeIn(200)
        }

        //Function slide to right
        var slideToRight = () => {
            switch (imageCurrent) {
                case 1:
                    imageCurrent++
                    displayOneSlideAndHideOther(2, 1)
                    break
                case 2:
                    imageCurrent++
                    displayOneSlideAndHideOther(3, 2)
                    break
                case 3:
                    imageCurrent++
                    displayOneSlideAndHideOther(4, 3)
                    break
                case 4:
                    imageCurrent = 1
                    displayOneSlideAndHideOther(1, 4)
                    break
                default:
                    console.log("error")
            }
        }

        //Function slide to left
        var slideToLeft = () => {
            switch (imageCurrent) {
                case 1:
                    imageCurrent = 4
                    displayOneSlideAndHideOther(4, 1)
                    break
                case 2:
                    imageCurrent--
                    displayOneSlideAndHideOther(1, 2)
                    break
                case 3:
                    imageCurrent--
                    displayOneSlideAndHideOther(2, 3)
                    break
                case 4:
                    imageCurrent--
                    displayOneSlideAndHideOther(3, 4)
                    break
                default:
                    console.log("error")
            }
        }

        //On récupère la dimension de l'image pour redimensionner la div texte
        var dimensionDivText = (item) => {
            setTimeout(function () {
                $picture = $(".pswp__img:visible")
                $pictureWidth = $picture[0].clientWidth
                $pictureHeight = $picture[0].clientHeight
                $top = $picture[0].getBoundingClientRect().y
                $top = Math.abs($top)

                $(".text-gallery").css({
                    top: $top,
                    width: $pictureWidth,
                    height: $pictureHeight,
                })
                displayOneSlide(item)
            }, 500)
        }

        // On affiche la div texte de l'image
        for (let i = 1; i < 5; i++) {
            $("#gallerie-image_" + i).on("click", function () {
                imageCurrent = i //On définit l'item de l'image
                dimensionDivText(i) // Défini la position + dimension de l'image pour caler la div texte par dessus
                removeScroll = true
                window.onscroll = function () {
                    if (document.documentElement.scrollTop > 50 && removeScroll) {
                        hideAllSlides()
                        removeScroll = false
                    }
                }
            })
        }
        //* Desktop
        $("#button-arrow-left").on("click", function () {
            slideToLeft()
        })

        $("html").keydown(function (event) {
            if(event.which == 38 || event.which == 40){
                return
            } else if (event.which == 37) { 
                // A gauche
                slideToLeft()
            } else if (event.which == 39) {
                //a Droite
                slideToRight()
            } else if(event.which == 27){
                hideAllSlides()
            }
        })

        $("#button-arrow-right").on("click", function () {
            slideToRight()
        })

        //Fermeture
        $("#button-gallery-close").on("click", function () {
            hideAllSlides()
        })
    }
}

/*---------- Partie 2 ----------*/
/**
 * Gestion du texte affiché ou caché suivant le format d'écrans
 */

/**
 * 1 Repérer la taille de l'écran
 * 2 si 'desktop' => tout afficher sauf bloc resume (n°1)
 * 3 si 'tablette' => cacher tous les 'desktop'
*/

function checkWidthAndHeightOfScreen(screenWidth, screenHeight){
    //Les breakpints sont pris sur le fichier _mixins.scss
    if(screenWidth <= 480) { //Ecran : 0 -> 480
        $('.desktop').hide()
        $('.tablet').hide()
        $('.only-phone').show()
        $('#texte-gallerie_4 .bloc-resume').hide()
    }
    else if(screenWidth <= 768) { //Ecran : 481 -> 768
        $('.desktop').hide()
        $('.tablet').hide()
        $('.only-phone').show()
        $('#texte-gallerie_4 .bloc-resume').hide()
    }
    else if(screenWidth <= 1024) { //Ecran : 769 -> 1024
        $('.desktop').hide()
        $('#texte-gallerie_4 .bloc-resume').hide()
    }
    else if((screenWidth <= 1280 && screenHeight <= 800) || (screenWidth <= 1600 && screenHeight <= 800) || (screenWidth > 1600 && screenHeight <= 800)) { //Ecran : 1281 -> 1600 avec une hauteur <= 800 OU > 1600 avec une hauteur < 800
        $('#texte-gallerie_2 .bloc-resume').hide()
        $('#texte-gallerie_4 .bloc-resume').hide()
    }
    else if((screenWidth <= 1280 && screenHeight > 800) || (screenWidth <= 1600 && screenHeight > 800)) { //Ecran : 1281 -> 1600 avec une hauteur > 800
        $('#texte-gallerie_2 .bloc-resume').hide()
    }
    else { //Ecran : > 1600 
        $('#texte-gallerie_2 .bloc-resume').hide()
    }
}


