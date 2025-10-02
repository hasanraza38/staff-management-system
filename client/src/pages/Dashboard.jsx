import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../instance/api";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [report, setReport] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/report").then((res) => setReport(res.data));
    api.get("/candidate").then((res) => setCandidates(res.data));
    api.get("/job").then((res) => setJobs(res.data));
  }, []);


  return (
    <Sidebar activePage="overview">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Candidates</h3>
            <p className="text-2xl font-bold text-gray-800">{report.candidates || 0}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Open Jobs</h3>
            <p className="text-2xl font-bold text-gray-800">{report.openJobs || 0}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Assignments</h3>
            <p className="text-2xl font-bold text-gray-800">{report.assignments || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Candidates List</h2>
              <button 
                onClick={() => navigate('/candidates')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                View All Candidates
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {candidates.slice(0, 5).map(candidate => (
                    <tr key={candidate.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.skills}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.experience} years</td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Open Jobs</h2>
              <button 
                onClick={() => navigate('/job')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                View All Jobs
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                  
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.filter(job => job.isOpen).slice(0, 5).map(job => (
                    <tr key={job.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{job.client?.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{job.candidates?.length || 0}</td>
                    
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}