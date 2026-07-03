import React from 'react';

const StatusBadge = ({ status }) => {
    const badgeClass = {
        verified: 'badge badge-verified',
        pending: 'badge badge-pending',
        rejected: 'badge badge-rejected'
    };

    return (
        <span className={badgeClass[status] || 'badge'}>
            {status}
        </span>
    );
};

export default StatusBadge;
