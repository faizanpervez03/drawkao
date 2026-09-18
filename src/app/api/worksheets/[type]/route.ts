import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts, PDFPage } from "pdf-lib";

const COLORS = {
  green: rgb(0.18, 0.49, 0.2),
  orange: rgb(0.96, 0.65, 0.14),
  blue: rgb(0.36, 0.61, 0.9),
  purple: rgb(0.58, 0.46, 0.8),
  red: rgb(0.9, 0.45, 0.45),
  gray: rgb(0.5, 0.5, 0.5),
  lightGray: rgb(0.85, 0.85, 0.85),
  black: rgb(0, 0, 0),
  white: rgb(1, 1, 1),
  bg: rgb(0.98, 0.98, 0.96),
};

function drawDottedLine(page: PDFPage, x1: number, y1: number, x2: number, y2: number, color = COLORS.lightGray) {
  const steps = 30;
  const dx = (x2 - x1) / steps;
  const dy = (y2 - y1) / steps;
  for (let i = 0; i <= steps; i += 2) {
    page.drawCircle({ x: x1 + dx * i, y: y1 + dy * i, size: 0.8, color });
  }
}

function drawRoundedRect(page: PDFPage, x: number, y: number, w: number, h: number, r: number, color: typeof COLORS.green) {
  page.drawRectangle({ x, y, width: w, height: h, borderColor: color, borderWidth: 1.5, color: COLORS.white, opacity: 0.5 });
}

async function generateAlphabetWorksheet(pdf: PDFDocument, font: any, boldFont: any) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const rows = Math.ceil(letters.length / 4);

  for (let pageIdx = 0; pageIdx < Math.ceil(rows / 5); pageIdx++) {
    const page = pdf.addPage([595, 842]);
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: COLORS.bg });

    page.drawText("Draw Kao - Alphabet Practice", { x: 180, y: 800, size: 18, font: boldFont, color: COLORS.green });
    page.drawText("Trace the letters, then practice on your own!", { x: 170, y: 780, size: 10, font, color: COLORS.gray });

    const startX = 40;
    const startY = 740;
    const colWidth = 135;
    const rowHeight = 120;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        const idx = pageIdx * 20 + row * 4 + col;
        if (idx >= letters.length) break;

        const x = startX + col * colWidth;
        const y = startY - row * rowHeight;
        const letter = letters[idx];

        drawRoundedRect(page, x, y - 100, 125, 110, 8, COLORS.green);

        page.drawText(letter, { x: x + 45, y: y - 15, size: 40, font: boldFont, color: COLORS.green });

        drawDottedLine(page, x + 15, y - 45, x + 110, y - 45, COLORS.lightGray);
        page.drawText(`${letter.toLowerCase()}`, { x: x + 45, y: y - 42, size: 12, font, color: COLORS.lightGray });

        drawDottedLine(page, x + 15, y - 70, x + 110, y - 70, COLORS.lightGray);
        page.drawText(`${letter.toLowerCase()}`, { x: x + 45, y: y - 67, size: 12, font, color: COLORS.lightGray });

        page.drawText("_", { x: x + 45, y: y - 92, size: 12, font, color: COLORS.lightGray });
      }
    }
  }
}

async function generateNumberWorksheet(pdf: PDFDocument, font: any, boldFont: any) {
  for (let pageIdx = 0; pageIdx < 2; pageIdx++) {
    const page = pdf.addPage([595, 842]);
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: COLORS.bg });

    page.drawText("Draw Kao - Number Practice", { x: 185, y: 800, size: 18, font: boldFont, color: COLORS.orange });
    page.drawText("Trace the numbers, then write them yourself!", { x: 170, y: 780, size: 10, font, color: COLORS.gray });

    const numbers = pageIdx === 0 ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] : ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
    const startX = 60;
    const startY = 730;
    const colWidth = 250;
    const rowHeight = 65;

    for (let i = 0; i < numbers.length; i++) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = startX + col * colWidth;
      const y = startY - row * rowHeight;
      const num = numbers[i];

      drawRoundedRect(page, x - 10, y - 50, 220, 55, 6, COLORS.orange);

      const numWidth = num.length * 28;
      page.drawText(num, { x: x + 50 - (num.length > 1 ? 8 : 0), y: y - 10, size: 32, font: boldFont, color: COLORS.orange });

      drawDottedLine(page, x + 100, y - 5, x + 195, y - 5, COLORS.lightGray);
      page.drawText("_", { x: x + 140, y: y - 12, size: 12, font, color: COLORS.lightGray });

      drawDottedLine(page, x + 100, y - 30, x + 195, y - 30, COLORS.lightGray);
      page.drawText("_", { x: x + 140, y: y - 37, size: 12, font, color: COLORS.lightGray });
    }
  }
}

