import * as utils from "../../helper.js";

class AI {
  constructor(columns) {
    this.columns = columns;
  }

  getCorners(coordinates) {
    const col = utils.getColAsInt(this.columns, coordinates);
    const row = utils.getRowAsInt(coordinates);

    const columnLeft =
      col - 1 >= 0 ? utils.getColAsAlph(this.columns, col - 1) : false;
    const columnRight =
      col + 1 <= 7 ? utils.getColAsAlph(this.columns, col + 1) : false;

    const rowUpper = row + 1 < 9 ? row + 1 : false;
    const rowLower = row - 1 > 0 ? row - 1 : false;

    let corners = {};

    corners.leftUpper =
      columnLeft !== false && rowUpper !== false ? columnLeft + rowUpper : null;
    corners.rightUpper =
      columnRight !== false && rowUpper !== false
        ? columnRight + rowUpper
        : null;
    corners.leftLower =
      columnLeft !== false && rowLower !== false ? columnLeft + rowLower : null;
    corners.rightLower =
      columnRight !== false && rowLower !== false
        ? columnRight + rowLower
        : null;

    return corners;
  }

  getMoves(boardState, coordinates, isKing = false, hasJumped = false) {
    if (boardState[coordinates] === null) {
      return [];
    }

    let moves = [];
    let jumps = [];

    let killJumps = {};

    const corners = this.getCorners(coordinates);

    const row = utils.getRowAsInt(coordinates);
    const player = boardState[coordinates].player;

    const advanceRow = player === "player1" ? row - 1 : row + 1;

    for (let key in corners) {
      if (!corners.hasOwnProperty(key)) {
        continue;
      }

      let cornerCoordinates = corners[key];

      if (cornerCoordinates === null) {
        continue;
      }

      if (!isKing && cornerCoordinates.indexOf(advanceRow) < 0) {
        continue;
      }

      if (boardState[cornerCoordinates] === null) {
        moves.push(cornerCoordinates);
      } else {
        let neighborPiece = boardState[cornerCoordinates];

        if (neighborPiece.player === player) {
          continue;
        }

        let opponentCorners = this.getCorners(cornerCoordinates);
        let potentialJump = opponentCorners[key];

        if (boardState[potentialJump] === null) {
          killJumps[cornerCoordinates] = potentialJump;
          jumps.push(potentialJump);
        }
      }
    }

    let movesOut;

    if (hasJumped === false) {
      movesOut = moves.concat(jumps);
    } else {

      movesOut = jumps;
    }

    let killJumpsOut = jumps.length > 0 ? killJumps : null;

    return [movesOut, killJumpsOut];
  }

  movePiece(coordinates, state) {
    let currentState = Object.assign({}, state.history[state.stepNumber]);
    let boardState = Object.assign({}, currentState.boardState);
    let movingPiece = Object.assign({}, boardState[state.activePiece]);

    let jumpArray = [];

    for (let key in state.jumpKills) {
      if (!state.jumpKills.hasOwnProperty(key)) {
        continue;
      }

      jumpArray.push(state.jumpKills[key]);
    }
    if (
      state.moves.indexOf(coordinates) < 0 &&
      jumpArray.indexOf(coordinates) < 0
    ) {
      return null;
    }


    if (this.shouldKing(movingPiece, coordinates)) {
      movingPiece.isKing = true;
    }

    boardState[state.activePiece] = null;
    boardState[coordinates] = movingPiece;

    const player = movingPiece.player;
    let hasJumped = null;
    let newMoves = [];
    let setCurrentPlayer = player === "player2";
    let setActivePiece = null;

    if (jumpArray.indexOf(coordinates) > -1) {
      let opponentPosition = utils.getKeyByValue(state.jumpKills, coordinates);
      boardState[opponentPosition] = null;

      newMoves = this.getMoves(
        boardState,
        coordinates,
        movingPiece.isKing,
        true
      );

      if (newMoves[0].length > 0) {
        hasJumped = true;
        setCurrentPlayer = currentState.currentPlayer;
        setActivePiece = coordinates;
      } else {
        hasJumped = null;
      }
    }

    if (hasJumped === true) {
      if (newMoves[0].length > 0) {
        setCurrentPlayer = currentState.currentPlayer;
        setActivePiece = coordinates;
      }
    }

    let stateOut = {};

    stateOut.boardState = boardState;
    stateOut.currentPlayer = setCurrentPlayer;
    stateOut.activePiece = setActivePiece;
    stateOut.moves = hasJumped === true ? newMoves[0] : [];
    stateOut.jumpKills = hasJumped === true ? newMoves[1] : null;
    stateOut.hasJumped = hasJumped === true ? player : null;
    stateOut.winner = this.evaluateWinner(boardState);

    return stateOut;
  }

