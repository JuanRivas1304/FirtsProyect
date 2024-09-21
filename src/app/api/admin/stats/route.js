import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const stats = await prisma.appointment.groupBy({
            by: ['status'],
            _count: {
                _all: true
            }
        });

        console.log('Estadísticas brutas:', stats); // Log para depuración

        const formattedStats = {
            pendiente: 0,
            reserved: 0,
            cancelled: 0,
            completed: 0
        };

        stats.forEach(stat => {
            if (stat.status in formattedStats) {
                formattedStats[stat.status] = stat._count._all;
            }
        });

        console.log('Estadísticas formateadas:', formattedStats); // Log para depuración

        return NextResponse.json(formattedStats);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
    }
}