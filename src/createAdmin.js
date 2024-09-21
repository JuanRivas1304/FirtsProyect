const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    const email = 'admin@example.com';
    const password = 'adminpassword';
    const hashedPassword = await bcryptjs.hash(password, 10);

    try {
        const admin = await prisma.user.create({
            data: {
                username: 'Admin',
                email: email,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log('Admin created successfully:', admin);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();