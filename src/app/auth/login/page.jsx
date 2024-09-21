"use client"
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginPage() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);

        try {
            console.log("Attempting to sign in"); 
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            console.log("Sign in response:", res); 

            if (res.error) {
                setError(res.error);
            } else {
                console.log("Login successful, attempting to redirect to dashboard"); 
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An unexpected error occurred");
        }
    };

    return (
        <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
            <form onSubmit={handleSubmit} className="w-1/4">
                {error && <p className="bg-red-500 text-lg text-white p-3 rounded-lg mb-4">{error}</p>}
                <h1 className="text-slate-200 font-bold text-4xl mb-4 flex justify-center items-center">Iniciar Sesión</h1>
                
                <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">Correo Electronico</label>
                <input
                    type="email"
                    name="email"
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="usuario@correo.com"
                    required
                />

                <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">Contraseña</label>
                <input
                    type="password"
                    name="password"
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="********"
                    required
                />

                <button
                    className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2"
                    type="submit"
                >Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default LoginPage;