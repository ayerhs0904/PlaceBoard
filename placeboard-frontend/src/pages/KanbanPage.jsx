import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'APPLIED', title: 'APPLIED', color: 'bg-blue-500' },
  { id: 'SHORTLISTED', title: 'SHORTLISTED', color: 'bg-yellow-500' },
  { id: 'INTERVIEW', title: 'INTERVIEW', color: 'bg-purple-500' },
  { id: 'OFFER', title: 'OFFER', color: 'bg-green-500' },
  { id: 'REJECTED', title: 'REJECTED', color: 'bg-red-500' }
];

const KanbanPage = () => {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  const [formData, setFormData] = useState({
    companyId: '',
    notes: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/applications');
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
    }
  };

  const handleOpenModal = async () => {
    try {
      const response = await api.get('/api/companies/not-applied');
      setCompanies(response.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyId) {
      toast.error('Please select a company');
      return;
    }
    
    try {
      const payload = {
        companyId: parseInt(formData.companyId),
        notes: formData.notes
      };
      await api.post('/api/applications', payload);
      toast.success('Application added successfully');
      setIsModalOpen(false);
      setFormData({ companyId: '', notes: '' });
      fetchApplications();
    } catch (error) {
      toast.error('Failed to add application');
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const appId = parseInt(draggableId);

    // Optimistic UI update
    const updatedApps = applications.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApps);

    try {
      await api.patch(`/api/applications/${appId}/status`, { status: newStatus });
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
      fetchApplications(); // Revert on failure
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Applications</h1>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
          >
            + Add Application
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px] items-start">
            {COLUMNS.map(column => (
              <div key={column.id} className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-4 flex flex-col h-full min-h-[500px]">
                <div className={`${column.color} text-white font-bold px-3 py-2 rounded mb-4 flex justify-between`}>
                  {column.title}
                  <span className="bg-white text-gray-800 px-2 rounded-full text-sm flex items-center">
                    {applications.filter(a => a.status === column.id).length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 overflow-y-auto"
                    >
                      {applications
                        .filter(app => app.status === column.id)
                        .map((app, index) => (
                          <Draggable key={app.id} draggableId={app.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedApp(app)}
                                className="bg-white p-4 rounded-lg shadow mb-3 cursor-pointer border border-gray-200 hover:shadow-md"
                              >
                                <h3 className="font-bold text-gray-900 mb-1">
                                  {app.companyName || 'Unknown Company'}
                                </h3>
                                {app.role && (
                                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded inline-block mb-2">
                                    {app.role}
                                  </span>
                                )}
                                <div className="text-xs text-gray-500 mt-2">
                                  Applied: {new Date(app.appliedDate).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company *</label>
                <select
                  required
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                >
                  <option value="" disabled>Select a company</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {companies.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No available companies. Add a company first!
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  placeholder="Any details..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={companies.length === 0}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-2">{selectedApp.companyName}</h2>
            {selectedApp.role && (
              <p className="text-purple-600 font-medium mb-4">{selectedApp.role}</p>
            )}
            
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Status:</strong> {selectedApp.status}</p>
              <p><strong>Applied On:</strong> {new Date(selectedApp.appliedDate).toLocaleDateString()}</p>
              {selectedApp.notes && (
                <div>
                  <strong className="block mb-1">Notes:</strong>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">{selectedApp.notes}</div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanPage;
