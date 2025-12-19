import React from "react";
import { useState } from "react";

export const Add = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [sum, setSum] = useState(0);

  function handelSum(e) {
    e.preventDefault();
    setSum(Number(num1) + Number(num2));
    return sum;
  }

  return (
    <form onSubmit={handelSum}>
      <input
        type="number"
        placeholder="Enter 1st number"
        value={num1}
        onChange={(e) => {
          setNum1(e.target.value);
        }}
      />
      <br></br>
      <input
        type="number"
        placeholder="Enter 2nd number"
        value={num2}
        onChange={(e) => {
          setNum2(e.target.value);
        }}
      />
      <br></br>
      <button type="submit">Add</button>
      <h1>{sum}</h1>
    </form>
  );
};
