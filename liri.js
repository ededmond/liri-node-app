require("dotenv").config();
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require("moment");
const inquirer = require("inquirer");

//get arguments
let command = process.argv[2];
let name = process.argv.slice(3).join(" ");
//search for them
if (command) { //if they asked something
    search(command,name);
} else { //ask them if they didn't
    ask();
}

//general search function
function search(func,query) {
    switch (func) {
        case "concert-this":
            let url = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp"
            // console.log(url);
            axios.get(url).then(response => {
                data =response.data;
                // JSON.stringify(response.data,0,2);
                if (response.data < 1) {
                    log("Sorry; no concerts found")
                } else {
                    let print = "";
                    for (let i=0; i < data.length;i++) {
                        print+= "\nVenue: " + data[i].venue.name;
                        print+= "\nLocation: " + data[i].venue.city + ", " + data[i].venue.country;
                        print+= "\nDate: " + moment(data[i].datetime).format("MM/DD/YYYY")+"\n";
                    }
                    //this is my function that prints to console and a file
                    log(print+"\n");
                }
            })
            break;
        case "spotify-this-song":
            if (!query) {
                query = "The-Sign"
            }
            spotify.search({type:"track",query:query},function(err,data) {
                if (err) {
                    return log("\n"+err+"\n\n");
                }
                let song = data.tracks.items;
                // console.log(song);
                let print = "\n";
                for (let i =0; i < song.length;i++) {
                    let artists = song[i].artists[0].name;
                    for (let j =0; j < song[i].artists.length;j++) {
                        artists+= ", "+song[i].artists[j].name;
                    }
                    print += [
                        `Artists: ${artists}`,
                        `Song Name: ${song[i].name}`,
                        `Preview: ${song[i].external_urls.spotify}`,
                        `Album: ${song[i].album.name}`
                    ].join('\n')+"\n\n";
                }
                log(print);
            })
            break;
        case "movie-this":
            if (!query) {
                query = "Mr.-Nobody"
            }
            let movieUrl = "http://www.omdbapi.com/?apikey=trilogy&t="+query.split(" ").join("-");//movies do not take spaces
            axios.get(movieUrl).then(response => {
                let data = response.data;
                let print = [
                    `Title: ${data.Title}`,
                    `Year: ${data.Year}`,
                    `IMDB Rating: ${data.Ratings[0].Value}`,
                    `Rotten Tomatoes Rating: ${data.Ratings[1].Value}`,
                    `Country: ${data.Country}`,
                    `Plot: ${data.Plot}`,
                    `Actors: ${data.Actors}`
                ].join("\n");
                log("\n"+print+"\n\n");
                
            }).catch(error => {
                log("\nSorry: movie not found\n\n");
            });
            break;
        case "do-what-it-says":
            fs.readFile("random.txt","utf8",function(err,data) {
                if (err) {
                    return console.log(err);
                }
                //searches for the value in the file
                if (data.split(",")[0] === "do-what-it-says") {
                    console.log("Error: cyclical function. Returning to default")
                    fs.writeFile("random.txt","movie-this,mr.-nobody",function(err) {
                        console.log(err);
                    });
                }
                search(data.split(",")[0],data.split(",")[1]);
            });
            break;
        default:
            log("\nError: Unknown command\n\n");
    }
}

//Uses inquirer rather than arguments
function ask() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to search for?",
            name : "command",
            choices:["Song","Band","Movie","From Text File"]
        }, {
            message: "Enter your search: ",
            name: "query"
        }
    ]).then(function(response,error) {
        if (error){
            return console.log(error);
        }
        let command;
        switch (response.command) {
            case "Song":
                command = "spotify-this-song";
                break;
            case "Band":
                command = "concert-this";
                break;
            case "Movie":
                command = "movie-this";
                break;
            case "From Text File":
                command = "do-what-it-says";
                break;
            default :
                console.log("MASSIVE ERROR SHOULD NEVER HAPPEN");
        }
        search(command,response.query);
    })
}

function log(string) {
    console.log(string);
    fs.appendFile("log.txt",string+"------------------\n",err => {
        if (err) {
            return console.log(err);
        }
    })
}