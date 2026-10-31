
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "You must sign in to create an organization" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const name = body.name?.trim();
    const slug = body.slug?.trim().toLowerCase();
    const userId = session.user.id;

    if (!name || !slug) {
      return Response.json(
        { error: "Name and slug are mandatory" },
        { status: 400 }
      );
    }

    const existingOrganization = await prisma.organization.findUnique({
      where: { slug }
    });

    if (existingOrganization) {
      return Response.json(
        { error: "Organization already exists" },
        { status: 409 }
      );
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        members: {
          create: {
            userId,
            role: "OWNER"
          }
        }
      },
      include: { members: true }
    });

    return Response.json(organization, { status: 201 });
  } catch (error) {
    console.error("Create organization error:", error);

    return Response.json(
      { error: "Failed to create organization" },
      { status: 500 }
    );
  }


}

export async function GET() {
    try {
        const session = await auth()

        if(!session?.user?.id){
            return Response.json(
                    {error: "No User ID found"},
                    {status:401}
            )
        }
        const memberships = await prisma.organizationMember.findMany({
            where:{userId: session.user.id},
            include:{organization:true}
        })
    return Response.json(memberships)
    } catch (error) {
           console.error("Fetch organizations error:", error);
        return Response.json({error:"Failed to fetch organizations"},{status:500})
    }
}