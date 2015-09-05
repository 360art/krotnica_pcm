var activity = {
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
        activity.datasets.push({
            "name": "Zegar cyfrowy " + (i + 1) + "/8",
            "data": [],
            "unit": "TTL",
            "type": "line",
            "valueDecimals": 0
        });
}

function dodajZegarKanalowy() {
    for (var i = 0; i < 32; i++)
        activity.datasets.push({
            "name": "Zegar kanałowy " + (i + 1) + "/32",
            "data": [],
            "unit": "TTL",
            "type": "line",
            "valueDecimals": 0
        });
}

function zaladujDane() {
    var zero_jeden = true;
    var ilosc_bitow = 31;
    for (var i = 0; i < ilosc_bitow; i++) {
        zero_jeden = !zero_jeden;
        activity.xData.push(i);

        activity.datasets[0].data.push(Math.round(Math.random())); // Dane
        activity.datasets[1].data.push(+zero_jeden); // Zegar liniowy


        for (var z = 0; z < 8; z++) {
            if (((i) + 8 - z) % 8 == 0) {
                activity.datasets[z + 2].data.push(1);
                activity.datasets[z + 2].data.push(0);
            } else {
                activity.datasets[z + 2].data.push(0);
                activity.datasets[z + 2].data.push(0);
            }
        }
    }
    for (var z = 0; z < 8; z++) {
        activity.datasets[z + 2].data.unshift(0);
        activity.datasets[z + 2].data.pop();
        activity.datasets[z + 2].data = activity.datasets[z + 2].data.slice(0, ilosc_bitow);
        console.log(activity.datasets[z + 2].data);
    }
}

function rysujWykresy() {
    $.each(activity.datasets, function (i, dataset) {

        // Add X values
        dataset.data = Highcharts.map(dataset.data, function (val, i) {
            return [activity.xData[i], val];
        });

        $('<div class="chart">')
            .appendTo('#container')
            .highcharts({
                chart: {
                    marginLeft: 40, // Keep all charts left aligned
                    spacingTop: 20,
                    spacingBottom: 20,
                    height: 200,
                    // zoomType: 'x',
                    // pinchType: null // Disable zoom on touch devices
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
                    events: {
                        setExtremes: syncExtremes
                    },
                    labels: {
                        format: '{value} t'
                    }
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
                    pointFormat: '{point.y}',
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

$(document).ready(function () {
    dodajZegarCyfrowy();
    dodajZegarKanalowy();
    zaladujDane();
    rysujWykresy();
});
