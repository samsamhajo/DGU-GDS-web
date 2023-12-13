import React, { useEffect, useState } from "react";
import { getConditionRequest, inputConditionRequest } from "../api/api";

import {
  SelectBoxCategory,
  SelectBoxCondition,
  SelectBoxCourse,
  SelectBoxDepartment,
} from "../components";
import { cancel } from "../assets";
import { useNavigate } from "react-router-dom";

const Condition = () => {
  const [conditionDetailList, setConditionDetailList] = useState({
    condition_detail: [
      // {
      //   subject_information: "공학요소",
      //   kind_of_condition: "00",
      //   kind_of_subject: "전공",
      //   credit: 84,
      //   subject_list: null,
      //   the_number_of: 0,
      //   grade: 0.0,
      // },
      // {
      //   subject_information: "공학요소",
      //   kind_of_condition: "03",
      //   kind_of_subject: "설계과목",
      //   credit: 0,
      //   subject_list: null,
      //   the_number_of: 2,
      //   grade: 0.0,
      // },
      // {
      //   subject_information: null,
      //   kind_of_condition: "04",
      //   kind_of_subject: null,
      //   credit: 140,
      //   subject_list: null,
      //   the_number_of: 0,
      //   grade: 0.0,
      // },
      // {
      //   subject_information: null,
      //   kind_of_condition: "05",
      //   kind_of_subject: null,
      //   credit: 0,
      //   subject_list: null,
      //   the_number_of: 0,
      //   grade: 2.0,
      // },
      // {
      //   subject_information: "필수과목",
      //   kind_of_condition: "07",
      //   kind_of_subject: "전공",
      //   credit: 0,
      //   subject_list: null,
      //   the_number_of: 0,
      //   grade: 0.0,
      // },
    ],
    english_condition: [
      // {
      //   english_level: "S1",
      //   subject_list: "EAS1,EAS2",
      // },
      // {
      //   english_level: "S4",
      //   subject_list: "BasicEAS,EAS1,EAS2",
      // },
    ],
  });

  const [department, setDepartment] = useState(""); //학과
  const [classOf, setClassOf] = useState(""); //학번
  const [category, setCategory] = useState(""); //유형
  const [course, setCourse] = useState(""); //전공

  const [averageGrade, setAverageGrade] = useState(0); //졸업학점평점
  const [totalGrade, setTotalGrade] = useState(""); //졸업 학점

  const navigate = useNavigate();

  /** 졸업 조건 조회 후 세팅하는 함수 */
  const conditionDetailListSetting = (
    department,
    classOf,
    category,
    course
  ) => {
    getConditionRequest(department, classOf, category, course).then((res) => {
      console.log(res.data);
      let temp = conditionDetailList;
      let condition = res.data.condition_detail;
      let english = res.data.english_condition;

      if (res.data) {
        temp.condition_detail = condition;
        temp.english_condition = english;

        temp.english_condition = res.data.english_condition;
        setTotalGrade(temp.condition_detail.pop().credit);
        setAverageGrade(temp.condition_detail.pop().grade);
        setConditionDetailList(temp);
        return;
      }

      alert("해당하는 졸업조건이 없습니다.");
    });
  };

  /** 기본 조건 추가 함수 */
  const addDefaultCondition = () => {
    let temp = conditionDetailList;
    let length = temp.condition_detail.length;
    temp.condition_detail[length] = {
      subject_information: "",
      kind_of_condition: "",
      kind_of_subject: "",
      credit: "",
      subject_list: "",
      the_number_of: "",
      grade: "",
    };
    console.log(temp);
    setConditionDetailList({ ...temp });
  };

  useEffect(() => {
    console.log(conditionDetailList);
  }, [conditionDetailList]);

  /** 해당 졸업 조건 삭제 함수 */
  const deleteCondition = (num) => {
    let temp = conditionDetailList;
    temp.condition_detail.splice(num, 1);
    setConditionDetailList({ ...temp });
  };

  /** 과목 정보 편집 함수 */
  const subjectInfoHandler = (num, value) => {
    let temp = conditionDetailList;
    temp.condition_detail[num].subject_information = value;

    setConditionDetailList({ ...temp });
  };

  /** 과목 종류 편집 함수 */
  const kindOfSubjectHandler = (num, value) => {
    let temp = conditionDetailList;
    temp.condition_detail[num].kind_of_subject = value;

    setConditionDetailList({ ...temp });
  };

  /** 학점 편집 함수 */
  const creditHandler = (num, value) => {
    let temp = conditionDetailList;
    temp.condition_detail[num].credit = value;

    setConditionDetailList({ ...temp });
  };

  /** 개수 편집 함수 */
  const theNumberOfHandelr = (num, value) => {
    let temp = conditionDetailList;
    temp.condition_detail[num].the_number_of = value;

    setConditionDetailList({ ...temp });
  };

  /** 과목 리스트 추가 함수 */
  const addListOfSubject = (key, num, e) => {
    if (key == "Enter") {
      let temp = conditionDetailList;
      let listOfSubject = temp.condition_detail[num].subject_list;

      console.log(listOfSubject);
      listOfSubject
        ? (listOfSubject += `,${e.target.value}`)
        : (listOfSubject = e.target.value);
      temp.condition_detail[num].subject_list = listOfSubject;

      e.target.value = "";

      setConditionDetailList({ ...temp });
    }
  };

  /** 과목 리스트 삭제 함수 */
  const deleteListOfSubject = (tIndex, bIndex) => {
    let temp = conditionDetailList;
    let listOfSubject = temp.condition_detail[tIndex].subject_list;

    listOfSubject = listOfSubject.split(",");
    listOfSubject.splice(bIndex, 1);
    listOfSubject = listOfSubject.join();

    temp.condition_detail[tIndex].subject_list = listOfSubject;

    setConditionDetailList({ ...temp });
  };

  /** 과목 리스트 1개일 경우 삭제 함수 */
  const deleteListOfSubjectFirst = (tIndex) => {
    let temp = conditionDetailList;
    temp.condition_detail[tIndex].subject_list = "";

    setConditionDetailList({ ...temp });
  };

  /** 졸업 조건 정리해서 졸업 조건 입력api요청 **/
  const inputConditionHandler = async () => {
    let temp = conditionDetailList;
    let length = temp.condition_detail.length;

    temp.condition_detail[length] = {
      subject_information: "",
      kind_of_condition: "03",
      kind_of_subject: "",
      credit: "",
      subject_list: "",
      the_number_of: "",
      grade: Number(averageGrade),
    };
    temp.condition_detail[length + 1] = {
      subject_information: "",
      kind_of_condition: "04",
      kind_of_subject: "",
      credit: Number(totalGrade),
      subject_list: "",
      the_number_of: "",
      grade: "",
    };

    let body = {
      major: department,
      student_number: classOf,
      type: category,
      course: course,
      condition_detail: temp.condition_detail,
      english_condition: temp.english_condition,
    };
    console.log(body);

    inputConditionRequest(body).then((res) => {
      console.log(res);
      if (res.data == "저장 완료") {
        alert("저장 완료 되었습니다.");
      }
    });
  };

  /** 영어 기본 조건 추가 함수 */
  const addEnglishCondition = () => {
    let temp = conditionDetailList;
    let length = temp.english_condition.length;
    temp.english_condition[length] = {
      english_level: "",
      list_of_subject: "",
    };
    setConditionDetailList({ ...temp });
  };

  /** 영어 조건 삭제 함수 */
  const deleteEnglishCondition = (num) => {
    let temp = conditionDetailList;
    temp.english_condition.splice(num, 1);

    setConditionDetailList({ ...temp });
  };

  /** 영어 레벨 편집 함수 */
  const englishLevelHandler = (num, value) => {
    let temp = conditionDetailList;
    temp.english_condition[num].english_level = value;

    setConditionDetailList({ ...temp });
  };

  /** 영어 과목리스트 추가 함수 */
  const addEnglishList = (key, num, e) => {
    if (key == "Enter") {
      let temp = conditionDetailList;
      let listOfSubject = temp.english_condition[num].list_of_subject;

      listOfSubject
        ? (listOfSubject += `,${e.target.value}`)
        : (listOfSubject = e.target.value);
      temp.english_condition[num].list_of_subject = listOfSubject;
      e.target.value = "";

      setConditionDetailList({ ...temp });
    }
  };

  /** 영어과목리스트 삭제 함수 */
  const deleteEnglishList = (tIndex, bIndex) => {
    let temp = conditionDetailList;
    let listOfSubject = temp.english_condition[tIndex].list_of_subject;

    listOfSubject = listOfSubject.split(",");
    listOfSubject.splice(bIndex, 1);
    listOfSubject = listOfSubject.join();

    temp.english_condition[tIndex].list_of_subject = listOfSubject;

    setConditionDetailList({ ...temp });
  };

  /** 과목 리스트 1개일 경우 삭제 함수 */
  const deleteEnglishListFirst = (tIndex) => {
    let temp = conditionDetailList;
    temp.english_condition[tIndex].list_of_subject = "";

    setConditionDetailList({ ...temp });
  };

  /** 정규식 , 있는지 유무 테스트 위해 */
  const reg = /,/;

  /** 변경된 과목 input추가*/
  const addSubejctInput = (index1, index2) => {
    let temp1 = conditionDetailList;
    let temp2 = temp1.condition_detail[index1].subject_list.split(",");

    temp2[index2] += "@";
    temp1.condition_detail[index1].subject_list = temp2.join();
    setConditionDetailList({ ...temp1 });
  };

  /** 변경된 과목 등록 */
  const addSubejct = (index1, index2, index3, value) => {
    let temp1 = conditionDetailList;
    let temp2 = temp1.condition_detail[index1].subject_list.split(",");
    let temp3 = temp2[index2].split("@");

    temp3[index3] = value;
    temp2[index2] = temp3.join("@");
    temp1.condition_detail[index1].subject_list = temp2.join();

    setConditionDetailList({ ...temp1 });
  };

  /** 과목리스트에서 변경과목 삭제 */
  const removeAddtionalSubject = (index1, index2, index3) => {
    let temp1 = conditionDetailList;
    let temp2 = temp1.condition_detail[index1].subject_list.split(",");
    let temp3 = temp2[index2].split("@");

    temp3.splice(index3, 1);
    temp2[index2] = temp3.join("@");

    // 값이 있는경우
    if (temp2[index2]) {
      temp1.condition_detail[index1].subject_list = temp2.join();
    }
    // 첫번째 값 삭제하여 값이 없는경우
    if (temp2[index2] == "") {
      temp2.splice(index2, 1);
      temp1.condition_detail[index1].subject_list = temp2.join();
    }

    setConditionDetailList({ ...temp1 });
  };

  /** 로그인 안하면 접근 불가 */
  useEffect(() => {
    const isLogin = sessionStorage.getItem("login");
    if (isLogin) {
      return;
    } else {
      navigate("/");
    }
  }, []);

  return (
    <>
      <h2 className="mb-[50px] text-2xl font-medium">졸업 조건 페이지</h2>
      <div className="mb-[50px] flex gap-[20px] items-center">
        <div>학과</div>
        <input
          onChange={(e) => setDepartment(e.target.value)}
          className="flex pl-[3px] w-[180px] h-[26px] border-[1px] rounded-[3px] font-medium text-[12px]"
        />
        <div>학번</div>
        <input
          onChange={(e) => setClassOf(e.target.value)}
          className="flex items-center text-center w-[54px] h-[26px] border-[1px] rounded-[3px] font-medium text-[12px]"
        />
        <div>유형</div>
        <SelectBoxCategory setCategory={setCategory} />
        <div>과정</div>
        <SelectBoxCourse setCourse={setCourse} />
        <button
          onClick={() =>
            conditionDetailListSetting(department, classOf, category, course)
          }
          className="text-center w-[50px] h-[24px] border-[1px] rounded-[3px] text-[14px] bg-gray-200 active:bg-gray-100 border-gray-300"
        >
          조회
        </button>
      </div>
      <div className="mb-[10px] pl-[40px] flex items-center text-[16px] font-bold">
        <div className="mr-[151px]">과목 정보</div>
        <div>조건 종류</div>
      </div>
      {conditionDetailList.condition_detail.map((i, j) => {
        return (
          <div key={`as3bjt${j}`} className="mb-[20px] flex relative">
            <button
              onClick={() => deleteCondition(j)}
              className="mt-[6px] mr-[20px] w-[20px] h-[20px] border-[1px] rounded-[3px] flex items-center justify-center bg-gray-200 active:bg-gray-100"
            >
              -
            </button>
            <input
              value={i.subject_information}
              onChange={(e) => subjectInfoHandler(j, e.target.value)}
              className="mr-[40px] px-[10px] w-[170px] h-[32px] border-[1px] rounded-[3px]"
            />
            <SelectBoxCondition
              num={j}
              kind={i.kind_of_condition}
              conditionDetailList={conditionDetailList}
              setConditionDetailList={setConditionDetailList}
            />
            {i.kind_of_condition == "00" && (
              <>
                <div className="mr-[15px] pt-[3px] text-[16px] font-bold">
                  과목 종류
                </div>
                <input
                  value={i.kind_of_subject}
                  onChange={(e) => kindOfSubjectHandler(j, e.target.value)}
                  className="mr-[15px] w-[70px] h-[32px] border-[1px] rounded-[3px] text-center"
                />
                <div className="mr-[15px] pt-[3px] text-[16px] font-bold">
                  학점
                </div>
                <input
                  value={i.credit}
                  onChange={(e) => creditHandler(j, e.target.value)}
                  className="mr-[15px] w-[70px] h-[32px] border-[1px] rounded-[3px] text-center"
                />
              </>
            )}
            {i.kind_of_condition == "01" && (
              <>
                <div className="mr-[15px] pt-[3px] text-[16px] font-bold">
                  과목 종류
                </div>
                <input
                  value={i.kind_of_subject}
                  onChange={(e) => kindOfSubjectHandler(j, e.target.value)}
                  className="mr-[15px] w-[70px] h-[32px] border-[1px] rounded-[3px] text-center"
                />

                <div className="mr-[15px] pt-[3px] text-[16px] font-bold">
                  개수
                </div>
                <input
                  value={i.the_number_of}
                  onChange={(e) => theNumberOfHandelr(j, e.target.value)}
                  className="mr-[15px] w-[70px] h-[32px] border-[1px] rounded-[3px] text-center"
                />
              </>
            )}
            {i.kind_of_condition == "02" && (
              <>
                <div className="mr-[15px] pt-[3px] text-[16px] font-bold">
                  과목 리스트
                </div>
                <div>
                  <input
                    onKeyUp={(e) =>
                      e.target.value && addListOfSubject(e.key, j, e)
                    }
                    className="mr-[15px]  w-[180px] h-[32px] border-[1px] rounded-[3px] px-[5px]"
                  />
                  {i.subject_list && reg.test(i.subject_list)
                    ? i.subject_list.split(",").map((x, y) => {
                        return (
                          <div className="flex gap-[3px] items-center">
                            {x.split("@") &&
                              x.split("@").map((q, w) => {
                                return (
                                  <div className="mt-[10px] mr-[10px] flex items-center justify-between min-w-[180px] h-[32px] pl-[5px] pr-[5px] border-gray-200 border-[1px] box-border rounded-[3px]">
                                    <input
                                      defaultValue={q}
                                      onChange={(e) =>
                                        addSubejct(j, y, w, e.target.value)
                                      }
                                      className="outline-none"
                                    />

                                    <div
                                      onClick={() =>
                                        removeAddtionalSubject(j, y, w)
                                      }
                                    >
                                      <img
                                        src={cancel}
                                        width={18}
                                        height={18}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            <button
                              onClick={() => addSubejctInput(j, y)}
                              className="mt-[10px] w-[20px] h-[20px] border-[1px] rounded-[3px] flex items-center justify-center bg-gray-200 active:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        );
                      })
                    : i.subject_list && (
                        <div className="flex gap-[3px] items-center">
                          {i.subject_list.split("@") &&
                            i.subject_list.split("@").map((q, w) => {
                              return (
                                <div className="mt-[10px] mr-[10px] flex items-center justify-between min-w-[180px] h-[32px] pl-[5px] pr-[5px] border-gray-200 border-[1px] box-border rounded-[3px]">
                                  <input
                                    defaultValue={q}
                                    onChange={(e) =>
                                      addSubejct(j, 0, w, e.target.value)
                                    }
                                    className="outline-none"
                                  />

                                  <div
                                    onClick={() =>
                                      removeAddtionalSubject(j, 0, w)
                                    }
                                  >
                                    <img src={cancel} width={18} height={18} />
                                  </div>
                                </div>
                              );
                            })}
                          <button
                            onClick={() => addSubejctInput(j, 0)}
                            className="mt-[10px] w-[20px] h-[20px] border-[1px] rounded-[3px] flex items-center justify-center bg-gray-200 active:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      )}
                </div>
                <div className="absolute flex items-center left-[780px]">
                  <div className="mr-[15px] text-[16px] font-bold">개수</div>
                  <input
                    value={i.the_number_of}
                    onChange={(e) => theNumberOfHandelr(j, e.target.value)}
                    className="mr-[15px] w-[70px] h-[32px] border-[1px] rounded-[3px] text-center"
                  />
                </div>
              </>
            )}
            {i.kind_of_condition == "77" && (
              <>
                <div className="mr-[15px] pt-[3px] text-[16px] font-bold">
                  과목 리스트
                </div>
                <textarea
                  value={i.kind_of_subject}
                  onChange={(e) => kindOfSubjectHandler(j, e.target.value)}
                  className="mr-[15px] w-[200px] h-[200px] border-[1px] rounded-[3px] text-center"
                />
                <div className="mr-[15px] pt-[3px] text-[16px] font-bold">
                  개수
                </div>
                <input
                  value={i.credit}
                  onChange={(e) => creditHandler(j, e.target.value)}
                  className="mr-[15px] w-[70px] h-[32px] border-[1px] rounded-[3px] text-center"
                />
              </>
            )}
          </div>
        );
      })}
      <button
        onClick={() => addDefaultCondition()}
        className="mr-[20px] w-[20px] h-[20px] border-[1px] rounded-[3px] flex items-center justify-center bg-gray-200 active:bg-gray-100"
      >
        +
      </button>
      <div className="mb-[20px] flex items-center justify-end">
        <div className="mr-[15px]">졸업 학점 평점</div>
        <input
          value={averageGrade}
          onChange={(e) => setAverageGrade(e.target.value)}
          className="flex items-center text-center w-[54px] border-[1px] rounded-[3px]"
        />
      </div>
      <div className="mb-[20px] flex items-center justify-end">
        <div className="mr-[15px]">졸업 학점</div>
        <input
          value={totalGrade}
          onChange={(e) => setTotalGrade(e.target.value)}
          className="flex items-center text-center w-[54px] border-[1px] rounded-[3px]"
        />
      </div>
      <div className=" border-b-[1px] mb-[15px]" />
      <div className="mb-[10px] pl-[40px] flex items-center text-[16px] font-bold">
        <div className="mr-[151px]">영어 레벨 테스트</div>
      </div>
      {conditionDetailList.english_condition.map((i, index) => {
        return (
          <div key={`asbiujt${index}`} className="mb-[20px] flex">
            <button
              onClick={() => deleteEnglishCondition(index)}
              className="mt-[6px] mr-[20px] w-[20px] h-[20px] border-[1px] rounded-[3px] flex items-center justify-center bg-gray-200 active:bg-gray-100"
            >
              -
            </button>
            <input
              value={i.english_level}
              onChange={(e) => englishLevelHandler(index, e.target.value)}
              className="mr-[40px] px-[10px] w-[170px] h-[32px] border-[1px] rounded-[3px]"
            />
            <div className="mr-[15px] pt-[3px] text-[16px] font-bold">
              과목 리스트
            </div>
            <div>
              <input
                onKeyUp={(e) =>
                  e.target.value && addEnglishList(e.key, index, e)
                }
                className="mr-[15px] mb-[5px] w-[180px] h-[32px] border-[1px] rounded-[3px] px-[5px]"
              />
              {i.list_of_subject && reg.test(i.list_of_subject)
                ? i.list_of_subject.split(",").map((x, y) => {
                    return (
                      <div className="mb-[3px] flex items-center justify-between min-w-[180px] h-[32px] pl-[5px] pr-[5px] bg-gray-200 rounded-[3px]">
                        {x}
                        <div onClick={() => deleteEnglishList(index, y)}>
                          {" "}
                          <img src={cancel} width={18} height={18} />
                        </div>
                      </div>
                    );
                  })
                : i.list_of_subject && (
                    <div className="mb-[3px] flex items-center justify-between min-w-[180px] h-[32px] pl-[5px] pr-[5px] bg-gray-200 rounded-[3px]">
                      {i.list_of_subject}
                      <div onClick={() => deleteEnglishListFirst(index)}>
                        {" "}
                        <img src={cancel} width={18} height={18} />
                      </div>
                    </div>
                  )}
            </div>
          </div>
        );
      })}

      <button
        onClick={() => addEnglishCondition()}
        className="mr-[20px] w-[20px] h-[20px] border-[1px] rounded-[3px] flex items-center justify-center bg-gray-200 active:bg-gray-100"
      >
        +
      </button>

      <button
        onClick={() => inputConditionHandler()}
        className="mx-auto block text-center w-[80px] h-[24px] border-[1px] rounded-[3px] text-[14px] bg-gray-200 border-gray-300 active:bg-gray-100 "
      >
        전체 저장
      </button>
    </>
  );
};

export default Condition;
