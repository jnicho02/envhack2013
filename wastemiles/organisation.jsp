<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.* " %>
<%@ page import="java.io.*" %>
<h2>Company <%= request.getParameter("id") %></h2>
<%
try {
  String driver = "org.postgresql.Driver";
  String url = "jdbc:postgresql://localhost:5432/geodb_1";
  String username = "postgres";
  String password = "password";
  String myDataField = null;

  String id=request.getParameter("id"); 

  String myQuery = "SELECT * FROM organisation WHERE id='"+id+"'";

  Connection myConnection = null;
  PreparedStatement myPreparedStatement = null;
  ResultSet myResultSet = null;
  Class.forName(driver).newInstance();
  myConnection = DriverManager.getConnection(url,username,password);
  myPreparedStatement = myConnection.prepareStatement(myQuery);
  myResultSet = myPreparedStatement.executeQuery();
  if(myResultSet.next())
    myDataField = myResultSet.getString("geom");
    out.print(myDataField);
  }
  catch(ClassNotFoundException e){e.printStackTrace();}
  catch (SQLException ex)
  {
    out.print("SQLException: "+ex.getMessage());
    out.print("SQLState: " + ex.getSQLState());
  }
%>

<h2>List of transactions for this company</h2>