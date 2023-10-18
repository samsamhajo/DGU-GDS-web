import React, { useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { useState } from "react";
import { getConditionRequest } from "../api/api";

const StudentInfoInput = () => {
  const [studentInfoArr, setStudentInfoArr] = useState([]); // 매칭 후 학생 정보 리스트
  const [gradeFileList, setGradeFileList] = useState([]); // 성적표 파일 리스트
  const [classificationFileList, setClassificationFileList] = useState([]); // 취득분류표 리스트

  const [gradeArr, setGradeArr] = useState([]); // 성적표 파싱 데이터들
  const [classificationArr, setClassificationArr] = useState([]); // 취득분류표 파싱 데이터들

  const [major, setMajor] = useState(""); // 전공
  const [graduation_year, setGraduation_year] = useState(); // 졸업 사정 년도
  const [graduation_semester, setGraduation_semester] = useState(); // 졸업 사정 학기

  const [conditionArr, setConditionArr] = useState([]); // 졸업 조건 리스트

  /** 엑셀파일 파싱 */
  const handleFileUpload = (e, type) => {
    const fileArr = e.target.files;

    type == 0 && setGradeFileList([...e.target.files]);
    type == 1 && setClassificationFileList([...e.target.files]);

    for (let i = 0; i < fileArr.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // 첫 번째 시트 가져오기
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // 셀 데이터 파싱하여 출력
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 파일이 성적표인경우
        if (type == 0) {
          setGradeArr([...gradeArr, jsonData]);
        }
        // 파일이 취득분류표인경우
        if (type == 1) {
          setClassificationArr([...classificationArr, jsonData]);
        }
      };
      reader.readAsArrayBuffer(fileArr[i]);
    }
  };

  /** 취득분류표에서 학수강좌번호, 성적 파싱 */
  const classNumberParser = (jsonData) => {
    let classArr = [];
    let x = 0;
    let y = 0;

    for (let i = 0; i < jsonData.length; i++) {
      for (let j = 0; j < jsonData[i].length; j++) {
        if (jsonData[i][j] == "교과목명") {
          x = i + 1;
          y = j;
          break;
        }
      }
      if (x != 0) {
        break;
      }
      // arr[6] && classArr.push(arr[6].split(/\s+/g));
    }

    for (let i = x; i < jsonData.length; i++) {
      jsonData[i][y] && classArr.push(jsonData[i][y].split(/\s+/g));
    }

    return classArr;
  };

  /** 파싱한 학수강좌번호, 성적으로 비교하고 전체성적표, 취득분류표 합치기 */
  const matchingHandler = () => {
    classificationArr.forEach((jsonData, index) => {
      let parsingData = classNumberParser(jsonData);
      console.log(parsingData);
      for (const x of gradeArr) {
        let count = parsingData.length;
        parsingData.forEach((el) => {
          x.forEach((y) => {
            if (y[5] == el[0] && y[10] == el[3]) {
              count--;
            }
          });
        });
        // 같은 학생의 취득분류표와 성적표인 경우
        if (count == 0) {
          let temp = [
            {
              graduation_year: graduation_year,
              graduation_semester: graduation_semester,
              student_major: jsonData[5][3],
              student_code: jsonData[5][8].split(": ")[1],
              student_name: jsonData[5][14].split(" ")[1],
              student_course: jsonData[3][18].split(":")[1],
              student_type: "단일전공",
              student_graduation: "",
              student_document: "",
              english_level: jsonData[3][20].split(":")[1],
            },
            x,
          ];

          let stuTemp = studentInfoArr;
          stuTemp.push(temp);
          setStudentInfoArr([...stuTemp]);
          break;
        }
      }
    });
  };

  useEffect(() => {
    console.log(studentInfoArr);
  }, [studentInfoArr]);

  /** 입학년도 토대로 졸업 조건 불러오기 */
  const conditionLoader = () => {
    let enterList = [];

    // 입학년도 중복되지 않으면 해당 년도 추가
    for (const el of studentInfoArr) {
      let year = el[0].student_code.substr(2, 2);
      enterList.find(year) && enterList.push(year);
    }

    // 입학년도로 졸업조건 불러와서 저장
    enterList.forEach((year) => {
      getConditionRequest(major, year, "단일전공", "심화과정").then((res) => {
        setConditionArr([...conditionArr, { year: year, ...res.data }]);
      });
    });
  };

  /** 졸업조건 찾아서 졸업 판별 */
  const graduationSimulator = () => {
    let totalResult = { studentInfoList: [] };

    studentInfoArr.forEach((el) => {
      conditionArr.forEach((condition) => {
        // 년도가 같으면 졸업 판별 시작
        if (el[0].student_code.substr(2, 2) == condition.year) {
          condition.forEach((data) => {});
        }
      });
    });
  };

  return (
    <>
      <h2 class="mb-[18px] text-2xl font-medium">학생 정보 입력</h2>
      <div class="mb-[50px] flex gap-[20px] text-[16px] font-bold">
        <span>학과</span>
        <input
          onChange={(e) => setMajor(e.target.value)}
          class="w-[180px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center"
        />
        <span>졸업년도</span>
        <input
          onChange={(e) => setGraduation_year(e.target.value)}
          class="w-[180px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center"
        />
        <span>학기</span>
        <input
          onChange={(e) => setGraduation_semester(e.target.value)}
          class="w-[180px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center"
        />
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
          <label htmlFor="file0">
            <div class="mb-[12px] flex items-center justify-center w-[135px] h-[32px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center bg-slate-100 active:bg-slate-50 cursor-pointer">
              전체성적표 업로드
            </div>
          </label>
          {/* <input
            onChange={(e) => handleExcelFileChange(e)}
            id="file1"
            type="file"
          /> */}
          <div class="p-[10px] w-[420px] h-[210px] border-[1px] border-gray-300 rounded-[3px] box-border ">
            {gradeFileList.map((file) => {
              return <div>{file.name}</div>;
            })}
          </div>
        </div>
        <div>
          <label htmlFor="file1">
            <div class="mb-[12px] flex items-center justify-center w-[135px] h-[32px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center bg-slate-100 active:bg-slate-50 cursor-pointer">
              취득분류표 업로드
            </div>
          </label>
          <input
            id="file0"
            type="file"
            onChange={(e) => handleFileUpload(e, 0)}
            multiple
            class="hidden"
          />
          <input
            id="file1"
            type="file"
            onChange={(e) => handleFileUpload(e, 1)}
            multiple
            class="hidden"
          />
          <div class="p-[10px] w-[420px] h-[210px] border-[1px] border-gray-300 rounded-[3px] box-border ">
            {classificationFileList.map((file) => {
              return <div>{file.name}</div>;
            })}
          </div>
        </div>
      </div>
      <button
        onClick={() => matchingHandler()}
        class="ml-[420px] mb-[20px] w-[54px] h-[30px] rounded-[3px] bg-blue-500 text-[14px] text-white"
      >
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
