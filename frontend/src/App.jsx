import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000/auth';

// export default function Auth() {
//   const [formData, setFormData] = useState({ email: '', password: '', name: '' });
//   const [isRegister, setIsRegister] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/google/callback`, { withCredentials: true });
//         setUser(response.data.user);
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const endpoint = isRegister ? '/register' : '/login';
//       const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData);
//       alert(response.data.msg);
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         setUser(response.data.user);
//       }
//     } catch (error) {
//       alert(error.response.data.msg);
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = `${API_BASE_URL}/google`;
//   };

//   return (
//     <div>
//       <h1>{isRegister ? 'Register' : 'Login'}</h1>
//       <form onSubmit={handleSubmit}>
//         {isRegister && (
//           <input type='text' name='name' placeholder='Name' value={formData.name} onChange={handleChange} required />
//         )}
//         <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required />
//         <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required />
//         <button type='submit'>{isRegister ? 'Register' : 'Login'}</button>
//       </form>
//       <button onClick={handleGoogleLogin}>Login with Google</button>
//       <button onClick={() => setIsRegister(!isRegister)}>
//         {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
//       </button>
//       {user && (
//         <div>
//           <h2>Welcome, {user.name}</h2>
//           <p>Email: {user.email}</p>
//         </div>
//       )}
//     </div>
//   );
// }
