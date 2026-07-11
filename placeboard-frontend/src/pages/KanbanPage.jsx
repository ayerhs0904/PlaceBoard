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
    <div className="min-h-screen bg-[#050510] text-white">
      <Navbar />
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Applications</h1>
          <button
            onClick={handleOpenModal}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow"
          >
            + Add Application
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px] items-start">
            {COLUMNS.map(column => (
              <div key={column.id} className="w-80 flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col h-full min-h-[500px]">
                <div className={`${column.color} text-white font-bold px-3 py-2 rounded-xl mb-4 flex justify-between`}>
                  {column.title}
                  <span className="bg-black/20 text-white px-2 rounded-full text-sm flex items-center">
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
                                className="bg-white/5 p-4 rounded-xl shadow mb-3 cursor-pointer border border-white/10 hover:bg-white/10 transition-colors"
                              >
                                <h3 className="font-bold text-white mb-1">
                                  {app.companyName || 'Unknown Company'}
                                </h3>
                                {app.role && (
                                  <span className="text-xs bg-violet-900/50 text-violet-300 px-2 py-1 rounded inline-block mb-2 border border-violet-500/30">
                                    {app.role}
                                  </span>
                                )}
                                <div className="text-xs text-slate-400 mt-2">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-xl max-w-md w-full p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Add Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">Company *</label>
                <select
                  required
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-white/5 border-white/10 shadow-sm focus:border-violet-500 focus:ring-violet-500 border p-2 text-white [&>option]:text-black"
                >
                  <option value="" disabled>Select a company</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {companies.length === 0 && (
                  <p className="text-xs text-red-400 mt-1">
                    No available companies. Add a company first!
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Notes (Optional)</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-white/5 border-white/10 shadow-sm focus:border-violet-500 focus:ring-violet-500 border p-2 text-white placeholder-slate-500"
                  placeholder="Any details..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 border border-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-colors"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-xl max-w-md w-full p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">{selectedApp.companyName}</h2>
            {selectedApp.role && (
              <p className="text-violet-400 font-medium mb-4">{selectedApp.role}</p>
            )}
            
            <div className="space-y-3 text-sm text-slate-300">
              <p><strong className="text-white">Status:</strong> {selectedApp.status}</p>
              <p><strong className="text-white">Applied On:</strong> {new Date(selectedApp.appliedDate).toLocaleDateString()}</p>
              {selectedApp.notes && (
                <div>
                  <strong className="block mb-1 text-white">Notes:</strong>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">{selectedApp.notes}</div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 border border-white/10 transition-colors"
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
