<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1" import="java.sql.Connection, java.sql.DriverManager, java.sql.ResultSet,
    java.sql.SQLException, java.sql.Statement, java.util.Properties"
    %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<script>
function submitEwc1(source)
{
	document.getElementById("ewc_1").value = source.value;
	document.getElementById("ewc_2").value = null;
	document.getElementById("ewc_3").value = null;
	var form = document.getElementById("ewc_form");
	form.submit();
}

function submitEwc2(source)
{
	document.getElementById("ewc_2").value = source.value;
	document.getElementById("ewc_3").value = null;
	var form = document.getElementById("ewc_form");
	form.submit();
}

function submitEwc3(source)
{
	document.getElementById("ewc_3").value = source.value;
	var form = document.getElementById("ewc_form");
	form.submit();
}

function getEwcSelectedValue(source)
{
	var e = source;
	return e.options[e.selectedIndex].value;
}
</script>
<head>
  <meta charset="utf-8">
  <title>Waste Miles Home</title>
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
								<!-- start: font -->
								<link href='http://fonts.googleapis.com/css?family=Monda' rel='stylesheet' type='text/css'>
								<!-- end: font -->  
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
        <a class="brand" href="#">Waste Miles</a>
        <div class="nav-collapse collapse">
          <ul class="nav">
            <li class="active"><a href="/wastemiles">Home</a></li>
            <li><a href="organisations.jsp">High Scores</a></li>
            <li><a href="opportunities.jsp">Opportunities</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>
  </div>

  <div class="container">

      <div class="hero-unit">
	    <h2>Opportunities</h2>
	    <p>Use the map to identify 'bad' waste transactions, e.g. those that score badly as they get sent directly
		to landfill, are discharged directly to air or to water</p>
		<p>There may be clusters of transactions that lead to a possible new site somewhere else in the country</p>
  </div>
<%

try {
	 
	Class.forName("org.postgresql.Driver");

} catch (ClassNotFoundException e) {

	System.out.println("Where is your PostgreSQL JDBC Driver? "
			+ "Include in your library path!");
	e.printStackTrace();
	return;

}

String url = "jdbc:postgresql://localhost:5432/geodb_1";
Properties props = new Properties();
props.setProperty("user", "postgres");
props.setProperty("password", "password");
Connection conn = null;
System.out.println("Connection OK");

// Get a statement from the connection
ResultSet rs = null;
Statement stmt = null;

String targetEwc1 = request.getParameter("ewc_1");
String targetEwc2 = request.getParameter("ewc_2");
String targetEwc3 = request.getParameter("ewc_3");

String fromClause= "FROM public.\"EWC\" ewc2";
String whereClause = " WHERE ewc2.\"PARENT_ID\" is null";
%>
<form name="ewc_form" id="ewc_form" action="EwcTest.jsp">
<input type="hidden" name="ewc_1" id="ewc_1" value="<%= targetEwc1 %>"/>
<input type="hidden" name="ewc_2" id="ewc_2" value="<%= targetEwc2 %>"/>
<input type="hidden" name="ewc_3" id="ewc_3" value="<%= targetEwc3 %>"/>
<select name="ewc_select_1" id="ewc_select_1" onChange="javascript:submitEwc1(this);">

<%

