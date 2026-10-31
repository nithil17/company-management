"use client"


import { useEffect, useState } from "react"

export default function TasksSection({ project }) {

    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        setIsSubmitting(true)
        setError("")
        try {
            const response = await fetch(`/api/projects/${project.id}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to create task")
            }


            const newTask = await response.json()
            setTasks(prev => [...prev, newTask])

            setTitle("")
            setDescription("")


        } catch (error) {
            setError(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleStatusChange(taskId, newStatus) {
        try {
            const response = await fetch(
                `/api/projects/${project.id}/tasks/${taskId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            )

            if (!response.ok) {
                throw new Error("Failed to update task status")
            }

            const updatedTask = await response.json()

            setTasks(prev =>
                prev.map(task =>
                    task.id === taskId ? updatedTask : task
                )
            )

        } catch (error) {
            setError(error.message)
        }
    }

    async function handleDeleteTask(taskId) {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return
        }

        try {
            const response = await fetch(
                `/api/projects/${project.id}/tasks/${taskId}`,
                { method: "DELETE" }
            )

            if (!response.ok) {
                throw new Error("Failed to delete task")
            }

            setTasks(prev => prev.filter(task => task.id !== taskId))

        } catch (error) {
            setError(error.message)
        }
    }


    useEffect(() => {
        async function fetchTasks() {

            try {
                const response = await fetch(`/api/projects/${project.id}/tasks`)

                if (!response.ok) {
                    throw new Error("Failed to fetch tasks")
                }

                const text = await response.text()
                console.log("GET response:", response.status, text)

                const data = text ? JSON.parse(text) : []
                setTasks(data)

            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoading(false)
            }

        }
        fetchTasks()
    }, [project.id]
    )

    return (
        <div className="mt-10 space-y-8">
            <form

                onSubmit={handleSubmit}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold text-white">Task creation form</h2>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-300 mb-2"
                    >Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Description
                    </label>
                    <textarea
                        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-50">
                    {isSubmitting ? "Creating..." : "Create Task"}
                </button>

            </form>
            <div className="space-y-4" >
                {isLoading ? (<p>Loading...</p>)
                    :
                    error ? (<p>{error}</p>)
                        : tasks.length === 0 ? (
                            <p>No Tasks Yet</p>
                        ) : tasks.map((task) => (
                            <div key={task.id}
                                className=" rounded-xl border border-gray-800 bg-gray-900 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-lg font-semibold text-white">
                                        {task.title}
                                    </h3>

                                    <div>

                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                                        >
                                            <option value="TODO">To Do</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="DONE">Done</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>
                                <p className="mt-2 text-sm text-gray-400">
                                    {task.description || "No description"}
                                </p>
                            </div>
                        )
                        )}

            </div>
        </div>

    )

}