$(document).ready(function() {

    // $('.container').css('display', 'none');
    // $('.container').fadeIn(300);
    // setTimeout(function() {
    //     $('#page-home').show();
    // }, 500);

    $('.win-command').click(function(event) {
        
        event.preventDefault();
        newLocation = this.href.substring(this.href.indexOf("#"));
        $('.page').fadeOut(300);
        setTimeout(function() { 
            // window.location = newLocation; 
            $(newLocation).fadeIn(300);
        }, 500);

        // update timers table
        if (newLocation == '#page-timers') {
            updateAutoTimes();
        }

        // update title
        if (newLocation == '#page-home') {
            $('#pageTitle').text("Home");
        } else if (newLocation == '#page-lighting') {
            $('#pageTitle').text("Lighting");
        } else if (newLocation == '#page-timers') {
            $('#pageTitle').text("Timers");
        } else if (newLocation == '#page-settings') {
            $('#pageTitle').text("Settings");
        }
    });

});