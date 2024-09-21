import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    const { username, email, password, phone } = await request.json();

    try {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                phone,
                role: 'CLIENT',
            },
        });

        return NextResponse.json({ message: 'Usuario registrado con éxito' }, { status: 201 });
    } catch (error) {
        console.error('Error en el registro:', error);
        return NextResponse.json({ error: 'Error en el registro' }, { status: 500 });
    }
}