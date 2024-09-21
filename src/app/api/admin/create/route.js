import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const { username, email, password } = await request.json();

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'El email ya está en uso' }, { status: 400 });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newAdmin = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        return NextResponse.json({ message: 'Administrador creado con éxito', userId: newAdmin.id });
    } catch (error) {
        console.error('Error al crear administrador:', error);
        return NextResponse.json({ error: 'Error al crear administrador' }, { status: 500 });
    }
}