<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>ATK Service Dashboard</title>

<style>
body{
  font-family: Arial, sans-serif;
  background:#111;
  color:white;
  padding:20px;
}

h2,h3{margin-top:20px;}

input, textarea, select{
  display:block;
  margin:8px 0;
  padding:8px;
  width:300px;
  border-radius:6px;
  border:none;
}

textarea{height:70px;}

button{
  padding:8px 15px;
  margin-top:10px;
  cursor:pointer;
  border:none;
  border-radius:6px;
  background:#2196f3;
  color:white;
}

.selector{
  padding:10px;
  background:#333;
  cursor:pointer;
  border-radius:6px;
  width:300px;
  margin-top:5px;
}

.dropdown{
  display:none;
  flex-wrap:wrap;
  gap:6px;
  margin-top:10px;
}

.tag{
  padding:6px 10px;
  border-radius:20px;
  color:white;
  cursor:pointer;
  font-size:12px;
  margin:4px;
}

table{
  margin-top:20px;
  width:100%;
  border-collapse:collapse;
}

th,td{
  padding:6px;
  border:1px solid #444;
  font-size:12px;
}

</style>
</head>

<body>

<h2>ATK Service Dashboard</h2>

<div id="userEmail"></div>
<button id="logoutBtn">Logout</button>

<hr>

<input id="ticketId" readonly placeholder="Ticket ID">
<input id="name" placeholder="Customer Name">
<input id="phone" placeholder="Phone">
<input id="model" placeholder="Drone Model">

<!-- RC TYPE -->
<h3>RC Type</h3>
<div onclick="toggleRC()" class="selector">Select RC</div>
<div id="rcOptions" class="dropdown"></div>
<div id="rcSelected"></div>

<!-- ACCESSORIES -->
<h3>Accessories</h3>
<div onclick="toggleACC()" class="selector">Select Accessories</div>
<div id="accOptions" class="dropdown"></div>
<div id="accSelected"></div>

<textarea id="problem" placeholder="Problem Description"></textarea>

<input type="date" id="date">

<select id="status">
  <option value="Waiting">Waiting</option>
  <option value="In Progress">In Progress</option>
  <option value="Completed">Completed</option>
</select>

<button id="saveBtn">Save Ticket</button>

<hr>

<h3>Search Records</h3>
<input id="search" placeholder="Search by name / ticket / phone / date">

<table id="recordsTable" style="display:none;">
<thead>
<tr>
<th>Date</th>
<th>Ticket</th>
<th>Name</th>
<th>Model</th>
<th>RC</th>
<th>Accessories</th>
<th>Problem</th>
<th>Phone</th>
<th>Status</th>
<th>User</th>
</tr>
</thead>
<tbody id="results"></tbody>
</table>

<!-- IMPORTANT: MUST BE MODULE -->
<script type="module" src="app.js"></script>

</body>
</html>
