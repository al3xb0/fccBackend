import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import '../styles/pinterest.css';
import type { User, Pin, SearchImage } from '../services/pinterest/types';
import { getServiceInfo, getMe, logout as apiLogout, getPins as apiGetPins, addPin as apiAddPin, deletePin as apiDeletePin, searchImages as apiSearchImages, register as apiRegister, login as apiLogin } from '../services/pinterest/api';


const API = import.meta.env.VITE_PINTEREST_API || 'http://localhost:3016';

export default function ServicePinterest() {
    const [user, setUser] = useState<User | null>(null);
    const [pins, setPins] = useState<Pin[]>([]);
    const [loading, setLoading] = useState(true);
    const [oauthEnabled, setOauthEnabled] = useState<boolean>(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authDisplayName, setAuthDisplayName] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchImage[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [filterUserId, setFilterUserId] = useState<string>('');

    useEffect(() => {
        checkService();
        checkAuth();
        loadPins();
    }, [filterUserId]);

    async function checkAuth() {
        try {
            const data = await getMe();
            if ('user' in (data as any) && (data as any).user) setUser((data as any).user);
        } catch (err) {
            console.error('Auth check error:', err);
        }
    }

    async function loadPins() {
        setLoading(true);
        try {
            const data = await apiGetPins(filterUserId || undefined);
            setPins(data);
        } catch (err) {
            console.error('Load pins error:', err);
        }
        setLoading(false);
    }

    async function handleAddPin() {
        if (!imageUrl.trim()) return alert('Image URL is required');
        try {
            const newPin = await apiAddPin(imageUrl.trim(), description.trim());
            setPins([newPin, ...pins]);
            setShowAddModal(false);
            setImageUrl('');
            setDescription('');
        } catch (err) {
            console.error('Add pin error:', err);
            alert('Failed to add pin');
        }
    }

    async function handleDeletePin(id: string) {
        if (!confirm('Delete this pin?')) return;
        try {
            await apiDeletePin(id);
            setPins(pins.filter(p => p.id !== id));
        } catch (err) {
            console.error('Delete pin error:', err);
            alert('Failed to delete pin');
        }
    }

    async function handleSearchImages() {
        if (!searchQuery.trim()) return;
        setSearchLoading(true);
        try {
            const imgs = await apiSearchImages(searchQuery);
            setSearchResults(imgs);
        } catch (err) {
            console.error('Search error:', err);
            alert(err instanceof Error ? err.message : 'Search failed');
        }
        setSearchLoading(false);
    }

    async function checkService() {
        try {
            const data = await getServiceInfo();
            if (typeof (data as any).oauthEnabled === 'boolean') setOauthEnabled((data as any).oauthEnabled);
        } catch (e) {
            console.error('Service info error:', e);
        }
    }

    async function submitRegister() {
        setAuthError(null);
        try {
            const me = await apiRegister(authEmail, authPassword, authDisplayName);
            setUser(me as any);
            setShowAuthModal(false);
            setAuthEmail(''); setAuthPassword(''); setAuthDisplayName('');
        } catch (err: any) {
            setAuthError(err.message || 'Registration failed');
        }
    }

    async function submitLogin() {
        setAuthError(null);
        try {
            const me = await apiLogin(authEmail, authPassword);
            setUser(me as any);
            setShowAuthModal(false);
            setAuthEmail(''); setAuthPassword(''); setAuthDisplayName('');
        } catch (err: any) {
            setAuthError(err.message || 'Login failed');
        }
    }

    function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
        e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Broken+Image';
    }

    function selectSearchImage(img: SearchImage) {
        setImageUrl(img.url);
        setDescription(img.title);
        setShowSearchModal(false);
        setShowAddModal(true);
    }

    const breakpointColumns = {
        default: 4,
        1400: 3,
        1000: 2,
        600: 1
    };

    return (
        <div className="pinterest-container">
            <header className="pinterest-header">
                <h1>📌 Pinterest Clone</h1>
                {user ? (
                    <div className="user-info">
                        {user.avatarUrl && <img src={user.avatarUrl} alt={user.username} className="avatar" />}
                        <span>{user.displayName}</span>
                        <button onClick={() => apiLogout().then(() => { setUser(null); loadPins(); })}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {oauthEnabled ? (
                            <a href={`${API}/auth/github`} className="btn-github">Login with GitHub</a>
                        ) : (
                            <span title="GitHub OAuth not configured">
                                <button className="btn-github" disabled>GitHub disabled</button>
                            </span>
                        )}
                        <button className="btn-primary" onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}>Login</button>
                        <button className="btn-secondary" onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}>Register</button>
                    </div>
                )}
            </header>

            {user && (
                <div className="action-bar">
                    <button onClick={() => setShowAddModal(true)} className="btn-primary">➕ Add Pin</button>
                    <button onClick={() => setShowSearchModal(true)} className="btn-secondary">🔍 Search Images</button>
                    <button onClick={() => setFilterUserId('')} className={!filterUserId ? 'btn-active' : ''}>All Pins</button>
                    <button onClick={() => setFilterUserId(user.id)} className={filterUserId === user.id ? 'btn-active' : ''}>My Pins</button>
                </div>
            )}

            {loading ? (
                <p className="loading">Loading pins...</p>
            ) : pins.length === 0 ? (
                <p className="empty">No pins yet. {user ? 'Add your first pin!' : 'Login to add pins.'}</p>
            ) : (
                <Masonry breakpointCols={breakpointColumns} className="masonry-grid" columnClassName="masonry-column">
                    {pins.map(pin => (
                        <div key={pin.id} className="pin-card">
                            <img src={pin.imageUrl} alt={pin.description} onError={handleImageError} />
                            <div className="pin-overlay">
                                {user && user.id === pin.userId && (
                                    <button className="btn-delete" onClick={() => handleDeletePin(pin.id)}>🗑️</button>
                                )}
                                <div className="pin-info">
                                    {pin.avatarUrl && <img src={pin.avatarUrl} alt={pin.username} className="pin-avatar" />}
                                    <div>
                                        <div className="pin-username">{pin.username}</div>
                                        {pin.description && <div className="pin-description">{pin.description}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Masonry>
            )}

            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Add Pin</h2>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            className="input-full"
                        />
                        <textarea
                            placeholder="Description (optional)"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="input-full"
                            rows={3}
                        />
                        <div className="modal-actions">
                            <button onClick={handleAddPin} className="btn-primary">Add Pin</button>
                            <button onClick={() => setShowAddModal(false)} className="btn-cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showSearchModal && (
                <div className="modal-overlay" onClick={() => setShowSearchModal(false)}>
                    <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
                        <h2>Search Images</h2>
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search images..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyUp={e => e.key === 'Enter' && handleSearchImages()}
                                className="input-search"
                            />
                            <button onClick={handleSearchImages} disabled={searchLoading} className="btn-primary">
                                {searchLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                        {searchResults.length > 0 && (
                            <div className="search-results">
                                {searchResults.map((img, idx) => (
                                    <div key={idx} className="search-result-item" onClick={() => selectSearchImage(img)}>
                                        <img src={img.thumbnail || ''} alt={img.title} onError={handleImageError} />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="modal-actions">
                            <button onClick={() => setShowSearchModal(false)} className="btn-cancel">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showAuthModal && (
                <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{authMode === 'login' ? 'Login' : 'Register'}</h2>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <button className={authMode === 'login' ? 'btn-active' : 'btn-secondary'} onClick={() => setAuthMode('login')}>Login</button>
                            <button className={authMode === 'register' ? 'btn-active' : 'btn-secondary'} onClick={() => setAuthMode('register')}>Register</button>
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={authEmail}
                            onChange={e => setAuthEmail(e.target.value)}
                            className="input-full"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={authPassword}
                            onChange={e => setAuthPassword(e.target.value)}
                            className="input-full"
                        />
                        {authMode === 'register' && (
                            <input
                                type="text"
                                placeholder="Display name (optional)"
                                value={authDisplayName}
                                onChange={e => setAuthDisplayName(e.target.value)}
                                className="input-full"
                            />
                        )}
                        {authError && <div style={{ color: '#e60023', marginTop: '0.25rem' }}>{authError}</div>}
                        <div className="modal-actions">
                            {authMode === 'login' ? (
                                <button className="btn-primary" onClick={submitLogin}>Login</button>
                            ) : (
                                <button className="btn-primary" onClick={submitRegister}>Create account</button>
                            )}
                            <button className="btn-cancel" onClick={() => setShowAuthModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

