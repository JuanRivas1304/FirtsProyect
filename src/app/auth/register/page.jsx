"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

function RegisterPage() {
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        //const userData = Object.fromEntries(formData);
		const username = formData.get('username');
		const email = formData.get('email');
		const phone = formData.get('phone');
		const password = formData.get('password');
		//const confirmPassword = formData.get('confirmPassword');

		

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({username, email, password, phone})
			});

            if (res.ok) {
                console.log("Registration successful");
				router.push('/auth/login');
			} else {
				const data = await res.json();
				setError(data.message || "An unexpected error occurred");
			}
		} catch (error) {
			console.error("Registration error:", error);
			setError("An unexpected error occurred");
		}
	};

	return (
		<div className="h-[calc(100vh-7rem)] flex justify-center items-center">
			<form onSubmit={handleSubmit} className="w-1/4">
				{error && <p className="bg-red-500 text-lg text-white p-3 rounded-lg mb-4">{error}</p>}
				<h1 className="text-slate-200 font-bold text-4xl mb-4 flex justify-center items-center">Registrarse</h1>
				
				<label htmlFor="username" className="text-slate-500 mb-2 block text-sm">Nombre de Usuario</label>
				<input
					type="text"
					name="username"
					className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
					placeholder="Nombre de Usuario"
					required
				/>

				<label htmlFor="email" className="text-slate-500 mb-2 block text-sm">Correo Electronico</label>
				<input
					type="email"
					name="email"
					className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
					placeholder="usuario@email.com"
					required
				/>

				<label htmlFor="phone" className="text-slate-500 mb-2 block text-sm">Telefono</label>
				<input
					type="tel"
					name="phone"
					className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
					placeholder="Numero de Telefono"
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

				<label htmlFor="confirmPassword" className="text-slate-500 mb-2 block text-sm">Confirmar Contraseña</label>
				<input
					type="password"
					name="confirmPassword"
					className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
					placeholder="********"
					required
				/>

				<button
					className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2"
					type="submit"
				>Registrarse</button>
			</form>
		</div>
	);
}

export default RegisterPage;