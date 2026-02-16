export default function About() {
  return (
    <section className="page">
      <div className="page-title">
        <h2>About</h2>
        <p>Information about this application.</p>
      </div>

      <div className="card about-card">
        <p>
          Weather Israel is a weather application that lets you check the current
          weather conditions for cities across Israel. Data is fetched in
          real-time from the WeatherAPI service.
        </p>
        <div className="about-details">
          <div>
            <span>Developer</span>
            <strong>Mordehai Levy</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>mordehai.levy@gmail.com</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>Full Stack Developer</strong>
          </div>
          <div>
            <span>Stack</span>
            <strong>React · TypeScript · Vite</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
