class Info {
    constructor() {
        console.log('IP CREATED');
    }

    updateInfo(oneWorldCup) {
        console.log('IN INFO PANEL')
        d3.select('#teams').selectAll('li').remove();
        var teamNames = oneWorldCup.TEAM_NAMES.split(',');
        d3.select('#teams').selectAll('li').data(teamNames)
        .enter().append('li').html(function(d) { return d })

        d3.select('#edition').html(oneWorldCup.EDITION);
        d3.select('#host').html(oneWorldCup.host);
        d3.select('#winner').html(oneWorldCup.winner);
        d3.select('#silver').html(oneWorldCup.runner_up);
    }
}

class WorldMap {
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);
    }

    clearMap() {
        d3.select('#map').selectAll('circle').remove();
        d3.selectAll('.team:not(#tleg)').attr('class', 'countries');
        d3.select('.host:not(#hleg)').attr('class', 'countries');
    }

    updateMap(worldcupData) {
        this.clearMap();
        var rad = 4;
        var winCoor = this.projection([worldcupData.WIN_LON,worldcupData.WIN_LAT]);
        var ruCoor = this.projection([worldcupData.RUP_LON,worldcupData.RUP_LAT])
        d3.select('#map').append("circle").attr("r",rad).attr('class', 'gold')
        .attr("transform", function() {return "translate(" + winCoor + ")";});
        d3.select('#map').append("circle").attr("r",rad).attr('class', 'silver')
        .attr("transform", function() {return "translate(" + ruCoor + ")";});
        for (var i = 0; i < worldcupData.teams_iso.length; i++) {
            d3.select('#' + worldcupData.teams_iso[i]).attr('class', 'team'); 
        }
        d3.select('#' + worldcupData.host_country_code).attr('class', 'host')
    }

    drawMap(world) {
        var mmap = topojson.feature(world, world.objects.countries).features;
        var path = d3.geoPath().projection(this.projection);
        var gridlines = d3.geoGraticule();
        d3.select('#map').selectAll("path").data(mmap).enter()
            .append('path')
            .attr('d', path)
            .attr('id', function(d) { return d.id })
            .attr('class', 'countries');
        d3.select('#map').append('path').datum(gridlines).attr('d', path).attr('class', 'grat');
    }
}

d3.csv("data/fifa-world-cup.csv", function (error, allData) {
    allData.forEach(function (d) {
        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        // Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;
    });

    /* Create infoPanel, barChart and Map objects  */
    let infoPanel = new Info();
    let worldMap = new WorldMap();

    /* DATA LOADING */
    //Load in json data to make map
    d3.json("data/world.json", function (error, world) {
        if (error) throw error;
        worldMap.drawMap(world);
    });

    // Define this as a global variable
    window.barChart = new BarChart(worldMap, infoPanel, allData);

    // Draw the Bar chart for the first time
    barChart.updateBarChart('attendance');
});

function chooseData() {
    selectedDimension = d3.select('#dataset').node().value;
    barChart.updateBarChart(selectedDimension);
}
