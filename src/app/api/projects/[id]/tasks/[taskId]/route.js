
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

    const { id, taskId } = await params

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
            { error: "No project found" },
            { status: 404 }
        )
    }

    const task = await prisma.task.findFirst({
        where: { id: taskId, projectId: id }
    })

    if (!task) {
        return Response.json(
            { error: "No task found" },
            { status: 404 }
        )
    }

    const body = await request.json();
    const status = body.status

    const allowedStatuses = ["TODO", "IN_PROGRESS", "DONE"]

    if (!allowedStatuses.includes(status)) {
        return Response.json(
            { error: "Invalid task status" },
            { status: 400 }
        )
    }

    const updatedTask = await prisma.task.update({
        where: {
            id: taskId
        },
        data: {
            status: status
        }
    })

    return Response.json(updatedTask, { status: 200 })

}

export async function DELETE(request, { params }) {

      const session = await auth()

    if (!session?.user?.id) {
        return Response.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const { id, taskId } = await params

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
            { error: "No project found" },
            { status: 404 }
        )
    }

    const task = await prisma.task.findFirst({
        where: { id: taskId, projectId: id }
    })

    if (!task) {
        return Response.json(
            { error: "No task found" },
            { status: 404 }
        )
    }

    await prisma.task.delete({
        where:{id: taskId}
    }
    )

       return Response.json(
        {message: "Task deleted successfully"},
        {
            status:200
        }
    )

}