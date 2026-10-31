

export default function StatCard({ title, value }) {
    return (

        <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">{title}</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">{value}</h2>
        </div>
    )
}

