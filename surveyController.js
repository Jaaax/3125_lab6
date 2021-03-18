// required packages
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var fs = require('fs');

// read the data file
function readData(){
    let dataRead = fs.readFileSync('data.json');
    let infoRead = JSON.parse(dataRead);
    return infoRead;
}

// read the data file
function writeData(info){
    data = JSON.stringify(info);
    fs.writeFileSync('data.json', data);
}

// update the data file, I use "name" to be equal to fruit, or animal or color
// to match with the file names
// I assume we always just add 1 to a single item
function combineCounts(name, value){
    // console.log(value);
    info = readData();
     // will be useful for text entry, since the item typed in might not be in the list
    var index;
    switch (name){
        case "effect": index=1;break;
        case "consistent": index=3;break;
        case "rate": index=4;break;
        case "advantage": index=5;break;
    }
    var found = 0;
    for (var i=0; i<info[index].length; i++){
        if (info[index][i][name] === value){
            info[index][i].count = parseInt(info[index][i].count) + 1;
            found = 1;
        }
    }
    if (found === 0){
        info[index].push({[name] : value, count: 1});
    }
    writeData(info);
}

function insert(n, value1, m, value2){
    // console.log(value);
    info = readData();
    if((n==="firstname")&& (m==="lastname")){
        info[0].push({[n]:value1, [m]:value2});
    }
    if((n==="impression")&&(m==="suggestion")){
        info[2].push({[n]:value1, [m]:value2});
    }
    writeData(info);
}

// This is the controler per se, with the get/post
module.exports = function(app){

    // when a user goes to localhost:3000/analysis
    // serve a template (ejs file) which will include the data from the data files
    app.get('/analysis', function(req, res){
        var people = readData("data")[0];
        var effect = readData("data")[1];
        var impression = readData("data")[2];
        var consistent = readData("data")[3];
        var rate = readData("data")[4];
        var advantage = readData("data")[5];
        res.render('showResults', {results: [people, effect, impression, consistent, rate, advantage]});
        console.log([people, effect, impression, consistent, rate, advantage]);
    });

    // when a user goes to localhost:3000/niceSurvey
    // serve a static html (the survey itself to fill in)
    app.get('/niceSurvey', function(req, res){
        res.sendFile(__dirname+'/views/niceSurvey.html');
    });

    // when a user types SUBMIT in localhost:3000/niceSurvey 
    // the action.js code will POST, and what is sent in the POST
    // will be recuperated here, parsed and used to update the data files
    app.post('/niceSurvey', urlencodedParser, function(req, res){
        console.log("hi");
        console.log(req.body);
        var json = req.body;
        for (var key in json){
            console.log(key + ": " + json[key]);
            // in the case of checkboxes, the user might check more than one
            switch (key){
                case "firstname": insert("firstname", json[key], "lastname", json["lastname"]); break;
                // for (var item in json[key]){
                //     combineCounts(key, json[key][item]);
                // }
                case "effect": combineCounts("effect", json[key]); break;
                case "impression": insert("impression", json[key], "suggestion", json["suggestion"]); break;
                case "consistent": combineCounts("consistent", json[key]); break;
                case "rate": combineCounts("rate", json[key]); break;
                case "advantage": 
                    console.log("length: " + json[key].length);
                    if((json[key].length>=1) && (json[key].length<=4)){
                        for (var item in json[key]){
                            combineCounts("advantage", json[key][item]);
                        }
                    }else{
                        combineCounts("advantage", json[key]);
                    }
            }
        }
        // mystery line... (if I take it out, the SUBMIT button does change)
        // if anyone can figure this out, let me know!
        res.sendFile(__dirname + "/views/niceSurvey.html");
    });
    

};