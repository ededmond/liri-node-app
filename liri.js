require("dotenv").config();
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require("moment");

//get arguments
const command = process.argv[2];
let name = process.argv.slice(3).join("-");
//search for them
search(command,name);
function search(func,query) {
    switch (func) {
        case "concert-this":
            let url = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp"
            console.log(url);
            axios.get(url).then(response => {
                data =response.data;
                // JSON.stringify(response,0,2);
                if (response.data < 1) {
                    console.log("Sorry; no concerts found")
                } else {
                    for (let i=0; i < data.length;i++) {
                        console.log("Venue: " + data[i].venue.name);
                        console.log("  Location: " + data[i].venue.city + ", " + data[i].venue.country);
                        console.log("  Date: " + moment(data[i].datetime).format("MM/DD/YYYY"))
                    }
                }
            })
            break;
        case "spotify-this-song":
            if (!query) {
                query = "The-Sign"
            }
            console.log(`\n`);
            spotify.search({type:"track",query:query},function(err,data) {
                if (err) {
                    return console.log(err);
                }
                let song = data.tracks.items;
                // console.log(song);
                for (let i =0; i < song.length;i++) {
                    let artists = song[i].artists[0].name;
                    for (let j =0; j < song[i].artists.length;j++) {
                        artists+= ", "+song[i].artists[j].name;
                    }
                    let print = [
                        `Artists: ${artists}`,
                        `Song Name: ${song[i].name}`,
                        `Preview: ${song[i].external_urls.spotify}`,
                        `Album: ${song[i].album.name}`
                    ].join('\n');
                    console.log(print +"\n\n");
                }
            })
            break;
        case "movie-this":
            if (!query) {
                query = "Mr.-Nobody"
            }
            console.log(`\n`);
            let movieUrl = "http://www.omdbapi.com/?apikey=trilogy&t="+query;
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
                console.log(print);
            })
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
            console.log("Error: Unknown command");
    }
}
