import axios from "axios";
import React, { useEffect } from "react";
import { SelectBox180 } from "../components";

const GraduationInquiry = () => {
  // const test = async () => {
  //   try {
  //     const res = await axios({
  //       method: "POST",
  //       url: `http://Test1-env.eba-6kqxe2es.ap-northeast-2.elasticbeanstalk.com/registration`,
  //       data: {
  //         user_position: "직원",
  //         user_department: "학사관리실",
  //         user_majordepartment: "정보통신공학과",
  //         user_number: "2003202020",
  //         user_name: "테스트",
  //         user_email: "test1234@naver.com",
  //         user_id: "meme1234",
  //         user_password: "test1234",
  //       },
  //     });
  //     console.log("통신됨");
  //     console.log(res);
  //     return res;
  //   } catch (error) {
  //     console.log("통신 에러");
  //     console.log(error);
  //     return error;
  //   }
  // };

  // useEffect(() => {
  //   console.log("test");
  //   test();
  // });

  // useEffect(() => {
  //   readXlsxFile("../data/test_data.xlsx").then((sheets) => {
  //     console.log(sheets);
  //   });
  // }, []);

  return (
    <>
      <h2 class="mb-[18px] text-2xl font-medium">졸업 조회 페이지</h2>
      <div class="mb-[50px] flex gap-[20px] text-[16px] font-bold">
        <span>학과</span>

        <span>졸업년도</span>
        <input class="w-[180px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center" />
        <span>졸업유무</span>

        <button class="mb-[12px] flex items-center justify-center w-[48px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[14px] font-medium text-center bg-slate-100 active:bg-slate-50 cursor-pointer">
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

          <div class="flex gap-[20px]">
            <div class="flex w-[600px] h-[25px] border-b-[1px] border-l-[1px] border-black text-[12px] font-medium">
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
              <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black bg-green-400">
                통과
              </div>
              <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                통과
              </div>
            </div>
            <button class="flex items-center justify-center w-[80px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[12px] font-medium text-center bg-slate-100 active:bg-slate-50 cursor-pointer">
              자세히 보기
            </button>
          </div>
          <div class="flex gap-[20px]">
            <div class="flex w-[600px] h-[25px] border-b-[1px] border-l-[1px] border-black text-[12px] font-medium">
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
              <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black bg-yellow-300">
                보류
              </div>
              <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                통과
              </div>
            </div>
            <button class="flex items-center justify-center w-[80px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[12px] font-medium text-center bg-slate-100 active:bg-slate-50 cursor-pointer">
              자세히 보기
            </button>
          </div>
          <div class="flex gap-[20px]">
            <div class="flex w-[600px] h-[25px] border-b-[1px] border-l-[1px] border-black text-[12px] font-medium">
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
              <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black bg-red-400">
                실패
              </div>
              <div class="flex items-center justify-center w-[100px] border-r-[1px] border-black">
                통과
              </div>
            </div>
            <button class="flex items-center justify-center w-[80px] h-[24px] border-[1px] border-gray-300 rounded-[3px] box-border  text-[12px] font-medium text-center bg-slate-100 active:bg-slate-50 cursor-pointer">
              자세히 보기
            </button>
          </div>
          <div class="my-[10px] text-[12px] text-green-400">
            <div>(통과) 1. 전체학점은 140학점 이상 이수한다. (141/140)</div>
            <div>(통과) 2. 전공과목 84학점 이상 이수한다. (84/84)</div>
            <div class="text-red-400">
              (실패) 3. 교양과목 28학점 이상 이수한다. (27/28)
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GraduationInquiry;
