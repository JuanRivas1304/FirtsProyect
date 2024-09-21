'use client'

import React, { useState, useEffect } from 'react';

function AppointmentHistory() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [availabilities, setAvailabilities] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch('/api/appointments/history');
            if (!response.ok) throw new Error('Error al obtener citas');
            const data = await response.json();
            console.log('Citas obtenidas:', data); // Log para depuración
            setAppointments(data);
            setLoading(false);
        } catch (error) {
            setError('Error al cargar citas');
            console.error('Error fetching appointments:', error);
            setLoading(false);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const response = await fetch(`/api/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'cancel' })
            });
            if (!response.ok) throw new Error('Error al cancelar la cita');
            fetchAppointments(); // Recargar las citas después de cancelar
        } catch (error) {
            setError('Error al cancelar la cita');
            console.error('Error cancelling appointment:', error);
        }
    };

    const handleStartReschedule = async (appointmentId, serviceId) => {
        console.log('Iniciando reprogramación para appointmentId:', appointmentId, 'y serviceId:', serviceId);
        if (!serviceId) {
            console.error('serviceId es undefined o null');
            setError('Error: No se pudo obtener el ID del servicio');
            return;
        }
        setIsRescheduling(true);
        setSelectedAppointmentId(appointmentId);
        try {
            const response = await fetch(`/api/availability?serviceId=${serviceId}`);
            console.log('Respuesta recibida:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error en la respuesta:', errorData);
                throw new Error(errorData.error || 'Error al obtener disponibilidades');
            }
            
            const data = await response.json();
            console.log('Disponibilidades obtenidas:', data);
            setAvailabilities(data);
        } catch (error) {
            console.error('Error completo:', error);
            setError('Error al cargar disponibilidades: ' + error.message);
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
                            {console.log('Appointment:', appointment)} {/* Log para depuración */}
                            Fecha y Hora: {new Date(appointment.datetime).toLocaleString()}, 
                            Servicio: {appointment.service?.name},
                            Estado: {appointment.status || 'No especificado'}
                            {appointment.status !== 'cancelled' && appointment.service && (
                                <button onClick={() => handleStartReschedule(appointment.id, appointment.service.id)}>
                                    Reprogramar
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AppointmentHistory;