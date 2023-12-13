import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { getConditionRequest, simulationRequest } from "../api/api";

const StudentSimulation = () => {
  const [graduated, setGraduated] = useState(false);
  const [data, setData] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedExcelFile, setUploadedExcelFile] = useState(null);
  const [uploadedPDFFile, setUploadedPDFFile] = useState(null);

  const [department, setDepartment] = useState("");
  const [studentId, setStudentId] = useState("");
  const [type, setType] = useState("");
  const [course, setCourse] = useState("");
  const [englishLevelTest, setEnglishLevelTest] = useState("");
  const [exceptionItems, setExceptionItems] = useState([]);
  const exceptionFileInputRefs = useRef({});

  const excelFileInputRef = useRef(null);
  const pdfFileInputRef = useRef(null);

  const [simulationResult, setSimulationResult] = useState("");
  const [rerunSimulation, setRerunSimulation] = useState(false); // 추가: 시뮬레이션 다시 실행 여부 상태

  ///////////////////////

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

  const [success, setSuccess] = useState(false);

  const [simResult, setSimResult] = useState();
  ///////////////////////

  const handleSimulation = () => {
    calculateSimulationResult();
    setGraduated(true); // 시뮬레이션 시작 버튼을 누르면 graduated를 true로 설정하여 결과를 표시합니다.
  };

  const handleRerunSimulation = () => {
    setGraduated(false); // graduated 값을 false로 설정하여 시뮬레이션을 다시 시작합니다.
    setRerunSimulation(true); // rerunSimulation 값을 true로 설정하여 시뮬레이션 결과를 숨기고 버튼을 숨깁니다.
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    const newUploadedFile = { name: file.name, id: Date.now() };
    const newUploadedFiles = [...uploadedFiles, newUploadedFile];
    setUploadedFiles(newUploadedFiles);
    readExcel(file);
    setUploadedExcelFile(file);
    excelFileInputRef.current.value = null;
    console.log(file);
  };

  /** 엑셀파일 파싱 */
  const handleFileUpload = (e, type) => {
    const fileArr = e.target.files;
    let tempGradeArr = [];
    let tempClassificationArr = [];

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
          tempGradeArr.push(jsonData);
          i == fileArr.length - 1 && setGradeArr([...tempGradeArr]);
        }
        // 파일이 취득분류표인경우
        if (type == 1) {
          setDepartment("컴퓨터공학과");
          setStudentId("2012111942");
          setCourse("심화과정");
          setEnglishLevelTest("B");
          tempClassificationArr.push(jsonData);
          i == fileArr.length - 1 &&
            setClassificationArr([...tempClassificationArr]);
        }
      };
      reader.readAsArrayBuffer(fileArr[i]);
    }
  };

  /** 취득분류표에서 학수강좌번호, 성적 파싱 */
  const matchingDataParser = (jsonData) => {
    let dataArr = [];
    let x = 0; // 파싱시작 인덱스
    let t = 0; // 수강날짜 인덱스
    let y = 0; // 교과목명 인덱스

    for (let i = 0; i < jsonData.length; i++) {
      for (let j = 0; j < jsonData[i].length; j++) {
        if (jsonData[i][j] == "년학\n도기") {
          t = j;
        }
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

    const reg = /\d{4}-\./; // 정규식
    const reg2 = /\A-Z{3}\d{4}/; // 학수번호 정규식

    for (let i = x; i < jsonData.length; i++) {
      let tempArr = [];
      if (
        jsonData[i][t] &&
        !jsonData[i][t].includes(",") &&
        !jsonData[i][t].includes("교양")
      ) {
        let temp0 = jsonData[i][t].split(" ")[0];
        let temp1 = temp0.split("-");
        console.log(!isNaN(temp1[0]));
        if (
          !isNaN(temp1[0]) &&
          (!isNaN(temp1[1]) || temp1[1] == "여름" || temp1[1] == "겨울")
        ) {
          temp1[1] += "학기";
          tempArr = temp1;

          if (jsonData[i][y]) {
            let temp2 = jsonData[i][y].split(/\s+/g);

            tempArr = [...tempArr, ...temp2];
          }
          tempArr.length > 0 && dataArr.push(tempArr);
        }
      }
    }

    return dataArr;
  };

  /** 파싱한 학수강좌번호, 성적으로 비교하고 전체성적표, 취득분류표 합치기 */
  const matchingHandler = () => {
    classificationArr.forEach((jsonData, index) => {
      let parsingData = matchingDataParser(jsonData); // 파싱데이터
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

      const testGrade = (x) => {
        if (
          x == "A+" ||
          x == "A0" ||
          x == "B+" ||
          x == "B0" ||
          x == "C+" ||
          x == "C0" ||
          x == "D+" ||
          x == "D0" ||
          x == "F" ||
          x == "P"
        ) {
          return true;
        }
        return false;
      };

      // 합치는 로직
      for (const x of gradeArr) {
        let count = parsingData.length;
        parsingData.forEach((el, index) => {
          x.forEach((y) => {
            if (
              y[1] == el[0] && // 년도
              y[2] == el[1] && // 학기
              y[5] == el[2] && // 학수번호
              y[10] == el.find((o) => testGrade(o)) // 성적
            ) {
              console.log(
                y[1] +
                  "  " +
                  el[0] +
                  "  " +
                  y[2] +
                  "  " +
                  el[1] +
                  "  " +
                  y[5] +
                  "  " +
                  el[2] +
                  "  " +
                  y[10] +
                  "  " +
                  el[5] +
                  "  " +
                  index
              );

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
          setSuccess(true);
          break;
        }
      }
    });
  };

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
              let filteringIndex = el[1][0].findIndex(
                (v) => v == item.subject_information
              ); // 필터링 할  index
              let subjectArr = item.subject_list.split(","); // 과목 리스트
              let studentArr = [];
              let sum = 0;

              for (const value of el[1]) {
                for (let i = 0; i < subjectArr.length; i++) {
                  let temp = subjectArr[i].split("@");
                  for (let j = 0; j < temp.length; j++) {
                    if (temp[j] == value[filteringIndex]) {
                      sum += 1;
                      studentArr.push(value[filteringIndex]);
                      subjectArr[i] = "";
                    }
                  }
                }
              }

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
            // 과목리스트 중 X개 이상 필수(개별)
            if (item.kind_of_condition == "77") {
              let filteringIndex = el[1][0].findIndex(
                (v) => v == item.subject_information
              ); // 필터링 할  index
              let subjectArr = item.kind_of_subject
                .replace(/ /g, "")
                .split("\n"); // 과목 리스트
              let studentArr = [];
              let sum = 0;

              for (const value of el[1]) {
                for (let i = 0; i < subjectArr.length; i++) {
                  let temp = subjectArr[i].split("@");
                  for (let j = 0; j < temp.length; j++) {
                    if (temp[j] == value[filteringIndex]) {
                      sum += 1;
                      studentArr.push(value[filteringIndex]);
                      subjectArr[i] = "";
                    }
                  }
                }
              }

              if (sum >= Number(item.credit)) {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  credit: item.credit,
                  student_credit: sum,
                  required_course: item.kind_of_subject.replace(/ /g, ""),
                  student_course: studentArr.join(),
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
                  required_course: item.kind_of_subject.replace(/ /g, ""),
                  student_course: studentArr.join(),
                  english_level: "",
                  pass_info: "F",
                });
              }
            }
            // 학점 평점
            if (item.kind_of_condition == "03") {
              if (Number(el[2]) >= Number(item.grade)) {
                simulation_result.push({
                  subject_information: item.subject_information,
                  kind_of_condition: item.kind_of_condition,
                  kind_of_subject: item.kind_of_subject,
                  gpa: item.grade,
                  student_gpa: Number(el[2]),
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
                  gpa: item.grade,
                  student_gpa: Number(el[2]),
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

          for (const value of el[1]) {
            for (let i = 0; i < subjectArr.length; i++) {
              let temp = subjectArr[i].split("@");
              for (let j = 0; j < temp.length; j++) {
                if (temp[j] == value[filteringEngIndex]) {
                  engSum += 1;
                  studentEngArr.push(value[filteringEngIndex]);
                  subjectArr[i] = "";
                }
              }
            }
          }

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
          setSimResult([...totalResult.studentInfoList[0].condition_result]);
          /**
            
          
           */
        }
      });
    });

    // simulationRequest(totalResult).then((res) => {
    //   if (res.data == "저장 완료") {
    //     alert("저장되었습니다!");
    //     return;
    //   }
    //   alert("실패하였습니다.");
    // });
  };

  const handlePDFUpload = (e) => {
    const file = e.target.files[0];
    const newUploadedFile = { name: file.name, id: Date.now() };
    setUploadedFiles((prevFiles) => [...prevFiles, newUploadedFile]);
    setUploadedPDFFile(file);
    pdfFileInputRef.current.value = null;
  };

  const handleFileDelete = (fileId) => {
    const updatedFiles = uploadedFiles.filter((file) => file.id !== fileId);
    setUploadedFiles(updatedFiles);

    if (uploadedExcelFile && uploadedExcelFile.id === fileId) {
      setUploadedExcelFile(null);
    }

    if (uploadedPDFFile && uploadedPDFFile.id === fileId) {
      setUploadedPDFFile(null);
    }
  };

  const handleExceptionTypeChange = (e, itemId) => {
    const updatedItems = exceptionItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, type: e.target.value };
      }
      return item;
    });
    setExceptionItems(updatedItems);
  };

  const handleExceptionFileUpload = (e, itemId) => {
    const file = e.target.files[0];
    const updatedItems = exceptionItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, file: file, fileName: file.name };
      }
      return item;
    });
    setExceptionItems(updatedItems);
    exceptionFileInputRefs.current[itemId].value = null;
  };

  const handleAddException = () => {
    const newExceptionItem = {
      id: Date.now(),
      type: "",
      file: null,
      fileName: "",
    };
    setExceptionItems((prevItems) => [...prevItems, newExceptionItem]);
  };

  const handleRemoveException = (itemId) => {
    setExceptionItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  const inputStyle = {
    marginRight: "8px",
  };

  const selectBoxStyle = {
    ...inputStyle,
    fontWeight: "normal",
  };

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
      const excelData = XLSX.utils.sheet_to_json(rawData);
      setData(excelData);

      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // 첫 번째 시트 가져오기
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // 셀 데이터 파싱하여 출력
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setGradeArr([[...jsonData]]);
    };
  };

  const calculateSimulationResult = () => {
    const totalCredits = data.reduce((total, item) => {
      if (item.학점 !== "" && !isNaN(parseFloat(item.학점))) {
        return total + parseFloat(item.학점);
      }
      return total;
    }, 0);

    let requiredTotalCredits;
    let requiredMajorCredits;

    if (course === "심화과정") {
      requiredTotalCredits = 140.0;
      requiredMajorCredits = 84.0;
    } else if (course === "일반과정") {
      requiredTotalCredits = 130.0;
      requiredMajorCredits = 72.0;
    }

    if (totalCredits < requiredTotalCredits) {
      setSimulationResult(
        <div style={{ color: "red" }}>
          전체학점의 총 합이 {totalCredits}점이라, {requiredTotalCredits}점을
          충족하지 못합니다.
          <br />
        </div>
      );
    } else {
      setSimulationResult(
        <div style={{ color: "green" }}>
          전체학점의 총 합이 {requiredTotalCredits}점을 충족합니다.
          <br />
        </div>
      );
    }

    // "공학 요소" 열의 내용이 "전공"인 학점의 합 계산
    const majorCredits = data.reduce((total, item) => {
      if (
        item.공학요소 === "전공" &&
        item.학점 !== "" &&
        !isNaN(parseFloat(item.학점))
      ) {
        return total + parseFloat(item.학점);
      }
      return total;
    }, 0);

    if (majorCredits < 84.0) {
      // "공학 요소" 열의 내용이 "전공"인 학점의 합이 84점 미만인 경우 메세지를 설정합니다.
      setSimulationResult((prevResult) => (
        <>
          {prevResult}
          <br />
          <span style={{ color: "red" }}>
            전공 학점의 총 합이 {majorCredits}점이라, {requiredMajorCredits}점을
            충족하지 못합니다.
          </span>
          <br />
        </>
      ));
    } else {
      setSimulationResult((prevResult) => (
        <>
          {prevResult}
          <br />
          <span style={{ color: "green" }}>
            {" "}
            전공학점의 총 합이 {requiredMajorCredits}점을 충족합니다.
          </span>
          <br />
        </>
      ));
    }

    const coursesToCheck = [
      "계산적사고법",
      "미적분학및연습1",
      "공학선형대수학",
      "어드벤쳐디자인",
      "이산수학",
      "자료구조와실습",
      "확률및통계학",
      "컴퓨터구성",
      "시스템소프트웨어와실습",
      "공개SW프로젝트",
      "개별연구",
      "컴퓨터공학종합설계1",
      "컴퓨터공학종합설계2",
    ];

    const missingCourses = coursesToCheck.filter(
      (course) => !data.some((item) => item.교과목명 === course)
    );

    if (missingCourses.length > 0) {
      setSimulationResult((prevResult) => (
        <>
          {prevResult}
          <br />
          <span style={{ color: "red" }}>
            필수 교과목 중 ({missingCourses.join(", ")})
          </span>
          <br />
          <span style={{ color: "red" }}>을 이수하지 않았습니다.</span>
          <br />
        </>
      ));
    }

    const englishCourseCount = data.reduce((count, item) => {
      if (item.원어강의종류 === "영어") {
        return count + 1;
      }
      return count;
    }, 0);

    setSimulationResult((prevResult) => (
      <>
        {prevResult}
        <br />
        <span style={{ color: "red" }}>
          수강한 원어강의는 {englishCourseCount}개 입니다.
        </span>
        {englishCourseCount < 4 ? (
          <span style={{ color: "red" }}>원어강의는 4개를 수강해야합니다.</span>
        ) : null}
      </>
    ));
  };

  // 선이수 과목( 필수과목 ), 영어 레벨에 따라 EAS 처리, 시뮬레이션 버튼 사라지지않게 계속 유지
  // 유형과 과정에 따라서 판단 기준 다르게, 학과, 학번 , 유형, 과정, 영어 레벨 테스트 미입력시 시뮬 안돌림

  /** 매칭, 시뮬레이션 시작 및 결과 표현*/
  const simulator = () => {
    matchingHandler();
  };

  useEffect(() => {
    if (success) {
      simulationHandler();
    }
  }, [success]);

  const simulationHandler = async () => {
    conditionLoader();
  };

  useEffect(() => {
    console.log(gradeArr);
  }, [gradeArr]);

  useEffect(() => {
    trigger && graduationSimulator();
  }, [trigger]);

  return (
    <div className="bg-white h-screen">
      <div className="container mx-auto h-screen">
        <div className="text-blue-500 flex flex-col items-start space-y-4 ml-4">
          <div className="mb-2"></div>
          <h1 className="text-2xl font-semibold text-black mb-2">
            졸업 판별 시뮬레이션
          </h1>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="file"
                style={{ display: "none" }}
                accept=".xlsx, .xls, .csv"
                onChange={handleExcelUpload}
                ref={excelFileInputRef}
              />
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-600 transition duration-200"
                onClick={() => excelFileInputRef.current.click()}
              >
                전체 성적표 업로드
              </button>
            </label>

            <label className="flex items-center">
              <input
                type="file"
                style={{ display: "none" }}
                accept=".xlsx, .xls"
                onChange={(e) => handleFileUpload(e, 1)}
                ref={pdfFileInputRef}
              />
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-600 transition duration-200"
                onClick={() => pdfFileInputRef.current.click()}
              >
                취득 분류표 업로드
              </button>
            </label>
          </div>
          <div className="mb-4"></div>
          <div className="flex items-center space-x-1 text-black">
            <label className="flex items-center font-bold">
              <span className="mr-2">학과:</span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-white border border-gray-400 px-4 py-2 rounded-lg"
                style={selectBoxStyle}
              >
                <option value="">학과 선택</option>
                <option value="컴퓨터공학과">컴퓨터공학과</option>
              </select>
            </label>
            <label className="flex items-center font-bold">
              <span className="mr-2">학번:</span>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="bg-white border border-gray-400 px-4 py-2 rounded-lg"
                style={{ width: "130px", ...inputStyle }}
              />
            </label>
            <label className="flex items-center font-bold">
              <span className="mr-2">과정:</span>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="bg-white border border-gray-400 px-4 py-2 rounded-lg"
                style={selectBoxStyle}
              >
                <option value="">과정 선택</option>
                <option value="심화과정">심화과정</option>
                <option value="일반과정">일반과정</option>
                {/* 다른 과정 옵션 추가 */}
              </select>
            </label>
            <label className="flex items-center font-bold">
              <span className="mr-2">영어 레벨테스트:</span>
              <input
                type="text"
                value={englishLevelTest}
                onChange={(e) => setEnglishLevelTest(e.target.value)}
                className="bg-white border border-gray-400 px-4 py-2 rounded-lg"
                style={{ width: "100px", ...inputStyle }}
              />
            </label>
            <div className="mb-4"></div>
          </div>
          <br />
          <br />
          {/* {uploadedFiles.length > 0 ? (
            <div className="mt-4">
              <h2 className="font-bold text-lg mb-2 text-black">파일 목록</h2>
              <p className="mb-2 text-black">업로드된 파일: </p>
              <ul>
                {uploadedFiles.map((file) => (
                  <li key={file.id} className="flex items-center">
                    <span>{file.name}</span>
                    <button
                      className="ml-2 text-red-500"
                      onClick={() => handleFileDelete(file.id)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4">
              <p className="mb-2 text-black">업로드된 파일이 없습니다.</p>
            </div>
          )} */}
        </div>
        {data.length > 0 && (
          <div>
            <div
              className="table-container"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <table className="border">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">년도</th>
                    <th className="border px-4 py-2">학기</th>
                    <th className="border px-4 py-2">이수구분</th>
                    <th className="border px-4 py-2 w-[100px]">
                      이수구분
                      <br />
                      영역
                    </th>
                    <th className="border px-4 py-2">
                      학수강좌
                      <br />
                      번호
                    </th>
                    <th className="border px-4 py-2">교과목명</th>
                    <th className="border px-4 py-2 w-[80px]">
                      담당
                      <br />
                      교원
                    </th>
                    <th className="border px-4 py-2">학점</th>
                    <th className="border px-4 py-2">등급</th>
                    <th className="border px-4 py-2">공학인증</th>
                    <th className="border px-4 py-2">삭제구분</th>
                    <th className="border px-4 py-2">공학요소</th>
                    <th className="border px-4 py-2 w-[100px]">
                      공학세부
                      <br />
                      요소
                    </th>
                    <th className="border px-4 py-2">
                      원어강의
                      <br />
                      종류
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(
                    (item, index) =>
                      item.학점 !== "" && (
                        <tr key={index} className="h-[65px]">
                          <td className="border px-4 py-2">
                            {item.년도 ? (
                              item.년도
                            ) : (
                              <input className="w-[40px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.학기 ? (
                              item.학기
                            ) : (
                              <input className="w-[40px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.이수구분 ? (
                              item.이수구분
                            ) : (
                              <input className="w-[40px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.이수구분영역 ? (
                              item.이수구분영역
                            ) : (
                              <input className="w-[40px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.학수강좌번호 ? (
                              item.학수강좌번호
                            ) : (
                              <input className="w-[80px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.교과목명 ? (
                              item.교과목명
                            ) : (
                              <input className="w-[380px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.담당교원 ? (
                              item.담당교원
                            ) : (
                              <input className="w-[50px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.학점 ? (
                              item.학점
                            ) : (
                              <input className="w-[40px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.등급 ? (
                              item.등급
                            ) : (
                              <input className="w-[40px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.공학인증 ? (
                              item.공학인증
                            ) : (
                              <input className="w-[40px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.삭제구분 ? (
                              item.삭제구분
                            ) : (
                              <input className="w-[40px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.공학요소 ? (
                              item.공학요소
                            ) : (
                              <input className="w-[40px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.공학세부요소 ? (
                              item.공학세부요소
                            ) : (
                              <input className="w-[40px]" />
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {item.원어강의종류 ? (
                              item.원어강의종류
                            ) : (
                              <input className="w-[40px]" />
                            )}
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setData([...data, ""])}
              className="w-[100%] mr-[20px] h-[20px] border-[1px] rounded-[3px] flex items-center justify-center bg-gray-200 active:bg-gray-100"
            >
              +
            </button>
          </div>
        )}

        <div class="my-[10px] text-[12px] text-green-400 mt-[25px]">
          {simResult &&
            simResult.map((v, index) => {
              return (
                <div class={v.pass_info == "T" ? "" : "text-red-400"}>
                  {v.pass_info == "T" ? "(통과) " : "(실패) "}
                  {`${index + 1} `}.
                  {v.kind_of_condition == "00" &&
                    `${v.kind_of_subject}과목은 ${v.credit}학점 이상 이수한다. (${v.student_credit}/${v.credit})`}
                  {v.kind_of_condition == "01" &&
                    `${v.kind_of_subject}과목은 ${v.credit}개 이상 이수한다 (${v.student_credit}/${v.credit})`}
                  {v.kind_of_condition == "02" &&
                    `다음 과목 중 ${
                      v.credit
                    }과목 이상 이수한다. / ${v.required_course.replace(
                      "@",
                      " 또는 "
                    )} / (이수한 과목: ${v.student_course})`}
                  {v.kind_of_condition == "03" &&
                    `졸업학점 평점은 ${v.gpa} 이상이어야 한다. (${v.student_gpa}/${v.gpa})`}
                  {v.kind_of_condition == "04" &&
                    `전체학점은 ${v.credit}학점 이상 이수한다. (${v.student_credit}/${v.credit})`}
                  {v.kind_of_condition == "05" &&
                    `영어 과목은 다음 과목을 모두 이수한다. / ${v.required_course} /(이수한 과목: ${v.student_course})`}
                  {v.kind_of_condition == "77" &&
                    `다음 과목 중 ${
                      v.credit
                    }과목 이상 이수한다. / ${v.required_course.replace(
                      /\n/g,
                      ","
                    )} / (이수한 과목: ${v.student_course})`}
                </div>
              );
            })}
        </div>

        <div className="mb-4"></div>
        {graduated ? (
          <div className="mt-4 text-center">
            <h2 className="font-bold text-lg mb-2 text-black">
              시뮬레이션 결과
            </h2>
            <div className="text-black">{simulationResult}</div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-600 transition duration-200 mt-4"
              onClick={handleRerunSimulation} // 다시 시뮬레이션 버튼을 표시하고 결과를 숨깁니다.
            >
              결과 초기화
            </button>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-600 transition duration-200"
              onClick={simulator}
            >
              시뮬레이션 시작
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSimulation;
