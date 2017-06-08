mainApp.controller("revenueCtrl", function ($scope, Dialog) {
    var s = $scope;
    var dialogSvc = new Dialog();

    s.selData = undefined;
    s.selIdx = -1;
    s.showSalesRevenueChart = true;

    var currDate = new Date();
    var currYear = currDate.getFullYear();
    var currMonth = currDate.getMonth();

    var monthStart = new Date(currYear, currMonth, 1);
    var monthEnd = new Date(currYear, currMonth + 1, 0);

    console.log(monthStart);
    console.log(monthEnd);

    s.dailySalesFromDate = monthStart;
    s.dailySalesToDate = monthEnd;

    s.years = [];
    s.selectedYear = currYear;
    for (let x = 2000; x < currYear + 2; x++) {
        s.years.push(x);
    }

    s.changeYear = (year) => {
        s.selectedYear = year;
        drawLineChart();
    }

    s.edit = (ev) => {
        if (!s.selData) return;
        dialogSvc.showDialog("editSalesRevCtrl", s, "contents/revenue/edit-sales-revenue.html", false, "parent", ev).then(function (res) {
            if (res) {
                s.gbl.selectedStore.Revenue[s.selIdx] = res;
                drawLineChart();
            }
        });
    }

    s.add = (ev) => {
        s.newHeader = "Add Sales Revenue";
        dialogSvc.showDialog("addSalesRevCtrl", s, "contents/revenue/add-sales-revenue.html", false, "parent", ev).then(function (res) {
            if (res) {

            }
        });
    }

    s.searchDailySales = () => {

    }

    var colors = ["green", "red", "blue"];
    s.getColor = (idx) => {
        return { 'background': colors[idx] };
    }

    var areaChartOptions = {
        showScale: true,
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        scaleShowHorizontalLines: true,
        scaleShowVerticalLines: true,
        bezierCurve: false,
        bezierCurveTension: 0.3,
        pointDot: true,
        pointDotRadius: 3,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true,
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++)" +
        "{%><li><div class=\"legend\" style=\"background-color:<%=datasets[i].fillColor%>\"></div><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        maintainAspectRatio: true,
        responsive: true,
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        }
    };

    var drawLineChart = () => {
        var datas = [];
        if (s.gbl.selectedStore) {
            s.selData = s.gbl.selectedStore.Revenue.find(obj => obj.Year.toString() === s.selectedYear.toString());
            s.selIdx = s.gbl.selectedStore.Revenue.indexOf(s.selData);

            if (s.selData) {
                s.selData.Data.forEach((obj, idx) => {
                    var d = {
                        label: obj.Description,
                        fillColor: colors[idx],
                        strokeColor: colors[idx],
                        pointColor: colors[idx],
                        pointStrokeColor: colors[idx],
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: colors[idx],
                        data: [obj.January, obj.February, obj.March,
                        obj.April, obj.May, obj.June, obj.July,
                        obj.August, obj.September, obj.October,
                        obj.November, obj.December]
                    }
                    datas.push(d);
                });
            }
        }


        var areaChartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: datas
        };


        //-------------
        //- LINE CHART -
        //--------------
        s.showSalesRevenueChart = false;
        setTimeout(() => {
            s.showSalesRevenueChart = true;
            s.$digest();
            var lc = $("#lineChart").get(0);
            if (lc) {
                var lineChartCanvas = lc.getContext("2d");
                var lineChart = new Chart(lineChartCanvas);
                var lineChartOptions = areaChartOptions;
                lineChartOptions.datasetFill = false;
                var newChart = lineChart.Line(areaChartData, lineChartOptions);
            }
            //document.getElementById('legendDiv').innerHTML = newChart.generateLegend();
        }, 10);
    }

    s.searchDailySales = (fromD, toD) => {
        // s.dailySalesFromDate = fromD;
        // s.dailySalesToDate = toD;

        drawDailySalesLineChart();
    }

    var drawDailySalesLineChart = () => {
        var dailySales = [];
        var datas = [];
        var labels = []
        if (s.gbl.selectedStore) {
            s.gbl.selectedStore.DailySales.forEach((obj, idx) => {
                var d = new Date(obj.Date)
                var newd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                if (newd >= s.dailySalesFromDate && newd <= s.dailySalesToDate) {
                    dailySales.push(obj);
                }
            });

            if (dailySales) {
                var data = [];
                dailySales.forEach((obj, idx) => {
                    data.push(obj.TotalSales);
                    var ndate = new Date(obj.Date);
                    ndate = ndate.toString().substr(4, 6).replace(' ', '-');
                    labels.push(ndate);
                });


                var d = {
                    label: "Testing",
                    fillColor: colors[0],
                    strokeColor: colors[0],
                    pointColor: colors[0],
                    pointStrokeColor: colors[0],
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: colors[0],
                    data: data
                }
                datas.push(d);

            }
        }


        var areaChartData = {
            labels: labels,
            datasets: datas
        };


        //-------------
        //- LINE CHART -
        //--------------
        s.showSalesRevenueChart = false;
        setTimeout(() => {
            s.showSalesRevenueChart = true;
            s.$digest();

            var srlc = $("#salesRevLineChart").get(0);
            if (srlc) {
                var lineChartCanvas = srlc.getContext("2d");
                var lineChart = new Chart(lineChartCanvas);
                var lineChartOptions = areaChartOptions;
                lineChartOptions.datasetFill = false;
                lineChart.Line(areaChartData, lineChartOptions);
            }
            //document.getElementById('legendDiv').innerHTML = newChart.generateLegend();
        }, 10);
    }

    drawLineChart();
    drawDailySalesLineChart();
});