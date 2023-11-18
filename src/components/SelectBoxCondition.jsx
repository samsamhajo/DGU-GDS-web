import React, { useEffect } from "react";
import { useState } from "react";
import { arrow_bottom, arrow_top } from "../assets";

const SelectBoxCondition = ({
  num,
  kind,
  conditionDetailList,
  setConditionDetailList,
}) => {
  const [departmentList, setDepartmentList] = useState([
    "해당 종류의 과목 X 학점 이상",
    "해당 종류의 과목 X개 이상",
    "과목 리스트중 X 과목 이상 필수",
    "과목 리스트중 X 과목 이상 필수(개별)",
  ]); // 학과리스트
  const [value, setValue] = useState(""); // 선택된 값
  const [isClicked, setIsClicked] = useState(false); // 클릭된 상황 유무

  /** 조건 종류 편집 함수 */
  const kindOfConditionHandler = (num, value) => {
    let temp = conditionDetailList;
    temp.condition_detail[num].kind_of_condition = value;
    setConditionDetailList({ ...temp });
  };

  /** value값 코드로 변환하는 함수 */
  const valueToCode = (value) => {
    let code;
    switch (value) {
      case "해당 종류의 과목 X 학점 이상":
        code = "00";
        break;
      case "해당 종류의 과목 X개 이상":
        code = "01";
        break;
      case "과목 리스트중 X 과목 이상 필수":
        code = "02";
        break;
      case "과목 리스트중 X 과목 이상 필수(개별)":
        code = "77";
        break;
    }
    return code;
  };

  /** 코드를 value로 바꿔주는 함수 */
  const codeToValue = () => {
    switch (kind) {
      case "00":
        setValue("해당 종류의 과목 X 학점 이상");
        break;
      case "01":
        setValue("해당 종류의 과목 X개 이상");
        break;
      case "02":
        setValue("과목 리스트중 X 과목 이상 필수");
        break;
      case "77":
        setValue("과목 리스트중 X 과목 이상 필수(개별)");
        break;
    }
  };

  /** value값 바뀔 때 마다 학과 세팅 */
  useEffect(() => {
    kindOfConditionHandler(num, valueToCode(value));
  }, [value]);

  /** 초기 조회시 세팅 */
  useEffect(() => {
    kind && kindOfConditionHandler(num, kind);
    codeToValue();
  }, []);

  return (
    <div
      onClick={() => setIsClicked(!isClicked)}
      onBlur={() => setIsClicked(false)}
      tabIndex={0}
      className={
        isClicked
          ? "mr-[15px] w-[230px] h-[32px] font-medium text-[12px] overflow-visible cursor-default"
          : "mr-[15px] w-[230px] h-[32px] font-medium text-[12px] overflow-hidden cursor-default"
      }
    >
      <div className="flex items-center justify-between px-[3px] border-[1px] rounded-[3px] w-[230px] h-[32px]">
        <div>{value}</div>

        <img
          src={isClicked ? arrow_top : arrow_bottom}
          width={24}
          height={24}
        />
      </div>
      {departmentList.map((i, j) => {
        return (
          <div
            onClick={() => setValue(i)}
            key={`condition${j}`}
            className="flex items-center px-[3px] border-x-[1px] border-b-[1px] rounded-[3px] w-[230px] h-[32px]"
          >
            {i}
          </div>
        );
      })}
    </div>
  );
};

export default SelectBoxCondition;
