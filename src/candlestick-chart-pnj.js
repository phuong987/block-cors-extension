let risingColor = "#089981";
let fallingColor = "red";
let today = new Date ();
let startDate = new Date("2023-01-01T00:00:00.000+07:00");
let mul = 1000000;

let csChartPointsPNJ = [], csNavigatePointsPNJ = [], csScaleBreakPointsPNJ = [];
let candlestickChartPNJ;
let lineChartPointsPNJ = [];

window.addEventListener('load', async () => {
    await initDB().then(async () => {
        let dataStored = await loadData();
        if (dataStored.length === 0) {
            await updateDataForDateRange(startDate, today);
        } else {
            let newestDate = new Date(dataStored[dataStored.length - 1].date + "T00:00:00.000+07:00");
            await updateDataForDateRange(newestDate, today);
        }

        await loadData().then(async data => {
            initCandlestickDataPNJ(data, mul, csChartPointsPNJ, csNavigatePointsPNJ, csScaleBreakPointsPNJ);
            initLineData(await (await fetch("./data/data-doji.json")).json(), lineChartPointsDOJI, 1000);
            initLineData(await (await fetch("./data/data-sjc.json")).json(), lineChartPointsSJC, 1000);
        });
    });

    candlestickChartPNJ = new CanvasJS.StockChart("candlestickChartPNJContainer", {
        theme: "light2",
        exportEnabled: true,
        title: {text: "Candlestick Chart"},
        subtitles: [{text: "PNJ Gold Price (in VND)"}],
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
                        customBreaks: csScaleBreakPointsPNJ
                    }
                },
                axisY: {
                    stripLines: [
                        {
                            value: csChartPointsPNJ.at(-1).y[3],
                            lineDashType: "dot",
                            label: csChartPointsPNJ.at(-1).y[3].toLocaleString(),
                            color: csChartPointsPNJ.at(-1).color,
                            labelAlign: "near", // Aligns the label to the left
                            labelPlacement: "outside", // Places the label outside the plot area
                            labelFontColor: "white",
                            labelBackgroundColor: csChartPointsPNJ.at(-1).color
                        }
                    ]
                    //prefix: "VND "
                },
                data: [{
                    type: "candlestick",
                    yValueFormatString: "#,###.## VND",
                    risingColor: risingColor,
                    fallingColor: fallingColor,
                    dataPoints: csChartPointsPNJ
                }]
            }
        ],
        navigator: {
            data: [{
                dataPoints: csNavigatePointsPNJ
            }],
            slider: {
                minimum: new Date(2023, 1, 1),
                maximum: new Date()
            }
        }
    });

    candlestickChartPNJ.render();
    newLineChart();
    lineChart.render();

    // chrome.runtime.getPackageDirectoryEntry(function(root) {
    //     root.getFile('./data/data.json', {}, function(fileEntry) {
    //         fileEntry.file(function(file) {
    //             let reader = new FileReader();
    //             reader.onloadend = function(e) {
    //                 let content = this.result;
    //             };
    //             reader.readAsText(file);
    //         });
    //     });
    // });

    // window.webkitRequestFileSystem(window.PERSISTENT, 1024*1024, onInitFs, errorHandler);
})

let initCandlestickDataPNJ = (data, mul, chartPointsData, navigatePointsData, scaleBreakPoints) => {
    let newestDate = 0;
    let previousClose = null;

    for (const element of data) {
        let open = previousClose !== null ? previousClose : element.low;

        chartPointsData.push({
            x: new Date(element.date + "T00:00:00.000+07:00"),
            y: [
                Number(open * mul),
                Number(element.high * mul),
                Number(element.low * mul),
                Number(element.close * mul)
            ],
            color: open <= element.close ? risingColor : fallingColor
        });
        navigatePointsData.push({
            x: new Date(element.date + "T00:00:00.000+07:00"),
            y: Number(element.close)
        });
        previousClose = element.close;

        initLineDataPNJ(element, open <= element.close, mul);

        if (newestDate === 0) {
            newestDate = element.date;
            continue;
        }

        let dateDiff = (new Date(element.date) - new Date(newestDate)) / (3600000 * 24);
        if (dateDiff > 1) {
            let startDate = new Date(newestDate + "T00:00:00.000+07:00");
            startDate.setDate(startDate.getDate() + 1);
            let endDate = new Date(newestDate + "T23:59:59.999+07:00");
            endDate.setDate(endDate.getDate() + dateDiff - 1);
            scaleBreakPoints.push({
                startValue: startDate,
                endValue: endDate
            })
        }
        newestDate = element.date;
    }
}

