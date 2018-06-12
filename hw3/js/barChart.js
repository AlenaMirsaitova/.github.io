class BarChart {

    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
        this.exist = false;
    }

    updateBarChart(selectedDimension) {
        if (!this.exist) {
            var barchart = d3.select('#barChart');
            var dataSlice, min, max;
            dataSlice = this.allData.map(function(item) {return item[selectedDimension]})
            min = d3.min(dataSlice);
            max = d3.max(dataSlice);
            var xScale = d3.scaleBand().domain(this.allData.map(function(item) { return item.year })).range([50, 450])
            var yScale = d3.scaleLinear().domain([min, max]).range([350, 10]);
            var colorScale = d3.scaleLinear().domain([min, max]).range(["LightBlue", "DarkBlue"]);
            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);
            barchart.append('g').attr('class', 'yaxis').attr('transform', 'translate(50, 0)').call(yAxis);
            barchart.append('g').attr('class', 'xaxis').attr('transform', 'translate(0, 350)')
            .call(xAxis).selectAll('text').attr('x', 8).attr('y', -4).attr('transform','rotate(90)').style("text-anchor", "start");

            // Create the bars (hint: use #bars)
            var bars = barchart.append('g').attr('class', 'rectangles').selectAll('rect').data(this.allData)
            var xOffset = 51.5,
            xMul = 20,
            barW = 17,
            barH = 350;

            bars.enter().append('rect')
                    .attr('x', function(d, i) { return i * xMul + xOffset})
                    .attr('width', barW)
                    .style('fill', function (d) { return colorScale(d[selectedDimension]); })
                    .attr('id', function(d) { return d.year })
                    .attr('y', function(d) { return yScale(d[selectedDimension])} )
                    .attr('height', function(d) {  return barH - yScale(d[selectedDimension]); })
            this.exist = true;
        } else {
            barchart = d3.select('#barChart');
            dataSlice = this.allData.map(function(item) {return item[selectedDimension]})
            min = d3.min(dataSlice);
            max = d3.max(dataSlice);
            barH = 350;
            var duration = 800;
            colorScale = d3.scaleLinear().domain([min, max]).range(["LightBlue", "DarkBlue"]);
            yScale = d3.scaleLinear().domain([min, max]).range([barH, 10]);
            yAxis = d3.axisLeft(yScale);
            bars = barchart.append('g').attr('class', 'rectangles').selectAll('rect').data(this.allData)
            xOffset = 51.5,
            xMul = 20,
            barW = 17,
            barH = 350;

            bars.enter().append('rect')
                    .attr('x', function(d, i) { return i * xMul + xOffset})
                    .attr('width', barW)
                    .style('fill', function (d) { return colorScale(d[selectedDimension]); })
                    .attr('id', function(d) { return d.year })
                    .attr('y', function(d) { return yScale(d[selectedDimension])} )
                    .attr('height', function(d) {  return barH - yScale(d[selectedDimension]); })

            barchart.select('.yaxis').transition().duration(duration).call(yAxis);
            barchart.selectAll('rect').transition().duration(duration)
                .attr('y', function(d) { return yScale(d[selectedDimension])} )
                .attr('height', function(d) {  return barH - yScale(d[selectedDimension]); });
            }
        var allYears = this.allData.map(function(item) { return item.year })
        var selectedRect = -1;
        var allDataCopy = this.allData;
        var worldMapCopy = this.worldMap;
        var infoPanelCopy = this.infoPanel;
        barchart.selectAll('rect')
        .on('click', function(d) {
            if (selectedRect.year != this.id) {
                barchart.selectAll('rect')
                .style('fill', function (d) {return colorScale(d[selectedDimension])});
                d3.select(this).style('fill', '#d20a11');
                selectedRect = this;
                var dataSlice = allDataCopy[allYears.indexOf(+this.id)]
                worldMapCopy.updateMap(dataSlice);
                infoPanelCopy.updateInfo(dataSlice);
            }
        });
    }
}