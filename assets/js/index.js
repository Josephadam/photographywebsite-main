gsap.config({
	nullTargetWarn: false,
	trialWarn: false,
});

document.addEventListener("DOMContentLoaded", () => {
	initSmoothScroll();
	initLoaderHome();
	initScrollTriggerPlayVideoInview();
	initTimeZone();
	initBasicFunctions();
	initMarqueeScrollV2();
	hoverSection();
	imageHover();
	mansoryGrid();
	imageFadeIn();
	initCheckWindowHeight();
	initLazyLoad();
	navScroll();
});

let scroll;

function initSmoothScroll() {
	let scroll = new LocomotiveScroll({
		el: document.querySelector("[data-scroll-container]"),
		smooth: true,
		lerp: 0.05,
		inertia: 0.8, // Adjust the inertia to see if it improves performance
		resetNativeScroll: true, // Helps reset the scroll position when moving between pages
	});

	scroll.on("scroll", ScrollTrigger.update);

	ScrollTrigger.scrollerProxy("[data-scroll-container]", {
		scrollTop(value) {
			return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
		},
		getBoundingClientRect() {
			return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
		},
		pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed",
	});

	ScrollTrigger.addEventListener("refresh", () => scroll.update());
	ScrollTrigger.refresh();
}

function initCheckWindowHeight() {
	// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty("--vh", `${vh}px`);
}

/**
 * Lazy Load
 */
function initLazyLoad() {
	// https://github.com/locomotivemtl/locomotive-scroll/issues/225
	// https://github.com/verlok/vanilla-lazyload
	var lazyLoadInstance = new LazyLoad({
		container: document.querySelector("[data-scroll-container]"),
		elements_selector: ".lazy",
	});
	console.log("pictures loaded");
}

function initLoaderHome() {
	var tl = gsap.timeline();

	tl.set("html", {
		cursor: "wait",
	});

	tl.set("html", {
		cursor: "auto",
	});

	tl.set(".loading-screen", {
		scaleY: 0,
	});

	tl.set(".loader-images figure", {
		display: "none",
	});

	tl.set(".loader-images figure:nth-child(1)", {
		display: "block",
	});

	tl.set(".swipe-cover", {
		scaleY: 1,
		rotate: 0.001,
		opacity: 1,
	});

	if (document.querySelector(".loader-overlay")) {
		tl.set(".loader-overlay", {
			autoAlpha: 1,
		});
	}

	tl.to(".swipe-cover", {
		duration: 1.25,
		ease: "Expo.easeInOut",
		stagger: 0.1,
		scaleY: 0,
		rotate: 0.001,
	});

	tl.to(
		".loader-images figure:nth-child(2)",
		{
			duration: 0.001,
			display: "block",
		},
		"< 1.25"
	);

	tl.to(
		".loader-images figure:nth-child(3)",
		{
			duration: 0.001,
			display: "block",
		},
		"< 0.5"
	);

	tl.to(
		".loader-images figure:nth-child(4)",
		{
			duration: 0.001,
			display: "block",
		},
		"< 0.5"
	);

	tl.to(
		".loader-images figure:nth-child(5)",
		{
			duration: 0.001,
			display: "block",
		},
		"< 0.5"
	);

	tl.from(
		" .once-in",
		{
			duration: 1.6,
			yPercent: 210,
			delay: 0.4,
			ease: "Expo.easeOut",
		},
		"<0.1"
	);

	tl.from(
		" .once-in-2",
		{
			duration: 1.7,
			yPercent: 210,
			delay: 0.4,
			ease: "Expo.easeOut",
		},
		"<0.1"
	);

	tl.from(
		" .once-in-3",
		{
			duration: 1.6,
			yPercent: 210,
			delay: 0.4,
			ease: "Expo.easeOut",
		},
		"<0.1"
	);

	tl.call(
		function () {
			pageTransitionOutAnimation();
		},
		null,
		3.5
	);
}

// Animation - Page Enter
function pageTransitionOutAnimation() {
	var tl = gsap.timeline();

	if (document.querySelector(".loader-overlay")) {
		tl.set(".loader-overlay", {
			autoAlpha: 0,
			duration: 2.35,
			ease: "Expo.easeInOut",
			stagger: 0.1,
		});
	}

	tl.set(".loading-screen", {
		scaleY: 0,
	});

	if (document.querySelector(" .swipe-cover")) {
		tl.to(
			" .swipe-cover",
			{
				duration: 1.25,
				ease: "draw",
				stagger: 0.1,
				scaleY: 0,
				rotate: 0.001,
				clearProps: "all",
			},
			"<"
		);
	}
}

/**
 * Play Video Inview
 */
function initScrollTriggerPlayVideoInview() {
	let allVideoDivs = gsap.utils.toArray(".playpauze");

	allVideoDivs.forEach((videoDiv, i) => {
		let videoElem = videoDiv.querySelector("video");

		ScrollTrigger.create({
			scroller: document.querySelector("[data-scroll-container]"),
			start: "0% 120%",
			end: "100% -20%",
			trigger: videoElem,
			onEnter: () => videoElem.play(),
			onEnterBack: () => videoElem.play(),
			onLeave: () => videoElem.pause(),
			onLeaveBack: () => videoElem.pause(),
		});
	});
}

