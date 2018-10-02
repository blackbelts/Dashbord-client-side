/* Api Url */
var odooUrl = "http://178.128.197.205/odooApi/index.php?",
  /* Auth user id */
  uid = '1',
  /* auth user passwrod */
  password = 'admin',
  /* monthesNames => list contain monthes short names */
  monthesNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
  /* dataSets=> list of data sets that must be draw */
  dataSets = [],
  /* colors=> list of colors for graphs */
  colors = ['rgba(34, 102, 102,1)', 'rgba(0,196,194,1)', 'rgba(60,141,188,0.9)', 'rgba(47,94,117,1)', 'rgba(51,34,136,1)', 'rgba(33,151,238)', 'rgba(255,63,121,1)', "rgba(255,211,70,1)", 'rgba(0,104,185,1)', 'rgba(46,135,190,1)', 'rgba(1,7,102,1)', 'rgba(30,132,208,1)', 'rgba(255,63,121,1)', 'rgba(92,0,32,1)'],
  /* 
   *graphlist=> contain a list of graphs in the page 
   * for mutli tab graph to solve problem of graph not working in tabs
   * problem  details => graph worked on the active tab only 
   * use this list to store graphs in a page 
   * for can refresh the graph when active tab change
   */
  graphlist = [],
  agentsNumber;
$(function () {
  /* for comlpleted the solution for the problem mentioned above*/
  $(".nav-tabs li").on('shown.bs.tab', function (e) {
    var c = $(this).find("a")[0].getAttribute("href"),
      g = graphlist[$(c).find("canvas")[0].getAttribute("data-canvasid")],
      chartCanvas = $(c).find("canvas").get(0);
    chartCanvas.style = "height:270px";
    var chart = new Chart($(c).find("canvas").get(0).getContext('2d'));
    if (g.type == "Doughnut") {
      chart.Doughnut(g.data, g.options);
    } else if (g.type == "Line") {
      chart.Line(g.data, g.options);
    } else if (g.type == "Bar") {
      chartCanvas.style = "height:270px";
      g.options.datasetFill = false;
      chart.Bar(g.data, g.options);
    }
  })
  /* 
   var domains = [];
   *this var for contains Odoo domins list 
   *must be initialize before ever Query or request ajax
   */
  var domains = [];
  /*
   var maps = [];
   * this var for contains Odoo mapping list 
   * must be initialize before ever Query or request ajax
   */
  var maps = [];
  // add domain object like object Domain ProtoType to domains list
  domains.push(new Domain("agent", "%3D", "1"))
  /*
   *this function make ajax request to get number of agents from server
   * write it in html file 
   */
  ajaxRequest(uid, password, "res.partner", "search_count", domains, maps)
    // for return result correctly
    .then(function (r) {
      maps = [];
      agentsNumber = r;
      $("#agents-number").text(r);
    }).then(function () {
      //get agent graph data
      var monthes = getMonths(),
        monthesNamelsit = [];
      monthes.forEach(function (m) {
        monthesNamelsit.push(monthesNames[new Date(m).getMonth()] + new Date(m).getFullYear().toString());
      })
      monthesNamelsit.splice(0, 1);
      dataSets = [];
      ajaxRequest(uid, password, "res.partner", "search_count", domains, maps, monthes)
        .then(function (re) {
          dataSets.push(re);
          graphlist.push(areaChart(dataSets, monthesNamelsit, graphlist.length, '#lineChart'));
          graphlist.push(donut(re, monthesNamelsit, graphlist.length, "#pieChart"));
          graphlist.push(barChart(dataSets, monthesNamelsit, graphlist.length, '#barChart'))
        })
        .catch(function (error) {
          console.log(error)
        })
    })
    //for error in result
    .catch(function (error) {
      console.log(error)
    })
  ajaxRequest(uid, password, "crm.lead", "search_count", [new Domain("type", "%3D", "lead")], [], [])
    .then(function (re) {
      $("#leads p strong").get(0).append(re);
      setValues("#leads", "crm.lead", "search_read", re, [new Domain("type", "%3D", "lead")], [new Map("fields", ["planned_revenue"])], [], ['#leadlineChart', '#leadpieChart', '#leadbarChart'])

    })
  ajaxRequest(uid, password, "crm.lead", "search_count", [new Domain("stage_id", "%3D", "New"), new Domain("type", "%3D", "opportunity")], [], [])
    .then(function (re) {
      $("#new p strong").get(0).append(re);
      setValues("#new", "crm.lead", "search_read", re, [new Domain("stage_id", "%3D", "New"), new Domain("type", "%3D", "opportunity")], [new Map("fields", ["planned_revenue"])], [],['#newlineChart', '#newpieChart', '#newbarChart'])
    })
  ajaxRequest(uid, password, "crm.lead", "search_count", [new Domain("stage_id", "%3D", "Qualified"), new Domain("type", "%3D", "opportunity")], [], [])
    .then(function (re) {
      $("#proposal p strong").get(0).append(re);
      setValues("#proposal", "crm.lead", "search_read", re, [new Domain("stage_id", "%3D", "Qualified"), new Domain("type", "%3D", "opportunity")], [new Map("fields", ["planned_revenue"])], [],['#proposallineChart', '#proposalpieChart', '#proposalbarChart'])
    })
  ajaxRequest(uid, password, "crm.lead", "search_count", [new Domain("stage_id", "%3D", "Proposition"), new Domain("type", "%3D", "opportunity")], [], [])
    .then(function (re) {
      $("#uw p strong").get(0).append(re);
      setValues("#uw", "crm.lead", "search_read", re, [new Domain("stage_id", "%3D", "Proposition"), new Domain("type", "%3D", "opportunity")], [new Map("fields", ["planned_revenue"])], [],['#uwlineChart', '#uwpieChart', '#uwbarChart'])
    })
  ajaxRequest(uid, password, "crm.lead", "search_count", [new Domain("stage_id", "%3D", "Won"), new Domain("type", "%3D", "opportunity")], [], [])
    .then(function (re) {
      $("#won p strong").get(0).append(re);
      setValues("#won", "crm.lead", "search_read", re, [new Domain("stage_id", "%3D", "Won"), new Domain("type", "%3D", "opportunity")], [new Map("fields", ["planned_revenue"])], [],['#wonlineChart', '#wonpieChart', '#wonbarChart'])
    })
  ajaxRequest(uid, password, "crm.lead", "search_count", [new Domain("active", "!%3D", "true")], [], [])
    .then(function (re) {
      $("#lost p strong").get(0).append(re);
      setValues("#lost", "crm.lead", "search_read", re, [new Domain("active", "!%3D", "true")], [new Map("fields", ["planned_revenue"])], [],['#lostlineChart', '#lostpieChart', '#lostbarChart'])

    })

})

