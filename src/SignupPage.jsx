import React from "react";

const SignupPage = () => {
  return (
    <div>
      <h2>Signup Page</h2>
      <form>
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
