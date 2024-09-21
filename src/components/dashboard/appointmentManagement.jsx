import { useState, useEffect } from 'react';

export default function AppointmentManagement() {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            console.log('Fetching appointments');
            const response = await fetch('/api/appointments/history');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Appointments received:', data);
            setAppointments(data.appointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError('Error al cargar las citas. Por favor, intenta de nuevo más tarde.');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Historial de Citas</h2>
            {appointments.length === 0 ? (
                <p>No tienes citas en tu historial.</p>
            ) : (
                appointments.map(appointment => (
                    <div key={appointment.id}>
                        <p>Fecha: {new Date(appointment.datetime).toLocaleString()}</p>
                        <p>Servicio: {appointment.service.name}</p>
                        <p>Estado: {appointment.status}</p>
                    </div>
                ))
            )}
        </div>
    );
}