"use strict";

var EngagementChartBuilder = window.EngagementChartBuilder || {};

EngagementChartBuilder.Utilities = function () {
    var buildCategoryCounts = function (countArray, dataArray) {
        if (countArray == undefined) {
            countArray = [];
        }

        for (var i = 0; i < dataArray.length; i++) {
            var currValue = dataArray[i];
            var found = false;
            for (var j = 0; j < countArray.length; j++) {
                if (countArray[j][0] == currValue) {
                    found = true;
                    var newCount = countArray[j][1];
                    countArray[j][1] = newCount + 1;
                }
            }
            if (!found) {
                countArray.push([currValue, 1]);
            }
        }
        return countArray;
    },
    loadPieChart = function (countArray, divId, chartTitle) {
        //Build Pie Chart
        Highcharts.setOptions({
        })
        $(divId).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            credits: {
                enabled: false
            },
            title: {
                text: chartTitle
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>',
                percentageDecimals: 0
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: chartTitle,
                data: countArray
            }]
        });
    },
    loadBarChart = function (xCategories, seriesData, divId, chartTitle, yAxisTitle) {
        //Build Bar Chart
        $(divId).highcharts({
            chart: {
                type: 'bar'
            },
            credits: {
                enabled: false
            },
            title: {
                text: chartTitle
            },
            xAxis: {
                categories: xCategories
            },
            yAxis: {
                min: 0,
                title: {
                    text: yAxisTitle
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false
                    }
                },
                series: {
                    animation: false
                }
            },
            series: [{
                name: yAxisTitle,
                data: seriesData
            }]
        });
    },
    loadStackedBarChart = function (xCategories, seriesData, divId, chartTitle, yAxisTitle) {
        //Build Stacked Bar Chart
        $(divId).highcharts({
            chart: {
                type: 'bar'
            },
            credits: {
                enabled: false
            },
            title: {
                text: chartTitle
            },
            xAxis: {
                categories: xCategories
            },
            yAxis: {
                min: 0,
                title: {
                    text: yAxisTitle
                }
            },
            legend: {
                backgroundColor: '#FFFFFF',
                reversed: true
            },
            plotOptions: {
                series: {
                    animation: false,
                    stacking: 'normal'
                }
            },
            series: seriesData
        });
    }
    return {
        buildCategoryCounts: buildCategoryCounts,
        loadPieChart: loadPieChart,
        loadBarChart: loadBarChart,
        loadStackedBarChart: loadStackedBarChart
}
}();
