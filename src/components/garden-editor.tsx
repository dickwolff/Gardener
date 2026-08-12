"use client";

import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  createZone,
  updateZone,
  deleteZone,
} from "@/actions/garden-actions";
import {
  addPlant,
  movePlant,
  removePlant,
  searchPlants,
  getPlantDetail,
} from "@/actions/plant-actions";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { safeParseBloom } from "@/lib/bloom";

type Point = { x: number; y: number };

type ZoneType = "grass" | "border" | "terrace" | "fence" | "pond" | "path" | "pergola" | "custom";

interface GardenData {
  id: string;
  name: string;
  width: number;
  height: number;
  scale: number;
  zones: {
    id: string;
    type: string;
    name: string | null;
    color: string | null;
    points: string;
    order: number;
  }[];
  plants: {
    id: string;
    name: string;
    x: number;
    y: number;
    zoneId: string | null;
    commonName: string | null;
    scientificName: string | null;
    watering: string | null;
    sunlight: string | null;
    bloomTime: string | null;
    imageUrl: string | null;
    notes: string | null;
  }[];
}

const ZONE_COLORS: Record<string, { fill: string; stroke: string; label: string }> = {
  grass: { fill: "#C8E6C9", stroke: "#81C784", label: "Gras" },
  border: { fill: "#D7CCC8", stroke: "#A1887F", label: "Border" },
  terrace: { fill: "#E0E0E0", stroke: "#BDBDBD", label: "Terras" },
  fence: { fill: "#D4A574", stroke: "#8D6E63", label: "Schutting" },
  pond: { fill: "#B3E5FC", stroke: "#4FC3F7", label: "Vijver" },
  path: { fill: "#FFF9C4", stroke: "#D4E157", label: "Pad" },
  pergola: { fill: "rgba(139, 90, 43, 0.15)", stroke: "#8B5A2B", label: "Pergola" },
  custom: { fill: "#F3E5F5", stroke: "#CE93D8", label: "Aangepast" },
};

const ZONE_TYPES = Object.keys(ZONE_COLORS) as ZoneType[];

const GRID_SIZE = 0.25;

type Tool = "boundary" | "zone" | "plant" | "select" | "pan";

interface PlantSearchResult {
  id: number;
  common_name: string;
  scientific_name: string;
  image_url: string;
}

interface GardenEditorProps {
  garden: GardenData;
}

