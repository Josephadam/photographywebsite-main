gsap.registerPlugin(ScrollTrigger);

let scroll;
let transitionOffset = 1225;

const body = document.body;
const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);
//const container = select('.site-main');

initPageTransitions();

function initLoaderHome() {
  var tl = gsap.timeline();

  console.log("first page load");

  tl.set("html", {
    cursor: "wait",
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

  tl.set(
    "html",
    {
      cursor: "auto",
    },
    "=-0.4"
  );

  tl.call(
    function () {
      pageTransitionOutAnimation();
      scroll.start();
    },
    null,
    3.5
  );
}

// Animation - Page Loader
function initLoader() {
  var tl = gsap.timeline();

  console.log("Page loader");

  tl.set("html", {
    cursor: "wait",
  });

  tl.call(
    function () {
      scroll.stop();
    },
    null,
    0
  );

  tl.call(
    function () {
      pageTransitionOut();
    },
    null,
    0.1
  );

  tl.set(
    "html",
    {
      cursor: "auto",
    },
    0.5
  ); // Short delay right after the transition starts
}

// Animation - Page Leave
function pageTransitionIn() {
  var tl = gsap.timeline();

  console.log("Transitioning page in...");

  tl.to("main", {
    duration: 1.2,
    scale: 0.925,
    rotate: 0.001,
    y: "-7.5vh",
    ease: "Power3.easeInOut",
    clearProps: "all",
  });

  tl.to(
    "main .main-dark-overlay",
    {
      duration: 1.2,
      ease: "Expo.easeInOut",
      opacity: 0.75,
      clearProps: "all",
    },
    "<"
  );

  tl.to(
    ".loading-screen",
    {
      duration: 1.2,
      scaleY: 1,
      ease: "Expo.easeInOut",
    },
    "<"
  );
  tl.call(
    function () {
      scroll.stop();
    },
    null,
    0
  );
}

// Animation - Page Enter
function pageTransitionOut() {
  var tl = gsap.timeline();

  console.log("page out");

  if (document.querySelector(".swipe-cover")) {
    tl.set(".swipe-cover", {
      scaleY: 1,
      rotate: 0.001,
      opacity: 1,
    });
  }

  tl.call(
    function () {
      pageTransitionOutAnimation();
    },
    null,
    0
  );
  tl.call(function () {
    scroll.start();
  });

  tl.call(
    function () {
      initCheckWindowHeight();
    },
    null,
    0.5
  );
}

// Animation - Page Enter
function pageTransitionOutAnimation() {
  var tl = gsap.timeline();

  if (document.querySelector(".loader-overlay")) {
    tl.set(".loader-overlay", {
      autoAlpha: 0,
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

function initPageTransitions() {
  // do something before the transition starts
  barba.hooks.before(() => {
    select("html").classList.add("is-transitioning");
  });

  // do something after the transition finishes
  barba.hooks.after(() => {
    select("html").classList.remove("is-transitioning");
    // reinit locomotive scroll
    scroll.init();
    scroll.stop();
  });

  // scroll to the top of the page
  barba.hooks.enter(() => {
    scroll.destroy();
  });

  // scroll to the top of the page
  barba.hooks.afterEnter(() => {});

  barba.init({
    sync: true,
    debug: false,
    timeout: 7000,
    transitions: [
      {
        name: "to-home",
        from: {},
        to: {
          namespace: ["home"],
        },
        once(data) {
          initSmoothScroll(data.next.container);
          initScript();
          initLoaderHome();
        },
      },
      {
        name: "default",
        once(data) {
          initSmoothScroll(data.next.container);
          initScript();
          initLoader();
        },
        async leave(data) {
          pageTransitionIn(data.current);
          await delay(transitionOffset);
          data.current.container.remove();
        },
        async enter(data) {
          pageTransitionOut(data.next);
        },
        async beforeEnter(data) {
          ScrollTrigger.getAll().forEach((t) => t.kill());
          scroll.destroy();
          initSmoothScroll(data.next.container);
          initScript();
        },
      },
    ],
  });

  function initSmoothScroll(container) {
    scroll = new LocomotiveScroll({
      el: container.querySelector("[data-scroll-container]"),
      smooth: true,
      lerp: 0.075,
    });
    window.onresize = scroll.update();

    scroll.on("scroll", () => ScrollTrigger.update());
    window.onbeforeunload = scroll.scrollTo(0, 0);
    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
      scrollTop(value) {
        return scroll.scroll.instance.scroll.y;
      }, // we don't have to define a scrollLeft because we're only scrolling vertically.
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
      pinType: container.querySelector("[data-scroll-container]").style
        .transform
        ? "transform"
        : "fixed",
    });

    ScrollTrigger.defaults({
      scroller: document.querySelector("[data-scroll-container]"),
    });

    /**
     * Remove Old Locomotive Scrollbar
     */

    const scrollbar = selectAll(".c-scrollbar");

    if (scrollbar.length > 1) {
      scrollbar[0].remove();
    }

    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
    ScrollTrigger.addEventListener("refresh", () => scroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();
  }
}

function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

/**
 * Fire all scripts on page load
 */
function initScript() {
  select("body").classList.remove("is-loading");
  initBasicFunctions();
  initTimeZone();
  navScroll();
  initLazyLoad();
  initCheckWindowHeight();
  imageHover();
  initScrollTriggerPlayVideoInview();
  mansoryGrid();
  imageFadeIn();
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

function initBasicFunctions() {
  let scroll = {
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

  $(".nav-mobile .nav-link-click").click(function () {
    if ($(".nav-mobile").hasClass("active")) {
      $(".nav-mobile").removeClass("active");
      scroll.start(); // Ensure scrolling is re-enabled when a mobile nav link is clicked
    }
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
 * time zone
 */
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

function imageHover() {
  $("[data-cyclecards-init]").each(function () {
    var cycleCards = $(this);
    var cycleCardsIndex = 2;
    let dataCycleCardIDPrev = cycleCards
      .find('[data-cyclecard-image][data-cyclecard-status="active"]')
      .attr("data-cyclecard-id");

    cycleCards
      .find('[data-cyclecard-image][data-cyclecard-status="active"]')
      .css("z-index", cycleCardsIndex);
    gsap.set(
      cycleCards.find(
        '[data-cyclecard-hover][data-cyclecards-status="not-active"]'
      ),
      {
        xPercent: -100,
        scale: 1,
        rotate: 0.001,
      }
    );

    cycleCards
      .find("[data-cyclecard-hover]")
      .on("mouseenter click", function () {
        let dataCycleCardID = $(this).attr("data-cyclecard-id");
        if (
          cycleCards
            .find(
              '[data-cyclecard-hover][data-cyclecard-id="' +
                dataCycleCardID +
                '"]'
            )
            .attr("data-cyclecard-status") != "active"
        ) {
          cycleCardsIndex = cycleCardsIndex + 1;

          cycleCards
            .find('[data-cyclecard-id="' + dataCycleCardID + '"]')
            .attr("data-cyclecard-status", "active")
            .siblings()
            .attr("data-cyclecard-status", "not-active");
          cycleCards
            .find(
              '[data-cyclecard-image][data-cyclecard-id="' +
                dataCycleCardID +
                '"]'
            )
            .css("z-index", cycleCardsIndex);

          gsap.fromTo(
            cycleCards.find(
              '[data-cyclecard-image][data-cyclecard-id="' +
                dataCycleCardID +
                '"]'
            ),
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
            cycleCards.find(
              '[data-cyclecard-image][data-cyclecard-id="' +
                dataCycleCardIDPrev +
                '"]'
            ),
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
        e.isIntersecting &&
          (e.target.classList.add("appear"), r.unobserve(e.target));
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

gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});
