import StatCard from "./stat-card";

export default function DashboardStats({totalMembers, activeProjects}){


    const stats = [
  { title: "Active Projects", value: activeProjects },
  { title: "Open Tasks", value: 24 },
  { title: "Team Members", value: totalMembers }
];
return (
<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
    {stats.map((stat)=>( <StatCard key={stat.title}
    title={stat.title}
    value={stat.value}/>)

    )}
</div>
);
}