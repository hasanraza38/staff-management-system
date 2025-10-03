import React from 'react';
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { api } from '../instance/api';
import Sidebar from '../components/Sidebar';

const Jobs = () => {
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm();
  
  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [assigningJobId, setAssigningJobId] = useState(null); 
  const [assignmentForm, setAssignmentForm] = useState({ candidateId: "" });
  const [editForm, setEditForm] = useState({ 
    title: "", 
    isOpen: true, 
    clientId: "" 
  });

  const fetchJobs = async () => {
    try {
      const params = search ? { title: search } : {};
      const res = await api.get("/job", { params });
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get("/client");
      setClients(res.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await api.get("/candidate");
      setCandidates(res.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => { 
    const timer = setTimeout(() => {
      fetchJobs(); 
    }, 300); 
    
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchClients();
    fetchCandidates();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post("/job", data);
      reset();
      fetchJobs();
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const handleAssignCandidate = async (jobId) => {
    if (!assignmentForm.candidateId) {
      alert("Please select a candidate");
      return;
    }

    try {
      await api.post(`/job/${jobId}/assign`, {
        candidateId: assignmentForm.candidateId
      });
      setAssigningJobId(null);
      setAssignmentForm({ candidateId: "" });
      fetchJobs();
      alert("Candidate assigned successfully!");
    } catch (error) {
      console.error("Error assigning candidate:", error);
      alert("Failed to assign candidate");
    }
  };

  const startAssignment = (job) => {
    setAssigningJobId(job.id);
    setAssignmentForm({ candidateId: "" });
  };

  const cancelAssignment = () => {
    setAssigningJobId(null);
    setAssignmentForm({ candidateId: "" });
  };

  const handleEdit = (job) => {
    setEditingId(job.id);
    setEditForm({
      title: job.title,
      isOpen: job.isOpen,
      clientId: job.clientId
    });
  };

  const handleUpdate = async (id) => {
    try {
      await api.patch(`/job/${id}`, editForm);
      setEditingId(null);
      fetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ title: "", isOpen: true, clientId: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await api.delete(`/job/${id}`);
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAssignmentChange = (e) => {
    const { value } = e.target;
    setAssignmentForm({ candidateId: value });
  };

  const toggleJobStatus = async (job) => {
    try {
      await api.patch(`/job/${job.id}`, { isOpen: !job.isOpen });
      fetchJobs();
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const removeAssignment = async (jobId, candidateId) => {
    if (window.confirm("Are you sure you want to remove this candidate from the job?")) {
      try {
        await api.delete(`/job/${jobId}/remove/${candidateId}`);
        fetchJobs();
        alert("Candidate removed from job!");
      } catch (error) {
        console.error("Error removing assignment:", error);
        alert("Failed to remove candidate from job");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Sidebar activePage="jobs">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
            <p className="text-gray-600 mt-1">Manage job postings, applications, and candidate assignments</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Add New Job</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input 
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="Frontend Developer"
                  {...register("title", { 
                    required: "Job title is required",
                    minLength: {
                      value: 2,
                      message: "Title must be at least 2 characters"
                    }
                  })}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select 
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.clientId ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  {...register("clientId", { 
                    required: "Client selection is required"
                  })}
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {errors.clientId && (
                  <p className="text-red-600 text-sm mt-1">{errors.clientId.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register("isOpen")}
              />
              <label className="ml-2 block text-sm text-gray-700">
                Open
              </label>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {isSubmitting ? 'Adding...' : 'Add Job'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Job Listings</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {jobs.length} jobs found • 
                  <span className="text-green-600 ml-1">
                    {jobs.filter(job => job.isOpen).length} open
                  </span>
                </p>
              </div>
              <div className="w-full sm:w-64">
                <input 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by job title..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === job.id ? (
                        <input
                          type="text"
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === job.id ? (
                        <select
                          name="clientId"
                          value={editForm.clientId}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a client</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-sm text-gray-600">
                          {clients.find(client => client.id === job.clientId)?.name || `Client #${job.clientId}`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleJobStatus(job)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          job.isOpen 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {job.isOpen ? 'Open' : 'Closed'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {job.candidates && job.candidates.map(assignment => (
                          <div key={assignment.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <span className="text-sm text-gray-700">
                              {assignment.candidate?.name}
                            </span>
                            <button
                              onClick={() => removeAssignment(job.id, assignment.candidateId)}
                              className="text-red-600 hover:text-red-800 text-xs font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        
                        {assigningJobId === job.id ? (
                          <div className="flex space-x-2 mt-2">
                            <select
                              value={assignmentForm.candidateId}
                              onChange={handleAssignmentChange}
                              className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select candidate</option>
                              {candidates.map(candidate => (
                                <option key={candidate.id} value={candidate.id}>
                                  {candidate.name} - {candidate.skills}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignCandidate(job.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              Assign
                            </button>
                            <button
                              onClick={cancelAssignment}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startAssignment(job)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium mt-2"
                          >
                            + Assign Candidate
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {editingId === job.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(job.id)}
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
                              onClick={() => handleEdit(job)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(job.id)}
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

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No jobs found</div>
              <p className="text-gray-500 mt-2">
                {search ? 'Try adjusting your search terms' : 'Add your first job using the form above'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default Jobs;