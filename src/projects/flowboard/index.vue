<script>
export default { name: "ProjectFlowBoard" };
</script>

<template>
  <div class="proj-content">
    <section class="proj-section">
      <h2>Overview</h2>
      <p>
        A Kanban-style project board with real-time collaboration. Cards can be
        dragged across columns, assigned to team members, and updated live
        across browser tabs using Supabase Realtime.
      </p>
    </section>

    <section class="proj-section">
      <h2>Features</h2>
      <ul>
        <li>
          Drag and drop with <code>@dnd-kit/core</code> — works on touch too
        </li>
        <li>
          Keyboard shortcuts for power users (j/k to navigate, Enter to open)
        </li>
        <li>
          Optimistic UI updates — the board responds instantly, server confirms
          async
        </li>
        <li>Supabase Realtime channel for multiplayer presence indicators</li>
      </ul>
    </section>

    <section class="proj-section">
      <h2>Technical decisions</h2>
      <p>
        Chose Supabase over Firebase for the PostgreSQL backend — row-level
        security policies handle auth without a separate API layer. React was
        picked over Vue because DnD Kit is React-first and the drag logic is
        complex enough that fighting a port wasn't worth it.
      </p>
    </section>

    <section class="proj-section">
      <h2>Retrospective</h2>
      <ul>
        <li>
          Optimistic updates made the UX feel snappy but conflict resolution is
          hard
        </li>
        <li>
          Realtime presence is easy to add but surprisingly hard to make
          reliable
        </li>
        <li>Should have designed the data model for reordering from day one</li>
      </ul>
    </section>
  </div>
</template>
