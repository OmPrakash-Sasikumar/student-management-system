<?php
include "db.php";

$id = $_POST['id'];

$sql = "DELETE FROM students WHERE id='$id'";

if(mysqli_query($conn, $sql)){
    echo "success";
}else{
    echo "error";
}
?>