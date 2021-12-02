<?php

// $hostname = "localhost";
// $username = "root";
// $pass = "";
// $dbName = "Answers";
// $tableName = "answers_Table";
// 
// $conn = mysqli_connect($hostname, $username, $pass, $dbName);

//echo $_POST["fuck me"];

/*

for sql, go through each question and find the number and add "questionX"
make a hidden field to grab question from hidden field with post request 

1 loop to get all the questions [remove after]
1 loop to get all the answers 
*/

foreach ($_POST as $key => $value) 
{
    echo "Field ".htmlspecialchars($key)." is ".htmlspecialchars($value)."<br>";
}
?>