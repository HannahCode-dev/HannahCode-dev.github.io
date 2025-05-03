document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    const videoId = extractYouTubeVideoId(video.src);
    if (videoId) {
      const iframe = document.createElement('iframe');
      iframe.width = video.width || 640;
      iframe.height = video.height || 360;
      iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&autoplay=0`;
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      video.parentNode.replaceChild(iframe, video);
    }
  });
});

function extractYouTubeVideoId(url) {
  if (!url) return null;
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
}
