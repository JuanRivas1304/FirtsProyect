'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

function AppointmentManager() {
    const { data: session } = useSession();
    const [appointments, setAppointments] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch('/api/appointments/history');
            if (!response.ok) throw new Error('Error al obtener citas');
            const data = await response.json();
            setAppointments(data);
            setLoading(false);
        } catch (error) {
            setError('Error al cargar citas');
            console.error('Error fetching appointments:', error);
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            const response = await fetch(`/api/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'cancel' })
            });
            if (!response.ok) throw new Error('Error al cancelar la cita');
            fetchAppointments(); // Recargar las citas después de cancelar una
        } catch (error) {
            setError('Error al cancelar la cita');
            console.error('Error cancelling appointment:', error);
        }
    };

    const handleStartReschedule = async (appointmentId, serviceId) => {
        setIsRescheduling(true);
        setSelectedAppointmentId(appointmentId);
        try {
            console.log('Fetching availability for serviceId:', serviceId); // Añade este log
            const response = await fetch(`/api/availability?serviceId=${serviceId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener disponibilidades');
            }
            const data = await response.json();
            setAvailabilities(data);
        } catch (error) {
            setError('Error al cargar disponibilidades: ' + error.message);
            console.error('Error fetching availabilities:', error);
        }
    };

    const handleRescheduleAppointment = async (newAvailabilityId) => {
        try {
            const response = await fetch(`/api/appointments/${selectedAppointmentId}/reschedule`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ availabilityId: newAvailabilityId }),
            });
            if (!response.ok) throw new Error('Error al reprogramar la cita');
            setIsRescheduling(false);
            setSelectedAppointmentId(null);
            fetchAppointments(); // Recargar las citas después de reprogramar
        } catch (error) {
            setError('Error al reprogramar la cita');
            console.error('Error rescheduling appointment:', error);
        }
    };

    const handleRebook = async (appointment) => {
        try {
            const response = await fetch(`/api/appointments/rebook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldAppointmentId: appointment.id,
                    serviceId: appointment.serviceId,
                    datetime: appointment.datetime
                }),
            });
            if (!response.ok) throw new Error('Error al volver a reservar la cita');
            fetchAppointments(); // Recargar las citas después de reservar nuevamente
        } catch (error) {
            setError('Error al volver a reservar la cita');
            console.error('Error rebooking appointment:', error);
        }
    };

    if (loading) return <div>Cargando citas...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h3>Mis Citas</h3>
            {appointments.length === 0 ? (
                <p>No hay citas programadas.</p>
            ) : (
                <ul>
                    {appointments.map(appointment => (
                        <li key={appointment.id}>
                            Servicio: {appointment.service.name} - 
                            Fecha: {new Date(appointment.datetime).toLocaleString()} - 
                            Estado: {appointment.status}
                            {appointment.status === 'cancelled' ? (
                                <button onClick={() => handleRebook(appointment)}>
                                    Volver a reservar
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => handleCancelAppointment(appointment.id)}>
                                        Cancelar
                                    </button>
                                    <button onClick={() => handleStartReschedule(appointment.id, appointment.service.id)}>
                                        Reprogramar
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {isRescheduling && (
                <div>
                    <h4>Seleccione una nueva fecha y hora:</h4>
                    <ul>
                        {availabilities.map(availability => (
                            <li key={availability.id}>
                                {new Date(availability.datetime).toLocaleString()}
                                <button onClick={() => handleRescheduleAppointment(availability.id)}>
                                    Seleccionar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default AppointmentManager;