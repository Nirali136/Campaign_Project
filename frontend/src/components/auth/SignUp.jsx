import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const URL_SERV = 'http://localhost:3000'

const SignUp = () => {
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobile_No: '',
        address: ''
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
            case 'name':
                if (value.trim().length < 3) {
                    errorMessage = 'Name must be at least 3 characters long';
                }
                break;
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
            case 'mobile_No':
                const mobileRegex = /^[0-9]{10}$/;
                if (!mobileRegex.test(value)) {
                    errorMessage = 'Please enter a valid 10-digit mobile number';
                }
                break;
            case 'address':
              if (value.trim().length < 8) {
                errorMessage = 'Address must be at least 8 characters long';
              } else if (value.trim().length > 50) {
                errorMessage = 'Address must be at most 50 characters long';
              }
                break;
            default:
                break;
        }
        setErrors({
            ...errors,
            [name]: errorMessage
        });
    };
      const handleSubmit =async (e) => {
        e.preventDefault();

        let hasErrors = false;
        for (const key in formData) {
          if (formData[key].trim() === '' || errors[key]) {
            hasErrors = true;
          }
        }
        if (hasErrors) {
          toast.error('Please fill out all fields correctly.');
          return;
        }

        try {
          const response = await fetch(`${URL_SERV}/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          if(response.ok){
            const data = await response.json();
            console.log('User signed up:', data);
            toast.success('Sign up successfully!');
            navigate('/login');
          }else{
            throw new Error('Something went wrong!');
          }
        } catch (err) {
          console.error('Error signing up:', err);
          toast.error('Failed to sign up.');
        }
      };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-white">Sign Up</div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name && 'is-invalid'}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={30}
                    required
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email && 'is-invalid'}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={30}
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
                    maxLength={15}
                    required
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.mobile_No && 'is-invalid'}`}
                    id="mobile"
                    name="mobile_No"
                    value={formData.mobile_No}
                    onChange={handleChange}
                    maxLength={10}
                    onKeyDown={(e) => {
                      if (!(e.key >= '0' && e.key <= '9') && e.key !== 'Backspace') {
                        e.preventDefault();
                    }
                    }}
                    required
                  />
                  {errors.mobile_No && <div className="invalid-feedback">{errors.mobile_No}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    className={`form-control ${errors.address && 'is-invalid'}`}
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    maxLength={50}
                    rows="3"
                    required
                  ></textarea>
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
                <button type="submit" className="btn btn-orange mt-2">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default SignUp