function initTimeZone() {
	// Time zone
	// https://stackoverflow.com/questions/39418405/making-a-live-clock-in-javascript/67149791#67149791
	// https://stackoverflow.com/questions/8207655/get-time-of-specific-timezone
	// https://stackoverflow.com/questions/63572780/how-to-update-intl-datetimeformat-with-new-date

	var timeSpanHeader = document.querySelector("#timeTeller");
	var timeSpanFooter = document.querySelector("#timeSpanFooter");

	const optionsTime = {
		timeZone: "America/Los_Angeles",
		timeZoneName: "short",
		// year: 'numeric',
		// month: 'numeric',
		// day: 'numeric',
		hour: "2-digit",
		hour24: "true",
		minute: "numeric",
		second: "numeric",
	};

	const formatter = new Intl.DateTimeFormat([], optionsTime);
	updateTime();
	setInterval(updateTime, 1000);

	function updateTime() {
		const dateTime = new Date();
		const formattedDateTime = formatter.format(dateTime);
		if (timeSpanHeader) {
			timeSpanHeader.textContent = formattedDateTime;
		}
		if (timeSpanFooter) {
			timeSpanFooter.textContent = formattedDateTime;
		}
	}
}

/* Animation - First Page Load
function initLoader() {
	var tl = gsap.timeline();

	tl.from(
		" .once-in",
		{
			duration: 1.3,
			yPercent: 210,
			delay: 0.5,
			ease: "Expo.easeOut",
		},
		"<0.1"
	);

	if (document.querySelector("header .stripe")) {
		tl.from(
			"header .stripe",
			{
				duration: 1.3,
				scaleX: 0,
				ease: "Expo.easeOut",
				transformOrigin: "left top",
			},
			"<"
		);
	}
} */

function initBasicFunctions() {
	var scroll = {
		stop: function () {
			// Disable scroll by setting 'overflow' to 'hidden' on the body
			$("body").css("overflow", "hidden");
		},
		start: function () {
			// Enable scroll by resetting 'overflow' on the body
			$("body").css("overflow", "");
		},
	};

	$(".nav-btn").click(function () {
		if ($(".nav-mobile").hasClass("active")) {
			$(".nav-mobile").removeClass("active");
			scroll.start();
		} else {
			$(".nav-mobile").addClass("active");
			scroll.stop();
		}
		$(this).toggleClass("nav-active");
	});

	$(document).keydown(function (e) {
		if (e.keyCode == 27) {
			// Check for the Escape key
			if ($(".nav-mobile").hasClass("active")) {
				$(".nav-mobile, .nav-wrapper").removeClass("active");
				$(".nav-wrapper").removeClass("active"); // Reset the hamburger bars
				scroll.start();
			}
		}
	});
}

function navScroll() {
	ScrollTrigger.create({
		scroller: "[data-scroll-container]",
		start: "top -30%",
		onUpdate: (self) => {
			$(".nav-wrapper").addClass("scrolled");
		},
		onLeaveBack: () => {
			$(".nav-wrapper").removeClass("scrolled");
		},
	});
}

/**
 * Marquee on Scroll Direction
 */
function initMarqueeScrollV2() {
	$("[data-marquee-target]").each(function () {
		let marquee = $(this);

		let marqueeItemsWidth = marquee.find(".marquee-content").width();
		let marqueeSpeed = marquee.attr("data-marquee-speed") * (marqueeItemsWidth / $(window).width());

		// Speed up Marquee on Tablet & Mobile
		if ($(window).width() <= 540) {
			marqueeSpeed = marqueeSpeed * 0.33;
		} else if ($(window).width() <= 1024) {
			marqueeSpeed = marqueeSpeed * 0.66;
		}

		let marqueeDirection = 1;
		let marqueeContent = gsap
			.to(marquee.find(".marquee-content"), {
				xPercent: -100,
				repeat: -1,
				duration: marqueeSpeed,
				ease: "linear",
				paused: true,
			})
			.totalProgress(0.5);

		gsap.set(marquee.find(".marquee-content"), {
			xPercent: 50,
		});

		ScrollTrigger.create({
			scroller: "[data-scroll-container]", // Use Locomotive Scroll's container
			scrub: true,
			trigger: marquee,
			start: "top bottom",
			end: "bottom top",
			onUpdate(self) {
				if (self.direction !== marqueeDirection) {
					marqueeDirection *= -1;
					if (marquee.attr("data-marquee-direction") == "right") {
						gsap.to([marqueeContent], {
							timeScale: marqueeDirection * -1,
							overwrite: true,
						});
					} else {
						gsap.to([marqueeContent], {
							timeScale: marqueeDirection,
							overwrite: true,
						});
					}
				}
				self.direction === -1 ? marquee.attr("data-marquee-status", "normal") : marquee.attr("data-marquee-status", "inverted");
			},
			onEnter: () => marqueeContent.play(),
			onEnterBack: () => marqueeContent.play(),
			onLeave: () => marqueeContent.pause(),
			onLeaveBack: () => marqueeContent.pause(),
		});

		// Extra speed on scroll
		marquee.each(function () {
			let triggerElement = $(this);
			let targetElement = $(this).find(".marquee-scroll");
			let marqueeScrollSpeed = $(this).attr("data-marquee-scroll-speed");

			let tl = gsap.timeline({
				scrollTrigger: {
					trigger: $(this),
					start: "0% 100%",
					end: "100% 0%",
					scrub: 0,
				},
			});

			if (triggerElement.attr("data-marquee-direction") == "left") {
				tl.fromTo(
					targetElement,
					{
						x: marqueeScrollSpeed + "vw",
					},
					{
						x: marqueeScrollSpeed * -1 + "vw",
						ease: "none",
					}
				);
			}

			if (triggerElement.attr("data-marquee-direction") == "right") {
				tl.fromTo(
					targetElement,
					{
						x: marqueeScrollSpeed * -1 + "vw",
					},
					{
						x: marqueeScrollSpeed + "vw",
						ease: "none",
					}
				);
			}
		});
	});
}

