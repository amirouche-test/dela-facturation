import connectToDatabase from '@/lib/mongodb';
import Information from '@/models/Information';

export async function PATCH(req) {
  await connectToDatabase();

  const data = await req.json();

  let info = await Information.findOne();

  if (!info) {
    info = new Information(data);
  } else {
    Object.assign(info, data);
  }

  await info.save();

  return new Response(JSON.stringify(info), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  await connectToDatabase();
  const info = await Information.findOne();
  return new Response(JSON.stringify(info), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
