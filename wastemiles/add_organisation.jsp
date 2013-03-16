<%@ page import ="java.sql.*" %>
<%@ page import ="javax.sql.*" %>
<%
  String user=request.getParameter("userid"); 
  session.putValue("userid",user); 
  String pwd=request.getParameter("pwd"); 
  String fname=request.getParameter("fname"); 
  String lname=request.getParameter("lname"); 
  String email=request.getParameter("email"); 
  Class.forName("org.postgresql.Driver");

  String url = "jdbc:postgresql://localhost:5432/geodb_1";
  String username = "postgres";
  String password = "password";

  java.sql.Connection con = DriverManager.getConnection(url,username,password);
  Statement st= con.createStatement(); 
  ResultSet rs; 
  int i=st.executeUpdate("insert into organisations values     ('"+user+"','"+pwd+"','"+fname+"',
'"+lname+"','"+email+"')"); 


%>
