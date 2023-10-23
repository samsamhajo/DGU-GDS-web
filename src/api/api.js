import axios from "axios";

// axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_KEY;
axios.defaults.baseURL = "http://Test1-env.eba-6kqxe2es.ap-northeast-2.elasticbeanstalk.com"

/** 졸업 조건 api */
export const getConditionRequest = async (department, classOf, category, course) => {
  try {
    const res = await axios({
      method: "GET",
      url: `/getCondition/${department}/${classOf}/${category}/${course}`
    });
    return res;
  } catch (error) {
    console.log(error)
    return error;
  }
}

/** 졸업 조건 input api */
export const inputConditionRequest = async (body) => {
  try {
    console.log("여기서부터 데이터비교")
    console.log(body)
    console.log({
      type: "단일전공",
      student_number: "12",
      course: "심화과정",
      major: "컴퓨터공학과",
      condition_detail: [
        {
          credit: "84",
          grade: "",
          kind_of_condition: "00",
          kind_of_subject: "전공",
          subject_information: "공학요소",
          subject_list: "",
          the_number_of: "",
        },
      ],
      english_condition: [
        {
          english_level: "S1",
          list_of_subject: "EAS1,EAS2",
        },
        {
          english_level: "S4",
          list_of_subject: " BasicEAS,EAS1,EAS2",
        },
      ],
    });
    const res = await axios({
      method: "PUT",
      url: `/inputCondition`,
      data: body
    });

    return res;
  } catch (error) {
    console.log(error)
    return error;
  }
}

/** 시뮬레이션 결과 저장 요청 */
export const simulationRequest = async (body) => {
  try {
    const res = await axios({
      method: "PUT",
      url: `/inputMultipleStudents`,
      data: body
    })

    return res;
  } catch (error) {
    console.log(error)
    return error;
  }
}

/** 졸업 판별결과 조회 */
export const resultRequest = async (year, semester, major) => {
  try {
    const res = await axios({
      method: "GET",
      url: `/getStudent/${year}/${semester}/${major}`,
    })
    return res;
  } catch (error) {
    console.log(error)
    return error;
  }
}