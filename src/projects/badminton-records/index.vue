<script>
export default { name: "ProjectBadmintonRecords" };
</script>

<template>
  <div class="proj-content">
    <section class="proj-section">
      <h2>Overview</h2>
      <p>
        A match archive for U.S. Talence Badminton, the club I play at. We film
        our games and post them on YouTube. This site turns those videos into
        matches you can browse: every rally is tagged, the score sits on top of
        the video, and the best points can be cut into a highlight film.
      </p>
    </section>

    <section class="proj-section">
      <h2>What it does</h2>
      <ul>
        <li>
          Imports the club's YouTube uploads as matches. Re-running the import
          is safe and never overwrites a match that's already been tagged.
        </li>
        <li>
          A keyboard-driven tagger for logging a match rally by rally. Every key
          can be rebound, and it handles AZERTY layouts properly.
        </li>
        <li>
          A scoreboard drawn over the video that follows playback, so it never
          shows a score the viewer hasn't reached yet
        </li>
        <li>
          Player lookup against the French federation's public records, which
          widens its search from our roster to the club to all of France
        </li>
        <li>
          <strong>Reel</strong>: turns starred rallies into a highlight film,
          with a soundtrack trimmed to its loudest section, rendered by ffmpeg
        </li>
      </ul>
    </section>

    <section class="proj-section">
      <h2>Architecture</h2>
      <p>
        Nuxt 4 with Supabase for auth and Postgres, styled with Tailwind 4. The
        scoring engine and the reel model live in
        <code>shared/</code> as plain TypeScript with no framework code, which
        lets Vitest test them without a browser or a database. The reel is a
        single <code>ReelProject</code> object. The preview, the saved
        <code>.reel</code> file and the render request all read that same
        object, so what you preview is exactly what gets rendered.
      </p>
    </section>

    <section class="proj-section">
      <h2>Key Challenges</h2>
      <ul>
        <li>
          Keeping the overlay in fullscreen: YouTube's fullscreen button only
          fullscreens the iframe, which leaves the scoreboard behind. A
          <code>fullscreenchange</code> handler moves fullscreen to the wrapper
          around the video instead.
        </li>
        <li>
          ffmpeg filter graphs fail late and with vague errors. The arguments
          are built by a pure function and checked in unit tests before anything
          is spawned.
        </li>
        <li>
          Long downloads and renders run as background jobs that the browser
          polls, so reloading the page doesn't kill an eleven-minute export
        </li>
        <li>
          The palette has only two colours (club crimson and ink) and still
          passes contrast checks in both light and dark themes
        </li>
      </ul>
    </section>
  </div>
</template>
