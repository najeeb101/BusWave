import { BUS_COLORS, STORAGE_KEY } from "./constants.js";
import { clampFloat, clampInt, escapeHtml } from "./utils.js";
import { estimateRouteMinutes, optimizeRoutes, routeDistance } from "./routing.js";
import { loadState, persistState } from "./storage.js";
import { createMapController } from "./map.js";
import { renderRoutePanels, renderStudentList, updateStats } from "./ui.js";

const state = {
  students: [],
  routes: [],
};

const els = {
  numBuses: document.getElementById("numBuses"),
  busCapacity: document.getElementById("busCapacity"),
  schoolLat: document.getElementById("schoolLat"),
  schoolLng: document.getElementById("schoolLng"),
  avgSpeed: document.getElementById("avgSpeed"),
  stopDelay: document.getElementById("stopDelay"),
  studentName: document.getElementById("studentName"),
  studentGrade: document.getElementById("studentGrade"),
  studentLat: document.getElementById("studentLat"),
  studentLng: document.getElementById("studentLng"),
  addStudentBtn: document.getElementById("addStudentBtn"),
  sampleBtn: document.getElementById("sampleBtn"),
  recalcBtn: document.getElementById("recalcBtn"),
  clearBtn: document.getElementById("clearBtn"),
  studentCount: document.getElementById("studentCount"),
  studentList: document.getElementById("studentList"),
  legendBox: document.getElementById("legendBox"),
  legendList: document.getElementById("legendList"),
  routesBox: document.getElementById("routesBox"),
  routesList: document.getElementById("routesList"),
  calcOverlay: document.getElementById("calcOverlay"),
  emptyState: document.getElementById("emptyState"),
  statStudents: document.getElementById("statStudents"),
  statBuses: document.getElementById("statBuses"),
  statTotalBuses: document.getElementById("statTotalBuses"),
  statAvg: document.getElementById("statAvg"),
  statTime: document.getElementById("statTime"),
  mapArea: document.getElementById("mapArea"),
  toast: document.getElementById("toast"),
  mapCanvas: document.getElementById("mapCanvas"),
};

const mapController = createMapController(els.mapCanvas, els.mapArea);

function init() {
  hydrateFromStorage();
  bindEvents();
  mapController.resize();
  renderAll();

  if (state.students.length > 0) {
    calculateRoutes(false);
  }
}

function bindEvents() {
  window.addEventListener("resize", () => {
    mapController.resize();
    drawMap();
  });

  els.addStudentBtn.addEventListener("click", addStudent);
  els.sampleBtn.addEventListener("click", loadSampleData);
  els.recalcBtn.addEventListener("click", () => calculateRoutes(true));
  els.clearBtn.addEventListener("click", clearStudents);

  [
    els.numBuses,
    els.busCapacity,
    els.schoolLat,
    els.schoolLng,
    els.avgSpeed,
    els.stopDelay,
  ].forEach((input) => {
    input.addEventListener("change", () => {
      normalizeConfigUI();
      saveState();
      renderStatsOnly();
      if (state.students.length > 0) {
        calculateRoutes(false);
      } else {
        drawMap();
      }
    });
  });

  [els.studentName, els.studentGrade, els.studentLat, els.studentLng].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addStudent();
      }
    });
  });
}

function getConfig() {
  return {
    buses: clampInt(els.numBuses.value, 1, 20, 3),
    capacity: clampInt(els.busCapacity.value, 5, 80, 20),
    schoolLat: clampFloat(els.schoolLat.value, -90, 90, 25.285),
    schoolLng: clampFloat(els.schoolLng.value, -180, 180, 51.53),
    avgSpeed: clampFloat(els.avgSpeed.value, 10, 80, 30),
    stopDelay: clampFloat(els.stopDelay.value, 0, 10, 1),
  };
}

function normalizeConfigUI() {
  const cfg = getConfig();
  els.numBuses.value = cfg.buses;
  els.busCapacity.value = cfg.capacity;
  els.schoolLat.value = cfg.schoolLat;
  els.schoolLng.value = cfg.schoolLng;
  els.avgSpeed.value = cfg.avgSpeed;
  els.stopDelay.value = cfg.stopDelay;
  return cfg;
}

function schoolPoint() {
  const cfg = getConfig();
  return { lat: cfg.schoolLat, lng: cfg.schoolLng };
}

function addStudent() {
  const name = els.studentName.value.trim();
  const grade = els.studentGrade.value.trim() || "?";
  const lat = Number.parseFloat(els.studentLat.value);
  const lng = Number.parseFloat(els.studentLng.value);

  if (!name) {
    toast("Student name is required", true);
    return;
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    toast("Latitude and longitude are required", true);
    return;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    toast("Coordinates are out of valid range", true);
    return;
  }

  state.students.push({
    id: Date.now() + Math.random(),
    name,
    grade,
    lat,
    lng,
  });

  els.studentName.value = "";
  els.studentGrade.value = "";
  els.studentLat.value = "";
  els.studentLng.value = "";

  saveState();
  renderAll();
  calculateRoutes(false);
  toast(name + " added");
}

