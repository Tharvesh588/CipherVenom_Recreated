// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get the video player element
    const videoPlayer = document.querySelector(".video iframe");
  
    // Get play, pause, and reset buttons
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    const resetButton = document.getElementById("resetButton");
  
    // Play the video
    playButton.addEventListener("click", function () {
      videoPlayer.contentWindow.postMessage(
        '{"event":"command","func":"' + "playVideo" + '","args":""}',
        "*"
      );
    });
  
    // Pause the video
    pauseButton.addEventListener("click", function () {
      videoPlayer.contentWindow.postMessage(
        '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
        "*"
      );
    });
  
    // Reset the video (go back to the beginning)
    resetButton.addEventListener("click", function () {
      videoPlayer.contentWindow.postMessage(
        '{"event":"command","func":"' + "seekTo",
        "0s" + '","args":""}',
        "*"
      );
      videoPlayer.contentWindow.postMessage(
        '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
        "*"
      );
    });
  });
  