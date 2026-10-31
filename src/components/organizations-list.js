
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function OrganizationList() {
  const session = await auth();

  if (!session?.user?.id) {
    return <p>Please sign in to view your organizations.</p>;
  }

  try {
    const memberships = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      include: { organization: true }
    });

    if (memberships.length === 0) {
      return <p>You haven't joined any organization yet.</p>;
    }

    const organizationsWithCounts = await Promise.all(
      memberships.map(async (member) => {
        const totalMembers = await prisma.organizationMember.count({
          where: {
            organizationId: member.organization.id
          }
        });

        return { ...member, totalMembers };
      })
    );

    return (
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {organizationsWithCounts.map((member) => (
          <div
            key={member.id}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-900">
              {member.organization.name}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Slug: {member.organization.slug}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Role: {member.role}
            </p>

            <div className="mt-4 flex justify-between">
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-lg font-bold text-gray-900">
                {member.totalMembers}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    return <p>Unable to load organizations. Please try again.</p>;
  }
}
