import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    console.log('GET /api/availability called');
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');

    console.log('URL completa:', request.url);
    console.log('Todos los parámetros de búsqueda:', Object.fromEntries(searchParams));
    console.log('ServiceId recibido:', serviceId);

    try {
        let availabilities;
        if (serviceId) {
            availabilities = await prisma.availability.findMany({
                where: {
                    serviceId: parseInt(serviceId),
                },
                include: {
                    service: true
                },
                orderBy: {
                    datetime: 'asc'
                }
            });
        } else {
            availabilities = await prisma.availability.findMany({
                include: {
                    service: true
                },
                orderBy: {
                    datetime: 'asc'
                }
            });
        }
        console.log('Availabilities fetched:', availabilities);
        return NextResponse.json(availabilities);
    } catch (error) {
        console.error('Error fetching availabilities:', error);
        return NextResponse.json({ error: 'Error al obtener disponibilidades' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { date, startTime, endTime, serviceId } = await request.json();
        const availability = await prisma.availability.create({
            data: {
                datetime: new Date(`${date}T${startTime}`),
                endTime: new Date(`${date}T${endTime}`),
                serviceId: parseInt(serviceId),
            },
        });
        return NextResponse.json(availability);
    } catch (error) {
        console.error('Error creating availability:', error);
        return NextResponse.json({ error: 'Error creating availability' }, { status: 500 });
    }
}

// ... otros métodos (POST, etc.) ...
