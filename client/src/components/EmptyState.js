import React from 'react';

const EmptyState = ({ icon, title, message }) => {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">{icon || '📄'}</div>
            <h3 className="empty-state-title">{title || 'Nothing here yet'}</h3>
            <p className="empty-state-text">{message || 'Check back later for new content.'}</p>
        </div>
    );
};

export default EmptyState;
