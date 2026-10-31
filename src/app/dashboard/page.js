
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/dashboard-stats";
import DashboardHeader from "@/components/dashboard-header";
import OrganizationList from "@/components/organizations-list";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = session.user;

  const memberships = await prisma.organizationMember.findMany({
    where: { userId: session.user.id },
    include: { organization: true }
  });



  let totalMembers = 0;
  let activeProjects = 0;

  if (memberships.length > 0) {
    const organizationId = memberships[0].organization.id;

    totalMembers = await prisma.organizationMember.count({
      where: { organizationId }
    });

    activeProjects = await prisma.project.count({
      where: {
        organizationId: organizationId,
        status: "ACTIVE"
      }
    })
  }



  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <DashboardHeader user={user} />

      <h1 className="text-3xl font-bold text-gray-900">
        Workspace Overview.
      </h1>

      <p className="mt-2 text-gray-600">
        Manage your projects and tasks.
      </p>

      <DashboardStats totalMembers={totalMembers}
        activeProjects={activeProjects}
      />
      <OrganizationList />
    </main>
  );
}
