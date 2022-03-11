import React from 'react';
import classes from './Input.module.css';

//! forwardRef - огортаєм наш кастомний компонент томущо ми не можемо використати ref для кастомного компонента як для простого html елемента

const Input = React.forwardRef((props, ref) => {
  return (
    <div className={classes.input}>
      <label htmlFor={props.input.id}>{props.lable}</label>
      <input {...props.input} ref={ref} />
    </div>
  );
});

export default Input;
