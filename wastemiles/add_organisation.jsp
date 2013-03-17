<%@ page import ="java.sql.*" %>
<%@ page import ="javax.sql.*" %>
<%
  String id=request.getParameter("id"); 
  String address=request.getParameter("address"); 
  String postcode=request.getParameter("postcode"); 
  String name=request.getParameter("name"); 
  String type=request.getParameter("type"); 

  Class.forName("org.postgresql.Driver");
  String url = "jdbc:postgresql://localhost:5432/geodb_1";
  String username = "postgres";
  String password = "password";

  java.sql.Connection con = DriverManager.getConnection(url,username,password);
  Statement st= con.createStatement(); 
  ResultSet rs; 
  int i=st.executeUpdate("insert into organisations (id,address,postcode,name,type,score) values     ('"+id+"','"+address+"','"+postcode+"','"+name+"','"+type+"', 0)"); 

response.sendRedirect("organisations.jsp");

%>


