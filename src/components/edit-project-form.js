"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";

export default function EditProjectForm({ project }) {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description || "");
    const [status, setStatus] = useState(project.status);
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving]= useState(false)





    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setSuccess("")

        try {
            setIsSaving(true)
            const response = await fetch(`/api/projects/${project.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "name": name,
                        "description": description,
                        "status": status
                    })
                })
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error)
            }

            const data = await response.json();
            setSuccess("Project Updated Successfully")
            setIsEditing(false)
            router.refresh();
        } catch (error) {
            console.error(error)
            setError(error.message)
        }finally{
            setIsSaving(false)
        }
    }

    function handleCancel(){
        setName(project.name)
        setDescription(project.description || "")
        setStatus(project.status)
        setIsEditing(false)
    }

    return (


        <div>
            {!isEditing && ( <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
            >Edit</button>)}



            {isEditing && (<form
                onSubmit={handleSubmit}
                className="mt-5 space-y-2 border-t border-gray-800 pt-5"
            >

                <div
                    className="mb-4 flex flex-col gap-1"
                >
                    <label>Project Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-white"
                    />

                </div>

                <div className="mb-4 flex flex-col gap-1">

                    <label>
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-white"
                    />
                </div>

                <div className="mb-4 flex flex-col gap-1">
                    <label>Status</label>
                    <select
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                        className="rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-white"
                    >
                        <option value="PLANNING"
                        >
                            Planning</option>
                        <option value="ACTIVE"
                        >
                            Active</option>
                        <option value="COMPLETED"
                        >
                            Completed</option>
                        <option value="ON_HOLD"
                        >
                            On-Hold</option>
                    </select>
                </div>

                <div className="flex justify-between">

                    <div>
                        <button

                        disabled={isSaving}

                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
                        >{isSaving?  "Saving.....":"Save Changes"}</button>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleCancel()}

                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
                    >Cancel</button>
                </div>



                {error && <p>{error}</p>}

                {success && <p>{success}</p>}

            </form >)}
        </div>


    )
}