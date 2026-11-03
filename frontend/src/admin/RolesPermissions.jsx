import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Edit2, Trash2, Key, X, CheckCircle2, XCircle, UserPlus, Users, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const RolesPermissions = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'roles'
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState(['ROLE_ADMIN']);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const { register, handleSubmit, reset } = useForm();

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get('/admin/users'), api.get('/admin/roles')])
      .then(([usersRes, rolesRes]) => {
        if (usersRes.success) setUsers(usersRes.data || []);
        if (rolesRes.success) setRoles(rolesRes.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddUser = () => {
    setEditingUser(null);
    setSelectedRoles(['ROLE_CONTENT_EDITOR']);
    reset({
      username: '',
      fullName: '',
      email: '',
      phone: '',
      password: '',
      active: true
    });
    setUserModalOpen(true);
  };

  const openEditUser = (u) => {
    setEditingUser(u);
    setSelectedRoles(Array.from(u.roles || []));
    reset(u);
    setUserModalOpen(true);
  };

  const handleRoleToggle = (rName) => {
    setSelectedRoles(prev =>
      prev.includes(rName) ? prev.filter(r => r !== rName) : [...prev, rName]
    );
  };

  const onSubmitUser = async (data) => {
    try {
      const payload = {
        ...data,
        roles: selectedRoles
      };
      let res;
      if (editingUser) {
        res = await api.put(`/admin/users/${editingUser.id}`, payload);
      } else {
        res = await api.post('/admin/users', payload);
      }
      if (res.success) {
        setUserModalOpen(false);
        fetchData();
      }
    } catch (err) {
      alert(err.message || 'Failed to save account');
    }
  };

  const openPasswordModal = (u) => {
    setTargetUser(u);
    setNewPassword('');
    setPasswordModalOpen(true);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    try {
      const res = await api.patch(`/admin/users/${targetUser.id}/reset-password`, { newPassword });
      if (res.success) {
        alert(`Password for ${targetUser.username} successfully updated`);
        setPasswordModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Password reset failed');
    }
  };

  const handleDeleteUser = async (id, uname) => {
    if (window.confirm(`Delete administrator account "${uname}"?`)) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchData();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Roles & Permissions</h1>
          <p className="admin-header-subtitle">
            Enforce least-privilege role-based access control (RBAC) and manage staff credentials
          </p>
        </div>
        {activeTab === 'users' && (
          <button onClick={openAddUser} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
            <UserPlus size={18} /> Create Staff Account
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-primary'}`}
          style={{ borderRadius: '8px', fontSize: '0.88rem', padding: '0.5rem 1.1rem' }}
        >
          Staff & Administrators ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`btn ${activeTab === 'roles' ? 'btn-primary' : 'btn-outline-primary'}`}
          style={{ borderRadius: '8px', fontSize: '0.88rem', padding: '0.5rem 1.1rem' }}
        >
          Role Definitions & Matrix
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-table-card">
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email & Phone</th>
                  <th>Assigned Roles</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                      <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No staff accounts found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--primary-900)', fontFamily: 'monospace' }}>
                          {u.username}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--primary-900)' }}>{u.fullName}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.82rem' }}>{u.email}</div>
                        {u.phone && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.phone}</div>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {Array.from(u.roles || []).map(r => (
                            <span key={r} style={{
                              fontSize: '0.72rem',
                              fontWeight: '700',
                              backgroundColor: r === 'ROLE_SUPER_ADMIN' ? '#fef3c7' : r === 'ROLE_ADMIN' ? '#dbeafe' : '#f1f5f9',
                              color: r === 'ROLE_SUPER_ADMIN' ? '#92400e' : r === 'ROLE_ADMIN' ? '#1e40af' : '#475569',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px'
                            }}>
                              {r.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          backgroundColor: u.active ? '#dcfce7' : '#fee2e2',
                          color: u.active ? '#166534' : '#991b1b',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px'
                        }}>
                          {u.active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button onClick={() => openPasswordModal(u)} className="btn-icon" title="Reset Password" style={{ color: '#d97706' }}>
                            <Key size={16} />
                          </button>
                          <button onClick={() => openEditUser(u)} className="btn-icon" title="Edit User" style={{ color: 'var(--primary-700)' }}>
                            <Edit2 size={16} />
                          </button>
                          {u.username !== 'admin' && (
                            <button onClick={() => handleDeleteUser(u.id, u.username)} className="btn-icon" title="Delete Account" style={{ color: '#ef4444' }}>
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Matrix Tab */}
      {activeTab === 'roles' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
            System Role Hierarchy & Security Matrix
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Permitted Capabilities</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style={{ color: '#92400e' }}>ROLE_SUPER_ADMIN</strong></td>
                  <td>Root institutional administrator with absolute administrative rights</td>
                  <td>Access to all 26 modules, User CRUD, Role assignment, Backup generation, System cache purge, Audit logs</td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#1e40af' }}>ROLE_ADMIN</strong></td>
                  <td>General administrative officer</td>
                  <td>Dashboard, Enquiries, Settings, Academic management, Reports export, Backup viewing</td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#047857' }}>ROLE_CONTENT_EDITOR</strong></td>
                  <td>Web communications & publishing team</td>
                  <td>Pages, Hero Banners, Gallery, Student Achievements, News, Circulars, Events, Testimonials</td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#b45309' }}>ROLE_ADMISSION_STAFF</strong></td>
                  <td>Admissions office & counselling team</td>
                  <td>Admission Enquiries, Student Applications verification, Enrolment status updating, Applicant CSV export</td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#475569' }}>ROLE_STAFF</strong></td>
                  <td>Standard collegiate staff</td>
                  <td>Read-only directory access and personal security profile updates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit User Modal */}
      {userModalOpen && (
        <div className="modal-backdrop" onClick={() => setUserModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setUserModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              {editingUser ? `Edit Account: ${editingUser.username}` : 'Create Staff or Administrator Account'}
            </h3>
            <form onSubmit={handleSubmit(onSubmitUser)}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Username *</label>
                  <input
                    type="text"
                    disabled={!!editingUser}
                    className="form-control"
                    placeholder="e.g. editor.kiran"
                    {...register('username', { required: !editingUser })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-control" placeholder="e.g. Kiran Kumar" {...register('fullName', { required: true })} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Official Email *</label>
                  <input type="email" className="form-control" placeholder="kiran@mpuc.edu.in" {...register('email', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" placeholder="+91 98450 00000" {...register('phone')} />
                </div>
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label className="form-label">Initial Password * (minimum 6 characters)</label>
                  <input type="password" className="form-control" placeholder="••••••••" {...register('password', { required: true, minLength: 6 })} />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Assign System Roles *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_CONTENT_EDITOR', 'ROLE_ADMISSION_STAFF', 'ROLE_STAFF'].map(r => (
                    <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(r)}
                        onChange={() => handleRoleToggle(r)}
                      />
                      <span>{r.replace('ROLE_', '')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="userActiveCheck" {...register('active')} />
                <label htmlFor="userActiveCheck" style={{ margin: 0, fontSize: '0.88rem', cursor: 'pointer' }}>
                  Account active and permitted to login
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setUserModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {passwordModalOpen && targetUser && (
        <div className="modal-backdrop" onClick={() => setPasswordModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPasswordModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={20} style={{ color: '#d97706' }} /> Reset Password: {targetUser.username}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Assign a new bcrypt-encrypted password for this staff member.
            </p>

            <div className="form-group">
              <label className="form-label">New Password (min 6 characters)</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new secure password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setPasswordModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
              <button type="button" onClick={handleResetPassword} className="btn btn-primary btn-sm">Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
