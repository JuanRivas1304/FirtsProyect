"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UserPanel from "./userpanel";

function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div>Loading session...</div>;
    }

    if (!session) {
        return <div>No session found</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-white">Bienvenido ,    {session.user.username || session.user.email}</h1>
            <UserPanel />
        </div>
    );
}

export default DashboardPage;