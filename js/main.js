var data = [4,8,15,16,23,42];

var body = d3.select("body");
var div = body.append("div");
div.html("Hello, D3 world!");

// d3.select(".chart")
//  .selectAll("div")
//      .data(data)
//  .enter().append("div")
//      .style("width",function(d) { return d * 10 + "px";})
//      .text(function(d) {return d;});

// var width = $(".chart").width();
// var x = d3.scale.linear()
//  .domain([0, d3.max(data)])
//  .range([0,width]);
// d3.select(".chart")
//   .selectAll("div")
//     .data(data)
//   .enter().append("div")
//     .style("width", function(d) { return x(d) + "px"; })
//     .text(function(d) { return d; });

// var data = [4, 8, 15, 16, 23, 42];


/*Bar chart tutorial*/
// var margin = {top:20, right: 30, bottom: 30, left: 40};
// var rawHeight = 500 ;
// var rawWidth = $(".chart").width();
// var height = rawHeight - margin.top - margin.bottom;
// var width = rawWidth - margin.left - margin.right;

// var y = d3.scale.linear()
//     .range([height, 0]);

// var x = d3.scale.ordinal()
//     .rangeRoundBands([0, width],.1);


// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left")
//     .ticks(10, "%");
        
// var chart = d3.select(".chart")
//     .attr("width", rawWidth)
//     .attr("height",rawHeight)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.tsv("data.txt", type, function(error,data) {
//     x.domain(data.map(function(d) {return d.name;}));
//     y.domain([0, d3.max(data,function(d) { return d.value; })]);
//     var barWidth = width / data.length;
    

//       chart.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);

//       chart.append("g")
//           .attr("class", "y axis")
//           .call(yAxis)
//         .append("text")
//           .attr("transform", "rotate(-90)")
//           .attr("y", 6)
//           .attr("dy", ".71em")
//           .style("text-anchor", "end")
//           .text("Frequency");

//       chart.selectAll(".bar")
//           .data(data)
//         .enter().append("rect")
//           .attr("class", "bar")
//           .attr("x", function(d) { return x(d.name); })
//           .attr("y", function(d) { return y(d.value); })
//           .attr("height", function(d) { return height - y(d.value); })
//           .attr("width", x.rangeBand());
// });

// function type(d) {
//     d.value = +d.value; //force to a number
//     return d;
// }

var circle = svg.selectAll("circle");
