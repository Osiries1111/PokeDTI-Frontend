import React, { useState, useEffect, useRef } from 'react';
import "./cardreportadmin.css";
import { useRequireAuth } from '../../../auth/useRequireAuth';
import { apiUrl } from '../../../config/consts';
import axios from 'axios';
import { missigno } from '../../../assets/lobby-page';

interface Props {
    idReport: number;
    idUserReport: number;
    usernameReport: string;
    idUserReported: number;
    usernameReported: string;
    details: string;
    dressImgUrl?: string; // Optional, if you want to include the dress image URL
}

const CardReportAdmin: React.FC<Props> = ({ idReport, idUserReport, usernameReport, idUserReported, usernameReported, details, dressImgUrl }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const [shouldShowSeeMore, setShouldShowSeeMore] = useState(false);

    const { token } = useRequireAuth();

    useEffect(() => {
        if (descriptionRef.current) {
            const lineHeight = parseFloat(getComputedStyle(descriptionRef.current).lineHeight);
            const maxLines = 3;
            const maxHeight = lineHeight * maxLines;
            if (descriptionRef.current.scrollHeight > maxHeight) {
                setShouldShowSeeMore(true);
            }
        }
    }, []);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleReport = () => {
        try {
            axios.delete(`${apiUrl}/users/${idUserReported}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ).then(() => {
                console.log('User reported successfully');
            }
            )
        }
        catch (error) {
            console.error('Error processing report:', error);
        }

        try {
            axios.delete(`${apiUrl}/userinlobby/reports/${idReport}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            window.location.reload(); // Reload the page to reflect changes
        }
        catch (error) {
            console.error('Error processing report:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${apiUrl}/userinlobby/reports/${idReport}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Report deleted successfully');
            window.location.reload(); // Reload the page to reflect changes
        } catch (error) {
            console.error('Error deleting report:', error);
        }

    };

    return (
        <div className='container-user-admin-details'>
            <div>
                <h1 className='id-report-admin'>Number Report: {idReport}</h1>
                <h2 className='user-name-admin'>Report: {idUserReport} - {usernameReport}</h2>
                <h2 className='email-user-admin'>Reported: {idUserReported} - {usernameReported}</h2>
                <p
                    ref={descriptionRef}
                    className={`description-user-admin ${isExpanded ? 'expanded' : ''}`}
                >
                    {details}
                </p>
                {isExpanded && (
                    <div className="dressImgContainer">
                        <img src={dressImgUrl || missigno} alt="DressImg" className='DressImg' />
                    </div>
                )}
            </div>
            <div>
                {shouldShowSeeMore && (
                    <button className="see-more-button" onClick={toggleExpand}>
                        {isExpanded ? 'Ver menos' : 'Ver más'}
                    </button>
                )}
                <button onClick={handleDelete}>Delete</button>
                <button onClick={handleReport}>Proceder</button>
            </div>

        </div>
    );
};

export default CardReportAdmin;