try {
	conn = DriverManager.getConnection(url, props);
	stmt = conn.createStatement();

	// Execute the query
	String queryString = "SELECT ewc2.\"CONCATENATED_CODE\", ewc2.\"DESCRIPTION\" " +
			fromClause +
			whereClause +
			" order by ewc2.\"CONCATENATED_CODE\" ASC;";
			
	System.out.println("Query 1: " + queryString);
	rs = stmt.executeQuery(queryString);

	// Loop through the result set
	String selectedString = null;
	while (rs.next())
	{
		System.out.println(rs.getString(1) + ", " + rs.getString(2));
		if (rs.getString(1).equals(targetEwc1)) selectedString = "selected";
		else selectedString = "";
	%>
  <option value="<%=rs.getString(1)%>" <%= selectedString%>><%=rs.getString(2).toLowerCase()%></option>
	<%
	}
} catch (SQLException e) {
	// TODO Auto-generated catch block
	e.printStackTrace();
} finally {
	// Close the result set, statement and the connection
	try {
		if (rs != null)
			rs.close();

		if (stmt != null)
			stmt.close();
		if (conn != null)
			conn.close();

	} catch (SQLException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
}
%>
</select>
<br />
<select name="ewc_select_2" id="ewc_select_2" onChange="javascript:submitEwc2(this);">

<%
	fromClause="FROM public.\"EWC\" ewc1, public.\"EWC\" ewc2";
	whereClause = " WHERE ewc1.\"CONCATENATED_CODE\" = '" +
			targetEwc1 + "' AND " +
			"ewc2.\"PARENT_ID\" = ewc1.\"ID\"" +
					" order by ewc2.\"CONCATENATED_CODE\" ASC";

try {
	conn = DriverManager.getConnection(url, props);
	stmt = conn.createStatement();

	// Execute the query
	String queryString = "SELECT ewc2.\"CONCATENATED_CODE\", ewc2.\"DESCRIPTION\" " +
			fromClause +
			whereClause;
			
	System.out.println("Query 2: " + queryString);
	rs = stmt.executeQuery(queryString);

	// Loop through the result set
	String selectedString = null;
	while (rs.next())
	{
		System.out.println(rs.getString(1) + ", " + rs.getString(2));
		if (rs.getString(1).equals(targetEwc2)) selectedString = "selected";
		else selectedString = "";
	%>
  <option value="<%=rs.getString(1)%>" <%= selectedString%>><%=rs.getString(2)%></option>
	<%
	}
} catch (SQLException e) {
	// TODO Auto-generated catch block
	e.printStackTrace();
} finally {
	// Close the result set, statement and the connection
	try {
		if (rs != null)
			rs.close();

		if (stmt != null)
			stmt.close();
		if (conn != null)
			conn.close();

	} catch (SQLException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
}
%>
</select>
<br />
<select name="ewc_select_3" id="ewc_select_3" onChange="javascript:submitEwc3(this);">

<%
	fromClause="FROM public.\"EWC\" ewc1, public.\"EWC\" ewc2";
	whereClause = " WHERE ewc1.\"CONCATENATED_CODE\" = '" +
			targetEwc2 + "' AND " +
			"ewc2.\"PARENT_ID\" = ewc1.\"ID\"" +
					" order by ewc2.\"CONCATENATED_CODE\" ASC";

try {
	conn = DriverManager.getConnection(url, props);
	stmt = conn.createStatement();

	// Execute the query
	String queryString = "SELECT ewc2.\"CONCATENATED_CODE\", ewc2.\"DESCRIPTION\" " +
			fromClause +
			whereClause;
			
	System.out.println("Query 3: " + queryString);
	rs = stmt.executeQuery(queryString);

	// Loop through the result set
	String selectedString = null;
	while (rs.next())
	{
		System.out.println(rs.getString(1) + ", " + rs.getString(2));
		if (rs.getString(1).equals(targetEwc3)) selectedString = "selected";
		else selectedString = "";
	%>
  <option value="<%=rs.getString(1)%>" <%= selectedString%>><%=rs.getString(2)%></option>
	<%
	}
} catch (SQLException e) {
	// TODO Auto-generated catch block
	e.printStackTrace();
} finally {
	// Close the result set, statement and the connection
	try {
		if (rs != null)
			rs.close();

		if (stmt != null)
			stmt.close();
		if (conn != null)
			conn.close();

	} catch (SQLException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
}
%>
</select>

</form>

<iframe src="webmap/webApp.html?requestType=transactions&ewc=XYZ" width="100%" height="500"></iframe>


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

</body></html>
