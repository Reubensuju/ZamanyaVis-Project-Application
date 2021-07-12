var data = [];    //array that holds the file contents line by line
var highlight = [];    //array that has the points to be highlighted in Cal-Heatmap
var datatype, datatype_x, datatype_y;   //values of the dropdowns
var attribute, attribute_x, attribute_y;    //values of the dropdowns
var cal_data = {};    //data for the Cal-Heatmap
var scatter_data = [];    //data for the Scatterplot
var date_array = [];    //array that holds all dates in order
var range = 12;   //month range for the Cal-Heatmap
var cellSize = 10;    //cellSize for the Cal-Heatmap
var startDate = "-select-", endDate = "-select-";   //values for the RangeSelection
var leg1=20, leg2=40, leg3=60, leg4=80;   //dynamic legend of the Cal-Heatmap
var dataTable = [];   //DataTable that has all values for the tSNE projection
var tsnePROJ = [];    //tsnePROJ array values

//generate empty heatmap
var cal = new CalHeatMap();;
generate_heatmap();

//Parser that reads all the uploaded files at once
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
    complete: function(results) {   //funtion on completion of the data parsing
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

//execute when the datatype dropdown changes
document.getElementById("datatype").addEventListener('change', function() {
  read_dropdown();
  cal_data = {};
  iterate();
  cal = cal.destroy();
  generate_heatmap();
});

//execute when the attribute dropdown changes
document.getElementById("attribute").addEventListener('change', function() {
  read_dropdown();
  cal_data = {};
  iterate();
  cal = cal.destroy();
  generate_heatmap();
});

//execute when the reset button is clicked
const resetBtn = document.getElementById("reset-button");
resetBtn.addEventListener("click", function() {
  data = [];
  cal_data = {};
  iterate();
  cal = cal.destroy();
  generate_heatmap();
  resetSelection();
  scatter_data = [];
  create_scatter();
});

//function when resetSelection button is clicked
function resetSelection() {
  highlight = [];
  cal = cal.destroy();
  generate_heatmap();

  document.getElementById("range-select").checked = false;
  rangeSelect();

  var chart = $('#scatterplot').highcharts();
  var points = chart.getSelectedPoints();
  if (points.length > 0) {
      Highcharts.each(points, function (point) {
          point.select(false);
      });
  }
}

//function that reads the dropdown of datatype and attribute
function read_dropdown() {
  datatype = document.getElementById("datatype").value;
  attribute = document.getElementById("attribute").value;
}

//function that iterates through the data array in search of values for Cal-Heatmap
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

  //Creating the legend range dynamically
  var obj = Object.keys(cal_data).map(function(key) { return cal_data[key];});
  var min = Math.min.apply( null, obj );
  var max = Math.max.apply( null, obj );
  leg1 = ((max - min)*1)/5 + min;
  leg2 = ((max - min)*2)/5 + min;
  leg3 = ((max - min)*3)/5 + min;
  leg4 = ((max - min)*4)/5 + min;
  
  console.log(JSON.stringify(cal_data));

}

//function to generate the heatmap
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
  animationDuration: 0,
	previousSelector: "#previous-button",
	nextSelector: "#next-button",
  highlight: highlight,
  legend: [leg1, leg2, leg3, leg4], 	// Custom threshold for the scale
  label: {
		width: 210
	},
  onClick: function(date, nb) {   //function when cell is clicked on Cal-Heatmap
    if (document.querySelector('#range-select:checked') !== null) {
      
      if (startDate == "-select-") {
        startDate = date.toLocaleString("en-US", {day: "numeric"}).concat("-", date.toLocaleString("en-US", {month: "numeric"}), "-", date.toLocaleString("en-US", {year: "numeric"}));
        
        var clicked = new Date(date.toLocaleString("en-US", {year: "numeric"}), date.toLocaleString("en-US", {month: "numeric"})-1, date.toLocaleString("en-US", {day: "numeric"}))    

        if(!highlight.find(item => {return item.getTime() == clicked.getTime()})) {
          highlight.push(clicked);
        }

        console.log(highlight);
        cal = cal.destroy();
        generate_heatmap();

      } else if (endDate == "-select-") {
        endDate = date.toLocaleString("en-US", {day: "numeric"}).concat("-", date.toLocaleString("en-US", {month: "numeric"}), "-", date.toLocaleString("en-US", {year: "numeric"}));

        highlightSelected();
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

      highlightScatter(date.toLocaleString("en-US", {day: "numeric"}).concat("-",date.toLocaleString("en-US", {month: "numeric"}), "-", date.toLocaleString("en-US", {year: "numeric"})).replace(/\b\d\b/g, '0$&'));
    }

  }
  });
}