  shouldKing(movingPiece, coordinates) {
    if (movingPiece.isKing === true) {
      return false;
    }

    const row = utils.getRowAsInt(coordinates);
    const player = movingPiece.player;

    return (
      (row === 1 && player === "player1") || (row === 8 && player === "player2")
    );
  }

  evaluateWinner(boardState) {
    let player1Pieces = 0;
    let player1Moves = 0;

    let player2Pieces = 0;
    let player2Moves = 0;

    for (let coordinates in boardState) {
      if (
        !boardState.hasOwnProperty(coordinates) ||
        boardState[coordinates] === null
      ) {
        continue;
      }

      const movesData = this.getMoves(
        boardState,
        coordinates,
        boardState[coordinates].isKing,
        false
      );
      const moveCount = movesData[0].length;

      if (boardState[coordinates].player === "player1") {
        ++player1Pieces;
        player1Moves += moveCount;
      } else {
        ++player2Pieces;
        player2Moves += moveCount;
      }
    }

    if (player1Pieces === 0) {
      return "player2pieces";
    }

    if (player2Pieces === 0) {
      return "player1pieces";
    }

    if (player1Moves === 0) {
      return "player2moves";
    }

    if (player2Moves === 0) {
      return "player1moves";
    }

    return null;
  }

  getComputerMoves(boardState, player) {
    const self = this;
    let computerMoves = {};

    for (const coordinates in boardState) {
      if (!boardState.hasOwnProperty(coordinates)) {
        continue;
      }

      const currentSquare = boardState[coordinates];

      if (currentSquare == null) {
        continue;
      }

      if (currentSquare.player !== player) {
        continue;
      }

      const pieceMoves = self.getMoves(
        boardState,
        coordinates,
        boardState[coordinates].isKing,
        false
      );

      if (pieceMoves[0].length > 0 || pieceMoves[1] !== null) {
        computerMoves[coordinates] = pieceMoves;
      }
    }

    return computerMoves;
  }

  getMove(state, boardState, player) {
    const computerMoves = this.getComputerMoves(boardState, player);

    const moveKeys = Object.keys(computerMoves);

    const superMoves = {};

    for (let m = 0; m < moveKeys.length; ++m) {
      const piece = moveKeys[m];

      const movesData = computerMoves[piece][0];
      const jumpKills = computerMoves[piece][1];

      const jumpMoves = [];

      for (const jumpCoordinates in jumpKills) {
        if (!jumpKills.hasOwnProperty(jumpCoordinates)) {
          continue;
        }
        jumpMoves.push(jumpKills[jumpCoordinates]);
      }

      let highestScore = 0;
      let bestMove = null;


      for (let a = 0; a < movesData.length; ++a) {
        const moveTo = movesData[a];

        let score = 0;

        let stateLeaf = Object.assign({}, state);

        stateLeaf.activePiece = piece;
        stateLeaf.moves = movesData;
        stateLeaf.jumpKills = jumpKills;

        if (jumpMoves.indexOf(moveTo) > -1) {
          score += 10;
        }

        while (stateLeaf.currentPlayer === false) {
          const newJumpMoves = this.getMoves(
            stateLeaf,
            stateLeaf.activePiece,
            stateLeaf.activePiece.isKing,
            true
          );

          stateLeaf.moves = newJumpMoves[0];
          stateLeaf.jumpKills = newJumpMoves[1];

          score += 10;
        }

        if (score >= highestScore) {
          highestScore = score;
          bestMove = moveTo;
        }
      }

      superMoves[piece] = [bestMove, highestScore];
    }

    let finalMove = [];
    let highestAllMoves = 0;

    for (let pieces in superMoves) {
      if (!superMoves.hasOwnProperty(pieces)) {
        continue;
      }

      const pieceMove = superMoves[pieces][0];
      const moveScore = superMoves[pieces][1];

      if (moveScore >= highestAllMoves) {
        if (moveScore === highestAllMoves) {
          finalMove.push([pieces, pieceMove]);
        }
        if (moveScore > highestAllMoves) {
          finalMove = [];
          finalMove.push([pieces, pieceMove]);
          highestAllMoves = moveScore;
        }
      }
    }

    const chooseMove = finalMove[Math.floor(Math.random() * finalMove.length)];

    const out = {};
    out.piece = chooseMove[0];
    out.moveTo = chooseMove[1];

    return out;
  }  
}

export default AI;