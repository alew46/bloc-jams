
 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
     
     var clickHandler = function() {
        
        // ****MY ATTEMPT**** //
        var $songNumber = $(this);
         
        var $oldSongNumber = $songNumber.attr('data-song-number');
        
        if (currentlyPlayingSongNumber === null) {
            $songNumber.html(pauseButtonTemplate);
            setSong($oldSongNumber);
//            currentlyPlayingSongNumber = $oldSongNumber;
//            currentSongFromAlbum = currentAlbum.songs[$oldSongNumber - 1];
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === $oldSongNumber) {
            $songNumber.html(playButtonTemplate);
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                $songNumber.html(pauseButtonTemplate);
            } else {
                currentSoundFile.pause();
                $songNumber.html(playButtonTemplate);
            };
        } else if (currentlyPlayingSongNumber !== $oldSongNumber) {
            $songNumber.html(pauseButtonTemplate);
            $('.song-item-number[data-song-number=' + currentlyPlayingSongNumber + ']').html(currentlyPlayingSongNumber);
            setSong($oldSongNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
//            currentlyPlayingSongNumber = $oldSongNumber;
//            currentSongFromAlbum = currentAlbum.songs[$oldSongNumber - 1];
            
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            
            updatePlayerBarSong();
        }
         
//         var songNumber = $(this).attr('data-song-number');
//
//         if (currentlyPlayingSong !== null) {
//             // Revert to song number for currently playing song because user started playing new song.
//             var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
//             currentlyPlayingCell.html(currentlyPlayingSong);
//         }
//         if (currentlyPlayingSong !== songNumber) {
//             // Switch from Play -> Pause button to indicate new song is playing.
//             $(this).html(pauseButtonTemplate);
//             currentlyPlayingSong = songNumber;
//         } else if (currentlyPlayingSong === songNumber) {
//             // Switch from Pause -> Play button to pause currently playing song.
//             $(this).html(playButtonTemplate);
//             currentlyPlayingSong = null;
//         }
            
     };
     
     var onHover = function(event) {
         
        var $this = $(this);
         
        var $songNumber = $this.find('.song-item-number');
         
        var $oldSongNumber = $songNumber.attr('data-song-number');
         
        if ($oldSongNumber !== currentlyPlayingSongNumber) {
             $songNumber.html(playButtonTemplate)
        };
         
     };
     
     var offHover = function(event) {
         
        var $this  = $(this);
         
        var $songNumber = $this.find('.song-item-number');
         
        var $oldSongNumber = $songNumber.attr('data-song-number');
        
         
        if ($oldSongNumber !== currentlyPlayingSongNumber) {
             $songNumber.html($oldSongNumber)
        };
         
     };
     
     $row.find('.song-item-number').click(clickHandler);
     
     $row.hover(onHover, offHover);
     
     return $row;
 };

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty()
    
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    };
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
           var seekBarFillRatio = this.getTime() / this.getDuration();
           var $seekBar = $('.seek-control .seek-bar');
            
           updateSeekPercentage($seekBar, seekBarFillRatio);
           setCurrentTimeInPlayerBar(this.getTime());
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
 
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
 
        updateSeekPercentage($(this), seekBarFillRatio);
        
        if ($(this).parent().hasClass('seek-control'))  {
            var ratioAsTime = seekBarFillRatio * currentSoundFile.getDuration();
            seek(ratioAsTime);
        } else {
            setVolume(seekBarFillRatio);
        }
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
 
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
 
            updateSeekPercentage($seekBar, seekBarFillRatio);

            if ($seekBar.parent().hasClass('seek-control'))  {
                var ratioAsTime = seekBarFillRatio * currentSoundFile.getDuration();
                seek(ratioAsTime);
            } else {
                setVolume(seekBarFillRatio);
            }
             
        });
 
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
 };


var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

    updatePlayerBarSong();

      var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    
      var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

//    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber)
    
//    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
      var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var playButtonTemplate = "<a class='album-song-button'><span class='ion-play'></span></a>";
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousbutton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

var updatePlayerBarSong = function() {
    var $songBarSongTitle = $( 'h2.song-name' );
  
    var $songBarArtist = $( 'h2.artist-name' );
  
    var $songBarMobileTitle = $( 'h3.artist-song-mobile' );
  
    $songBarSongTitle.text(currentSongFromAlbum.title);
  
    $songBarArtist.text(currentAlbum.artist);
  
    $songBarMobileTitle.text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
    
    $( '.main-controls .play-pause' ).html(playerBarPauseButton);
};

var setSong = function(songNumber) {
    if (currentSoundFile) {
         currentSoundFile.stop();
    };
    
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    
    setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume)
    } 
};

var getSongNumberCell = function(number) {
    
    var $songNumberElement = $('.song-item-number[data-song-number="' + number + '"]');
    
    return $songNumberElement;
    
};

var setCurrentTimeInPlayerBar = function(currentTime) {
    var $timeInBar = $('.current-time');
    
    $timeInBar.text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime) {
    var $totalTimeInBar = $('.total-time')
    
    $totalTimeInBar.text(filterTimeCode(totalTime))
};

var filterTimeCode = function(timeInSeconds) {
    var timeCode = parseFloat(timeInSeconds);
    
    var minutes = Math.floor(timeInSeconds / 60);
    
    var seconds = Math.floor(timeInSeconds % 60);
    
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    
    return minutes + ":" + seconds;
};


$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    
    $previousbutton.click(previousSong);
    $nextButton.click(nextSong);
});