import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
};

const Button: React.FC<ButtonProps> = ({ label, type, disabled }: ButtonProps ) => {
  return (
    <div className={styles.root}>
      <button disabled={disabled} className={styles.button} type={type}>{label}</button>
    </div>
  );
};

export { Button };