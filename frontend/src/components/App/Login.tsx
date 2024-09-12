import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginStart } from '../../Redux/slices/authSlice';
import styles from '../../styles/Login.module.css';
import { toast } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
import { useAppDispatch, useAppSelector } from '../../hooks/hook'; 
import { useRouter } from 'next/router'; 

const Login = ({ toggleForm, onSuccess }: { toggleForm: () => void, onSuccess: () => void }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, error } = useAppSelector((state) => state.auth); 
  const router = useRouter(); 

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: (values) => {
      dispatch(loginStart(values));
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Login successful!');
      onSuccess(); 
    }

    if (error) {
      toast.error(`Login failed: ${error}`);
    }
  }, [isAuthenticated, error, onSuccess]);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Login</h2>
      <form onSubmit={formik.handleSubmit}>
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
        </div>

        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>

      <a className={styles.link} onClick={toggleForm}>
        Don't have an account? Register
      </a>
    </div>
  );
};

export default Login;
