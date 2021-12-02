const draggable_list = document.getElementById('draggable-list');
const check = document.getElementById('check');
var globalStyle = "";

// global counting variables that get incremented when form elements are generated, so they
// can be specially marked by PHP
// question count 
questionCount = 0; 
// form element count 
formElementCount = 0;

// array of elements in correct order
const elementArr = [
    `<h1 id="header">Heading</h1>`,
    `<p id="texty">Description</p>`,
    `<button>Submit</button>`
];

// array of elements maintaining the original order
const XelementArr = [
    `<h1 id="header">Heading</h1>`,
    `<p id="texty">Description</p>`,
    `<button>Submit</button>`
];

// store the list items
//const listItems = [];
let listItems = [];

let dragStartIndex;

// call create list
createList();

// insert list items 
function createList() {
    listItems = [];
    [...elementArr] // spread operator makes a copy of the array
        .forEach((obj, index) => {
            //alert(index);

            // creating new listitem element to insert into the DOM
            const listItem = document.createElement('li');

            // adding attribute to listItem, setting it to index
            listItem.setAttribute('data-index', index);

            listItem.innerHTML = `
                <div class="draggable" draggable="true">
                    <div id="buttons">
                        <button class="edit" onclick="editTab(${index})"> Edit </button>
                        <button class="edit" id="dropper" onclick="dropTab(${index})"> Delete </button>
                    </div>
                    ${obj}
                    <i class="fas fa-grip-lines"></i>
                </div>
            `;

            //alert(listItem.innerHTML);

            listItems.push(listItem);

            draggable_list.appendChild(listItem);
        });

    addEventListeners();
}

function dragStart() {
    dragStartIndex = this.closest('li').getAttribute('data-index');
    // console.log(dragStartIndex);
}

function dragEnter() {
    this.classList.add('over');
}

function dragLeave() {
    this.classList.remove('over');
}

function dragOver(e) {
    e.preventDefault();
}

function dragDrop() {
    const dragEndIndex = +this.getAttribute('data-index');
    swapItems(dragStartIndex, dragEndIndex);

    this.classList.remove('over');
}

// swap drag and drop list items
function swapItems(fromIndex, toIndex) {
    //alert("bring on the swap");
    const itemOne = listItems[fromIndex].querySelector('.draggable');
    const itemTwo = listItems[toIndex].querySelector('.draggable');

    // swap the elements in the elementsArr
    [elementArr[fromIndex], elementArr[toIndex]] = [elementArr[toIndex], elementArr[fromIndex]];


    listItems[fromIndex].appendChild(itemTwo);
    listItems[toIndex].appendChild(itemOne);
}

function genPage() {
    // create a string containing the html for the page
    var newPage = "";
    for (var i = 0; i < elementArr.length; i++) {
        // add each array element to the string containing the new page
        newPage += elementArr[i];
    }

    var newWin = open('url', 'yourForm', height = 500, width = 500);
    newWin.document.write(newPage);
}

