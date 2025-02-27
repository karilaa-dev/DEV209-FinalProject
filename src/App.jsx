import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
      <h1 style={{ alignSelf: 'flex-start' }}>My Webpage</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/signup">
          <button>Signup</button>
        </Link>
      </div>
    </div>
  );
};

export default App;