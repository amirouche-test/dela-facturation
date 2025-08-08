import connectToDatabase from '@/lib/mongodb';
import Client from '@/models/Client';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDatabase();

  try {
    const clients = await Client.find();
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération des clients' },
      { status: 500 }
    );
  }
}