//function to changeCalDisplay between month view and year view
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
    cellSize = 15;
  } else {
    range = 12;
    cellSize = 10;
  }
  cal = cal.destroy();
  generate_heatmap();
}

//function to execute when rangeselect is clicked
function rangeSelect() {
  if (document.querySelector('#range-select:checked') == null) {

    startDate = "-select-";
    endDate = "-select-";
  }
}

//to add 1 day to a date object
Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

//function to highlight the selected range as well as highlight coresponding points in Scatterplot
function highlightSelected() {
  var start = startDate.split("-");
  var end = endDate.split("-");
  var currentDate = new Date(start[2], start[1]-1, start[0]);
  var stopDate = new Date(end[2], end[1]-1, end[0]);
  while (currentDate <= stopDate) {
    if(!highlight.find(item => {return item.getTime() == currentDate.getTime()})) {
      highlight.push(currentDate);
    }

    highlightScatter(currentDate.toLocaleString("en-US", {day: "numeric"}).concat("-",currentDate.toLocaleString("en-US", {month: "numeric"}), "-", currentDate.toLocaleString("en-US", {year: "numeric"})).replace(/\b\d\b/g, '0$&'));
    
    currentDate = currentDate.addDays(1);
  }

  console.log(highlight);
  cal = cal.destroy();
  generate_heatmap();

  startDate = "-select-";
  endDate = "-select-";
}

/*------------------*/

//function to read the scatterplot dropdowns
function read_scatter_dropdown() {
  var xDropdown = document.getElementById("myList_1").value.split("-");
  datatype_x = xDropdown[0];
  attribute_x = xDropdown[1];
  var yDropdown = document.getElementById("myList_2").value.split("-");
  datatype_y = yDropdown[0];
  attribute_y = yDropdown[1];
}

//function that iterates through the data array in search of values for Scatterplot
function iterate_scatter(datatype, attribute) {
  var i, j;
  var k=0;
  var axis_array = [];
  date_array = [];
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
      var date = data[i][0];
      date_array.push(date);
      i++;
    }
    
    k=i+1;
  }
  
  return axis_array;

}

//function that merges the x and y axix values to create Scatterpoints
function generateScatterPoints(x_array, y_array) {
  scatter_data = [];
  for (var i = 0; i < x_array.length; i++) {
    scatter_data[i] = [x_array[i], y_array[i]];
  }
}

//execute when the myList_1 dropdown changes
document.getElementById("myList_1").addEventListener('change', function() {
  generate_scatterplot();
  resetSelection();
  document.getElementById("tsne-select").checked = false;
});

//execute when the myList_2 dropdown changes
document.getElementById("myList_2").addEventListener('change', function() {
  generate_scatterplot();
  resetSelection();
  document.getElementById("tsne-select").checked = false;
});

//function to generate the scatterplot
function generate_scatterplot() {
  read_scatter_dropdown();
  var x_array = iterate_scatter(datatype_x, attribute_x);
  var y_array = iterate_scatter(datatype_y, attribute_y);
  generateScatterPoints(x_array, y_array);
  create_scatter();  
}



