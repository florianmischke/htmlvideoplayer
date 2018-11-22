jQuery(function($) {

  var hvpVideoPlayer = $('.hvp-player').first()
  var hvpVideoId = hvpVideoPlayer.find('video').attr('id')
  var hvpVideoElement = document.getElementById(hvpVideoId);
  var hvpPlayButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-play"]')
  var hvpPauseButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-pause"]')
  var hvpFullscreenButton = hvpVideoPlayer.find('.hvp-button[data-toggle="hvp-fullscreen"]')

  hvpVideoElement = $.extend(hvpVideoElement, {
    playPause: function() {
      if(this.paused) {
        this.play()
        hvpPlayButton.attr('hidden',true).attr('aria-hidden',true)
        hvpPauseButton.attr('hidden',false).attr('aria-hidden',false)
      } else {
        this.pause()
        hvpPauseButton.attr('hidden',true).attr('aria-hidden',true)
        hvpPlayButton.attr('hidden',false).attr('aria-hidden',false)
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

  hvpFullscreenButton.on('click', function(){
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
    } else {
      element = hvpVideoPlayer
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    }
  });
})
