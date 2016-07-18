// set the dimensions of the canvas
var margin = { top: 20, right: 20, bottom: 70, left: 40 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], .09);

var y = d3.scale.linear().range([height, 0]);

// define the axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);


// add the SVG element
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


// load the data
d3.json("jsonData/data3.json", function(error, data) {

    data.forEach(function(d) {
        d.Country = d.Country;
        d["Life expectancy at birth, total (years)"] = +d["Life expectancy at birth, total (years)"];
    });

    // scale the range of the data
    x.domain(data.map(function(d) {
        return d.Country; }));
    y.domain([4140, d3.max(data, function(d) {
        return d["Life expectancy at birth, total (years)"]; })]);

    // add axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-60)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Life expectancy at birth, total (years)");


    // Add bar chart

    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("height", 0)
        .attr("y", height)
        .transition().duration(3000)
        .delay(function(d, i) {
            return i * 20; })
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.Country); })
        /*.attr("width", x.rangeBand())*/
        .attr("width", Math.min(x.rangeBand() - 2, 90))
        .attr("y", function(d) {
            return y(d["Life expectancy at birth, total (years)"]); })
        .attr("height", function(d) {
            return height - y(d["Life expectancy at birth, total (years)"]); })
        .style("fill", function(d, i) {
            return 'rgb(20,20, ' + ((i * 30) + 100) + ')' });


});
