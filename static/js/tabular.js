var data = [];
var highlight = [];
var selected = [];
var datatype, datatype_x, datatype_y;
var attribute, attribute_x, attribute_y;
var cal_data = {};
var range = 12;
var cellSize = 10;

var cal = new CalHeatMap();;
generate_heatmap();

const fileInput = document.getElementById("real-file");
fileInput.addEventListener('change', () => {
for(var i = 0; i < fileInput.files.length; i++){
  Papa.parse(fileInput.files[i], {
    download: true,
    keepEmptyRows: false,
    skipEmptyLines: true,
    step: function(row) {
      data.push(row.data);
    },
    complete: function(results) {
      console.log(data);
      read_dropdown();
      cal_data = {};
      iterate();
      cal = cal.destroy();
      generate_heatmap();
      generate_scatterplot();
    }
  });
}
});

document.getElementById("datatype").addEventListener('change', function() {
  read_dropdown();
  cal_data = {};
  iterate();
  cal = cal.destroy();
  generate_heatmap();
});

document.getElementById("attribute").addEventListener('change', function() {
  read_dropdown();
  cal_data = {};
  iterate();
  cal = cal.destroy();
  generate_heatmap();
});

const resetBtn = document.getElementById("reset-button");
resetBtn.addEventListener("click", function() {
  data = [];
  cal_data = {};
  iterate();
  cal = cal.destroy();
  generate_heatmap();
});

const resetSelectionBtn = document.getElementById("reset-selection-button");
resetSelectionBtn.addEventListener("click", function() {
  highlight = [];
  selected = [];
  cal = cal.destroy();
  generate_heatmap();
});

function read_dropdown() {
  datatype = document.getElementById("datatype").value;
  attribute = document.getElementById("attribute").value;
}

function iterate() {
  var i, j;
  var k=0;
  while(k<data.length)
  {
    for (i=k; i<data.length; i++) {
      if(data[i][0] === datatype) {
        break;
      }
    }
    if(i>=data.length) {
      break;
    }
    i++;

    for (j=0; j<data[i].length; j++) {
      if(data[i][j] === attribute) {
        break;
      }
    }
    i++;

    while(data[i][0] !== "") {
      var date = data[i][0];
      var datearray = date.split("-");
      date = datearray[1] + '-' + datearray[0] + '-' + datearray[2];
      var unixDate = new Date(date).getTime() / 1000
      
      cal_data[unixDate] = parseFloat(data[i][j].replace(/,/g, ''));
      i++;
    }
    
    k=i+1;
  }
  
  console.log(JSON.stringify(cal_data));

}

function generate_heatmap() {
  cal = new CalHeatMap();
	cal.init({
    data: cal_data,
	start: new Date(2021, 0, 1),
	id : "graph_c",
	domain : "month",			// Group data by month
	subDomain : "day",			// Split each month by days
	range : range,					// Just display number of months
  cellSize: cellSize,
	previousSelector: "#previous-button",
	nextSelector: "#next-button",
  highlight: highlight,
  legend: [20, 40, 60, 80], 	// Custom threshold for the scale
  onClick: function(date, nb) {
    if (document.querySelector('#range-select:checked') !== null) {
      var startDate = document.getElementById("start-date");
      var endDate = document.getElementById("end-date");
      
      if (startDate.innerHTML == "-select-") {
        startDate.innerHTML = date.toLocaleString("en-US", {day: "numeric"}).concat("-", date.toLocaleString("en-US", {month: "numeric"}), "-", date.toLocaleString("en-US", {year: "numeric"}));
      } else if (endDate.innerHTML == "-select-") {
        endDate.innerHTML = date.toLocaleString("en-US", {day: "numeric"}).concat("-", date.toLocaleString("en-US", {month: "numeric"}), "-", date.toLocaleString("en-US", {year: "numeric"}));
      }
      
    } else {
      var clicked = new Date(date.toLocaleString("en-US", {year: "numeric"}), date.toLocaleString("en-US", {month: "numeric"})-1, date.toLocaleString("en-US", {day: "numeric"}))    

      if(!!highlight.find(item => {return item.getTime() == clicked.getTime()})) {
        highlight.splice(highlight.map(Number).indexOf(+clicked), 1)
      } else {
        highlight.push(clicked);
      }
      
      console.log(highlight);
      cal = cal.destroy();
      generate_heatmap();
    }

  }
  });
}

function changeCalDisplay() {
  var checkBox = document.getElementById("cal-display-type");
  var displayText = document.getElementById("cal-display-type-text");

  if(displayText.innerHTML == "Year View"){
    displayText.innerHTML = "Month View";
  } else {
    displayText.innerHTML = "Year View";
  }
  
  if (checkBox.checked == true){
    range = 3;
    cellSize = 13;
  } else {
    range = 12;
    cellSize = 10;
  }
  cal = cal.destroy();
  generate_heatmap();
}

