'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ClientPanel from '@/components/dashboard/Clientpanel';
import AdminPanel from '@/components/dashboard/Adminpanel';


function UserPanel() {
    const { data: session, status } = useSession();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        if (session?.user?.role) {
            setUserRole(session.user.role);
        }
    }, [session]);

    if (status === "loading") return <div>Session loading...</div>;
    if (!session) return <div>No session found</div>;
    if (!userRole) return <div>No user role found</div>;

    return (
        <div>
            <h2 className="text-white">User Panel</h2>
            <p className="text-white">User Role: {userRole}</p>
            {userRole.toLowerCase() === 'client' && <ClientPanel />}
            {(userRole.toLowerCase() === 'admin' || userRole.toLowerCase() === 'professional') && <AdminPanel />}
        </div>
    );
}

export default UserPanel;