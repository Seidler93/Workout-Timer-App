import React, { useState } from 'react';

export default function Min({}) {
  const minOptions = Array.from({ length: 99 }, (_, index) => index);

  const [selectSize, setSelectSize] = useState(0);

  const handleSelectMouseDown = () => {
    setSelectSize(8);
  };

  const handleSelectChange = () => {
    setSelectSize(0);
  };

  const handleSelectBlur = () => {
    setSelectSize(0);
  };

  return (
    <select name="select1" onmousedown="if(this.options.length>8){this.size=8;}"  onchange='this.size=0;' onblur="this.size=0;">
      <option value="1">This is select number 1</option>
      <option value="2">This is select number 2</option>
      <option value="3">This is select number 3</option>
      <option value="4">This is select number 4</option>
      <option value="5">This is select number 5</option>
      <option value="6">This is select number 6</option>
      <option value="7">This is select number 7</option>
      <option value="8">This is select number 8</option>
      <option value="9">This is select number 9</option>
      <option value="10">This is select number 10</option>
      <option value="11">This is select number 11</option>
      <option value="12">This is select number 12</option>
    </select>
  );
}
