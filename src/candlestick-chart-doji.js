let csChartPointsDOJI = [], csNavigatePointsDOJI = [], csScaleBreakPointsDOJI = [];
let candlestickChartDOJI;
window.addEventListener('load', async () => {
    candlestickChartDOJI = new CanvasJS.StockChart("candlestickChartDOJIContainer", {
        theme: "light2",
        exportEnabled: true,
        title: {},
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
                    //prefix: "VND "
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

    initCandlestickData(await (await fetch("./data/data-doji.json")).json(),
        1000, csChartPointsDOJI, csNavigatePointsDOJI, csScaleBreakPointsDOJI);
    candlestickChartDOJI.render();
})