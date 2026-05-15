<script>
export default { name: "ProjectNetScan" };
</script>

<template>
  <div class="proj-content">
    <section class="proj-section">
      <h2>Overview</h2>
      <p>
        A lightweight network scanner written in C. Given a CIDR block, it sends
        ICMP echo requests across the range, fingerprints open ports with SYN
        probes, and measures round-trip latency — all without root on Linux
        thanks to raw socket capabilities.
      </p>
    </section>

    <section class="proj-section">
      <h2>How it works</h2>
      <ul>
        <li>ARP resolution for local hosts, ICMP for remote subnets</li>
        <li>
          Non-blocking I/O via <code>epoll</code> — scans hundreds of hosts in
          parallel
        </li>
        <li>
          Port scanning uses SYN packets via <code>libpcap</code> to capture
          responses
        </li>
        <li>Output formats: human-readable table, JSON, or CSV</li>
      </ul>
    </section>

    <section class="proj-section">
      <h2>Why C?</h2>
      <p>
        Raw sockets and packet crafting need to be precise. Python's scapy adds
        too much overhead at scale, and Go's net package abstracts away the
        control I needed. C gave direct access to the socket API without
        surprises.
      </p>
    </section>

    <section class="proj-section">
      <h2>Status</h2>
      <p>
        Archived — the core scanner works well but I haven't had time to add the
        service fingerprinting layer (banner grabbing, version detection). It
        lives on GitHub and taught me more about networking internals than any
        course.
      </p>
    </section>
  </div>
</template>
