import React from 'react';
import './forbidden.css';

const NotFound: React.FC = () => {

    return (
        <div className="forbidden-container">
        <h1>403</h1>
        <h2>Forbidden</h2>
        <p>Sorry, you do not have permission to access this page.</p>
        </div>
    );
}
export default NotFound;
