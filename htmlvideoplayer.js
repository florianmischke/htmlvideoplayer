(function( $ ){
  $.fn.hvp = function() {
    var hvpVideoPlayer = this.closest('.hvp-player')
    var hvpVideoId = this.attr('id')
    var hvpVideoElement = document.getElementById(hvpVideoId);

    var hvpNotificationArea = hvpVideoPlayer.find('.hvp-notificationarea')

    var loadedProgressBar = hvpVideoPlayer.find('.hvp-progess-bar-loaded')
    var progressBar = hvpVideoPlayer.find('.hvp-progess-bar-progess')
    var hvpSeekBar = hvpVideoPlayer.find('.hvp-seek-bar')

    var hvpPlayButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-play"]')
    var hvpPauseButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-pause"]')

    var hvpVolumeButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-volume"]')
    var hvpVolumeBar = hvpVideoPlayer.find('.hvp-volume-bar')

    var hvpRewindButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-rewind"]')
    var hvpSkipButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-skip"]')

    var hvpPreviousButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-previous"]')
    var hvpBackwardButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-backward"]')
    var hvpForwardButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-forward"]')
    var hvpNextButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-next"]')

    var hvpFullscreenButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-fullscreen"]')

    if(!this.prop('autoplay')) {
      hvpVideoPlayer.find('.hvp-player-controls').hide()
      $('<button type="button" class="hvp-button" data-toggle="hvp-start"><i class="far fa-play-circle"></i></button>').appendTo(hvpVideoPlayer)
    }

    hvpVideoPlayer.on('click','.hvp-button[data-toggle="hvp-start"]',function() {
      hvpVideoPlayer.find('.hvp-player-controls').show()
      hvpVideoElement.play()
      $(this).remove()
    })

    function hvpNotify(string, type = 'info') {
      var notification = $('<div class="hvp-notification" />')
      var icon = '<i class="fas fa-info-circle"></i>'
      notification.html(icon + ' ' + string)
      hvpNotificationArea.prepend(notification)
      setTimeout(function() {
        notification.fadeOut(750, function() {
          $(this).remove()
        })
      }, 2000)
    }

    function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return false;
    }

    hvpVideoElement = $.extend(hvpVideoElement, {
      playPause: function(forcePause = false) {
        if(!this.paused || forcePause) {
          this.pause()
          hvpPauseButton.attr('hidden',true).attr('aria-hidden',true)
          hvpPlayButton.attr('hidden',false).attr('aria-hidden',false)
        } else {
          this.play()
          hvpPlayButton.attr('hidden',true).attr('aria-hidden',true)
          hvpPauseButton.attr('hidden',false).attr('aria-hidden',false)
        }
      }
    })

    $(hvpVideoElement).click(function() {
      hvpVideoElement.playPause()
    })

    hvpPlayButton.click(function() {
      hvpVideoElement.playPause()
    })

    hvpPauseButton.click(function() {
      hvpVideoElement.playPause()
    })

    function setVolumeButton() {
      if($(hvpVideoElement).prop('muted') || hvpVideoElement.volume == 0) {
        var volumeClass = hvpVolumeButton.attr('data-mute')
      } else if(hvpVideoElement.volume > 0.5){
        var volumeClass = hvpVolumeButton.attr('data-up')
      } else {
        var volumeClass = hvpVolumeButton.attr('data-down')
      }
      hvpVolumeButton.children('i').attr('class',false).addClass(volumeClass)
    }

    function setVolume() {
      var volume = getCookie('hvpVolume')
      if(!volume) {
        setCookie('hvpVolume', hvpVideoElement.volume, 365)
        volume = hvpVideoElement.volume
      }
      hvpVideoElement.volume = volume
      hvpVolumeBar.val(volume*100)

      var muted = getCookie('hvpMuted')
      if(muted == 'true') {
        $(hvpVideoElement).prop('muted',true)
      } else {
        $(hvpVideoElement).prop('muted',false)
      }
      setVolumeButton()
    }
    setVolume()

    function mute_unmute() {
      if($(hvpVideoElement).prop('muted')) {
        $(hvpVideoElement).prop('muted',false)
        setCookie('hvpMuted', 'false', 365)
      } else {
        $(hvpVideoElement).prop('muted',true)
        setCookie('hvpMuted', 'true', 365)
      }
      setVolumeButton()
    }

    hvpVolumeButton.click(mute_unmute)

    hvpVolumeBar.change(function() {
      $(hvpVideoElement).prop('muted',false)
      setCookie('hvpMuted', 'false', 365)
      hvpVideoElement.volume = hvpVolumeBar.val() / 100
      setCookie('hvpVolume', hvpVideoElement.volume, 365)
      setVolumeButton()
    })

    function volumeUp(val = 5) {
      hvpNotify('Increased volume by 5')
      newVolume = parseInt(hvpVolumeBar.val()) + val
      hvpVolumeBar.val(newVolume)
      hvpVolumeBar.change()
    }

    function volumeDown(val = 5) {
      hvpNotify('Decreased volume by 5')
      newVolume = parseInt(hvpVolumeBar.val()) - val
      hvpVolumeBar.val(newVolume)
      hvpVolumeBar.change()
    }

    function rewindFiveSeconds() {
      hvpNotify('Rewound 5 seconds')
      hvpVideoElement.currentTime -= 5
    }

    function skipFiveSeconds() {
      hvpNotify('Skipped 5 seconds')
      hvpVideoElement.currentTime += 5
    }

    hvpRewindButton.click(rewindFiveSeconds)
    hvpSkipButton.click(skipFiveSeconds)

    function updateProgressBar() {
      var percentage = ((100 / hvpVideoElement.duration) * hvpVideoElement.currentTime)
      progressBar.val(percentage).html(percentage + '% played')
      hvpSeekBar.val(percentage)
    }

    $(hvpVideoElement).on('timeupdate', function() {
      updateProgressBar()
    })

    function updateLoadingProgressBar() {
      var range = 0
      var bf = hvpVideoElement.buffered
      var time = hvpVideoElement.currentTime

      while(!(bf.start(range) <= time && time <= bf.end(range))) {
        range += 1
      }
      var loadStartPercentage = bf.start(range) / hvpVideoElement.duration
      var loadEndPercentage = bf.end(range) / hvpVideoElement.duration
      var loadPercentage = loadEndPercentage - loadStartPercentage
      loadedProgressBar.val(loadPercentage*100).html(loadPercentage*100 + '% played')
    }

    $(hvpVideoElement).on('progress', function() {
      updateLoadingProgressBar()
    })

    hvpSeekBar.change(function() {
      var time = hvpVideoElement.duration * (hvpSeekBar.val() / 100)
      hvpVideoElement.currentTime = time
    })

    hvpSeekBar.mousedown(function() {
      hvpVideoElement.playPause(true)
    })

    hvpSeekBar.mouseup(function() {
      hvpVideoElement.playPause()
    })

    hvpPreviousButton.click(function() {
    })
    hvpBackwardButton.click(function() {
      hvpVideoElement.playbackRate = hvpVideoElement.playbackRate / 1.5
      hvpNotify('Playback rate set to ' + Math.round(hvpVideoElement.playbackRate*100) + '%')
    })
    hvpForwardButton.click(function() {
      hvpVideoElement.playbackRate = hvpVideoElement.playbackRate * 1.5
      hvpNotify('Playback rate set to ' + Math.round(hvpVideoElement.playbackRate*100) + '%')
    })
    hvpNextButton.click(function() {
    })

    function toggleFullscreen() {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        var fullscreenButtonClass = hvpFullscreenButton.attr('data-enter-fullscreen')
      } else {
        element = hvpVideoPlayer[0]
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        }
        var fullscreenButtonClass = hvpFullscreenButton.attr('data-exit-fullscreen')
      }
      hvpFullscreenButton.children('i').attr('class',false).addClass(fullscreenButtonClass)
    }

    hvpFullscreenButton.on('click', function(){
      toggleFullscreen()
    })

    $(hvpVideoElement).dblclick(function() {
      toggleFullscreen()
    })

    $(document).keypress(function(e) {
      switch(e.originalEvent.code) {
        case 'ArrowUp':
          e.preventDefault()
          volumeUp()
          break;
        case 'ArrowDown':
          e.preventDefault()
          volumeDown()
          break;
        case 'ArrowLeft':
          e.preventDefault()
          rewindFiveSeconds()
          break;
        case 'ArrowRight':
          e.preventDefault()
          skipFiveSeconds()
          break;
        case 'KeyM':
          e.preventDefault()
          mute_unmute()
          break;
        case 'Space':
        case 'KeyK':
          e.preventDefault()
          hvpVideoElement.playPause()
          break;
        case 'Enter':
          e.preventDefault()
          toggleFullscreen()
          break;
        default:
          break;
      }
    })
  }
})( jQuery );
