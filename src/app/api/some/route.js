import { NextResponse } from "next/server";

export async function GET(request) {
    return NextResponse.json({ appointments: []});
}

export async function POST(request) {
    return NextResponse.json({ message: 'Cita creada' });
}