import connectToDatabase from '@/lib/mongodb';
import Client from '@/models/Client';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectToDatabase();

  try {
    const data = await req.json();

    // Vérifie les champs obligatoires
    if (!data.nom || !data.prenom || !data.numeroRegistreCommerce) {
      return NextResponse.json(
        { error: 'Nom, prénom et numéro RC sont obligatoires.' },
        { status: 400 }
      );
    }

    const client = new Client(data);
    await client.save();

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création.' },
      { status: 500 }
    );
  }
}
