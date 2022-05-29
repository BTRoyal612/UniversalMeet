/*************************** PROFILE ****************************/
$(document).ready(function() {
    $('.day_title').each(function () {
        var hue = 'rgb(' + (Math.floor((256-199)*Math.random()) + 100) + ',' + (Math.floor((256-199)*Math.random()) + 150) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ')';
        $(this).css("background-color", hue);
    });
});

$(document).ready(() => {
    let typingElement = $('.typing');
  
    typingElement.on('click', (e) => {
      typingElement.removeClass('animate');
      setTimeout(() => typingElement.addClass('animate'), 1);
    })
  });