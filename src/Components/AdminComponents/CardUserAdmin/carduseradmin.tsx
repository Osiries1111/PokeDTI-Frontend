import React, { useState, useEffect, useRef } from 'react';
import "./carduseradmin.css";

interface Props {
    idUser: number;
    profileImg: string;
    username: string;
    email: string;
    details: string;
}

const CardUserAdmin: React.FC<Props> = ({idUser, profileImg, username, details, email}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const [shouldShowSeeMore, setShouldShowSeeMore] = useState(false);

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


    const handleDeleteUser = () => {
        console.log(idUser);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className='container-user-admin-details'>
            <div className='user-info-admin'>
                <h1 className='id-user-admin'>User ID: {idUser}</h1>
                <img src={profileImg} alt="profile image" />
                <h2 className='user-name-admin'>{username}</h2>
                <h2 className='email-user-admin'>Email: {email}</h2>
                <p
                    ref={descriptionRef}
                    className={`description-user-admin ${isExpanded ? 'expanded' : ''}`}
                    >
                    Description: {details}
                </p>

            </div>
            <div className='buttons-admin-card'>
                
                {shouldShowSeeMore && (
                    <button className="see-more-button" onClick={toggleExpand}>
                    {isExpanded ? 'Ver menos' : 'Ver más'}
                    </button>
                )}
                <button onClick={handleDeleteUser}>Delete</button>
            </div>

        </div>
    );
};

export default CardUserAdmin;
