<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1" import="java.sql.Connection, java.sql.DriverManager, java.sql.ResultSet,
    java.sql.SQLException, java.sql.Statement, java.util.Properties"
    %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
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
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Test EWC Codes</title>
</head>
<body>
<h1>Test EWC Codes</h1>
<%

try {
	 
	Class.forName("org.postgresql.Driver");

} catch (ClassNotFoundException e) {

	System.out.println("Where is your PostgreSQL JDBC Driver? "
			+ "Include in your library path!");
	e.printStackTrace();
	return;

}

String url = "jdbc:postgresql://localhost/envhack";
Properties props = new Properties();
props.setProperty("user", "postgres");
props.setProperty("password", "pa$$w0rd");
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
</body>
</html>