async function generateShapeWorksheet(pdf: PDFDocument, font: any, boldFont: any) {
  const shapes = [
    { name: "Circle", emoji: "O" },
    { name: "Square", emoji: "[]" },
    { name: "Triangle", emoji: "/\\" },
    { name: "Star", emoji: "*" },
    { name: "Heart", emoji: "<3" },
    { name: "Diamond", emoji: "<>" },
    { name: "Rectangle", emoji: "[]" },
    { name: "Oval", emoji: "0" },
  ];

  const page = pdf.addPage([595, 842]);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: COLORS.bg });

  page.drawText("Draw Kao - Shape Practice", { x: 185, y: 800, size: 18, font: boldFont, color: COLORS.blue });
  page.drawText("Learn to draw shapes step by step!", { x: 185, y: 780, size: 10, font, color: COLORS.gray });

  const startX = 40;
  const startY = 730;
  const colWidth = 270;
  const rowHeight = 100;

  for (let i = 0; i < shapes.length; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = startX + col * colWidth;
    const y = startY - row * rowHeight;
    const shape = shapes[i];

    drawRoundedRect(page, x, y - 85, 250, 90, 8, COLORS.blue);

    page.drawText(shape.name, { x: x + 15, y: y - 10, size: 14, font: boldFont, color: COLORS.blue });

    page.drawCircle({ x: x + 50, y: y - 50, size: 15, borderColor: COLORS.blue, borderWidth: 1.5 });
    drawDottedLine(page, x + 80, y - 45, x + 150, y - 45, COLORS.lightGray);
    page.drawText("_", { x: x + 110, y: y - 52, size: 10, font, color: COLORS.lightGray });
    drawDottedLine(page, x + 160, y - 45, x + 230, y - 45, COLORS.lightGray);
    page.drawText("_", { x: x + 190, y: y - 52, size: 10, font, color: COLORS.lightGray });

    page.drawText("Draw here:", { x: x + 15, y: y - 72, size: 8, font, color: COLORS.gray });
  }
}

async function generateColoringWorksheet(pdf: PDFDocument, font: any, boldFont: any) {
  const animals = [
    { name: "Cat", emoji: "Cat Face" },
    { name: "Dog", emoji: "Dog Face" },
    { name: "Bird", emoji: "Bird" },
    { name: "Fish", emoji: "Fish" },
    { name: "Lion", emoji: "Lion Face" },
    { name: "Elephant", emoji: "Elephant" },
  ];

  const page = pdf.addPage([595, 842]);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: COLORS.bg });

  page.drawText("Draw Kao - Coloring Pages", { x: 185, y: 800, size: 18, font: boldFont, color: COLORS.purple });
  page.drawText("Color in these friendly animals!", { x: 190, y: 780, size: 10, font, color: COLORS.gray });

  const startX = 40;
  const startY = 730;
  const colWidth = 175;
  const rowHeight = 120;

  for (let i = 0; i < animals.length; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = startX + col * colWidth;
    const y = startY - row * rowHeight;
    const animal = animals[i];

    drawRoundedRect(page, x, y - 100, 160, 105, 8, COLORS.purple);

    page.drawCircle({ x: x + 80, y: y - 50, size: 25, borderColor: COLORS.purple, borderWidth: 1.5 });

    page.drawText(animal.name, { x: x + 50, y: y - 85, size: 12, font: boldFont, color: COLORS.purple });

    drawDottedLine(page, x + 15, y - 100, x + 145, y - 100, COLORS.lightGray);
  }
}

