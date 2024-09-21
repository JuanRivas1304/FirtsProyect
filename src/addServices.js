const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addServices() {
    try {
        const services = [
            { name: 'Limpieza dental', description: 'Limpieza profesional de los dientes' },
            { name: 'Extracción dental', description: 'Extracción de dientes dañados o problemáticos' },
            { name: 'Blanqueamiento dental', description: 'Procedimiento para blanquear los dientes' },
            { name: 'Ortodoncia', description: 'Tratamiento para alinear los dientes' },
            { name: 'Implantes dentales', description: 'Reemplazo de dientes perdidos con implantes' },
        ];

        for (const service of services) {
            await prisma.service.create({
                data: service,
            });
        }

        console.log('Servicios agregados exitosamente');
    } catch (error) {
        console.error('Error al agregar servicios:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addServices();