let csChartPointsSJC = [], csNavigatePointsSJC = [], csScaleBreakPointsSJC = [];
let candlestickChartSJC;
window.addEventListener('load', async () => {
    initCandlestickData(await (await fetch("./data/data-sjc.json")).json(),
        1000, csChartPointsSJC, csNavigatePointsSJC, csScaleBreakPointsSJC);

    candlestickChartSJC = new CanvasJS.StockChart("candlestickChartSJCContainer", {
        theme: "light2",
        exportEnabled: true,
        title: {text: "Candlestick Chart"},
        subtitles: [{text: "SJC Gold Price (in VND)"}],
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
                        customBreaks: csScaleBreakPointsSJC
                    }
                },
                axisY: {
                    stripLines: [
                        {
                            value: csChartPointsSJC.at(-1).y[3],
                            lineDashType: "dot",
                            label: csChartPointsSJC.at(-1).y[3].toLocaleString(),
                            color: csChartPointsSJC.at(-1).color,
                            labelAlign: "near",
                            labelPlacement: "outside",
                            labelFontColor: "white",
                            labelBackgroundColor: csChartPointsSJC.at(-1).color
                        }
                    ]
                    //prefix: "VND "
                },
                data: [{
                    type: "candlestick",
                    yValueFormatString: "#,###.## VND",
                    risingColor: risingColor,
                    fallingColor: fallingColor,
                    dataPoints: csChartPointsSJC
                }]
            }
        ],
        navigator: {
            data: [{
                dataPoints: csNavigatePointsSJC
            }],
            slider: {
                minimum: new Date(2023, 1, 1),
                maximum: new Date()
            }
        }
    });

    candlestickChartSJC.render();
})