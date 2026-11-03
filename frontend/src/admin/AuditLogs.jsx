import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Shield, Clock, User, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import api from '../services/api';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Detail Modal
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = (pageNumber = 0) => {
    setLoading(true);
    api.get(`/admin/audit-logs?page=${pageNumber}&size=25`)
      .then(res => {
        if (res.success && res.data) {
          setLogs(res.data.content || []);
          setFilteredLogs(res.data.content || []);
          setTotalPages(res.data.totalPages || 1);
          setTotalElements(res.data.totalElements || 0);
          setPage(pageNumber);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs(0);
  }, []);

  useEffect(() => {
    let result = logs;
    if (moduleFilter !== 'ALL') {
      result = result.filter(l => l.module === moduleFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        l =>
          l.username?.toLowerCase().includes(q) ||
          l.action?.toLowerCase().includes(q) ||
          l.details?.toLowerCase().includes(q) ||
          l.module?.toLowerCase().includes(q)
      );
    }
    setFilteredLogs(result);
  }, [searchQuery, moduleFilter, logs]);

  const getActionBadge = (action) => {
    let color = '#475569';
    let bg = '#f1f5f9';
    if (action.includes('CREATE')) {
      color = '#15803d'; bg = '#dcfce7';
    } else if (action.includes('UPDATE') || action.includes('TOGGLE')) {
      color = '#1e40af'; bg = '#dbeafe';
    } else if (action.includes('DELETE')) {
      color = '#b91c1c'; bg = '#fee2e2';
    } else if (action.includes('LOGIN') || action.includes('AUTH')) {
      color = '#6d28d9'; bg = '#ede9fe';
    } else if (action.includes('EXPORT')) {
      color = '#b45309'; bg = '#fef3c7';
    }

    return (
      <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: bg, color }}>
        {action}
      </span>
    );
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Audit Logs & Activity History</h1>
          <p className="admin-header-subtitle">
            Immutable, tamper-resistant system trail recording all administrative actions ({totalElements} total events)
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-search-card">
        <div className="admin-search-bar">
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search audit trail by username, action, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Module:</span>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: '8px' }}
          >
            <option value="ALL">All Modules</option>
            <option value="AUTH">Authentication</option>
            <option value="ADMISSIONS">Admissions & Enquiries</option>
            <option value="STUDENTS">Students & Applications</option>
            <option value="PAGES">Page CMS</option>
            <option value="BANNERS">Banners & Media</option>
            <option value="COURSES">Courses</option>
            <option value="FACULTY">Faculty</option>
            <option value="NOTICES">Notices</option>
            <option value="ROLES_PERMISSIONS">Roles & Permissions</option>
            <option value="REPORTS">Reports Export</option>
            <option value="BACKUP_MAINTENANCE">Backup & Maintenance</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Module</th>
                <th>Action</th>
                <th>Change Details</th>
                <th>IP Origin</th>
                <th style={{ textAlign: 'right' }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No audit records matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} /> {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: 'var(--primary-900)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {log.username}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary-700)' }}>
                        {log.module}
                      </span>
                    </td>
                    <td>{getActionBadge(log.action)}</td>
                    <td style={{ maxWidth: '300px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {log.details?.length > 75 ? log.details.slice(0, 75) + '...' : log.details}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {log.ipAddress || '127.0.0.1'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="btn-icon"
                        title="View Full Audit Event"
                        style={{ color: 'var(--primary-700)' }}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Page {page + 1} of {totalPages || 1}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => fetchLogs(page - 1)}
              disabled={page <= 0}
              className="btn btn-outline-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={() => fetchLogs(page + 1)}
              disabled={page + 1 >= totalPages}
              className="btn btn-outline-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Detail Modal */}
      {selectedLog && (
        <div className="modal-backdrop" onClick={() => setSelectedLog(null)}>
          <div className="modal-content" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedLog(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} style={{ color: 'var(--primary-700)' }} /> Audit Log Event Details
            </h3>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div><strong>Event ID:</strong> #{selectedLog.id}</div>
                <div><strong>Timestamp:</strong> {new Date(selectedLog.createdAt).toLocaleString()}</div>
                <div><strong>Operator:</strong> {selectedLog.username}</div>
                <div><strong>Module:</strong> {selectedLog.module}</div>
                <div><strong>Action:</strong> {getActionBadge(selectedLog.action)}</div>
                <div><strong>IP Address:</strong> {selectedLog.ipAddress}</div>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
                <strong>Full Event Details & Payloads:</strong>
                <pre style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.82rem' }}>
                  {selectedLog.details}
                </pre>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedLog(null)} className="btn btn-primary btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
