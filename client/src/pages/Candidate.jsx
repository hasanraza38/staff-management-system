import React from 'react';
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { api } from '../instance/api';
import Sidebar from '../components/Sidebar';

const Candidate = () => {
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm();
  
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", skills: "", experience: "" });

  const fetchCandidates = async () => {
    try {
      const res = await api.get("/candidate", { params: { skill: search } });
      setCandidates(res.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => { 
    fetchCandidates(); 
  }, [search]);

  const onSubmit = async (data) => {
    try {
      await api.post("/candidate", data);
      reset();
      fetchCandidates();
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  const handleEdit = (candidate) => {
    setEditingId(candidate.id);
    setEditForm({
      name: candidate.name,
      skills: candidate.skills,
      experience: candidate.experience
    });
  };

  const handleUpdate = async (id) => {
    try {
      await api.patch(`/candidate/${id}`, editForm);
      setEditingId(null);
      fetchCandidates()
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: "", skills: "", experience: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await api.delete(`/candidate/${id}`);
        fetchCandidates(); 
      } catch (error) {
        console.error("Error deleting candidate:", error);
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Sidebar activePage="candidates">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-600 mt-1">Manage and search through candidate profiles</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Add New Candidate</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input 
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                  {...register("name", { 
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters"
                    }
                  })}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <input 
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.skills ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="React, Node.js, TypeScript"
                  {...register("skills", { 
                    required: "Skills are required",
                    minLength: {
                      value: 2,
                      message: "Skills must be at least 2 characters"
                    }
                  })}
                />
                {errors.skills && (
                  <p className="text-red-600 text-sm mt-1">{errors.skills.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years)
                </label>
                <input 
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.experience ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  type="number"
                  placeholder="3"
                  {...register("experience", { 
                    required: "Experience is required",
                    min: {
                      value: 0,
                      message: "Experience cannot be negative"
                    },
                    max: {
                      value: 50,
                      message: "Experience seems too high"
                    },
                    valueAsNumber: true
                  })}
                />
                {errors.experience && (
                  <p className="text-red-600 text-sm mt-1">{errors.experience.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {isSubmitting ? 'Adding...' : 'Add Candidate'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Candidate List</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {candidates.length} candidates found
                </p>
              </div>
              <div className="w-full sm:w-64">
                <input 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by skills..."
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map(candidate => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === candidate.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === candidate.id ? (
                        <input
                          type="text"
                          name="skills"
                          value={editForm.skills}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-600">{candidate.skills}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === candidate.id ? (
                        <input
                          type="number"
                          name="experience"
                          value={editForm.experience}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-600">{candidate.experience} years</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {editingId === candidate.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(candidate.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(candidate)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(candidate.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {candidates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No candidates found</div>
              <p className="text-gray-500 mt-2">
                {search ? 'Try adjusting your search terms' : 'Add your first candidate using the form above'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default Candidate;