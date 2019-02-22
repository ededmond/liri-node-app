require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require("moment");

const func = process.argv[2];
const query = process.argv.slice(3).join(" ");
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
            query = "The Sign"
        }
        spotify.search({type:"track",query:query},function(err,data) {
            if (err) {
                return console.log(err);
            }
            var song = data.tracks.items;
            console.log(song);
            // console.log("Artist(s):" + song.artists);
        })
        break;
    case "movie-this":
    case "do-what-it-says":
    default:
        console.log("Error: Unknown command");
}