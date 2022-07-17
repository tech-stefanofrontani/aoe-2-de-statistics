import styles from './Checkbox.module.scss';

type CheckboxProps = {
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

const Checkbox = ({ labelProps, inputProps, ...restProps }: CheckboxProps) => {
  const { htmlFor: htmlFor, description: labelDescription, ...restLabelProps } = labelProps;
  const { name: inputName, checked: checked, value: inputValue, id: inputId, ...restInputProps } = inputProps;

  return (
    <div className={styles.root} {...restProps}>
      <input id={inputId} name={inputName} type="checkbox" checked={checked} value={inputValue} {...restInputProps}/>
      <label htmlFor={inputId} {...restLabelProps}>{labelDescription}</label>
    </div>
  );
};

export { Checkbox };