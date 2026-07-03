import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import '../App.css';

const TeacherDashboard = () => {
    const [pendingNotes, setPendingNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState({});
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get('/api/resources');
                // Filter to show only notes waiting for approval
                const unverified = res.data.filter(note => note.status === 'pending');
                setPendingNotes(unverified);
            } catch (err) {
                console.error('Error fetching notes', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    const handleCommentChange = (id, value) => {
        setComments(prev => ({ ...prev, [id]: value }));
    };

    const handleVerify = async (id, status) => {
        setActionLoading(id);
        try {
            const teacherComments = comments[id] || '';
            await api.put(`/api/resources/${id}/verify`, {
                status,
                teacherComments
            });

            // Remove the note from the list after action
            setPendingNotes(prev => prev.filter(note => note._id !== id));
            // Clean up comments state
            setComments(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        } catch (err) {
            console.error('Error updating note:', err);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="page-wrapper" style={{ maxWidth: '800px' }}>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Verification Queue</h1>
                        <p className="page-subtitle">
                            {pendingNotes.length > 0
                                ? `${pendingNotes.length} note${pendingNotes.length !== 1 ? 's' : ''} waiting for your review`
                                : 'Review and approve student-submitted notes'}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : pendingNotes.length === 0 ? (
                    <EmptyState
                        icon="&#9989;"
                        title="All caught up"
                        message="No pending notes to review. Check back later when students upload new materials."
                    />
                ) : (
                    pendingNotes.map(note => (
                        <div key={note._id} className="teacher-card">
                            <div className="teacher-card-header">
                                <div>
                                    <h3 className="card-title">{note.title}</h3>
                                    <p className="card-meta">
                                        <strong>Subject:</strong> {note.subject}
                                        &nbsp;&nbsp;|&nbsp;&nbsp;
                                        <strong>Semester:</strong> {note.semester}
                                    </p>
                                </div>
                                <a
                                    href={`${api.defaults.baseURL}/${note.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm"
                                >
                                    Review PDF
                                </a>
                            </div>

                            <div className="form-group" style={{ marginTop: '12px', marginBottom: '16px' }}>
                                <textarea
                                    className="teacher-comments-input"
                                    placeholder="Add feedback or comments (optional)..."
                                    value={comments[note._id] || ''}
                                    onChange={(e) => handleCommentChange(note._id, e.target.value)}
                                />
                            </div>

                            <div className="card-actions">
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleVerify(note._id, 'verified')}
                                    disabled={actionLoading === note._id}
                                >
                                    {actionLoading === note._id ? 'Updating...' : 'Approve'}
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleVerify(note._id, 'rejected')}
                                    disabled={actionLoading === note._id}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;