import React from 'react';
import PropTypes from 'prop-types';

const GradientProgressBar = ({ percentage }) => {
    // Ensure the percentage is between 0 and 100
    const validPercentage = Math.min(Math.max(percentage, 0), 100);

    // Determine the color based on the percentage
    let color;
    if (validPercentage <= 50) {
        // From red to yellow for percentages 0 to 50
        color = `rgb(${255}, ${Math.round(255 * (validPercentage / 50))}, 0)`;  // Red to Yellow
    } else {
        // From yellow to green for percentages 50 to 100
        color = `rgb(${Math.round(255 * (2 - validPercentage / 50))}, ${Math.round(255 * (validPercentage / 50))}, 0)`;  // Yellow to Green
    }

    return (
        <div style={styles.progressContainer}>
            <div
                style={{
                    ...styles.progressBar,
                    width: `${validPercentage}%`,
                    backgroundColor: color,
                }}
            />
            <div style={styles.progressText}>{validPercentage}%</div>
        </div>
    );
};

GradientProgressBar.propTypes = {
    percentage: PropTypes.number.isRequired,
};

const styles = {
    progressContainer: {
        width: '100%',
        backgroundColor: '#f3f3f3',
        borderRadius: '10px',
        height: '30px',
        position: 'relative',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    progressBar: {
        height: '100%',
        borderRadius: '10px',
        transition: 'width 0.3s ease-in-out',
    },
    progressText: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'black',
        fontWeight: 'bold',
    },
};

export default GradientProgressBar;
