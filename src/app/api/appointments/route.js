import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const { datetime, serviceId } = await request.json();

        // Verificar si la disponibilidad aún existe
        const availability = await prisma.availability.findFirst({
            where: {
                datetime: new Date(datetime),
                serviceId: parseInt(serviceId),
            },
        });

        if (!availability) {
            return NextResponse.json({ error: 'La disponibilidad ya no existe' }, { status: 400 });
        }

        // Crear la cita
        const appointment = await prisma.appointment.create({
            data: {
                datetime: new Date(datetime),
                userId: session.user.id,
                serviceId: parseInt(serviceId),
                status: "pendiente", // Añade esta línea
            },
        });

        // Eliminar la disponibilidad
        await prisma.availability.delete({
            where: { id: availability.id },
        });

        console.log('Cita creada:', appointment);
        return NextResponse.json(appointment);
    } catch (error) {
        console.error('Error al crear la cita:', error);
        return NextResponse.json({ error: 'Error al crear la cita' }, { status: 500 });
    }
}

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                user: true,
                service: true
            },
            orderBy: {
                datetime: 'desc'
            }
        });

        return NextResponse.json(appointments);
    } catch (error) {
        console.error('Error al obtener citas:', error);
        return NextResponse.json({ error: 'Error al obtener citas' }, { status: 500 });
    }
}