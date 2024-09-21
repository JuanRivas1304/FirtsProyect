'use client'

import React, { useState, useEffect } from 'react';

function AvailabilityManager() {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [services, setServices] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchServices();
        fetchAvailabilities();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch('/api/services');
            if (!response.ok) throw new Error('Error al obtener servicios');
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
            setError('Error al cargar servicios');
        }
    };

    const fetchAvailabilities = async () => {
        try {
            console.log('Fetching availabilities...');
            const response = await fetch('/api/availability');
            console.log('Response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Error al obtener disponibilidades');
            }
            const data = await response.json();
            console.log('Availabilities fetched:', data);
            setAvailabilities(data);
        } catch (error) {
            console.error('Error fetching availabilities:', error);
            setError('Error al cargar disponibilidades: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date,
                    startTime,
                    endTime,
                    serviceId: parseInt(serviceId),
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al añadir disponibilidad');
            }
            alert('Disponibilidad añadida con éxito');
            setDate('');
            setStartTime('');
            setEndTime('');
            setServiceId('');
            fetchAvailabilities(); // Actualizar la lista de disponibilidades
        } catch (error) {
            console.error('Error adding availability:', error);
            setError(error.message);
        }
    };

    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-white">Administrar Disponibilidad</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="date">Fecha:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="startTime">Hora de inicio:</label>
                    <input
                        type="time"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endTime">Hora de finalización:</label>
                    <input
                        type="time"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="service">Servicio:</label>
                    <select
                        id="service"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un servicio</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Añadir Disponibilidad</button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="mt-8">
                <h4 className="text-xl font-bold mb-2 text-white">Disponibilidades Actuales</h4>
                <ul className="space-y-2">
                    {availabilities.map((availability) => (
                        <li key={availability.id} className="bg-gray-700 p-3 rounded text-white">
                            {new Date(availability.datetime).toLocaleString()} - 
                            {new Date(availability.endTime).toLocaleTimeString()} | 
                            Servicio: {availability.service?.name || 'No especificado'}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AvailabilityManager;