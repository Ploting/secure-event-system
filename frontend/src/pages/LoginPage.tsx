import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../api/LoginApi";
import RegisterInScreen from "../assets/lock-screen.png";
import { useAppNotification } from "../hooks/useAppNotification";
import { useAuth } from "../hooks/useAuth";

interface form {
  userNameOrEmail: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { openNotification, contextHolder } = useAppNotification();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userNameOrEmail: "",
    password: "",
  });

  const handleSubmit = async (form: form) => {
    try {
      console.log(form);
      setLoading(true);
      if (form.userNameOrEmail == "" || form.password == "") {
        openNotification(
          "error",
          "Login Failed",
          "กรุณากรอกข้อมูลให้ครบถ้วน",
          2,
        );
        return;
      }

      const res = await userLogin(form);

      const loginSuccess = login(res.token);

      if (!loginSuccess) {
        openNotification(
          "error",
          "Login Failed",
          "Token ไม่ถูกต้องหรือหมดอายุ",
          2,
        );
        return;
      }

      openNotification("success", "Login Successfully", "เข้าสู่ระบบสำเร็จ", 2);

      setTimeout(() => {
        navigate("/events");
      }, 500);
      
    } catch (err) {
      openNotification(
        "error",
        "Login Failed",
        "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        4,
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-auto flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full max-w-sm">
      {contextHolder}

      <div className="flex flex-col items-center mb-6">
        <img src={RegisterInScreen} width={80} />
        <h2 className="text-2xl font-bold mt-4">Login</h2>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(form);
      }} className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username Or Email</label>
          <input
            name="username"
            value={form.userNameOrEmail}
            onChange={(e) =>
              setForm({
                ...form,
                userNameOrEmail: e.target.value,
              })
            }
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="input w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};
