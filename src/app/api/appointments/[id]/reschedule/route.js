import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const { availabilityId } = await request.json();

    try {
        // Iniciar una transacción
        const result = await prisma.$transaction(async (prisma) => {
            // Obtener la disponibilidad seleccionada
            const availability = await prisma.availability.findUnique({
                where: { id: availabilityId },
            });

            if (!availability) {
                throw new Error('Disponibilidad no encontrada');
            }

            // Obtener la cita actual
            const currentAppointment = await prisma.appointment.findUnique({
                where: { id: parseInt(id) },
            });

            if (!currentAppointment) {
                throw new Error('Cita no encontrada');
            }

            // Actualizar la cita con la nueva fecha y hora
            const updatedAppointment = await prisma.appointment.update({
                where: { id: parseInt(id) },
                data: {
                    datetime: availability.datetime,
                    status: 'rescheduled',
                },
            });

            // Marcar la disponibilidad anterior como disponible
            await prisma.availability.updateMany({
                where: {
                    datetime: currentAppointment.datetime,
                    serviceId: currentAppointment.serviceId,
                },
                data: { isBooked: false },
            });

            // Marcar la nueva disponibilidad como reservada
            await prisma.availability.update({
                where: { id: availabilityId },
                data: { isBooked: true },
            });

            return updatedAppointment;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error al reprogramar la cita:', error);
        return NextResponse.json({ error: 'Error al reprogramar la cita' }, { status: 500 });
    }
}