function rangeSelect() {
  if (document.querySelector('#range-select:checked') == null) {
    var startDate = document.getElementById("start-date");
    var endDate = document.getElementById("end-date");

    startDate.innerHTML = "-select-";
    endDate.innerHTML = "-select-";
  }
}

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function highlightSelected() {
  var startDate = document.getElementById("start-date").innerHTML.split("-");
  var endDate = document.getElementById("end-date").innerHTML.split("-");
  var currentDate = new Date(startDate[2], startDate[1]-1, startDate[0]);
  var stopDate = new Date(endDate[2], endDate[1]-1, endDate[0]);
  while (currentDate <= stopDate) {
    if(!highlight.find(item => {return item.getTime() == currentDate.getTime()})) {
      highlight.push(currentDate);
    }
    currentDate = currentDate.addDays(1);
  }

  console.log(highlight);
  cal = cal.destroy();
  generate_heatmap();

  var startDate = document.getElementById("start-date");
  var endDate = document.getElementById("end-date");

  startDate.innerHTML = "-select-";
  endDate.innerHTML = "-select-";
}

/*------------------*/

// /*
// ####################################
// ########## CREATE DATASET ##########
// ####################################

// define a javascript object to hold our dataset
var dataset = {
  // points will be x,y coordinates
  points: [],
  numPoints: 25,
  color: "green",
  radius: 3,
  minX: 0,
  maxX: 500,
  minY: 0,
  maxY: 1000
}

function read_scatter_dropdown() {
  var xDropdown = document.getElementById("myList_1").value.split("-");
  datatype_x = xDropdown[0];
  attribute_x = xDropdown[1];
  var yDropdown = document.getElementById("myList_2").value.split("-");
  datatype_y = yDropdown[0];
  attribute_y = yDropdown[1];
}

function iterate_scatter(datatype, attribute) {
  var i, j;
  var k=0;
  var axis_array = [];
  while(k<data.length)
  {
    for (i=k; i<data.length; i++) {
      if(data[i][0] === datatype) {
        break;
      }
    }
    if(i>=data.length) {
      break;
    }
    i++;

    for (j=0; j<data[i].length; j++) {
      if(data[i][j] === attribute) {
        break;
      }
    }
    i++;

    while(data[i][0] !== "") {
      var index = parseFloat(data[i][j].replace(/,/g, ''));
      axis_array.push(index);
      i++;
    }
    
    k=i+1;
  }

  return axis_array;

}

function generateScatterPoints(dataset, x_array, y_array) {
  dataset.points = [];

  var xValues = Array.from({
      length: dataset.numPoints
    }, () => Math.random() *
    dataset.maxX + dataset.minX);

  var yValues = Array.from({
      length: dataset.numPoints
    }, () => Math.random() *
    dataset.maxY + dataset.minY);

  for (var i = 0; i < x_array.length; i++) {
    dataset.points.push({
      x: x_array[i],
      y: y_array[i]
    })
  }
}

document.getElementById("myList_1").addEventListener('change', function() {
  generate_scatterplot();
});

document.getElementById("myList_2").addEventListener('change', function() {
  generate_scatterplot();
});

function generate_scatterplot() {
  read_scatter_dropdown();
  var x_array = iterate_scatter(datatype_x, attribute_x);
  var y_array = iterate_scatter(datatype_y, attribute_y);
  generateScatterPoints(dataset, x_array, y_array);
  updateChart();  
}

// define a function to randomly generate data for our scatterplot
var generateRandomPoints = function(dataset) {
  // datapoints should take the format { x: value, y: value }
  dataset.points = [];
  // shorthand way to randomly generate an array of values
  // Array.from({length: $n}, () => Math.random() * $upperBound + $lowerBound);
  // math.random generates a random num between 0 and 1

  var xValues = Array.from({
      length: dataset.numPoints
    }, () => Math.random() *
    dataset.maxX + dataset.minX);

  var yValues = Array.from({
      length: dataset.numPoints
    }, () => Math.random() *
    dataset.maxY + dataset.minY);

  for (var i = 0; i < xValues.length; i++) {
    dataset.points.push({
      x: xValues[i],
      y: yValues[i]
    })
  }
}

// run the function to actually generate our x,y coordianates 
generateRandomPoints(dataset);

// /*
// ########################################################################
// ##### This is where D3 gets extremely dense with function chaining #####
// ########################################################################


// ####################################
// ######### DEFINE D3 SCALES #########
// ####################################

// Define SVG size and padding (extra white space to prevent overlap).
var width = 600;
var height = 250;
var padding = { // buffer used to prevent chart element overlap
  top: 20,
  right: 25,
  bottom: 30,
  left: 60
}

// D3 scales are used to translate your numerical data into svg space

// define scales
var xScale = d3.scale.linear()                    // predefined d3 function to create scale
  .domain([dataset.minX, dataset.maxX])           // domain defines the coordinate system of your data
  .range([padding.left, width - padding.right]);  // range defines the coordinate system of your svg

var yScale = d3.scale.linear()
  .domain([dataset.minY, dataset.maxY])
  .range([height - padding.bottom, padding.top]); // notice that the larger value is the first listed 
                                                  // in the yScale range. 

