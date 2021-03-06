import axios from "axios";

import { returnErrors } from "./errorActions";

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "./types";

// Check token and load user
export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  axios
    .get(`/api/auth/user`, tokenConfig(getState))
    .then((res) => {
      dispatch({ type: USER_LOADED, payload: res.data.rows });
    })
    .catch((err) => {
      dispatch(
        returnErrors({ msg: err.response.data.message }, err.response.status)
      );
      dispatch({ type: AUTH_ERROR });
    });
};

// Register user
export const register = ({ name, email, password }) => (dispatch) => {
  // headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request body
  const body = JSON.stringify({
    name,
    email,
    password,
  });

  axios
    .post("/api/users", body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data.rows,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          { msg: err.response.data.message },
          err.response.status,
          "REGISTER_FAIL"
        )
      );
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

// Login user
export const login = ({ email, password }) => (dispatch) => {
  // headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request body
  const body = JSON.stringify({
    email,
    password,
  });

  axios
    .post("/api/auth", body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data.rows,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          { msg: err.response.data.message },
          err.response.status,
          "LOGIN_FAIL"
        )
      );
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT_SUCCESS,
  });
};

// Setup config/headers in token
export const tokenConfig = (getState) => {
  // Get token from localStorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // if token then add to errors
  if (token) config.headers["x-auth-token"] = token;

  return config;
};
