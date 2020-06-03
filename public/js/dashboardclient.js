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
            updateThingView(thingId);
        }, "json");
    });

    $(document).on('click', '.title', function() {
        var tileId = $(this).attr('id');
        var tileSplit = tileId.split('_');
        var thingId = tileSplit[0].slice(1);
        var chartId = tileSplit[0] + '_Chart';
        var index = 0;
        var chartData;
        for(var i = 0; i < things.length; i++) {
            if(things[i].id == thingId) index=i;
        }
        if($(this).parent().hasClass('thingLarge')) {
            $(this).parent().children('.chartOn').removeClass('chartOn').addClass('chartOff').hide();
            $(this).parent().removeClass('thingLarge').addClass('thingNormal');
            $(this).parent().children('.chartOn').children('CANVAS').remove();
        } else {
            $(this).parent().removeClass('thingNormal').addClass('thingLarge');
            $(this).parent().children('.chartOff').removeClass('chartOff').addClass('chartOn').show();
            var canvas = $('<canvas id="T' + thingId + '_Chart" width="200" height="100" class="chart"></canvas>');
            $(this).parent().children('.chartOn').append(canvas);
            var chartObject = $(this).parent().children('.chartOn').children('CANVAS');
            var chart = new Chart(chartObject, {    
                // The type of chart we want to create
                type: 'line',            
                // The data for our dataset
                data: {      
                    labels: things[index].dataChart.chartTimes,         
                    datasets: [{
                        label: 'Leistung',
                        backgroundColor: '#DDDDFF60',
                        borderColor: 'rgb(95, 95, 255)',
                        borderWidth: 1,
                        pointRadius: 0,
                        data: things[index].dataChart.chartPower
                    },
                    {
                        label: 'Gesamt',
                        backgroundColor: '#DDFFDD60',
                        borderColor: 'rgb(95, 255, 95)',
                        borderWidth: 1,
                        pointRadius: 0,
                        data: things[index].dataChart.chartTotal
                    },
                    {
                        label: 'Gestern',
                        backgroundColor: '#FFDDDD60',
                        borderColor: 'rgb(255, 95, 95)',
                        borderWidth: 1,
                        pointRadius: 0,
                        data: things[index].dataChart.chartPrev
                    }]
                },
            
                // Configuration options go here
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });           
        }    
    })
    $(document).on('click', '.chartScale', function() {
        var tileId = $(this).parent().parent().parent().attr('id');
        var tileSplit = tileId.split('_');
        var thingId = tileSplit[0].slice(1);
        var index = 0;
        for(var i = 0; i < things.length; i++) {
            if(things[i].id == thingId) index=i;
        }
        var scale = parseInt($(this).html()) * 60;
        if(things[index].dataChart.chartTimes.length > scale) {
            var labs = things[index].dataChart.chartTimes.slice(things[index].dataChart.chartTimes.length - scale);
            var ds1 = things[index].dataChart.chartPower.slice(things[index].dataChart.chartPower.length - scale);
            var ds2 = things[index].dataChart.chartTotal.slice(things[index].dataChart.chartTotal.length - scale);
            var ds3 = things[index].dataChart.chartPrev.slice(things[index].dataChart.chartPrev.length - scale);            
        } else {
            var labs = things[index].dataChart.chartTimes;
            var ds1 = things[index].dataChart.chartPower;
            var ds2 = things[index].dataChart.chartTotal;
            var ds3 = things[index].dataChart.chartPrev;               
        }
        $(this).parent().parent().children('CANVAS').remove();        
        var canvas = $('<canvas id="T' + thingId + '_Chart" width="200" height="100" class="chart"></canvas>');
        $(this).parent().parent().append(canvas);
        var chartObject = $(this).parent().parent().children('CANVAS');
        var chart = new Chart(chartObject, {    
            // The type of chart we want to create
            type: 'line',            
            // The data for our dataset
            data: {      
                labels: labs,        
                datasets: [{
                    label: 'Leistung',
                    backgroundColor: '#DDDDFF60',
                    borderColor: 'rgb(95, 95, 255)',
                    borderWidth: 1,
                    pointRadius: 0,
                    data: ds1
                },
                {
                    label: 'Gesamt',
                    backgroundColor: '#DDFFDD60',
                    borderColor: 'rgb(95, 255, 95)',
                    borderWidth: 1,
                    pointRadius: 0,
                    data: ds2
                },
                {
                    label: 'Gestern',
                    backgroundColor: '#FFDDDD60',
                    borderColor: 'rgb(255, 95, 95)',
                    borderWidth: 1,
                    pointRadius: 0,
                    data: ds3
                }]
            },
        
            // Configuration options go here
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });           

    })
});

function updateThingView(id) {
    var index = 0;
    var iconColor = 'csnone';
    for(var i = 0; i < things.length; i++) {
        if(things[i].id == id) index=i;
    }
    var thingName = 'T' + id + '_Tile';
    var tileTag = $('#'+thingName);
    var switchTag = tileTag.children('.toggle');
    if(things[index].state.toUpperCase() == 'ON') {
        switchTag.children('INPUT').prop('checked', true);
        iconColor = things[index].consumerStateColor;
    } else {
        switchTag.children('INPUT').prop('checked', false);
    }
    tileTag.children('IMG').attr('src', things[index].icon);
    tileTag.children('.title').html(things[index].title);
    tileTag.children('.i1').html(things[index].infoText1);
    tileTag.children('.i2').html(things[index].infoText2);
    tileTag.children('IMG').removeClass().addClass('thing ' + iconColor);
    tileTag.children('.chartOn').children('.i3').html('Verbrauch gesamt: ' + things[index].totalPower);
    tileTag.children('.chartOn').children('.i4').html('Verbrauch gestern: ' + things[index].prevDayPower);
    var html = '<span id="chartScale6" class="chartScale">6</span>';
    html += '<span id="chartScale12" class="chartScale">12</span>';
    html += '<span id="chartScale24" class="chartScale">24</span>';
    html += '<span id="chartScale48" class="chartScale">48<span>';
    tileTag.children('.chartOn').children('.i5').html(html);
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

function createThingTile(id, col) {
    var htmlString = '<div id="T' + id + '_Tile" class="thing thingNormal">';
    htmlString += '<span id="T' + id + '_Title" class="title">Thing Title</span>';
    htmlString += '<span id="T' + id + '_SubTitle1" class="Info1 i1">Power: <strong>0 W</strong></span>';
    htmlString += '<span id="T' + id + '_SubTitle2" class="Info1 i2">Status: <strong>On</strong></span>';
    htmlString += '<img id="T' + id + '_Img" class="thing csnone" src="assets/svg/sym_lamp.svg">';
    htmlString += '<label id="T' + id + '_Switch" class="toggle">';
    htmlString += '<input id="T' + id + '_Checkbox" type="checkbox">';
    htmlString += '<span class="roundswitch"></span>';
    htmlString += '</label>'; 
    htmlString += '<div class="chartOff">';
    htmlString += '<span id="T' + id + '_Info3" class="Info2 i3"></span>';
    htmlString += '<span id="T' + id + '_Info4" class="Info2 i4"></span>';
    htmlString += '<span id="T' + id + '_Info4" class="Info2 i5"></span>';
    //htmlString += '<canvas id="T' + id + '_Chart" width="200" height="100" class="chart"></canvas>';
    htmlString += '</div>';
    htmlString += '</div>';
    $('#tileCol' + col).append(htmlString);
}

function createAllTiles() {
    for(var i = 0; i < things.length; i++) {
        var col = i % 3;
        createThingTile(things[i].id, col);
    }
}