let initLineDataPNJ = (element, isRising, mul) => {
    let additional = element.additional;
    let getMax = isRising;
    let gapMax, gapMin;
    let detail = "";

    for (const change of additional) {
        let gap = change.sell - change.buy;
        if (gapMax === undefined) {
            gapMax = gap;
            gapMin = gap;
        } else {
            if (gapMax < gap) {
                gapMax = gap;
            }
            if (gapMin > gap) {
                gapMin = gap;
            }
        }

        detail += "&nbsp;&nbsp;&nbsp;" + (gap * mul).toLocaleString() + " " + change.timestamp.split(" ")[1] + "<br/>";
    }
    if (getMax) {
        lineChartPointsPNJ.push({
            x: new Date(element.date + "T00:00:00.000+07:00"),
            y: gapMax * mul,
            detail: detail.slice(0, detail.length - 5)
        });
    } else {
        lineChartPointsPNJ.push({
            x: new Date(element.date + "T00:00:00.000+07:00"),
            y: gapMin * mul,
            detail: detail.slice(0, detail.length - 5)
        });
    }
}

async function updateDataForDateRange(startDate, endDate) {
    let dateList = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
        dateList.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const batchSize = 50;

    for (let i = 0; i < dateList.length; i += batchSize) {
        const batch = dateList.slice(i, i + batchSize);

        const fetchPromises = batch.map(date => {
            let [day, month, year] = date.toLocaleDateString().split("/");
            let formattedDate = `${year}-${month}-${day}`;
            return getData(formattedDate);
        });

        const results = await Promise.all(fetchPromises);
        const validResults = results.filter(data => data !== null);

        validResults.sort((a, b) => new Date(a.date) - new Date(b.date));
        for (let i = 0; i < validResults.length; i++) {
            if (i === 0) {
                await overwriteData(validResults[i]);
            } else {
                await addOrUpdateData(validResults[i], null);
            }
        }
    }
}

async function getData(date) {
    const [year, month, day] = date.split('-');
    const url = `https://giavang.pnj.com.vn/history?gold_history_day=${day}&gold_history_month=${month}&gold_history_year=${year}`;
    const htmlRegex = /TPHCM <\/th> <\/tr> <\/thead>.*?PNJ<\/td> (.*?) <tr> <td valign="middle" align="center" rowspan="[0-9]+">SJC/;
    const valueRegex = /<td valign="middle" align="center">(.*?)<\/td>/g;
    let high, low , close;
    let additional = [];

    await fetch(url).then(response => response.text())
        .then(html => {
            let priceHtml = html.match(htmlRegex);
            if (priceHtml === null) return;
            const value = Array.from(priceHtml[1].matchAll(valueRegex)).map(match => match[1]);
            high = parseFloat(value[1]); low = parseFloat(value[1]); close = parseFloat(value[value.length - 2]);

            for (let i = 1; i < value.length; i += 3) {
                if (high < parseFloat(value[i])) {
                    high = parseFloat(value[i]);
                }
                if (low > parseFloat(value[i])) {
                    low = parseFloat(value[i]);
                }
                additional.push({
                    buy: parseFloat(value[i-1]),
                    sell: parseFloat(value[i]),
                    timestamp: value[i+1]
                })
            }
        }).catch(error => {
            console.error('Error:', error);
        });

    if (high === undefined) return null;

    return {
        date: date,
        high: high,
        low: low,
        close: close,
        additional: additional
    };
}