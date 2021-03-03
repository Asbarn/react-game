import { local } from "d3";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

const SET_PLAYERS = "SET_PLAYERS",
  SET_COLOR = "SET_COLOR",
  SET_MUSIC = "SET_MUSIC",
  SET_MUSIC_CHECK = "SET_MUSIC_CHECK",
  SET_THEME = "SET_THEME",
  SET_THEME_CHECK = "SET_THEME_CHECK";

const initialState = {
  players: null,
  color: "Black",
  theme: 0,
  themeCheck: 0,
  music: 1,
  musicCheck: 1,
};

const saveToStorage = (state) => {
  try {
    localStorage.setItem("redux-state", JSON.stringify(state));
  } catch (e) {
    console.log(e);
  }
};

const loadFromStorage = () => {
  try {
    const savedState = localStorage.getItem("redux-state");
    if (savedState === null) return undefined;
    return JSON.parse(savedState);
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLAYERS:
      return {
        ...state,
        players: action.players,
      };
    case SET_COLOR:
      return {
        ...state,
        color: action.color,
      };
    case SET_MUSIC:
      return {
        ...state,
        music: action.music,
      };
    case SET_MUSIC_CHECK:
      return {
        ...state,
        musicCheck: action.musicCheck,
      };
    case SET_THEME:
      return {
        ...state,
        theme: action.theme,
      };
    case SET_THEME_CHECK:
      return {
        ...state,
        themeCheck: action.themeCheck,
      };
    default:
      return state;
  }
};

const setPlayersAction = (players) => ({
  type: SET_PLAYERS,
  players,
});

const setColorAction = (color) => ({
  type: SET_COLOR,
  color,
});

const setMusicAction = (music) => ({
  type: SET_MUSIC,
  music,
});

const setMusicCheckAction = (musicCheck) => ({
  type: SET_MUSIC_CHECK,
  musicCheck,
});

const setThemeAction = (theme) => ({
  type: SET_THEME,
  theme,
});

const setThemeCheckAction = (themeCheck) => ({
  type: SET_THEME_CHECK,
  themeCheck,
});

export const setPlayers = (players) => {
  return (dispatch) => {
    dispatch(setPlayersAction(players));
  };
};

export const setColor = (color) => {
  return (dispatch) => {
    dispatch(setColorAction(color));
  };
};

export const setMusic = (music) => {
  return (dispatch) => {
    dispatch(setMusicAction(music));
  };
};

export const setMusicCheck = (musicCheck) => {
  return (dispatch) => {
    dispatch(setMusicCheckAction(musicCheck));
  };
};

export const setTheme = (theme) => {
  return (dispatch) => {
    dispatch(setThemeAction(theme));
  };
};

export const setThemeCheck = (themeCheck) => {
  return (dispatch) => {
    dispatch(setThemeCheckAction(themeCheck));
  };
};

const rootReducer = combineReducers({
  app: AppReducer,
});

const persistedState = loadFromStorage()

const store = createStore(
  rootReducer,
  persistedState,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

store.subscribe(() => saveToStorage(store.getState()));

export default store;
