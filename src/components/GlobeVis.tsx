import { useRef, useEffect, useState } from "react";
import { geoOrthographic, geoPath, geoGraticule, geoCircle } from "d3-geo";
import type { LatLng } from "../lib/antipode";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

interface Props {
  pointA: LatLng | null;
  pointB: LatLng | null;
  onPointADrag?: (latlng: LatLng) => void;
  onPointBDrag?: (latlng: LatLng) => void;
}

type Land = GeoJSON.FeatureCollection | GeoJSON.MultiPolygon;

export default function GlobeVis({ pointA, pointB, onPointADrag, onPointBDrag }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const rotRef = useRef<[number, number]>([0, -20]);
  const autoRotateRef = useRef(true);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startRot: [number, number];
    target: "globe" | "pointA" | "pointB" | null;
  }>({ active: false, startX: 0, startY: 0, startRot: [0, -20], target: null });
  const projRef = useRef(geoOrthographic().clipAngle(90).precision(0.5));
  const [land, setLand] = useState<Land | null>(null);

  // Keep props in refs so the animation effect doesn't re-run on every change
  const pointARef = useRef(pointA);
  const pointBRef = useRef(pointB);
  const onPointADragRef = useRef(onPointADrag);
  const onPointBDragRef = useRef(onPointBDrag);
  pointARef.current = pointA;
  pointBRef.current = pointB;
  onPointADragRef.current = onPointADrag;
  onPointBDragRef.current = onPointBDrag;

  useEffect(() => {
    import("world-atlas/land-110m.json").then((worldRaw) => {
      const world = worldRaw.default as unknown as Topology<{ land: GeometryCollection }>;
      const landGeo = topojson.feature(world, world.objects.land);
      setLand(landGeo as Land);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const projection = projRef.current;
    const graticule = geoGraticule().step([30, 30]);
    const graticuleGeo = graticule();
    const equatorGeo = geoCircle().center([0, 0]).radius(90)();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.42;
      const [rotLam, rotPhi] = rotRef.current;
      projection.translate([cx, cy]).scale(r).rotate([rotLam, rotPhi, 0]);
      const path = geoPath(projection, ctx);
      ctx.clearRect(0, 0, w, h);

      // Shadow
      ctx.beginPath();
      ctx.arc(cx + 3, cy + 3, r, 0, Math.PI * 2);
      ctx.fillStyle = "oklch(0.05 0.01 240 / 0.4)";
      ctx.fill();

      // Ocean
      const grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.05, cx, cy, r);
      grad.addColorStop(0, "oklch(0.22 0.04 220)");
      grad.addColorStop(0.6, "oklch(0.16 0.04 230)");
      grad.addColorStop(1, "oklch(0.10 0.03 240)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Graticule
      ctx.beginPath();
      path(graticuleGeo);
      ctx.strokeStyle = "oklch(0.25 0.02 230 / 0.35)";
      ctx.lineWidth = 0.4;
      ctx.stroke();

      // Equator
      ctx.beginPath();
      path(equatorGeo);
      ctx.strokeStyle = "oklch(0.45 0.08 60 / 0.3)";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Land
      if (land) {
        ctx.beginPath();
        path(land as Parameters<typeof path>[0]);
        ctx.fillStyle = "oklch(0.28 0.06 150 / 0.45)";
        ctx.fill();
        ctx.strokeStyle = "oklch(0.50 0.12 150 / 0.6)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Points
      const pA = pointARef.current;
      const pB = pointBRef.current;
      if (pA && pB) {
        const pa = projection([pA.lng, pA.lat]);
        const pb = projection([pB.lng, pB.lat]);
        const rotNeg: [number, number, number] = [-rotLam, -rotPhi, 0];
        const distA = geoDistToCenter(pA.lat, pA.lng, rotNeg);
        const distB = geoDistToCenter(pB.lat, pB.lng, rotNeg);
        const visA = distA < 90;
        const visB = distB < 90;

        if (pa && pb) {
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = "oklch(0.75 0.15 60 / 0.5)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(pa[0], pa[1]);
          ctx.lineTo(pb[0], pb[1]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        const drawPt = (
          coords: [number, number] | null,
          visible: boolean,
          color: string,
          hl: string,
          draggable: boolean,
          ll: LatLng,
        ) => {
          let px: number, py: number;
          if (coords && visible) {
            px = coords[0];
            py = coords[1];
          } else {
            const phi = (ll.lat * Math.PI) / 180;
            const lam = (ll.lng * Math.PI) / 180;
            const rL = (-rotLam * Math.PI) / 180;
            const rP = (-rotPhi * Math.PI) / 180;
            const cp = Math.cos(phi);
            px = cx + r * cp * Math.sin(lam - rL);
            py = cy - r * (Math.cos(rP) * Math.sin(phi) - Math.sin(rP) * cp * Math.cos(lam - rL));
          }
          const op = visible ? 1 : 0.2;
          const sz = visible ? 7 : 4;
          ctx.globalAlpha = op;
          ctx.beginPath();
          ctx.arc(px, py, sz, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          if (visible) {
            ctx.strokeStyle = hl;
            ctx.lineWidth = 2;
            ctx.stroke();
            if (draggable) {
              ctx.beginPath();
              ctx.arc(px, py, sz + 5, 0, Math.PI * 2);
              ctx.strokeStyle = hl.replace(/\)$/, " / 0.25)");
              ctx.lineWidth = 1.5;
              ctx.setLineDash([3, 3]);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
          ctx.globalAlpha = 1;
        };

        drawPt(pa, visA, "oklch(0.72 0.19 150)", "oklch(0.90 0.10 150)", !!onPointADragRef.current, pA);
        drawPt(pb, visB, "oklch(0.68 0.20 25)", "oklch(0.85 0.12 25)", !!onPointBDragRef.current, pB);
      }

      // Rim
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "oklch(0.40 0.04 230 / 0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Atmosphere
      const ag = ctx.createRadialGradient(cx, cy, r * 0.95, cx, cy, r * 1.15);
      ag.addColorStop(0, "oklch(0.40 0.08 200 / 0.08)");
      ag.addColorStop(1, "oklch(0.40 0.08 200 / 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = ag;
      ctx.fill();

      if (autoRotateRef.current && !dragRef.current.active) {
        rotRef.current = [rotRef.current[0] - 0.06, rotRef.current[1]];
      }
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const getPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const hitTest = (sx: number, sy: number): "pointA" | "pointB" | "globe" | null => {
      if (pointARef.current) {
        const pa = projection([pointARef.current.lng, pointARef.current.lat]);
        if (pa && Math.hypot(sx - pa[0], sy - pa[1]) < 16) return "pointA";
      }
      if (pointBRef.current) {
        const pb = projection([pointBRef.current.lng, pointBRef.current.lat]);
        if (pb && Math.hypot(sx - pb[0], sy - pb[1]) < 16) return "pointB";
      }
      const [tx, ty] = projection.translate();
      if (Math.hypot(sx - tx, sy - ty) <= projection.scale()) return "globe";
      return null;
    };

    const handleDrag = (mx: number, my: number) => {
      const d = dragRef.current;
      const scale = projection.scale();
      if (d.target === "globe") {
        const dx = mx - d.startX;
        const dy = my - d.startY;
        const s = 0.3;
        rotRef.current = [
          d.startRot[0] - (dx / scale) * 180 * s,
          Math.max(-80, Math.min(80, d.startRot[1] + (dy / scale) * 180 * s)),
        ];
      } else if (d.target === "pointA" || d.target === "pointB") {
        const inv = projection.invert?.([mx, my]);
        if (inv) {
          const ll: LatLng = { lat: inv[1], lng: inv[0] };
          if (d.target === "pointA" && onPointADragRef.current) onPointADragRef.current(ll);
          if (d.target === "pointB" && onPointBDragRef.current) onPointBDragRef.current(ll);
        }
      }
    };

    const onDown = (e: MouseEvent) => {
      const pos = getPos(e);
      const target = hitTest(pos.x, pos.y);
      if (!target) return;
      autoRotateRef.current = false;
      dragRef.current = { active: true, startX: pos.x, startY: pos.y, startRot: [...rotRef.current], target };
      canvas.style.cursor = target === "globe" ? "grabbing" : "move";
      e.preventDefault();
    };
    const onMove = (e: MouseEvent) => {
      const pos = getPos(e);
      if (!dragRef.current.active) {
        canvas.style.cursor = hitTest(pos.x, pos.y) ? "grab" : "default";
        return;
      }
      handleDrag(pos.x, pos.y);
    };
    const onUp = () => {
      if (dragRef.current.active) {
        dragRef.current.active = false;
        canvas.style.cursor = "default";
        setTimeout(() => {
          if (!dragRef.current.active) autoRotateRef.current = true;
        }, 3000);
      }
    };

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    const onTS = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const pos = getPos(e.touches[0]);
        const target = hitTest(pos.x, pos.y);
        if (!target) return;
        autoRotateRef.current = false;
        dragRef.current = { active: true, startX: pos.x, startY: pos.y, startRot: [...rotRef.current], target };
        e.preventDefault();
      }
    };
    const onTM = (e: TouchEvent) => {
      if (!dragRef.current.active || e.touches.length !== 1) return;
      const pos = getPos(e.touches[0]);
      handleDrag(pos.x, pos.y);
      e.preventDefault();
    };
    const onTE = () => {
      dragRef.current.active = false;
      setTimeout(() => {
        if (!dragRef.current.active) autoRotateRef.current = true;
      }, 3000);
    };

    canvas.addEventListener("touchstart", onTS, { passive: false });
    canvas.addEventListener("touchmove", onTM, { passive: false });
    canvas.addEventListener("touchend", onTE);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onTS);
      canvas.removeEventListener("touchmove", onTM);
      canvas.removeEventListener("touchend", onTE);
    };
  }, [land]);

  return <canvas ref={canvasRef} className="globe-canvas" />;
}

function geoDistToCenter(lat: number, lng: number, rot: [number, number, number]): number {
  const p1 = (-rot[1] * Math.PI) / 180;
  const l1 = (-rot[0] * Math.PI) / 180;
  const p2 = (lat * Math.PI) / 180;
  const l2 = (lng * Math.PI) / 180;
  const d = Math.acos(Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(l2 - l1));
  return (d * 180) / Math.PI;
}
