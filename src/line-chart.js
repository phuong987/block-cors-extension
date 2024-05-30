let lineChart;
let lineChartPointsDOJI = [], lineChartPointsSJC = [];
function newLineChart() {
    lineChart = new CanvasJS.StockChart("lineChartContainer",{
        theme: "light2",
        exportEnabled: true,
        title:{text:"Line Chart"},
        subtitles: [{text: "Gold Price (in VND)"}],
        charts: [
            {
                axisX: {
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true
                    }
                },
                axisY: {
                    stripLines: [
                        {
                            value: lineChartPointsPNJ.at(-1).y,
                            lineDashType: "dot",
                            label: lineChartPointsPNJ.at(-1).y.toLocaleString(),
                            color: "#6c78ac",
                            labelAlign: "near",
                            labelPlacement: "outside",
                            labelFontColor: "white",
                            labelBackgroundColor: "#6c78ac"
                        },
                        {
                            value: lineChartPointsSJC.at(-1).y,
                            lineDashType: "dot",
                            label: lineChartPointsSJC.at(-1).y.toLocaleString(),
                            color: "#52cda0",
                            labelAlign: "near",
                            labelPlacement: "outside",
                            labelFontColor: "white",
                            labelBackgroundColor: "#52cda0"
                        },
                        {
                            value: lineChartPointsDOJI.at(-1).y,
                            lineDashType: "dot",
                            label: lineChartPointsDOJI.at(-1).y.toLocaleString(),
                            color: "#e07a70",
                            labelAlign: "near",
                            labelPlacement: "outside",
                            labelFontColor: "white",
                            labelBackgroundColor: "#e07a70"
                        }
                    ]
                    //prefix: "VND "
                },
                toolTip: {
                    shared: true,
                    enabled: true,
                    content: "<span style='\"'color: {color};'\"'>{x}<br/>{name}: {y}<br/>{detail}</span>"
                },
                legend: {
                    cursor: "pointer",
                    verticalAlign: "top",
                    horizontalAlign: "center",
                    dockInsidePlotArea: true,
                    itemclick: toggleDataSeries
                },
                data: [
                    {
                        type:"line",
                        color: "#6c78ac",
                        //axisYType: "secondary",
                        name: "Gap PNJ",
                        showInLegend: false,
                        markerSize: 0,
                        yValueFormatString: "#,###.## VND",
                        dataPoints: lineChartPointsPNJ
                    },
                    {
                        type:"line",
                        color: "#52cda0",
                        //axisYType: "secondary",
                        name: "Gap SJC",
                        showInLegend: false,
                        markerSize: 0,
                        yValueFormatString: "#,###.## VND",
                        dataPoints: lineChartPointsSJC
                    },
                    {
                        type:"line",
                        color: "#e07a70",
                        //axisYType: "secondary",
                        name: "Gap DOJI",
                        showInLegend: false,
                        markerSize: 0,
                        yValueFormatString: "#,###.## VND",
                        dataPoints: lineChartPointsDOJI
                    }
                ]
            }
        ],
        navigator: {
            data: [{
                dataPoints: lineChartPointsPNJ
            }],
            slider: {
                minimum: new Date(2023, 1, 1),
                maximum: new Date()
            }
        }
    });
}

function toggleDataSeries(e){
    e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible);
    lineChart.render();
}