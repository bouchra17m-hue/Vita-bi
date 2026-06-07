const AnimatedPageBackground = () => (
  <div className="animated-page-bg" aria-hidden="true">
    <video
      className="animated-page-bg__video animated-page-bg__video--blur"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    >
      <source src="/fitness-hero.mp4" type="video/mp4" />
    </video>
    <video
      className="animated-page-bg__video"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    >
      <source src="/fitness-hero.mp4" type="video/mp4" />
    </video>
    <div className="animated-page-bg__veil"></div>
  </div>
);

export default AnimatedPageBackground;
