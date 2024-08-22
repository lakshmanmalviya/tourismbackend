import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerStart } from '../Redux/slices/authSlice';
import { pawdRegExp } from '@/utils/utils';
import styles from '../styles/Register.module.css';
import { toast } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
import { useAppDispatch, useAppSelector } from '../hooks/hook'; 


const Register = ({ toggleForm, onSuccess }: { toggleForm: () => void, onSuccess: () => void }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, error } = useAppSelector((state) => state.auth); 

  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [successfullyRegistered, setSuccessfullyRegistered] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      username: Yup.string()
        .min(4, 'Username must be at least 4 characters')
        .required('Username is required'),
      password: Yup.string()
        .matches(pawdRegExp, 'Password must meet all the requirements')
        .required('Password is required'),
    }),
    onSubmit: (values) => {
      dispatch(registerStart(values));
    },
  });

  useEffect(() => {
    if (isAuthenticated && !successfullyRegistered) {
      toast.success('Registration successful!');
      setSuccessfullyRegistered(true);
      onSuccess(); 
    }

    if (error) {
      toast.error(`Registration failed: ${error}`);
    }
  }, [isAuthenticated, error, successfullyRegistered, onSuccess]);

  useEffect(() => {
    const { password } = formik.values;
    setPasswordRules({
      minLength: password.length >= 8,
      hasLetter: /[A-Za-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*#?&]/.test(password),
    });
  }, [formik.values.password]);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Register</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <input
            id="username"
            type="text"
            className={styles.input}
            {...formik.getFieldProps('username')}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className={styles.error}>{formik.errors.username}</div>
          ) : null}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className={styles.error}>{formik.errors.email}</div>
          ) : null}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            {...formik.getFieldProps('password')}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className={styles.error}>{formik.errors.password}</div>
          ) : null}

          <div className={styles.passwordRules}>
            <div
              className={`${styles.rule} ${
                passwordRules.minLength ? styles.valid : ''
              }`}
            >
              • At least 8 characters
            </div>
            <div
              className={`${styles.rule} ${
                passwordRules.hasLetter ? styles.valid : ''
              }`}
            >
              • At least one letter (A-Z or a-z)
            </div>
            <div
              className={`${styles.rule} ${
                passwordRules.hasNumber ? styles.valid : ''
              }`}
            >
              • At least one number (0-9)
            </div>
            <div
              className={`${styles.rule} ${
                passwordRules.hasSpecialChar ? styles.valid : ''
              }`}
            >
              • At least one special character (@$!%*#?&)
            </div>
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>

      <a className={styles.link} onClick={toggleForm}>
        Already have an account? Login
      </a>
    </div>
  );
};

export default Register;