// edit an element
function editTab(currIndex) {
    //alert(currIndex);
    var markup = XelementArr[currIndex];
    var markupCopy = markup;
    var originalIndex = currIndex;  // represents the index location in XelementArr
    var elmLoc = -1;
    var elmType = "";

    // current list item from button click
    //alert(XelementArr[currIndex]);

    // find that element in the elementArr
    for (var i = 0; i < elementArr.length; i++) {
        if (elementArr[i] == XelementArr[currIndex]) {
            // this is the element we are looking for !
            elmLoc = i;
            break;
        }
    }

    // problem finding the right index...
    if(elmLoc == -1)
    {
        alert("Error :(");
    }

    // array of id tags for text elements
    var textArr = [`id="header"`, `id="texty"`, `id="subtit"`];
    var multiArr = [`radio`, `checkbox`, `<select>`];

    // scan the html element to get the type
    for(var i = 0; i < textArr.length; i++)
    {
        if(markup.includes(textArr[i]))
        {
            //alert("contains");
            // match found, record the type
            elmType = textArr[i];

            // if it is a plain text type
            if(elmType == `id="header"` || elmType == `id="texty"` || elmType == `id="subtit"`)
            {
                editTextElm(elmType, markup, markupCopy, originalIndex, elmLoc);
            }

            return;
        }

    }
    
    for(var i = 0; i < multiArr.length; i++)
    {
        if(markup.includes(multiArr[i]))
        {
            if(!markup.includes("<select>"))
            {
                // either a checkbox or radio button form element
    
                // get the title of the form 
                let thisTitle = markupCopy.substring(7, markupCopy.indexOf("<br>"));
                thisTitle = prompt("Edit question title", thisTitle);    
                var inputString = `<input`;
    
                var inputLines = [];
                var i = -1;
                while ((i = markupCopy.indexOf(inputString, i+1)) != -1)
                {
                    let substringyy = markupCopy.substring(i);
                    substringyy = substringyy.substring(0, substringyy.indexOf("<br>") + 4);
                    
                    inputLines.push(substringyy);
                }

                // all of the options are in an array
                for(let i = 0; i < inputLines.length; i++)
                {
                    // get the index value from that line
                    let optionStringy = `name="option"`;
                    let starter = inputLines[i].indexOf(`name="option"`) + optionStringy.length + 1;
                    let ender = inputLines[i].indexOf("<br>");

                    let tempVal = inputLines[i].substring(starter, ender);      // option value

                    let tempPrompt = prompt(`Edit option ${i+1}`, tempVal);     // prompt where user can update the option
                    
                    // contents changed
                    if(tempPrompt != tempVal) {
                        // if there was a change, update the contents in the array
                        inputLines[i] = inputLines[i].replace(tempVal, tempPrompt);
                        inputLines[i] = inputLines[i].replace(tempVal, tempPrompt);
                    }
                }

                markupCopy = `<form> ${thisTitle} <br> `;
                for(let i = 0; i < inputLines.length; i++)
                {
                    markupCopy += inputLines[i];
                }
                markupCopy += `</form>`;

                //alert(markupCopy);

                // replace the contents for both arrays
                elementArr[elmLoc] = markupCopy;             // replace for elementArr
                XelementArr[originalIndex] = markupCopy;     // replace for XelementArr

                // recreate the page
                draggable_list.innerHTML = '';
                createList();
                return;

            } else {
                // a drop down form

                // get the title of the question
                let thisTitle = markupCopy.substring(4, markupCopy.indexOf("<select>")-4);

                // check if user wants to change the title
                thisTitle = prompt("Edit title", thisTitle);

                // get the options
                var inputLines = [];
                var inputString = `<option`;
                var i = -1;

                // store all the options lines into an array
                while ((i = markupCopy.indexOf(inputString, i+1)) != -1)
                {
                    let substringyy = markupCopy.substring(i);
                    substringyy = substringyy.substring(0, substringyy.indexOf("</option>") + 9);
                    
                    inputLines.push(substringyy);
                    //alert(substringyy);
                }

                // loop through the array and ask the user if they would like to change the input
                for(let i = 0; i < inputLines.length; i++)
                {
                    //alert(inputLines[i]);
                    // get the index value from that line
                    let optionStringy = `name="option">`;
                    let starter = inputLines[i].indexOf(optionStringy) + optionStringy.length;
                    let ender = inputLines[i].indexOf("</option>");

                    let tempVal = inputLines[i].substring(starter, ender);      // option value

                    // if the contents don't match, edit
                    let tempPrompt = prompt("Edit option", tempVal);
                    
                    // check if there was a change
                    if(tempVal != tempPrompt)
                    {
                        // there was a change, update for the array
                        inputLines[i] = inputLines[i].replace(tempVal, tempPrompt);
                    }
                }

                // rebuild the markup from this information
                alert(thisTitle);
                markupCopy = `<br> ${thisTitle} <br> <select>`;

                for(let i = 0; i < inputLines.length; i++)
                {
                    markupCopy += inputLines[i];
                }
                
                markupCopy += `</select>`;

                alert("im here");
                // replace the contents for both arrays
                elementArr[elmLoc] = markupCopy;             // replace for elementArr
                XelementArr[originalIndex] = markupCopy;     // replace for XelementArr

                // recreate the page
                draggable_list.innerHTML = '';
                createList();
                return;
            }
            // found a question type that gets multiple inputs
            //alert(markup);
        }
    }

    // get the links again for these elements
    if(markup.includes(`title="YouTube`) || markup.includes(`<img src="`))
    {
        var linky;
        var newMarkup;
        
        if(markup.includes(`title="YouTube`))
        {
            linky = prompt("Edit Video URL");
            // need to convert this link to embed link
            let goodLinky = linky.replace("watch?v=", "embed/");
            newMarkup = `<iframe width="560" height="315" src="${goodLinky}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
            linky = prompt("Edit Image URL");
            newMarkup = `<img src=${linky} alt="image" width="500">`;
        }

        // replace the contents for both arrays
        elementArr[elmLoc] = newMarkup;             // replace for elementArr
        XelementArr[originalIndex] = newMarkup;     // replace for XelementArr

        // recreate the page
        draggable_list.innerHTML = '';
        createList();
        return;
    }

    // array of box style elements
    var boxElems = [`id="TextBox"`, `type="date"`, `type="number"`];
    for(var i = 0; i < boxElems.length; i++)
    {
        if(markup.includes(boxElems[i]))
        {
            // read in the markup to get the text - the key is <p>
            // store substring of everything after the text 
            var first = markup.indexOf("<p>") + 3;
            var second = markup.indexOf("</p>")
            var currTit = markup.substring(first, second);

            // prompt with the existing text
            var newTit = prompt("Edit title", currTit);

            // add text
            var firstString = markup.substring(0, first);   // string of first half
            var secondString = markup.substring(second);    // string of second half
            var newMarkup = firstString + newTit + secondString;
            
            // update and return
            // replace the contents for both arrays
            elementArr[elmLoc] = newMarkup;             // replace for elementArr
            XelementArr[originalIndex] = newMarkup;     // replace for XelementArr

            // recreate the page
            draggable_list.innerHTML = '';
            createList();
            return;
        }
    } 
    //alert(elmType);
}

function editTextElm(elmType, markup, markupCopy, originalIndex, elmLoc)
{
    // find the start of id="header"
    var startScrape = markup.indexOf(elmType);
    var startStyle = '';
    var endStyle = '';
    
    // add length of id="header", adding spaces for the >
    startScrape += (elmType.length + 1);
    endScrape = markupCopy.lastIndexOf("<");

    var beforeInput = markupCopy.substring(0, startScrape); // collect the part of the element before the user input
    var afterInput = markupCopy.substring(endScrape);
    var the_input = markupCopy.substring(startScrape, endScrape);

    // prompt the user for text to replace the existing text
    var newText = prompt("Edit", the_input);

    // building the new markup
    var newMarkup = beforeInput + newText + afterInput;

    // ask the user if they would like to style the element
    var proceed = confirm("Do you want to style the element?");

    if(proceed) {
    // check if the variable is set
    if(globalStyle == "")
    {
        alert("No style was selected. Choose one from the options below to apply it.");
    } else {
        // creating the new markup for style
    
        if(globalStyle.includes("="))
        {
            // styles that include '=' are handled different because they are not just tags that go in front and behind the element!
            if(newMarkup.includes(`style="`))
            {
                // array containing all of the possible styles
                let styleArr = [`color: red; font-weight: bold;`, `border: 2px solid black; padding: 4px;`, `background-color: yellow;`];

                // get the style attributes that the user is trying to include
                for(let i = 0; i < styleArr.length; i++)
                {
                    if(globalStyle.includes(styleArr[i]))
                    {
                        // remove from markup
                        newMarkup = newMarkup.replace(styleArr[i], '');
                        break;
                    }
                }
            } else {
                // there is not currently a style, add it
                let insertSpot = (newMarkup.split('"', 2).join('"').length) + 1;
                newMarkup = newMarkup.slice(0, insertSpot) + " " + globalStyle + newMarkup.slice(insertSpot);
            }

        } else {
            // get the pre and post style tags
            startStyle = globalStyle.replace('/', '');
            endStyle = globalStyle;
        
                // check if the proposed style tag is already present in the string
                if(markup.includes(globalStyle))
                {
                    // if it is already included, remove the style
                    newMarkup = newMarkup.replace(startStyle, '');
                    newMarkup = newMarkup.replace(endStyle, '');
                } else {
                    // add the style tags to the start and end
                    newMarkup = startStyle + newMarkup + endStyle;
                }
            
            }
        }
    }

    //alert(newMarkup);
    elementArr[elmLoc] = newMarkup;             // replace for elementArr
    XelementArr[originalIndex] = newMarkup;     // replace for XelementArr

    // clear the div
    draggable_list.innerHTML = '';

    // call the create list function
    createList();
}

