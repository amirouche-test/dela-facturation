import connectToDatabase from '@/lib/mongodb';
import Client from '@/models/Client';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  await connectToDatabase();

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Missing client id' }, { status: 400 });
  }

  try {
    const data = await req.json();

    const client = await Client.findByIdAndUpdate(id, data, { new: true });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour.' },
      { status: 500 }
    );
  }
}
