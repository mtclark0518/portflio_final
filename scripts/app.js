
// variables
var $header_top = $('.header-top');
var $nav = $('nav');



// toggle menu 
$header_top.find('a').on('click', function() {
  $(this).parent().toggleClass('open-menu');
});

 

// fullpage customization
$('#fullpage').fullpage({
  sectionSelector: '.vertical-scrolling',
  navigation: true,
  slidesNavigation: true,
  anchors: ['firstSection', 'secondSection', 'thirdSection', 'fourthSection'],
  menu: '#menu',

  afterLoad: function(anchorLink, index) {
    $header_top.css('background', 'rgba(47, 40, 27, .3)');
    $nav.css('background', 'rgba(47, 40, 7, .05)');
    if (index == 5) {
        $('#fp-nav').hide();
      }
  },

  onLeave: function(index, nextIndex, direction) {
    if(index == 5) {
      $('#fp-nav').show();
    }
  },
}); 