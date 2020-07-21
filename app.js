document.addEventListener("DOMContentLoaded", () => {
  const gameCanvas = document.querySelector("#gameCanvas");

  var debug = false;
  //debug = !debug;

  const timeInterval = 200;
  const timeSplits = 5;
  const maxTime = 20;

  const gameChoice = {
    NONE: 0,
    ROCK: 1,
    PAPER: 2,
    SCISSORS: 3,
  };

  const gameState = ["none", "rock", "paper", "scissors"];

  var timeLeft = maxTime;
  var timeTicToc = 0;
  var player1Choice = 0;
  var player1hasChosen = false;
  var player2Choice = 0;
  var player2hasChosen = false;

  var player1Score = 0;
  var player2Score = 0;
  var gamesEndInDraw = 0;
  var isRunning = false;
  var gameOver = false;
  var setIntervalId;

  // gameCanvas mouse click event
  gameCanvas.addEventListener("click", (event) => {
    // Absolute geometry of the canvas element
    // left and top are the offset
    var canvasRect = gameCanvas.getBoundingClientRect();

    // get the x and y position
    var posX = event.x - canvasRect.left;
    var posY = event.y - canvasRect.top;
    if (debug) alert("posX: " + posX + " posY: " + posY);

    // apply game logic here
    var gridX = Math.floor(posX / 100);
    var gridY = Math.floor(posY / 100);

    if (debug) alert("gridX: " + gridX + " gridY: " + gridY);

    // isRunning
    if (gameOver) {
      if (gridX === 1 && gridY === 0) {
        // new game
        newGame();
      }
    }

    if (isRunning) {
      // Player 1 Chooses
      if (gridX === 0 && gridY === 1 && !player1hasChosen) {
        if (player1Choice < gameState.length - 1) {
          player1Choice++;
        } else {
          player1Choice = 1;
        }
      }

      // lock P1 Choice
      if (gridX === 0 && gridY === 0 && player1Choice !== 0) {
        player1hasChosen = true; //!player1hasChosen;
      }

      // Player 2 Chooses
      if (gridX === 2 && gridY === 1 && !player2hasChosen) {
        if (player2Choice < gameState.length - 1) {
          player2Choice++;
        } else {
          player2Choice = 1;
        }
      }

      // lock P2 Choice
      if (gridX === 2 && gridY === 0 && player2Choice !== 0) {
        player2hasChosen = true; //!player2hasChosen;
      }
    }
  }); // gameCanvas mouse click

  function checkWinner() {
    var message = "?";
    // if (!player1hasChosen && !player2hasChosen) {
    //   return;
    // }

    if (player1Choice === player2Choice) {
      // Draw Game
      message =
        "Draw Game " +
        "p1: " +
        gameState[player1Choice] +
        " vs p2: " +
        gameState[player2Choice];
      gamesEndInDraw += 1;
    } else if (
      player1Choice === gameChoice.PAPER &&
      player2Choice === gameChoice.ROCK
    ) {
      // Paper vs Rock
      message =
        "Player 1 wins " +
        "p1: " +
        gameState[player1Choice] +
        " vs p2: " +
        gameState[player2Choice];
      player1Score += 1;
    } else if (
      player1Choice === gameChoice.PAPER &&
      player2Choice === gameChoice.SCISSORS
    ) {
      // Paper vs Scissors
      message =
        "Player 2 wins " +
        "p1: " +
        gameState[player1Choice] +
        " vs p2: " +
        gameState[player2Choice];
      player2Score += 1;
    } else if (
      player1Choice === gameChoice.ROCK &&
      player2Choice === gameChoice.PAPER
    ) {
      // Rock vs Paper
      message =
        "Player 2 wins " +
        "p1: " +
        gameState[player1Choice] +
        " vs p2: " +
        gameState[player2Choice];
      player2Score += 1;
    } else if (
      player1Choice === gameChoice.ROCK &&
      player2Choice === gameChoice.SCISSORS
    ) {
      // Rock vs Scissors
      message =
        "Player 1 wins " +
        "p1: " +
        gameState[player1Choice] +
        " vs p2: " +
        gameState[player2Choice];
      player1Score += 1;
    } else if (
      player1Choice === gameChoice.SCISSORS &&
      player2Choice === gameChoice.PAPER
    ) {
      // Scissors vs Paper
      message =
        "Player 1 wins " +
        "p1: " +
        gameState[player1Choice] +
        " vs p2: " +
        gameState[player2Choice];
      player1Score += 1;
    } else if (
      player1Choice === gameChoice.SCISSORS &&
      player2Choice === gameChoice.ROCK
    ) {
      // Scissors vs Rock
      message =
        "Player 2 wins " +
        "p1: " +
        gameState[player1Choice] +
        " vs p2: " +
        gameState[player2Choice];
      player2Score += 1;
    }
    if (debug) alert(message);
  } // checkWinner

  function displayGame() {
    var gCanvas = gameCanvas.getContext("2d");

    // Game Board
    gCanvas.beginPath();
    gCanvas.lineWidth = "1";
    gCanvas.fillStyle = "green";
    gCanvas.fillRect(0, 0, 300, 200);

    // // Red rectangle
    // gCanvas.lineWidth = "1";
    // gCanvas.fillStyle = "red";
    // gCanvas.fillRect(100, 0, 100, 100);

    // Clock
    gCanvas.beginPath();
    gCanvas.strokeStyle = "black";
    gCanvas.fillStyle = "white";
    gCanvas.arc(150, 45, 20, 0, 2 * Math.PI);
    gCanvas.fill();
    gCanvas.stroke();

    gCanvas.beginPath();
    gCanvas.fillStyle = "yellow";
    var r = 20 * (timeTicToc / timeSplits);
    gCanvas.arc(150, 45, r, 0, 2 * Math.PI);
    gCanvas.fill();

    if (timeLeft < 10) {
      gCanvas.fillStyle = "red";
      gCanvas.font = "20px Arial";
      gCanvas.fillText("0" + timeLeft, 137.5, 50);
    } else {
      gCanvas.fillStyle = "black";
      gCanvas.font = "20px Arial";
      gCanvas.fillText(timeLeft, 137.5, 50);
    }

    // New Game Button
    if (gameOver) {
      gCanvas.beginPath();
      gCanvas.fillStyle = "white";
      gCanvas.fillRect(110, 70, 80, 30);

      gCanvas.fillStyle = "black";
      gCanvas.font = "14px Arial";
      gCanvas.fillText("New Game", 114, 90);
    }

    // HUD
    gCanvas.beginPath();
    gCanvas.fillStyle = "black";
    gCanvas.font = "14px Arial";
    gCanvas.fillText("Player 1: " + player1Score, 10, 15);

    gCanvas.fillStyle = "black";
    gCanvas.font = "14px Arial";
    gCanvas.fillText("Draws : " + gamesEndInDraw, 115, 15);

    gCanvas.beginPath();
    gCanvas.fillStyle = "black";
    gCanvas.font = "14px Arial";
    gCanvas.fillText("Player 2: " + player2Score, 220, 15);

    // Yellow rectangle Player 1
    gCanvas.beginPath();
    gCanvas.lineWidth = "1";
    gCanvas.fillStyle = "yellow";
    gCanvas.fillRect(0, 100, 100, 100);

    // gCanvas.fillStyle = "white";
    // gCanvas.fillRect(25, 125, 50, 50);

    var lockImgP1 = new Image();
    if (player1hasChosen) {
      lockImgP1.src = "/images/locked.png";
    } else {
      lockImgP1.src = "/images/unlocked.png";
    }
    lockImgP1.width = 50;
    lockImgP1.height = 50;

    gCanvas.drawImage(lockImgP1, 25, 25, lockImgP1.width, lockImgP1.height);

    var targetImgP1 = new Image();

    switch (player1Choice) {
      case gameChoice.ROCK:
        targetImgP1.src = "/images/rock.png";
        break;
      case gameChoice.PAPER:
        targetImgP1.src = "/images/paper.png";
        break;
      case gameChoice.SCISSORS:
        targetImgP1.src = "/images/scissors.png";
        break;
      default:
        targetImgP1.src = "/images/none.png";
    }
    targetImgP1.width = 50;
    targetImgP1.height = 50;

    gCanvas.drawImage(
      targetImgP1,
      25,
      125,
      targetImgP1.width,
      targetImgP1.height
    );

    gCanvas.fillStyle = "black";
    gCanvas.font = "14px Arial";
    gCanvas.fillText(gameState[player1Choice], 20, 120);
    //gCanvas.fillText(player1hasChosen, 0, 140);
    if (player1hasChosen) {
      gCanvas.fillText("Locked", 20, 190);
    } else {
      gCanvas.fillText("Unlocked", 20, 190);
    }

    // Blue rectangle Player 2
    gCanvas.beginPath();
    gCanvas.lineWidth = "1";
    gCanvas.fillStyle = "blue";
    gCanvas.fillRect(200, 100, 100, 100);

    // gCanvas.fillStyle = "white";
    // gCanvas.fillRect(225, 125, 50, 50);

    var lockImgP2 = new Image();
    if (player2hasChosen) {
      lockImgP2.src = "/images/locked.png";
    } else {
      lockImgP2.src = "/images/unlocked.png";
    }
    lockImgP2.width = 50;
    lockImgP2.height = 50;

    gCanvas.drawImage(lockImgP2, 225, 25, lockImgP2.width, lockImgP2.height);

    var targetImgP2 = new Image();

    switch (player2Choice) {
      case gameChoice.ROCK:
        targetImgP2.src = "/images/rock.png";
        break;
      case gameChoice.PAPER:
        targetImgP2.src = "/images/paper.png";
        break;
      case gameChoice.SCISSORS:
        targetImgP2.src = "/images/scissors.png";
        break;
      default:
        targetImgP2.src = "/images/none.png";
    }
    targetImgP2.width = 50;
    targetImgP2.height = 50;

    gCanvas.drawImage(
      targetImgP2,
      225,
      125,
      targetImgP2.width,
      targetImgP2.height
    );

    gCanvas.beginPath();
    gCanvas.fillStyle = "black";
    gCanvas.font = "14px Arial";
    gCanvas.fillText(gameState[player2Choice], 220, 120);
    if (player2hasChosen) {
      gCanvas.fillText("Locked", 220, 190);
    } else {
      gCanvas.fillText("Unlocked", 220, 190);
    }
  } //drawGame

  function runGame() {
    if (isRunning) {
      if (timeTicToc >= timeSplits) {
        timeTicToc = 0;
        if (timeLeft > 0) timeLeft--;
      } else {
        timeTicToc++;
      }
    }
    if (player1hasChosen && player2hasChosen) {
      checkWinner();
      isRunning = false;
      gameOver = true;
      clearInterval(setIntervalId);
    }
    if (timeLeft <= 0) {
      isRunning = false;
      gameOver = true;
      clearInterval(setIntervalId);
    }
    displayGame();
  }

  function newGame() {
    timeTicToc = 0;
    timeLeft = maxTime;
    player1Choice = 0;
    player2Choice = 0;
    player1hasChosen = false;
    player2hasChosen = false;
    isRunning = true;
    gameOver = false;
    displayGame();
    setIntervalId = setInterval(runGame, timeInterval);
  }

  function initGame() {
    player1Score = 0;
    player2Score = 0;
    gamesEndInDraw = 0;
    timeLeft = maxTime;
    isRunning = false;
    gameOver = true;
    displayGame();
  }

  // initialize Game
  initGame();
}); // DOM
