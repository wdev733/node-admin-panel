/* globals taillogWatcher Chart */

// Define global variables
var timeLineChart, queryTypeChart, forwardDestinationChart;

const padNumber = function(num) {
    return ("00" + num)
        .substr(-2, 2);
};

// Helper function needed for converting the Objects to Arrays
function objectToArray(p) {
    var keys = Object.keys(p);
    keys.sort(function(a, b) {
        return a - b;
    });
    var arr = [],
        idx = [];
    for (var i = 0; i < keys.length; i++) {
        arr.push(p[keys[i]]);
        idx.push(keys[i]);
    }
    return [idx, arr];
}

// Class handling summary updates
var summaryUpdater = {};
(function(sU) {
    var summaryData = {
        "ads_blocked_today": -1,
        "dns_queries_today": -1,
        "domains_being_blocked": -1,
        "ads_percentage_today": -1
    };
    const updateView = function() {
        ["ads_blocked_today", "dns_queries_today", "domains_being_blocked", "ads_percentage_today"].forEach(function(header, idx) {
            var textData = idx === 3 ? summaryData[header] + "%" : summaryData[header];
            $("h3#" + header)
                .text(textData);
        });
        $("#toprow-stats .overlay")
            .each(function(idx, overlay) {
                if ($(overlay)
                    .is(":visible")) {
                    $(overlay)
                        .hide();
                }
            });
    };
    const pollData = function() {
        $.getJSON("/api/data?summary", function LoadSummaryData(data) {
                summaryData = data;
            })
            .done(function() {
                updateView();
            })
            .fail(function() {
                // retry again in 300ms
                setTimeout(pollData, 300);
            });
    };
    const subscribeSocket = function() {
        taillogWatcher
            .on("dns", socketUpdate);
    };
    const unsubscribeSocket = function() {
        taillogWatcher
            .off("dns", socketUpdate);
    };
    const socketUpdate = function(data) {
        if (!data.type) {
            return;
        }
        if (data.type === "block") {
            summaryData["ads_blocked_today"]++;
        }
        summaryData["dns_queries_today"]++;
        summaryData["ads_percentage_today"] = (summaryData["ads_blocked_today"] / summaryData["dns_queries_today"] * 100)
            .toFixed(2);
        updateView();
    };
    sU.start = function() {
        pollData();
        subscribeSocket();
    };
}(summaryUpdater));

