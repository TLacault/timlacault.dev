<script>
export default { name: "ProjectDevShell" };
</script>

<template>
  <div class="proj-content">
    <section class="proj-section">
      <h2>Overview</h2>
      <p>
        A browser-based terminal emulator with a plugin system for custom
        commands. Users can spawn a shell session, run built-in commands, or
        load extension bundles that register new verbs at runtime.
      </p>
    </section>

    <section class="proj-section">
      <h2>How it works</h2>
      <p>
        The frontend uses <code>xterm.js</code> for rendering and input
        handling. Each session opens a WebSocket connection to a Node.js process
        that proxies stdin/stdout to a sandboxed shell via
        <code>node-pty</code>.
      </p>
      <ul>
        <li>Session isolation — each tab gets its own PTY process</li>
        <li>
          Command history stored in IndexedDB for persistence across reloads
        </li>
        <li>Plugin bundles loaded via dynamic <code>import()</code></li>
      </ul>
    </section>

    <section class="proj-section">
      <h2>Current status</h2>
      <p>
        Core shell I/O is stable. The plugin API is in progress — the extension
        loader works but the permission model for sandboxed plugins still needs
        work before it's safe to expose publicly.
      </p>
    </section>

    <section class="proj-section">
      <h2>Learnings</h2>
      <ul>
        <li>
          PTY management is surprisingly tricky on Windows — used WSL as a
          fallback
        </li>
        <li>xterm.js has a rich addon ecosystem that saved weeks of work</li>
        <li>
          WebSocket reconnect logic needs exponential back-off from day one
        </li>
      </ul>
    </section>
  </div>
</template>
