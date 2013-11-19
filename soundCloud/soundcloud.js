var trackListing = $("#trackListing");
var playlist = $("#playlist");
var nowPlaying = $("#nowPlaying");
var position = $("#position");
var txtSearch = $("#search");
var btnSearch = $("#btnSearch");
var result;
var currentlyPlaying = 0;
var currentlyPlayingIndex;

SC.initialize({
    client_id: "5767b270b66866c7daa92392bab2762b",
    redirect_uri: "http://example.com/callback.html"
});

//for any li element in track listing (now or in the future)
$("#trackListing").on("click", "li", function(event) {
    var clickedElement = $(event.target);
    var arrayIndex =  clickedElement.data('index');
    var associatedData = result[arrayIndex];

    playlist.append( clickedElement.clone().data('trackID', associatedData.id) );

});

//for any li in playlist clicked
$("#playlist").on("click", "li", function(event) {
    
    var clickedElement = $(event.target);
    
    if(currentlyPlaying) currentlyPlaying.stop();
    
    nowPlaying.html("Now playing: " + clickedElement.html());
    
    currentlyPlayingIndex = clickedElement.index();
    
    playTrack(clickedElement.data('trackID'));
    
});

function playTrack(trackID) {
    SC.stream("/tracks/"+trackID, function(sound){
        currentlyPlaying = sound;
        currentlyPlaying.play({
            whileplaying: function() {
                //console.log(this.position / this.duration);
                position.val(this.position / this.duration);
            },
            onfinish: function() {
                currentlyPlayingIndex ++;
                console.log( currentlyPlayingIndex, playlist.children().length  );
                if( currentlyPlayingIndex < playlist.children().length ) {
                    console.log("hello");
                    var nextElement = playlist.find('li').eq(currentlyPlayingIndex);
                    console.log(nextElement);
                    console.log ( nextElement.html() );
                    
                    nowPlaying.html("Now playing: " + nextElement.html());
                    playTrack(nextElement.data("trackID") );
                }
            }
        });
    });
}

btnSearch.click(function() {
    //get search value
    var searchQuery = txtSearch.val();
    console.log(searchQuery);
    search(searchQuery);
});

function search(query) {
    SC.get("/tracks", {limit: 10, q: query }, function(tracks){
    
        //store tracks for use later
        result = tracks;
        
        console.log(result);
    
        //clear out track listing
        trackListing.empty();
        
        //loop through every track
        for(var i in tracks) {
            var curTrack = tracks[i];
            trackListing.append("<li data-index='"+i+"'>"+curTrack.title+"</li>");
        }
        
    });   
}