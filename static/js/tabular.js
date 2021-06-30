var data = [];
var highlight = [];
var selected = [];
var datatype;
var attribute;
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

  document.getElementById("range-select").checked = false;
  rangeSelect();
}

/*------------------*/
