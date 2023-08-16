import React, { useEffect } from "react";
import { useState } from "react";

const SelectBoxCategory = ({ setCategory }) => {
  const [value, setValue] = useState(""); // 선택된 값
  const [isClicked, setIsClicked] = useState(false); // 클릭된 상황 유무

  const categoryList = ["단일전공", "부전공"];

  /** value값 바뀔 때 마다 유형 세팅 */
  useEffect(() => {
    setCategory(value);
  }, [value]);

  return (
    <div
      onClick={() => setIsClicked(!isClicked)}
      onBlur={() => setIsClicked(false)}
      tabIndex={0}
      className={
        isClicked
          ? "w-[120px] h-[24px] font-medium text-[12px] overflow-visible cursor-default"
          : "w-[120px] h-[24px] font-medium text-[12px] overflow-hidden cursor-default"
      }
    >
      <div className="flex items-center justify-between px-[3px] border-[1px] rounded-[3px] w-[120px] h-[24px]">
        <div>{value}</div>
        {/** 여기 이미지 들어가야함 */}
      </div>
      {categoryList.map((i, j) => {
        return (
          <div
            onClick={() => setValue(i)}
            key={`asd${j}`}
            className="flex items-center px-[3px] border-x-[1px] border-b-[1px] rounded-[3px] w-[120px] h-[24px]"
          >
            {i}
          </div>
        );
      })}
    </div>
  );
};

export default SelectBoxCategory;
