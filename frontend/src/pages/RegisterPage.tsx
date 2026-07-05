import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../api/registerApi";
import RegisterInScreen from "../assets/lock-screen.png"
import { useAppNotification } from "../้hooks/useAppNotification";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { openNotification, contextHolder  } = useAppNotification();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
        <div className="flex flex-col gap-10">
            {contextHolder}

            <div className="flex flex-col items-center">
                <img src={RegisterInScreen} width={100} />
                <div className="text-5xl text-center">Register</div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div className="flex flex-col w-100 place-self-center">
                    <label className="font-bold">Username</label>
                    <input
                        name="username"
                        value={form.name}
                        onChange={(e) => (setForm({
                            ...form,
                            name: e.target.value
                        }))}
                        className="input"
                    />
                </div>
                <div className="flex flex-col w-100 place-self-center">
                    <label className="font-bold">Email</label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={(e) => (setForm({
                            ...form,
                            email: e.target.value
                        }))}
                        className="input"
                    />
                </div>
                <div className="flex flex-col w-100 place-self-center">
                    <label className="font-bold">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={(e) => (setForm({
                            ...form,
                            password: e.target.value
                        }))}
                        className="input"
                    />
                </div>
                <button
                    disabled={loading} type="submit"
                    className={`border self-center w-fit px-3 py-2 rounded bg-blue-500 text-white transition-all cursor-pointer hover:bg-blue-700 ${loading ?? `cursor-none`}`}
                >
                    {loading ? "Loading..." : "Register"}</button>
            </form>
        </div>
    )
}
