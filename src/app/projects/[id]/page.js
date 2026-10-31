
import { auth } from '@/auth';
import TasksSection from '@/components/tasks-section';
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation';

export default async function ProjectDetailsPage({ params }) {

    const session = await auth()

    if (!session?.user?.id) {
        redirect("/api/auth/signin")
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
        notFound()
    }

    return (

        <main

            className="min-h-screen bg-gray-950 px-6 py-12 text-white sm:px-10">

            <div className="mx-auto max-w-4xl rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-10">
                <h1
                    className='mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl'
                >{project.name}</h1>

                <p
                    className="whitespace-pre-wrap break-words text-base leading-7 text-gray-400">
                    {project.description || "No description provided"}</p>

                <p
                    className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${project.status === "ACTIVE"
                            ? "bg-green-500/10 text-green-400 ring-green-500/30"
                            : project.status==="COMPLETED"? "bg-blue-500/10 text-blue-400 ring-blue-500/30"
                            : project.status==="ON_HOLD"? "bg-yellow-500/10 text-yellow-400 ring-yellow-500/30"
                            : "bg-gray-700 text-gray-300 ring-gray-600"
                        } ring-1 `}

                >{project.status}</p>
            </div>

            <TasksSection project={project}/>


        </main>


    )
}