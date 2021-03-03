import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Game from "./components/Game/Game";
import Settings from "./components/Settings/Settings";
import Statistics from "./components/Statistics/Statistics";
import { setPlayers, setMusic, setMusicCheck } from "./store";
import { Switch, Route, Redirect, NavLink, useHistory } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu'
import theme from "./sounds/theme.mp3";
import themeCheck from "./sounds/checkerMove.mp3";

const useAudio = (url, ending, volume) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(true);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => {
      setPlaying(false);
      if (ending) setPlaying(true);
    });
    return () => {
      audio.removeEventListener("ended", () => {
        setPlaying(false);
        if (ending) setPlaying(true);
      });
    };
  }, []);

  return [playing, toggle, audio];
};

function App({
  players,
  music,
  musicCheck,
  setPlayers,
  setMusic,
  setMusicCheck,
}) {
  let history = useHistory();

  const startGame = (players) => {
    setPlayers(players);
    <Redirect to="/game" />;
  };

  let [playing, togglePlaying, audio] = useAudio(theme, true, music);

  useEffect(() => {
    audio.play();
    audio.volume = music;
  }, [music]);

  let [playingCheck, togglePlayingCheck, audioCheck] = useAudio(
    themeCheck,
    false,
    musicCheck
  );

  useEffect(() => {
    audioCheck.volume = musicCheck;
  }, [musicCheck]);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Tab":
          history.push("/settings");
          break;
        case "1":
          setPlayers(1);
          history.push("/game");
          break;
        case "2":
          setPlayers(2);
          history.push("/game");
          break;
        case "Escape":
          history.push("/menu");
          break;
        case "m":
          music ? setMusic(0) : setMusic(1);
          break;
        case "M":
          music ? setMusic(0) : setMusic(1);
          break;
        case "n":
          musicCheck ? setMusicCheck(0) : setMusicCheck(1);
          break;
        case "N":
          musicCheck ? setMusicCheck(0) : setMusicCheck(1);
          break;
        default:
          break;
      }
    });
  }, [music, musicCheck]);
  return (
    <div id="outer-container">

      <Header /> <div id="page-wrap">

        <Switch>
          <Redirect exact from="/" to="/menu" />

          <Route path="/menu">
            <div className="navlink">
              <NavLink to="/menu">
                <div>Menu</div>
              </NavLink>
            </div>

            <div className="navlink">
              <NavLink to="/settings">
                <div>Settings</div>
              </NavLink>
            </div>
            <div className="navlink">
              <NavLink to="/statistics">
                <div>Statistics</div>
              </NavLink>
            </div>
            <div className="navlink">
              <NavLink
                to="/game"
                onClick={() => {
                  localStorage.setItem("game-state", null);
                  localStorage.setItem(
                    "game-time",
                    JSON.stringify({ second: "00", minute: "00", counter: 0 })
                  );
                  startGame(1);
                }}
              >
                <div>Singleplayer</div>
              </NavLink>
            </div>
            <div className="navlink">
              <NavLink
                to="/game"
                onClick={() => {
                  localStorage.setItem("game-state", null);
                  localStorage.setItem(
                    "game-time",
                    JSON.stringify({ second: "00", minute: "00", counter: 0 })
                  );
                  startGame(2);
                }}
              >
                <div>Multiplayer</div>
              </NavLink>
            </div>
            <div className="navlink">
              <NavLink
                to="/game"
                onClick={() => {
                  localStorage.setItem("game-state", null);
                  localStorage.setItem(
                    "game-time",
                    JSON.stringify({ second: "00", minute: "00", counter: 0 })
                  );
                  startGame(0);
                }}
              >
                AI vs AI
            </NavLink>
            </div>
          </Route>

          <Route path="/game">
            <Game audio={audioCheck} />
          </Route>

          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/statistics">
            <Statistics />
          </Route>
        </Switch>
        <Footer />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  players: state.app.players,
  music: state.app.music,
  musicCheck: state.app.musicCheck,
});

export default connect(mapStateToProps, {
  setPlayers,
  setMusic,
  setMusicCheck,
})(App);
