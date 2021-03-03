import React from "react";
import { connect } from "react-redux";

const Square = (props) => {
  return (
    <button className={"square " + (props.themeCheck === "1"
      ? "square-wooden "
      : props.themeCheck === "0"
        ? ""
        : "square-cartoon ") + props["squareClasses"]} onClick={props["onClick"]}>
      <div></div>
    </button>
  );
};

const mapStateToProps = (state) => ({
  themeCheck: state.app.themeCheck,
});

export default connect(mapStateToProps)(Square);
