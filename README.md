# README ZamanyaVis: Online Lifestyle Explorer

## Project Description
This is a Fitbit Dashboard where the user can upload his personal activity data and see the trends related to the different attributes as well as use data visualization tools like t-SNE on the entire dataset.

## Table of Contents
* [Programming Language Requirements](#programmingLanguageRequirements)
* [Downloading personal Data](#downloadingPersonalData)
* [Server Setup](#serverSetup)
* [Application Loading](#applicationLoading)

## Programming Language Requirements    <a name="programmingLanguageRequirements"></a>
Use the latest version of:- HTML5, CSS3, JavaScript

## Downloading personal Data    <a name="downloadingPersonalData"></a>
This Dashboard has the functionality to assess your personal data. In order to do that, we must first download the data from Fitbit.

To do that, first go to the [Fitbit Webpage](https://www.fitbit.com/)

Click on the gear icon on the top right => Settings => Data Export

Customize the data attributes you want; File Format : CSV; and press download

**NOTE**: _For Testing purposes, please use the CSV files present in the_ `dataFiles` _folder_

## Server Setup    <a name="serverSetup"></a>
To serve some of the static files, we will have to use Node.js to create a server.

To do that, first download the latest version of [Node.js](https://nodejs.org/en/)

Then in command prompt type the following command:

* ```npm install http-server -g```

Now to navigate to the directory that holds the code for the application, type the command:

* ```cd (file path for the directory)``` 
for example: cd C:\Reuben\QCRI\QCRI Summer 2021\ZamanyaVis Project Application

Finally, to launch the server, type the command:
* ```http-server .```

Your prompt must look like this:

![](/image/sample.png "Server Prompt.")

Open the URL at which the application is being served.
In this case: http://192.168.56.1:8080

The `index.html` file should open automatically.

For More details on how to setup a server using Node.js, please follow the instructions at **[Video Link](https://www.youtube.com/watch?v=nHU2NC4vXDs)**

## Application Loading    <a name="applicationLoading"></a>
The Dashboard Home Screen looks like this

![](/image/sample.png "Dashboard Home.")

Click the “Upload your Files” button, and upload all your downloaded files at once

![](/image/sample.png "File Upload.")

Your Dashboard will be fully loaded with your data.

