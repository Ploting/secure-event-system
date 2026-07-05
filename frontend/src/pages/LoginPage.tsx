import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../api/LoginApi";
import RegisterInScreen from "../assets/lock-screen.png"
import { useAppNotification } from "../้hooks/useAppNotification";

export const LoginPage = () => {

    const navigate = useNavigate();
    const { openNotification, contextHolder } = useAppNotification();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        userNameOrEmail: "",
        password: "",
    });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLoading(true)
            if (form.userNameOrEmail == "" || form.password == "") {
                openNotification("error", "Login Failed", "กรุณากรอกข้อมูลให้ครบถ้วน", 2)
                return;
            }

            const res = await userLogin(form);

            localStorage.setItem("token", res.token);
            localStorage.setItem("user", JSON.stringify(res.user));

            openNotification("success", "Login Successfully", "ลงทะเบียนสำเร็จแล้ว ย้ายไปหน้าเข้าสู่ระบบ", 2)
            // window.alert("Register Successfully");
        }
        catch (e) {
            openNotification("error", "Login Failed", "กรุณาลองใหม่อีกครั้ง", 2)

            console.log(e);
        }
        finally {
            setLoading(false);
            navigate("/events");
        }
    };

    return (
        <div className="flex flex-col gap-10">
            {contextHolder}

            <div className="flex flex-col items-center">
                <img src={RegisterInScreen} width={100} />
                <div className="text-5xl text-center">Login</div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div className="flex flex-col w-100 place-self-center">
                    <label className="font-bold">Username Or Email</label>
                    <input
                        name="username"
                        value={form.userNameOrEmail}
                        onChange={(e) => (setForm({
                            ...form,
                            userNameOrEmail: e.target.value
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
                    {loading ? "Loading..." : "Login"}</button>
            </form>
        </div>
    )
}