function removeStudent(id) {
  state.students = state.students.filter((student) => student.id !== id);
  if (!state.students.length) {
    state.routes = [];
  }

  saveState();
  renderAll();

  if (state.students.length > 0) {
    calculateRoutes(false);
  }
}

function clearStudents() {
  state.students = [];
  state.routes = [];
  saveState();
  renderAll();
  toast("Student list cleared");
}

function loadSampleData() {
  const school = schoolPoint();
  const names = [
    "Ahmed",
    "Fatima",
    "Omar",
    "Sara",
    "Khalid",
    "Maryam",
    "Yusuf",
    "Noor",
    "Hamad",
    "Layla",
    "Saad",
    "Hessa",
  ];
  const grades = ["6", "7", "8", "9"];

  state.students = names.map((name, index) => {
    const offsetLat = (Math.random() - 0.5) * 0.08;
    const offsetLng = (Math.random() - 0.5) * 0.08;
    return {
      id: Date.now() + index + Math.random(),
      name,
      grade: grades[index % grades.length],
      lat: Number((school.lat + offsetLat).toFixed(5)),
      lng: Number((school.lng + offsetLng).toFixed(5)),
    };
  });

  saveState();
  renderAll();
  calculateRoutes(true);
  toast("Sample students loaded");
}

function calculateRoutes(showMessage) {
  if (!state.students.length) {
    state.routes = [];
    renderAll();
    if (showMessage) {
      toast("Add at least one student", true);
    }
    return;
  }

  const cfg = normalizeConfigUI();
  const minNeeded = Math.ceil(state.students.length / cfg.capacity);
  if (cfg.buses < minNeeded) {
    toast("Not enough buses for selected capacity", true);
    return;
  }

  els.calcOverlay.classList.add("active");

  window.setTimeout(() => {
    const school = schoolPoint();
    state.routes = optimizeRoutes(state.students, school, cfg.buses, cfg.capacity);

    const times = state.routes.map((route) =>
      estimateRouteMinutes(route.route, school, cfg.avgSpeed, cfg.stopDelay),
    );

    renderAll(times);
    saveState();

    els.calcOverlay.classList.remove("active");
    if (showMessage) {
      toast("Routes optimized");
    }
  }, 450);
}

function renderAll(times = null) {
  renderStudentList({
    students: state.students,
    routes: state.routes,
    studentListEl: els.studentList,
    studentCountEl: els.studentCount,
    busColors: BUS_COLORS,
    onRemove: removeStudent,
    escapeHtml,
  });

  renderRoutePanels({
    routes: state.routes,
    times: times ?? state.routes.map(() => 0),
    legendBoxEl: els.legendBox,
    routesBoxEl: els.routesBox,
    emptyStateEl: els.emptyState,
    routesListEl: els.routesList,
    legendListEl: els.legendList,
    busColors: BUS_COLORS,
    school: schoolPoint(),
    routeDistance,
  });

  renderStatsOnly(times);
  drawMap();
}

function renderStatsOnly(times = null) {
  updateStats({
    routes: state.routes,
    studentsCount: state.students.length,
    totalBuses: normalizeConfigUI().buses,
    statStudentsEl: els.statStudents,
    statBusesEl: els.statBuses,
    statTotalBusesEl: els.statTotalBuses,
    statAvgEl: els.statAvg,
    statTimeEl: els.statTime,
    times,
  });
}

function drawMap() {
  mapController.drawScene({
    students: state.students,
    routes: state.routes,
    school: schoolPoint(),
    busColors: BUS_COLORS,
  });
}

function toast(message, isError = false) {
  els.toast.textContent = message;
  els.toast.style.background = isError ? "#e95d56" : "#28c76f";
  els.toast.style.color = isError ? "#fff" : "#053018";
  els.toast.classList.add("show");
  window.setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function saveState() {
  persistState(STORAGE_KEY, getConfig, state.students);
}

function hydrateFromStorage() {
  const saved = loadState(STORAGE_KEY);
  if (!saved) {
    normalizeConfigUI();
    return;
  }

  if (saved.config) {
    els.numBuses.value = saved.config.buses ?? els.numBuses.value;
    els.busCapacity.value = saved.config.capacity ?? els.busCapacity.value;
    els.schoolLat.value = saved.config.schoolLat ?? els.schoolLat.value;
    els.schoolLng.value = saved.config.schoolLng ?? els.schoolLng.value;
    els.avgSpeed.value = saved.config.avgSpeed ?? els.avgSpeed.value;
    els.stopDelay.value = saved.config.stopDelay ?? els.stopDelay.value;
  }

  state.students = saved.students;
  normalizeConfigUI();
}

init();
