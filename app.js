let squares = document.querySelectorAll("#board-container>div");
let roundWindialog = document.getElementById("round-win");
let roundWin = document.querySelector("#round-win>div>h3");
let closeBtn = document.querySelector("#closeModel");
let xScore = document.querySelector("#Xscore");
let oScore = document.querySelector("#Oscore");

let gameBoard = (function () {
  let Board = ["", "", "", "", "", "", "", "", ""];
  return { Board };
})();
function makeUser(name, symbol) {
  let score = 0;
  let moves = [];

  function increseScore() {
    score++;
  }
  function getScore() {
    return score;
  }
  function getName() {
    return name;
  }
  function getSymbol() {
    return symbol;
  }
  function getMoves() {
    return moves.sort();
  }
  function addMove(move) {
    moves.push(move);
  }
  function resetMoves() {
    moves = [];
  }
  function resetScore() {
    score = 0;
  }
  return {
    increseScore,
    getScore,
    getMoves,
    getName,
    getSymbol,
    addMove,
    resetMoves,
    resetScore,
  };
}
const firstPlayer = makeUser("firstPlayer", "X");
const seconedPlayer = makeUser("seconedPlayer", "O");

let gameLogic = (function () {
  let winingCombintations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let currentTurn = firstPlayer;
  let changeTurn = function () {
    if (this.currentTurn == firstPlayer) {
      this.currentTurn = seconedPlayer;
    } else this.currentTurn = firstPlayer;
  };
  let addRound = function (number) {
    currentTurn.addMove(Number(number));
    gameBoard.Board[number] = currentTurn.getSymbol();
    if (checkForwining(currentTurn.getMoves())) {
      roundWin.textContent = `${currentTurn.getSymbol()} WINS THIS ROUND !`;
      roundWindialog.showModal();
    } else changeTurn;
  };
  let checkForwining = function (array) {
    function isArraySubset(smallArray, largeArray) {
      return smallArray.every((item) => largeArray.includes(item));
    }
    for (let i = 0; i < winingCombintations.length; i++) {
      if (isArraySubset(winingCombintations[i], array)) {
        return true;
      }
    }
    return false;
  };
  let checkForDraw = function () {
    let draw = true;
    for (let i = 0; i < gameBoard.Board.length; i++) {
      if (gameBoard.Board[i] == "") {
        draw = false;
      }
    }
    return draw;
  };

  let higherScore = function () {
    let highestScore = firstPlayer;
    if (firstPlayer.getScore() > seconedPlayer.getScore()) {
      this.highestScore = firstPlayer;
    } else highestScore = seconedPlayer;
    return highestScore;
  };

  return {
    currentTurn,
    changeTurn,
    addRound,
    checkForwining,
    winingCombintations,
    checkForDraw,
    higherScore,
  };
})();
squares.forEach((square) => {
  square.addEventListener("click", (e) => {
    cell = e.target.getAttribute("data-array");
    if (gameBoard.Board[cell] == "") {
      e.target.textContent = `${gameLogic.currentTurn.getSymbol()}`;
      gameBoard.Board[cell] = gameLogic.currentTurn.getSymbol();
      gameLogic.currentTurn.addMove(Number(cell));
      if (gameLogic.checkForwining(gameLogic.currentTurn.getMoves())) {
        roundWin.textContent = `${gameLogic.currentTurn.getSymbol()} WINS THIS ROUND!!!`;
        roundWindialog.showModal();
        gameBoard.Board.fill("");
        firstPlayer.resetMoves();
        seconedPlayer.resetMoves();
        gameLogic.currentTurn.increseScore();
        xScore.textContent = `${firstPlayer.getScore()}`;
        oScore.textContent = `${seconedPlayer.getScore()}`;
        gameLogic.currentTurn = firstPlayer;
        if (firstPlayer.getScore() == 5 || seconedPlayer.getScore() == 5) {
          roundWin.textContent = `${gameLogic
            .higherScore()
            .getSymbol()} WINS THE GAME`;
          roundWindialog.showModal();
          firstPlayer.resetScore();
          seconedPlayer.resetScore();
          xScore.textContent = `${firstPlayer.getScore()}`;
          oScore.textContent = `${seconedPlayer.getScore()}`;
        }
      } else if (gameLogic.checkForDraw()) {
        roundWin.textContent = "THIS IS A DRAW";
        roundWindialog.showModal();
        gameBoard.Board.fill("");
        firstPlayer.resetMoves();
        seconedPlayer.resetMoves();
      } else gameLogic.changeTurn();
    }
  });
});
closeBtn.addEventListener("click", () => {
  squares.forEach((squar) => {
    squar.textContent = "";
  });
  roundWindialog.close();
});
