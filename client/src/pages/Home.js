import Nav from '../components/Nav';
import { useState } from 'react';
import AuthModal from '../components/AuthModal';

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    
    // Replace with actual authentication logic
    const authToken = false; 

    const handleClick = () => {
        setShowModal(true);
        setIsSignUp(true); // Change to false if you want to show the login modal
    };

    return (
        <div className='overlay'>
            <Nav
                authToken={authToken}
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />

            <div className='home'>
                <h1 className="primary-title">Swipe Right@</h1>
                <button
                    className='primary-button'
                    onClick={handleClick}
                    aria-haspopup="dialog" // Accessibility
                    aria-expanded={showModal} // Accessibility
                >
                    {authToken ? 'Sign Out' : 'Create Account'}
                </button>

                {showModal && (
                    <AuthModal 
                        setShowModal={setShowModal} 
                        isSignUp={isSignUp} 
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
