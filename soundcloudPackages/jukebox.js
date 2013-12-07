(function () {
    
    var Jukebox = function(playlistRef, positionRef, SC) {
        
        var me = this;
        
        //declare variables that will be used by this object
        this.currentlyPlayingSound = 0;
        this.currentlyPlayingIndex = 0;
        this.playlist = $(playlistRef);
        this.position = $(positionRef);
        this.sc = SC;
        
        //respond to a click on any list item in playlist
        this.playlist.on("click", "li", function(event) {
            
            var clickedElement = $(event.target);
            
            //update what is currently playingthi
            this.currentlyPlayingIndex = clickedElement.index();
            
            //get the associated track of the clicked element
            var trackID = clickedElement.data("trackID");
            
            //show the track title for "now playing"
            $("#txtNow").html(clickedElement.html());
            
            me.playSong(trackID);
        });
        
    }
    
    Jukebox.prototype.playNext = function() {
        //try to play next song
        this.currentlyPlayingIndex ++;
        
        //make sure there is a next song to play
        if(this.currentlyPlayingIndex < this.playlist.children().length ) {
            var nextElement = this.playlist.find('li').eq(this.currentlyPlayingIndex);
            
            //update the now playing HTML
            $("#txtNow").html("Now playing: " + nextElement.html() );

            //play the next song
            this.playSong(nextElement.data("trackID"));
        }
    }
    
    Jukebox.prototype.stop = function() {
        if(this.currentlyPlayingSound) {
            this.currentlyPlayingSound.stop();
        }
    }
    
    Jukebox.prototype.playSong = function (trackID) {
    
        var me = this;
        
        //make sure this sound exists
        if(me.currentlyPlayingSound) {
            //if it does, stop it
            me.currentlyPlayingSound.stop();
        }
        
        this.sc.stream("/tracks/"+trackID, function(sound){
          
            me.currentlyPlayingSound = sound;
            
            sound.play({
                whileplaying: function() {
                    me.position.val(this.position / this.duration);
                },
                onfinish: function() {
                    me.playNext();
                }
            });
        });
    }
    
    window.Jukebox = Jukebox;
    
})();