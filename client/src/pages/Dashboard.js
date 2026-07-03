import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import '../App.css';

const Dashboard = () => {
    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const userRole = (localStorage.getItem('role') || '').toLowerCase().trim();

    // Fetch notes from the backend when the page loads
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get('/api/resources');
                setResources(res.data);
            } catch (err) {
                console.error('Error fetching notes from server');
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    // Filter notes based on search input
    const filteredNotes = resources.filter(note =>
        note.subject.toLowerCase().includes(search.toLowerCase()) ||
        note.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            <div className="page-wrapper">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Study Materials</h1>
                        <p className="page-subtitle">
                            {userRole === 'senior'
                                ? 'Browse verified notes or upload your own'
                                : 'Browse verified notes shared by seniors'}
                        </p>
                    </div>

                    {userRole === 'senior' && (
                        <Link to="/upload">
                            <button className="btn btn-success">
                                + Upload Note
                            </button>
                        </Link>
                    )}
                </div>

                {/* Search Bar */}
                <div className="search-wrapper">
                    <span className="search-icon">&#128269;</span>
                    <input
                        type="text"
                        placeholder="Search by subject or title..."
                        className="search-bar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        id="dashboard-search"
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <LoadingSpinner />
                ) : filteredNotes.length > 0 ? (
                    <div className="resource-grid">
                        {filteredNotes.map(note => (
                            <div key={note._id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h3 className="card-title">{note.title}</h3>
                                    <StatusBadge status={note.status} />
                                </div>
                                <p className="card-meta">
                                    <strong>Subject:</strong> {note.subject}
                                </p>
                                <p className="card-meta">
                                    <strong>Semester:</strong> {note.semester}
                                </p>

                                {/* Show teacher comments on rejected notes */}
                                {note.status === 'rejected' && note.teacherComments && (
                                    <p className="card-meta" style={{ marginTop: '8px', color: 'var(--red)' }}>
                                        <strong>Feedback:</strong> {note.teacherComments}
                                    </p>
                                )}

                                <hr className="card-divider" />

                                <a
                                    href={`${api.defaults.baseURL}/${note.fileUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="link-download"
                                >
                                    View / Download PDF
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon="📚"
                        title="No notes found"
                        message={
                            search
                                ? `No results matching "${search}". Try a different search term.`
                                : 'No verified notes available yet. Check back soon!'
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;