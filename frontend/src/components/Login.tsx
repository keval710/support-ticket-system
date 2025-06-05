import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import envVar from '../config/config';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(envVar.GOOGLE_USER_INFO, {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        login({ ...res.data, access_token: tokenResponse.access_token });
        navigate('/');
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    },
    onError: () => {
      console.error('Google login failed');
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>
        <p className="text-gray-500 mb-6">Login to continue</p>
        <button
          onClick={() => googleLogin()}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;