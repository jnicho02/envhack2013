<%@ page import ="java.sql.*" %>
<%@ page import ="javax.sql.*" %>
<%
  String id=request.getParameter("id"); 
  String to_id=request.getParameter("to_id"); 
  String from_id=request.getParameter("from_id"); 
  String quantity=request.getParameter("quantity"); 
  String ewc_type=request.getParameter("ewc_type"); 
  String date=request.getParameter("date"); 
  
  Integer score=0;

  Class.forName("org.postgresql.Driver");
  String url = "jdbc:postgresql://localhost:5432/geodb_1";
  String username = "postgres";
  String password = "password";

  java.sql.Connection con = DriverManager.getConnection(url,username,password);
  Statement st= con.createStatement(); 
  ResultSet rs; 
  int i=st.executeUpdate("insert into transactions (id,to_id,from_id,quantity,ewc_type,date,score) values     ('"+id+"','"+to_id+"','"+from_id+"','"+quantity+"','"+ewc_type+"','"+date+"','"+score+"')"); 

  response.sendRedirect("organisation.jsp?id="+from_id);

%>


