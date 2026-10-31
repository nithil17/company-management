import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json(
                { error: "You must sign in" },
                { status: 401 }

            )
        }

        const memberships = await prisma.organizationMember.findMany({
            where: { userId: session.user.id }
        })

        if (memberships.length === 0) {
            return Response.json([]);
        }

        const projects = await prisma.project.findMany({
            where: { organizationId: memberships[0].organizationId },
            include: { organization: true }
        })

        return Response.json(projects)

    } catch (error) {
        console.error(error)
        return Response.json(
            { error: "Failed to fetch projects" },
            { status: 500 })
    }
}

export async function POST(request) {

    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json(
                { error: "You need to signin" },
                { status: 401 }
            )
        }

        const body = await request.json()



        const name = body.name?.trim();
        const description = body.description?.trim();
        const organizationId = body.organizationId?.trim();

        if (!name || !organizationId) {
            return Response.json(
                { error: "Project name and organization ID are required" },
                { status: 400 }
            );
        }

        const findUser = await prisma.organizationMember.findFirst({
            where: {
                userId: session.user.id,
                organizationId: organizationId
            }
        })

        if (!findUser) {
            return Response.json({
                error: "You are not a member of this organization"
            }, { status: 403 })
        }

        const newProject = await prisma.project.create({
            data: {
                name: name,
                description: description,
                organizationId: organizationId
            }
        })

        return Response.json(newProject, { status: 201 })

    } catch (error) {
        console.error("failed to create project error", error)
        return Response.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }


}