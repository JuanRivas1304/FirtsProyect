import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');

    console.log('URL completa:', request.url);
    console.log('Todos los parámetros de búsqueda:', Object.fromEntries(searchParams));
    console.log('ServiceId recibido:', serviceId);

    try {
        let services;
        if (serviceId) {
            // Si se proporciona un serviceId, obtén solo ese servicio
            services = await prisma.service.findUnique({
                where: {
                    id: parseInt(serviceId)
                }
            });
        } else {
            // Si no se proporciona un serviceId, obtén todos los servicios
            services = await prisma.service.findMany();
        }

        return NextResponse.json(services);
    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        return NextResponse.json({ error: 'Error al obtener los servicios' }, { status: 500 });
    }
}