async function generateAnimalWorksheet(pdf: PDFDocument, font: any, boldFont: any) {
  const animals = [
    { name: "Cat", emoji: "Cat", steps: ["Draw head circle", "Add triangle ears", "Draw eyes & nose", "Add whiskers"] },
    { name: "Dog", emoji: "Dog", steps: ["Draw head circle", "Add floppy ears", "Draw eyes & nose", "Add tongue"] },
    { name: "Bird", emoji: "Bird", steps: ["Draw body oval", "Add wing", "Draw beak", "Add tail feathers"] },
    { name: "Fish", emoji: "Fish", steps: ["Draw body oval", "Add tail", "Draw eye", "Add fins"] },
    { name: "Lion", emoji: "Lion", steps: ["Draw mane circle", "Add face inside", "Draw eyes & nose", "Add mouth"] },
    { name: "Elephant", emoji: "Elephant", steps: ["Draw head circle", "Add big ears", "Draw trunk", "Add eyes"] },
  ];

  const page = pdf.addPage([595, 842]);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: COLORS.bg });

  page.drawText("Draw Kao - Animal Drawing Guide", { x: 175, y: 800, size: 18, font: boldFont, color: COLORS.red });
  page.drawText("Follow the steps to draw each animal!", { x: 185, y: 780, size: 10, font, color: COLORS.gray });

  const startX = 40;
  const startY = 730;
  const colWidth = 270;
  const rowHeight = 110;

  for (let i = 0; i < animals.length; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = startX + col * colWidth;
    const y = startY - row * rowHeight;
    const animal = animals[i];

    drawRoundedRect(page, x, y - 95, 250, 100, 8, COLORS.red);

    page.drawText(animal.name, { x: x + 15, y: y - 10, size: 14, font: boldFont, color: COLORS.red });

    animal.steps.forEach((step, si) => {
      const stepX = x + 15 + (si % 2) * 125;
      const stepY = y - 35 - Math.floor(si / 2) * 25;

      page.drawCircle({ x: stepX + 5, y: stepY + 4, size: 5, color: COLORS.red });
      page.drawText(`${si + 1}`, { x: stepX + 3, y: y - 33 - Math.floor(si / 2) * 25, size: 7, font: boldFont, color: COLORS.white });
      page.drawText(step, { x: stepX + 15, y: stepY, size: 8, font, color: COLORS.black });
    });

    drawDottedLine(page, x + 15, y - 95, x + 235, y - 95, COLORS.lightGray);
  }
}

async function generateVehiclesWorksheet(pdf: PDFDocument, font: any, boldFont: any) {
  const vehicles = [
    { name: "Car", steps: ["Draw rectangle body", "Add wheels", "Draw windows", "Add details"] },
    { name: "Train", steps: ["Draw rectangles", "Add wheels", "Draw smokestack", "Add windows"] },
    { name: "Airplane", steps: ["Draw body", "Add wings", "Draw tail", "Add windows"] },
    { name: "Boat", steps: ["Draw hull", "Add sail", "Draw mast", "Add waves"] },
    { name: "Bus", steps: ["Draw rectangle", "Add wheels", "Draw windows", "Add door"] },
    { name: "Bicycle", steps: ["Draw wheels", "Add frame", "Draw handlebars", "Add seat"] },
  ];

  const page = pdf.addPage([595, 842]);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: COLORS.bg });

  page.drawText("Draw Kao - Vehicle Drawing Guide", { x: 175, y: 800, size: 18, font: boldFont, color: COLORS.orange });
  page.drawText("Follow the steps to draw each vehicle!", { x: 185, y: 780, size: 10, font, color: COLORS.gray });

  const startX = 40;
  const startY = 730;
  const colWidth = 270;
  const rowHeight = 110;

  for (let i = 0; i < vehicles.length; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = startX + col * colWidth;
    const y = startY - row * rowHeight;
    const vehicle = vehicles[i];

    drawRoundedRect(page, x, y - 95, 250, 100, 8, COLORS.orange);

    page.drawText(vehicle.name, { x: x + 15, y: y - 10, size: 14, font: boldFont, color: COLORS.orange });

    vehicle.steps.forEach((step, si) => {
      const stepX = x + 15 + (si % 2) * 125;
      const stepY = y - 35 - Math.floor(si / 2) * 25;

      page.drawCircle({ x: stepX + 5, y: stepY + 4, size: 5, color: COLORS.orange });
      page.drawText(`${si + 1}`, { x: stepX + 3, y: y - 33 - Math.floor(si / 2) * 25, size: 7, font: boldFont, color: COLORS.white });
      page.drawText(step, { x: stepX + 15, y: stepY, size: 8, font, color: COLORS.black });
    });

    drawDottedLine(page, x + 15, y - 95, x + 235, y - 95, COLORS.lightGray);
  }
}

const WORKSHEET_GENERATORS: Record<string, (pdf: PDFDocument, font: any, boldFont: any) => Promise<void>> = {
  alphabet: generateAlphabetWorksheet,
  numbers: generateNumberWorksheet,
  shapes: generateShapeWorksheet,
  coloring: generateColoringWorksheet,
  animals: generateAnimalWorksheet,
  vehicles: generateVehiclesWorksheet,
};

const WORKSHEET_NAMES: Record<string, string> = {
  alphabet: "Alphabet Tracing A-Z",
  numbers: "Number Practice 1-20",
  shapes: "Shape Coloring Book",
  coloring: "Animal Coloring Pages",
  animals: "Animal Drawing Guide",
  vehicles: "Vehicle Drawing Guide",
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;

  if (!WORKSHEET_GENERATORS[type]) {
    return NextResponse.json({ error: "Unknown worksheet type" }, { status: 400 });
  }

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  await WORKSHEET_GENERATORS[type](pdf, font, boldFont);

  const pdfBytes = await pdf.save();
  const fileName = `${WORKSHEET_NAMES[type] || type}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
