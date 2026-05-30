<?php
include "session.php";
include "db.php";

$total = mysqli_fetch_assoc(mysqli_query($conn, 
    "SELECT COUNT(*) as count FROM students"))['count'];

$avg = mysqli_fetch_assoc(mysqli_query($conn, 
    "SELECT AVG(marks) as avg_marks FROM students"))['avg_marks'];

$top = mysqli_fetch_assoc(mysqli_query($conn, 
    "SELECT name, marks FROM students ORDER BY marks DESC LIMIT 1"));

$names = [];
$marks = [];

$res = mysqli_query($conn, "SELECT name, marks FROM students");

while($row = mysqli_fetch_assoc($res)){
    $names[] = $row['name'];
    $marks[] = $row['marks'];
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>

    <link rel="stylesheet" href="style.css?v=2">

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

<h1>Dashboard</h1>

<div class="form-box">
    <h3>Total Students: <?php echo $total; ?></h3>
    <h3>Average Marks: <?php echo round($avg,2); ?></h3>
function goBack(){
    window.location.href = "index.html";
        Top Student: 
        <?php 
            if($top){
                echo $top['name'] . " (" . $top['marks'] . ")";
            } else {
                echo "N/A";
            }
        ?>
    </h3>
</div>

<canvas id="myChart" width="400" height="200"></canvas>

<br>

<button onclick="goBack()">Back</button>

<script>

let names = <?php echo json_encode($names); ?>;
let marks = <?php echo json_encode($marks); ?>;

let ctx = document.getElementById('myChart').getContext('2d');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: names,
        datasets: [{
            label: 'Student Marks',
            data: marks
        }]
    }
});

function goBack(){
    window.location.href = "index.php";
}

</script>

</body>
</html>