(function ($) {
	//Contact Page Testimonials
	var cpTestsWithNav = new Swiper('.cpTests-container', {
		navigation: {
		  nextEl: '.cpTest-button.swiper-button-prev',
		  prevEl: '.cpTest-button.swiper-button-next',
		},
		slidesPerView: 1,
		loop: true,
		speed: 1000,
		  autoplay: {
			  delay: 5000,
		  },
	});	
}(jQuery));
