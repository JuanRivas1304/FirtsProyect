import React, { useState, useEffect } from 'react';

function AppointmentBooking() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [availability, setAvailability] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (selectedService) {
            fetchAvailability(selectedService.id);
        }
    }, [selectedService]);

    async function fetchServices() {
        try {
            const response = await fetch('/api/services');
            if (!response.ok) {
                throw new Error('Error al obtener servicios');
            }
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function fetchAvailability(serviceId) {
        try {
            const response = await fetch(`/api/availability?serviceId=${serviceId}`);
            if (!response.ok) {
                throw new Error('Error al obtener disponibilidad');
            }
            const data = await response.json();
            setAvailability(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function handleServiceChange(e) {
        const service = services.find(s => s.id === parseInt(e.target.value));
        setSelectedService(service);
    }

    return (
        <div>
            <h2>Reservar Cita</h2>
            <select onChange={handleServiceChange}>
                <option value="">Seleccione un servicio</option>
                {services.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                ))}
            </select>

            {selectedService && (
                <div>
                    <h3>Disponibilidad para {selectedService.name}</h3>
                    {availability.length === 0 ? (
                        <p>No hay horarios disponibles para este servicio.</p>
                    ) : (
                        <ul>
                            {availability.map(slot => (
                                <li key={slot.id}>
                                    {new Date(slot.datetime).toLocaleString()}
                                    {/* Aquí puedes agregar un botón para reservar */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default AppointmentBooking;