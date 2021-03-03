import React, { useState, useEffect, useCallback, useRef } from "react";
import { returnPlayerName } from "../../helper.js";
import Field from "../Field/Field.js";
import { connect } from "react-redux";
import Opponent from "../AI/AI.js";

function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null);

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb;
    setState(state);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, setStateCallback];
}

const getCurrentPlayer = (color, players) => {
  if (players > 0) return color === "White" ? false : true;
  return true;
};

const saveResult = (state, time) => {
  let localStorageStats = JSON.parse(localStorage.getItem("statistics"));
  if (localStorageStats === null) {
    localStorageStats = [];
  }
  localStorageStats.push({
    moves: state.stepNumber,
    time: { minutes: time.minutes, seconds: time.seconds },
  });
  localStorage.setItem("statistics", JSON.stringify(localStorageStats));
};

const setColumns = () => {
  const columns = {};
  columns.a = 0;
  columns.b = 1;
  columns.c = 2;
  columns.d = 3;
  columns.e = 4;
  columns.f = 5;
  columns.g = 6;
  columns.h = 7;

  return columns;
};
const createBoard = (columns) => {
  let board = {};

  for (let key in columns) {
    if (columns.hasOwnProperty(key)) {
      for (let n = 1; n <= 8; ++n) {
        let row = key + n;
        board[row] = null;
      }
    }
  }

  board = initPlayers(board);

  return board;
};
const initPlayers = (board) => {
  const player1 = [
    "a8",
    "c8",
    "e8",
    "g8",
    "b7",
    "d7",
    "f7",
    "h7",
    "a6",
    "c6",
    "e6",
    "g6",
  ];
  const player2 = [
    "b3",
    "d3",
    "f3",
    "h3",
    "a2",
    "c2",
    "e2",
    "g2",
    "b1",
    "d1",
    "f1",
    "h1",
  ];

  player1.forEach(function (i) {
    board[i] = createPiece(i, "player1");
  });

  player2.forEach(function (i) {
    board[i] = createPiece(i, "player2");
  });

  return board;
};

const createPiece = (location, player) => {
  let piece = {};

  piece.player = player;
  piece.location = location;
  piece.isKing = false;

  return piece;
};

