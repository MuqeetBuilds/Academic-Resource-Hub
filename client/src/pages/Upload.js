import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import '../App.css';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [semester, setSemester] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
        }
    };

    const handleZoneClick = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });

        if (!file) {
            setStatus({ type: 'error', msg: 'Please select a file to upload.' });
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('subject', subject);
        formData.append('semester', semester);

        try {
            await api.post('/api/resources/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStatus({ type: 'success', msg: 'Uploaded successfully! Your notes are pending verification.' });

            // Clear the form
            setTitle('');
            setSubject('');
            setSemester('');
            setFile(null);

            // Redirect to dashboard after a short delay
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.msg || 'Upload failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="page-wrapper" style={{ maxWidth: '560px' }}>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Upload Study Material</h1>
                        <p className="page-subtitle">Share your notes with fellow students</p>
                    </div>
                </div>

                {status.msg && (
                    <div className={`status-msg status-msg-${status.type}`}>
                        {status.msg}
                    </div>
                )}

                <div className="card">
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="upload-title">Note Title</label>
                            <input
                                id="upload-title"
                                type="text"
                                placeholder="e.g. Unit 1 — Java Servlets"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="upload-subject">Subject</label>
                            <input
                                id="upload-subject"
                                type="text"
                                placeholder="e.g. Web Development"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="upload-semester">Semester</label>
                            <input
                                id="upload-semester"
                                type="text"
                                placeholder="e.g. 6"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">File (PDF or DOC)</label>
                            <div
                                className={`file-upload-zone ${file ? 'has-file' : ''}`}
                                onClick={handleZoneClick}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx"
                                />
                                {file ? (
                                    <p className="file-name">{file.name}</p>
                                ) : (
                                    <>
                                        <p style={{ fontSize: '1.5rem', marginBottom: '4px' }}>&#128196;</p>
                                        <p>Click to select a file</p>
                                        <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>PDF, DOC, DOCX — Max 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success btn-block btn-lg"
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Upload to Hub'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Upload;