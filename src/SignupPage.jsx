import React from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h1>Signup Page</h1>
        <div>
          <Link to="/">
            <button style={{ marginRight: '10px' }}>Home</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
      <form style={{ marginTop: '20px' }}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default SignupPage;