function setValues(id, modal, method, re, domains = [], maps = [], monthes = [], canvasId = []) {
  ajaxRequest(uid, password, modal, method, domains, maps, monthes)
    .then(function (re2) {
      $(id + " p strong").get(1).append(clacPre(re2).toFixed(2));
      $(id + " p strong").get(2).append((clacPre(re2) / parseInt($(id + " p strong").get(0).innerHTML)).toFixed(2));
      $(id + " p strong").get(3).append((clacPre(re2) / agentsNumber).toFixed(2));
      $(id + " p strong").get(4).append((re / agentsNumber).toFixed(2));
      var monthes = getMonths(),
        monthesNamelsit = [];
      monthes.forEach(function (m) {
        monthesNamelsit.push(monthesNames[new Date(m).getMonth()] + new Date(m).getFullYear().toString());
      })
      monthesNamelsit.splice(0, 1);
      var dS = [];
      ajaxRequest(uid, password, modal, "search_count", domains, [], monthes)
        .then(function (response) {
          console.log(response);
          dS.push(response);
          console.log(response);
          graphlist.push(areaChart(dS, monthesNamelsit, graphlist.length, canvasId[0]));
          graphlist.push(donut(response, monthesNamelsit, graphlist.length, canvasId[1]));
          graphlist.push(barChart(dS, monthesNamelsit, graphlist.length, canvasId[2]))
        })
        .catch(function (error) {
          console.log(error)
        })
    })
}

function clacPre(array = []) {
  sum = 0;
  array.forEach(function (item) {
    sum += item.planned_revenue
  });
  return sum
}
/* 
 * map object protoType
 * prop => like fields,limit,order ...
 * prop_values => values of prop that must be contain
 */