var queryTimelineUpdater = {};
(function(qTU) {
    var timeLineChart;
    var failures = 0;
    var callbacks = {};
    const timelineChartData = {
        labels: [],
        datasets: [{
            label: "Total DNS Queries",
            fill: true,
            backgroundColor: "rgba(220,220,220,0.5)",
            borderColor: "rgba(0, 166, 90,.8)",
            pointBorderColor: "rgba(0, 166, 90,.8)",
            pointRadius: 1,
            pointHoverRadius: 5,
            data: [],
            pointHitRadius: 5,
            cubicInterpolationMode: "monotone"
        }, {
            label: "Blocked DNS Queries",
            fill: true,
            backgroundColor: "rgba(0,192,239,0.5)",
            borderColor: "rgba(0,192,239,1)",
            pointBorderColor: "rgba(0,192,239,1)",
            pointRadius: 1,
            pointHoverRadius: 5,
            data: [],
            pointHitRadius: 5,
            cubicInterpolationMode: "monotone"
        }]
    };
    const timelineChartOptions = {
        tooltips: {
            enabled: true,
            mode: "x-axis",
            callbacks: {
                title: function(tooltipItem, data) {
                    var label = tooltipItem[0].xLabel;
                    var time = label.match(/(\d?\d):?(\d?\d?)/);
                    var h = parseInt(time[1], 10);
                    var m = parseInt(time[2], 10) || 0;
                    var from = padNumber(h) + ":" + padNumber(m) + ":00";
                    var to = padNumber(h) + ":" + padNumber(m + 9) + ":59";
                    return "Queries from " + from + " to " + to;
                },
                label: function(tooltipItems, data) {
                    if (tooltipItems.datasetIndex === 1) {
                        var percentage = 0.0;
                        var total = parseInt(data.datasets[0].data[tooltipItems.index]);
                        var blocked = parseInt(data.datasets[1].data[tooltipItems.index]);
                        if (total > 0) {
                            percentage = 100.0 * blocked / total;
                        }
                        return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.yLabel + " (" + percentage.toFixed(1) + "%)";
                    } else {
                        return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.yLabel;
                    }
                }
            }
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                type: "time",
                time: {
                    unit: "hour",
                    displayFormats: {
                        hour: "HH:mm"
                    },
                    tooltipFormat: "HH:mm"
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        maintainAspectRatio: false
    };
    const timelineChartConfig = {
        type: "line",
        data: timelineChartData,
        options: timelineChartOptions
    };

    //WHY IS IT SO HARD FOR YOU JAVASCRIPT ?????
    const sortNumberAsc = function(a, b) {
        return a - b;
    }
    qTU.pollData = function() {
        $.getJSON("/api/data?overTimeData10mins", function(data) {
                // Remove possibly already existing data
                tableData = data;
                qTU.updateTable();
            })
            .done(function() {
                // Reload graph after 10 minutes
                failures = 0;
                setTimeout(qTU.pollData, 600000);
            })
            .fail(function() {
                failures++;
                if (failures < 5) {
                    // Try again after 1 minute only if this has not failed more
                    // than five times in a row
                    setTimeout(qTU.pollData, 60000);
                }
            });
    };
    qTU.updateTable = function() {
        timeLineChart.data.labels = [];
        timeLineChart.data.datasets[0].data = [];
        timeLineChart.data.datasets[1].data = [];
        // get all keys of ads datapoints
        var adsKeys = Object.keys(tableData.ads_over_time)
            .map(Number)
            .sort(sortNumberAsc);
        // get all keys of domain datapoints
        var domainKeys = Object.keys(tableData.domains_over_time)
            .map(Number)
            .sort(sortNumberAsc);
        // get the largest datapoint key
        var largest = Math.max(adsKeys[adsKeys.length - 1], domainKeys[domainKeys.length - 1]);
        // get the smallest datapoint key
        var smallest = Math.min(adsKeys[0], domainKeys[0]);
        // Add data for each hour that is available
        for (var timeInterval = smallest; timeInterval <= largest; timeInterval++) {
            var h = timeInterval;
            var d = new Date()
                .setHours(Math.floor(h / 6), 10 * (h % 6), 0, 0);
            timeLineChart.data.labels.push(d);
            timeLineChart.data.datasets[0].data.push((timeInterval in tableData.domains_over_time) ? tableData.domains_over_time[timeInterval] : 0);
            timeLineChart.data.datasets[1].data.push((timeInterval in tableData.ads_over_time) ? tableData.ads_over_time[timeInterval] : 0);
        }
        $("#queries-over-time .overlay")
            .remove();
        timeLineChart.update();
    };
    callbacks.socketUpdate = function(data) {
        //update chart
        var timestamp = new Date(data.timestamp);
        var hour = timestamp.getHours();
        var minute = timestamp.getMinutes();
        var timestampIdx = (minute - minute % 10) / 10 + 6 * hour;
        if (data.type === "block") {
            if (timestampIdx in tableData.ads_over_time) {
                tableData.ads_over_time[timestampIdx]++;
            } else {
                tableData.ads_over_time[timestampIdx] = 1;
            }
        }
        if (timestampIdx in tableData.domains_over_time) {
            tableData.domains_over_time[timestampIdx]++;
        } else {
            tableData.domains_over_time[timestampIdx] = 1;
        }
        qTU.updateTable();
    };
    callbacks.onClickTimeline = function(evt) {
        var activePoints = timeLineChart.getElementAtEvent(evt);
        if (activePoints.length > 0) {
            //get the internal index of slice in pie chart
            var clickedElementindex = activePoints[0]["_index"];
            //get specific label by index
            var label = timeLineChart.data.labels[clickedElementindex];
            //get value by index
            //var value = timeLineChart.data.datasets[0].data[clickedElementindex];
            var time = new Date(label);
            var from = time.getHours() + ":" + time.getMinutes();
            var until = time.getHours() + ":" + padNumber(parseInt(time.getMinutes() + 9), 2);
            window.location.href = "queries.php?from=" + from + "&until=" + until;
        }
        return false;
    };
    qTU.subscribeSocket = function() {
        taillogWatcher
            .on("dns", callbacks.socketUpdate);
    };
    qTU.unsubscribeSocket = function() {
        taillogWatcher
            .off("dns", callbacks.socketUpdate);
    };
    qTU.start = function() {
        var ctx = document.getElementById("queryOverTimeChart")
            .getContext("2d");
        timeLineChart = new Chart(ctx, timelineChartConfig);
        // Click handler for the chart
        $("#queryOverTimeChart")
            .click(callbacks.onClickTimeline);
        // Poll initial data
        qTU.pollData();
        // attach live updater
        qTU.subscribeSocket();
    }
}(queryTimelineUpdater));

function updateQueryTypes() {
    $.getJSON("/api/data?getQueryTypes", function(data) {
        var colors = [];
        // Get colors from AdminLTE
        $.each($.AdminLTE.options.colors, function(key, value) {
            colors.push(value);
        });
        var v = [],
            c = [];
        // Collect values and colors, immediately push individual labels
        $.each(data, function(key, value) {
            v.push(value);
            c.push(colors.shift());
            queryTypeChart.data.labels.push(key.substr(6, key.length - 7));
        });
        // Build a single dataset with the data to be pushed
        var dd = {
            data: v,
            backgroundColor: c
        };
        // and push it at once
        queryTypeChart.data.datasets.push(dd);
        $("#query-types .overlay")
            .remove();
        queryTypeChart.update();
        queryTypeChart.chart.config.options.cutoutPercentage = 30;
        queryTypeChart.update();
    });
}

// Credit: http://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript/4835406#4835406
function escapeHtml(text) {
    var map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "\'": "&#039;"
    };
    return text.replace(/[&<>"']/g, function(m) {
        return map[m];
    });
}

function updateTopClientsChart() {
    $.getJSON("/api/data?summaryRaw&getQuerySources", function(data) {
        var clienttable = $("#client-frequency")
            .find("tbody:last");
        var domain,
            percentage,
            domainname;
        for (domain in data.top_sources) {
            if ({}
                .hasOwnProperty.call(data.top_sources, domain)) {
                // Sanitize domain
                domain = escapeHtml(domain);
                if (domain.indexOf("|") > -1) {
                    domainname = domain.substr(0, domain.indexOf("|"));
                } else {
                    domainname = domain;
                }
                var url = "<a href=\"queries.php?client=" + domain + "\">" + domainname + "</a>";
                percentage = data.top_sources[domain] / data.dns_queries_today * 100;
                clienttable.append("<tr> <td>" + url +
                    "</td> <td>" + data.top_sources[domain] + "</td> <td> <div class=\"progress progress-sm\" title=\"" + percentage.toFixed(1) + "%\"> <div class=\"progress-bar progress-bar-blue\" style=\"width: " +
                    percentage + "%\"></div> </div> </td> </tr> ");
            }
        }
        $("#client-frequency .overlay")
            .remove();
    });
}

var forwardDestinationUpdater = {};
(function(fDU) {
    fDU.poll = function() {
        $.getJSON("/api/data?getForwardDestinations", function(data) {
            var colors = [];
            // Get colors from AdminLTE
            $.each($.AdminLTE.options.colors, function(key, value) {
                colors.push(value);
            });
            var v = [],
                c = [];
            // Collect values and colors, immediately push individual labels
            $.each(data, function(key, value) {
                v.push(value);
                c.push(colors.shift());
                if (key.indexOf("|") > -1) {
                    key = key.substr(0, key.indexOf("|"));
                }
                forwardDestinationChart.data.labels.push(key);
            });
            // Build a single dataset with the data to be pushed
            var dd = {
                data: v,
                backgroundColor: c
            };
            // and push it at once
            forwardDestinationChart.data.datasets.push(dd);
            $("#forward-destinations .overlay")
                .remove();
            forwardDestinationChart.update();
            forwardDestinationChart.chart.config.options.cutoutPercentage = 30;
            forwardDestinationChart.update();
        });
    };
}(forwardDestinationUpdater));

function updateTopLists() {
    $.getJSON("/api/data?summaryRaw&topItems", function(data) {
        var domaintable = $("#domain-frequency")
            .find("tbody:last");
        var adtable = $("#ad-frequency")
            .find("tbody:last");
        var url,
            domain,
            percentage;
        for (domain in data.topQueries) {
            if ({}
                .hasOwnProperty.call(data.topQueries, domain)) {
                // Sanitize domain
                domain = escapeHtml(domain);
                if (domain !== "pi.hole") {
                    url = "<a href=\"queries.php?domain=" + domain + "\">" + domain + "</a>";
                } else {
                    url = domain;
                }
                percentage = data.topQueries[domain] / data.dns_queries_today * 100;
                domaintable.append("<tr> <td>" + url +
                    "</td> <td>" + data.topQueries[domain] + "</td> <td> <div class=\"progress progress-sm\" title=\"" + percentage.toFixed(1) + "%\"> <div class=\"progress-bar progress-bar-green\" style=\"width: " +
                    percentage + "%\"></div> </div> </td> </tr> ");
            }
        }
        // Remove table if there are no results (e.g. privacy mode enabled)
        if (jQuery.isEmptyObject(data.topQueries)) {
            $("#domain-frequency")
                .parent()
                .remove();
        }
        for (domain in data.top_ads) {
            if ({}
                .hasOwnProperty.call(data.top_ads, domain)) {
                // Sanitize domain
                domain = escapeHtml(domain);
                url = "<a href=\"queries.php?domain=" + domain + "\">" + domain + "</a>";
                percentage = data.top_ads[domain] / data.ads_blocked_today * 100;
                adtable.append("<tr> <td>" + url +
                    "</td> <td>" + data.top_ads[domain] + "</td> <td> <div class=\"progress progress-sm\" title=\"" + percentage.toFixed(1) + "%\"> <div class=\"progress-bar progress-bar-yellow\" style=\"width: " +
                    percentage + "%\"></div> </div> </td> </tr> ");
            }
        }
        $("#domain-frequency .overlay")
            .remove();
        $("#ad-frequency .overlay")
            .remove();
    });
}

$(document)
    .ready(function() {
        var isMobile = {
            Windows: function() {
                return /IEMobile/i.test(navigator.userAgent);
            },
            Android: function() {
                return /Android/i.test(navigator.userAgent);
            },
            BlackBerry: function() {
                return /BlackBerry/i.test(navigator.userAgent);
            },
            iOS: function() {
                return /iPhone|iPad|iPod/i.test(navigator.userAgent);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
            }
        };
        // Pull in data via AJAX
        summaryUpdater.start();
        queryTimelineUpdater.start();
        // Create / load "Query Types" only if authorized
        if (document.getElementById("queryTypeChart")) {
            ctx = document.getElementById("queryTypeChart")
                .getContext("2d");
            queryTypeChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: [],
                    datasets: [{
                        data: []
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    animation: {
                        duration: 2000
                    },
                    cutoutPercentage: 0
                }
            });
            updateQueryTypes();
        }
        // Create / load "Forward Destinations" only if authorized
        if (document.getElementById("forwardDestinationChart")) {
            ctx = document.getElementById("forwardDestinationChart")
                .getContext("2d");
            forwardDestinationChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: [],
                    datasets: [{
                        data: []
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    animation: {
                        duration: 2000
                    },
                    cutoutPercentage: 0
                }
            });
            forwardDestinationUpdater.poll();
        }
        // Create / load "Top Domains" and "Top Advertisers" only if authorized
        if (document.getElementById("domain-frequency") &&
            document.getElementById("ad-frequency")) {
            updateTopLists();
        }
        // Create / load "Top Clients" only if authorized
        if (document.getElementById("client-frequency")) {
            updateTopClientsChart();
        }
    });
