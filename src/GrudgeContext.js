import React, { useReducer, useCallback, createContext } from 'react'
import id from 'uuid/v4';
import initialState from './initialState';

// Actions
const GRUDGE_ADD = 'GRUDGE_ADD';
const GRUDGE_FORGIVE = 'GRUDGE_FORGIVE';

// Context
export const GrudgeContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case GRUDGE_ADD:
      return [
        action.payload,
        ...state
      ];
  
    case GRUDGE_FORGIVE:
      return state.map(grudge => {
        if (grudge.id !== action.payload.id) return grudge;
        return { ...grudge, forgiven: !grudge.forgiven };
      })

    default:
      return state;
  }
};

export const GrudgeProvider = ({ children }) => {
  const [grudges, dispatch] = useReducer(reducer, initialState);

  const addGrudge = useCallback(({ person, reason }) => {
    dispatch({
      type: GRUDGE_ADD,
      payload: {
        person,
        reason,
        forgiven: false,
        id: id()
      }
    })
  }, [dispatch]);

  const toggleForgiveness = useCallback(id => {
    dispatch({
      type: GRUDGE_FORGIVE,
      payload: { id }
    })
  }, [dispatch]);

  const value = {
    grudges,
    addGrudge,
    toggleForgiveness
  }

  return (
    <GrudgeContext.Provider value={value}>{children}</GrudgeContext.Provider>
  );
};