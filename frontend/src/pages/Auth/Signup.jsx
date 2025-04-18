import { useState } from "react";
import logo from "../../assets/output-onlinepngtools.png";
import { FaGithub, FaXTwitter, FaLinkedin, FaDiscord } from "react-icons/fa6";
import { submitForm } from "./authUtils";
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await submitForm(formData, isRegister);
      sessionStorage.setItem('token',data.token);
      navigate('/home');

      // console.log("Auth Success:", data);
    } catch (error) {
      console.error("Auth Failed:", error);
    }
  };
  
  const handleGoogleAuth = async () => {

  
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
  
  };
 
// console.log(import.meta.env.VITE_BASE_URL);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <div className="relative w-full md:w-[35vw] bg-indigo-600 text-white flex flex-col justify-between p-6 md:p-10">
        <div className="absolute inset-0 bg-indigo-600 transform -skew-x-12 origin-bottom-left hidden md:block"></div>
        <div className="relative z-10 flex flex-col items-start md:items-start">
          <img
            src={logo}//replace
            alt="Logo"
            className="w-20 h-20 transition-all duration-300 hover:scale-110 hover:shadow-xl"
          />
        </div>
        <h1 className="relative z-10 text-6xl text-center bottom-18 ">TensorGo</h1>
        <div className="relative z-10 flex space-x-4 justify-center md:justify-start bottom-5 left-1/2 md:left-5 transform -translate-x-1/2 md:translate-x-0">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-white text-2xl transition-transform duration-300 hover:scale-125 hover:text-gray-300 active:scale-90" />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter className="text-white text-2xl transition-transform duration-300 hover:scale-125 hover:text-gray-300 active:scale-90" />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-white text-2xl transition-transform duration-300 hover:scale-125 hover:text-gray-300 active:scale-90" />
          </a>
          <a
            href="https://discord.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord className="text-white text-2xl transition-transform duration-300 hover:scale-125 hover:text-gray-300 active:scale-90" />
          </a>
        </div>
      </div>
      <div className="w-full md:w-[65vw] flex justify-center items-center bg-gray-50 px-6 py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
            {isRegister ? "Register" : "Sign In"}
          </h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            {isRegister ? "Create your account" : "Sign in to your account"}
          </p>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <button onClick={handleGoogleAuth} className="flex-1 border p-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
              <img
                src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              {isRegister ? "Register with Google" : "Sign in with Google"}
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
               name="email" value={formData.email} onChange={handleChange}
                type="email"
                className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring focus:ring-indigo-300"
                placeholder="johndoe@gmail.com"
              />
              {isRegister && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mt-4">
                    Name
                  </label>
                  <input
                   name="name" value={formData.name} onChange={handleChange}
                    type="text"
                    className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring focus:ring-indigo-300"
                    placeholder="johndoe"
                  />
                </>
              )}
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Password
              </label>
              <input
               name="password" value={formData.password} onChange={handleChange}
                type="password"
                className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring focus:ring-indigo-300"
                placeholder="••••••••"
              />
              {!isRegister && (
                <div className="text-right text-sm text-blue-500 mt-2 cursor-pointer hover:underline">
                  Forgot password?
                </div>
              )}
              <button  className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4 hover:bg-indigo-700 transition">
                {isRegister ? "Register" : "Sign In"}
              </button>
            </div>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            {isRegister
              ? "Already have an account? "
              : "Don’t have an account? "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Sign in here" : "Register here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
