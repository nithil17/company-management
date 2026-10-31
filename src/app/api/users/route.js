import { prisma } from "@/lib/prisma";
import { Boldonse } from "next/font/google";

export async function GET() {
  const users = await prisma.user.findMany();

  return Response.json(users);
}


export async function POST(request) {
  const body = await request.json();

  const email = await body.email?.trim();
  const name = await body.name?.trim();

  if(!body.email){
    return Response.json(
      {error: "Email is required" },
    {status:400})
  }

  if(!email.includes("@")){
    return Response.json(
      {error: "Invalid email"},
      {status:400}
    );
  }

  const existingUser = await prisma.user.findUnique(
    {where:{ email}}
  );

  if(existingUser){
    return Response.json(
      {error:"User Already Exists"},
      {status: 409}
    )
  }

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name
    }
  });

  return Response.json(user, { status: 201 });
}

