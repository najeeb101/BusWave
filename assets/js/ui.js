import { EMPTY_STUDENTS_HTML } from "./constants.js";

export function renderStudentList({ students, routes, studentListEl, studentCountEl, busColors, onRemove, escapeHtml }) {
  studentCountEl.textContent = students.length;

  if (!students.length) {
    studentListEl.innerHTML = EMPTY_STUDENTS_HTML;
    return;
  }

  const routeLookup = new Map();
  routes.forEach((route, routeIndex) => {
    route.students.forEach((student) => routeLookup.set(student.id, routeIndex));
  });

  studentListEl.innerHTML = students
    .map((student) => {
      const routeIndex = routeLookup.has(student.id) ? routeLookup.get(student.id) : -1;
      const color = routeIndex >= 0 ? busColors[routeIndex % busColors.length] : "#8fb0c3";

      return [
        "<div class='student'>",
        "  <div class='dot' style='background:" + color + "'></div>",
        "  <div>",
        "    <div class='s-name'>" +
          escapeHtml(student.name) +
          " <span style='color:var(--muted);font-size:0.72rem;'>Grade " +
          escapeHtml(student.grade) +
          "</span></div>",
        "    <div class='s-sub'>" + student.lat.toFixed(4) + ", " + student.lng.toFixed(4) + "</div>",
        "  </div>",
        "  <button class='remove' data-id='" + student.id + "' aria-label='Remove student'>x</button>",
        "</div>",
      ].join("");
    })
    .join("");

  studentListEl.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", () => onRemove(Number(btn.dataset.id)));
  });
}

export function renderRoutePanels({ routes, times, legendBoxEl, routesBoxEl, emptyStateEl, routesListEl, legendListEl, busColors, school, routeDistance }) {
  if (!routes.length) {
    legendBoxEl.style.display = "none";
    routesBoxEl.style.display = "none";
    emptyStateEl.style.display = "grid";
    routesListEl.innerHTML = "";
    legendListEl.innerHTML = "";
    return;
  }

  legendBoxEl.style.display = "block";
  routesBoxEl.style.display = "block";
  emptyStateEl.style.display = "none";

  routesListEl.innerHTML = routes
    .map((route, idx) => {
      const color = busColors[idx % busColors.length];
      const km = routeDistance(school, route.route).toFixed(2);
      return [
        "<div class='route-row'>",
        "  <span class='dot' style='background:" + color + ";margin-top:4px;'></span>",
        "  <div>",
        "    <div class='route-title'>Bus " + (idx + 1) + " | " + route.students.length + " students</div>",
        "    <div class='route-meta'>" + km + " km | ~" + times[idx] + " min</div>",
        "  </div>",
        "</div>",
      ].join("");
    })
    .join("");

  legendListEl.innerHTML = routes
    .map((_, idx) => {
      const color = busColors[idx % busColors.length];
      return "<div style='display:flex;align-items:center;gap:7px;font-size:0.75rem;margin-bottom:4px;'><span class='dot' style='background:" + color + "'></span><span>Bus " + (idx + 1) + "</span></div>";
    })
    .join("");
}

export function updateStats({ routes, studentsCount, totalBuses, statStudentsEl, statBusesEl, statTotalBusesEl, statAvgEl, statTimeEl, times }) {
  statStudentsEl.textContent = studentsCount;
  statTotalBusesEl.textContent = totalBuses;

  if (!routes.length || !times) {
    statBusesEl.textContent = "-";
    statAvgEl.textContent = "-";
    statTimeEl.textContent = "-";
    return;
  }

  const maxTime = Math.max(0, ...times);
  const avgPerBus = routes.length ? (studentsCount / routes.length).toFixed(1) : "-";

  statBusesEl.textContent = String(routes.length);
  statAvgEl.textContent = avgPerBus;
  statTimeEl.textContent = String(maxTime);
}