function Map(prop, prop_values = []) {
  this.prop = prop;
  this.prop_values = prop_values;
}
/* 
 * Domain object protoType
 * f => field name to execute on it query
 * e => experation like =,<,> ...
 * value => value of f
 */
function Domain(f, e, v) {
  this.filed = f;
  this.experation = e;
  this.value = v;
}

function Graph(data, options, type) {
  this.data = data;
  this.options = options;
  this.type = type;
}
/* this function for login  */
function login(username, password) {
  $.ajax({
    url: odooUrl + "username=" + username + "&password=" + password,
    method: "GET",
    beforeSend: function (r) {
      //r.setRequestHeader("Access-Control-Allow-Origin","*")
    },
    error: function (e) {
      console.log(e)
    },
    success: function (result) {}
  })
}

function ajaxRequest(uid, password, modal, method, domains = [], mapList = [], monthesdata = []) {
  return $.ajax({
    url: makeHttpUrl(uid, password, modal, method, domains, mapList),
    method: "GET",
    dataType: 'json',
    data: {
      months: JSON.stringify(monthesdata),
    },
    error: function (e) {
      console.log(e)
    },
    success: function (r) {
      result = parseInt(JSON.parse(JSON.stringify(r)))
    }
  })
}
/*
 * return url Format
 */
function makeHttpUrl(uid, password, modal, method, domains = [], mapList = []) {
  return (
    "http://localhost/file/index.php?" +
    "uid=" + uid +
    "&password=" + password +
    "&modalname=" + modal +
    "&method=" + method +
    makeDomainQuery(domains) +
    makeMappingList(mapList)
  );
}

function makeMappingList(mapList = []) {
  if (mapList.length != 0) {
    var mapStr = "&mappinglist[";
    var j = 0;
    mapList.forEach(map => {
      if (map.prop == "fields") {
        for (var i = 0; i < map.prop_values.length; i++) {
          mapStr += map.prop + "][" + i + "]=" + map.prop_values[i];
          if (i < map.prop_values.length - 1) {
            mapStr += "&mappinglist[";
          }
        }
      } else {
        mapStr += map.prop + "]"
        for (var i = 0; i < map.prop_values.length; i++) {
          mapStr += "=" + map.prop_values[i];
          if (i < map.prop_values.length - 1) {
            mapStr += "&mappinglist[";
          }
        }
      }
      j++;
      if (j < mapList.length) mapStr += "&mappinglist[";
    });
    return mapStr;
  } else {
    return "";
  }
}
/* make domain string */
function makeDomainQuery(domains = []) {
  var domainStr = "&parmlist[0]";
  if (domains.length != 0) {
    var i = 0;
    domains.forEach(dom => {
      domainStr += "[" + i + "]" + "[0]=" +
        dom.filed + "&parmlist[0]" + "[" +
        i + "][1]=" + dom.experation +
        "&parmlist[0]" + "[" + i + "][2]=" + dom.value;
      i++;
      if (i < domains.length) domainStr += "&parmlist[0]";
    });
    return domainStr;
  } else {
    return "";
  }
}
/* 
 *****get Months dates*****
 * this function return alist contain 13 date for months that must work on it
 * ever element on this list it's format is MM-DD-MM HH:MM:SS
 * it return 13 element to get 12 node or value from odoo 
 * every node return values between current element and next element
 */
function getMonths() {
  var date = new Date(),
    month = date.getMonth() + 1,
    monthsList = [],
    yearChanged = false
  for (var i = 0; i < 13; i++) {
    if (month < 0) {
      if (!yearChanged) {
        yearChanged = true
        date.setYear(date.getFullYear() - 1);
      }
      date.setMonth(month + 11);
    } else {
      date.setMonth(month);
    }
    date.setDate(1);
    date.setHours(00);
    date.setSeconds(00);
    date.setMilliseconds(00);
    date.setMinutes(00);
    /*
     * the next code push month date to months list 
     * convert month date to MM-DD-YYYY HH:MM:SS 
     */
    monthsList.push([date.getMonth() + 1,
      date.getDate(),
      date.getFullYear()
    ].join('-') + ' ' + [date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ].join(':'));
    month--;
  }
  return monthsList
}