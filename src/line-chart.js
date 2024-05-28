let lineChart;
window.addEventListener('load', () => {
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
                    },
                    scaleBreaks: {
                        type: "straight",
                        lineThickness: 0,
                        spacing: 0,
                        customBreaks: sb
                    }
                },
                axisY: {
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
                        //axisYType: "secondary",
                        name: "Gap PNJ",
                        showInLegend: false,
                        markerSize: 0,
                        yValueFormatString: "#,###.## VND",
                        dataPoints: dps3
                    },
                    {
                        type:"line",
                        //axisYType: "secondary",
                        name: "Gap SJC",
                        showInLegend: false,
                        markerSize: 0,
                        yValueFormatString: "#,###.## VND",
                        dataPoints: dps4
                    },
                    {
                        type:"line",
                        //axisYType: "secondary",
                        name: "Gap DOJI",
                        showInLegend: false,
                        markerSize: 0,
                        yValueFormatString: "#,###.## VND",
                        dataPoints: dps5
                    }
                ]
            }
        ],
        navigator: {
            data: [{
                dataPoints: dps2
            }],
            slider: {
                minimum: new Date(2023, 1, 1),
                maximum: new Date()
            }
        }
    });
})

function toggleDataSeries(e){
    e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible);
    lineChart.render();
}