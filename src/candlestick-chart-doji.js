let csChartPointsDOJI = [], csNavigatePointsDOJI = [], csScaleBreakPointsDOJI = [];
let candlestickChartDOJI;
window.addEventListener('load', async () => {
    initCandlestickData(await (await fetch("./data/data-doji.json")).json(),
        1000, csChartPointsDOJI, csNavigatePointsDOJI, csScaleBreakPointsDOJI);

    candlestickChartDOJI = new CanvasJS.StockChart("candlestickChartDOJIContainer", {
        theme: "light2",
        exportEnabled: true,
        title: {text: "Candlestick Chart"},
        subtitles: [{text: "DOJI Gold Price (in VND)"}],
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
                        customBreaks: csScaleBreakPointsDOJI
                    }
                },
                axisY: {
                    stripLines: [
                        {
                            value: csChartPointsDOJI.at(-1).y[3],
                            lineDashType: "dot",
                            label: csChartPointsDOJI.at(-1).y[3].toLocaleString(),
                            color: csChartPointsDOJI.at(-1).color,
                            labelAlign: "near",
                            labelPlacement: "outside",
                            labelFontColor: "white",
                            labelBackgroundColor: csChartPointsDOJI.at(-1).color
                        }
                    ]
                    //prefix: "VND "
                },
                toolTip: {
                    shared: true,
                    enabled: true,
                    content: "<span style='\"'color: {color};'\"'>{x}" +
                        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{change}%</span><br/>" +
                        "Open:&nbsp;&nbsp;{y[0]}<br/>" +
                        "High:&nbsp;&nbsp;&nbsp;{y[1]}<br/>" +
                        "Low:&nbsp;&nbsp;&nbsp;&nbsp;{y[2]}<br/>" +
                        "Close:&nbsp;&nbsp;{y[3]}<br/>"
                },
                data: [{
                    type: "candlestick",
                    yValueFormatString: "#,###.## VND",
                    risingColor: risingColor,
                    fallingColor: fallingColor,
                    dataPoints: csChartPointsDOJI
                }]
            }
        ],
        navigator: {
            data: [{
                dataPoints: csNavigatePointsDOJI
            }],
            slider: {
                minimum: new Date(2023, 1, 1),
                maximum: new Date()
            }
        }
    });

    candlestickChartDOJI.render();
})