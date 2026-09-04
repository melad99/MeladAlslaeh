AOS.init({
 	duration: 800,
 	easing: 'ease',
 	once: true,
 	offset: -100
});

jQuery(function($) {

	'use strict';
	loader();
	siteMenuClone();
	mobileToggleClick();
	onePageNavigation();
	owlCarouselPlugin();
	floatingLabel();
	scrollWindow();
	jarallaxPlugin();
	contactForm();

});

var loader = function() {
	setTimeout(function() {
		TweenMax.to('.site-loader-wrap', 1, { marginTop: 50, autoAlpha: 0, ease: Power4.easeInOut });
  }, 10);
  $(".site-loader-wrap").delay(200).fadeOut("slow");
	$("#unslate_co--overlayer").delay(200).fadeOut("slow");	
}

var siteMenuClone = function() {

	setTimeout(function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-inner');
		});
		
		var counter = 0;
    $('.unslate_co--site-mobile-menu .has-children').each(function(){
      var $this = $(this);
      
      $this.prepend('<span class="arrow-collapse collapsed">');

      $this.find('.arrow-collapse').attr({
        'data-toggle' : 'collapse',
        'data-target' : '#collapseItem' + counter,
      });

      $this.find('> ul').attr({
        'class' : 'collapse',
        'id' : 'collapseItem' + counter,
      });

      counter++;

    });

  }, 1000);

	$('body').on('click', '.arrow-collapse', function(e) {
    var $this = $(this);
    if ( $this.closest('li').find('.collapse').hasClass('show') ) {
      $this.removeClass('active');
    } else {
      $this.addClass('active');
    }
    e.preventDefault();  
    
  });

	$(window).resize(function() {
		var $this = $(this),
			w = $this.width();

		if ( w > 768 ) {
			if ( $('body').hasClass('offcanvas') ) {
				$('body').removeClass('offcanvas');
			}
		}
	});

	$('.js-burger-toggle-menu').click(function(e){
		e.preventDefault();
		if ( $('body').hasClass('offcanvas') ) {
  		$('body').removeClass('offcanvas');
  		$('.js-burger-toggle-menu').removeClass('open');
  	} else {
  		$('body').addClass('offcanvas');	
  		$('.js-burger-toggle-menu').addClass('open');
  	}
  });

};

var owlCarouselPlugin = function() {

	$('.testimonial-slider').owlCarousel({
    center: false,
    items: 1,
    loop: true,
    stagePadding: 20,
  	margin: 10,
    smartSpeed: 2000,
    autoplay: true,
    autoplayHoverPause: true,
    dots: true,
    nav: true,
    navText: [
      '<span><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg></span>',
      '<span><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg></span>'
    ],

    responsive:{
        400:{
          stagePadding: 20,
  				margin: 10,
        },
        600:{
          stagePadding: 100,
  				margin: 50,
        }
    }
	});
	owlSingleSlider();

	if ( $('.logo-slider').length ) {

		$('.logo-slider').owlCarousel({
			center: true,
	    loop: true,
	    stagePadding: 0,
	    margin: 40,
	    smartSpeed: 1000,
	    autoplay: true,
	    autoplayTimeout: 2500,
	    autoplayHoverPause: true,
	    dots: false,
	    nav: false,
	    responsive:{
		    0:{
		      items: 1
		    },
		    480:{
		      items: 2
		    },
		    768:{
		    	items: 3
		    }
	    }
	   });
	}

};

var owlSingleSlider = function () {
	if ( $( '.single-slider' ).length ) {
		$('.single-slider').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
	    stagePadding: 0,
	    margin: 0,
	    smartSpeed: 1500,
	    autoplay: true,
	    autoplayHoverPause: true,
	    dots: true,
	    nav: true,
	    navText: [
      '<span><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg></span>',
      '<span><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg></span>'
    ],

	    responsive:{
	      400:{
	        stagePadding: 0,
					margin: 0,
	      },
	      600:{
	        stagePadding: 0,
					margin: 0,
	      }
	    }
		});
	}
}

var floatingLabel = function () {
	$('.form-control').on('input', function() {
	  var $field = $(this).closest('.form-group');
	  if (this.value) {
	    $field.addClass('field--not-empty');
	  } else {
	    $field.removeClass('field--not-empty');
	  }
	});
};



