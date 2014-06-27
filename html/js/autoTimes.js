autoTimes = {};

$(document).ready(function() {    

    updateAutoTimes();

    // add update time button handlers
    $('table').on('click', 'button.autoB', function() {
        var pin = $(this).attr('data-pin');
        var enabled = $('#autoIen' + pin).prop('checked');
        var timeOn = $('#autoIon' + pin).val();
        var timeOff = $('#autoIoff' + pin).val();
        var urlParams = "/" + pin + ","+ enabled + "," + timeOn + "," + timeOff;

        $.post("macros/setAutoTime" + urlParams, function(data) {
            // toast notify on success
            var $toast = $( "#toast-example1").clone();
            $toast.show();
            $('#alerts-container').append($toast.addClass('in'));
        });
    });

});


function updateAutoTimes () {

    // get current timers from server
    $.post("macros/getAutoTimes", function(data) {
        autoTimes = $.parseJSON(data);

        // find out which pins are outputs
        var outputs = [];
        $.getJSON('*', function(data) {
            pins = data.GPIO;
            for (var pin in pins) {
                if (!pins.hasOwnProperty(pin)) {
                    continue;
                }

                if (pins[pin].function == "OUT") {
                    outputs.push(pin);
                }
            }

            // for each pin that is an output, add a row to the table
            updateAutoTimesTable(outputs);
        });
    
    }); 
}

// create the table to update times
function updateAutoTimesTable(outputs) {
    $('#autoTimes').html("");

    for (var i = 0; i < outputs.length; i++) {
        var pin = outputs[i];

        var checked = "";
        if (autoTimes[pin][0] == 'true')
            checked = " checked";

        $('#autoTimes').append('<tr>'
            + '<td>' + pin + '</td>'
            + '<td>' + '<input id="autoIen' + pin + '" type="checkbox"' + checked + '>' + '</td>'
            + '<td>' + '<input id="autoIon' + pin + '" type="text" value="' + autoTimes[pin][1] + '">' + '</td>'
            + '<td>' + '<input id="autoIoff' + pin + '" type="text" value="' + autoTimes[pin][2] + '">' + '</td>'
            + '<td>' + '<button data-pin="' + pin + '" class="btn autoB">Update</button>' + '</td>'
            + '</tr>');
    }
}