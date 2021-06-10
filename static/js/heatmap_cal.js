var cal = new CalHeatMap();
	cal.init({
    data: "dataFiles/datas-years.json",
	start: new Date(2000, 0, 1),
	id : "graph_c",
	domain : "month",			// Group data by month
	subDomain : "day",			// Split each month by days
	range : 12,					// Just display 3 months
	legend: [20, 40, 60, 80] 	// Custom threshold for the scale
  });