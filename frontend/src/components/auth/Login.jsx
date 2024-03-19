import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const URL_SERV = 'http://localhost:3000';

const Login =  () => {

    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });

    const [errors, setErrors] = useState({});
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
        validateField(name, value);
      };
    
      const validateField = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'email':
                const emailRegex = /^\S+@\S+\.\S+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'password':
                if (value.trim().length < 5) {
                    errorMessage = 'Password must be at least 5 characters long';
                }
                break;
            default:
                break;
        }
        setErrors({
            ...errors,
            [name]: errorMessage,
        });
    };

      const handleSubmit =async (e) => {
        e.preventDefault();
        let formIsValid = true;
        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                validateField(key, formData[key]);
                if (errors[key]) {
                    formIsValid = false;
                }
            }
        }
    if (formIsValid) {
      try {
        const response = await fetch(`${URL_SERV}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
          const data = await response.json();
          console.log('User logged in:', data);
          login();
          navigate('/');
      } catch (err) {
        console.error('Error logged in user:', err);
      }
    }
    };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-white">Login</div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email && 'is-invalid'}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password && 'is-invalid'}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
              </form>
              <div className="forgot-password">
                <a href="#">Forgot Password?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
