import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import { loginRequest } from "../api/api";

const LoginPage = () => {
  const [user_id, setuser_id] = useState("");
  const [user_password, setuser_password] = useState("");
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 로그인 API 호출
      const response = await loginRequest(user_id, user_password);

      // 응답을 기반으로 로그인 성공 여부 확인
      if (response.data.success) {
        console.log("로그인 성공!");
        setLoginError(false);

        // 로그인 성공 시 추가 작업 수행
        navigate("/dashboard");
      } else {
        console.log("로그인 실패. 사용자 이름 또는 비밀번호를 확인하세요.");
        setLoginError(true);
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setLoginError(true);
    }
  };

  const tempLoginHandelr = () => {
    // 아이디가 마스터면 바로 고고
    if (user_id === "master") {
      sessionStorage.setItem("login", true);
      navigate("/condition");
      return;
    }

    const pw = JSON.parse(localStorage.getItem(`${user_id}`)).user_password;

    // 로그인 성공 case
    if (pw == user_password) {
      sessionStorage.setItem("login", true);
      navigate("/condition");
    }
    // 로그인 실패 case
    else {
      setLoginError(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white text-blue-500 flex-col">
      <h1 className="text-4xl font-bold mb-4">DGU</h1>
      <div className="flex flex-col space-y-4">
        <label htmlFor="user_id" className="font-semibold text-black">
          아이디
        </label>
        <input
          type="text"
          id="user_id"
          placeholder="아이디를 입력해주세요"
          value={user_id}
          onChange={(e) => setuser_id(e.target.value)}
          className="py-2 px-4 border rounded w-80 mb-2"
        />
        <label htmlFor="user_password" className="font-semibold text-black">
          비밀번호
        </label>
        <input
          type="password"
          id="user_password"
          placeholder="비밀번호를 입력해주세요"
          value={user_password}
          onChange={(e) => setuser_password(e.target.value)}
          className="py-2 px-4 border rounded w-80 mb-2"
        />

        <button
          onClick={tempLoginHandelr}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-600 transition duration-200 w-80"
        >
          로그인
        </button>
        {loginError && (
          <p className="text-red-500 text-sm">
            사용자 이름 또는 비밀번호가 잘못되었습니다.
          </p>
        )}

        <div className="flex justify-center w-80">
          <Link
            to="/signup"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-600 transition duration-200 text-center w-full"
          >
            회원가입
          </Link>
        </div>

        <Link to="/" className="text-blue-500 hover:underline mt-2">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
