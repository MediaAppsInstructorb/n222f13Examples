var trackListing = $("#trackListing");
var playlist = $("#playlist");
var position = $("#position");
var result;
var currentlyPlayingSound;
var currentlyPlayingIndex;

SC.initialize({
    client_id: "3a0223a4404c4efe6133f785bc3cea54",
    redirect_url: "http://127.0.0.1"
});

$("#btnStop").click(function() {
    if(currentlyPlayingSound) {
        currentlyPlayingSound.stop();
    }
})

//when the search button is clicked...
$("#btnSearch").click(function() {
    //get the search value
    var searchValue = $("#txtSearch").val();
    
    //list the songs of that value
    listSongs(searchValue);
});

//this... plays a song
function playSong(trackID) {
    
    //make sure this sound exists
    if(currentlyPlayingSound) {
        //if it does, stop it
        currentlyPlayingSound.stop();
    }
    
    SC.stream("/tracks/"+trackID, function(sound){
      
        currentlyPlayingSound = sound;
        
        sound.play({
        whileplaying: function() {
            console.log(this.position / this.duration);
            position.val(this.position / this.duration);
        },
        onfinish: function() {
            //try to play next song
            currentlyPlayingIndex ++;
            
            //make sure there is a next song to play
            if(currentlyPlayingIndex < playlist.children().length ) {
                var nextElement = playlist.find('li').eq(currentlyPlayingIndex);
                
                //update the now playing HTML
                $("#txtNow").html("Now playing: " + nextElement.html() );

                //play the next song
                playSong(nextElement.data("trackID"));
            }
        }
      });
    });
}

//respond to a click on any list item in playlist
$("#playlist").on("click", "li", function(event) {
    
    var clickedElement = $(event.target);
    
    //update what is currently playing
    currentlyPlayingIndex = clickedElement.index();
    
    //get the associated track of the clicked element
    var trackID = clickedElement.data("trackID");
    
    //show the track title for "now playing"
    $("#txtNow").html(clickedElement.html());
    
    //play the selected song
    playSong(trackID);
});

//respond to a click on a list item in track listing
//for ANY LIST ITEM regardless of when it was added
$("#trackListing").on("click", "li", function(event) { 
    var clickedElement = $(event.target);
    
    //get index of the index of the data associated with clicked element
    var arrayIndex = clickedElement.data('index');
    
    //get the extra data from the result array
    var associatedData = result[arrayIndex];
    
    //make a clone //its the same but double
    var clonedElement = clickedElement.clone();
    
    //add some extra data to the cloned element
    //in specific, the trackID to ply whenever this item
    //is clicked
    clonedElement.data("trackID", associatedData.id );
    
    //add the track title to our playlist div
    playlist.append( clonedElement );
    
});

//lists songs for us
function listSongs(query) {
    SC.get("/tracks", { limit: 10, q: query }, function(tracks) {
        //store result for later
        result = tracks;
        
        //clear out track listing
        trackListing.empty();
        
        //populate new values
        for(var i in tracks) {
            var curTrack = tracks[i];
            
            trackListing.append(
                "<li data-index='"+i+"'>"+curTrack.title+"</li>"
            );
        }
    });
}

/*
SC.stream("/tracks/293", function(sound){
  sound.play();
});
*/