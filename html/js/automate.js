// available gpio pins
var GPIO_pins = [2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 17, 18, 22, 23, 24, 25, 27];
// used GPIO pins - updated automatically
var GPIO_used = [];
// stores current state of gpio pins, so not constantly invoking webiopi
var states = {};
// if for some reason HIGH and LOW are reversed, set this to true
var GPIO_reversed = false;
// how often to refresh pin data in seconds (queries webiopi server)
var GPIO_refresh = 1;

//imagemapster settings
var resizeDelay = 0,
    resizeTime = 0,
    resizeWidth = 8 / 12;


$(document).ready(function() {

    ///////////////////////////////////////////////////////////////////
    // initialise areas

    area_num = 0,
    areas = [],
    areabtn_num = 0,
    areabtns = [];
    // parse areas in html
    $('.area').each(function() {
        $(this).attr('id', 'area_' + area_num);
        areas.push($(this));
        area_num += 1;
    });
    $('.area_button').each(function() {
        $(this).attr('id', 'areabtn_' + areabtn_num);
        areabtns.push($(this));
        areabtn_num += 1;
    });
    // add area button click handlers
    $('.area_button').click(function(e) {
        e.preventDefault();
        toggleArea($(this).attr('id').substr(-1));
    });

    // show first area on page load
    toggleArea(0);

    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    // Initialise Imagemapster

    $('.imgmap').mapster({
        fillColor: 'FFC50B',
        stroke: false,
        singleSelect: false,
        fillOpacity: 0.7,
        highlight: false,
        onClick: function(data) {
            toggleLight($(this).attr('gpio'), false);
        }
    });

    // set the map size
    resizeMap($(window).width() * resizeWidth, $(window).height());

    // handle imagemap resizing
    $(window).bind('resize', onWindowResize);

    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    // Initialise lights & switches

    // initialise lights
    $('.light').each(function() {
        $(this).attr('id', 'light_' + $(this).attr('gpio'));
    });

    // initialise switches
    var lightswitchnum = 1;
    $('.light_switch').each(function() {

        // add slider html
        var label = $(this).text();
        var lsid = 'lightswitch_' + $(this).attr('gpio');
        $(this).html(
            '<div class="row">' +
            '    <div class="small-4 column">' +
            '        <div class="switchlabel">' + label + '</div>' +
            '    </div>' +
            '    <div class="small-4 columns">' +
            '            <div class="onoffswitch">' +
            '                <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="' + lsid + '" >' +
            '                <label class="onoffswitch-label" for="' + lsid + '">' +
            '                    <div class="onoffswitch-inner"></div>' +
            '                    <div class="onoffswitch-switch"></div>' +
            '                </label>' +
            '            </div>' +
            '    </div>' +
            '</div>'
        );
        lightswitchnum += 1;
    });

    // add lights to list of GPIO_used
    $('.light_switch').each(function() {
        var gpio = $(this).attr('gpio');
        GPIO_used.push(gpio);
    });

    // add toggle handler
    $('.light_switch').change(function() {
        toggleLight($(this).attr('gpio'), true);
    });


    // get initial value of GPIO pins and then show main
    refreshGpio();
    setTimeout(function() {
        $('#main').show();
    }, 150);

    // initialise refresh of GPIO pins
    setInterval(function() {
        refreshGpio()
    }, GPIO_refresh * 1000);

});


// Toggle a light state (on/off)
function toggleLight(gpio, switched) {
    // set new state
    if (states[gpio] == 1) {
        states[gpio] = 0;
    } else {
        states[gpio] = 1;
    }

    // update GPIO pin through webiopi REST API
    url = "/GPIO/" + gpio + "/value" + "/" + states[gpio];
    $.post(url);

    // update switch and light on the interface
    updateLights(gpio, switched);
}

// Update switches and lights after a light has been toggled
function updateLights(gpio, switched) {
    var lightswitch = $('#lightswitch_' + gpio);
    var light = $('#light_' + gpio);

    if (GPIO_reversed) {
        off = 1;
    } else {
        off = 0;
    }

    if (states[gpio] == off) {
        lightswitch.prop('checked', false);
        if (switched) light.mapster('deselect');
    } else {
        lightswitch.prop('checked', true);
        if (switched) light.mapster('select');
    }
}

// Refresh GPIO pins, reloading data from webiopi through REST API
function refreshGpio() {
    url = "*";
    $.get(url, function(data) {
        pins = data.GPIO;
        for (var i = 0; i < GPIO_used.length; i++) {
            var gpio = GPIO_used[i];
            states[gpio] = pins[gpio].value;
            updateLights(gpio, true);
        }
    });
}

// Change 'tab' when area button is clicked
function toggleArea(area) {
    // button appearance
    var active = 'area_button large button';
    var inactive = 'area_button large secondary button';

    var i;
    // set buttons
    for (i = 0; i < areabtns.length; i++) {
        if (i == area) {
            $(areabtns[i]).attr('class', active);
        } else {
            $(areabtns[i]).attr('class', inactive);
        }
    }

    // show area
    for (i = 0; i < areas.length; i++) {
        if (i == area) {
            $(areas[i]).show();
        } else {
            $(areas[i]).hide();
        }
    }
}

// Resize the map to fit within the boundaries provided
function resizeMap(maxWidth, maxHeight) {
    var image = $('.imgmap'),
        imgWidth = image.width(),
        imgHeight = image.height(),
        newWidth = 0,
        newHeight = 0;

    if (imgWidth / maxWidth > imgHeight / maxHeight) {
        // if (maxWidth > 560)
        //     newWidth = 560;
        // else
        newWidth = maxWidth;
    } else {
        // if (maxHeight > 425)
        //     newHeight = 425;
        // else
        newHeight = maxHeight - 120;
    }
    image.mapster('resize', newWidth, newHeight, resizeTime);
}

// Track window resizing events
function onWindowResize() {
    var curWidth = $(window).width(),
        curHeight = $(window).height(),
        checking = false;
    // only resize when window size is no longer changing
    if (checking) {
        return;
    }
    checking = true;
    window.setTimeout(function() {
        var newWidth = $(window).width(),
            newHeight = $(window).height();
        if (newWidth === curWidth &&
            newHeight === curHeight) {
            resizeMap(newWidth * resizeWidth, newHeight);
        }
        checking = false;
    }, resizeDelay);
}