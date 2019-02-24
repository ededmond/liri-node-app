# liri-node-app
an app that will search Spotify for songs, Bands in Town for concerts, and OMDB for movies
There are 2 ways to use the app:
1. Type 'node liri' into the terminal. 
    Select the type of media you would like to search for (Song, band, or movie)
    
    Then type in the name of the song, band, or movie that you are searching for and press enter.
    
    Liri will print results both into the console window, and into a log.txt file
2. Type node liri and then one of 4 commands:
        'concert-this'
            followed by a band name
        'spotify-this-song'
            followed by the name of the song
        'movie-this'
            followed by the name of the movie
        'do-what-it-says'
    do-what-it-says will take input from the text file 'random.txt' and take that as the two arguments, separated by a ','
    
    Liri will print information about each of your queries into both the console and into a log.txt file. 
For a video of how this app works, see 'video-example'