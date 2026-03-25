export function createMapController(canvas, mapArea) {
  const ctx = canvas.getContext("2d");

  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const width = mapArea.clientWidth;
    const height = mapArea.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawScene({ students, routes, school, busColors }) {
    const width = mapArea.clientWidth;
    const height = mapArea.clientHeight;
    ctx.clearRect(0, 0, width, height);
    drawGrid(ctx, width, height);

    if (!students.length || !routes.length) {
      return;
    }

    const points = [school, ...students];
    const bounds = getBounds(points);
    const toCanvas = (lat, lng) => projectPoint(lat, lng, bounds, width, height);

    routes.forEach((route, routeIndex) => {
      const color = busColors[routeIndex % busColors.length];
      const full = [school, ...route.route, school];

      ctx.beginPath();
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = color;
      ctx.setLineDash([8, 5]);
      ctx.globalAlpha = 0.8;
      const p0 = toCanvas(full[0].lat, full[0].lng);
      ctx.moveTo(p0.x, p0.y);

      for (let i = 1; i < full.length; i += 1) {
        const p = toCanvas(full[i].lat, full[i].lng);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      for (let i = 0; i < full.length - 1; i += 1) {
        drawArrow(ctx, toCanvas(full[i].lat, full[i].lng), toCanvas(full[i + 1].lat, full[i + 1].lng), color);
      }

      route.students.forEach((student) => {
        const p = toCanvas(student.lat, student.lng);
        drawStop(ctx, p, color, student.name);
      });
    });

    const schoolPos = toCanvas(school.lat, school.lng);
    drawSchool(ctx, schoolPos);
  }

  return {
    resize,
    drawScene,
  };
}

function drawGrid(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = "rgba(143, 176, 195, 0.08)";
  ctx.lineWidth = 1;
  const step = 52;
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawArrow(ctx, from, to, color) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.save();
  ctx.translate(mx, my);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.moveTo(6, 0);
  ctx.lineTo(-4, 3);
  ctx.lineTo(-4, -3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawStop(ctx, pos, color, label) {
  const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 16);
  glow.addColorStop(0, color + "55");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 6.4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#04111b";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#dff4ff";
  ctx.font = "600 11px Sora";
  ctx.textAlign = "center";
  ctx.fillText(label, pos.x, pos.y - 12);
}

function drawSchool(ctx, pos) {
  const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 28);
  glow.addColorStop(0, "rgba(255,255,255,0.22)");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-10, -10, 20, 20);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 12px Sora";
  ctx.textAlign = "center";
  ctx.fillText("School", pos.x, pos.y - 20);
}

function getBounds(points) {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
}

function projectPoint(lat, lng, bounds, width, height) {
  const pad = 56;
  const latRange = Math.max(0.0002, bounds.maxLat - bounds.minLat);
  const lngRange = Math.max(0.0002, bounds.maxLng - bounds.minLng);
  const x = pad + ((lng - bounds.minLng) / lngRange) * (width - pad * 2);
  const y = pad + ((bounds.maxLat - lat) / latRange) * (height - pad * 2);
  return { x, y };
}
