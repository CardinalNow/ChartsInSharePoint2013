"use strict";

var EngagementChartBuilder = window.EngagementChartBuilder || {};

EngagementChartBuilder.EngagementsPieChart = function () {
    var load = function () {
        $.when(
            //Independent Engagements List - retrieving Engagement Type field to get Enterprise or Rebel type
            EngagementChartBuilder.RESTQuery.execute("Independent%20Engagements", "$select=Engagement_x0020_Type"),
            //Rebel Engagements List
            EngagementChartBuilder.RESTQuery.execute("Rebel%20Engagements", "$select=ID"),
            //Empire Engagements List
            EngagementChartBuilder.RESTQuery.execute("Empire%20Engagements", "$select=ID")
        ).done(
            function (engagements1, engagements2, engagements3) {
                var dataArray = [];
                var countArray = [];
                //Add count of Rebel Engagements list
                countArray.push(["Rebel", engagements2[0].d.results.length]);
                //Add count of Empire Engagements list
                countArray.push(["Empire", engagements3[0].d.results.length]);
                //Get data from Independent Engagements list
                var results = engagements1[0].d.results;
                for (var i = 0; i < results.length; i++) {
                    var engagementType = results[i].Engagement_x0020_Type.results;
                    for (var j = 0; j < engagementType.length; j++) {
                        dataArray.push(engagementType[j]);
                    }
                }
                countArray = EngagementChartBuilder.Utilities.buildCategoryCounts(countArray, dataArray);
                //Build Chart
                EngagementChartBuilder.Utilities.loadPieChart(countArray, "#engagementPieChart", "Engagements");
            }
        ).fail(
            function (engagements1, engagements2, engagements3) {
                $("#engagementPieChart").html("<strong>An error has occurred.</strong>");
            }
        );
    };

    return {
        load: load
    }
}();

EngagementChartBuilder.LeaderEngagementsByStatusChart = function () {
    var load = function () {
        $.when(
            //Rebel Engagements List
            EngagementChartBuilder.RESTQuery.execute("Rebel%20Engagements", "$select=Leader,Status"),
            //Empire Engagements List
            EngagementChartBuilder.RESTQuery.execute("Empire%20Engagements", "$select=Leader,Status")
        ).done(
            function (engagements1, engagements2) {
                var data = [];
                //Get results from Rebel Engagements
                var results = engagements1[0].d.results;
                for (var i = 0; i < results.length; i++) {
                    var found = false;
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].leaderName == results[i].Leader && data[j].statusName == results[i].Status) {
                            data[j].statusCount = data[j].statusCount + 1;
                            found = true;
                        }
                    }
                    if (!found) {
                        data.push(new EngagementChartBuilder.StatusByLeader(results[i].Leader, results[i].Status, 1));
                    }
                }
                //Get results from Empire Engagements Engagements
                var results = engagements2[0].d.results;
                for (var i = 0; i < results.length; i++) {
                    var found = false;
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].leaderName == results[i].Leader && data[j].statusName == results[i].Status) {
                            data[j].statusCount = data[j].statusCount + 1;
                            found = true;
                        }
                    }
                    if (!found) {
                        data.push(new EngagementChartBuilder.StatusByLeader(results[i].Leader, results[i].Status, 1));
                    }
                }
                //Put data into format for stacked bar chart
                var seriesData = [];
                var xCategories = [];
                var xStatus = [];
                var i, j, cat, stat;
                //Get Categories (Leader Name)
                for (i = 0; i < data.length; i++) {
                    cat = data[i].leaderName;
                    if (xCategories.indexOf(cat) === -1) {
                        xCategories[xCategories.length] = cat;
                    }
                }
                //Get Status values
                for (i = 0; i < data.length; i++) {
                    stat = data[i].statusName;
                    if (xStatus.indexOf(stat) === -1) {
                        xStatus[xStatus.length] = stat;
                    }
                }
                //Create initial series data with 0 values
                for (i = 0; i < xStatus.length; i++) {
                    var dataArray = [];
                    for (j = 0; j < xCategories.length; j++) {
                        dataArray.push(0);
                    }
                    seriesData.push({ name: xStatus[i], data: dataArray });
                }
                //Cycle through data to assign counts to the proper location in the series data
                for (i = 0; i < data.length; i++) {
                    var leaderIndex = xCategories.indexOf(data[i].leaderName);
                    for(j = 0; j < seriesData.length; j++){
                        if(seriesData[j].name == data[i].statusName){
                            seriesData[j].data[leaderIndex] = data[i].statusCount;
                            break;
                        }
                    }
                }
                //Build Chart
                EngagementChartBuilder.Utilities.loadStackedBarChart(xCategories, seriesData, "#engagementsByStatusChart", "Engagements by Status", "Total Engagements");
            }
        );
    };

    return {
        load: load
    }
}();

EngagementChartBuilder.LeaderEngagementsChart = function () {
    var load = function () {
        $.when(
            //Rebel Engagements List
            EngagementChartBuilder.RESTQuery.execute("Rebel%20Engagements", "$select=Leader"),
            //Empire Engagements List
            EngagementChartBuilder.RESTQuery.execute("Empire%20Engagements", "$select=Leader")
        ).done(
            function (engagements1, engagements2) {
                var dataArray = [];
                var countArray = [];
                //Get data from Rebel Engagements list
                var results = engagements1[0].d.results;
                for (var i = 0; i < results.length; i++) {
                    var leader = results[i].Leader;
                    dataArray.push(leader);
                }
                //Get data from Empire Engagements list
                var results = engagements2[0].d.results;
                for (var i = 0; i < results.length; i++) {
                    var leader = results[i].Leader;
                    dataArray.push(leader);
                }
                countArray = EngagementChartBuilder.Utilities.buildCategoryCounts(countArray, dataArray);
                //Put data into format for bar chart
                var seriesData = [];
                var xCategories = [];
                for (var i = 0; i < countArray.length; i++) {
                    xCategories.push(countArray[i][0]);
                    seriesData.push(countArray[i][1]);
                }
                //Build Chart
                EngagementChartBuilder.Utilities.loadBarChart(xCategories, seriesData, "#engagementsByLeaderChart", "Engagements by Person", "Total Engagements");
            }
        ).fail(
            function (engagements1, engagements2) {
                $("#engagementsByLeaderChart").html("<strong>An error has occurred.</strong>");
            }
        );
    };

    return {
        load: load
    }
}();

//object for holding a category instance
EngagementChartBuilder.StatusByLeader = function (name, status, count) {
    var leaderName = name,
        statusName = status,
        statusCount = count

    return {
        leaderName: name,
        statusName: statusName,
        statusCount: statusCount
    }
}
