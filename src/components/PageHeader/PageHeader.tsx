import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
    title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
    return (
        <div className="page-header">
            <h1 className="page-header-title">{title}</h1>
        </div>
    );
};

export default PageHeader;
