$(function () {
  var data = []
  $.ajax({
    url: "http://178.128.197.205/odooApi/index.php?uid=1&password=admin&modalname=res.partner&method=search_count&parmlist[0][0][0]=customer&parmlist[0][0][1]=%3D&parmlist[0][0][2]=true&parmlist[0][1][0]=parent_id&parmlist[0][1][1]==&parmlist[0][1][2]=false",
    method: "GET",
    beforeSend: function (r) {
      //r.setRequestHeader("Access-Control-Allow-Origin","*")
    },
    error: function (e) {
      console.log(e)
    },
    success: function (result) {
      console.log("done")
      data.push(parseInt(JSON.parse(JSON.stringify(result))))
      console.log(data)
    }
  }).then(function () {
    $.ajax({
      url: "http://178.128.197.205/odooApi/index.php?uid=1&password=admin&modalname=res.partner&method=search_count&parmlist[0][0][0]=insurer_type&parmlist[0][0][1]=%3D&parmlist[0][0][2]=1",
      method: "GET",
      beforeSend: function (r) {
        //r.setRequestHeader("Access-Control-Allow-Origin","*")
      },
      error: function (e) {
        console.log(e)
      },
      success: function (result) {
        console.log("done")
        data.push(parseInt(JSON.parse(JSON.stringify(result))))
        console.log(data)
      }
    })
  }).then(function () {
    $.ajax({
      url: "http://178.128.197.205/odooApi/index.php?"+"username=admin&&password=admin",
      method: "GET",
      beforeSend: function (r) {
        //r.setRequestHeader("Access-Control-Allow-Origin","*")
      },
      error: function (e) {
        console.log(e)
      },
      success: function (result) {
        console.log("done")
        console.log(result)
        data.push(parseInt(JSON.parse(JSON.stringify(result))))
        console.log(data)
      }
    }).then(function () {
      var areaChartData = {
        labels: ['customer', 'insurer', 'Agent'],
        datasets: [{
          label: 'Digital Goods',
          fillColor: 'rgba(60,141,188,0.9)',
          strokeColor: 'rgba(60,141,188,0.8)',
          pointColor: '#3b8bba',
          pointStrokeColor: 'rgba(60,141,188,1)',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(60,141,188,1)',
          data: data
        }]
      }
      var barChartCanvas = $('#barChart').get(0).getContext('2d')
      var barChart = new Chart(barChartCanvas)
      var barChartData = areaChartData
      barChartData.datasets[0].fillColor = '#00a65a'
      barChartData.datasets[0].strokeColor = '#00a65a'
      barChartData.datasets[0].pointColor = '#00a65a'
      var barChartOptions = {
        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,
        //String - Colour of the grid lines
        scaleGridLineColor: 'rgba(0,0,0,.05)',
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - If there is a stroke on each bar
        barShowStroke: true,
        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,
        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,
        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,
        //String - A legend template
        legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
        //Boolean - whether to make the chart responsive
        responsive: true,
        maintainAspectRatio: true
      }

      barChartOptions.datasetFill = false
      barChart.Bar(barChartData, barChartOptions)

    })
  })
})