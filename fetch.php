<?php
include "db.php";

$order = isset($_GET['order']) ? $_GET['order'] : 'DESC';

$sql = "SELECT * FROM students ORDER BY name $order";
$result = mysqli_query($conn, $sql);

while($row = mysqli_fetch_assoc($result)){

    $marks = $row['marks'];

    if($marks >= 90){
        $grade = "A";
    }elseif($marks >= 75){
        $grade = "B";
    }elseif($marks >= 50){
        $grade = "C";
    }else{
        $grade = "Fail";
    }

    if(!empty($row['dob']) && $row['dob'] != "0000-00-00"){
        $birthDate = new DateTime($row['dob']);
        $today = new DateTime();
        $age = $today->diff($birthDate)->y;
    }else{
        $age = "N/A";
    }

    echo "<li 
        onclick='showProfile(this)' 
        data-id='".$row['id']."' 
        data-full='".$row['name']."|".$row['roll']."|".$row['dept']."|".$row['dob']."|".$row['phone']."|".$row['address']."|".$row['marks']."|".$grade."|".$age."'
    >";

    echo $row['name'] . " | " . $row['roll'] . " | " . $row['dept'] . " | Grade: " . $grade;

    echo " 
    <button class='edit-btn' onclick=\"editStudent(event, this)\">Edit</button>
    <button class='delete-btn' onclick=\"deleteStudent(event, this)\">Delete</button>
    ";

    echo "</li>";
}
?>