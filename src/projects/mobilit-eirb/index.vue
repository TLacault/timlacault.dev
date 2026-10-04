<script>
export default { name: "ProjectMobilitEirb" };
</script>

<template>
  <div class="proj-content">
    <section class="proj-section">
      <h2>Overview</h2>
      <p>
        My end-of-year project (PFA) for semester 8 at ENSEIRB-MATMECA, built by
        a team of five. Students record the trips for their mobility period
        abroad (a semester, an internship) and the app works out the carbon
        footprint of each leg. They can compare alternative routes, and the
        school gets aggregated data for its annual carbon report.
      </p>
    </section>

    <section class="proj-section">
      <h2>My role</h2>
      <p>
        I led the project and wrote most of the commits. I set up the
        architecture, the Docker environment and the CI/CD pipeline, and built
        features across the frontend and the API.
      </p>
    </section>

    <section class="proj-section">
      <h2>Architecture</h2>
      <p>
        Three Docker services: a Nuxt frontend served by Nginx, an Express REST
        API using Prisma, and PostgreSQL with PostGIS. On every push to
        <code>main</code>, GitHub Actions builds the images and pushes them to
        the school's registry. The app ran at <code>mobilit.eirb.fr</code>, with
        sign-in through the school's identity provider via OpenID Connect, so it
        never stores a password.
      </p>
    </section>

    <section class="proj-section">
      <h2>How emissions are computed</h2>
      <ul>
        <li>
          Distance and duration come from the Google Routes API for road and
          transit, and from the haversine formula for flights
        </li>
        <li>
          Emissions come from ADEME's Impact CO₂ API, which uses the official
          French emission factors (Base Carbone)
        </li>
        <li>
          Results are stored and only recalculated when a step's endpoints or
          transport mode change, which keeps Google API usage within its quota
        </li>
        <li>Mobilities export as JSON, CSV, or a styled PDF via PDFKit</li>
      </ul>
    </section>

    <section class="proj-section">
      <h2>Key Challenges</h2>
      <ul>
        <li>
          SSR inside Docker: the frontend container couldn't reach the backend
          at <code>localhost</code>, so we switched the app to client-side
          rendering only
        </li>
        <li>
          Google Routes doesn't always honour the requested transit mode. We
          restricted <code>allowedTravelModes</code> and added distance checks
          to catch absurd results.
        </li>
        <li>
          A column added after deployment: the queries fall back to running
          without it, so environments that hadn't migrated yet kept working
        </li>
      </ul>
    </section>
  </div>
</template>
