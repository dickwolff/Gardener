class GardenPlanner {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private gardenPath: { x: number, y: number }[] = [];
    private plants: { x: number, y: number, type: string }[] = [];
    private pots: { x: number, y: number }[] = [];
    private gridSize: number = 20; // Grid size
    private currentLineStart: { x: number, y: number } | null = null;
    private currentTool: string = 'draw'; // Default tool is draw

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.setupCanvas();
        this.addEventListeners();
    }

    private setupCanvas() {
        this.canvas.width = 1200;
        this.canvas.height = 800;
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#000';
        this.ctx.lineJoin = 'round';
    }

    private addEventListeners() {
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    }

    private startDrawing(event: MouseEvent) {
        const mousePos = this.getMousePosition(event);
        if (this.currentTool === 'draw') {
            this.currentLineStart = this.snapToGrid(mousePos);
            this.gardenPath.push(this.currentLineStart);
        } else if (this.currentTool === 'plant') {
            this.addPlant(mousePos.x, mousePos.y, 'Rose');
        } else if (this.currentTool === 'pot') {
            this.addPot(mousePos.x, mousePos.y);
        }
    }

    private draw(event: MouseEvent) {
        if (!this.currentLineStart) return;

        const mousePos = this.getMousePosition(event);
        const snappedPos = this.snapToGrid(mousePos);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas for redrawing
        this.redraw();
        
        // Draw the current line being drawn
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentLineStart.x, this.currentLineStart.y);
        this.ctx.lineTo(snappedPos.x, snappedPos.y);
        this.ctx.stroke();
    }

    private stopDrawing(event: MouseEvent) {
        if (!this.currentLineStart) return;

        const mousePos = this.getMousePosition(event);
        const snappedPos = this.snapToGrid(mousePos);

        this.gardenPath.push(snappedPos);
        this.currentLineStart = null;
    }

    private getMousePosition(event: MouseEvent): { x: number, y: number } {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    private snapToGrid(position: { x: number, y: number }): { x: number, y: number } {
        return {
            x: Math.round(position.x / this.gridSize) * this.gridSize,
            y: Math.round(position.y / this.gridSize) * this.gridSize,
        };
    }

    private redraw() {
        this.drawGrid();   // Draw the grid first
        this.drawGarden();
        this.drawPlants();
        this.drawPots();
    }

    // Method to draw the grid
    private drawGrid() {
        const gridColor = '#ddd';
        const gridLineWidth = 0.5;

        // Draw vertical lines
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.strokeStyle = gridColor;
            this.ctx.lineWidth = gridLineWidth;
            this.ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y < this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.strokeStyle = gridColor;
            this.ctx.lineWidth = gridLineWidth;
            this.ctx.stroke();
        }
    }

    private drawGarden() {
        if (this.gardenPath.length < 2) return;

        this.ctx.beginPath();
        this.ctx.moveTo(this.gardenPath[0].x, this.gardenPath[0].y);

        for (let i = 1; i < this.gardenPath.length; i++) {
            this.ctx.lineTo(this.gardenPath[i].x, this.gardenPath[i].y);
        }

        this.ctx.closePath();
        this.ctx.stroke();
    }

    private drawPlants() {
        this.plants.forEach(plant => {
            this.ctx.beginPath();
            this.ctx.arc(plant.x, plant.y, 10, 0, 2 * Math.PI); // Drawing the plant as a circle
            this.ctx.fillStyle = 'green';
            this.ctx.fill();
            this.ctx.strokeStyle = 'black';
            this.ctx.stroke();
        });
    }

    private drawPots() {
        this.pots.forEach(pot => {
            this.ctx.beginPath();
            this.ctx.rect(pot.x - 10, pot.y - 10, 20, 20); // Drawing the pot as a square
            this.ctx.fillStyle = 'brown';
            this.ctx.fill();
            this.ctx.strokeStyle = 'black';
            this.ctx.stroke();
        });
    }

    // Method to add a plant at specific coordinates
    addPlant(x: number, y: number, type: string) {
        this.plants.push({ x, y, type });
        this.redraw();
    }

    // Method to add a pot at specific coordinates
    addPot(x: number, y: number) {
        this.pots.push({ x, y });
        this.redraw();
    }

    // Method to save the garden layout
    saveGarden() {
        const gardenData = {
            gardenPath: this.gardenPath,
            plants: this.plants,
            pots: this.pots,
        };
        localStorage.setItem('gardenLayout', JSON.stringify(gardenData));
    }

    // Method to load the garden layout from localStorage
    loadGarden(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files?.length) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const gardenData = JSON.parse(e.target?.result as string);
                this.gardenPath = gardenData.gardenPath;
                this.plants = gardenData.plants;
                this.pots = gardenData.pots;
                this.redraw();
            };
            reader.readAsText(file);
        }
    }

    // Method to set the current mode (tool)
    setMode(tool: string) {
        this.currentTool = tool;
    }

    // Lock the garden (disable drawing)
    lockGarden() {
        this.currentTool = 'locked';
    }
}

// Initialize garden planner
const gardenPlanner = new GardenPlanner('canvas');

// Event listeners for the toolbar buttons
function setMode(tool: string) {
    gardenPlanner.setMode(tool);
}

function lockGarden() {
    gardenPlanner.lockGarden();
}

function saveGarden() {
    gardenPlanner.saveGarden();
}

function loadGarden(event: Event) {
    gardenPlanner.loadGarden(event);
}
