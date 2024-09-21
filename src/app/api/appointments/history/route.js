import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                service: true, // Asegúrate de incluir esto
            },
            orderBy: {
                datetime: 'desc'
            }
        });

        return NextResponse.json(appointments);
    } catch (error) {
        console.error('Error al obtener el historial de citas:', error);
        return NextResponse.json({ error: 'Error al obtener el historial de citas' }, { status: 500 });
    }
}