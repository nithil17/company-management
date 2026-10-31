import { auth } from "@/auth"

import { prisma } from "@/lib/prisma"

export async function GET(request, { params }) {

    const session = await auth()

    if (!session?.user?.id) {
        return Response.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const { id } = await params;

    const project = await prisma.project.findFirst({
        where: {
            id: id,

            organization: {
                members: {
                    some: { userId: session.user.id }
                }
            }
        }
    })

    if (!project) {
        return Response.json(
            { error: "Not found" },
            { status: 404 }
        )
    }

    const task = await prisma.task.findMany({
        where: { projectId: project.id },
        orderBy: { createdAt: "desc" }
    })


    return Response.json(task, { status: 200 })


}

export async function POST(request, { params }) {
    const session = await auth()

    if (!session?.user?.id) {
        return Response.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const { id } = await params

    const project = await prisma.project.findFirst({
        where: {
            id: id,
            organization: {
                members: {
                    some: { userId: session.user.id }
                }
            }
        }
    })

    if (!project) {
        return Response.json(
            { error: "Not found" },
            { status: 404 }
        )
    }

    const body = await request.json();

    const title = body.title;
   const description =
    typeof body.description === "string"
        ? body.description.trim() || null
        : null;

    if (typeof title!=="string" || !title.trim()) {
        return Response.json(
            { error: "Title is required" },
            { status: 400 })
    }

    const task = await prisma.task.create({
        data:{
            title: title.trim(),
            description: description,
            projectId: project.id
        }
    })

    return Response.json(task, { status: 201 })
}

