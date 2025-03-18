import React, { useState, useEffect } from 'react';

interface Song {
  id: string;
  name: string;
  level: number;
  image: string;
  downloadUrl: string;
}

interface TierData {
  level: number;
  life: number;
  minusX: number;
  minusY: number;
  minusZ: number;
  addLife: number;
  songs: Song[];
}

const MainPage: React.FC = () => {
  const [tiers, setTiers] = useState<TierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await fetch('/api/tiers');
        if (!response.ok) {
          throw new Error('Failed to fetch tiers data');
        }
        const data = await response.json();
        setTiers(data);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้ / Failed to load data');
        console.error('Error fetching tiers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.png'; // ใช้รูปภาพ placeholder เมื่อโหลดรูปไม่สำเร็จ
  };

  const handleDownload = async (downloadUrl: string, songName: string) => {
    try {
      // Get the song ID from the URL (e.g., "1-1" from "/api/songs/1-1/download")
      const songId = downloadUrl.split('/').pop();
      
      // Create direct path to the file in public folder
      const directUrl = `/songs/${songId}/song.zip`;
      
      // Only remove characters that are invalid in filenames
      const sanitizedName = songName
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove invalid filename characters
        .trim();
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = directUrl;
      a.download = `${sanitizedName}.zip`; // Use song name with special characters
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('ไม่สามารถดาวน์โหลดไฟล์ได้ / Download failed');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        window.location.href = '/login';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('ไม่สามารถออกจากระบบได้ / Logout failed');
    }
  };

  if (loading) {
    return <div style={styles.loading}>กำลังโหลด... / Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.navbar}>
        <div style={styles.navbarContent}>
          <span style={styles.welcomeText}>Welcome, HaySad!</span>
          <button style={styles.logoutButton} onClick={handleLogout}>
            ออกจากระบบ / Logout
          </button>
        </div>
      </div>
      <div style={styles.starsContainer}>
        <div style={styles.stars1}></div>
        <div style={styles.stars2}></div>
        <div style={styles.stars3}></div>
      </div>
      <div style={styles.container}>
        <h1 style={styles.header}>段位認定- Discord-Competition IV</h1>
        
        {tiers.map((tier) => (
          <div key={tier.level} style={styles.tierContainer}>
            <div style={styles.tierHeader}>
              <h2 style={styles.tierTitle}>Tier {tier.level}</h2>
              <div style={styles.tierSettings}>
                <span style={styles.statItem}>Max Life : {tier.life} <span style={styles.heart}>❤️</span></span>
                <span style={styles.statItem}>Great - {tier.minusX} <span style={styles.heart}>❤️</span></span>
                <span style={styles.statItem}>Good - {tier.minusY} <span style={styles.heart}>❤️</span></span>
                <span style={styles.statItem}>Miss - {tier.minusZ} <span style={styles.heart}>❤️</span></span>
                <span style={styles.statItem}>Add Life - {tier.addLife} <span style={styles.heart}>❤️</span></span>
              </div>
            </div>
            
            <div style={styles.songsGrid}>
              {tier.songs.map((song) => (
                <div key={song.id} style={styles.songCard}>
                  <div style={styles.imageContainer}>
                    <img 
                      src={song.image} 
                      alt={song.name}
                      style={styles.songImage}
                      onError={handleImageError}
                    />
                  </div>
                  <div style={styles.songInfo}>
                    <div style={styles.songName}>{song.name}</div>
                    <div style={styles.songLevel}>Level: {song.level.toFixed(1)}</div>
                    <button 
                      style={styles.downloadButton}
                      onClick={() => handleDownload(song.downloadUrl, song.name)}
                    >
                      ดาวน์โหลด / Download ⬇️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    position: 'relative' as const,
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0B0B1F 0%, #1F1135 50%, #0B0B1F 100%)',
    overflow: 'hidden',
  },
  navbar: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(8, 8, 24, 0.98)',
    backdropFilter: 'blur(10px)',
    padding: '0.6rem 0',
    zIndex: 1000,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
  },
  navbarContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#4ECDC4',
    fontSize: '1rem',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(78, 205, 196, 0.3)',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    color: '#FF6B6B',
    border: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 10px rgba(255, 107, 107, 0.1)',
    ':hover': {
      backgroundColor: 'rgba(255, 107, 107, 0.25)',
      boxShadow: '0 0 15px rgba(255, 107, 107, 0.2)',
    },
  },
  starsContainer: {
    position: 'fixed' as const,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    pointerEvents: 'none' as const,
  },
  stars1: {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    background: 'transparent',
    boxShadow: `${Array.from({ length: 50 }, () => {
      const x = Math.floor(Math.random() * 2000);
      const y = Math.floor(Math.random() * 2000);
      return `${x}px ${y}px #fff`;
    }).join(', ')}`,
    animation: 'animateStars 50s linear infinite',
    '&:after': {
      content: '" "',
      position: 'absolute',
      top: '2000px',
      width: '1px',
      height: '1px',
      background: 'transparent',
      boxShadow: `${Array.from({ length: 50 }, () => {
        const x = Math.floor(Math.random() * 2000);
        const y = Math.floor(Math.random() * 2000);
        return `${x}px ${y}px #fff`;
      }).join(', ')}`,
    },
  },
  stars2: {
    position: 'absolute' as const,
    width: '2px',
    height: '2px',
    background: 'transparent',
    boxShadow: `${Array.from({ length: 30 }, () => {
      const x = Math.floor(Math.random() * 2000);
      const y = Math.floor(Math.random() * 2000);
      return `${x}px ${y}px #fff`;
    }).join(', ')}`,
    animation: 'animateStars 100s linear infinite',
    '&:after': {
      content: '" "',
      position: 'absolute',
      top: '2000px',
      width: '2px',
      height: '2px',
      background: 'transparent',
      boxShadow: `${Array.from({ length: 30 }, () => {
        const x = Math.floor(Math.random() * 2000);
        const y = Math.floor(Math.random() * 2000);
        return `${x}px ${y}px #fff`;
      }).join(', ')}`,
    },
  },
  stars3: {
    position: 'absolute' as const,
    width: '3px',
    height: '3px',
    background: 'transparent',
    boxShadow: `${Array.from({ length: 20 }, () => {
      const x = Math.floor(Math.random() * 2000);
      const y = Math.floor(Math.random() * 2000);
      return `${x}px ${y}px #fff`;
    }).join(', ')}`,
    animation: 'animateStars 150s linear infinite',
    '&:after': {
      content: '" "',
      position: 'absolute',
      top: '2000px',
      width: '3px',
      height: '3px',
      background: 'transparent',
      boxShadow: `${Array.from({ length: 20 }, () => {
        const x = Math.floor(Math.random() * 2000);
        const y = Math.floor(Math.random() * 2000);
        return `${x}px ${y}px #fff`;
      }).join(', ')}`,
    },
  },
  container: {
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'transparent',
    position: 'relative' as const,
    zIndex: 1,
    minHeight: '100vh',
    color: '#ffffff',
    paddingTop: '4rem',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(78, 205, 196, 0.3)',
  },
  tierContainer: {
    marginBottom: '1.5rem',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '1.2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  tierHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  tierTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#4ECDC4',
    margin: 0,
  },
  tierSettings: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#252525',
    borderRadius: '8px',
  },
  statItem: {
    padding: '0.5rem 1rem',
    backgroundColor: '#333',
    borderRadius: '20px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  heart: {
    fontSize: '1.1rem',
  },
  songsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    padding: '1rem',
  },
  songCard: {
    backgroundColor: 'rgba(37, 37, 37, 0.9)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
    },
  },
  imageContainer: {
    width: '100%',
    paddingTop: '100%',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  songImage: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  imageOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    ':hover': {
      opacity: 1,
    },
  },
  downloadIcon: {
    fontSize: '2rem',
  },
  songInfo: {
    padding: '1.2rem',
    textAlign: 'center' as const,
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
  },
  songName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#4ECDC4',
  },
  songLevel: {
    fontSize: '0.9rem',
    color: '#888',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#4ECDC4',
  },
  error: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#FF6B6B',
    fontSize: '1.2rem',
  },
  downloadButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    color: '#4ECDC4',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    width: '100%',
    marginTop: '0.5rem',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(78, 205, 196, 0.25)',
    },
  },
};

const keyframes = `
  @keyframes animateStars {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(-2000px);
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

export default MainPage; 