import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma";
import CreateProjectForm from "@/components/create-project-form";
import EditProjectForm from "@/components/edit-project-form";
import DeleteProjectButton from "@/components/delete-project-button"
import Link from "next/link";

export default async function ProjectPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/signin")
    }

    const memberships = await prisma.organizationMember.findMany({
        where: { userId: session.user.id }
    })

    if (memberships.length === 0) {
        return <p>You haven't joined an organization yet.</p>;
    }

    const projects = await prisma.project.findMany({
        where: { organizationId: memberships[0].organizationId }
    })

    return (
        <div className="min-h-screen bg-gray-950 p-8 text-gray-100">
            <h2 className="text-3xl font-bold text-gray-50">
                Projects
            </h2>
            <p className="mt-8 text-gray-50">Manage Your Projects</p>


            <CreateProjectForm organizationId={memberships[0].organizationId}/>


            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                {projects.length === 0 ? (
                    <p className="text-gray-400">No projects yet. Create your first project.</p>
                ) : (projects.map((project) => (
                    <div key={project.id}
                        className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm transition hover:border-gray-700 hover:shadow-lg mb-4">
                        <h1

                        className="text-lg font-bold text-white"

                        ><Link
                            href={`/projects/${project.id}`}
                            className="transition hover:text-blue-400"
                        >
                         {project.name}
                        </Link>

                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            {project.description || "No description provided"}
                        </p>

                        <div className="mt-4">
                            <span className="rounded-full bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-300">
                                {project.status}
                            </span>
                        </div>
                        <EditProjectForm project={project}/>
                        <DeleteProjectButton projectId={project.id} />
                    </div>
                )))}
            </div>
        </div>
    );

}