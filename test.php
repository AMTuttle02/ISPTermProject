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
$previousExtractedQuestion = "";
$extractedKey = "";
$firstIndex = 0;
$lastIndex = 0;

$valueArray = array(); //("hello, goodbye, pudding,", "cats, dogs, frogs", "sheep, cows, turkey")

$sqlCols = "";
$sqlValString = "";

foreach ($_POST as $key => $value) 
{
    

    $firstIndex = strpos(strval($key),strval("question")) + 8;
    $lastIndex = strpos(strval($key),strval("-"));

    $extractedQuestion = "question";
    
    for($i = $firstIndex; $i < $lastIndex; $i++)
    {
        $extractedQuestion = $extractedQuestion . htmlspecialchars($key)[$i];
    }
    
    $extractedKey = strval($value);
    //echo $extractedKey;
    // detect if 
    if($previousExtractedQuestion != $extractedQuestion)
    {
        $sqlValString = $sqlValString.$extractedKey.",";
        //$valueArray.push($sqlValString);
        array_push($valueArray, $sqlValString);
        $sqlValString = "";
        $sqlCols = $sqlCols.strval($extractedQuestion).","; // add question to the stack
        $previousExtractedQuestion = $extractedQuestion;
    }
    else 
    {
        $sqlValString = $sqlValString.$extractedKey.",";
        //echo $sqlValString;
    }
}



?>