import connectToDatabase from '@/lib/mongodb';
import Client from '@/models/Client';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  await connectToDatabase();

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Missing client id' }, { status: 400 });
  }

  try {
    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error deleting client' },
      { status: 500 }
    );
  }
}
