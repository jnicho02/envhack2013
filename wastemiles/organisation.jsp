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
              <li class="active"><a href="/wastemiles">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">
    
    
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
  Class.forName(driver).newInstance();
  myConnection = DriverManager.getConnection(url,username,password);
  myPreparedStatement = myConnection.prepareStatement(myQuery);
  myResultSet = myPreparedStatement.executeQuery();
  if(myResultSet.next())
    out.print("<h2>Company " + myResultSet.getString("name") + "</h2>");
    out.print("<p>Address " + myResultSet.getString("address") + "<br/>");
    out.print("postcode " + myResultSet.getString("postcode") + "<br/>");
    out.print("type " + myResultSet.getString("type") + "</p>");
    out.print("<h2>Score</h2>@");
    out.print("");
    out.print("<h2>List of transactions for this company</h2>");
  }
  catch(ClassNotFoundException e){e.printStackTrace();}
  catch (SQLException ex)
  {
    out.print("SQLException: "+ex.getMessage());
    out.print("SQLState: " + ex.getSQLState());
  }
%>
<p><a href="organisations.jsp">All organisations</a></p>


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
