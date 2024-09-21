'use client'
import React, { useState } from 'react';
import AppointmentHistory from './appointmentHistory';
import AppointmentManager from './appointmentManager';
import ServiceAvailability from './serviceAvailability';

function ClientPanel() {
    const [activeTab, setActiveTab] = useState('agendar');

    const handleSlotSelect = async (slot) => {
        console.log('Slot seleccionado en ClientPanel:', slot);
        try {
            const response = await fetch('/api/appointments', {  // Cambia esta línea
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    datetime: slot.datetime,
                    serviceId: slot.serviceId,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al agendar cita');
            }
            const data = await response.json();
            console.log('Cita agendada:', data);
            setActiveTab('gestionar');
            // Aquí podrías mostrar un mensaje de éxito al usuario
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-white text-center">Panel del Cliente</h2>
            <div className="mb-4 flex justify-center space-x-4">
                <button
                    onClick={() => setActiveTab('agendar')}
                    className={`px-4 py-2 rounded ${activeTab === 'agendar' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                >
                    Agendar Cita
                </button>
                <button
                    onClick={() => setActiveTab('gestionar')}
                    className={`px-4 py-2 rounded ${activeTab === 'gestionar' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                >
                    Gestionar Citas
                </button>
                <button
                    onClick={() => setActiveTab('historial')}
                    className={`px-4 py-2 rounded ${activeTab === 'historial' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                >
                    Historial de Citas
                </button>
            </div>
            {activeTab === 'agendar' && <ServiceAvailability onSlotSelect={handleSlotSelect} />}
            {activeTab === 'gestionar' && <AppointmentManager />}
            {activeTab === 'historial' && <AppointmentHistory />}
        </div>
    );
}

export default ClientPanel;