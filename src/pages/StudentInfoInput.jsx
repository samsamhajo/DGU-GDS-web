import React, { useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { useState } from "react";
import { getConditionRequest, simulationRequest } from "../api/api";

const StudentInfoInput = () => {
  const [studentInfoArr, setStudentInfoArr] = useState([]); // 매칭 후 학생 정보 리스트
  const [gradeFileList, setGradeFileList] = useState([]); // 성적표 파일 리스트
  const [classificationFileList, setClassificationFileList] = useState([]); // 취득분류표 리스트

  const [gradeArr, setGradeArr] = useState([]); // 성적표 파싱 데이터들
  const [classificationArr, setClassificationArr] = useState([]); // 취득분류표 파싱 데이터들

  const [major, setMajor] = useState("컴퓨터공학과"); // 전공
  const [graduation_year, setGraduation_year] = useState("24"); // 졸업 사정 년도
  const [graduation_semester, setGraduation_semester] = useState("1"); // 졸업 사정 학기

  const [conditionArr, setConditionArr] = useState([]); // 졸업 조건 리스트

  const [trigger, setTrigger] = useState(false);

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
          console.log(jsonData);
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
      let parsingData = classNumberParser(jsonData); // 파싱데이터
      console.log(parsingData);

      let student_credit = 0; // 학생 총 취득학점
      let student_gpa = 0; // 학생 평점 평균
      let english_level = ""; // 영어 레벨

      // 총 취득 학점, 평점 평균, 레벨 테스트 파싱
      jsonData.forEach((x) => {
        x.forEach((y) => {
          if (y.length > 0) {
            y.includes("총취득학점") &&
              (student_credit = y.split("총취득학점:")[1]);

            y.includes("평점평균") && (student_gpa = y.split("평점평균:")[1]);

            y.includes("레벨테스트(텝스)") &&
              (english_level = y.split("레벨테스트(텝스):")[1]);
          }
        });
      });

      // 합치는 로직
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
            student_gpa,
            student_credit,
            english_level,
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
      let course = el[0].student_course;

      if (
        enterList.length > 0 &&
        enterList.find((v) => v.year == year && v.course == course)
      ) {
        return;
      }

      enterList.push({
        year: year,
        course: course,
      });
    }

    // // 중복 제거
    // enterList = enterList.filter((element, index) => {
    //   return enterList.indexOf(element) === index;
    // });

    // 입학년도로 졸업조건 불러와서 저장
    enterList.forEach((el, index) => {
      getConditionRequest(
        `${major}`,
        `${el.year}`,
        "단일전공",
        el.course == "Y" ? "심화과정" : "일반과정"
      ).then((res) => {
        setConditionArr([
          ...conditionArr,
          { year: el.year, course: el.course, ...res.data },
        ]);
        if (enterList.length == index + 1) {
          setTrigger(true);
        }
      });
    });
  };

  useEffect(() => {
    console.log(conditionArr);
  }, [conditionArr]);

  /** 졸업조건 찾아서 졸업 판별후 api 콜 */
  const graduationSimulator = () => {
    console.log("실행중");
    let totalResult = { studentInfoList: [] };
    let defaultInfo = {
      graduation_year: graduation_year,
      graduation_semester: graduation_semester,
      student_major: major,
      student_code: "",
      student_name: "",
      student_course: "",
      student_type: "단일전공",
      student_graduation: "T",
      student_document: "P",
    }; // 학생 기본정보
    let simulation_result = []; // 조건 판별 결과

    studentInfoArr.forEach((el) => {
      // 기본정보 할당
      defaultInfo.student_code = el[0].student_code;
      defaultInfo.student_name = el[0].student_name;
      defaultInfo.student_course = el[0].student_course;

      conditionArr.forEach((condition) => {
        // 년도가 같으면 졸업 판별 시작
        if (
          el[0].student_code.substr(2, 2) == condition.year &&
          el[0].student_course == condition.course
        ) {
          condition.condition_detail.forEach((item) => {
            // 해당종류의 과목 X학점 이상
            if (item.kind_of_condition == "00") {
              let filteringIndex = el[1][0].findIndex(
                (v) => v == item.subject_information
              ); // 필터링 할  index
              let creditIndex = el[1][0].findIndex((v) => v == "학점"); // 학점 index
              let subject = item.kind_of_subject; // 과목 종류
              let sum = 0;

              el[1].forEach((value) => {
                if (value[filteringIndex] == subject) {
                  sum += Number(value[creditIndex]);
                }
              });

              if (sum >= Number(item.credit)) {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  credit: item.credit,
                  student_credit: sum,
                  required_course: null,
                  student_course: null,
                  english_level: "",
                  pass_info: "T",
                });
              } else {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  credit: item.credit,
                  student_credit: sum,
                  required_course: null,
                  student_course: null,
                  english_level: "",
                  pass_info: "F",
                });
              }
            }
            // 해당종류의 과목 X개 이상
            if (item.kind_of_condition == "01") {
              let filteringIndex = el[1][0].findIndex(
                (v) => v == item.subject_information
              ); // 필터링 할  index
              let subject = item.kind_of_subject; // 과목 종류
              let sum = 0;

              el[1].forEach((value) => {
                if (value[filteringIndex] == subject) {
                  sum += 1;
                }
              });

              if (sum >= Number(item.the_number_of)) {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  credit: item.the_number_of,
                  student_credit: sum,
                  required_course: null,
                  student_course: null,
                  english_level: "",
                  pass_info: "T",
                });
              } else {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  credit: item.the_number_of,
                  student_credit: sum,
                  required_course: null,
                  student_course: null,
                  english_level: "",
                  pass_info: "F",
                });
              }
            }
            // 과목리스트 중 X개 이상 필수
            if (item.kind_of_condition == "02") {
              let filteringIndex = el[1][0].findIndex((v) => v == "교과목명"); // 필터링 할  index
              let subjectArr = item.subject_list.split(","); // 과목 리스트
              let studentArr = [];
              let sum = 0;

              el[1].forEach((value) => {
                if (subjectArr.find(value[filteringIndex])) {
                  studentArr.push(value[filteringIndex]);
                  sum += 1;
                }
              });

              if (sum >= Number(item.the_number_of)) {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  credit: item.the_number_of,
                  student_credit: sum,
                  required_course: item.subject_list,
                  student_course: studentArr.join(),
                  english_level: "",
                  pass_info: "T",
                });
              } else {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  credit: item.the_number_of,
                  student_credit: sum,
                  required_course: item.subject_list,
                  student_course: studentArr.join(),
                  english_level: "",
                  pass_info: "F",
                });
              }
            }
            // 학점 평점
            if (item.kind_of_condition == "03") {
              if (Number(el[2]) >= Number(item.credit)) {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  credit: item.credit,
                  student_credit: Number(el[2]),
                  required_course: null,
                  student_course: null,
                  english_level: "",
                  pass_info: "T",
                });
              } else {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  credit: item.credit,
                  student_credit: Number(el[2]),
                  required_course: null,
                  student_course: null,
                  english_level: "",
                  pass_info: "F",
                });
              }
            }
            // 총 학점
            if (item.kind_of_condition == "04") {
              if (Number(el[3]) >= Number(item.credit)) {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  credit: item.credit,
                  student_credit: el[3],
                  required_course: null,
                  student_course: null,
                  english_level: "",
                  pass_info: "T",
                });
              } else {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  credit: item.credit,
                  student_credit: el[3],
                  required_course: null,
                  student_course: null,
                  english_level: "",
                  pass_info: "F",
                });
              }
            }
          });

          // 영어시뮬레이션
          console.log(condition.english_condition);
          const engIndex = condition.english_condition.findIndex(
            (v) => v.english_level == el[4]
          );
          const subjectArr =
            condition.english_condition[engIndex].list_of_subject.split(",");

          let studentEngArr = [];

          let filteringEngIndex = el[1][0].findIndex((v) => v == "교과목명"); // 필터링 할 index
          let engSum = 0;

          el[1].forEach((value) => {
            if (subjectArr.find((v) => v == value[filteringEngIndex])) {
              studentEngArr.push(value[filteringEngIndex]);
              engSum += 1;
            }
          });

          if (engSum == subjectArr.length) {
            simulation_result.push({
              kind_of_condition: "05",
              required_course:
                condition.english_condition[engIndex].list_of_subject,
              student_course: studentEngArr.join(),
              english_level: el[4],
              pass_info: "T",
            });
          } else {
            simulation_result.push({
              kind_of_condition: "05",
              required_course:
                condition.english_condition[engIndex].list_of_subject,
              student_course: studentEngArr.join(),
              english_level: el[4],
              pass_info: "F",
            });
          }

          // 시뮬후 통과 유무 저장
          simulation_result.forEach((i) => {
            if (i.pass_info == "F") {
              defaultInfo.student_graduation = "F";
            }
          });

          // 시뮬 결과 저장
          totalResult.studentInfoList.push({
            ...defaultInfo,
            condition_result: simulation_result,
          });

          console.log(totalResult);

          /**
            
          
           */
        }
      });
    });

    simulationRequest(totalResult).then((res) => {
      console.log(res);
    });
  };

  const simulationHandler = async () => {
    conditionLoader();
  };

  useEffect(() => {
    trigger && graduationSimulator();
  }, [trigger]);

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
        {studentInfoArr.map((i) => {
          return (
            <div class="flex w-[700px] h-[25px] border-b-[1px] border-l-[1px] border-black text-[12px] font-medium">
              <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                {i[0].student_code}
              </div>
              <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                {i[0].student_name}
              </div>
              <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                {i[0].student_type}
              </div>
              <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                {i[0].student_course == "Y" ? "심화과정" : "일반과정"}
              </div>
              <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black ">
                <button class="flex items-center justify-center w-[14px] h-[14px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center bg-slate-100 active:bg-slate-50">
                  +
                </button>
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
          );
        })}
      </div>
      <button
        onClick={() => simulationHandler()}
        class="ml-[420px] mb-[20px] w-[170px] h-[30px] rounded-[3px] bg-blue-500 text-[14px] text-white"
      >
        졸업 판별 시작 및 저장
      </button>
    </>
  );
};

export default StudentInfoInput;
