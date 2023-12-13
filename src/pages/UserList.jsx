import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialUsers = [
  {
    id: 1,
    userid: "user1",
    position: "Position 1",
    department: "Department 1",
    major: "Major 1",
    employeeId: "12345",
    username: "username1",
    email: "user1@example.com",
  },
  {
    id: 2,
    userid: "user2",
    position: "Position 2",
    department: "Department 2",
    major: "Major 2",
    employeeId: "54321",
    username: "username2",
    email: "user2@example.com",
  },
  // 추가 사용자 정보를 여기에 추가할 수 있습니다.
];

const UserList = () => {
  // 사용자 정보를 관리하는 상태 변수
  const [users, setUsers] = useState();

  const navigate = useNavigate();

  /** 모든 회원정보 리스트 세팅 */
  useEffect(() => {
    let keys = Object.keys(localStorage);
    keys = keys.filter((x) => x != "master");
    let temp = [];

    keys.forEach((el) => {
      temp.push(JSON.parse(localStorage.getItem(el)));
    });

    setUsers([...temp]);
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  /** 로그인 안하면 접근 불가 */
  useEffect(() => {
    const isLogin = sessionStorage.getItem("login");
    if (isLogin) {
      return;
    } else {
      navigate("/");
    }
  }, []);

  /** 수락유무 핸들러 */
  const permissionHandler = (index) => {
    let temp = users;

    // N일경우
    if (temp[index].permission == "N") {
      temp[index].permission = "Y";
      setUsers([...temp]);
      return;
    }
    // Y일경우
    if (temp[index].permission == "Y") {
      temp[index].permission = "N";
      setUsers([...temp]);
      return;
    }
  };

  return (
    <div className="bg-white h-screen">
      <div className="container mx-auto h-screen">
        <h1 className="text-2xl font-semibold text-black mb-4">회원 목록</h1>
        <table className="border">
          <thead>
            <tr>
              <th className="border px-4 py-2">아이디</th>
              <th className="border px-4 py-2">직책</th>
              <th className="border px-4 py-2">부서</th>
              <th className="border px-4 py-2">학과</th>
              <th className="border px-4 py-2">교번</th>
              <th className="border px-4 py-2">이름</th>
              <th className="border px-4 py-2">이메일</th>
              <th className="border px-4 py-2">수락유무</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user, index) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.user_id}</td>
                  <td className="border px-4 py-2">{user.user_position}</td>
                  <td className="border px-4 py-2">{user.user_department}</td>
                  <td className="border px-4 py-2">
                    {user.user_majordepartment}
                  </td>
                  <td className="border px-4 py-2">{user.user_number}</td>
                  <td className="border px-4 py-2">{user.user_name}</td>
                  <td className="border px-4 py-2">{user.user_email}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className=" border-gray-700 bg-blue-300 rounded-[3px] w-[24px]"
                      onClick={() => permissionHandler(index)}
                    >
                      &nbsp;{`${user.permission}`}&nbsp;
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