// editing the global style variable
function addStyle(input)
{
    globalStyle = input;
    alert("Click 'edit' on the text element that you wish to add this styling to");
    scrollTop();
}

// delete an element
function dropTab(currIndex) {
    //alert(currIndex);
    var originalIndex = currIndex;  // represents the index location in XelementArr
    var elmLoc = -1;

    // find that element in the elementArr
    for (var i = 0; i < elementArr.length; i++) {
        if (elementArr[i] == XelementArr[currIndex]) {
            // this is the element we are looking for !
            elmLoc = i;
            break;
        }
    }

    // problem finding the right index...
    if(elmLoc == -1)
    {
        alert("Error :(");
    }

    // check one last time to make sure that they want to delete the element
    var proceed = confirm("Are you sure you want to delete this element?");
    if(proceed) {
        // delete element
        // delete elements from both arrays and refresh the page
        elementArr.splice(elmLoc, 1);
        XelementArr.splice(originalIndex, 1);

        // clear the div
        draggable_list.innerHTML = '';

        // call the create list function
        createList();
    }
}

function addEventListeners() {
    const draggables = document.querySelectorAll('.draggable');
    const dragListItems = document.querySelectorAll('.draggable-list li');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
    })

    dragListItems.forEach(item => {
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
    })

}

check.addEventListener('click', genPage);

