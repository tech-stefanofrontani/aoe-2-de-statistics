import React from 'react';
import styles from './Chip.module.scss';

// interface ChipProps {
//   label: string,
//   checked: boolean,
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
//   value: any
// };

type ChipProps = {
  labelProps: {
    [key: string]: string,
  },
  inputProps: {
    id: string,
    name: string,
    checked: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    value?: string,
  };
};

const Chip = ({ labelProps, inputProps, ...restProps }: ChipProps) => {
  const { htmlFor: htmlFor, description: labelDescription, ...restLabelProps } = labelProps;
  const { name: inputName, checked: checked, value: inputValue, id: inputId, ...restInputProps } = inputProps;

  if (labelDescription === "1v1 Deatch Match") {
    console.log(checked);
  }

  return (
    <div className={`${styles.root} ${checked && styles["checked"]}`}>
      <input id={inputId} name={inputName} type="checkbox" checked={checked} value={inputValue} {...restInputProps}/>
      <label htmlFor={inputId} {...restLabelProps}>{labelDescription}</label>
    </div>
  );
};

export { Chip };