const Game = ({ players, color, audio, theme }) => {
  const columns = setColumns();
  const User = new Opponent(columns);
  const Computer = new Opponent(columns);
  const [state, setState] = useStateCallback({
    history: [
      {
        boardState: createBoard(columns),
        currentPlayer: getCurrentPlayer(color, players),
      },
    ],
    activePiece: null,
    moves: [],
    jumpKills: null,
    hasJumped: null,
    stepNumber: 0,
    winner: null,
  });
  if (state == null) {
    setState({
      history: [
        {
          boardState: createBoard(columns),
          currentPlayer: getCurrentPlayer(color, players),
        },
      ],
      activePiece: null,
      moves: [],
      jumpKills: null,
      hasJumped: null,
      stepNumber: 0,
      winner: null,
    });
  }
  const [time, setTime] = useState({ second: "00", minute: "00", counter: 0 });
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        const secondCounter = time.counter % 60;
        const minuteCounter = Math.floor(time.counter / 60);

        let computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        let computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setTime((prevState) => ({
          second: computedSecond,
          minute: computedMinute,
          counter: prevState.counter + 1,
        }));
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, time?.counter]);

  let currentState = state?.history[state.stepNumber];
  let boardState = state?.history[state.stepNumber].boardState;

  let currentPlayer = state?.history[state.stepNumber].currentPlayer;
  let moves = state?.moves;

  let gameStatus = (
    <div>
      <span>
        {currentState?.currentPlayer === true
          ? "Black's turn. "
          : "White's turn. "}
      </span>
      <span className="minute">{time.minute}</span>
      <span>:</span>
      <span className="second">{time.second}</span>
    </div>
  );
  let resetClass = "undo";

  if (state?.stepNumber < 1) {
    resetClass += " disabled";
  }
  useEffect(() => {
    if (localStorage.getItem("game-state") != null) {
      setState(JSON.parse(localStorage.getItem("game-state")));
    } else
      setState({
        history: [
          {
            boardState: createBoard(columns),
            currentPlayer: getCurrentPlayer(color, players),
          },
        ],
        activePiece: null,
        moves: [],
        jumpKills: null,
        hasJumped: null,
        stepNumber: 0,
        winner: null,
      });

    if (localStorage.getItem("game-time") != null) {
      setTime(JSON.parse(localStorage.getItem("game-time")));
    } else setTime({ second: "00", minute: "00", counter: 0 });
    if (state.history[0].currentPlayer) {
      computerTurn(null, state);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("game-state", JSON.stringify(state));
    localStorage.setItem("game-time", JSON.stringify(time));
  });
  useEffect(() => {
    switch (state.winner) {
      case "player1pieces":
        setIsActive(false);
        if (players) saveResult(state, { minutes: time.minute, seconds: time.second });
        localStorage.setItem(
          "game-state",
          JSON.stringify({
            history: [
              {
                boardState: createBoard(columns),
                currentPlayer: getCurrentPlayer(color, players),
              },
            ],
            activePiece: null,
            moves: [],
            jumpKills: null,
            hasJumped: null,
            stepNumber: 0,
            winner: null,
          })
        );
        localStorage.setItem(
          "game-time",
          JSON.stringify({ second: "00", minute: "00", counter: 0 })
        );
        gameStatus = (
          <div>
            <span>Black won!</span>
            <span className="minute">{time.minute}</span>
            <span>:</span>
            <span className="second">{time.second}</span>
          </div>
        );
        break;
      case "player2pieces":
        setIsActive(false);
        if (players) saveResult(state, { minutes: time.minute, seconds: time.second });
        localStorage.setItem(
          "game-state",
          JSON.stringify({
            history: [
              {
                boardState: createBoard(columns),
                currentPlayer: getCurrentPlayer(color, players),
              },
            ],
            activePiece: null,
            moves: [],
            jumpKills: null,
            hasJumped: null,
            stepNumber: 0,
            winner: null,
          })
        );
        localStorage.setItem(
          "game-time",
          JSON.stringify({ second: "00", minute: "00", counter: 0 })
        );
        gameStatus = (
          <div>
            <span>White won!</span>
            <span className="minute">{time.minute}</span>
            <span>:</span>
            <span className="second">{time.second}</span>
          </div>
        );
        break;
      case "player1moves":
        setIsActive(false);
        if (players) saveResult(state, { minutes: time.minute, seconds: time.second });
        localStorage.setItem(
          "game-state",
          JSON.stringify({
            history: [
              {
                boardState: createBoard(columns),
                currentPlayer: getCurrentPlayer(color, players),
              },
            ],
            activePiece: null,
            moves: [],
            jumpKills: null,
            hasJumped: null,
            stepNumber: 0,
            winner: null,
          })
        );
        localStorage.setItem(
          "game-time",
          JSON.stringify({ second: "00", minute: "00", counter: 0 })
        );
        gameStatus = (
          <div>
            <span>No moves left. Black won!</span>
            <span className="minute">{time.minute}</span>
            <span>:</span>
            <span className="second">{time.second}</span>
          </div>
        );
        break;
      case "player2moves":
        setIsActive(false);
        if (players) saveResult(state, { minutes: time.minute, seconds: time.second });
        localStorage.setItem(
          "game-state",
          JSON.stringify({
            history: [
              {
                boardState: createBoard(columns),
                currentPlayer: getCurrentPlayer(color, players),
              },
            ],
            activePiece: null,
            moves: [],
            jumpKills: null,
            hasJumped: null,
            stepNumber: 0,
            winner: null,
          })
        );
        localStorage.setItem(
          "game-time",
          JSON.stringify({ second: "00", minute: "00", counter: 0 })
        );
        gameStatus = (
          <div>
            <span>No moves left. White won!</span>
            <span className="minute">{time.minute}</span>
            <span>:</span>
            <span className="second">{time.second}</span>
          </div>
        );
        break;
      default:
        gameStatus = (
          <div>
            <span>
              {players === 0
                ? "AI vs AI "
                : players === 1 ? "Singleplayer " : "Multiplayer "}
              {currentState.currentPlayer === true
                ? "Black's turn. "
                : "White's turn. "}
            </span>
            <span className="minute">{time.minute}</span>
            <span>:</span>
            <span className="second">{time.second}</span>
          </div>
        );
        break;
    }
  }, [state?.winner]);

  const getCurrentState = () => {
    const history = state.history.slice(0, state.stepNumber + 1);
    return history[history.length - 1];
  };

  const handleClick = async (coordinates) => {
    if (state.winner !== null) {
      return;
    }
    const currentState = getCurrentState();
    const boardState = currentState.boardState;
    const clickedSquare = boardState[coordinates];


    if (clickedSquare !== null) {
      if (
        clickedSquare.player !== returnPlayerName(currentState.currentPlayer)
      ) {
        return;
      }


      if (state.activePiece === coordinates && state.hasJumped === null) {
        setState({
          ...state,
          activePiece: null,
          moves: [],
          jumpKills: null,
        });


        return;
      }

      if (state.hasJumped !== null && boardState[coordinates] !== null) {
        return;
      }


      let movesData = User.getMoves(
        boardState,
        coordinates,
        clickedSquare.isKing,
        false
      );

      setState({
        ...state,
        activePiece: coordinates,
        moves: movesData[0],
        jumpKills: movesData[1],
      });
      return;
    }


    if (state.activePiece === null) {
      return;
    }

    if (state.moves.length > 0) {
      const postMoveState = User.movePiece(coordinates, state, players);

      if (postMoveState === null) {
        return;
      }
      audio.play();
      updateStatePostMove(postMoveState).then((res) => {
        if (
          postMoveState.currentPlayer === !currentPlayer &&
          postMoveState.winner === null
        ) {
          computerTurn(null, res);
        }
      });
    }
  };

  const computerTurn = (piece = null, curState) => {
    if (players > 1) {
      return;
    }
    if (state.winner !== null) {
      return;
    }
    setTimeout(() => {
      const curHistory = curState.history.slice(0, curState.stepNumber + 1);

      const boardState = curHistory[curHistory.length - 1].boardState;

      let computerMove;
      let coordinates;
      let moveTo;

      if (piece === null) {
        computerMove = Computer.getMove(
          curState,
          boardState,
          players === 0 ? ((curState.history[curState.history.length - 1]).currentPlayer ? "player1" : "player2") : color === "Black" ? "player2" : "player1"
        );

        coordinates = computerMove.piece;
        moveTo = computerMove.moveTo;
      } else {
        computerMove = User.getMoves(
          boardState,
          piece,
          boardState[piece].isKing,
          true
        );
        coordinates = piece;
        moveTo =
          computerMove[0][Math.floor(Math.random() * computerMove[0].length)];
      }

      const clickedSquare = boardState[coordinates];

      let movesData = User.getMoves(
        boardState,
        coordinates,
        clickedSquare.isKing,
        false
      );

      setState(
        {
          ...curState,
          activePiece: coordinates,
          moves: movesData[0],
          jumpKills: movesData[1],
        },
        (res) => {
          setTimeout(() => {
            const postMoveState = User.movePiece(moveTo, res, players);

            if (postMoveState === null) {
              return;
            }
            audio.play();
            updateStatePostMove(postMoveState).then((result) => {
              if (postMoveState.winner !== null) {
                return;
              }
              if (!players) {
                computerTurn(postMoveState.activePiece, result,);
              }
              if (postMoveState.currentPlayer === false && color === "Black") {
                computerTurn(postMoveState.activePiece, result);
              }
            });
          }, 1500);
        }
      );
    }, 1000);
  };

  const updateStatePostMove = (postMoveState) => {
    return new Promise((res, rej) => {
      setState(
        {
          ...state,
          history: [
            ...state.history,
            {
              boardState: postMoveState.boardState,
              currentPlayer: postMoveState.currentPlayer,
            },
          ],
          activePiece: postMoveState.activePiece,
          moves: postMoveState.moves,
          jumpKills: postMoveState.jumpKills,
          hasJumped: postMoveState.hasJumped,
          stepNumber: state.history.length,
          winner: postMoveState.winner,
        },
        res
      );
    });
  };

  const reset = () => {
    setState({
      history: [
        {
          boardState: createBoard(columns),
          currentPlayer: getCurrentPlayer(color, players),
        },
      ],
      activePiece: null,
      moves: [],
      jumpKills: null,
      hasJumped: null,
      stepNumber: 0,
      winner: null,
    });
    setTime({ second: "00", minute: "00", counter: 0 });
    localStorage.setItem(
      "game-state",
      JSON.stringify({
        history: [
          {
            boardState: createBoard(columns),
            currentPlayer: getCurrentPlayer(color, players),
          },
        ],
        activePiece: null,
        moves: [],
        jumpKills: null,
        hasJumped: null,
        stepNumber: 0,
        winner: null,
      })
    );
    localStorage.setItem(
      "game-time",
      JSON.stringify({ second: "00", minute: "00", counter: 0 })
    );
  };

  return (
    <div className="reactCheckers">
      <div
        className={
          theme == "1"
            ? "game-board-wooden"
            : theme == "0"
              ? "game-board"
              : "game-board-cartoon"
        }
      >
        <div className="game-board-letter">
          <span>8</span>
          <span>7</span>
          <span>6</span>
          <span>5</span>
          <span>4</span>
          <span>3</span>
          <span>2</span>
          <span>1</span>
        </div>
        <Field
          boardState={boardState}
          currentPlayer={currentPlayer}
          activePiece={state?.activePiece}
          moves={moves}
          columns={columns}
          onClick={(coordinates) => handleClick(coordinates)}
        />
        <div className="game-board-number">
          <span>A</span>
          <span>B</span>
          <span>C</span>
          <span>D</span>
          <span>E</span>
          <span>F</span>
          <span>G</span>
          <span>H</span>
        </div>
      </div>
      <div className="game-nav">
        <div className="game-status">{gameStatus}</div>
        <div className="reset">
          <button className={resetClass} onClick={() => reset()}>
            Restart
        </button>
        </div>
      </div>
      <div className="win" style={{ display: state?.winner ? 'block' : 'none' }}>
        <div class="win-content">
          <p>  {state?.winner == 'player1pieces' ? "Black won! " :
            state?.winner == 'player2pieces' ? "White won! " :
              state?.winner == 'player1moves' ? "No moves left. Black won! " :
                state?.winner == 'player2moves' ? "No moves left. White won! " : ""
          } Congratulations! </p>
        </div>

      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  players: state.app.players,
  color: state.app.color,
  theme: state.app.theme,
});

export default connect(mapStateToProps)(Game);
