var data = [];
var datatype;
var attribute;
var cal_data = {};
var range = 12;
var cellSize = 10;

var cal = new CalHeatMap();;
generate_heatmap();

const fileInput = document.querySelector('.fileInput');
fileInput.addEventListener('change', () => {
  Papa.parse(fileInput.files[0], {
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
  legend: [20, 40, 60, 80] 	// Custom threshold for the scale
  });
}