import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { sendConfirmationEmail } from '@/utils/emailService';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;

    try {
        const appointment = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: { status: 'confirmed' },
            include: { user: true, service: true }
        });

        // Enviar correo de confirmación
        await sendConfirmationEmail(appointment.user.email, {
            date: appointment.datetime.toLocaleDateString(),
            time: appointment.datetime.toLocaleTimeString(),
            serviceName: appointment.service.name
        });

        return NextResponse.json(appointment);
    } catch (error) {
        console.error('Error al confirmar la cita:', error);
        return NextResponse.json({ error: 'Error al confirmar la cita' }, { status: 500 });
    }
}