// create the element
function getElement() {
    var id = $('input[name=header]:checked').attr('id');
    alert(id);
}

// function called from the button click in the element box
// this will open up html text element form
function addHTMLelm(type) {
    if(type == 'header') {
        let headerText = prompt("Enter the title that you would like to add");
        let markup = `<h1 id="header">` + headerText + "</h1>";
        addTab(markup);
    } else if (type == 'subtit') {
        let subtitText = prompt("Enter subtitle");
        let markup = `<h3 id="subtit">${subtitText}</h3>`;
        addTab(markup);
    } else if (type == 'text') {
        let texty = prompt("Enter text");
        let markup = `<p id="texty">${texty}</p>`;
        addTab(markup);
    } else if (type == 'link') {
        let linky = prompt("Enter the link");
        let texty = prompt("Enter the text for the link");
        let markup = `<a href='${linky}' id="linkylink">${texty}</a>`;
        addTab(markup);
    } else if (type == 'image') {
        let linky = prompt("Enter the image source");
        let desc = prompt("Enter a description of the image");
        let markup = `<br><img src="${linky}" alt="${desc}" width="500"><br>`;
        addTab(markup);
    } else if (type == 'YTvid') {
        let linky = prompt("Video URL");
        
        // need to convert this link to embed link
        let goodLinky = linky.replace("watch?v=", "embed/");
        let markup = `<iframe width="560" height="315" src="${goodLinky}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        addTab(markup);
    } else if (type == 'break') {
        let markup = "<br>";
        addTab(markup);
    } 
    scrollTop();
}

// will scroll to the top of page
function scrollTop() {
    document.documentElement.scrollTo({top: 100, left: 100, behavior: 'smooth'});
}

// add a form element
function addFormElm(type) {
    //alert(type);
    if(type == 'dropDown') {
        var formy = document.getElementById("getUserForm");
        formy.style.visibility = "visible";
    } else if(type == 'button') {
        let buttonTit = prompt("Button Title");
        let buttonLink = prompt("Button Link");
        let markup = "<button onclick='window.open(" + '"' + buttonLink + '"' +")'>" + buttonTit + "</button>";
        addTab(markup);
    } else if(type == 'check') {
        // function call to get the user input for the check box
        var formy = document.getElementById("getUserForm");
        formy.style.visibility = "visible";
    } else if(type == 'textbox') {
        questionCount += 1;
        formElementCount += 1;
        let yourPrompt = prompt("Enter the prompt for your text box");
        //let markup = "<p>" + yourPrompt + "</p>" + '<input type="text" id="TextBox" name="TextBox">';
        let markup =   `<br><label name=question${questionCount}>${yourPrompt}</label><br> <input type="text" id=q${questionCount}-option${formElementCount} name=q${questionCount}-option${formElementCount}>`;
        addTab(markup);
    } else if(type == 'radioButtons') {
        // function call to get the user input for the radio buttons
        var formy = document.getElementById("getUserForm");
        formy.style.visibility = "visible";
    } else if(type == 'datebox') {
        //alert(type);
        questionCount += 1;
        formElementCount += 1;
        let yourPrompt = prompt("Enter the prompt for the date field");
        let markup = `<br><label name=question${questionCount}>${yourPrompt}</label><br> <input type="date" id=q${questionCount}-option${formElementCount} name=q${questionCount}-option${formElementCount}>`;
        addTab(markup);
    } else if(type == 'number') {
        questionCount += 1;
        formElementCount += 1;
        let yourPrompt = prompt("Enter your number prompt");
        let markup = `<br><label name=question${questionCount}>${yourPrompt}</label><br><input type="number" id=q${questionCount}-option${formElementCount} name=q${questionCount}-option${formElementCount}>`;
        addTab(markup);
    }
    scrollTop();
}

function gotRows() {
    // after the input is sent, make the form invisible
    var formy = document.getElementById("getUserForm");
    formy.style.visibility = "hidden";

    // get the data
    var options = []; // create array

    // get the title of the question
    var questionTitle = document.getElementById("qTitle").value;

    // get the type of form element
    var formType = document.querySelector('input[name=formOption]:checked').value;
    //alert(formType);

    // initialize the string that will contain the html
    var markup = ``;

    // push data to the array
    options.push(document.getElementById("option1").value);
    options.push(document.getElementById("option2").value);
    options.push(document.getElementById("option3").value);
    options.push(document.getElementById("option4").value);

    if(formType == "select")
    {
        questionCount += 1;

        // drop down code here 
        markup = `<br><label name=question${questionCount}> ${questionTitle} </label><br>`;
        markup += `<select name="q${questionCount}" id="q${questionCount}">`
        //alert(markup);
        for(var i = 0; i < options.length; i++)
        {
            if(options[i] != "")
            {
                formElementCount += 1;
                //markup += `<option value="${i}" name="option">${options[i]}</option>`;
                markup += `<option id=q${questionCount}-option${formElementCount} name=q${questionCount}-option${formElementCount} value="${options[i]}">${options[i]}</option>`

            }
        }

        // adding the closing tag
        markup += `</select>`;
        //alert(markup);
    } else {
        // radio button or checkbox code here
        // create the markup from those elements
        //markup = `<form> ${questionTitle}`;
        
        questionCount += 1; 
        markup = `<br><label name=question${questionCount}> ${questionTitle} </label> `;
        
        for(var i = 0; i < options.length; i++)
        {
            if(options[i] != "")
            {
                formElementCount += 1;
                markup +=  `<br> <input type="${formType}" id=q${questionCount}-option${formElementCount} name=q${questionCount}-option${formElementCount} value="${options[i]}">${options[i]}`;
            }
        }
        // closing form tags
        //markup += `<br> </form>`;
        markup += `<br>`;
    }

    // checking
    //alert(markup);

    // add the element here
    addTab(markup);
}

// add a tab to the list
function addTab(info) {
    // get input from the user
    //info = prompt('Type Here');

    elementArr.push(info);
    XelementArr.push(info);

    // clear the div
    draggable_list.innerHTML = '';

    // call the create list function
    createList();
}


// dont touch ^


/*
    This function is used to download a file. It takes a filename(with extension) and the contents of file as parameters. 
    Function propmpts the download window to pop up
*/
function download(filename, text) {
    var element = document.createElement('a');
    element.style.display = 'none';

    // defind the data of the file
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));

    element.setAttribute('download', filename);
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/*
    This function wil use the array of elements that the user created with drag and drop form generator to create .html, .php, and .sql files
    that they can use to build their four tier web application

    OUTPUT: formMaker.html, formMaker.php, formMaker.sql
    ----------------------------------------------------
*/
function builderFunction()
{
    var formName = prompt("Enter the name of this form");

    /* ADDITIONAL THINGS TO KEEP TRACK OF */
    // Brad: make sure that <form> tags are removed from the individual elements because keeping them in there will make the form entry stop
    // Brad: make 'help videos' for each of the pages and link them to a button of a question mark on each page
    // All: there is a requirement for users to be able to upload a .csv file for their database. I think that we could allow users to upload a file containing the email addresses of the users that are allowed to complete the form. 
        //^This could then serve as a primary key for tuples in the answer table of the database

    /****************************************************************************************************************************************************************************************************************/
    /* Build the HTML File for the form
    /****************************************************************************************************************************************************************************************************************/
    /*
        - link to the PHP file
        - set the title for the page
        - set the starting and closing form tags with action (POST)
        - read in all of the html elements from the elementArr array and add to the html
    */

    var htmlContents = "";   // string will contain the entire text for the html document that will be built
    var formString = "";     // string containing all html elements in order from the generator

    for(let i = 0; i < elementArr.length; i++)
    {
        formString += elementArr[i];
    }

    alert(formString);

    var htmlFileName = "formMaker.html";

    // get the html contents for the header
    htmlContents = `<html lang="eng">
                        <title>${formName}</title>
                        <body>
                        <form method="post" action="test.php">`;

    // add all the form elements to contents string
    htmlContents += formString;

    // add the closing html contents
    htmlContents += `</form>
                    </body>
                    </html>`;

    download(htmlFileName, htmlContents);   // build and download the html file





    /****************************************************************************************************************************************************************************************************************/
    /* Build the PHP File for the form
    /****************************************************************************************************************************************************************************************************************/
    /*
        - get the database info from the user so that a connection can be made to the client's DB of choice
        - Function to handle when a form is submitted by a user
            ~ Collect the info from the form <- this is the main thing
            ~ Use that info to build an sql query to add the info to answersTable
            ~ Execute the sql query
    */
    var phpFileName = "formMaker.php";      // name of the php file
    var phpFileContents = "";               // string will contain the entire text for the php document 

    // get info about the port, username, password, and dbname from the user
    let clientHost = "";
    let clientUsrName = "";
    let clientpassWord = "";
    let clientDBname = "";

    // connect to that db 

    // download(phpFileName, phpContents);  // build and download the php file




    /***************************************************************************************************************************************************************************************************************/
    /* Build the SQL File
    /* ~ This file will build a database(if that's possible) and a table called answersTable that will contain the answers that the users provide
    /***************************************************************************************************************************************************************************************************************/
    /*
        - Create a table that will contain answers of the user's questions
        - Easiest way to do this is to create an array containing objects of each element of the elementArr. To build the sql database with this file, parse through that array and add lines of sql that can hold each question
        - Challenges:
            ~ How to hold the information for 'checkbox' style questions that can have up to 4 selections
            ~ Converting the elements array to a table format
    */

    var sqlFileName = "formMaker.sql";
    var sqlContents = "CREATE DATABASE IF NOT EXISTS Answers; USE Answers; DROP TABLE IF EXISTS answers_Table; CREATE TABLE answers_Table( email VARCHAR(100) PRIMARY KEY,";

    var formString = ""; // holds table rows
    var questionTotal = 1; // used for total number of questions on form

    // traverses element array to add total amount of rows needed for each question
    for (let i = 0; i < elementArr.length; i++) {
        if (elementArr[i].indexOf('type') > -1) { // if there is a question
            formString += " question";
            formString += questionTotal;
            questionTotal += 1;
            formString += " VARCHAR(100),";
        }
    }

    sqlContents += formString;
    sqlContents = sqlContents.slice(0, -1);
    sqlContents += ");"

    alert(sqlContents); // alert user of file contents

    download(sqlFileName, sqlContents);  // build and download the sql file
}

/*
 * Create a table of users that the admin can upload with a CSV file to define a table of 'authorizedUsers'
*/
var csvParsedArray = "";
$(document).on('click', '#btnUploadFile', function () { // Runs on click of upload button
    if ($("#fileToUpload").get(0).files.length == 0) { // no file uploaded
        alert("Please upload the file first.");
        return;
    }
    let fileUpload = $("#fileToUpload").get(0);
    let files = fileUpload.files;
    if (files[0].name.toLowerCase().lastIndexOf(".csv") == -1) { // incorrect file type
        alert("Please upload only CSV files");
        return;
    }
    let reader = new FileReader();
    let bytes = 50000;
    reader.onloadend = function (evt) { // find necessary values in file
        let lines = evt.target.result;
        if (lines && lines.length > 0) {
            let line_array = CSVToArray(lines);
            if (lines.length == bytes) {
                line_array = line_array.splice(0, line_array.length - 1);
            }
            var columnArray = [];
            for (let i = 0; i < line_array.length; i++) {
                let cellArr = line_array[i];
                for (var j = 0; j < cellArr.length; j++) {
                    if (i == 0) {
                        columnArray.push(cellArr[j].replace('﻿', ''));
                    }
                    else {
                        csvParsedArray += cellArr[j] + " ";
                    }
                }
            }
        }

        // Create sql file
        var sqlFileName = "authorizedUsers.sql";
        var sqlContents = "CREATE DATABASE IF NOT EXISTS Answers; USE Answers; DROP TABLE IF EXISTS authorized_Users; CREATE TABLE authorized_Users(username VARCHAR(100), email VARCHAR(100) PRIMARY KEY); INSERT INTO authorized_Users VALUES ";
        
        var formString = "";
        var username = "";
        var email = "";
        var i = 0;
        while (csvParsedArray.indexOf(' ') != -1) { // continues until all values have been added to query
            // username
            let x = csvParsedArray.indexOf(' '); 
            username = csvParsedArray.substr(0, x);
            csvParsedArray = csvParsedArray.substr(x + 1);

            // email
            x = csvParsedArray.indexOf(' ');
            email = csvParsedArray.substr(0, x);
            csvParsedArray = csvParsedArray.substr(x + 1);

            // end row
            formString += "('" + username + "', '" + email + "'), ";
        }
        sqlContents += formString;
        sqlContents = sqlContents.slice(0, -2);
        sqlContents += ";"

        alert(sqlContents); // show user file contents

        download(sqlFileName, sqlContents);  // build and download the sql file
    }
    let blob = files[0].slice(0, bytes);
    reader.readAsBinaryString(blob);
});

function CSVToArray(strData, strDelimiter) { // performs conversion from csv file to readable data
    strDelimiter = (strDelimiter || ",");
    let objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );
    let arrData = [[]];
    let arrMatches = null;
    while (arrMatches = objPattern.exec(strData)) {
        let strMatchedDelimiter = arrMatches[1];
        let strMatchedValue = [];
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            arrData.push([]);
        }
        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
        } else {
            strMatchedValue = arrMatches[3];
        }
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    return (arrData);
}
