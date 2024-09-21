'use client'

import React, { useState, useEffect } from 'react';

function ServiceAvailability({ onSlotSelect }) {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [availabilities, setAvailabilities] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (selectedService) {
            fetchAvailabilities();
        }
    }, [selectedService]);

    const fetchServices = async () => {
        try {
            const response = await fetch('/api/services');
            if (!response.ok) throw new Error('Error al obtener servicios');
            const data = await response.json();
            console.log('Servicios obtenidos:', data); // Log para depuración
            setServices(data);
            if (data.length > 0) {
                setSelectedService(data[0].id.toString());
            }
        } catch (error) {
            setError('Error al cargar servicios');
            console.error('Error fetching services:', error);
        }
    };

    const fetchAvailabilities = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/availability?serviceId=${selectedService}`);
            if (!response.ok) throw new Error('Error al obtener disponibilidades');
            const data = await response.json();
            console.log('Disponibilidades obtenidas:', data); // Log para depuración
            setAvailabilities(data);
            setError('');
        } catch (error) {
            setError('Error al cargar disponibilidades');
            console.error('Error fetching availabilities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleServiceChange = (e) => {
        const newServiceId = e.target.value;
        console.log('Servicio seleccionado:', newServiceId); // Log para depuración
        setSelectedService(newServiceId);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-white">Disponibilidad de Servicios</h3>
            <select
                value={selectedService}
                onChange={handleServiceChange}
                className="w-full p-2 rounded text-black mb-4"
            >
                <option value="">Seleccione un servicio</option>
                {services.map((service) => (
                    <option key={service.id} value={service.id}>
                        {service.name}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
                <p className="text-white">Cargando disponibilidades...</p>
            ) : (
                <>
                    <p className="text-white mb-2">Disponibilidades encontradas: {availabilities.length}</p>
                    {availabilities.length > 0 ? (
                        <ul className="space-y-2">
                            {availabilities.map((slot) => (
                                <li 
                                    key={slot.id} 
                                    className="bg-gray-700 p-3 rounded text-white cursor-pointer hover:bg-gray-600"
                                    onClick={() => {
                                        console.log('Slot seleccionado:', slot); // Log para depuración
                                        onSlotSelect({...slot, serviceId: selectedService});
                                    }}
                                >
                                    {new Date(slot.datetime).toLocaleString('es-ES', { 
                                        year: 'numeric', 
                                        month: '2-digit', 
                                        day: '2-digit', 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })} - {new Date(slot.endTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-white">No hay disponibilidad para este servicio.</p>
                    )}
                </>
            )}
        </div>
    );
}

export default ServiceAvailability;