export function GardenEditor({ garden }: GardenEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const [tool, setTool] = useState<Tool>("select");
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [zoneType, setZoneType] = useState<ZoneType>("border");
  const [zones, setZones] = useState(garden.zones);
  const [plants, setPlants] = useState(garden.plants);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [drawingZoneId, setDrawingZoneId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Point | null>(null);

  const zoomRef = useRef(zoom);
  const offsetRef = useRef(viewOffset);

  const [boundaryPoints, setBoundaryPoints] = useState<Point[]>([]);
  const initialFitDone = useRef(false);

  useEffect(() => {
    if (initialFitDone.current) return;
    initialFitDone.current = true;
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    offsetRef.current = viewOffset;
  }, [viewOffset]);

  useEffect(() => {
    const allPoints: Point[] = [];

    if (boundaryPoints.length > 0) {
      allPoints.push(...boundaryPoints);
    }
    for (const z of zones) {
      const pts = JSON.parse(z.points) as Point[];
      allPoints.push(...pts);
    }
    for (const p of plants) {
      allPoints.push({ x: p.x, y: p.y });
    }

    if (allPoints.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const pt of allPoints) {
      if (pt.x < minX) minX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y > maxY) maxY = pt.y;
    }

    const pad = 1;
    const contentW = maxX - minX + pad * 2;
    const contentH = maxY - minY + pad * 2;

    const viewW = garden.width;
    const viewH = garden.height;

    const fitZoom = Math.min(viewW / contentW, viewH / contentH, 2);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const newZoom = Math.round(fitZoom * 100) / 100;
    const vw = viewW / newZoom;
    const vh = viewH / newZoom;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setZoom(newZoom);
    setViewOffset({ x: centerX - vw / 2, y: centerY - vh / 2 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [dragState, setDragState] = useState<{
    vertexIndex: number;
    zoneId: string;
    points: Point[];
  } | null>(null);

  const [plantDragState, setPlantDragState] = useState<{
    plantId: string;
    start: Point;
    current: Point;
    dragging: boolean;
  } | null>(null);
  const plantDragRef = useRef(plantDragState);
  const plantHandledRef = useRef(false);

  useEffect(() => {
    plantDragRef.current = plantDragState;
  }, [plantDragState]);

  useEffect(() => {
    plantHandledRef.current = false;
  }, [tool]);

  const [plantSearchOpen, setPlantSearchOpen] = useState(false);
  const [plantSearchQuery, setPlantSearchQuery] = useState("");
  const [plantSearchResults, setPlantSearchResults] = useState<PlantSearchResult[]>([]);
  const [plantSearchLoading, setPlantSearchLoading] = useState(false);
  const [plantSearchError, setPlantSearchError] = useState("");
  const [plantPlacePosition, setPlantPlacePosition] = useState<Point | null>(null);
  const [plantDetailOpen, setPlantDetailOpen] = useState(false);

  function getSvgCoords(e: React.MouseEvent<SVGSVGElement>): Point {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const z = zoomRef.current;
    const vw = garden.width / z;
    const vh = garden.height / z;
    const vx = offsetRef.current.x;
    const vy = offsetRef.current.y;

    // SVG uses preserveAspectRatio="xMidYMid meet", so the viewBox is centered
    // and may have letterboxing. Calculate the actual content scale/offsets.
    const scale = Math.min(rect.width / vw, rect.height / vh);
    const contentW = vw * scale;
    const contentH = vh * scale;
    const offsetX = (rect.width - contentW) / 2;
    const offsetY = (rect.height - contentH) / 2;

    const contentX = e.clientX - rect.left - offsetX;
    const contentY = e.clientY - rect.top - offsetY;

    return {
      x: vx + contentX / scale,
      y: vy + contentY / scale,
    };
  }

  function findNearbyVertex(svgPos: Point): { zoneId: string; vertexIndex: number; points: Point[] } | null {
    const threshold = 0.2 / zoom;
    for (const z of zones) {
      const pts = JSON.parse(z.points) as Point[];
      for (let i = 0; i < pts.length; i++) {
        const dx = pts[i].x - svgPos.x;
        const dy = pts[i].y - svgPos.y;
        if (Math.sqrt(dx * dx + dy * dy) < threshold) {
          return { zoneId: z.id, vertexIndex: i, points: pts };
        }
      }
    }
    return null;
  }

  function findNearbyPlant(svgPos: Point) {
    const threshold = 0.2 / zoom;
    return plants.find((p) => {
      const dx = p.x - svgPos.x;
      const dy = p.y - svgPos.y;
      return Math.sqrt(dx * dx + dy * dy) < threshold;
    });
  }

  function handleSvgMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    const svgPos = getSvgCoords(e);
    if (tool === "select") {
      const nearbyVertex = findNearbyVertex(svgPos);
      if (nearbyVertex) {
        setDragState(nearbyVertex);
        setSelectedZoneId(nearbyVertex.zoneId);
        return;
      }

      const nearbyPlant = findNearbyPlant(svgPos);
      if (nearbyPlant) {
        plantDragRef.current = { plantId: nearbyPlant.id, start: svgPos, current: svgPos, dragging: false };
        plantHandledRef.current = false;
        setSelectedPlantId(nearbyPlant.id);
        setSelectedZoneId(null);
        setPlantDragState(plantDragRef.current);
        return;
      }
    }
  }

  const handleSvgMouseUp = useCallback(
    async () => {
      if (dragState) {
        const newPoints = [...dragState.points];
        await updateZone(dragState.zoneId, { points: newPoints });
        setZones((prev) =>
          prev.map((z) =>
            z.id === dragState.zoneId ? { ...z, points: JSON.stringify(newPoints) } : z
          )
        );
        setDragState(null);
        return;
      }

      if (plantDragRef.current) {
        const { plantId, current, dragging } = plantDragRef.current;

        if (dragging) {
          const zone = zones.find((z) => {
            const pts = JSON.parse(z.points) as Point[];
            return pointInPolygon(current, pts);
          });
          await movePlant(plantId, current.x, current.y, zone?.id ?? null);
          setPlants((prev) =>
            prev.map((p) =>
              p.id === plantId ? { ...p, x: current.x, y: current.y, zoneId: zone?.id ?? null } : p
            )
          );
          plantHandledRef.current = true;
        }

        plantDragRef.current = null;
        setPlantDragState(null);
      }
    },
    [dragState, zones]
  );

  function handleSvgClick(e: React.MouseEvent<SVGSVGElement>) {
    if (dragState) return;
    if (plantHandledRef.current) {
      plantHandledRef.current = false;
      return;
    }

    const svgPos = getSvgCoords(e);
    const x = svgPos.x;
    const y = svgPos.y;

    if (tool === "boundary") {
      const snapped = snapToGrid(x, y);
      setDrawingPoints((prev) => [...prev, snapped]);
      return;
    }

    if (tool === "zone") {
      const snapped = snapToGrid(x, y);
      if (!drawingZoneId) {
        setDrawingPoints([snapped]);
        setDrawingZoneId("drawing");
      } else {
        setDrawingPoints((prev) => [...prev, snapped]);
      }
      return;
    }

    if (tool === "plant") {
      const snapped = snapToGrid(x, y);
      setPlantPlacePosition(snapped);
      setPlantSearchOpen(true);
      setPlantSearchQuery("");
      setPlantSearchResults([]);
      return;
    }

    if (tool === "select") {
      const target = e.target as SVGElement;
      const plantIdFromTarget = target.closest("[data-plant-id]")?.getAttribute("data-plant-id");
      const clickedPlant = plantIdFromTarget
        ? plants.find((p) => p.id === plantIdFromTarget)
        : findNearbyPlant({ x, y });

      if (clickedPlant) {
        setSelectedPlantId(clickedPlant.id);
        setSelectedZoneId(null);
        setPlantDetailOpen(true);
        return;
      }

      const clickedZone = zones.find((z) => {
        const pts = JSON.parse(z.points) as Point[];
        return pointInPolygon({ x, y }, pts);
      });
      if (clickedZone) {
        setSelectedZoneId(clickedZone.id);
        setSelectedPlantId(null);
      } else {
        setSelectedZoneId(null);
        setSelectedPlantId(null);
      }
    }
  }

  function handleSvgMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const svgPos = getSvgCoords(e);
    setMousePos(svgPos);

    if (dragState) {
      const newPoints = [...dragState.points];
      newPoints[dragState.vertexIndex] = snapToGrid(svgPos.x, svgPos.y);
      setDragState((prev) => prev ? { ...prev, points: newPoints } : null);
      setZones((prev) =>
        prev.map((z) =>
          z.id === dragState.zoneId ? { ...z, points: JSON.stringify(newPoints) } : z
        )
      );
      return;
    }

    if (plantDragRef.current) {
      const { start } = plantDragRef.current;
      const newPos = snapToGrid(svgPos.x, svgPos.y);
      const dx = newPos.x - start.x;
      const dy = newPos.y - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (!plantDragRef.current.dragging && distance > 0.05) {
        plantDragRef.current = { ...plantDragRef.current, dragging: true, current: newPos };
      } else if (plantDragRef.current.dragging) {
        plantDragRef.current = { ...plantDragRef.current, current: newPos };
      } else {
        return;
      }

      setPlantDragState({ ...plantDragRef.current });
      return;
    }

    if (tool === "pan" && e.buttons === 1) {
      const svg = svgRef.current;
      if (svg) {
        const rect = svg.getBoundingClientRect();
        const z = zoomRef.current;
        const vw = garden.width / z;
        const vh = garden.height / z;
        const scale = Math.min(rect.width / vw, rect.height / vh);
        setViewOffset((prev) => ({
          x: prev.x - e.movementX / scale,
          y: prev.y - e.movementY / scale,
        }));
      }
    }
  }

  function handleWheel(e: React.WheelEvent<SVGSVGElement>) {
    e.preventDefault();
  }

  function zoomIn() {
    setZoom((z) => Math.min(5, z * 1.3));
  }

  function zoomOut() {
    setZoom((z) => Math.max(0.1, z / 1.3));
  }

  function resetView() {
    setZoom(1);
    setViewOffset({ x: 0, y: 0 });
  }

  async function finishZone() {
    if (drawingPoints.length < 3) return;

    const name = ZONE_COLORS[zoneType].label;
    const color = ZONE_COLORS[zoneType].fill;

    const result = await createZone(garden.id, {
      type: zoneType,
      name,
      points: drawingPoints,
      color,
    });

    if (result.success && result.data) {
      setZones((prev) => [...prev, { ...result.data, points: result.data.points }]);
    }

    setDrawingPoints([]);
    setDrawingZoneId(null);
  }

  function finishBoundary() {
    setBoundaryPoints([...drawingPoints]);
    setDrawingPoints([]);
  }

  async function handleDeleteZone() {
    if (!selectedZoneId) return;
    await deleteZone(selectedZoneId);
    setZones((prev) => prev.filter((z) => z.id !== selectedZoneId));
    setSelectedZoneId(null);
  }

  async function handleSearchPlants() {
    if (plantSearchQuery.length < 2) return;
    setPlantSearchLoading(true);
    setPlantSearchError("");

    const trefleResult = await searchPlants(plantSearchQuery);

    if (trefleResult.error) {
      setPlantSearchError(trefleResult.error);
    } else if (trefleResult.data) {
      const raw = Array.isArray(trefleResult.data) ? trefleResult.data : [];
      const plants: PlantSearchResult[] = raw.map((p: Record<string, unknown>) => ({
        id: p.id as number,
        common_name: (p.common_name || "") as string,
        scientific_name: (p.scientific_name || "") as string,
        image_url: (p.image_url || "") as string,
      }));
      setPlantSearchResults(plants.slice(0, 20));
    }

    setPlantSearchLoading(false);
  }

  async function handlePlacePlant(plant: PlantSearchResult) {
    if (!plantPlacePosition) return;

    const detailResult = await getPlantDetail(plant.id);
    const detail = detailResult.data ?? {};
    const sunlight = Array.isArray(detail.sunlight) ? detail.sunlight.join(", ") : "";
    const trefleGrowth = extractTrefleGrowth(detail);
    const watering = trefleGrowth?.watering ?? "";
    const rawBloom = trefleGrowth?.bloom_months;
    const bloomText = Array.isArray(rawBloom) ? rawBloom.join(", ") : (typeof rawBloom === "string" ? rawBloom : "");
    const bloom = safeParseBloom(bloomText).join(",");

    const result = await addPlant(garden.id, selectedZoneId, {
      x: plantPlacePosition.x,
      y: plantPlacePosition.y,
      name: plant.common_name || plant.scientific_name,
      commonName: plant.common_name,
      scientificName: plant.scientific_name,
      imageUrl: plant.image_url,
      watering: typeof watering === "string" ? watering : "",
      sunlight: typeof sunlight === "string" ? sunlight : "",
      bloomTime: bloom,
      trefleId: plant.id,
    });

    if (result.success && result.data) {
      setPlants((prev) => [...prev, result.data]);
    }

    setPlantSearchOpen(false);
    setPlantPlacePosition(null);
    setPlantSearchResults([]);
    setPlantSearchQuery("");
  }

  async function handleRemovePlant() {
    if (!selectedPlantId) return;
    await removePlant(selectedPlantId);
    setPlants((prev) => prev.filter((p) => p.id !== selectedPlantId));
    setSelectedPlantId(null);
    setPlantDetailOpen(false);
  }

  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  const viewBoxWidth = garden.width / zoom;
  const viewBoxHeight = garden.height / zoom;
  const viewBoxX = viewOffset.x;
  const viewBoxY = viewOffset.y;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-wrap gap-2 items-center">
        <ToolButton active={tool === "select"} onClick={() => { setTool("select"); setDrawingPoints([]); setDrawingZoneId(null); }}>
          Selecteren
        </ToolButton>
        <ToolButton active={tool === "boundary"} onClick={() => { setTool("boundary"); setDrawingPoints([]); setDrawingZoneId(null); }}>
          Omtrek tekenen
        </ToolButton>
        <ToolButton active={tool === "zone"} onClick={() => { setTool("zone"); setDrawingPoints([]); setDrawingZoneId(null); }}>
          Zone tekenen
        </ToolButton>
        <ToolButton active={tool === "plant"} onClick={() => { setTool("plant"); setDrawingPoints([]); setDrawingZoneId(null); }}>
          Plant plaatsen
        </ToolButton>
        <ToolButton active={tool === "pan"} onClick={() => { setTool("pan"); setDrawingPoints([]); setDrawingZoneId(null); }}>
          Verschuiven
        </ToolButton>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          size="sm"
          variant="outline"
          className="rounded-xl border-2 border-input h-9 w-9 p-0"
          onClick={zoomOut}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-xs text-muted-foreground w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl border-2 border-input h-9 w-9 p-0"
          onClick={zoomIn}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl border-2 border-input h-9 w-9 p-0"
          onClick={resetView}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        {tool === "zone" && (
          <select
            value={zoneType}
            onChange={(e) => setZoneType(e.target.value as ZoneType)}
            className="rounded-xl border-2 border-input px-3 py-1.5 text-sm bg-background"
          >
            {ZONE_TYPES.map((t) => (
              <option key={t} value={t}>
                {ZONE_COLORS[t].label}
              </option>
            ))}
          </select>
        )}

        {drawingPoints.length >= 3 && tool === "zone" && (
          <Button
            size="sm"
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={finishZone}
          >
            Zone vastleggen
          </Button>
        )}

        {drawingPoints.length >= 3 && tool === "boundary" && (
          <Button
            size="sm"
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={finishBoundary}
          >
            Omtrek vastleggen
          </Button>
        )}

        <div className="ml-auto flex flex-wrap gap-2 items-center">
          {selectedZoneId && (
            <Button
              size="sm"
              variant="destructive"
              className="rounded-xl"
              onClick={handleDeleteZone}
            >
              Zone verwijderen
            </Button>
          )}

        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-4">
        <Card className="rounded-2xl border-0 overflow-hidden py-0 flex-1 min-h-0">
          <CardContent className="p-0 h-full">
            <svg
              ref={svgRef}
              viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
              className="w-full h-full cursor-crosshair select-none"
              preserveAspectRatio="xMidYMid meet"
              onMouseDown={handleSvgMouseDown}
              onClick={handleSvgClick}
              onMouseMove={handleSvgMouseMove}
              onMouseUp={handleSvgMouseUp}
              onWheel={handleWheel}
              style={{ background: "#F5F5F5" }}
            >
              {boundaryPoints.length >= 3 && (
                <polygon
                  points={boundaryPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="#FFFFFF"
                  stroke="#2E2E2E"
                  strokeWidth={0.04}
                />
              )}

              {renderGrid(GRID_SIZE, viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight)}

              {zones.map((z) => {
                const pts = JSON.parse(z.points) as Point[];
                const colors = ZONE_COLORS[z.type] || ZONE_COLORS.custom;
                return (
                  <g key={z.id}>
                    {selectedZoneId === z.id && (
                      <>
                        <polygon
                          points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                          fill="none"
                          stroke="#ECBA82"
                          strokeWidth={0.015}
                          strokeDasharray="0.15 0.1"
                        />
                        {pts.map((p, i) => (
                          <circle
                            key={`v-${i}`}
                            cx={p.x}
                            cy={p.y}
                            r={0.12}
                            fill="#ECBA82"
                            stroke="#FFFFFF"
                            strokeWidth={0.015}
                            style={{ cursor: "pointer" }}
                          />
                        ))}
                      </>
                    )}
                    <polygon
                      points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={0.005}
                      opacity={0.7}
                    />
                    {renderZonePattern(z.type, pts)}
                  </g>
                );
              })}

              {plants.map((p) => {
                const isDragging = plantDragState?.plantId === p.id && plantDragState.dragging;
                const x = isDragging ? plantDragState.current.x : p.x;
                const y = isDragging ? plantDragState.current.y : p.y;
                return (
                  <g key={p.id} data-plant-id={p.id} style={{ cursor: isDragging ? "grabbing" : "grab" }}>
                    <circle
                      cx={x}
                      cy={y}
                      r={0.25}
                      fill="transparent"
                      stroke="none"
                      data-plant-id={p.id}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={0.12}
                      fill={selectedPlantId === p.id ? "#024F46" : "#4A7C59"}
                      stroke="#FFFFFF"
                      strokeWidth={0.015}
                      data-plant-id={p.id}
                    />
                    <text
                      x={x}
                      y={y - 0.2}
                      textAnchor="middle"
                      fontSize={0.2}
                      fill="#2E2E2E"
                      style={{ fontFamily: "var(--font-sans)", pointerEvents: "none" }}
                    >
                      {p.name}
                    </text>
                  </g>
                );
              })}

              {drawingPoints.length > 0 && (
                <polyline
                  points={drawingPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke={tool === "boundary" ? "#2E2E2E" : "#ECBA82"}
                  strokeWidth={tool === "boundary" ? 0.04 : 0.03}
                  strokeDasharray={tool === "boundary" ? "none" : "0.15 0.1"}
                />
              )}

              {drawingPoints.length > 0 && mousePos && (
                <>
                  <line
                    x1={drawingPoints[drawingPoints.length - 1].x}
                    y1={drawingPoints[drawingPoints.length - 1].y}
                    x2={mousePos.x}
                    y2={mousePos.y}
                    stroke={tool === "boundary" ? "#2E2E2E" : "#ECBA82"}
                    strokeWidth={0.005}
                    strokeDasharray="0.1 0.1"
                    opacity={0.5}
                  />
                  <text
                    x={(drawingPoints[drawingPoints.length - 1].x + mousePos.x) / 2}
                    y={(drawingPoints[drawingPoints.length - 1].y + mousePos.y) / 2 - 0.12}
                    textAnchor="middle"
                    fontSize={0.2}
                    fill={tool === "boundary" ? "#2E2E2E" : "#ECBA82"}
                    style={{ fontFamily: "var(--font-sans)", pointerEvents: "none" }}
                  >
                    {Math.sqrt(
                      (mousePos.x - drawingPoints[drawingPoints.length - 1].x) ** 2 +
                      (mousePos.y - drawingPoints[drawingPoints.length - 1].y) ** 2
                    ).toFixed(2)}m
                  </text>
                </>
              )}

              {drawingPoints.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={0.08}
                  fill={tool === "boundary" ? "#2E2E2E" : "#ECBA82"}
                />
              ))}

              {renderBoundaryLabels(drawingPoints)}
            </svg>
          </CardContent>
        </Card>

        {zones.length > 0 && (
          <div className="flex flex-col gap-2">
            {ZONE_TYPES.map((t) => {
              const count = zones.filter((z) => z.type === t).length;
              if (count === 0) return null;
              return (
                <Badge key={t} className="rounded-xl whitespace-nowrap" variant="secondary">
                  {ZONE_COLORS[t].label}: {count}
                </Badge>
              );
            })}
            <Badge className="rounded-xl whitespace-nowrap" variant="secondary">
              Planten: {plants.length}
            </Badge>
          </div>
        )}
      </div>

      <PlantSearchDrawer
        open={plantSearchOpen}
        onClose={() => {
          setPlantSearchOpen(false);
          setPlantPlacePosition(null);
          setPlantSearchResults([]);
          setPlantSearchQuery("");
        }}
        query={plantSearchQuery}
        onQueryChange={setPlantSearchQuery}
        onSearch={handleSearchPlants}
        results={plantSearchResults}
        loading={plantSearchLoading}
        error={plantSearchError}
        onSelect={handlePlacePlant}
      />

      <Dialog open={plantDetailOpen} onOpenChange={setPlantDetailOpen}>
        <DialogContent className="rounded-2xl border-0 sm:max-w-md">
          <DialogHeader>
            <DialogTitle
              className="text-xl text-[#2E2E2E]"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
            >
              {selectedPlant?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedPlant && (
            <div className="space-y-4">
              {selectedPlant.imageUrl && (
                <div className="relative w-full h-48">
                  <Image
                    src={selectedPlant.imageUrl}
                    alt={selectedPlant.name}
                    fill
                    unoptimized
                    className="object-cover rounded-xl"
                  />
                </div>
              )}
              {selectedPlant.scientificName && (
                <p className="text-muted-foreground italic">{selectedPlant.scientificName}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {selectedPlant.sunlight && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Zonlicht</Label>
                    <p className="text-sm">{selectedPlant.sunlight}</p>
                  </div>
                )}
                {selectedPlant.watering && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Water geven</Label>
                    <p className="text-sm">{selectedPlant.watering}</p>
                  </div>
                )}
                {selectedPlant.bloomTime && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Bloeiperiode</Label>
                    <p className="text-sm">{selectedPlant.bloomTime}</p>
                  </div>
                )}
              </div>
              {selectedPlant.notes && (
                <div>
                  <Label className="text-xs text-muted-foreground">Notities</Label>
                  <p className="text-sm">{selectedPlant.notes}</p>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl"
                  onClick={handleRemovePlant}
                >
                  Verwijderen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      className={`rounded-xl text-sm h-9 ${
        active
          ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
          : "border-2 border-input hover:bg-muted"
      }`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function PlantSearchDrawer({
  open,
  onClose,
  query,
  onQueryChange,
  onSearch,
  results,
  loading,
  error,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (v: string) => void;
  onSearch: () => void;
  results: PlantSearchResult[];
  loading: boolean;
  error: string;
  onSelect: (plant: PlantSearchResult) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="rounded-t-2xl border-0 max-h-[70vh]">
        <DrawerHeader>
          <DrawerTitle
            className="text-xl text-[#2E2E2E]"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
          >
            Plant zoeken
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-6 pb-8 pt-2 space-y-5">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Zoek op naam..."
              className="rounded-xl border-input border-2"
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
            <Button
              onClick={onSearch}
              disabled={loading || query.length < 2}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Zoek
            </Button>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="space-y-2 overflow-y-auto max-h-[40vh]">
            {results.map((plant) => (
              <Card
                key={plant.id}
                className="rounded-xl border-0 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onSelect(plant)}
              >
                <CardContent className="flex items-center gap-3 p-3">
                  {plant.image_url && (
                    <Image
                      src={plant.image_url}
                      alt={plant.common_name}
                      width={48}
                      height={48}
                      unoptimized
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-sm">{plant.common_name}</p>
                    <p className="text-xs text-muted-foreground italic">{plant.scientific_name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!loading && query.length >= 2 && results.length === 0 && !error && (
              <p className="text-muted-foreground text-sm text-center py-4">
                Geen resultaten gevonden.
              </p>
            )}
            {loading && (
              <p className="text-muted-foreground text-sm text-center py-4">
                Zoeken...
              </p>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function renderGrid(
  size: number,
  vx: number,
  vy: number,
  vw: number,
  vh: number
) {
  const lines = [];
  const margin = 50;
  const startX = Math.floor((vx - margin) / size) * size;
  const endX = Math.ceil((vx + vw + margin) / size) * size;
  const startY = Math.floor((vy - margin) / size) * size;
  const endY = Math.ceil((vy + vh + margin) / size) * size;

  for (let x = startX; x <= endX; x += size) {
    lines.push(
      <line
        key={`v${x}`}
        x1={x}
        y1={vy - margin}
        x2={x}
        y2={vy + vh + margin}
        stroke="#E9E6E6"
        strokeWidth={Math.round(x * 100) % 100 === 0 ? 0.01 : 0.005}
      />
    );
  }

  for (let y = startY; y <= endY; y += size) {
    lines.push(
      <line
        key={`h${y}`}
        x1={vx - margin}
        y1={y}
        x2={vx + vw + margin}
        y2={y}
        stroke="#E9E6E6"
        strokeWidth={Math.round(y * 100) % 100 === 0 ? 0.01 : 0.005}
      />
    );
  }

  return <g>{lines}</g>;
}

function renderZonePattern(type: string, points: Point[]) {
  if (type === "grass") {
    const centerX = points.reduce((s, p) => s + p.x, 0) / points.length;
    const centerY = points.reduce((s, p) => s + p.y, 0) / points.length;
    const lineCount = 12;
    const elements = [];
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI;
      const dx = Math.cos(angle) * 0.08;
      const dy = Math.sin(angle) * 0.08;
      elements.push(
        <line
          key={`grass-${i}`}
          x1={centerX - dx + (i % 3) * 0.2 - 0.2}
          y1={centerY - dy}
          x2={centerX - dx + (i % 3) * 0.2 - 0.2 + 0.1}
          y2={centerY - dy - 0.15}
          stroke="#81C784"
          strokeWidth={0.005}
          opacity={0.6}
        />
      );
    }
    return <g>{elements}</g>;
  }

  if (type === "terrace") {
    const elements = [];
    for (let i = 0; i < 8; i++) {
      elements.push(
        <line
          key={`ter-${i}`}
          x1={points[0].x + i * 0.4}
          y1={points[0].y}
          x2={points[0].x + i * 0.4 + 0.3}
          y2={points[0].y + 0.3}
          stroke="#BDBDBD"
          strokeWidth={0.005}
          opacity={0.5}
        />
      );
    }
    return <g>{elements}</g>;
  }

  if (type === "pergola") {
    const elements = [];
    const minX = Math.min(...points.map((p) => p.x));
    const maxX = Math.max(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y));
    const maxY = Math.max(...points.map((p) => p.y));
    const spacing = 0.3;

    for (let x = minX; x <= maxX; x += spacing) {
      elements.push(
        <line
          key={`perg-h-${x}`}
          x1={x}
          y1={minY}
          x2={x}
          y2={maxY}
          stroke="#8B5A2B"
          strokeWidth={0.005}
          opacity={0.7}
          strokeDasharray="0.15 0.08"
        />
      );
    }

    for (let y = minY; y <= maxY; y += spacing) {
      elements.push(
        <line
          key={`perg-v-${y}`}
          x1={minX}
          y1={y}
          x2={maxX}
          y2={y}
          stroke="#8B5A2B"
          strokeWidth={0.015}
          opacity={0.7}
        />
      );
    }

    return <g>{elements}</g>;
  }

  return null;
}

function renderBoundaryLabels(points: Point[]) {
  if (points.length < 2) return null;

  return (
    <g>
      {points.map((p, i) => {
        const next = points[(i + 1) % points.length];
        const midX = (p.x + next.x) / 2;
        const midY = (p.y + next.y) / 2;
        const dist = Math.sqrt((next.x - p.x) ** 2 + (next.y - p.y) ** 2);

        return (
          <text
            key={`label-${i}`}
            x={midX}
            y={midY - 0.15}
            textAnchor="middle"
            fontSize={0.22}
            fill="#82817A"
            style={{ fontFamily: "var(--font-sans)", pointerEvents: "none" }}
          >
            {dist.toFixed(2)}m
          </text>
        );
      })}
    </g>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTrefleGrowth(detail: any) {
  return detail.main_species?.growth || detail.growth || {};
}

function snapToGrid(x: number, y: number): Point {
  return {
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE,
  };
}

function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    if (yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}
