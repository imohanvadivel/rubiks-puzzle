(() => {
  // src/data.js
  var countryCode = [
    ["France", "BWRBWRBWR"],
    ["netherland", "RRRWWWBBB"],
    ["Russia", "WWWBBBRRR"],
    ["Italy", "GWRGWRGWR"],
    ["Ireland", "GWOGWOGWO"],
    ["Romania", "BYRBYRBYR"],
    ["Ivory Coast", "OWGOWGOWG"],
    ["Chad", "BYRBYRBYR"],
    ["Guinea", "RYGRYGRYG"],
    ["Mali", "GYRGYRGYR"],
    ["Niger", "OOOWOWGGG"],
    ["Nigeria", "GWGGWGGWG"],
    ["Bulgaria", "WWWGGGRRR"],
    ["Luxembourg", "RRRWWWBBB"],
    ["Armenia", "RRRBBBOOO"],
    ["Latvia", "RRRWWWRRR"],
    ["India", "OOOWWWGGG"],
    ["Iran", "GGGWWWRRR"],
    ["Andorra", "BYRBYRBYR"],
    ["Austria", "RRRWWWRRR"],
    ["Bolivia", "RRRYYYGGG"],
    ["Cameroon", "GYRGYRGYR"],
    ["Colombia", "YYYBBBRRR"],
    ["Croatia", "RRRWWWBBB"],
    ["Dominican Republic", "BWRWWWRWB"],
    ["Ecuador", "YYYBBBRRR"],
    ["El Salvador", "BBBWWWBBB"],
    ["Equatorial Guinea", "GGGBWWRRR"],
    ["Finland", "WBWBBBWBW"],
    ["Gabon", "RRRYYYBBB"],
    ["Ghana", "RRRYYYGGG"],
    ["Hungary", "RRRWWWGGG"],
    ["Kazakhstan", "BBBBYBBBB"],
    ["Lebanon", "RRRWGWRRR"],
    ["Lithuania", "YYYGGGRRR"],
    ["Mexico", "GWRGWRGWR"],
    ["Moldova", "BYRBYRBYR"],
    ["Myanmar", "YYYGWGRRR"],
    ["Pakistan", "WGGWGGWGG"],
    ["Paraguay", "RRRWWWBBB"],
    ["Peru", "RWRRWRRWR"],
    ["Rwanda", "BBBYYYRRR"],
    ["Senegal", "GYRGYRGYR"],
    ["Serbia", "RRRBBBWWW"],
    ["Sierra Leone", "GGGWWWBBB"],
    ["Slovakia", "WWWBBBRRR"],
    ["Slovenia", "WWWBBBRRR"],
    ["Tajikistan", "RRRWWWGGG"],
    ["Tunisia", "RRRRWRRRR"],
    ["Venezuela", "YYYBBBRRR"],
    ["Vietnam", "RRRRYRRRR"]
  ];

  // src/code.ts
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function getRandomColorSeq() {
    let colorSeq2 = "";
    let hexcodes = ["W", "Y", "B", "G", "R", "O"];
    for (let i = 0; i < 9; i++) {
      colorSeq2 += hexcodes[rand(0, 5)];
    }
    return colorSeq2;
  }
  function getCubeFace(seq) {
    let colorMap = {
      W: "#FFFFFF",
      Y: "#FFFF00",
      B: "#5151FF",
      G: "#409D2C",
      R: "#FF0000",
      O: "#FFA500"
    };
    function hexToFigmaPaintStyle(hex) {
      hex = hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      const paintStyle2 = { r, g, b };
      return paintStyle2;
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
      let paintStyle2 = hexToFigmaPaintStyle(colorAry[i]);
      let rect = figma.createRectangle();
      let fills = clone(rect.fills);
      fills[0].color.r = paintStyle2.r;
      fills[0].color.g = paintStyle2.g;
      fills[0].color.b = paintStyle2.b;
      rect.fills = fills;
      rect.resize(80, 80);
      rect.cornerRadius = 8;
      rect.x = i * 80 % 240;
      if (i % 3 === 0)
        y += 80;
      rect.y = y;
      rect.name = `${i + 1}`;
      rect.strokeWeight = 3;
      rect.strokeAlign = "INSIDE";
      rect.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
      rect.effects = [
        {
          type: "DROP_SHADOW",
          visible: true,
          blendMode: "NORMAL",
          color: { r: 0, b: 0, g: 0, a: 0.25 },
          offset: { x: 0, y: 0 },
          spread: 1,
          radius: 8
        }
      ];
      frame.appendChild(rect);
    }
    figma.currentPage.appendChild(frame);
    let { x: x1, y: y1, width, height } = figma.viewport.bounds;
    frame.x = Math.round(x1 + width / 2);
    frame.y = Math.round(y1 + height / 2);
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
    return frame;
  }
  var type = figma.command;
  var colorSeq = getRandomColorSeq();
  var countryName = "";
  if (type === "country") {
    let selCountry = countryCode[rand(0, 50)];
    countryName = selCountry[0];
    colorSeq = selCountry[1];
  }
  var face = getCubeFace(colorSeq);
  var closingMessage = "";
  if (type === "country") {
    closingMessage = `${countryName}'s flag`;
    face.name = countryName;
  }
  figma.closePlugin(closingMessage);
})();
