import TinderCard from 'react-tinder-card';
import { useEffect, useState } from 'react';
import ChatContainer from '../components/ChatContainer';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [genderedUsers, setGenderedUsers] = useState([]);
    const [lastDirection, setLastDirection] = useState();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);

    const userId = cookies.UserId;

    // Debugging UserId cookie
    console.log('UserId from cookie:', userId);

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: { userId },
            });
            setUser(response.data);
            console.log('Fetched user:', response.data); // Debugging fetched user
        } catch (error) {
            setError('Error fetching user.');
            console.error('Error fetching user:', error.response || error.message || error);
        } finally {
            setLoading(false);
        }
    };

    const getGenderedUsers = async () => {
        if (!user?.gender_interest) return;

        try {
            const response = await axios.get('http://localhost:8000/gendered-users', {
                params: { gender: user.gender_interest },
            });
            setGenderedUsers(response.data || []);
        } catch (error) {
            setError('Error fetching gendered users.');
            console.error('Error fetching gendered users:', error.response || error.message || error);
        }
    };

    useEffect(() => {
        getUser();
    }, []); // Fetch user on mount

    useEffect(() => {
        if (user) {
            getGenderedUsers();
        }
    }, [user?.gender_interest]); // Fetch gendered users when user updates

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId,
            });
            getUser();
        } catch (err) {
            console.error('Error updating matches:', err.response || err.message || err);
        }
    };

    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId);
        }
        setLastDirection(direction);
    };

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!');
    };

    const matchedUserIds = user?.matches?.map(({ user_id }) => user_id) || [];
    const filteredGenderedUsers = genderedUsers.filter(
        (genderedUser) => !matchedUserIds.includes(genderedUser.user_id) && genderedUser.user_id
    );

    if (loading) return <p>Loading...</p>; // Loading state
    if (error) return <p>{error}</p>; // Error state

    return (
        <div>
            {user && (
                <div className="dashboard">
                    <ChatContainer user={user} />
                    <div className="swipe-container">
                        <div className="card-container">
                            {filteredGenderedUsers.length > 0 ? (
                                filteredGenderedUsers.map((genderedUser) => (
                                    <TinderCard
                                        className="swipe"
                                        key={genderedUser.user_id}
                                        onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                                        onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
                                        <div
                                            style={{ backgroundImage: `url(${genderedUser.url || 'default-image-url.jpg'})` }}
                                            className="card">
                                            <h3>{genderedUser.first_name || 'Unknown User'}</h3>
                                        </div>
                                    </TinderCard>
                                ))
                            ) : (
                                <p>No more users to swipe on!</p>
                            )}
                            <div className="swipe-info">
                                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
