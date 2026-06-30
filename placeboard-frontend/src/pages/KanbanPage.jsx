import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Plus, X, Building, Calendar, Briefcase, Trash2, ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'APPLIED', title: 'Applied', color: 'bg-blue-500' },
  { id: 'SHORTLISTED', title: 'Shortlisted', color: 'bg-yellow-500' },
  { id: 'INTERVIEW', title: 'Interview', color: 'bg-purple-500' },
  { id: 'OFFER', title: 'Offer', color: 'bg-green-500' },
  { id: 'REJECTED', title: 'Rejected', color: 'bg-red-500' }
];

function KanbanPage() {
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [loadingRounds, setLoadingRounds] = useState(false);

  const [formData, setFormData] = useState({
    companyId: '',
    roleApplied: '',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'APPLIED'
  });

  const [roundData, setRoundData] = useState({
    roundType: 'APTITUDE',
    result: 'PENDING',
    questionsAsked: ''
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
      
      // Update selected app status in drawer if it's open
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update status');
      // Revert on failure
      fetchApplications();
    }
  };

  const getApplicationsByStatus = (status) => {
    return applications.filter(app => app.status === status) || [];
  };

  // Drawer functions
  const handleCardClick = (app) => {
    setSelectedApp(app);
    setIsDrawerOpen(true);
    fetchRounds(app.id);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedApp(null);
      setRounds([]);
      setRoundData({ roundType: 'APTITUDE', result: 'PENDING', questionsAsked: '' });
    }, 300); // wait for animation
  };

  const fetchRounds = async (appId) => {
    try {
      setLoadingRounds(true);
      const response = await api.get(`/api/applications/${appId}/rounds`);
      setRounds(response.data);
    } catch (error) {
      toast.error('Failed to fetch rounds');
      console.error(error);
    } finally {
      setLoadingRounds(false);
    }
  };

  const handleAddRound = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await api.post(`/api/applications/${selectedApp.id}/rounds`, roundData);
      toast.success('Round added successfully');
      setRoundData({ roundType: 'APTITUDE', result: 'PENDING', questionsAsked: '' });
      fetchRounds(selectedApp.id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add round');
    }
  };

  const handleDeleteApplication = async () => {
    if (!selectedApp) return;
    
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await api.delete(`/api/applications/${selectedApp.id}`);
        toast.success('Application deleted');
        closeDrawer();
        fetchApplications();
      } catch (error) {
        toast.error('Failed to delete application');
      }
    }
  };

  const getResultIcon = (result) => {
    switch(result) {
      case 'PASS': return <CheckCircle2 size={16} className="text-green-600" />;
      case 'FAIL': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-hidden">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col">
        <div className="flex justify-between items-center mb-8 flex-shrink-0">
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
            <div className="flex flex-row gap-4 overflow-x-auto pb-4 items-start flex-1 min-h-0">
              {COLUMNS.map((column) => {
                const columnApps = getApplicationsByStatus(column.id);
                
                return (
                  <div key={column.id} className="flex-shrink-0 w-72 min-w-72 bg-gray-100 rounded-xl flex flex-col max-h-full min-h-96 p-4">
                    <div className={`${column.color} text-white font-bold px-3 py-2 rounded-lg mb-3 flex justify-between items-center`}>
                      <h3>{column.title}</h3>
                      <span className="bg-white px-2 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                        {columnApps.length}
                      </span>
                    </div>

                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-gray-200 rounded-lg' : ''}`}
                        >
                          {columnApps.map((app, index) => (
                            <Draggable key={app.id} draggableId={app.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => handleCardClick(app)}
                                  className={`bg-white rounded-lg p-4 shadow-sm mb-3 hover:shadow-md transition-shadow cursor-pointer ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-bold text-gray-800 truncate pr-2">{app.company?.name || 'Unknown Company'}</h4>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <div className="text-sm text-gray-600 truncate">{app.roleApplied}</div>
                                    <div className="text-xs text-gray-400">{new Date(app.appliedDate).toLocaleDateString()}</div>
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

      {/* Drawer Backdrop */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Right Drawer */}
      <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedApp && (
          <>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                Application Details
              </h2>
              <button onClick={closeDrawer} className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-full transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Application Details Section */}
              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedApp.company?.name}</h3>
                  <p className="text-blue-600 font-medium">{selectedApp.roleApplied}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block
                      ${COLUMNS.find(c => c.id === selectedApp.status)?.color || 'bg-gray-100'}`}>
                      {selectedApp.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Date Applied</span>
                    <span className="font-medium text-gray-900">{new Date(selectedApp.appliedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {selectedApp.notes && (
                  <div>
                    <span className="text-gray-500 block mb-1 text-sm">Notes</span>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{selectedApp.notes}</p>
                  </div>
                )}
              </div>

              {/* Rounds Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Interview Rounds</h3>
                
                {loadingRounds ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : rounds.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-lg">No rounds recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {rounds.map((round) => (
                      <div key={round.id} className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-gray-800">{round.roundType}</span>
                          <span className="flex items-center text-xs font-bold gap-1 bg-white px-2 py-1 rounded-full shadow-sm border border-gray-100">
                            {getResultIcon(round.result)}
                            {round.result}
                          </span>
                        </div>
                        {round.questionsAsked && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Questions/Notes:</span>
                            <p className="mt-1 whitespace-pre-wrap">{round.questionsAsked}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Round Form */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Plus size={16} className="mr-1" /> Add Round
                </h4>
                <form onSubmit={handleAddRound} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Round Type</label>
                      <select
                        value={roundData.roundType}
                        onChange={(e) => setRoundData({...roundData, roundType: e.target.value})}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="APTITUDE">Aptitude</option>
                        <option value="CODING">Coding</option>
                        <option value="TECHNICAL">Technical</option>
                        <option value="HR">HR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Result</label>
                      <select
                        value={roundData.result}
                        onChange={(e) => setRoundData({...roundData, result: e.target.value})}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PASS">Pass</option>
                        <option value="FAIL">Fail</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Questions / Notes</label>
                    <textarea
                      rows="2"
                      value={roundData.questionsAsked}
                      onChange={(e) => setRoundData({...roundData, questionsAsked: e.target.value})}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. System design for URL shortener..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                  >
                    Save Round
                  </button>
                </form>
              </div>
            </div>

            {/* Drawer Footer / Delete */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={handleDeleteApplication}
                className="w-full flex justify-center items-center py-2 px-4 border border-red-200 text-red-600 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Application
              </button>
            </div>
          </>
        )}
      </div>

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