/**
 * Custom selection handler that selects points and cancels the default zoom behaviour
 */
 function selectPointsByDrag(e) {

  // Select points
  Highcharts.each(this.series, function (series) {
      Highcharts.each(series.points, function (point) {
          if (point.x >= e.xAxis[0].min && point.x <= e.xAxis[0].max &&
                  point.y >= e.yAxis[0].min && point.y <= e.yAxis[0].max) {
              point.select(true, true);
          }
      });
  });

  var points = this.getSelectedPoints();
  console.log(points);
  for (var i = 0; i < points.length; i++) {
    var date = date_array[points[i].index].split("-");
    var currentDate = new Date(date[2], date[1]-1, date[0]);
    highlight.push(currentDate);
  }
  cal = cal.destroy();
  generate_heatmap();

  return false; // Don't zoom
}

/**
* On click, unselect all points
*/
function unselectByClick() {
  var points = this.getSelectedPoints();
  if (points.length > 0) {
      Highcharts.each(points, function (point) {
          point.select(false);
      });
  }
}

//function to highlight the point in the scatterplot
function highlightScatter(selected) {
  var chart = $('#scatterplot').highcharts();
  var points = chart.series[0].data;

  for (var i = 0; i < date_array.length; i++) {
    if(date_array[i] === selected) {
      break;
    }
  }
  if (i < date_array.length)
  {
    points[i].select(true, true);;
  }
}

//function to create the Scatterplot
function create_scatter() {
Highcharts.chart('scatterplot', {

  title: {
      text: null
  },

  chart: {
      type: 'scatter',
      events: {
          selection: selectPointsByDrag,
          /*click: unselectByClick*/
      },
      zoomType: 'xy'
  },

  series: [{
      data: scatter_data,
      allowPointSelect: false,
      showInLegend: false
  }]
});

var xDropdown = document.getElementById("myList_1").value;
var yDropdown = document.getElementById("myList_2").value;

var chart = $('#scatterplot').highcharts();
chart.xAxis[0].setTitle({ text: xDropdown });
chart.yAxis[0].setTitle({ text: yDropdown });
}

create_scatter();

/*    TSNE GENERATION   */

//function to generate the tSNE on the Scatterplot
function tsneGenerate() {
  if (document.querySelector('#tsne-select:checked') == null) {
    generate_scatterplot();
  } else {
    iterate_tsne();
    tsneDraw();
    scatter_data = tsnePROJ;
    create_scatter();
    resetSelection();

    var chart = $('#scatterplot').highcharts();
    chart.xAxis[0].setTitle({ text: "Values" });
    chart.yAxis[0].setTitle({ text: "Values" });
  }
}

//function to create the tSNE dataTable of values
function iterate_tsne() {
  var i, j;
  var k=0, l=0;
  dataTable = [];
  while(k<data.length)
  {
    for (i=k; i<data.length; i++) {
      if(!isNaN(parseInt(data[i][0]))) {
        break;
      }
    }
    if(i>=data.length) {
      break;
    }

    while(data[i][0] !== "") {
      for (l=0; l<dataTable.length; l++) {
        if (dataTable[l][0] == data[i][0]) {
          break;
        }
      }
      if(l===dataTable.length) {
        dataTable.push(data[i].filter(item => item));
      } else {
        for (j=1; j<data[i].length; j++) {
          if (data[i][j] !== "") {
            dataTable[l].push(data[i][j].replace(/,/g, ''));
          }
        }
      }
      i++;
    }
    
    k=i+1;
  }
  for (var i = 0; i < dataTable.length; i++) {
    dataTable[i] = dataTable[i].slice(1);
  }
  for (var i = 0; i < dataTable.length; i++) {
    dataTable[i] = dataTable[i].map((i) => Number(i));
  }
  
}

//function to get the tSNE parameters from the dataTable
function tsneDraw() {
  // ################################################################
  //tsne -similarity  // length of data table 
  // dataTable //contains the data
  // ################################################################
  
  var opt = { epsilon: 10 }; // epsilon is learning rate (10 = default)
  var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

  console.log(dataTable);
  tsne.initDataRaw(dataTable);

  for (var k = 0; k < 500; k++) {
    tsne.step(); // every time you call this, solution gets better
  }

  tsnePROJ = tsne.getSolution(); // Y is an array of 2-D points that you can plot
  console.log(tsnePROJ);
}