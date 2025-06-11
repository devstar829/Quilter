import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register: React.FC = () => {
  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setFormError(error);
      clearError();
    }
  }, [error, clearError]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' }); // Clear field error on change
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Email is required';
        if (!emailRegex.test(value)) return 'Invalid email address';
        break;
      case 'password':
        if (!value.trim()) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        break;
      case 'password2':
        if (!value.trim()) return 'Confirm Password is required';
        if (value !== password) return 'Passwords do not match';
        break;
      default:
        return '';
    }
    return '';
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors({ ...fieldErrors, [name]: error });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before submission
    const errors = {
      name: validateField('name', name),
      email: validateField('email', email),
      password: validateField('password', password),
      password2: validateField('password2', password2)
    };

    setFieldErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some((error) => error)) {
      return;
    }

    await register(name, email, password);
  };

  return (
    <div className="register-form">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>

      {formError && <div className="alert alert-danger">{formError}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            onBlur={onBlur}
            required
            className="form-control"
          />
          {fieldErrors.name && <small className="error">{fieldErrors.name}</small>}
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            onBlur={onBlur}
            required
            className="form-control"
          />
          {fieldErrors.email && <small className="error">{fieldErrors.email}</small>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            onBlur={onBlur}
            required
            minLength={6}
            className="form-control"
          />
          {fieldErrors.password && <small className="error">{fieldErrors.password}</small>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
            onBlur={onBlur}
            required
            minLength={6}
            className="form-control"
          />
          {fieldErrors.password2 && <small className="error">{fieldErrors.password2}</small>}
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
