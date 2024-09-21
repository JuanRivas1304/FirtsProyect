'use client'

import React, { useState } from 'react';
import ServiceAvailability from './serviceAvailability';

function AppointmentScheduler() {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedService, setSelectedService] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const services = [
        { id: 1, name: 'Corte de pelo' },
        { id: 2, name: 'Tinte' },
        { id: 3, name: 'Manicura' },
        // Añade más servicios según sea necesario
    ];

    const handleSlotSelection = (slot) => {
        setSelectedSlot(slot);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot || !selectedService) {
            setError('Por favor, selecciona un horario y un servicio.');
            return;
        }

        try {
            const response = await fetch('/api/appointments/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    availabilityId: selectedSlot.id,
                    serviceId: selectedService,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al programar la cita');
            }

            setSuccess('Cita programada con éxito');
            setSelectedSlot(null);
            setSelectedService('');
        } catch (error) {
            setError('Error al programar la cita');
            console.error('Error scheduling appointment:', error);
        }
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-white">Programar Cita</h2>
            <ServiceAvailability onSlotSelect={handleSlotSelection} />
            <form onSubmit={handleSubmit} className="mt-6">
                <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full p-2 mb-4 rounded"
                >
                    <option value="">Selecciona un servicio</option>
                    {services.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>
                {selectedSlot && (
                    <p className="text-white mb-4">
                        Horario seleccionado: {new Date(selectedSlot.datetime).toLocaleString()}
                    </p>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Programar Cita
                </button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
    );
}

export default AppointmentScheduler;