type Point = { x: number; y: number };

type Plant = Point & {
    type: string;
    waterNeeds: string;
    sunlight: string;
    spacing: number;
};

type PlantPot = Point;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const gridSize = 20;

let mode: "draw" | "pot" | "plant" = "draw";
let isDrawing = false;
let isGardenLocked = false;
let gardenPath = new Path2D();
let gardenPathData: Point[] = [];

const plantPots: PlantPot[] = [];
const plants: Plant[] = [];

let hoveredPlant: Plant | null = null;

function setMode(newMode: typeof mode) {
    mode = newMode;
}

function lockGarden() {
    isGardenLocked = true;
}

canvas.addEventListener("mousedown", (e: MouseEvent) => {
    const x = Math.floor(e.offsetX / gridSize) * gridSize + gridSize / 2;
    const y = Math.floor(e.offsetY / gridSize) * gridSize + gridSize / 2;

    if (mode === "draw" && !isGardenLocked) {
        isDrawing = true;
        gardenPath.moveTo(e.offsetX, e.offsetY);
        gardenPathData.push({ x: e.offsetX, y: e.offsetY });
    } else if (isGardenLocked) {
        if (mode === "pot" && ctx.isPointInPath(gardenPath, x, y)) {
            plantPots.push({ x, y });
            redraw();
        } else if (mode === "plant" && ctx.isPointInPath(gardenPath, x, y)) {
            plants.push({ x, y, type: "", waterNeeds: "", sunlight: "", spacing: 30 });
            redraw();
        }
    }
});

canvas.addEventListener("mousemove", (e: MouseEvent) => {
    hoveredPlant = null;
    for (const plant of plants) {
        const dx = plant.x - e.offsetX;
        const dy = plant.y - e.offsetY;
        if (Math.sqrt(dx * dx + dy * dy) < 10) {
            hoveredPlant = plant;
            break;
        }
    }

    if (mode === "draw" && isDrawing && !isGardenLocked) {
        gardenPath.lineTo(e.offsetX, e.offsetY);
        gardenPathData.push({ x: e.offsetX, y: e.offsetY });
    }

    redraw();
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

canvas.addEventListener("click", (e: MouseEvent) => {
    if (mode !== "plant") return;

    const clickX = e.offsetX;
    const clickY = e.offsetY;

    for (const plant of plants) {
        const dx = plant.x - clickX;
        const dy = plant.y - clickY;
        if (Math.sqrt(dx * dx + dy * dy) < 10) {
            const type = prompt("Plant type:", plant.type) ?? plant.type;
            const waterNeeds = prompt("Water needs (Daily, Moderate, Low):", plant.waterNeeds) ?? plant.waterNeeds;
            const sunlight = prompt("Sunlight (Full Sun, Partial, Shade):", plant.sunlight) ?? plant.sunlight;
            const spacing = parseInt(prompt("Spacing in cm:", String(plant.spacing)) ?? String(plant.spacing), 10);

            plant.type = type;
            plant.waterNeeds = waterNeeds;
            plant.sunlight = sunlight;
            plant.spacing = spacing;
            redraw();
            break;
        }
    }
});

function drawGrid() {
    ctx.strokeStyle = "#eee";
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function getViolations(): Set<Plant> {
    const violating = new Set<Plant>();
    for (let i = 0; i < plants.length; i++) {
        for (let j = i + 1; j < plants.length; j++) {
            const a = plants[i];
            const b = plants[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minSpacing = Math.min(a.spacing, b.spacing);
            if (dist < minSpacing) {
                violating.add(a);
                violating.add(b);
            }
        }
    }
    return violating;
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    ctx.strokeStyle = "#228B22";
    ctx.lineWidth = 2;
    ctx.stroke(gardenPath);

    // Draw pots
    plantPots.forEach(pot => {
        ctx.fillStyle = "#964B00";
        ctx.beginPath();
        ctx.arc(pot.x, pot.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();
    });

    const violations = getViolations();

    // Draw plants
    plants.forEach(plant => {
        if (plant === hoveredPlant) {
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.beginPath();
            ctx.arc(plant.x, plant.y, plant.spacing, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.fillStyle = "#32CD32";
        ctx.beginPath();
        ctx.arc(plant.x, plant.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = violations.has(plant) ? "red" : "#006400";
        ctx.lineWidth = 2;
        ctx.stroke();

        if (plant === hoveredPlant) {
            const info = `🌱 ${plant.type}
💧 ${plant.waterNeeds}
☀️ ${plant.sunlight}
📏 ${plant.spacing} cm` +
                (violations.has(plant) ? "\n⚠️ Too close!" : "");

            const lines = info.split("\n");
            const boxX = plant.x + 15;
            const boxY = plant.y - 10;

            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(boxX, boxY, 150, lines.length * 16 + 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#000";
            ctx.font = "12px sans-serif";
            lines.forEach((line, i) => {
                ctx.fillText(line, boxX + 6, boxY + 18 + i * 14);
            });
        }
    });
}

function saveGarden() {
    const data = {
        gardenPathData,
        plantPots,
        plants
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-garden.json";
    a.click();
}

function loadGarden(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const json = reader.result as string;
        const data = JSON.parse(json);

        gardenPathData = data.gardenPathData || [];
        plantPots.length = 0;
        plantPots.push(...(data.plantPots || []));
        plants.length = 0;
        plants.push(...(data.plants || []));
        gardenPath = new Path2D();
        redraw();
    };
    reader.readAsText(file);
}
