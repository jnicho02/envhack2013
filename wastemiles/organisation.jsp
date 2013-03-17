<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.* " %>
<%@ page import="java.io.*" %>

  <head>
    <meta charset="utf-8">
    <title>High Score Table</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="css/bootstrap.css" rel="stylesheet">
    <style>
      body {
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
    </style>
    <link href="css/bootstrap-responsive.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="js/html5shiv.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="ico/apple-touch-icon-114-precomposed.png">
      <link rel="apple-touch-icon-precomposed" sizes="72x72" href="ico/apple-touch-icon-72-precomposed.png">
                    <link rel="apple-touch-icon-precomposed" href="ico/apple-touch-icon-57-precomposed.png">
                                   <link rel="shortcut icon" href="ico/favicon.png">


<!-- Google Charts -->

    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">
      google.load("visualization", "1", {packages:["corechart"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Year', 'Inputs', 'Waste Miles'],
          ['2009',  1000,      4000],
          ['2010',  1170,      4600],
          ['2011',  1200,      4670],
          ['2012',  1190,      4000]
        ]);

        var options = {
          title: 'Company Performance',
          vAxis: {title: 'Year',  titleTextStyle: {color: 'red'}}
        };

        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
    </script>
  </head>
  <body>
    
  </body>
  
  
  
  

  <body>

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="brand" href="#">Project name</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li><a href="/wastemiles">Home</a></li>
              <li><a href="organisations.jsp">High Scores</a></li>               
              <li><a href="/wastemiles#about">About</a></li>
              <li><a href="/wastemiles/#contact">Contact</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">
    
    
    <div class="hero-unit" id="chart_div" style="width: 900px; height: 500px;"></div>

    
    
<%
try {
  String driver = "org.postgresql.Driver";
  String url = "jdbc:postgresql://localhost:5432/geodb_1";
  String username = "postgres";
  String password = "password";

  String id=request.getParameter("id"); 

  String myQuery = "SELECT * FROM organisations WHERE gid='"+id+"'";

  Connection myConnection = null;
  PreparedStatement myPreparedStatement = null;
  ResultSet myResultSet = null;
  ResultSet transactionsResultSet = null;
  Class.forName(driver).newInstance();
  myConnection = DriverManager.getConnection(url,username,password);
  myPreparedStatement = myConnection.prepareStatement(myQuery);
  myResultSet = myPreparedStatement.executeQuery();
  if(myResultSet.next()) {
    out.print("<h2>Company " + myResultSet.getString("name") + "</h2>");
    out.print("<p>Address " + myResultSet.getString("address") + "<br/>");
    out.print("postcode " + myResultSet.getString("postcode") + "<br/>");
    out.print("type " + myResultSet.getString("type") + "</p>");
    out.print("<h2>Score</h2>");
    out.print("<p>"+myResultSet.getString("score")+"</p>");
  }
  
  out.print("<h2>Input</h2>");
  myQuery = "SELECT * FROM transactions WHERE to_id='"+id+"'";
  myPreparedStatement = myConnection.prepareStatement(myQuery);
  myResultSet = myPreparedStatement.executeQuery();
  while(myResultSet.next()) {
    out.print("<h2>" + myResultSet.getString("quantity") + " * " + myResultSet.getString("ecw_type") + "</h2>");
    out.print("<p>Score +" + myResultSet.getString("score") + "<br/>");
  }
    
  out.print("<h2>Output</h2>");
  myQuery = "SELECT * FROM transactions WHERE from_id='"+id+"'";
  myPreparedStatement = myConnection.prepareStatement(myQuery);
  myResultSet = myPreparedStatement.executeQuery();
  while(myResultSet.next()) {
    out.print("<p>" + myResultSet.getString("quantity") + " * " + myResultSet.getString("ewc_type") + " sent to " + myResultSet.getString("to_id") + " receiving a score +" + myResultSet.getString("score") + "</p>");
  }
  
      
  }
  catch(ClassNotFoundException e){e.printStackTrace();}
  catch (SQLException ex)
  {
    out.print("SQLException: "+ex.getMessage());
    out.print("SQLState: " + ex.getSQLState());
  }
%>

<h1>Send waste</h1>
<form action="add_transaction.jsp" method="post">

id :<input type="text" name="id" /><br/>
to :<input type="text" name="to_id" /><input type="hidden" name="from_id"  value="<% request.getParameter("id"); %>3"/><br/>
quantity :<input type="text" name="quantity" /><br/>
ewc_type :<input type="text" name="ewc_type" /><br/>
date :<input type="text" name="date" /><br/>
<input type="submit" />

</form>

    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="js/jquery.js"></script>
    <script src="js/bootstrap-transition.js"></script>
    <script src="js/bootstrap-alert.js"></script>
    <script src="js/bootstrap-modal.js"></script>
    <script src="js/bootstrap-dropdown.js"></script>
    <script src="js/bootstrap-scrollspy.js"></script>
    <script src="js/bootstrap-tab.js"></script>
    <script src="js/bootstrap-tooltip.js"></script>
    <script src="js/bootstrap-popover.js"></script>
    <script src="js/bootstrap-button.js"></script>
    <script src="js/bootstrap-collapse.js"></script>
    <script src="js/bootstrap-carousel.js"></script>
    <script src="js/bootstrap-typeahead.js"></script>
