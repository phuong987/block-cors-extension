let initCandlestickData = (data, mul, chartPointsData, navigatePointsData, scaleBreakPoints) => {
    let newestDrawnTime = null;
    let previousClose = null;
    let currentTime = null, currentHigh = null, currentLow = null;

    for (let i = 0; i < data.length; i++) {
        let element = data[i];
        currentTime = currentTime !== null ? currentTime : element.time;
        previousClose = previousClose !== null ? previousClose : element.sell;
        currentHigh = currentHigh === null ? element.sell :
            currentHigh < element.sell ? element.sell : currentHigh;
        currentLow = currentLow === null ? element.sell :
            currentLow > element.sell ? element.sell : currentLow;

        if (i === data.length - 1 || !data[i+1].time.includes(currentTime.split(' ')[0])) {
            let currentDateString = getDateFromTimestamp(currentTime);
            let change = ((element.sell - previousClose) * 100 / previousClose);
            change = change < 0 ? change.toFixed(2).replace("-","–") : "+" + change.toFixed(2);

            chartPointsData.push({
                x: new Date(currentDateString + "T00:00:00.000+07:00"),
                y: [
                    Number(previousClose * mul),
                    Number(currentHigh * mul),
                    Number(currentLow * mul),
                    Number(element.sell * mul)
                ],
                change: change,
                color: previousClose <= element.sell ? risingColor : fallingColor
            });
            navigatePointsData.push({
                x: new Date(currentDateString + "T00:00:00.000+07:00"),
                y: Number(element.sell)
            });
            previousClose = element.sell;

            if (newestDrawnTime === null) {
                newestDrawnTime = currentTime;
            }

            let newestDateString = getDateFromTimestamp(newestDrawnTime);
            let dateDiff = (new Date(currentDateString) - new Date(newestDateString)) / (3600000 * 24);

            if (dateDiff > 1) {
                let startDate = new Date(newestDateString + "T00:00:00.000+07:00");
                startDate.setDate(startDate.getDate() + 1);
                let endDate = new Date(newestDateString + "T23:59:59.999+07:00");
                endDate.setDate(endDate.getDate() + dateDiff - 1);
                scaleBreakPoints.push({
                    startValue: startDate,
                    endValue: endDate
                })
            }

            newestDrawnTime = currentTime;
            currentTime = currentHigh = currentLow = null;
        }
    }
}

// PNJ usually sells higher SJC just a little bit, but gap always higher 100-250K
// So with the same money, buy gold from SJC then sell will lose less than 100-250K
function initLineData(data, lineChartPoints, mul) {
    for (const element of data) {
        let sellPrice = element.sell * mul;
        let buyPrice = element.buy * mul;
        let gap = sellPrice - buyPrice;
        lineChartPoints.push({
            x: newDateFromTimestamp(element.time),
            y: gap,
            detail: "Sell: " + sellPrice.toLocaleString() +"<br/>" + "Buy: " + buyPrice.toLocaleString()
        });
    }
}

function newDateFromTimestamp(dateString) {
    let [datePart, timePart] = dateString.split(' ');
    let [day, month, year] = datePart.split('-').map(Number);
    let [hours, minutes] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes);
}

function getDateFromTimestamp(dateString) {
    let [datePart, ] = dateString.split(' ');
    let [day, month, year] = datePart.split('-');

    return `${year}-${month}-${day}`;
}