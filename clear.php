<?php
include "db.php";

$sql = "TRUNCATE TABLE students";

if(mysqli_query($conn, $sql)){
    echo "success";
}else{
    echo "error";
}
?>