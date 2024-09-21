'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AvailabilityManager from './availabilityManager';
import AppointmentManager from './appointmentManager';

function AdminPanel() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        pendiente: 0,
        reserved: 0,
        cancelled: 0,
        completed: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [newAdminData, setNewAdminData] = useState({ username: '', email: '', password: '' });

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchStats();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAdminData),
            });
            if (!response.ok) {
                throw new Error('Error al crear administrador');
            }
            alert('Administrador creado con éxito');
            setNewAdminData({ username: '', email: '', password: '' });
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear administrador');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-white text-center">Panel de administración/profesional</h2>
            <div className="mb-6 flex justify-center space-x-4">
                <button
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 ${activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-900'}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Panel de estadísticas
                </button>
                <button
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 ${activeTab === 'availability' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-900'}`}
                    onClick={() => setActiveTab('availability')}
                >
                    Administrar disponibilidad
                </button>
                <button
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 ${activeTab === 'appointments' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-900'}`}
                    onClick={() => setActiveTab('appointments')}
                >
                    Administrar citas
                </button>
                {session?.user?.role === 'ADMIN' && (
                    <button
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 ${activeTab === 'createAdmin' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-900'}`}
                        onClick={() => setActiveTab('createAdmin')}
                    >
                        Crear Administrador
                    </button>
                )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                {activeTab === 'dashboard' && (
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Estadísticas</h3>
                        <div className="text-lg text-white mb-2">Citas Pendientes: {stats.pendiente}</div>
                        <div className="text-lg text-white mb-2">Citas Reservadas: {stats.reserved}</div>
                        <div className="text-lg text-white mb-2">Citas Canceladas: {stats.cancelled}</div>
                        <div className="text-lg text-white">Citas Completadas: {stats.completed}</div>
                    </div>
                )}
                {activeTab === 'availability' && <AvailabilityManager />}
                {activeTab === 'appointments' && <AppointmentManager />}
                {activeTab === 'createAdmin' && session?.user?.role === 'ADMIN' && (
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Crear Nuevo Administrador</h3>
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block mb-1 text-white">Nombre de usuario:</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={newAdminData.username}
                                    onChange={(e) => setNewAdminData({...newAdminData, username: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 border rounded text-gray-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-1 text-white">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={newAdminData.email}
                                    onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 border rounded text-gray-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-1 text-white">Contraseña:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={newAdminData.password}
                                    onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 border rounded text-gray-900"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {isLoading ? 'Creando...' : 'Crear Administrador'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;