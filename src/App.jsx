import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h1>My Webpage</h1>
        <div>
          <Link to="/login">
            <button style={{ marginRight: '10px' }}>Login</button>
          </Link>
          <Link to="/signup">
            <button>Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;