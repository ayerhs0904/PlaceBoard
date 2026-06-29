import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Plus, X, Building, Calendar, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'APPLIED', title: 'Applied', color: 'bg-blue-100 border-blue-500 text-blue-800' },
  { id: 'SHORTLISTED', title: 'Shortlisted', color: 'bg-yellow-100 border-yellow-500 text-yellow-800' },
  { id: 'INTERVIEW', title: 'Interview', color: 'bg-purple-100 border-purple-500 text-purple-800' },
  { id: 'OFFER', title: 'Offer', color: 'bg-green-100 border-green-500 text-green-800' },
  { id: 'REJECTED', title: 'Rejected', color: 'bg-red-100 border-red-500 text-red-800' }
];

function KanbanPage() {
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    companyId: '',
    roleApplied: '',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'APPLIED'
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/applications');
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/api/companies');
      setCompanies(response.data);
    } catch (error) {
      toast.error('Failed to fetch companies');
      console.error(error);
    }
  };

  const handleOpenModal = () => {
    fetchCompanies();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      companyId: '',
      roleApplied: '',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: '',
      status: 'APPLIED'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        company: { id: parseInt(formData.companyId) },
        roleApplied: formData.roleApplied,
        appliedDate: formData.appliedDate,
        notes: formData.notes,
        status: formData.status
      };
      await api.post('/api/applications', payload);
      toast.success('Application added successfully');
      handleCloseModal();
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add application');
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const appId = parseInt(draggableId);

    // Optimistically update UI
    const updatedApps = applications.map(app => {
      if (app.id === appId) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    setApplications(updatedApps);

    try {
      await api.patch(`/api/applications/${appId}/status`, { status: newStatus });
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
      // Revert on failure
      fetchApplications();
    }
  };

  const getApplicationsByStatus = (status) => {
    return applications.filter(app => app.status === status) || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Application Tracking</h1>
          <button
            onClick={handleOpenModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Application
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-8 items-start">
              {COLUMNS.map((column) => {
                const columnApps = getApplicationsByStatus(column.id);
                
                return (
                  <div key={column.id} className="flex-shrink-0 w-80 bg-gray-100 rounded-xl flex flex-col max-h-[calc(100vh-200px)]">
                    <div className={`p-3 rounded-t-xl border-t-4 border-opacity-50 flex justify-between items-center ${column.color.split(' ')[0]} ${column.color.split(' ')[1]}`}>
                      <h3 className={`font-semibold ${column.color.split(' ')[2]}`}>{column.title}</h3>
                      <span className="bg-white px-2 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                        {columnApps.length}
                      </span>
                    </div>

                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 p-3 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-gray-200' : ''}`}
                        >
                          {columnApps.map((app, index) => (
                            <Draggable key={app.id} draggableId={app.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-200 hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-bold text-gray-900 truncate pr-2">{app.company?.name || 'Unknown Company'}</h4>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${column.color}`}>
                                      {column.title}
                                    </span>
                                  </div>
                                  
                                  <div className="text-sm text-gray-600 space-y-2">
                                    {app.company?.sector && (
                                      <div className="flex items-center">
                                        <Building size={14} className="mr-2 text-gray-400" />
                                        <span className="truncate">{app.company.sector}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center">
                                      <Briefcase size={14} className="mr-2 text-gray-400" />
                                      <span className="truncate">{app.roleApplied}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar size={14} className="mr-2 text-gray-400" />
                                      <span>{new Date(app.appliedDate).toLocaleDateString()}</span>
                                    </div>
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
                );
              })}
            </div>
          </DragDropContext>
        )}
      </main>

      {/* Add Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Add New Application</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <select
                  required
                  value={formData.companyId}
                  onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>Select a company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name} ({company.sector})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Applied For</label>
                <input
                  type="text"
                  required
                  value={formData.roleApplied}
                  onChange={(e) => setFormData({...formData, roleApplied: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Applied</label>
                <input
                  type="date"
                  required
                  value={formData.appliedDate}
                  onChange={(e) => setFormData({...formData, appliedDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional details..."
                ></textarea>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium shadow-sm transition-colors"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanPage;
