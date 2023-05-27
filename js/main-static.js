/*
 * MAGIC - Universal Coming Soon Template
 * Build Date: March 2016
 * Last Update: March 2016
 * Author: Madeon08
 * Copyright (C) 2016 Madeon08
 * This is a premium product available exclusively here : http://themeforest.net/user/Madeon08/portfolio
 */

/*  TABLE OF CONTENTS
    ---------------------------
    1. Loading / Opening
       1.1 Slideshow Init
    2. Firefly effect
    3. Scroll Reveal
    4. Action Buttons / Anchors
    5. Parallax header
    6. Newsletter
    7. PhotoSwipe Gallery Init
    8. Map, Structure & Design
*/

/* ------------------------------------- */
/* 1. Loading / Opening ................ */
/* ------------------------------------- */

$(window).on("beforeunload", function () {
    $(window).scrollTop(0 - 100)
})

$(window).load(function () {
    "use strict"

    setTimeout(function () {
        $(".loading-balls").removeClass("fadeIn").addClass("fadeOut")

        /* ------------------------------------- */
        /* 1.1 Slideshow Init .................. */
        /* ------------------------------------- */

        var wallopEl = document.querySelector(".Wallop")
        var slider = new Wallop(wallopEl)
    }, 3000)

    setTimeout(function () {
        $("#loading").fadeOut(1800)
        $("body").css("overflow", "auto")
    }, 3100)
})

