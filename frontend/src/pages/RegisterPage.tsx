import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../api/registerApi";
import RegisterInScreen from "../assets/lock-screen.png"
import { useAppNotification } from "../hooks/useAppNotification";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { openNotification, contextHolder  } = useAppNotification();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLoading(true)
            if (form.email == "" || form.name == "" || form.password == "") {
                openNotification("error", "Register Failed", "กรุณากรอกข้อมูลให้ครบถ้วน", 2)
                return;
            }

            await userRegister(form);

            openNotification("success", "Register Successfully", "ลงทะเบียนสำเร็จแล้ว ย้ายไปหน้าเข้าสู่ระบบ", 2)
            // window.alert("Register Successfully");
        }
        catch (e) {
            openNotification("error", "Register Failed", "มีผู้ใช้งานอื่นใช้ชื่อนี้ไปแล้ว", 2)

            console.log(e);
        }
        finally {
            setLoading(false);
            navigate("/login");

        }
    };

    return (
        <div className="m-auto flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full max-w-sm">
            {contextHolder}

            <div className="flex flex-col items-center mb-6">
                <img src={RegisterInScreen} width={80} />
                <h2 className="text-2xl font-bold mt-4">Register</h2>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                        name="username"
                        value={form.name}
                        onChange={(e) => (setForm({
                            ...form,
                            name: e.target.value
                        }))}
                        className="input w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={(e) => (setForm({
                            ...form,
                            email: e.target.value
                        }))}
                        className="input w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={(e) => (setForm({
                            ...form,
                            password: e.target.value
                        }))}
                        className="input w-full"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    )
}
