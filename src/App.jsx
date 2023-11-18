import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Condition,
  GraduationInquiry,
  StudentInfoInput,
  StudentSimulation,
  HomePage,
  LoginPage,
  SignUp,
  SignUpComplete,
  Confirmation,
  UserList,
  UserDetail,
} from "./pages";
import { GlobalNavBar } from "./components";

function App() {
  return (
    <BrowserRouter>
      <GlobalNavBar />
      <div class="px-[40px] py-[20px] min-w-[1400px]">
        <Routes>
          <Route>
            <Route path="/*" element={<HomePage />} />
            <Route path="/condition" element={<Condition />} />
            <Route path="/graduationInquiry" element={<GraduationInquiry />} />
            <Route path="/studentInfoInput" element={<StudentInfoInput />} />
            <Route path="/studentSimulation" element={<StudentSimulation />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup-complete" element={<SignUpComplete />} />
            <Route path="/student-simulation" element={<StudentSimulation />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/user-list" element={<UserList />} /> {/* 추가된 줄 */}
            <Route path="/user/:id" element={<UserDetail />} />{" "}
            {/* 추가된 줄 */}
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
