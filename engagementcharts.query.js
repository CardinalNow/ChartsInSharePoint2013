"use strict";

var EngagementChartBuilder = window.EngagementChartBuilder || {};

//The module for executing a REST query
EngagementChartBuilder.RESTQuery = function (listTitle, query) {
    var execute = function (listTitle, query) {
        var restUrl = _spPageContextInfo.webServerRelativeUrl +
            "/_api/web/lists/getByTitle('" + listTitle + "')/items";
        if (query != "") {
            restUrl = restUrl + "?" + query;
        }
        var deferred = $.ajax({
            url: restUrl,
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            }
        });

        return deferred.promise()
    };

    return {
        execute: execute
    }
}();

