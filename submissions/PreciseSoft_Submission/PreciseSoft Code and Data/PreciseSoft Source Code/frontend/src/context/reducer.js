import {
    SET_CLAUSE
  } from "./action.types";


  export default (state, action) => {
    switch (action.type) {
      case SET_CLAUSE:
        return {
            ...state
          };
  
      default:
        return state;
    }
  };