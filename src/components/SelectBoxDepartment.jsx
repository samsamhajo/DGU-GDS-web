import React, { useEffect } from "react";
import { useState } from "react";

const SelectBoxDepartment = ({ setDepartment }) => {
  const [departmentList, setDepartmentList] = useState([]); // 학과리스트
  const [value, setValue] = useState(""); // 선택된 값
  const [isClicked, setIsClicked] = useState(false); // 클릭된 상황 유무

  /** 학과 리스트 불러와서 세팅하는 함수 */
  const departmentSetting = () => {
    //블라블라
    let temp = ["컴퓨터공학과", "정보통신공학과", "전자공학과"];
    setDepartmentList([...temp]);
  };

  /** 렌더링시 학과 리스트 세팅  */
  useEffect(() => {
    departmentSetting();
  }, []);

  /** value값 바뀔 때 마다 학과 세팅 */
  useEffect(() => {
    setDepartment(value);
  }, [value]);

  return (
    <div
      onClick={() => setIsClicked(!isClicked)}
      onBlur={() => setIsClicked(false)}
      tabIndex={0}
      className={
        isClicked
          ? "w-[180px] h-[24px] font-medium text-[12px] overflow-visible cursor-default"
          : "w-[180px] h-[24px] font-medium text-[12px] overflow-hidden cursor-default"
      }
    >
      <div className="flex items-center justify-between px-[3px] border-[1px] rounded-[3px] w-[180px] h-[24px]">
        <div>{value}</div>
        {/** 여기 이미지 들어가야함 */}
      </div>
      {departmentList.map((i, j) => {
        return (
          <div
            onClick={() => setValue(i)}
            key={`rty${j}`}
            className="flex items-center px-[3px] border-x-[1px] border-b-[1px] rounded-[3px] w-[180px] h-[24px]"
          >
            {i}
          </div>
        );
      })}
    </div>
  );
};

export default SelectBoxDepartment;
