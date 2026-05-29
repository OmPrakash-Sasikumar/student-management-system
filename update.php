<?php
include "db.php";

$id = $_POST['id'];
$name = $_POST['name'];
$roll = $_POST['roll'];
$dept = $_POST['dept'];
$dob = $_POST['dob'];
$phone = $_POST['phone'];
$address = $_POST['address'];
$marks = $_POST['marks'];

$sql = "UPDATE students SET 
        name='$name',
        roll='$roll',
        dept='$dept',
        dob='$dob',
        phone='$phone',
        address='$address',
        marks='$marks'
        WHERE id='$id'";

if(mysqli_query($conn, $sql)){
    echo "success";
}else{
    echo "error";
}
?>