// define axis behavior in D3
var xAxis = d3.svg.axis()                         // the d3 axis object
  .scale(xScale)                                  // set the scale to what we just defined
  .orient("bottom")                               // orient tick direction
  .ticks(5);                                      // try to do 5 ticks. Won't always be this many

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left')
  .ticks(5);
// /*

// ####################################
// ######## BUILD SVG USING D3 ########
// ####################################

// Use D3 to insert an SVG element into our HTML document
var svg = d3.select('#scatterplot')     // grab the <div> tag which has the id #svgcontainer
  .append('svg')                      // append an <svg> tag into this container
  .attr('width', width)               // set the svg's width attribute
  .attr('height', height);            // set the svg's height attribute

// /*
// actually insert x axis into html
svg.append('g')                               // new group element
  .attr('class', 'xAxis')                     // give it the css class 'xAxis'
  .attr('transform', 'translate' +
    '(0,' + (height - padding.bottom) + ')')  // translate the axis to the bottom of the svg
  .call(xAxis);                               // refer to axis variables to define scale behavior


svg.append('g')
  .attr('class', 'yAxis')
  .attr('transform', 'translate(' + padding.left + ',' + 0 + ')')
  .call(yAxis);

// /*
// ####################################
// ######### Helper Functions #########
// ####################################

// event handlers for interactivity
var handleMouseOver = function(d, i) {
  // Use D3 to select element, change color and size
    d3.select(this).attr({
      fill: "orange",
      r: dataset.radius * 2
    }).attr('stroke', "black").attr('stroke-width', "1px");

    // Specify where to put label of text
    svg.append("text").attr({
       id: "t" + Math.round(d.x) + "-" + Math.round(d.y) + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
        x: function() { return xScale(d.x) - 30; },
        y: function() { return yScale(d.y) - 15; },
    })
    
    .text(function() {
      return [Math.round(d.x), Math.round(d.y)];  // Value of the text
    });
}

var handleMouseOut = function(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this).attr({
    fill: dataset.color,
    r: dataset.radius
  }).attr('stroke', "none");

  // Select text by id and then remove
  d3.select("#t" + Math.round(d.x) + "-" + Math.round(d.y) + "-" + i).remove();  // Remove text location
}

// define a function to do the plotting to avoid code redundancy
var updateChart = function() {
  // Update scale domains. 
  // redefining the x and y minimums and maximums 
  xScale.domain([
    d3.min(dataset.points, function(d) {  // return minimum x value
      return d.x;
    }),                                   
    d3.max(dataset.points, function(d) { // return maximum x value
      return d.x;
    })
  ]);
  yScale.domain([
    d3.min(dataset.points, function(d) {  // return minimum y value
      return d.y;
    }),
    d3.max(dataset.points, function(d) {  // return maximum y value
      return d.y;
    })
  ]);

  // here's the d3 magic
  // this basically primes the svg to do stuff with <circle> tags

  // d3 does inventory and figures out how many <circle> tags currently exist in svg.
  var d3Circles = svg.selectAll('circle')
    .data(dataset.points);  // rebind dataset.points just in case it's been updated

  // if there aren't enough circle tags, .enter().append() creates new ones for the data points
  d3Circles.enter().append('circle')
    .attr('cx', function(d) {
      return xScale(0);           // initialize circle at origin 
    }).attr('cy', function(d) {
      return yScale(0);           // initialize circle at origin
    })
    .on("mouseover", handleMouseOver) // bind mouse-over event to each circle
    .on("mouseout", handleMouseOut);  // bind mouse-off event to each circle
    
  // exit().remove() will trash extra circles for us if we have too many
  d3Circles.exit()                // get svg elements we need to remove
    .transition()                 // default transition
    .attr('cx', function(d) {
      return xScale(0);           // initialize circle at origin 
    }).attr('cy', function(d) {
      return yScale(0);           // initialize circle at origin
    }).remove()                   // get rid of em
    

  // update circle locations, both new and old with fancy transitions 
  d3Circles
    .attr('fill', dataset.color)    // make dots purple by default
    
    // bind quick transition to visually indicate dots are going to change
    .transition()                   // start transition
    .duration(250)                  // 250 ms
    .ease('linear')                 // one type of 'transition acceleration'. linear
    .attr('r', dataset.radius / 2)  // make radius smaller
    .attr('fill', "gray")           // make dots gray by default
    
    
    // move the points using a different transition
    .transition()                   // start transition
    .duration(1500)                 // 1.5 seconds
    .ease('bounce')                 // bounce 'transition acceleration'.
    .attr('cx', function(d) {
      return xScale(d.x);           // move circle to new x coordinates 
    }).attr('cy', function(d) {
      return yScale(d.y);           // move circle to new y coordinates
    })
    
    // finish up by transitioning circles back to original color and size
    .transition()
    .duration(250)
    .ease('elastic')
    .attr('r', dataset.radius)
    .attr('fill', dataset.color)
    
  // update axes to represent new values
  svg.select('.xAxis')
    .transition()
    .duration(1000)
    .call(xAxis);

  svg.select('.yAxis')
    .transition()
    .duration(1000)
    .call(yAxis);
}

// run updateChart to plot initial set of points
updateChart();                    

