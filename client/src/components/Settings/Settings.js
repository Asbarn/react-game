import React, { useState } from "react";
import { connect } from "react-redux";
import { setColor, setMusic, setMusicCheck, setTheme, setThemeCheck } from "../../store";

const Settings = ({
  color,
  music,
  musicCheck,
  theme,
  themeCheck,
  setColor,
  setMusic,
  setMusicCheck,
  setTheme,
  setThemeCheck
}) => {
  const onChangeTheme = (event) => {
    setTheme(event.target.value);
  };

  const onChangeThemeCheck = (event) => {
    setThemeCheck(event.target.value);
  };


  const onValueChange = (event) => {
    setColor(event.target.value);
  };

  const handleChangeMusic = (e) => {
    setMusic(e.target.value);
    //audio.volume = volume;
  };

  const handleChangeMusicCheck = (e) => {
    setMusicCheck(e.target.value);
    //audio.volume = volume;
  };

  return (
    <>
      <div className="choose">Choose the color of your checkers</div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value="Black"
            checked={color == "Black"}
            onChange={onValueChange}
          />
          Black
        </label>
      </div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value="White"
            checked={color == "White"}
            onChange={onValueChange}
          />
          White
        </label>
      </div>
      <div>You will start the game as {color}</div>

      <div className="choose">Choose the type of your board</div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value="0"
            checked={theme == "0"}
            onChange={onChangeTheme}
          />
          Default
        </label>
      </div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value="1"
            checked={theme == "1"}
            onChange={onChangeTheme}
          />
          Wooden
        </label>
      </div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value="2"
            checked={theme == "2"}
            onChange={onChangeTheme}
          />
          Cartoon
        </label>
      </div>
      <div>
        Current theme:
        {theme == "1" ? "Wooden" : theme == "0" ? "Default" : "Cartoon"}
      </div>

      <div className="choose">Choose the type of your checkers</div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value="0"
            checked={themeCheck == "0"}
            onChange={onChangeThemeCheck}
          />
          Default
        </label>
      </div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value="1"
            checked={themeCheck == "1"}
            onChange={onChangeThemeCheck}
          />
          Angled
        </label>
      </div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value="2"
            checked={themeCheck == "2"}
            onChange={onChangeThemeCheck}
          />
          Cartoon
        </label>
      </div>
      <div>
        Current theme:
        {themeCheck == "1" ? "Wooden" : themeCheck == "0" ? "Default" : "Cartoon"}
      </div>

      <div className="slider-wrapper choose">
        <label>
          Music
          <input
            type="range"
            min="0"
            max="1"
            value={music}
            onChange={handleChangeMusic}
            step="0.1"
          />
        </label>
      </div>
      <div className="slider-wrapper choose">
        <label>
          Sounds
          <input
            type="range"
            min="0"
            max="1"
            value={musicCheck}
            onChange={handleChangeMusicCheck}
            step="0.1"
          />
        </label>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  color: state.app.color,
  music: state.app.music,
  musicCheck: state.app.musicCheck,
  theme: state.app.theme,
  themeCheck: state.app.themeCheck,
});

export default connect(mapStateToProps, {
  setColor,
  setMusic,
  setMusicCheck,
  setTheme, setThemeCheck
})(Settings);
