import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpRequest } from "../api/api";

const SignUp = () => {
  const [formData, setFormData] = useState({
    user_position: "",
    user_department: "",
    user_majordepartment: "",
    user_number: "",
    user_name: "",
    user_email: "",
    user_id: "",
    user_password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    console.log(formData);
    console.log(localStorage.getItem("345"));
  }, [formData]);

  const [signupError, setSignupError] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async () => {
    const {
      user_position,
      user_department,
      user_majordepartment,
      user_number,
      user_name,
      user_email,
      user_id,
      user_password,
      confirmPassword,
    } = formData;

    if (
      !user_id ||
      !user_password ||
      !confirmPassword ||
      !user_position ||
      !user_department ||
      !user_majordepartment ||
      !user_number ||
      !user_name ||
      !user_email
    ) {
      console.log("누락된 정보가 있습니다.");
      return;
    }

    if (user_password === confirmPassword) {
      const userData = {
        user_id,
        user_position,
        user_department,
        user_majordepartment,
        user_number,
        user_name,
        user_email,
        user_password,
        permission: "N",
      };

      console.log(localStorage.getItem("345"));

      try {
        // API 호출
        const response = await signUpRequest(userData);

        // API 호출이 성공하면 회원가입 성공 처리
        console.log("회원가입 성공!");
        setSignupSuccess(true);
        setSignupError(false);

        // 로컬에 아이디비번 세팅
        localStorage.setItem(`${user_id}`, JSON.stringify(userData));

        // 이후 페이지 이동 등 추가 작업 수행
        navigate("/signup-complete");
      } catch (error) {
        // API 호출이 실패하면 오류 메시지 처리
        console.log("회원가입 실패:", error.message);
        setSignupSuccess(false);
        setSignupError(true);
      }
    } else {
      console.log("비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      setSignupSuccess(false);
      setSignupError(true);
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-white text-blue-500">
      <div className="w-80 p-4 border rounded shadow max-w-full">
        <h1 className="text-2xl font-bold mb-4">회원가입</h1>

        <label
          htmlFor="user_position"
          className="font-semibold text-black block mb-1"
        >
          직책
        </label>
        <input
          type="text"
          id="user_position"
          name="user_position"
          placeholder="직책을 입력해주세요"
          onChange={handleChange}
          className="py-1 px-4 border rounded w-full"
        />
        <label
          htmlFor="user_department"
          className="font-semibold text-black block mt-2 mb-1"
        >
          부서
        </label>
        <input
          type="text"
          id="user_department"
          name="user_department"
          placeholder="부서를 입력해주세요"
          value={formData.user_department}
          onChange={handleChange}
          className="py-1 px-4 border rounded w-full"
        />
        <label
          htmlFor="user_majordepartment"
          className="font-semibold text-black block mt-2 mb-1"
        >
          학과
        </label>
        <input
          type="text"
          id="user_majordepartment"
          name="user_majordepartment"
          placeholder="학과를 입력해주세요"
          value={formData.user_majordepartment}
          onChange={handleChange}
          className="py-1 px-4 border rounded w-full"
        />
        <label
          htmlFor="user_number"
          className="font-semibold text-black block mt-2 mb-1"
        >
          교번
        </label>
        <input
          type="text"
          id="user_number"
          name="user_number"
          placeholder="교번을 입력해주세요"
          value={formData.user_number}
          onChange={handleChange}
          className="py-1 px-4 border rounded w-full"
        />
        <label
          htmlFor="user_name"
          className="font-semibold text-black block mt-2 mb-1"
        >
          이름
        </label>
        <input
          type="text"
          id="user_name"
          name="user_name"
          placeholder="이름을 입력해주세요"
          value={formData.user_name}
          onChange={handleChange}
          className="py-1 px-4 border rounded w-full"
        />
        <label
          htmlFor="user_email"
          className="font-semibold text-black block mt-2 mb-1"
        >
          이메일
        </label>
        <input
          type="user_email"
          id="user_email"
          name="user_email"
          placeholder="이메일을 입력해주세요"
          value={formData.user_email}
          onChange={handleChange}
          className="py-1 px-4 border rounded w-full"
        />
        <label
          htmlFor="user_id"
          className="font-semibold text-black block mt-2 mb-1"
        >
          아이디
        </label>
        <input
          type="text"
          id="user_id"
          name="user_id"
          placeholder="아이디를 입력해주세요"
          value={formData.user_id}
          onChange={handleChange}
          className="py-1 px-4 border rounded w-full"
        />
        <label
          htmlFor="user_password"
          className="font-semibold text-black block mt-2 mb-1"
        >
          비밀번호
        </label>
        <input
          type="password"
          id="user_password"
          name="user_password"
          placeholder="비밀번호를 입력해주세요"
          value={formData.user_password}
          onChange={handleChange}
          className="py-1 px-4 border rounded w-full"
        />
        <label
          htmlFor="confirmPassword"
          className="font-semibold text-black block mt-2 mb-1"
        >
          비밀번호 확인
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력해주세요"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="py-1 px-4 border rounded w-full"
        />
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSignUp}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-600 transition duration-200"
          >
            회원가입
          </button>
        </div>
        {signupError && (
          <p className="text-red-500 text-sm mt-1">
            비밀번호가 일치하지 않습니다.
          </p>
        )}
        {signupSuccess && (
          <p className="text-green-500 text-sm mt-1">
            회원가입이 성공적으로 완료되었습니다.
          </p>
        )}

        <div className="flex justify-center mt-2">
          <Link
            to="/login"
            className="text-blue-500 hover:underline mt-2 block"
          >
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
