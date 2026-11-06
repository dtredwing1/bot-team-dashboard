(async () => {
  const D = await (await fetch("data/bots.json")).json();
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const fmt = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";
  const LABEL = D.statusLabels || {};
  const label = (s) => LABEL[s] || s;
  const pill = (s) => `<span class="pill ${s.replace(/ /g, "")}">${s === "Idle" ? '<span aria-hidden="true">😴</span> ' : ""}${esc(label(s))}</span>`;
  const workBucket = (b) => /^(Current|Recurring)\b/.test(b.work || "") ? "current" : /^Last\b/.test(b.work || "") ? "last" : "none";
  const B = D.bots, T = D.teams;
  if (D.title) {
    $("title").textContent = D.title;
    document.title = D.title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", D.title);
  }
  if (D.summary) {
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", D.summary);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", D.summary);
  }
  $("summary").textContent = `${D.summary} As of ${D.asOfLabel}.`;
  $("asof").textContent = D.asOfLabel;
  $("intro").textContent = D.intro.replace("{count}", B.length);
  $("status-note").textContent = D.statusNote;
  const underway = B.filter((b) => workBucket(b) === "current").length;
  const idle = B.filter((b) => b.status === "Idle").length;
  $("metrics").innerHTML = [[B.length, "Bots"], [T.length, "Teams"], [underway, "Current or recurring"], [idle, label("Idle")]]
    .map(([v, l]) => `<div class="metric"><b>${v}</b><span class="muted">${esc(l)}</span></div>`).join("");

  const sel = $("team");
  T.forEach((t) => sel.add(new Option(t, t)));
  const ssel = $("status");
  ["Active", "Recent", "Idle", "Not started"].forEach((s) => ssel.add(new Option(label(s), s)));
  let status = "All";
  ssel.onchange = () => { status = ssel.value; render(); };
  const wsel = $("work-view");
  let workView = "All";
  wsel.onchange = () => { workView = wsel.value; render(); };
  let team = new URLSearchParams(location.search).get("team") || "All", sort = "recent";
  if (![...sel.options].some((o) => o.value === team)) team = "All";
  sel.value = team;
  const cols = ["Bot", "Team", "Role", "Current / recurring / last work", "Last active", "Status"];
  function render() {
    let r = B.filter((b) => (team === "All" || b.team === team) && (status === "All" || b.status === status) && (workView === "All" || workBucket(b) === workView));
    r = [...r].sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "team" ? T.indexOf(a.team) - T.indexOf(b.team) : (b.lastActive || "0").localeCompare(a.lastActive || "0"));
    $("rows").innerHTML = r.map((b) => [esc(b.name), esc(b.team), esc(b.role), esc(b.work), fmt(b.lastActive), pill(b.status)]
      .map((c, i) => `<td data-label="${cols[i]}">${c}</td>`).join("")).map((x) => `<tr>${x}</tr>`).join("");
    $("count").textContent = `${r.length} of ${B.length} bots`;
  }
  sel.onchange = () => { team = sel.value; render(); };
  document.querySelectorAll(".seg button").forEach((btn) => btn.onclick = () => {
    sort = btn.dataset.sort;
    document.querySelectorAll(".seg button").forEach((x) => x.setAttribute("aria-pressed", x === btn));
    render();
  });
  render();

  // Diagram: layered left-to-right layout from the person node.
  const { nodes, edges } = D.diagram, depth = {}, order = {};
  const root = (nodes.find((n) => n.kind === "person") || nodes[0]).id;
  depth[root] = 0; const q = [root];
  while (q.length) { const id = q.shift(); edges.filter((e) => e.from === id).forEach((e) => { if (depth[e.to] === undefined) { depth[e.to] = depth[id] + 1; q.push(e.to); } }); }
  nodes.forEach((n) => { if (depth[n.id] === undefined) depth[n.id] = 0; });
  const layers = []; nodes.forEach((n) => (layers[depth[n.id]] ||= []).push(n));
  const W = 150, H = 50, GX = 70, GY = 28, maxRows = Math.max(...layers.map((l) => l.length));
  const totalH = maxRows * (H + GY) + GY, pos = {};
  layers.forEach((l, i) => l.forEach((n, j) => {
    const off = (totalH - l.length * (H + GY)) / 2;
    pos[n.id] = { x: 20 + i * (W + GX), y: off + j * (H + GY) + GY / 2 };
  }));
  const width = 40 + layers.length * (W + GX) - GX;
  let svg = `<svg viewBox="0 0 ${width} ${totalH}" role="img" aria-label="Diagram of how the bots work together"><defs><marker id="ah" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor" class="muted"/></marker></defs>`;
  edges.forEach((e) => {
    const a = pos[e.from], b = pos[e.to], x1 = a.x + W, y1 = a.y + H / 2, x2 = b.x, y2 = b.y + H / 2, mx = (x1 + x2) / 2;
    svg += `<path class="edge${e.dashed ? " dashed" : ""}" d="M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}" marker-end="url(#ah)"/>`;
    if (e.label) svg += `<text class="elabel" x="${mx}" y="${(y1 + y2) / 2 - 4}" text-anchor="middle">${esc(e.label)}</text>`;
  });
  nodes.forEach((n) => {
    const p = pos[n.id];
    svg += `<g class="node${n.kind === "person" ? " person" : ""}"><rect x="${p.x}" y="${p.y}" width="${W}" height="${H}" rx="${n.kind === "person" ? 25 : 8}"/>` +
      `<text x="${p.x + W / 2}" y="${p.y + (n.detail ? 21 : 30)}" text-anchor="middle" font-weight="600">${esc(n.label)}</text>` +
      (n.detail ? `<text class="detail" x="${p.x + W / 2}" y="${p.y + 38}" text-anchor="middle">${esc(n.detail)}</text>` : "") + `</g>`;
  });
  $("diagram").innerHTML = svg + "</svg>";
  $("diagram").style.color = getComputedStyle(document.documentElement).getPropertyValue("--muted");
  $("caption").textContent = D.diagram.caption;

  $("teams").innerHTML = T.map((t) => `<div class="card"><h3>${esc(t)}</h3><ul>${B.filter((b) => b.team === t)
    .map((b) => `<li><b>${esc(b.name)}</b> ${pill(b.status)}<br>${esc(b.work)}</li>`).join("")}</ul></div>`).join("");
  const tip = $("tip");
  if (tip) tip.textContent = D.tip || "";
})();
