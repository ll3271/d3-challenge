// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 800;

var margin = {
  top: 20,
  right: 40,
  bottom: 20,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Import Data
d3.csv("data.csv").then(function(journal_data, err) {

  if (err) throw err;

  // Step 1: Parse Data/Cast as numbers
   // ==============================
  journal_data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear().range([0, width]);
  var yLinearScale = d3.scaleLinear().range([height, 20]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xMin = d3.min(journal_data, function(data) {
      return data.healthcare;
  });

  var xMax = d3.max(journal_data, function(data) {
      return data.healthcare;
  });

  var yMin = d3.min(journal_data, function(data) {
      return data.poverty;
  });

  var yMax = d3.max(journal_data, function(data) {
      return data.poverty;
  });


  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .classed("active", true)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(journal_data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.healthcare + 2.1))
  .attr("cy", d => yLinearScale(d.poverty + 0.8))
  .attr("r", 18)
  .attr("fill", "blue")
  .attr("opacity", ".5")
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([70, -70])
    .html(function(d) {
      // x key
      var theX;
      // Grab the state name.
      var theState = "<div>" + d.state + "</div>";
      // Snatch the y value's key and value.
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      // If the x key is poverty
      if (curX === "poverty") {
        // Grab the x key and a version of the value formatted to show percentage
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        // Otherwise
        // Grab the x key and a version of the value formatted to include commas after every third digit.
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }

      // Display what we capture.
      return theState + theX + theY;
    });

     
  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })

    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

    // Create axes labels
  chartGroup.append("text")
  .style("font-size", "20px")
  .selectAll("tspan")
  .data(journal_data)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.healthcare +1.8);
      })
      .attr("y", function(data) {
          return yLinearScale(data.poverty +.6);
      })
      .text(function(data) {
          return data.abbr
      });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 50)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("% Without Healthcare");

    chartGroup.append("text")
    .attr("x", 0 - margin.top + 400)
    .attr("dy", "1em")
    .attr("transform",`translate(${0},${height - 20})`)
    .attr("class", "axisText")
    .text("% In Poverty");

  // chartGroup.append("text")
  //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
  //   .attr("class", "axisText")
  //   .text("% In Poverty");
  });
