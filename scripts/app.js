
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



$(document).ready( () => {
  Contact = function(){
    this.name = $('#contact-name').val();
    this.email = $('#contact-email').val();
    this.message = $('#contact-message').val();
  };

//someone clicks button to contact
  $('#form-submit').click(function(e) {
    e.preventDefault();
    $('.icon-scroll').addClass('sending');
    let newContact = new Contact();
    let contact = JSON.stringify(newContact);
    console.log(contact);
// ajax calls to submit contact form
    $.ajax({
      url: '/',
      method: 'POST',
      contentType: 'application/json',
      data: contact,
      success: function(data){
        console.log('inside the success post function');
        console.log(data);
        
        // reset form values
        $('#contact-name').val('');
        $('#contact-email').val('');
        $('#contact-message').val('');

        $('.icon-scroll').removeClass('sending').addClass('sent');
      }
    });
  });
});