
 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
     
     var clickHandler = function() {
        
        // ****MY ATTEMPT**** //
        var $songNumber = $(this);
         
        var $oldSongNumber = $songNumber.attr('data-song-number');
        
        if (currentlyPlayingSongNumber === null) {
            $songNumber.html(pauseButtonTemplate);
            currentlyPlayingSongNumber = $oldSongNumber;
            currentSongFromAlbum = currentAlbum.songs[$oldSongNumber - 1];
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === $oldSongNumber) {
            $songNumber.html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton)
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        } else if (currentlyPlayingSongNumber !== $oldSongNumber) {
            $songNumber.html(pauseButtonTemplate);
            $('.song-item-number[data-song-number=' + currentlyPlayingSongNumber + ']').html(currentlyPlayingSongNumber);
            currentlyPlayingSongNumber = $oldSongNumber;
            currentSongFromAlbum = currentAlbum.songs[$oldSongNumber - 1];
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

//var nextSong = function(song) {
//    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
//    
//    currentSongIndex = currentSongIndex + 1;
//    
//    if (currentSongIndex >= currentAlbum.songs.length) {
//        currentSongIndex = 0
//    };
//    
//    var prevSongIndex = currentlyPlayingSongNumber;
//    
//    var nextSongIndex = currentAlbum.songs[currentSongIndex + 1];
//    
//    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
//    
//    updatePlayerBarSong();
//    
//    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentSongIndex + '"]');
//    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + prevSongIndex + '"]');
//
//    $nextSongNumberCell.html(pauseButtonTemplate);
//    $lastSongNumberCell.html(prevSongIndex);
//};

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong();

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

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

    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

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

var $previousbutton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

var updatePlayerBarSong = function() {
    var $songBarSongTitle = $( 'h2.song-name' );
  
    var $songBarArtist = $( 'h2.artist-name' );
  
    var $songBarMobileTitle = $( 'h3.artist-song-mobile' );
  
    $songBarSongTitle.text(currentSongFromAlbum.title);
  
    $songBarArtist.text(currentAlbum.artist);
  
    $songBarMobileTitle.text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    
    $( '.main-controls .play-pause' ).html(playerBarPauseButton);
};


$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    
    $previousbutton.click(previousSong);
    $nextButton.click(nextSong);
});