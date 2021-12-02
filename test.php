<?php


/*

for sql, go through each question and find the number and add "questionX"
make a hidden field to grab question from hidden field with post request 

1 loop to get all the questions [remove after]
1 loop to get all the answers 
*/

/*
$clientHost = "localhost";
$clientUsrName = "root";
$clientPassWord = "";
$clientDBname = "Answers";

$tableName = "answers_Table";

$conn = mysqli_connect($clientHost, $clientUsrName, $clientPassWord,$clientDBname);
*/

$extractedQuestion = "";
$firstIndex = 0;
$lastIndex = 0;
foreach ($_POST as $key => $value) 
{
    echo "Field ".htmlspecialchars($key)." is ".htmlspecialchars($value)."<br>";
    
    // get question from post request
    //$firstIndex = strpos(htmlspecialchars($key),"question" + 8);
    $firstIndex = strpos(strval($key),strval("question")) + 8;
    //$lastIndex = strpos(htmlspecialchars($key),"-");
    $lastIndex = strpos(strval($key),strval("-"));
    echo $firstIndex . "hi" . $lastIndex . "<br>";
    $extractedQuestion = "question";
    /*
    for($i = $firstIndex; $i < $lastIndex; $i++)
    {
        $extractedQuestion = $extractedQuestion . htmlspecialchars($key)[$i];
    }
    */
    //echo $extractedQuestion;
    // get key 

    // generate query 

    // cram into SQL 

    // repeat

}
?>