import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date || !serviceId) {
        return NextResponse.json({ error: 'Date and serviceId are required' }, { status: 400 });
    }

    try {
        const availabilities = await prisma.availability.findMany({
            where: {
                datetime: {
                    gte: new Date(date),
                    lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
                },
                isBlocked: false,
                isBooked: false,
                serviceId: parseInt(serviceId),
            },
            orderBy: { datetime: 'asc' },
        });
        return NextResponse.json(availabilities);
    } catch (error) {
        console.error('Error fetching availabilities:', error);
        return NextResponse.json({ error: 'Error fetching availabilities' }, { status: 500 });
    }
}