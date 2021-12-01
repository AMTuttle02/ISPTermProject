<?php

// $hostname = "localhost";
// $username = "root";
// $pass = "";
// $dbName = "Answers";
// $tableName = "answers_Table";
// 
// $conn = mysqli_connect($hostname, $username, $pass, $dbName);

//echo $_POST["fuck me"];


foreach ($_POST as $key => $value) 
{
    echo "Field ".htmlspecialchars($key)." is ".htmlspecialchars($value)."<br>";
}
?>