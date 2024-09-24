import { useState } from "react";
import Navbar from "../../components/Navbar";
import PasswordInput from "../../components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const signUpHandler = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Name is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email,
        password,
      });

      if (response.data && response.data.error) {
        setError(response.data.error);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="mt-28 flex items-center justify-center">
        <div className="w-96 rounded border bg-white px-7 py-10">
          <form className="" action="" method="" onSubmit={signUpHandler}>
            <h4 className="mb-7 text-2xl">Sign Up</h4>

            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="pb-1 text-xs text-red-500">{error}</p>}

            <button type="submit" className="btn-primary">
              Create Account
            </button>

            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
