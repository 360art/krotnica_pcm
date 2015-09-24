var zegary = {
    "xData": [],
    "datasets": [{
        "name": "Dane",
        "data": [],
        "unit": "TTL",
        "type": "line",
        "valueDecimals": 0
        }, {
        "name": "Zegar liniowy",
        "data": [],
        "unit": "TTL",
        "type": "line",
        "valueDecimals": 0
        }]
};

var ilosc_bitow = 525;

$('#container').bind('mousemove touchmove', function (e) {
    var chart,
        point,
        i;

    for (i = 0; i < Highcharts.charts.length; i++) {
        chart = Highcharts.charts[i];
        e = chart.pointer.normalize(e); // Find coordinates within the chart
        point = chart.series[0].searchPoint(e, true); // Get the hovered point

        if (point) {
            point.onMouseOver(); // Show the hover marker
            chart.tooltip.refresh(point); // Show the tooltip
            chart.xAxis[0].drawCrosshair(e, point); // Show the crosshair
        }
    }
});
/**
 * Override the reset function, we don't need to hide the tooltips and crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    Highcharts.each(Highcharts.charts, function (chart) {
        if (chart !== thisChart) {
            if (chart.xAxis[0].setExtremes) { // It is null while updating
                chart.xAxis[0].setExtremes(e.min, e.max);
            }
        }
    });
}


function dodajZegarCyfrowy() {
    for (var i = 0; i < 8; i++)
        zegary.datasets.push({
            "name": "Zegar cyfrowy " + (i + 1) + "/8",
            "data": [],
            "unit": "TTL",
            "type": "line",
            "valueDecimals": 0
        });
}

function dodajZegarKanalowy() {
    for (var i = 0; i < 32; i++) {
        zegary.datasets.push({
            "name": "Zegar kanałowy " + (i + 1) + "/32",
            "data": [],
            "unit": "TTL",
            "type": "line",
            "valueDecimals": 0
        });
    }
}

function dodajZegarRamek() {
    for (var i = 0; i < 1; i++) {
        zegary.datasets.push({
            "name": "Zegar ramek " + (i + 1) + "/16",
            "data": [],
            "unit": "TTL",
            "type": "line",
            "valueDecimals": 0
        });
    }
}

function zaladujDaneIliniowy() {
    var zero_jeden = true;
    for (var i = 0; i < ilosc_bitow; i++) {
        zero_jeden = !zero_jeden;
        zegary.xData.push(i);

        zegary.datasets[0].data.push(Math.round(Math.random())); // Dane
        zegary.datasets[1].data.push(+zero_jeden); // Zegar liniowy
    }
}

function zaladujZegaryCyfrowe() {
    for (var i = 0; i < ilosc_bitow; i++) {
        for (var z = 0; z < 8; z++) {
            if (((i) + 8 - z) % 8 == 0) {
                zegary.datasets[z + 2].data.push(1);
                zegary.datasets[z + 2].data.push(0);
            } else {
                zegary.datasets[z + 2].data.push(0);
                zegary.datasets[z + 2].data.push(0);
            }
        }
    }
    normalizujDane(8, 2);
}



function zaladujZegaryKanalowe() {
    function dodaj8bitow(zegar) {
        for (var i = 0; i < 15; i++) {
            zegary.datasets[zegar + 10].data.push(1);
        }
    }

    function wypelnijDoKoncaZerami(zegar) {
        var aktualna_pozycja = zegary.datasets[zegar + 10].data.length;
        for (var i = aktualna_pozycja; i < ilosc_bitow; i++) {
            zegary.datasets[zegar + 10].data.push(0);
        }
    }

    for (var i = 0; i < 32; i++) {
        for (z = 0; z < (i * 16); z++) {
            zegary.datasets[i + 10].data.push(0);
        }
        dodaj8bitow(i);
        wypelnijDoKoncaZerami(i);
    }
    normalizujDane(32, 10);
}

function zaladujZegaryRamek() {
    for (var i = 0; i < 511; i++) {
        zegary.datasets[42].data.push(1);
    }
    for (var i = 511; i < ilosc_bitow; i++) {
        zegary.datasets[42].data.push(0);
    }
    normalizujDane(1, 42);
}

function normalizujDane(ilosc_zegarow, przesuniecie) {
    for (var z = 0; z < ilosc_zegarow; z++) {
        zegary.datasets[z + przesuniecie].data.unshift(0);
        zegary.datasets[z + przesuniecie].data.pop();
        zegary.datasets[z + przesuniecie].data = zegary.datasets[z + przesuniecie].data.slice(0, ilosc_bitow);
    }
}

function rysujWykresy() {
    $.each(zegary.datasets, function (i, dataset) {

        // Add X values
        dataset.data = Highcharts.map(dataset.data, function (val, i) {
            return [zegary.xData[i], val];
        });

        $('<div class="chart">')
            .appendTo('#container')
            .highcharts({
                chart: {
                    marginLeft: 70, // Keep all charts left aligned
                    spacingTop: 10,
                    spacingBottom: 10,
                    height: 100,
                    // zoomType: 'x',
                    // pinchType: null // Disable zoom on touch devices
                },
                plotOptions: {
                  line: {
                    marker: {
                      enabled: false
                    }
                  }
                },
                title: {
                    text: dataset.name,
                    align: 'left',
                    margin: 0,
                    x: 30
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    crosshair: true,
                    min: 0,
                    tickInterval: 2,
                    events: {
                        setExtremes: syncExtremes
                    },
                    labels: {
                        step: 1,
                        //format: '{value} t',
                        formatter: function() {
                            return this.value/2 + 't';
                        }
                    },
                    allowDecimals: false
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                tooltip: {
                    positioner: function () {
                        return {
                            x: this.chart.chartWidth - this.label.width, // right aligned
                            y: -1 // align to title
                        };
                    },
                    borderWidth: 0,
                    backgroundColor: 'none',
                    pointFormat: '{point.x}',
                    headerFormat: '',
                    shadow: false,
                    style: {
                        fontSize: '18px'
                    },
                    valueDecimals: dataset.valueDecimals
                },
                series: [{
                    data: dataset.data,
                    name: dataset.name,
                    type: dataset.type,
                    step: true,
                    color: Highcharts.getOptions().colors[i],
                    fillOpacity: 0.3,
                    tooltip: {
                        valueSuffix: ' ' + dataset.unit
                    }
                    }]
            });
    });
}

function dodajZegary() {
    dodajZegarCyfrowy();
    dodajZegarKanalowy();
    dodajZegarRamek();
}

function zaladujDane() {
    zaladujDaneIliniowy();
    zaladujZegaryCyfrowe();
    zaladujZegaryKanalowe();
    zaladujZegaryRamek();
}

$(document).ready(function () {
    dodajZegary();
    zaladujDane();
    rysujWykresy();
});
