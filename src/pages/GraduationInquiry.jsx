import axios from "axios";
import React, { useEffect, useState } from "react";
import { SelectBox180 } from "../components";
import { resultRequest } from "../api/api";

const GraduationInquiry = () => {
  const [major, setMajor] = useState("컴퓨터공학과"); // 학과
  const [year, setYear] = useState("24"); // 졸업년도
  const [semester, setSemester] = useState("1"); // 학기
  const [result, setResult] = useState([]);
  const [detail, setDetail] = useState([]);

  /** 조회 */
  const inquiryHandler = () => {
    resultRequest(year, semester, major).then((res) => {
      setResult([...res.data]);

      setDetail([...new Array(res.data.length).fill(false)]);
    });
  };

  /** 자세히 보기 */
  const detailHandler = (index) => {
    let temp = detail;
    temp[index] = !temp[index];

    setDetail([...temp]);
  };

  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <>
      <h2 class="mb-[18px] text-2xl font-medium">졸업 조회 페이지</h2>
      <div class="mb-[50px] flex gap-[20px] text-[16px] font-bold">
        <span>학과</span>
        <input
          onChange={(e) => setMajor(e.target.value)}
          class="w-[180px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center"
        />

        <span>졸업년도</span>
        <input
          onChange={(e) => setYear(e.target.value)}
          class="w-[180px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center"
        />
        <span>학기</span>

        <input
          onChange={(e) => setSemester(e.target.value)}
          class="w-[180px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center"
        />

        <button
          onClick={() => inquiryHandler()}
          class="mb-[12px] flex items-center justify-center w-[48px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center bg-slate-100 active:bg-slate-50 cursor-pointer"
        >
          조회
        </button>
      </div>
      <div class="p-[30px] border-[1px] border-gray-200 rounded-[3px] box-border">
        <div class="mb-[20px]">
          <div class="flex w-[600px] h-[25px] border-y-[1px] border-l-[1px] border-black text-[14px] font-semibold">
            <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
              학번
            </div>
            <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
              이름
            </div>
            <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
              유형
            </div>
            <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
              과정
            </div>
            <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black ">
              졸업 판별 결과
            </div>
            <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
              문서 검증 결과
            </div>
          </div>
          {/** 변환된 데이터 부분 반복 */}
          {result.map((el, index) => {
            return (
              <>
                <div class="flex gap-[20px]">
                  <div class="flex w-[600px] h-[25px] border-b-[1px] border-l-[1px] border-black text-[12px] font-medium">
                    <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                      {el.studentInfo.studentcode}
                    </div>
                    <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                      {el.studentInfo.studentname}
                    </div>
                    <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                      {el.studentInfo.studenttype}
                    </div>
                    <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                      {el.studentInfo.studentcourse == "Y"
                        ? "심화과정"
                        : "일반과정"}
                    </div>
                    <div
                      class={
                        el.studentInfo.studentgraduation == "P"
                          ? `flex items-center justify-center w-[100px] border-r-[1px] border-black bg-green-400`
                          : `flex items-center justify-center w-[100px] border-r-[1px] border-black bg-red-400`
                      }
                    >
                      {el.studentInfo.studentgraduation == "P"
                        ? "통과"
                        : "실패"}
                    </div>
                    <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                      통과
                    </div>
                  </div>
                  <button
                    onClick={() => detailHandler(index)}
                    class="flex items-center justify-center w-[80px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[12px] font-medium text-center bg-slate-100 active:bg-slate-50 cursor-pointer"
                  >
                    자세히 보기
                  </button>
                </div>
                {detail[index] && (
                  <div class="my-[10px] text-[12px] text-green-400">
                    {el.condition_result.map((v, index) => {
                      return (
                        <div class={v.pass_info == "T" ? "" : "text-red-400"}>
                          {v.pass_info == "T" ? "(통과) " : "(실패) "}
                          {`${index + 1} `}.
                          {v.kind_of_condition == "00" &&
                            `${v.kind_of_subject}과목은 ${v.credit}학점 이상 이수한다. (${v.student_credit}/${v.credit})`}
                          {v.kind_of_condition == "01" &&
                            `${v.kind_of_subject}과목은 ${v.credit}개 이상 이수한다 (${v.student_credit}/${v.credit})`}
                          {v.kind_of_condition == "02" &&
                            `다음 과목 중 ${v.credit}과목 이상 이수한다. / ${v.required_course} / (이수한 과목: ${v.student_course})`}
                          {v.kind_of_condition == "03" &&
                            `졸업학점 평점은 ${v.gpa} 이상이어야 한다. (${v.student_gpa}/${v.gpa})`}
                          {v.kind_of_condition == "04" &&
                            `전체학점은 ${v.credit}학점 이상 이수한다. (${v.student_credit}/${v.credit})`}
                          {v.kind_of_condition == "05" &&
                            `영어 과목은 다음 과목을 모두 이수한다. / ${v.required_course} /(이수한 과목: ${v.student_course})`}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GraduationInquiry;
