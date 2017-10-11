/**
 * Created by arch on 11/14/16.
 */

(function ()
{
   var theme = document.body.getAttribute("data-theme") !== "" ?
               document.body.getAttribute("data-theme") : "light";
   // Convert a div to the dock manager.  Panels can then be docked on to it
   //var divDockManager = document.getElementById("my_dock_manager");
   //var dockManager = new dockspawn.DockManager(divDockManager);
   //dockManager.initialize();
   //
   //
   //var editor2 = new dockspawn.PanelContainer(document.getElementById("editor2_window"), dockManager);
   //var editor1 = new dockspawn.PanelContainer(document.getElementById("editor1_window"), dockManager);
   //
   //
   //var documentNode = dockManager.context.model.documentManagerNode;
   //var editor1Node = dockManager.dockFill(documentNode, editor1);
   //var editor2Node = dockManager.dockFill(documentNode, editor2);


   /*        window.onload = function ()
    {
    };*/

   var dataSrc = document.getElementById("dataSrc"),
       userNamesSrc = document.getElementById("userNamesSrc");

   var dataSource = dataSrc.innerHTML.toString(),
       userNames = userNamesSrc.innerHTML.toString().split(',');
         /*for( let u = 0, lent = userNames.length; u < lent ; u++)
         {
            userNames[u] = userNames[u].toString().trim();
         }*/
   var users = userNames.map(Barge.String.trim);
   console.log(users);
   Barge.utils.removeEl(dataSrc);
   Barge.utils.removeEl(userNamesSrc);

   var Actions = ["cleared the logs", "logged out", "logged in", "edited student", "edited a user","backed data up","updated system configuration","revoked a user's privileges","removed student","set default grading system","set internal grading system","reinstated student","uploaded grades","updated grades"];

   var table = Barge.Collection.Dictionary;

   function createFrequencyTable(dataSource, tokens, user)
   {
      table.add(user, Barge.String.getFrequency(dataSource, user));
      for (i = 0; i < tokens.length; i++)
      {
         var token = user.toString() + "   "  +tokens[i].toString();
         //console.log(token);
         /*if(!Barge.String.isEmpty(user))
         {
            */
         if(i == 0)
            {
               table.add(token, Barge.String.getFrequency(dataSource, `${user}    ${tokens[i]}`));
               //FIXME use of interpolated string literals may have be to changed for backward compatibility
            }
            else
            {
               table.add(token, Barge.String.getFrequency(dataSource, token));
            }
         // }

      }
   }

   // var users = ["obina", "hames", "abonious","tmall"];
   //function printStatData(tableData)
   //{
      //console.log(tableData.length);
      //var cols = null;
      //var user = null;
      //var userNameChanged = false;
      //var currentUser;
      //
      //for(var i = 0; i < tableData.length; i++)
      //{
      //   cols = tableData[i].split("|");
      //   user = cols[0];
         //console.log(cols[0]);
         //
         //
         //if(i === 0)
         //{
         //   Barge.utils.gebi("usageStats").innerHTML += "<p> " +
         //      Barge.String.toSentenceCase(user) + " " + "has performed "+ cols[1]+" actions </p>";
         //}
         //else
         //{
         //   currentUser = user.split(" ")[0];
         //   userNameChanged = currentUser == user;
         //   the code above miraculously works
            //
            //if(!userNameChanged)
            //{
            //   Barge.utils.gebi("usageStats").innerHTML += "<p> " +
            //      Barge.String.toSentenceCase(user) + " " + cols[1] + " "+ "times </p>";
            //}
            //else
            //{
            //   Barge.utils.gebi("usageStats").innerHTML += "<p> " +
            //      Barge.String.toSentenceCase(user) + " " + "has performed "+ cols[1]+" actions </p>";
            //}
         //}
      //}
   //}
   //printStatData(table.getKeysAndVals());
   //console.log(users[0]+ "   " +Actions[0]);
   // console.log(table.find(users[0]+ "   " +Actions[1]));

   //var seriesData;
   function createSeriesData(Actions, type)
   {
      var seriesData = [];
      var i;
      for(i = 0; i< users.length; i++)
      {
         createFrequencyTable(dataSource, Actions, users[i]);
      }
      //TODO make user[index] dynamic
      for(i = 0; i < Actions.length; i++)
      {
         if(type === 'pie')
         {
            //data: [ [ ' Nintendo' , 54030288 ],
            //        [ ' Electronic Arts' , 31367739 ]]
            let val = table.find(users[0]+ "   " +Actions[i]) +
                      table.find(users[1]+ "   " +Actions[i]) +
                      table.find(users[2]+ "   " +Actions[i]) +
                      table.find(users[3]+ "   " +Actions[i]);
            //console.log(val);
            seriesData.push([Actions[i], val]);
         }
         else if(type === 'bar')
         {
            seriesData.push({name: Actions[i],
                               data: [table.find(users[0]+ "   " +Actions[i]),
                                      table.find(users[1]+ "   " +Actions[i]),
                                      table.find(users[2]+ "   " +Actions[i]),
                                      table.find(users[3]+ "   " +Actions[i])]});
         }
         else if(type === 'areaspline')
         {
            seriesData.push({name: Actions[i],
                               data: [table.find(users[0]+ "   " +Actions[i]),
                                      table.find(users[1]+ "   " +Actions[i]),
                                      table.find(users[2]+ "   " +Actions[i]),
                                      table.find(users[3]+ "   " +Actions[i])],

                               type: 'areaspline'});
         }
         else
         {
            seriesData.push([Actions[i],
                               [table.find(users[0]+ "   " +Actions[i]),
                                      table.find(users[1]+ "   " +Actions[i]),
                                      table.find(users[2]+ "   " +Actions[i]),
                                      table.find(users[3]+ "   " +Actions[i])]]);
         }
         //todo set the data dynamically by iterating

      }

      return seriesData;
   }

   //seriesData = createSeriesData(Actions);

   var Actions2 = ["cleared the logs", "logged out", "logged in"];
   //console.log(seriesData);

//       console.log( table.getAggregate());
   var Actions3 = ["edited student", "edited a user", "revoked a user's privileges","removed student", "reinstated student",];

   var Actions4 = ["set internal grading system","uploaded grades","updated grades"];

   var Actions5 = ["backed data up","updated system configuration","set default grading system"];

   var doughnutChart = new Highcharts.Chart({
      chart: {
         renderTo: 'doughnutChart',
         type: 'pie',
         backgroundColor: "var(--normalBgColor)"

      },
      colors: ['#e4d354',
               '#62ECBE',
               '#2598FF',
               '#ff486b',
               '#2b908f',
               '#f45b5b',
               '#91e8e1',
               '#9D4F36',
               '#7cb5ec',
               '#434348',
               '#90ed7d',
               '#f7a35c',
               '#8085e9',
               '#f15c80 '],
      title: {
         text: 'All User Login/Logout activity'
      },
      subtitle: {
         text: 'Source: <a href="#">Barge Studios Stats</a>',
         style: {
            color: theme === "light" ? '#666' : '#fff'
         }
      },
      xAxis: {
         categories: users.map(Barge.String.toSentenceCase),
         title: {
            text: 'Users',
            align: 'high'
         },
         labels:{
            style: {
               color: theme === "light" ? '#666' : '#fff'
            }
         }
      },
      yAxis: {
         min: 0,
         title: {
            text: 'Actions (number of times)',
            align: 'high'
         },
         labels: {
            overflow: 'justify',
            style: {
               color: theme === "light" ? '#666' : '#fff'
            }
         }
      },
      tooltip: {
         valueSuffix: ' times'
      },
      plotOptions: {
         pie: {
            showInLegend : true,
            slicedOffset: 20,
            innerSize: '60%',
            dataLabels: {

               enabled: true,
               formatter: function() {
                  return this.point.name + ' : ' +
                         //Highcharts.numberFormat(this.y, 0);
                 Highcharts.numberFormat(this.percentage) + ' %' ;
            }}
         }
      },
      legend: {
         layout: 'vertical',
         align: 'right',
         verticalAlign: 'top',
         x: -30,
         y: 10,
         floating: true,
         borderWidth: 1,
         backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, .5)'),
         shadow: true
      },
      credits: {
         enabled: true,
         href: 'http://www.bargestd.com',
         text: 'bargestd.com'
      },
      //series: createSeriesData(Actions2)

      series: [{
         data : createSeriesData(Actions2, 'pie')
      }]
   });

   var  pieChart = new Highcharts.Chart({
      chart: {
         renderTo: 'columnChart',
         type: 'column',
         backgroundColor: "var(--normalBgColor)"

      },
      colors: '#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1 #EC3454 #2598FF #9D4F36 #62ECBE'.split(' '),
      title: {
         text: 'User/Student Activity Info'
      },
      subtitle: {
         text: 'Source: <a href="#">Barge Studios Stats</a>',
         style: {
            color: theme === "light" ? '#666' : '#fff'
         }
      },
      xAxis: {
         categories: users.map(Barge.String.toSentenceCase),
         title: {
            text: 'Users',
            align: 'high'
         },
         labels:{
            style: {
               color: theme === "light" ? '#666' : '#fff'
            }
         }
      },
      yAxis: {
         min: 0,
         title: {
            text: 'Actions (number of times)',
            align: 'high'
         },
         labels: {
            overflow: 'justify',
            style: {
               color: theme === "light" ? '#666' : '#fff'
            }
         }
      },
      tooltip: {
         valueSuffix: ' times'
      },
      plotOptions: {
         bar: {
            dataLabels: {
               enabled: true
            }
         }
      },
      legend: {
         layout: 'vertical',
         align: 'right',
         verticalAlign: 'top',
         x: -30,
         y: 10,
         floating: true,
         borderWidth: 1,
         backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, .5)'),
         shadow: true
      },
      credits: {
         enabled: true,
         href: 'http://www.bargestd.com',
         text: 'bargestd.com'
      },
      series: createSeriesData(Actions3, 'bar')
   });

   var columnChart = new Highcharts.Chart({
      chart: {
         renderTo : 'pieChart',
         type: 'spline',
         options3d: {
            enabled: false,
            alpha: 45,
            beta: 0
         },
         backgroundColor: "var(--normalBgColor)"
      },
      colors: '#f7a35c #8085e9 #f15c80 #7cb5ec #434348 #90ed7d #e4d354 #2b908f #f45b5b #91e8e1 #EC3454 #2598FF #9D4F36 #62ECBE'.split(' '),
      title: {
         text: 'Grading Activities'
      },
      subtitle: {
         text: 'Source: <a href="#">Barge Studios Stats</a>',
         style: {
            color: theme === "light" ? '#666' : '#fff'
         }
      },
      xAxis: {
         categories: users.map(Barge.String.toSentenceCase),
         title: {
            text: null
         },
         labels: {
            style: {
               color: theme === "light" ? '#666' : '#fff'
            }
         }
      },
      yAxis: {
         min: 0,
         title: {
            text: 'Actions (times)',
            align: 'high'
         },
         labels: {
            overflow: 'justify',
            style: {
               color: theme === "light" ? '#666' : '#fff'
            }
         }
      },
      tooltip: {
         valueSuffix: ' times'
      },
      plotOptions: {
         allowPointSelect: true,
         cursor: 'pointer',
         depth: 35,
         dataLabels: {
            enabled: true,
            format: '{point.name}'
         }
      },
      legend: {
         layout: 'vertical',
         align: 'right',
         verticalAlign: 'top',
         x: -30,
         y: 10,
         floating: true,
         borderWidth: 1,
         backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, .5)'),
         shadow: true
      },

      credits: {
         enabled: false
      },

      series: createSeriesData(Actions4, 'areaspline')
   });

   var splineChart = new Highcharts.Chart({
      chart: {
         renderTo : 'spChart',
         type: 'spline',
         options3d: {
            enabled: false,
            alpha: 45,
            beta: 0
         },
         backgroundColor: "var(--normalBgColor)"
      },
      colors: '#62ECBE #f45b5b #f7a35c #EC3454 #9D4F36 #8085e9 #f15c80 #7cb5ec #434348 #90ed7d #e4d354 #2b908f #91e8e1 #2598FF  #62ECBE'.split(' '),
      title: {
         text: 'Data and System Activities'
      },
      subtitle: {
         text: 'Source: <a href="#">Barge Studios Stats</a>',
         style: {
            color: theme === "light" ? '#666' : '#fff'
         }
      },
      xAxis: {
         categories: users.map(Barge.String.toSentenceCase),
         title: {
            text: null
         },
         labels: {
            style: {
               color: theme === "light" ? '#666' : '#fff'
            }
         }
      },
      yAxis: {
         min: 0,
         title: {
            text: 'Actions (times)',
            align: 'high'
         },
         labels: {
            overflow: 'justify',
            style: {
               color: theme === "light" ? '#666' : '#fff'
            }
         }
      },
      tooltip: {
         valueSuffix: ' times'
      },
      plotOptions: {
         allowPointSelect: true,
         cursor: 'pointer',
         depth: 35,
         dataLabels: {
            enabled: true,
            format: '{point.name}'
         }
      },
      legend: {
         layout: 'vertical',
         align: 'right',
         verticalAlign: 'top',
         x: -30,
         y: 10,
         floating: true,
         borderWidth: 1,
         backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, .5)'),
         shadow: true
      },

      credits: {
         enabled: false
      },

      series: createSeriesData(Actions5, 'bar')
   });


//       region closeList
   var llCloseBtns = document.getElementsByClassName("logListCloseBtn");
   var ul = document.querySelector(".log-entries");
//       console.log(ul);
   var li = ul !== null ? ul.getElementsByTagName('li') : null, i;

   var tempEntries = null;
   tempEntries = ul !== null ?  ul.innerHTML : null;

   for (i = 0, len = llCloseBtns.length; i < len; i++)
   {
      llCloseBtns[i].addEventListener("click", function ()
      {
         Barge.utils.closeWin(this.parentElement,false,false);

      })
   }

   if(ul && ul.children.length < 1)
   {
      ul.innerHTML = "<li class='logEntry'><a>The log file is empty</a><a></a><a></a></li>"
   }
//endregion
})();


