$(document).ready(function() {
  // ----- Navbar -----

  $(".navbar-toggler").click(function() {
      $(".fa-bars").toggleClass("d-none");
    $(".fa-xmark").toggleClass("d-none");
  });

  // ----- Success Section -----

  let animated = false;

  function animateCounters() {
    Array.from($(".success-title-count")).forEach((element) => {
      let currentValue = 0;
      const maxValue = parseInt(element.textContent);
      const time = 3000;
      const countInterval = Math.ceil((maxValue / time) * 10);

      $(element).text(currentValue);

      let interval = setInterval(() => {
        currentValue += countInterval;
        if (currentValue >= maxValue) {
          currentValue = maxValue;
          clearInterval(interval);
        }
        $(element).text(currentValue);
      }, 10);
    });
  }

  function isInViewport($element) {
    const elementTop = $element.offset().top;
    const elementBottom = elementTop + $element.outerHeight();
    const viewportTop = $(window).scrollTop();
    const viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  }

  $(window).on("scroll", function () {
    if (!animated && isInViewport($("#success-counter"))) {
      animateCounters();
      animated = true;
    }
  });

  $(window).trigger("scroll");

  // ----- Testimonial Section -----

  $("#testimonial-btn").click(function () {
    let hiddenCards = $(".selec-testimonial-cards").children(".d-none");
    let cardCount = hiddenCards.length;

    for (let i = 0; i < 3; i++) {
      if (i >= cardCount) {
        $("#testimonial-btn").hide();
        break;
      }

      $(hiddenCards[i]).removeClass("d-none").hide().fadeIn();
    }

    if ($(".selec-testimonial-cards").children(".d-none").length === 0) {
      $("#testimonial-btn").hide();
    }
  });

  // ----- Video Section -----

  $(".play-icon").click(function () {
    $("iframe").attr(
      "src",
      "https://www.youtube.com/embed/5GKzR0rjFvM?si=ZFYVw-BUpkPebFNn"
    );
    $(".video-container-img").hide();
  });
});
