var things = [];

$(document).ready(function() {
    $.get( "/allThings", function( data ) {
        things = data;
        createAllTiles();
        updateAllThingsView();
    }, "json");

    var refreshId = setInterval(function() {
        $.post('/updates', {action: 'getUpdates'}, function(data) {
            if(data.length > 0) {
                for(var i = 0; i < data.length; i++) {
                    updateThingData(data[i]);
                }
            }           
        }, 'json');
        updateAllThingsView();
    }, 1000);

    $(document).on('change', 'INPUT', function() {
        var tileId = $(this).parent().parent().attr('id');
        var tileSplit = tileId.split('_');
        var thingId = tileSplit[0].slice(1);
        var index = 0;
        for(var i = 0; i < things.length; i++) {
            if(things[i].id == thingId) index=i;
        }
        if(this.checked) {
            statusText = 'On';
        } else {
            statusText = 'Off';
        }
        things[index].state = statusText;
        $.post('/stateChange', {id: thingId, state: statusText}, function( data ) {
            things[index] = data;
        }, "json");
        updateThingView(thingId);
        if(index == things.length-1) createThingTile(6);
    });
});

function updateThingView(id) {
    var index = 0;
    for(var i = 0; i < things.length; i++) {
        if(things[i].id == id) index=i;
    }
    var thingName = 'T' + id + '_Tile';
    var tileTag = $('#'+thingName);
    var switchTag = tileTag.children('.toggle');
    if(things[index].state == 'On') {
        switchTag.children('INPUT').prop('checked', true);
    } else {
        switchTag.children('INPUT').prop('checked', false);
    }
    tileTag.children('IMG').attr('src', things[index].icon);
    tileTag.children('.title').html(things[index].name);
    tileTag.children('.l1').html('Power: <strong>' + things[index].power +' W</strong>');
    tileTag.children('.l2').html('Status: <strong>' + things[index].state +'</strong>');
    tileTag.children('IMG').removeClass().addClass('thing ' + things[index].consumerStateColor);
    tileTag.children('.l1').children('STRONG').text(things[index].power + ' W');        
}

function updateAllThingsView() {
    for(var i = 0; i < things.length; i++) {
        updateThingView(things[i].id);
    }
}

function updateThingData(id) {
    var index = 0;
    for(var i = 0; i < things.length; i++) {
        if(things[i].id == id) index=i;
    }
    $.post('/things', {id: id}, function(data) {
        things[index] = data;
    }, 'json');
}

function createThingTile(id) {
    var htmlString = '<div id="T' + id + '_Tile" class="thing">';
    htmlString += '<span id="T' + id + '_Title" class="title">Thing Title</span>';
    htmlString += '<span id="T' + id + '_SubTitle1" class="sub l1">Power: <strong>0 W</strong></span>';
    htmlString += '<span id="T' + id + '_SubTitle2" class="sub l2">Status: <strong>On</strong></span>';
    htmlString += '<img id="T' + id + '_Img" class="thing csnone" src="assets/svg/sym_lamp.svg">';
    htmlString += '<label id="T' + id + '_Switch" class="toggle">';
    htmlString += '<input id="T' + id + '_Checkbox" type="checkbox">';
    htmlString += '<span class="roundswitch"></span>';
    htmlString += '</label>';
    htmlString += '</div>';
    $('body').append(htmlString);
}

function createAllTiles() {
    for(var i = 0; i < things.length; i++) {
        createThingTile(things[i].id);
    }
}
