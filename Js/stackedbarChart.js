
var margin = {top: 20, right: 20, bottom: 50, left: 70},

width = 1000 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
.rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
.rangeRound([height, 100]);

var color = d3.scale.ordinal()
.range(["#ff3333 ", "#ff8080 "]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json ("jsonData/data1.json", function (error, data) {

color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

data.forEach(function(d) {
var y0 = 0;
d.concent = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
d.total = d.concent[d.concent.length - 1].y1;
});

x.domain(data.map(function(d) { return d.Year; }));
y.domain([0, d3.max(data, function(d) { return d.total; })]);

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis)
.selectAll("text")
.style("text-anchor", "end")
.attr("dx", "-.8em")
.attr("dy", "-.55em")
.attr("transform", "rotate(-90)");

svg.append("g")
.attr("class", "y axis")
.call(yAxis)
.append("text")
.attr("transform", "rotate(-90)")
.attr("y",-50)
.attr("x",-130)
.attr("dy", ".71em")
.style("text-anchor", "end")
.style("font-size","20px")
.text("Life expectancy at birth, female/male (years)");


var key = svg.selectAll(".key")
.data(data)
.enter().append("g")
.attr("class", "g")
.attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; });

key.selectAll("rect")
.data(function(d) { return d.concent; })
.enter().append("rect")
.attr("width", x.rangeBand())
.attr("y", function(d) { return y(d.y1); })
.attr("height", function(d) { return y(d.y0) - y(d.y1); })
.style("fill", function(d) { return color(d.name); });

var legend = svg.selectAll(".legend")
   .data(color.domain().slice().reverse())
   .enter().append("g")
   .attr("class", "legend")
   .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

   legend.append("rect")
   .attr("x", width - 18)
   .attr("width", 18)
   .attr("height", 18)
   .style("fill", color);

   legend.append("text")
   .attr("x", width - 24)
   .attr("y", 9)
   .attr("dy", ".35em")
   .style("text-anchor", "end")
   .text(function(d) { return d; });



});