$(document).ready(function () {
    "use strict"

    setTimeout(function () {
        $(".loading-balls").removeClass("opacity-0").addClass("fadeIn")
    }, 200)

    /* ------------------------------------- */
    /* 2. Firefly effect ................... */
    /* ------------------------------------- */

    var onMobile = false

    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    ) {
        onMobile = true
    }
    if (onMobile === false) {
        $.firefly({
            color: "#777777",
            minPixel: 1,
            maxPixel: 2,
            total: 65,
            on: "#firefly-anim",
        })
    } else {
    }

    /* ------------------------------------- */
    /* 3. Scroll Reveal .................... */
    /* ------------------------------------- */

    window.sr = ScrollReveal({ reset: false, mobile: false })
    sr.reveal(".fooReveal", { translate: { y: 100 } })

    /* ------------------------------------- */
    /* 4. Action Buttons / Anchors ......... */
    /* ------------------------------------- */

    var $root = $("html, body")
    $("a").click(function () {
        $root.animate(
            {
                scrollTop: $($.attr(this, "href")).offset().top,
            },
            700,
            "easeInOutCubic"
        )
        return false
    })

    /* ------------------------------------- */
    /* 5. Parallax header .................. */
    /* ------------------------------------- */

    if (onMobile === false) {
        $(window).scroll(function () {
            var scroll = $(window).scrollTop(),
                fastScroll = -scroll / 5

            $("#home-text").css({
                transform:
                    "translate3d( 0, " +
                    fastScroll +
                    "px, 0) scale3d( 1, 1, 1 )",
            })
        })
    } else {
    }

    /* ------------------------------------- */
    /* 6. Newsletter ....................... */
    /* ------------------------------------- */

    $("#notifyMe").notifyMe()
    ;(function () {
        var dlgtrigger = document.querySelector("[data-dialog]"),
            somedialog = document.getElementById(
                dlgtrigger.getAttribute("data-dialog")
            ),
            dlg = new DialogFx(somedialog)

        dlgtrigger.addEventListener("click", dlg.toggle.bind(dlg))
    })()

    /* ------------------------------------- */
    /* 7. PhotoSwipe Gallery Init .......... */
    /* ------------------------------------- */

    var initPhotoSwipeFromDOM = function (gallerySelector) {
        // parse slide data (url, title, size ...) from DOM elements
        // (children of gallerySelector)
        var parseThumbnailElements = function (el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                linkEl,
                size,
                item

            for (var i = 0; i < numNodes; i++) {
                figureEl = thumbElements[i] // <figure> element

                // include only element nodes
                if (figureEl.nodeType !== 1) {
                    continue
                }

                linkEl = figureEl.children[0] // <a> element

                size = linkEl.getAttribute("data-size").split("x")

                // create slide object
                item = {
                    src: linkEl.getAttribute("href"),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10),
                }

                if (figureEl.children.length > 1) {
                    // <figcaption> content
                    item.title = figureEl.children[1].innerHTML
                }

                if (linkEl.children.length > 0) {
                    // <img> thumbnail element, retrieving thumbnail url
                    item.msrc = linkEl.children[0].getAttribute("src")
                }

                item.el = figureEl // save link to element for getThumbBoundsFn
                items.push(item)
            }

            return items
        }

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && (fn(el) ? el : closest(el.parentNode, fn))
        }

        // triggers when user clicks on thumbnail
        var onThumbnailsClick = function (e) {
            e = e || window.event
            e.preventDefault ? e.preventDefault() : (e.returnValue = false)

            var eTarget = e.target || e.srcElement

            // find root element of slide
            var clickedListItem = closest(eTarget, function (el) {
                return el.tagName && el.tagName.toUpperCase() === "FIGURE"
            })

            if (!clickedListItem) {
                return
            }

            // find index of clicked item by looping through all child nodes
            // alternatively, you may define index via data- attribute
            var clickedGallery = clickedListItem.parentNode,
                childNodes = clickedListItem.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index

            for (var i = 0; i < numChildNodes; i++) {
                if (childNodes[i].nodeType !== 1) {
                    continue
                }

                if (childNodes[i] === clickedListItem) {
                    index = nodeIndex
                    break
                }
                nodeIndex++
            }

            if (index >= 0) {
                // open PhotoSwipe if valid index found
                openPhotoSwipe(index, clickedGallery)
            }
            return false
        }

        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function () {
            var hash = window.location.hash.substring(1),
                params = {}

            if (hash.length < 5) {
                return params
            }

            var vars = hash.split("&")
            for (var i = 0; i < vars.length; i++) {
                if (!vars[i]) {
                    continue
                }
                var pair = vars[i].split("=")
                if (pair.length < 2) {
                    continue
                }
                params[pair[0]] = pair[1]
            }

            if (params.gid) {
                params.gid = parseInt(params.gid, 10)
            }

            return params
        }

        var openPhotoSwipe = function (
            index,
            galleryElement,
            disableAnimation,
            fromURL
        ) {
            var pswpElement = document.querySelectorAll(".pswp")[0],
                gallery,
                options,
                items

            items = parseThumbnailElements(galleryElement)

            // define options (if needed)
            options = {
                // define gallery index (for URL)
                galleryUID: galleryElement.getAttribute("data-pswp-uid"),

                getThumbBoundsFn: function (index) {
                    // See Options -> getThumbBoundsFn section of documentation for more info
                    var thumbnail =
                            items[index].el.getElementsByTagName("img")[0], // find thumbnail
                        pageYScroll =
                            window.pageYOffset ||
                            document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect()

                    return {
                        x: rect.left,
                        y: rect.top + pageYScroll,
                        w: rect.width,
                    }
                },
            }

            // PhotoSwipe opened from URL
            if (fromURL) {
                if (options.galleryPIDs) {
                    // parse real index when custom PIDs are used
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for (var j = 0; j < items.length; j++) {
                        if (items[j].pid === index) {
                            options.index = j
                            break
                        }
                    }
                } else {
                    // in URL indexes start from 1
                    options.index = parseInt(index, 10) - 1
                }
            } else {
                options.index = parseInt(index, 10)
            }

            // exit if index not found
            if (isNaN(options.index)) {
                return
            }

            if (disableAnimation) {
                options.showAnimationDuration = 0
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe(
                pswpElement,
                PhotoSwipeUI_Default,
                items,
                options
            )
            gallery.init()
        }

        // loop through all gallery elements and bind events
        var galleryElements = document.querySelectorAll(gallerySelector)

        for (var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute("data-pswp-uid", i + 1)
            galleryElements[i].onclick = onThumbnailsClick
        }

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash()
        if (hashData.pid && hashData.gid) {
            openPhotoSwipe(
                hashData.pid,
                galleryElements[hashData.gid - 1],
                true,
                true
            )
        }
    }

    // execute above function
    initPhotoSwipeFromDOM(".my-gallery")

    /* ------------------------------------- */
    /* 8. Map, Structure & Design .......... */
    /* ------------------------------------- */

    // When the window has finished loading create our google map below
    google.maps.event.addDomListener(window, "load", init)
    google.maps.event.addDomListener(window, "resize", init)

    function init() {
        // Basic options for a simple Google Map
        // The latitude and longitude to center the map (always required)
        var center = new google.maps.LatLng(46.19781, 6.14228)
        // If document (your website) is wider than 768px (tablet size), isDraggable = true, else isDraggable = false
        var isDraggable = $(document).width() > 768 ? true : false

        // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
        var mapOptions = {
            // How zoomed in you want the map to start at (always required)
            zoom: 13,
            scrollwheel: false,
            draggable: isDraggable,
            center: center,
            streetViewControl: true,
            mapTypeControl: true,

            // How you would like to style the map.
            // This is where you would paste any style found on Snazzy Maps.
            styles: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#6195a0"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "lightness": "0"
                        },
                        {
                            "saturation": "0"
                        },
                        {
                            "color": "#f5f5f2"
                        },
                        {
                            "gamma": "1"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "all",
                    "stylers": [
                        {
                            "lightness": "-3"
                        },
                        {
                            "gamma": "1.00"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural.terrain",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#bae5ce"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 45
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#fac9a9"
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "color": "#4e4e4e"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#787878"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.airport",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "hue": "#0a00ff"
                        },
                        {
                            "saturation": "-77"
                        },
                        {
                            "gamma": "0.57"
                        },
                        {
                            "lightness": "0"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.rail",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#43321e"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.rail",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "hue": "#ff6c00"
                        },
                        {
                            "lightness": "4"
                        },
                        {
                            "gamma": "0.75"
                        },
                        {
                            "saturation": "-68"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#eaf6f8"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#c7eced"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "lightness": "-49"
                        },
                        {
                            "saturation": "-53"
                        },
                        {
                            "gamma": "0.79"
                        }
                    ]
                },
            ],
        }

        var map = new google.maps.Map(
            document.getElementById("map"),
            mapOptions,
            center
        )

        var locations = [
            [
                `<h6>Sarah Imbert-Bétemps - CHROMOPUNCTURE</h6>
                <p>Centre Paramédical Genevois</p>
                <p>Av. Henri-Dunant 2 - 1er étage<br/>
                CH 1205 Genève</p>
                <p>Thérapeute Diplômée en Médecine Esogétics de
                l’Institut International Peter Mandel</p>`,
                46.19780,
                6.14230,
                1,
            ],
        ]

        var infowindow = new google.maps.InfoWindow()

        var marker, i

        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(
                    locations[i][1],
                    locations[i][2]
                ),
                map: map,
            })

            google.maps.event.addListener(
                marker,
                "click",
                (function (marker, i) {
                    return function () {
                        infowindow.setContent(locations[i][0])
                        infowindow.open(map, marker)
                    }
                })(marker, i)
            )
        }

        google.maps.event.addListener(marker, "click", function () {
            infowindow.open(map, marker)
        })
    }
})
