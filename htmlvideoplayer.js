jQuery(function($) {

  var hvpVideoPlayer = $('.hvp-player').first()
  var hvpVideoId = hvpVideoPlayer.find('video').attr('id')
  var hvpVideoElement = document.getElementById(hvpVideoId);

  var progressBar = $('.hvp-progess-bar-progess')
  var hvpSeekBar = $('.hvp-seek-bar')

  var hvpPlayButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-play"]')
  var hvpPauseButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-pause"]')

  var hvpVolumeButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-volume"]')
  var hvpVolumeBar = hvpVideoPlayer.find('.hvp-volume-bar')

  var hvpFullscreenButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-fullscreen"]')

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
  setVolumeButton()

  hvpVolumeButton.click(function() {
    if($(hvpVideoElement).prop('muted')) {
      $(hvpVideoElement).prop('muted',false)
    } else {
      $(hvpVideoElement).prop('muted',true)
    }
    setVolumeButton()
  })

  hvpVolumeBar.change(function() {
    $(hvpVideoElement).prop('muted',false)
    hvpVideoElement.volume = hvpVolumeBar.val() / 100
    setVolumeButton()
  })

  function updateProgressBar() {
    var percentage = ((100 / hvpVideoElement.duration) * hvpVideoElement.currentTime)
    progressBar.val(percentage).html(percentage + '% played')
    hvpSeekBar.val(percentage)
  }

  $(hvpVideoElement).on('timeupdate', function() {
    updateProgressBar()
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
})
