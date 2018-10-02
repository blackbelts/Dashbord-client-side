function areaChart(dataSet = [], labels = [], graphIndex,id) {
  /* ChartJS
   * -------
   * Here we will create a few charts using ChartJS
   */
  //--------------
  //- AREA CHART -
  //--------------
  // Get context with jQuery - using jQuery's .get() method.
  /* 
   *rgba(0,196,194,1) 
   *rgba(60,141,188,0.9)
   * rgba(47,94,117,1)
   * rgba(51,34,136,1)
   * rgba(33,151,238)
   */
  var areaChartData = {
    labels: labels.reverse(),
    datasets: []
  }
  var index = 0;
  dataSet.forEach(function (d) {
    areaChartData.datasets.push({
      fillColor: colors[index],
      strokeColor: colors[index],
      data: d.reverse()
    })
    index++;
  })
  var areaChartCanvas = $(id).get(0).getContext('2d')
  // This will get the first returned node in the jQuery collection.
  var areaChart = new Chart(areaChartCanvas)

  var areaChartOptions = {
    //Boolean - If we should show the scale at all
    showScale: true,
    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: false,
    //String - Colour of the grid lines
    scaleGridLineColor: 'rgba(0,0,0,.08)',
    //Number - Width of the grid lines
    scaleGridLineWidth: 1,
    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,
    //Boolean - Whether the line is curved between points
    bezierCurve: true,
    //Number - Tension of the bezier curve between points
    bezierCurveTension: 0.3,
    //Boolean - Whether to show a dot for each point
    pointDot: false,
    //Number - Radius of each point dot in pixels
    pointDotRadius: 4,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth: 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius: 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke: true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth: 2,
    //Boolean - Whether to fill the dataset with a color
    datasetFill: false,
    //String - A legend template
    legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].lineColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
    //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true
  }
  //Create the line chart
  areaChart.Line(areaChartData, areaChartOptions);
  $(id).get(0).setAttribute("data-canvasid", graphIndex);
  return new Graph(areaChartData, areaChartOptions, "Line");
}