import React,{ Component,useState,useReducer, useEffect  } from 'react';
import './App.css';
import Nav from './components/Nav'
import Home from './components/Home'
import Result from './components/Result'
import { Route, HashRouter } from 'react-router-dom'



function App() {
  //const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <HashRouter>

    {/* <ClauseContext.Provider value={{ state, dispatch }}> */}

    <div className="App">
     <Nav/>
    <Route exact path='/' component={Home}/>
    <Route path='/result' component={Result} />
    </div>
    {/* </ClauseContext.Provider> */}
    </HashRouter>

  );
}

export default App;
