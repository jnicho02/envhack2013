<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.* " %>
<%@ page import="java.io.*" %>
<h1>List of companies</h2>
<ul>
<%
try {
  String driver = "org.postgresql.Driver";
  String url = "jdbc:postgresql://localhost:5432/geodb_1";
  String username = "postgres";
  String password = "password";

  String myQuery = "SELECT * FROM organisation limit 10";

  Connection myConnection = null;
  PreparedStatement myPreparedStatement = null;
  ResultSet myResultSet = null;
  Class.forName(driver).newInstance();
  myConnection = DriverManager.getConnection(url,username,password);
  myPreparedStatement = myConnection.prepareStatement(myQuery);
  myResultSet = myPreparedStatement.executeQuery();

  String id = null;
  while(myResultSet.next()) {
    id = myResultSet.getString("id");
    out.println("<li><a href='company.jsp?id="+id+"'>"+id+"</a></li>");
    }
  }

  catch(ClassNotFoundException e){e.printStackTrace();}
  catch (SQLException ex)
  {
    out.print("SQLException: "+ex.getMessage());
    out.print("SQLState: " + ex.getSQLState());
  }
  %>
</ul>

<p><a href='add_company.html'>add a company</a></p>