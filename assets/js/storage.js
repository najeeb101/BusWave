export function persistState(storageKey, getConfig, students) {
  const payload = {
    config: getConfig(),
    students,
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(payload));
  } catch (error) {
    console.warn("Could not persist state", error);
  }
}

export function loadState(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const students = Array.isArray(parsed.students)
      ? parsed.students
          .filter(
            (s) =>
              Number.isFinite(s.lat) &&
              Number.isFinite(s.lng) &&
              typeof s.name === "string",
          )
          .map((s) => ({
            id: Number.isFinite(s.id) ? s.id : Date.now() + Math.random(),
            name: s.name,
            grade: typeof s.grade === "string" ? s.grade : "?",
            lat: Number(s.lat),
            lng: Number(s.lng),
          }))
      : [];

    return {
      config: parsed.config ?? null,
      students,
    };
  } catch (error) {
    console.warn("Could not load state", error);
    return null;
  }
}
