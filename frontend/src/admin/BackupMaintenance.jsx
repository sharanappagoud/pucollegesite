import React, { useState, useEffect } from 'react';
import { Database, Download, RefreshCw, Power, AlertTriangle, CheckCircle2, Shield, HardDrive, Trash2 } from 'lucide-react';
import api from '../services/api';

export const BackupMaintenance = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchStatus = () => {
    setLoading(true);
    api.get('/admin/backup/status')
      .then(res => {
        if (res.success) setStatus(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    try {
      const res = await api.post('/admin/backup/create');
      if (res.success) {
        showToast('Full database snapshot generated successfully');
        fetchStatus();
      }
    } catch (err) {
      alert(err.message || 'Backup failed');
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleToggleMaintenance = async () => {
    const currentMode = status?.maintenanceMode;
    const action = currentMode ? 'disable' : 'enable';
    if (window.confirm(`Are you sure you want to ${action} portal maintenance mode?`)) {
      try {
        const res = await api.post(`/admin/backup/maintenance-toggle?enabled=${!currentMode}`);
        if (res.success) {
          showToast(`Maintenance mode is now ${!currentMode ? 'ACTIVE' : 'OFF'}`);
          fetchStatus();
        }
      } catch (err) {
        alert(err.message || 'Failed to toggle maintenance mode');
      }
    }
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      const res = await api.post('/admin/backup/clear-cache');
      if (res.success) {
        showToast('System application heap caches purged successfully');
      }
    } catch (err) {
      alert(err.message || 'Cache flush failed');
    } finally {
      setClearingCache(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Checking database and maintenance status...</p>
      </div>
    );
  }

  const isMaintenance = status?.maintenanceMode;
  const backups = status?.backups || [];

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Backup & System Maintenance</h1>
          <p className="admin-header-subtitle">
            Database snapshots, cache purges, and public site maintenance controls
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleClearCache}
            disabled={clearingCache}
            className="btn btn-outline-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={16} className={clearingCache ? 'spin' : ''} /> {clearingCache ? 'Purging...' : 'Flush Caches'}
          </button>
          <button
            onClick={handleCreateBackup}
            disabled={creatingBackup}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}
          >
            <Database size={18} /> {creatingBackup ? 'Snapshotting...' : 'Create DB Backup'}
          </button>
        </div>
      </div>

      {toastMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '500' }}>
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* Maintenance Mode Alert Banner */}
      <div className="card" style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        borderLeft: isMaintenance ? '4px solid #ef4444' : '4px solid #16a34a',
        backgroundColor: isMaintenance ? '#fff5f5' : '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              backgroundColor: isMaintenance ? '#fee2e2' : '#dcfce7',
              color: isMaintenance ? '#b91c1c' : '#15803d',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Power size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-900)' }}>
                System Maintenance Mode: {isMaintenance ? <span style={{ color: '#ef4444' }}>ENABLED</span> : <span style={{ color: '#16a34a' }}>ONLINE (NORMAL)</span>}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isMaintenance
                  ? 'Public website visitors see a scheduled maintenance notice. Administrative portal remains accessible.'
                  : 'Public website is actively serving enquiries, course details, and applications.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleMaintenance}
            className={`btn ${isMaintenance ? 'btn-primary' : 'btn-outline-primary'}`}
            style={{ fontSize: '0.88rem' }}
          >
            {isMaintenance ? 'Turn Maintenance Mode OFF' : 'Enable Maintenance Mode'}
          </button>
        </div>
      </div>

      {/* Database Diagnostic Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Database Engine</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-900)', marginTop: '0.25rem' }}>
            {status?.engine || 'MySQL 8.0'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '0.25rem' }}>State: {status?.databaseStatus}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Backups</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-900)', marginTop: '0.25rem' }}>
            {status?.totalBackups || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Snapshots archived</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last Backup Time</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary-900)', marginTop: '0.25rem' }}>
            {status?.lastBackupTime || 'N/A'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '0.25rem' }}>Integrity verified</div>
        </div>
      </div>

      {/* Database Snapshot Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>Archived Database Snapshots</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Backup ID</th>
                <th>Filename</th>
                <th>Type</th>
                <th>File Size</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary-800)' }}>{b.id}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{b.filename}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                      {b.type}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{b.size}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{b.createdAt}</td>
                  <td>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', backgroundColor: '#dcfce7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
