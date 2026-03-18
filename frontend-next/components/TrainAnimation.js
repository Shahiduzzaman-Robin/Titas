import React from 'react';
import '../styles/TrainAnimation.css';

const TrainAnimation = ({ className = '' }) => {
    return (
        <div className={`train-graphic-container ${className}`}>
            <div className="train-track-area">
                <img src="/train.svg" alt="Titas Train" className="moving-train" />
                <div className="track-rail"></div>
                <div className="track-sleepers">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="sleeper"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainAnimation;
