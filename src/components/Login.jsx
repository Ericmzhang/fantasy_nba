import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Login () {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <button className="border-2 border-gray-400 rounded-md px-4 py-2 hover:border-blue-500" onClick={() => loginWithRedirect()}>Log In</button>
    </div>
  )
 
};

export default Login;