function hoverSection() {
	$(document).ready(function () {
		$(".ignite-desktop").on("mouseenter mouseleave", function () {
			$(".section-animation").toggleClass("active");
		});

		$(".ignite-mobile").click(function () {
			$(".section-animation").toggleClass("active");
		});
	});
}

function imageHover() {
	$("[data-cyclecards-init]").each(function () {
		var cycleCards = $(this);
		var cycleCardsIndex = 2;
		let dataCycleCardIDPrev = cycleCards.find('[data-cyclecard-image][data-cyclecard-status="active"]').attr("data-cyclecard-id");

		cycleCards.find('[data-cyclecard-image][data-cyclecard-status="active"]').css("z-index", cycleCardsIndex);
		gsap.set(cycleCards.find('[data-cyclecard-hover][data-cyclecards-status="not-active"]'), {
			xPercent: -100,
			scale: 1,
			rotate: 0.001,
		});

		cycleCards.find("[data-cyclecard-hover]").on("mouseenter click", function () {
			let dataCycleCardID = $(this).attr("data-cyclecard-id");
			if (cycleCards.find('[data-cyclecard-hover][data-cyclecard-id="' + dataCycleCardID + '"]').attr("data-cyclecard-status") != "active") {
				cycleCardsIndex = cycleCardsIndex + 1;

				cycleCards
					.find('[data-cyclecard-id="' + dataCycleCardID + '"]')
					.attr("data-cyclecard-status", "active")
					.siblings()
					.attr("data-cyclecard-status", "not-active");
				cycleCards.find('[data-cyclecard-image][data-cyclecard-id="' + dataCycleCardID + '"]').css("z-index", cycleCardsIndex);

				gsap.fromTo(
					cycleCards.find('[data-cyclecard-image][data-cyclecard-id="' + dataCycleCardID + '"]'),
					{
						xPercent: 100,
						scale: 1,
						rotate: 0.001,
						transformOrigin: "right top",
					},
					{
						xPercent: 0,
						scale: 1,
						rotate: 0.001,
						duration: 0.8,
						ease: "ease-in-css",
					}
				);

				gsap.fromTo(
					cycleCards.find('[data-cyclecard-image][data-cyclecard-id="' + dataCycleCardIDPrev + '"]'),
					{
						xPercent: 0,
						scale: 1,
						rotate: 0.001,
						transformOrigin: "center top",
					},
					{
						xPercent: -100,
						scale: 1,
						rotate: 0.001,
						duration: 0.8,
						ease: "ease-in-css",
					}
				);
			}
		});

		cycleCards.find("[data-cyclecard-hover]").on("mouseleave", function () {
			dataCycleCardIDPrev = $(this).attr("data-cyclecard-id");
		});
	});
}

function mansoryGrid() {
	$(document).ready(function () {
		$(".photography-grid").masonry({
			itemSelector: ".photography-grid-item",
			columnWidth: 0,
		});
	});
}

function imageFadeIn() {
	const faders = document.querySelectorAll(".fade-in"),
		sliders = document.querySelectorAll(".slide-in"),
		imageAnimation = document.querySelectorAll(".image-in"),
		appearOptions = { threshold: 0, rootMargin: "0px 0px -100px 0px" },
		appearOnScroll = new IntersectionObserver(function (e, r) {
			e.forEach((e) => {
				e.isIntersecting && (e.target.classList.add("appear"), r.unobserve(e.target));
			});
		}, appearOptions);
	faders.forEach((e) => {
		appearOnScroll.observe(e);
	}),
		sliders.forEach((e) => {
			appearOnScroll.observe(e);
		}),
		imageAnimation.forEach((e) => {
			appearOnScroll.observe(e);
		});
}
