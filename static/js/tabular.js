var data = [];
var datatype;
var attribute;
var cal_data = {};


var cal = new CalHeatMap();;
generate_heatmap();

const fileInput = document.querySelector('.fileInput');
fileInput.addEventListener('change', () => {
  data = [];
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
      iterate();
      cal = cal.destroy();
      generate_heatmap();
    }
  });
});

function read_dropdown() {
  datatype = document.getElementById("datatype").value;
  attribute = document.getElementById("attribute").value;
}

function iterate() {
  var i, j;
  for (i=0; i<data.length; i++) {
    if(data[i][0] === datatype) {
      break;
    }
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
	range : 12,					// Just display number of months
	legend: [20, 40, 60, 80] 	// Custom threshold for the scale
  });
}