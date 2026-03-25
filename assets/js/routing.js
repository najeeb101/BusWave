import { haversineKm } from "./utils.js";

export function optimizeRoutes(students, school, requestedBuses, capacity) {
  if (!students.length) {
    return [];
  }

  const busesUsed = Math.min(requestedBuses, Math.ceil(students.length / capacity));
  let centroids = initCentroids(students, school, busesUsed);
  let assignments = new Array(students.length).fill(-1);

  for (let iter = 0; iter < 18; iter += 1) {
    const result = assignWithCapacity(students, centroids, capacity);
    assignments = result.assignments;
    centroids = recomputeCentroids(students, assignments, centroids.length);
  }

  const routes = [];
  for (let bus = 0; bus < centroids.length; bus += 1) {
    const group = students.filter((_, index) => assignments[index] === bus);
    if (!group.length) {
      continue;
    }

    let ordered = nearestNeighborRoute(school, group);
    ordered = twoOptImprove(school, ordered);

    routes.push({
      students: group,
      route: ordered,
    });
  }

  routes.sort((a, b) => routeDistance(school, b.route) - routeDistance(school, a.route));
  return routes;
}

export function routeDistance(school, route) {
  if (!route.length) {
    return 0;
  }

  let total = haversineKm(school, route[0]);
  for (let i = 1; i < route.length; i += 1) {
    total += haversineKm(route[i - 1], route[i]);
  }
  total += haversineKm(route[route.length - 1], school);
  return total;
}

export function estimateRouteMinutes(route, school, avgSpeedKmh, stopDelayMin) {
  const km = routeDistance(school, route);
  const driveMins = (km / avgSpeedKmh) * 60;
  const stopMins = route.length * stopDelayMin;
  return Math.round(driveMins + stopMins);
}

function initCentroids(students, school, k) {
  const centroids = [];

  const farthest = students
    .map((s) => ({ point: s, d: haversineKm(school, s) }))
    .sort((a, b) => b.d - a.d)[0].point;
  centroids.push({ lat: farthest.lat, lng: farthest.lng });

  while (centroids.length < k) {
    let candidate = null;
    let best = -1;

    for (const student of students) {
      const nearest = Math.min(...centroids.map((c) => haversineKm(student, c)));
      if (nearest > best) {
        best = nearest;
        candidate = student;
      }
    }

    centroids.push({ lat: candidate.lat, lng: candidate.lng });
  }

  return centroids;
}

function assignWithCapacity(students, centroids, capacity) {
  const remaining = Array(centroids.length).fill(capacity);
  const assignments = new Array(students.length).fill(-1);

  const ranked = students.map((student, index) => {
    const distances = centroids.map((c) => haversineKm(student, c));
    const ordered = distances.map((d, idx) => ({ idx, d })).sort((a, b) => a.d - b.d);

    return {
      index,
      ordered,
      urgency: (ordered[1] ? ordered[1].d : ordered[0].d + 999) - ordered[0].d,
    };
  });

  ranked.sort((a, b) => b.urgency - a.urgency);

  for (const item of ranked) {
    let chosen = item.ordered.find((candidate) => remaining[candidate.idx] > 0);
    if (!chosen) {
      chosen = item.ordered[0];
    }

    assignments[item.index] = chosen.idx;
    remaining[chosen.idx] -= 1;
  }

  return { assignments };
}

function recomputeCentroids(students, assignments, k) {
  const next = [];
  for (let i = 0; i < k; i += 1) {
    const cluster = students.filter((_, index) => assignments[index] === i);
    if (!cluster.length) {
      const fallback = students[Math.floor(Math.random() * students.length)];
      next.push({ lat: fallback.lat, lng: fallback.lng });
      continue;
    }

    const lat = cluster.reduce((sum, p) => sum + p.lat, 0) / cluster.length;
    const lng = cluster.reduce((sum, p) => sum + p.lng, 0) / cluster.length;
    next.push({ lat, lng });
  }
  return next;
}

function nearestNeighborRoute(start, points) {
  if (!points.length) {
    return [];
  }

  const unvisited = [...points];
  const route = [];
  let current = start;

  while (unvisited.length) {
    let nearestIndex = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < unvisited.length; i += 1) {
      const d = haversineKm(current, unvisited[i]);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIndex = i;
      }
    }

    const [next] = unvisited.splice(nearestIndex, 1);
    route.push(next);
    current = next;
  }

  return route;
}

function twoOptImprove(school, route) {
  if (route.length < 4) {
    return route;
  }

  let improved = true;
  let best = [...route];
  let iterations = 0;

  while (improved && iterations < 60) {
    improved = false;
    iterations += 1;

    for (let i = 0; i < best.length - 2; i += 1) {
      for (let j = i + 2; j < best.length; j += 1) {
        const candidate = twoOptSwap(best, i + 1, j);
        if (routeDistance(school, candidate) + 0.0001 < routeDistance(school, best)) {
          best = candidate;
          improved = true;
        }
      }
    }
  }

  return best;
}

function twoOptSwap(route, i, k) {
  return route.slice(0, i).concat(route.slice(i, k + 1).reverse()).concat(route.slice(k + 1));
}
