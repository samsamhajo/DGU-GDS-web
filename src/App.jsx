import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Main,
  Condition,
  GraduationInquiry,
  Login,
  MemberManagement,
  Register,
  StudentInfoInput,
  StudentSimulation,
} from "./pages";
import { GlobalNavBar } from "./components";

function App() {
  return (
    <BrowserRouter>
      <GlobalNavBar />
      <div class="px-[40px] py-[20px] min-w-[1400px]">
        <Routes>
          <Route>
            <Route path="/*" element={<Main />} />
            <Route path="/condition" element={<Condition />} />
            <Route path="/graduationInquiry" element={<GraduationInquiry />} />
            <Route path="/login" element={<Login />} />
            <Route path="/memberManagement" element={<MemberManagement />} />
            <Route path="/register" element={<Register />} />
            <Route path="/studentInfoInput" element={<StudentInfoInput />} />
            <Route path="/studentSimulation" element={<StudentSimulation />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
