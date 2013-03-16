<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.* " %>
<%@ page import="java.io.*" %>
<%
try {
String driver = "org.postgresql.Driver";
String url = "jdbc:postgresql://localhost:5432/osm_england";
String username = "jeznicholson";
String password = "krtr,u1";
String myDataField = null;
String myQuery = "SELECT * FROM nodes LIMIT 1";
Connection myConnection = null;
PreparedStatement myPreparedStatement = null;
ResultSet myResultSet = null;
Class.forName(driver).newInstance();
myConnection = DriverManager.getConnection(url,username,password);
myPreparedStatement = myConnection.prepareStatement(myQuery);
myResultSet = myPreparedStatement.executeQuery();
if(myResultSet.next())
myDataField = myResultSet.getString("id");
out.print(myDataField);
}
catch(ClassNotFoundException e){e.printStackTrace();}
catch (SQLException ex)
{
out.print("SQLException: "+ex.getMessage());
out.print("SQLState: " + ex.getSQLState());
}
%>
