import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function Navbar() {
    const session = await getServerSession(authOptions);
    console.log(session);

    return (
        <nav className="flex justify-between items-center bg-gray-900 text-white px-6 py-4 shadow-md">
            <h1 className="text-2xl font-bold">Consultorio Dental</h1>

            <ul className="flex gap-x-4">
                {!session?.user ? (
                    <>
                        <li>
                            <Link href="/" className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/login" className="bg-green-600 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
                                Iniciar Sesión
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/register" className="bg-gray-600 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
                                Registrarse
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
                                Panel de control
                            </Link>
                            </li>
                        <li>
                            <Link href="/api/auth/signout" className="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
                                Cerrar Sesión
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;

