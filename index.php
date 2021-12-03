<?php
$b = "<br>"; // so I don't have to keep typing it out 
// note, could use hidden fields to get the question information if needed

// prints out an associative array
function print_assoc($array)
{
   foreach ($array as $key => $value) 
   {
       echo "Key: $key; Value: $value"."<br>";
   }
}

// pass this $key from a post request coming from script.js. Will be formatted as questionXXX-
// will return the question plus all digits associated with it
function get_question($key)
{
    $firstIndex = 0;
    $lastIndex = 0;

    $extractedQuestion = "question";
    $questionNumber = "";

    // get the question number
    $firstIndex = strpos(strval($key),strval("question")) + 8;
    $lastIndex = strpos(strval($key),strval("-"));
    
    for($i = $firstIndex; $i < $lastIndex; $i++)
    {
        $extractedQuestion = $extractedQuestion . htmlspecialchars($key)[$i];
    }

    return $extractedQuestion;
}

function generate_query($array, $email, $tableName)
{
    $valueString = ""; // string of values we put into SQL 
    $columnString = "email,"; // string of cols we put into SQL
    foreach($array as $key => $value)
    {
        $valueString = $valueString."\"".$value."\"".",";
        $columnString = $columnString.$key.",";
    }
    $valueString = substr($valueString, 0, -1); // remove last comma
    $columnString = substr($columnString, 0, -1);

    return "INSERT INTO $tableName ($columnString) VALUES (\"$email\", $valueString)";
}

// returns true if email is in the key, and false if not 
function is_email($key)
{
    if(strval($key)=="email")
    {
        return true;
    }
    else 
    {
        return false;
    }
}

$clientHost = "localhost";
$clientUsrName = "root";
$clientPassWord = "";
$clientDBname = "Answers";

$tableName = "answers_Table";

$conn = mysqli_connect($clientHost, $clientUsrName, $clientPassWord,$clientDBname);

$email = "NONE";

$extractedQuestion = "";
$previousExtractedQuestion = "";

$extractedKey = "";

$sqlData = array();

// exit if the user didn't input an email




// loop through each post request and get names of questions, possibly email in a bit 
// this is to begin building an associative array of questions and emails, to create an SQL query
foreach ($_POST as $key => $value) 
{
    if(!is_email($key))
    {
        $extractedQuestion = get_question($key);
        
        // detect if we change question forms
        if($previousExtractedQuestion != $extractedQuestion)
        {
            $sqlData[strval($extractedQuestion)] = "";
            $previousExtractedQuestion = $extractedQuestion;
        }
    }
    else 
    {
        $email = $value;
    }
}


// now we simply match questions to their respective portion of the associative array, 
// and build it into a string that will later be inserted into sql
foreach ($_POST as $key => $value) 
{
    if(!is_email($key))
    {
        $extractedQuestion = get_question($key);
        $extractedKey = strval($value);

        // put commas in for the SQL string
        $sqlData[$extractedQuestion] = $sqlData[$extractedQuestion].$extractedKey.",";
    }
}

// now we remove the comma from the end of each associative array string, so we can simply drop
// the data into SQL  
foreach ($sqlData as $key => $value)
{
    if(!is_email($key))
    {
        $sqlData[$key] = substr($sqlData[$key], 0, -1);
    }
}


//print_assoc($sqlData);
$query = generate_query($sqlData, $email, $tableName);

$result = mysqli_query($conn, $query);



?>