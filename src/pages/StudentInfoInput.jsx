import React, { useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { useState } from "react";

const StudentInfoInput = () => {
  const [data, setData] = useState();

  const readExcel = async (file) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      if (!e.target) return;
      const bufferArray = e.target.result;
      const fileInformation = XLSX.read(bufferArray, {
        type: "buffer",
        cellText: false,
        cellDates: true,
      });
      const sheetName = fileInformation.SheetNames[0];
      const rawData = fileInformation.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(rawData);

      setData([...data]);
    };
  };

  const handleExcelFileChange = (e) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    readExcel(file);
  };

  return (
    <>
      <h2 class="mb-[18px] text-2xl font-medium">학생 정보 입력</h2>
      <div class="mb-[50px] flex gap-[20px] text-[16px] font-bold">
        <span>학과</span>

        <span>졸업년도</span>
        <input class="w-[180px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center" />
        <span>학기</span>
      </div>
      {/* {data &&
        data.map((i) => {
          return <div>{i.공학요소}</div>;
        })} */}
      {/* // 예제 */}
      {/* <div>전공</div>
      <div>전공</div>
      <div>전공</div> */}
      <div class="mb-[15px] flex gap-[50px]">
        <div>
          <label htmlFor="file1">
            <div class="mb-[12px] flex items-center justify-center w-[135px] h-[32px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center bg-slate-100 active:bg-slate-50 cursor-pointer">
              취득분류표 업로드
            </div>
          </label>
          {/* <input
            onChange={(e) => handleExcelFileChange(e)}
            id="file1"
            type="file"
          /> */}
          <div class="p-[10px] w-[420px] h-[210px] border-[1px] border-gray-300 rounded-[3px] box-border "></div>
        </div>
        <div>
          <label htmlFor="file1">
            <div class="mb-[12px] flex items-center justify-center w-[135px] h-[32px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center bg-slate-100 active:bg-slate-50 cursor-pointer">
              전체 성적표 업로드
            </div>
          </label>
          <input id="file1" type="file" multiple class="hidden" />
          <div class="p-[10px] w-[420px] h-[210px] border-[1px] border-gray-300 rounded-[3px] box-border "></div>
        </div>
      </div>
      <button class="ml-[420px] mb-[20px] w-[54px] h-[30px] rounded-[3px] bg-blue-500 text-[14px] text-white">
        변환
      </button>
      <div class="mb-[30px] border-t-[1px] border-gray-300" />
      <h3 class="mb-[20px] font-semibold">학쟁 정보 리스트</h3>
      <div class="mb-[20px]">
        <div class="flex w-[700px] h-[25px] border-y-[1px] border-l-[1px] border-black text-[14px] font-semibold">
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
            ipp
          </div>
          <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
            수상기록
          </div>
          <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
            기타
          </div>
        </div>
        {/** 변환된 데이터 부분 반복 */}
        <div class="flex w-[700px] h-[25px] border-b-[1px] border-l-[1px] border-black text-[12px] font-medium">
          <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
            2023123123
          </div>
          <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
            김철수
          </div>
          <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
            단일전공
          </div>
          <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
            심화과정
          </div>
          <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black ">
            ipp완료서류.pdf
          </div>
          <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
            <button class="flex items-center justify-center w-[14px] h-[14px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center bg-slate-100 active:bg-slate-50">
              +
            </button>
          </div>
          <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
            <button class="flex items-center justify-center w-[14px] h-[14px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center bg-slate-100 active:bg-slate-50">
              +
            </button>
          </div>
        </div>
      </div>
      <button class="ml-[420px] mb-[20px] w-[170px] h-[30px] rounded-[3px] bg-blue-500 text-[14px] text-white">
        졸업 판별 시작 및 저장
      </button>
    </>
  );
};

export default StudentInfoInput;
