import React, { useState, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../services/RoleContext';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setRole } = useContext(RoleContext);
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // บันทึก token และ username ลงใน LocalStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username); // บันทึก username ที่ได้จาก API
        setRole(data.role); 
        console.log('Login successful!');
        navigate('/');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="row justify-content-center">
        <div className="col-xs-10 col-xs-12 col-md-9">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row">
              <div  className="col-lg-6 d-none d-lg-block bg-login-image rounded"  style={{
                  backgroundImage: `url('src/assets/images/logo.png')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat', // ป้องกันการซ้ำของรูปภาพ
                  backgroundPosition: 'center',
                  backgroundColor:'#E8F0FE'
                }}>
                </div>
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">Welcome Bro !</h1>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form className="user" onSubmit={handleLogin}>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control form-control-user"
                          placeholder="Enter Email Address..."
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control form-control-user"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-user btn-block">
                        Login
                      </button>
                    </form>

                    <hr />
                    <div className="text-center">
                      <a className="small" href="/">Forgot Password?</a>
                    </div>
                    <div className="text-center">
                      <a className="small" href="/">Create an Account!</a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default  Login;
