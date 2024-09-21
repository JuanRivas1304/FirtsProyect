import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = params;
        const { action } = await request.json();

        if (action !== 'cancel') {
            return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(id) },
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
        }

        if (appointment.userId !== session.user.id) {
            return NextResponse.json({ error: 'No autorizado para cancelar esta cita' }, { status: 403 });
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: { status: 'cancelled' },
        });

        // Aquí podrías agregar lógica para liberar la disponibilidad si es necesario

        return NextResponse.json({ message: 'Cita cancelada con éxito', appointment: updatedAppointment });
    } catch (error) {
        console.error('Error al cancelar la cita:', error);
        return NextResponse.json({ error: 'Error al cancelar la cita' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = params;
        const appointmentId = parseInt(id);

        // Verifica si la cita existe y pertenece al usuario actual
        const appointment = await prisma.appointment.findUnique({
            where: {
                id: appointmentId,
                userId: session.user.id
            }
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Cita no encontrada o no autorizada' }, { status: 404 });
        }

        // Si la cita existe, procede a eliminarla
        await prisma.appointment.delete({
            where: { id: appointmentId }
        });

        return NextResponse.json({ message: 'Cita cancelada con éxito' });
    } catch (error) {
        console.error('Error al cancelar la cita:', error);
        return NextResponse.json({ error: 'Error al cancelar la cita' }, { status: 500 });
    }
}