import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GlobalNavBar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("master", "1234");
  }, []);

  return (
    <nav class="flex px-[20px] justify-between items-center min-w-[1400px] h-[64px] border-solid border-b-[1px] border-black box-border">
      <h1
        onClick={() => navigate("/")}
        class="text-4xl font-sans font-extrabold text-blue-500 cursor-pointer"
      >
        DGD
      </h1>
      <ul class="flex gap-[20px] items-center">
        <li onClick={() => navigate("/user-list")} class="cursor-pointer">
          회원 관리
        </li>
        <li onClick={() => navigate("/condition")} class="cursor-pointer">
          졸업 조건
        </li>
        <li
          onClick={() => navigate("/studentInfoInput")}
          class="cursor-pointer"
        >
          학생정보 입력
        </li>
        <li
          onClick={() => navigate("/graduationInquiry")}
          class="cursor-pointer"
        >
          졸업 조회
        </li>
        <li class="cursor-pointer">로그아웃</li>
      </ul>
    </nav>
  );
};

export default GlobalNavBar;
