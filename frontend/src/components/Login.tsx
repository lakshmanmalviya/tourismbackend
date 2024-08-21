import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from '../styles/Login.module.css'

const Login = ({ toggleForm }: { toggleForm: () => void }) => {
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
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Login</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
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
          <label htmlFor="password" className={styles.label}>Password</label>
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

        <button type="submit" className={styles.button}>Login</button>
      </form>
      
      <a className={styles.link} onClick={toggleForm}>
        Don't have an account? Register
      </a>
    </div>
  );
};

export default Login;
