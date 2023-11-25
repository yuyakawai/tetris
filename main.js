const mainContainerWidth = 320;
const mainContainerHeight = 480;

const cellSize = 18;
const cellRow = 10;
const cellCol = 20;

const screenContainerWidth = cellSize * cellRow;
const screenContainerHeight = cellSize * cellCol;

const controllerButtonList = ["↷", "◀", "▼", "▶"];

const tetrisBlock = [
  {
    type: "I",
    color: "cyan",
    rotationMax: 4,
    position: [
      { x: 0, y: -1 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    showMargin: { x: 1, y: 1.5 },
  },
  {
    type: "O",
    color: "yellow",
    rotationMax: 1,
    position: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ],
    showMargin: { x: 0.5, y: 0.5 },
  },
  {
    type: "S",
    color: "lime",
    rotationMax: 4,
    position: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
    ],
    showMargin: { x: 1, y: 0.5 },
  },
  {
    type: "Z",
    color: "red",
    rotationMax: 4,
    position: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    showMargin: { x: 1, y: 0.5 },
  },
  {
    type: "L",
    color: "orange",
    rotationMax: 4,
    position: [
      { x: 0, y: -1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    showMargin: { x: 0, y: 1.5 },
  },
  {
    type: "J",
    color: "blue",
    rotationMax: 4,
    position: [
      { x: 0, y: -1 },
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: -2, y: 0 },
    ],
    showMargin: { x: 2, y: 1.5 },
  },
  {
    type: "T",
    color: "purple",
    rotationMax: 4,
    position: [
      { x: 0, y: -1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ],
    showMargin: { x: 1, y: 1.5 },
  },
];

const deleteScoreNumber = 10;
const gameSpeedWait = 8;

let mainContainerElement = null;
let scoreMessageContainerElement = null;
let screenContainerElement = null;
let nextBlockContainerElement = null;
let controllerContainerElement = null;

let pressedButtonNum = 0;

let controllerStatus = {
  rotationButtonPressed: false,
  rightButtonPressed: false,
  downButtonPressed: false,
  leftButtonPressed: false,
  allStatusFalse: () => {
    controllerStatus.leftButtonPressed = false;
    controllerStatus.rightButtonPressed = false;
    controllerStatus.rotationButtonPressed = false;
    controllerStatus.downButtonPressed = false;
  },
};

let cellList = [];

let currentBlock = {
  type: null,
  x: 0,
  y: 0,
  rotation: 0,
};

let nextBlock = {
  type: null,
  changeType: () => {
    nextBlock.type =
      tetrisBlock[Math.floor(Math.random() * tetrisBlock.length)].type;
  },
};

let waitCount = 0;
let score = 0;
let isGameOver = false;

const init = () => {
  mainContainerElement = document.getElementById("main-container");
  mainContainerElement.style.position = "relative";
  mainContainerElement.style.width = mainContainerWidth + "px";
  mainContainerElement.style.height = mainContainerHeight + "px";
  mainContainerElement.style.margin = "5px";
  mainContainerElement.style.fontFamily =
    "'Helvetica Neue',Arial, 'Hiragino Kaku Gothic ProN','Hiragino Sans', Meiryo, sans-serif";
  mainContainerElement.style.backgroundColor = "#f5deb3";
  mainContainerElement.style.border = "2px solid #deb887";
  mainContainerElement.style.boxSizing = "border-box";
  mainContainerElement.style.borderRadius = "5px";
  mainContainerElement.style.display = "flex";
  mainContainerElement.style.alignItems = "center";
  mainContainerElement.style.justifyContent = "center";
  mainContainerElement.style.flexDirection = "column";
  mainContainerElement.style.overflow = "hidden";
  mainContainerElement.style.userSelect = "none";
  mainContainerElement.style.webkitUserSelect = "none";

  let wrapContainerElement = document.createElement("div");
  wrapContainerElement.style.position = "relative";
  wrapContainerElement.style.display = "flex";
  wrapContainerElement.style.alignItems = "flex-start";
  wrapContainerElement.style.justifyContent = "space-around";
  mainContainerElement.appendChild(wrapContainerElement);

  scoreMessageContainerElement = document.createElement("div");
  scoreMessageContainerElement.style.position = "relative";
  scoreMessageContainerElement.style.width = screenContainerWidth / 3 + "px";
  scoreMessageContainerElement.style.height = screenContainerHeight / 6 + "px";
  scoreMessageContainerElement.style.margin = "1px";
  scoreMessageContainerElement.style.fontSize =
    screenContainerWidth * 0.08 + "px";
  scoreMessageContainerElement.style.backgroundColor = "#deb887";
  scoreMessageContainerElement.style.borderRadius = "7px";
  scoreMessageContainerElement.style.display = "flex";
  scoreMessageContainerElement.style.alignItems = "center";
  scoreMessageContainerElement.style.justifyContent = "center";
  scoreMessageContainerElement.style.flexDirection = "column";
  scoreMessageContainerElement.textContent = "SCORE";
  scoreMessageContainerElement.appendChild(document.createElement("div"));
  wrapContainerElement.appendChild(scoreMessageContainerElement);

  screenContainerElement = document.createElement("div");
  screenContainerElement.style.position = "relative";
  screenContainerElement.style.width = screenContainerWidth + "px";
  screenContainerElement.style.height = screenContainerHeight + "px";
  screenContainerElement.style.margin = "1px";
  screenContainerElement.style.display = "flex";
  screenContainerElement.style.alignItems = "center";
  screenContainerElement.style.justifyContent = "center";
  screenContainerElement.style.backgroundColor = "black";
  wrapContainerElement.appendChild(screenContainerElement);

  for (let y = 0; y < cellCol; y++) {
    for (let x = 0; x < cellRow; x++) {
      let cellElement = document.createElement("div");
      cellElement.x = x;
      cellElement.y = y;
      cellElement.colorStatus = "none";
      cellElement.style.position = "absolute";
      cellElement.style.width = cellSize + "px";
      cellElement.style.height = cellSize + "px";
      cellElement.style.top = y * cellSize + "px";
      cellElement.style.left = x * cellSize + "px";
      cellElement.style.backgroundColor = "black";
      cellElement.style.border = "1px solid gray";
      cellElement.style.boxSizing = "border-box";
      cellElement.style.display = "flex";
      cellElement.style.alignItems = "center";
      cellElement.style.justifyContent = "center";
      cellList.push(cellElement);
      screenContainerElement.appendChild(cellElement);
    }
  }

  nextBlockContainerElement = document.createElement("div");
  nextBlockContainerElement.style.position = "relative";
  nextBlockContainerElement.style.width = screenContainerWidth / 3 + "px";
  nextBlockContainerElement.style.height = screenContainerHeight * 0.3 + "px";
  nextBlockContainerElement.style.margin = "1px";
  nextBlockContainerElement.style.paddingTop = "5px";
  nextBlockContainerElement.style.borderRadius = "7px";
  nextBlockContainerElement.style.fontSize = screenContainerWidth * 0.08 + "px";
  nextBlockContainerElement.style.display = "flex";
  nextBlockContainerElement.style.alignItems = "center";
  nextBlockContainerElement.style.justifyContent = "start";
  nextBlockContainerElement.style.flexDirection = "column";
  nextBlockContainerElement.style.backgroundColor = "#deb887";
  nextBlockContainerElement.textContent = "Next";
  let div = document.createElement("div");
  div.style.position = "relative";
  div.style.paddingTop = "3px";
  nextBlockContainerElement.appendChild(div);
  wrapContainerElement.appendChild(nextBlockContainerElement);

  controllerContainerElement = document.createElement("div");
  controllerContainerElement.style.position = "relative";
  controllerContainerElement.style.width = mainContainerWidth * 0.95 + "px";
  controllerContainerElement.style.height = mainContainerHeight * 0.2 + "px";
  controllerContainerElement.style.margin = "0px";
  controllerContainerElement.style.fontSize = mainContainerWidth * 0.05 + "px";
  controllerContainerElement.style.boxSizing = "border-box";
  controllerContainerElement.style.display = "flex";
  controllerContainerElement.style.alignItems = "center";
  controllerContainerElement.style.justifyContent = "center";
  controllerContainerElement.style.flexDirection = "column";
  mainContainerElement.appendChild(controllerContainerElement);
  initController();
  showScoreMessage();
  nextBlock.changeType();
  createBlock();
  tick();
};

const initController = () => {
  let wrapUpperRowElement = document.createElement("div");
  wrapUpperRowElement.style.position = "relative";
  wrapUpperRowElement.style.display = "flex";
  wrapUpperRowElement.style.alignItems = "center";
  wrapUpperRowElement.style.justifyContent = "center";
  controllerContainerElement.appendChild(wrapUpperRowElement);

  let wrapLowerRowElement = document.createElement("div");
  wrapLowerRowElement.style.position = "relative";
  wrapLowerRowElement.style.display = "flex";
  wrapLowerRowElement.style.alignItems = "center";
  wrapLowerRowElement.style.justifyContent = "center";
  controllerContainerElement.appendChild(wrapLowerRowElement);

  controllerButtonList.forEach((name) => {
    let buttonElement = document.createElement("div");
    buttonElement.style.position = "relative";
    buttonElement.style.width = mainContainerWidth * 0.3 + "px";
    buttonElement.style.height = mainContainerHeight * 0.08 + "px";
    buttonElement.style.margin = "2px";
    buttonElement.style.fontSize = mainContainerWidth * 0.1 + "px";
    buttonElement.style.backgroundColor = "orange";
    buttonElement.style.borderBottom = "5px solid #b84c00";
    buttonElement.style.borderRadius = "7px";
    buttonElement.style.boxSizing = "border-box";
    buttonElement.style.cursor = "pointer";
    buttonElement.style.display = "flex";
    buttonElement.style.alignItems = "center";
    buttonElement.style.justifyContent = "center";
    buttonElement.textContent = name;

    if (name === "↷") {
      wrapUpperRowElement.appendChild(buttonElement);
    }

    if (name === "◀" || name === "▼" || name === "▶") {
      wrapLowerRowElement.appendChild(buttonElement);
    }

    if (window.ontouchstart === null) {
      buttonElement.ontouchstart = (e) => {
        e.preventDefault();

        pressedButtonNum++;
        if (pressedButtonNum >= 2) {
          return;
        }

        e.target.style.borderBottom = "1px solid #b84c00";
        e.target.style.backgroundColor = "#b84c00";
        ChangeControllerStatus(e.target.textContent, true);
      };

      buttonElement.ontouchend = (e) => {
        e.preventDefault();
        pressedButtonNum--;
        e.target.style.borderBottom = "5px solid #b84c00";
        e.target.style.backgroundColor = "orange";
        ChangeControllerStatus(e.target.textContent, false);
      };
    } else {
      buttonElement.onpointerdown = (e) => {
        e.preventDefault();

        pressedButtonNum++;
        if (pressedButtonNum >= 2) {
          return;
        }
        e.target.style.borderBottom = "1px solid #b84c00";
        e.target.style.backgroundColor = "#b84c00";
        ChangeControllerStatus(e.target.textContent, true);
      };

      buttonElement.onpointerup = (e) => {
        e.preventDefault();
        e.target.style.borderBottom = "5px solid #b84c00";
        e.target.style.backgroundColor = "orange";
        pressedButtonNum--;
        ChangeControllerStatus(e.target.textContent, false);
      };
    }
  });

  document.onkeydown = (e) => {
    e.preventDefault();
    if (isGameOver) {
      return;
    }

    switch (e.key) {
      case "ArrowLeft":
        controllerStatus.leftButtonPressed = true;
        break;
      case "ArrowRight":
        controllerStatus.rightButtonPressed = true;
        break;
      case "ArrowUp":
        controllerStatus.rotationButtonPressed = true;
        break;
      case "ArrowDown":
        controllerStatus.downButtonPressed = true;
        break;
      default:
        // empty
        break;
    }
  };
  document.onkeyup = (e) => {
    e.preventDefault();
    if (isGameOver) {
      return;
    }
    controllerStatus.allStatusFalse();
  };
};

const ChangeControllerStatus = (buttonText, isPressed = true) => {
  switch (buttonText) {
    case "↷":
      controllerStatus.rotationButtonPressed = isPressed;
      break;
    case "◀":
      controllerStatus.leftButtonPressed = isPressed;
      break;
    case "▼":
      controllerStatus.downButtonPressed = isPressed;
      break;
    case "▶":
      controllerStatus.rightButtonPressed = isPressed;
      break;
    default:
      // empty
      break;
  }
};

const getTargetCell = (x, y) => {
  if (x < 0 || y < 0 || x > cellRow - 1 || y > cellCol - 1) {
    return false;
  }

  return cellList
    .filter((v) => {
      return v.x === x && v.y === y;
    })
    .shift();
};

const moveBlock = (dx, dy, dr) => {
  let isMoved = false;
  removeBlock(
    currentBlock.type,
    currentBlock.x,
    currentBlock.y,
    currentBlock.rotation,
  );

  if (
    putBlock(
      currentBlock.type,
      currentBlock.x + dx,
      currentBlock.y + dy,
      currentBlock.rotation + dr,
      true,
    )
  ) {
    currentBlock.x += dx;
    currentBlock.y += dy;
    currentBlock.rotation += dr;

    isMoved = true;
  }
  putBlock(
    currentBlock.type,
    currentBlock.x,
    currentBlock.y,
    currentBlock.rotation,
  );

  return isMoved;
};

const removeBlock = (type, x, y, rotation = 0) => {
  const protoBlock = tetrisBlock.filter((v) => v.type === type).shift();
  protoBlock.position.forEach((v) => {
    let dx = v.x;
    let dy = v.y;

    for (let i = 0; i < rotation % protoBlock.rotationMax; i++) {
      [dx, dy] = [-dy, dx];
    }

    const tx = x + dx;
    const ty = y + dy;

    let targetCell = getTargetCell(tx, ty);
    targetCell.colorStatus = "none";
  });
};

const putBlock = (type, x, y, rotation = 0, dryrun = false) => {
  const protoBlock = tetrisBlock.filter((v) => v.type === type).shift();

  let isPut = true;
  protoBlock.position.forEach((v) => {
    let dx = v.x;
    let dy = v.y;

    for (let i = 0; i < rotation % protoBlock.rotationMax; i++) {
      [dx, dy] = [-dy, dx];
    }

    const tx = x + dx;
    const ty = y + dy;

    let targetCell = getTargetCell(tx, ty);
    if (targetCell !== false && targetCell.colorStatus === "none") {
      if (dryrun === false) {
        targetCell.colorStatus = protoBlock.color;
      }
    } else {
      isPut = false;
    }
  });

  return isPut;
};

const showCellList = () => {
  cellList.forEach((cell) => {
    if (cell.colorStatus === "none") {
      cell.style.backgroundColor = "black";
    } else {
      isGameOver
        ? (cell.style.backgroundColor = "dimgray")
        : (cell.style.backgroundColor = cell.colorStatus);
    }
  });
};

const createBlock = () => {
  currentBlock.type = nextBlock.type;
  currentBlock.x = 5;
  currentBlock.y = 1;
  currentBlock.rotation = 0;

  nextBlock.changeType();

  if (
    putBlock(
      currentBlock.type,
      currentBlock.x,
      currentBlock.y,
      currentBlock.rotation,
    ) === false
  ) {
    isGameOver = true;
  }
};

const deleteLine = () => {
  for (let i = 0; i < cellCol; i++) {
    let isNoDelete = cellList.some((v) => {
      return v.y === i && v.colorStatus === "none";
    });

    if (isNoDelete === false) {
      score += deleteScoreNumber;
      for (let j = i; j >= -1; j--) {
        for (let x = 0; x < cellRow; x++) {
          let color = getTargetCell(x, j - 1).colorStatus;
          if (typeof color === "undefined") {
            color = "none";
          }

          getTargetCell(x, j).colorStatus = color;
        }
      }
    }
  }
};

const showGameOverMessage = () => {
  let messageElement = document.createElement("div");
  messageElement.style.position = "relative";
  messageElement.style.zIndex = "1";
  messageElement.style.width = screenContainerWidth + "px";
  messageElement.style.height = screenContainerHeight * 0.9 + "px";
  messageElement.style.display = "flex";
  messageElement.style.alignItems = "center";
  messageElement.style.justifyContent = "center";
  messageElement.style.color = "red";
  messageElement.style.fontSize = "32px";
  messageElement.textContent = "Game Over";
  screenContainerElement.appendChild(messageElement);
};

const showScoreMessage = () => {
  scoreMessageContainerElement.firstElementChild.textContent = score;
};

const showNextBlock = (type) => {
  nextBlockContainerElement.firstElementChild.remove();
  let div = document.createElement("div");
  div.style.position = "relative";
  div.style.width = cellSize * 3 + "px";
  div.style.height = cellSize * 3 + "px";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  nextBlockContainerElement.appendChild(div);

  const protoBlock = tetrisBlock.filter((v) => v.type === type).shift();
  protoBlock.position.forEach((v) => {
    let cellElement = document.createElement("div");
    cellElement.style.position = "absolute";
    cellElement.style.width = cellSize + "px";
    cellElement.style.height = cellSize + "px";
    cellElement.style.top = (v.y + protoBlock.showMargin.y) * cellSize + "px";
    cellElement.style.left = (v.x + protoBlock.showMargin.x) * cellSize + "px";
    cellElement.style.backgroundColor = protoBlock.color;
    cellElement.style.border = "1px solid gray";
    cellElement.style.boxSizing = "border-box";
    cellElement.style.display = "flex";
    cellElement.style.alignItems = "center";
    cellElement.style.justifyContent = "center";
    nextBlockContainerElement.firstElementChild.appendChild(cellElement);
  });
};

const tick = () => {
  waitCount++;
  if (waitCount % gameSpeedWait === 0) {
    if (controllerStatus.leftRotationButtonPressed) {
      moveBlock(0, 0, 1);
    }
    if (controllerStatus.rotationButtonPressed) {
      moveBlock(0, 0, 1);
    }
    if (controllerStatus.leftButtonPressed) {
      moveBlock(-1, 0, 0);
    }
    if (controllerStatus.downButtonPressed) {
      moveBlock(0, 1, 0);
    }
    if (controllerStatus.rightButtonPressed) {
      moveBlock(1, 0, 0);
    }

    if (waitCount % (gameSpeedWait * 2) === 0) {
      if (moveBlock(0, 1, 0) === false) {
        deleteLine();
        createBlock();

        if (isGameOver) {
          showCellList();
          showGameOverMessage();
          return;
        }

        waitCount = 0;
      }
    }
  }

  showCellList();
  showScoreMessage();
  showNextBlock(nextBlock.type);
  requestAnimationFrame(tick);
};

window.onload = () => {
  init();
};
