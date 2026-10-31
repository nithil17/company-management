import { auth } from "@/auth"

import { prisma } from "@/lib/prisma"

export async function PATCH(request, { params }) {
    const session = await auth()

    if (!session?.user?.id) {
        return Response.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const { id } = await params

    const body = await request.json()

    const name = body.name;
    const description = body.description;
    const status = body.status

    if (!name || !name.trim()) {
        return Response.json(
            { error: "Invalid Name" },
            { status: 400 }
        )
    }

    if (!["PLANNING", "ACTIVE", "COMPLETED", "ON_HOLD"].includes(status)) {
        return Response.json(
            { error: "Invalid Status" },
            { status: 400 }
        )
    }


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
            { error: "Project not found" },
            { status: 404 }
        )
    }

    const updateProject = await prisma.project.update({
        where: {
            id: id },
        data: {
            name: name,
            description: description,
            status: status
        }
    })

    return Response.json(
        {updateProject},
        {status:200}
    )



}

export async function DELETE(request,{params}) {

    const session = await auth();
    if(!session?.user?.id){
        return Response.json(
            {error: "No user found"},
            {status: 401}
        )
    }

    const { id } = await params;

    const project = await prisma.project.findFirst({
        where:{id: id,
            organization:{
                members:{
                    some:{userId: session.user.id}

            }
        }

    }})

    if(!project){
        return Response.json(
            {error:"Project Not Found"},
            {status: 404}
        )
    }

    await prisma.project.delete({
        where:{id: id}
    })

    return Response.json(
        {message: "Project deleted successfully"},
        {
            status:200
        }
    )
}