// scroll
var scrollWindow = function() {
	var lastScrollTop = 0;
	var navbar = $('.unslate_co--site-nav');
	var ticking = false;

	function updateNav() {
		var st = $(window).scrollTop();

		if (st > 150) {
			if ( !navbar.hasClass('scrolled') ) {
				navbar.addClass('scrolled');
			}
		}
		if (st < 150) {
			if ( navbar.hasClass('scrolled') ) {
				navbar.removeClass('scrolled sleep');
			}
		}
		if ( st > 350 ) {
			if ( !navbar.hasClass('awake') ) {
				navbar.addClass('awake');
			}

			// hide / show on scroll
			if (st > lastScrollTop){
	      // downscroll code
	      navbar.removeClass('awake');
	      navbar.addClass('sleep');
	   	} else {
	      // upscroll code
	      navbar.addClass('awake');
	   	}
	   	lastScrollTop = st;


		}
		if ( st < 350 ) {
			if ( navbar.hasClass('awake') ) {
				navbar.removeClass('awake');
				navbar.addClass('sleep');
			}
		}

		ticking = false;
	}

	// Coalesce to one class-toggle pass per animation frame instead of
	// running the full set of DOM reads/writes on every native scroll
	// event (mobile browsers can fire these very rapidly during
	// momentum scrolling, which was a contributor to scroll jank).
	$(window).scroll(function() {
		if ( !ticking ) {
			window.requestAnimationFrame(updateNav);
			ticking = true;
		}
	});

};


var mobileToggleClick = function() {
	$('.js-menu-toggle').click(function(e) {

		e.preventDefault();

  	if ( $('body').hasClass('offcanvas') ) {
  		$('body').removeClass('offcanvas');
  		$('.js-menu-toggle').removeClass('active');
  		if ( $('.js-burger-toggle-menu').length ) {
  			$('.js-burger-toggle-menu').removeClass('open');
  		}
  	} else {
  		$('body').addClass('offcanvas');	
  		$('.js-menu-toggle').addClass('active');
  		if ( $('.js-burger-toggle-menu').length ) {
  			$('.js-burger-toggle-menu').addClass('open');
  		}
  	}


  });

  // click outisde offcanvas
	$(document).mouseup(function(e) {
    var container = $(".unslate_co--site-mobile-menu");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ( $('body').hasClass('offcanvas') ) {
				$('body').removeClass('offcanvas');
				$('body').find('.js-menu-toggle').removeClass('active');

				$('body').find('.js-burger-toggle-menu').removeClass('open');
			}
    }
	}); 
};



// navigation
var onePageNavigation = function() {
  var navToggler = $('.site-menu-toggle');
 	$("body").on("click", ".unslate_co--site-nav .site-nav-ul li a[href^='#'], .smoothscroll[href^='#'], .unslate_co--site-mobile-menu .site-nav-wrap li a[href^='#']", function(e) {
    
    e.preventDefault();

    var $body = $('body');
    if ( $body.hasClass('offcanvas')  ) {
    	$body.removeClass('offcanvas');
    	$('body').find('.js-burger-toggle-menu').removeClass('open');
    }

    var hash = this.hash;
    // Offset by the fixed nav's height so the target section's heading
    // doesn't end up scrolled underneath the sticky bar.
    var navOffset = $('.unslate_co--site-nav').outerHeight() || 90;

      $('html, body').animate({
        scrollTop: $(hash).offset().top - navOffset
      }, 1000, 'easeInOutExpo');

  });

};


var jarallaxPlugin = function() {
	$('.jarallax').jarallax({
    speed: 0.2,
    // The parallax effect re-transforms the hero image on every scroll
    // tick, which is what caused the stutter scrolling from the hero
    // into the About section on phones. Serve it as a plain static
    // background on touch devices instead - same image, no per-scroll
    // recalculation.
    disableParallax: /iPad|iPhone|iPod|Android/
	});
};

var contactForm = function() {
	if ($('#contactForm').length > 0 ) {
		$( "#contactForm" ).validate( {
			rules: {
				name: "required",
				email: {
					required: true,
					email: true
				},
				message: {
					required: true,
					minlength: 5
				}
			},
			messages: {
				name: "Please enter your name",
				email: "Please enter a valid email address",
				message: "Please enter a message"
			},
			errorElement: 'span',
			errorLabelContainer: '.form-error',
			/* submit via ajax, to the endpoint set in the form's own action="" (Formspree) */
			submitHandler: function(form) {
				var $submit = $('.submitting'),
					waitText = 'Submitting...';

				$.ajax({
			      type: "POST",
			      url: $(form).attr('action'),
			      data: $(form).serialize(),
			      dataType: 'json',
			      headers: { 'Accept': 'application/json' },

			      beforeSend: function() {
			      	$submit.css('display', 'block').text(waitText);
			      },
			      success: function(response) {
	               if (response && response.ok) {
	               	$('#form-message-warning').hide();
			            setTimeout(function(){
	               		$('#contactForm').fadeOut();
	               	}, 1000);
			            setTimeout(function(){
			               $('#form-message-success').fadeIn();
	               	}, 1400);

		            } else {
		               $('#form-message-warning').html("Something went wrong. Please try again.");
			            $('#form-message-warning').fadeIn();
			            $submit.css('display', 'none');
		            }
			      },
			      error: function() {
			      	$('#form-message-warning').html("Something went wrong. Please try again.");
			         $('#form-message-warning').fadeIn();
			         $submit.css('display', 'none');
			      }
		      });
	  		}
			
		} );
	}
};

