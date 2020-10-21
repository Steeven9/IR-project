import { TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <img alt="Logo" src="logo192.png"/> <h1>IR project - movie search</h1>
      <TextField label="Search"/>
      <Search />
    </div>
  );
}

export default App;
