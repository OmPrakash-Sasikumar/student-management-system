<?php
include "db.php";

if(isset($_POST['name'])){

    $name = $_POST['name'];
    $roll = $_POST['roll'];
    $dept = $_POST['dept'];
    $dob = $_POST['dob'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];
    $marks = $_POST['marks'];

    $sql = "INSERT INTO students (name, roll, dept, dob, phone, address, marks)
            VALUES ('$name', '$roll', '$dept', '$dob', '$phone', '$address', '$marks')";

    if(mysqli_query($conn, $sql)){
        echo "success";
    }else{
        echo "error";
    }

}else{
    echo "no data";
}
?>
