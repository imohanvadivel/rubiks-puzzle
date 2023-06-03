import { countryCode } from "./data";

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomColorSeq() {
    let colorSeq = "";
    let hexcodes = ["W", "Y", "B", "G", "R", "O"];

    for (let i = 0; i < 9; i++) {
        colorSeq += hexcodes[rand(0, 5)];
    }
    return colorSeq;
}

function getCubeFace(seq) {
    let colorMap = {
        W: "#FFFFFF",
        Y: "#FFFF00",
        B: "#5151FF",
        G: "#409D2C",
        R: "#FF0000",
        O: "#FFA500",
    };

    function hexToFigmaPaintStyle(hex) {
        // Remove the leading '#' character if present
        hex = hex.replace("#", "");

        // Parse the hexadecimal values for red, green, and blue components
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        // Construct the Figma paint style object
        const paintStyle = { r, g, b };

        return paintStyle;
    }

    function clone(val) {
        return JSON.parse(JSON.stringify(val));
    }

    let frame = figma.createFrame();
    frame.resize(240, 240);
    frame.cornerRadius = 8;
    frame.clipsContent = false;

    let paintStyle = hexToFigmaPaintStyle("#707070");
    frame.fills = [];

    let colorAry = seq.split("").map((e) => colorMap[e]);
    let y = -80;
    for (let i = 0; i < 9; i++) {
        let paintStyle = hexToFigmaPaintStyle(colorAry[i]);

        let rect = figma.createRectangle();
        let fills = clone(rect.fills);
        fills[0].color.r = paintStyle.r;
        fills[0].color.g = paintStyle.g;
        fills[0].color.b = paintStyle.b;

        rect.fills = fills;
        rect.resize(80, 80);
        rect.cornerRadius = 8;

        // co-ordinate
        rect.x = (i * 80) % 240;
        if (i % 3 === 0) y += 80;
        rect.y = y;

        // Layer name
        rect.name = `${i + 1}`;

        // Stroke
        rect.strokeWeight = 3;
        rect.strokeAlign = "INSIDE";
        rect.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];

        // Effect
        rect.effects = [
            {
                type: "DROP_SHADOW",
                visible: true,
                blendMode: "NORMAL",
                color: { r: 0, b: 0, g: 0, a: 0.25 },
                offset: { x: 0, y: 0 },
                spread: 1,
                radius: 8,
            },
        ];

        frame.appendChild(rect);
    }

    // Appending the frame into canvas
    figma.currentPage.appendChild(frame);
    let { x: x1, y: y1, width, height } = figma.viewport.bounds;
    frame.x = Math.round(x1 + width / 2);
    frame.y = Math.round(y1 + height / 2);
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
    return frame;
}

let type = figma.command;
let colorSeq = getRandomColorSeq();
let countryName = "";

if (type === "country") {
    let selCountry = countryCode[rand(0, 50)];
    countryName = selCountry[0];
    colorSeq = selCountry[1];
}

let face = getCubeFace(colorSeq);

let closingMessage = "";
if (type === "country") {
    closingMessage = `${countryName}'s flag`;
    face.name = countryName;
}
figma.closePlugin(closingMessage);
