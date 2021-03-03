import React from "react";
import * as utils from "../../helper.js";
import Square from "../Square/Square";

const Field = (props) => {
  const renderSquare = (coordinates, squareClasses) => {
    return (
      <Square
        key={coordinates}
        squareClasses={squareClasses}
        onClick={() => props.onClick(coordinates)}
      />
    );
  };

  let boardRender = [];
  let columnsRender = [];
  const moves = props.moves;

  for (let coordinates in props.boardState) {
    if (!props.boardState.hasOwnProperty(coordinates)) {
      continue;
    }

    const col = utils.getColAsInt(props.columns, coordinates);
    const row = utils.getRowAsInt(coordinates);

    const currentPlayer = utils.returnPlayerName(props.currentPlayer);

    const colorClass =
      (utils.isOdd(col) && utils.isOdd(row)) ||
      (!utils.isOdd(col) && !utils.isOdd(row))
        ? "white"
        : "black";

    let squareClasses = [];

    squareClasses.push(coordinates);
    squareClasses.push(colorClass);

    if (props.activePiece === coordinates) {
      squareClasses.push("isActive");
    }

    if (moves.indexOf(coordinates) > -1) {
      let moveClass = "movable " + currentPlayer + "-move";
      squareClasses.push(moveClass);
    }

    if (props.boardState[coordinates] !== null) {
      squareClasses.push(props.boardState[coordinates].player + " piece");

      if (props.boardState[coordinates].isKing === true) {
        squareClasses.push("king");
      }
    }

    squareClasses = squareClasses.join(" ");

    columnsRender.push(
      renderSquare(coordinates, squareClasses, props.boardState[coordinates])
    );

    if (columnsRender.length >= 8) {
      columnsRender = columnsRender.reverse();
      boardRender.push(
        <div key={boardRender.length} className="board-col">
          {columnsRender}
        </div>
      );
      columnsRender = [];
    }
  }
  return boardRender;
};

export default Field;
