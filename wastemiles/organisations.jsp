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
  </head>

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
              <li class="active"><a href="organisations.jsp">High Scores</a></li>               
              <li><a href="/wastemiles#about">About</a></li>
              <li><a href="/wastemiles/#contact">Contact</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">
    
  
<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.* " %>
<%@ page import="java.io.*" %>
<h1>High score table</h2>
<p>Region: <select>
  <option value="southeast">South East</option>
  <option value="southwest">South West</option>
  <option value="midlands">The Midlands</option>
  <option value="wales">Wales</option>
  <option value="the_north">The North</option>
  <option value="scotland">Scotland</option>
  <option value="northern_ireland">Northern Ireland</option>
</select>
</p>
<%
try {
  String driver = "org.postgresql.Driver";
  String url = "jdbc:postgresql://localhost:5432/geodb_1";
  String username = "postgres";
  String password = "password";

  String myQuery = "SELECT * FROM organisations order by score desc";

  Connection myConnection = null;
  PreparedStatement myPreparedStatement = null;
  ResultSet myResultSet = null;
  Class.forName(driver).newInstance();
  myConnection = DriverManager.getConnection(url,username,password);
  myPreparedStatement = myConnection.prepareStatement(myQuery);
  myResultSet = myPreparedStatement.executeQuery();

  String id = null;
  String name = null;
  Integer score = null;
  String rating = "poor";
  out.println("<table>");
  out.println("<tr><th width='100' align='center'>name</th><th width='100'>rating</th></tr>");
  while(myResultSet.next()) {
    id = myResultSet.getString("gid");
    name = myResultSet.getString("name");
    score = myResultSet.getInt("score");
    rating = "warning";
    if (score>4) { rating = "success"; }
    if (score<1) { rating = "important"; }
    
    out.println("<tr><td align='left'><a href='organisation.jsp?id="+id+"'>"+name+"</a></td><td align='center'><span class='badge badge-"+rating+"'>"+score+"</td></tr>");
    }
  out.println("</table>");

  }
  catch(ClassNotFoundException e){e.printStackTrace();}
  catch (SQLException ex)
  {
    out.print("SQLException: "+ex.getMessage());
    out.print("SQLState: " + ex.getSQLState());
  }
  %>

<p><a href="add_organisation.html" class="btn btn-primary btn-large">add a company &raquo;</a></p>



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