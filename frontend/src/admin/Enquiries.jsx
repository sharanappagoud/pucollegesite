import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Download, Eye, Edit3, 
  CheckCircle2, X, AlertCircle, Phone, Mail, Calendar,
  FileSpreadsheet, ExternalLink, RefreshCw, Settings as SettingsIcon, Check, Copy,
  History, Send, Smartphone, Clock, ShieldCheck
} from 'lucide-react';
import api from '../services/api';

export const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [streamFilter, setStreamFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Google Sheets Integration State
  const [sheetsConfig, setSheetsConfig] = useState({
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
    webhookUrl: '',
    ownerEmail: 'sharanappagoudapolicepatil60@gmail.com',
    syncEnabled: true,
    hasWebhook: false
  });
  const [sheetsModalOpen, setSheetsModalOpen] = useState(false);
  const [editSpreadsheetUrl, setEditSpreadsheetUrl] = useState('');
  const [editWebhookUrl, setEditWebhookUrl] = useState('');
  const [editOwnerEmail, setEditOwnerEmail] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  // Communication History State inside modal
  const [commLogs, setCommLogs] = useState([]);
  const [loadingCommLogs, setLoadingCommLogs] = useState(false);
  const [directSendOpen, setDirectSendOpen] = useState(false);
  const [directSendTargetType, setDirectSendTargetType] = useState('STUDENT');
  const [directSendChannel, setDirectSendChannel] = useState('EMAIL');
  const [directSendMessage, setDirectSendMessage] = useState('');
  const [directSendSending, setDirectSendSending] = useState(false);
  const [directSendStatus, setDirectSendStatus] = useState(null);

  const statusOptions = [
    'NEW', 'CONTACTED', 'COUNSELLING_SCHEDULED', 
    'APPLICATION_RECEIVED', 'UNDER_REVIEW', 'ADMITTED', 'REJECTED', 'CLOSED'
  ];

  const fetchEnquiries = () => {
    setLoading(true);
    let url = '/admin/admission-enquiries?';
    if (statusFilter !== 'ALL') url += `status=${statusFilter}&`;
    if (streamFilter !== 'ALL') url += `stream=${streamFilter}&`;

    api.get(url)
      .then(res => {
        if (res.success) setEnquiries(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchSheetsConfig = () => {
    api.get('/admin/admission-enquiries/google-sheets-config')
      .then(res => {
        if (res.success && res.data) {
          setSheetsConfig(res.data);
          setEditSpreadsheetUrl(res.data.spreadsheetUrl || '');
          setEditWebhookUrl(res.data.webhookUrl || '');
          setEditOwnerEmail(res.data.ownerEmail || 'sharanappagoudapolicepatil60@gmail.com');
        }
      })
      .catch(err => console.error('Failed to load sheets config', err));
  };

  useEffect(() => {
    fetchEnquiries();
    fetchSheetsConfig();
  }, [statusFilter, streamFilter]);

  const fetchEnquiryCommLogs = async (refNo) => {
    if (!refNo) return;
    setLoadingCommLogs(true);
    try {
      const res = await api.get(`/admin/communications/logs/enquiry/${encodeURIComponent(refNo)}`);
      if (res.success && res.data) {
        setCommLogs(res.data);
      }
    } catch {
      setCommLogs([]);
    } finally {
      setLoadingCommLogs(false);
    }
  };

  const openModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setNewStatus(enquiry.status);
    setFollowUpNote('');
    setUpdateMsg('');
    setDirectSendStatus(null);
    setDirectSendMessage('');
    setDirectSendOpen(false);
    fetchEnquiryCommLogs(enquiry.referenceNo);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setUpdating(true);
    setUpdateMsg('');
    try {
      const res = await api.patch(`/admin/admission-enquiries/${selectedEnquiry.id}/status`, {
        status: newStatus,
        followUpNotes: followUpNote
      });
      if (res.success) {
        setUpdateMsg('Status updated successfully and notifications logged!');
        setSelectedEnquiry(res.data);
        fetchEnquiries();
        fetchEnquiryCommLogs(res.data.referenceNo);
      }
    } catch (err) {
      alert(err.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendDirectModalMessage = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry || !directSendMessage.trim()) return;
    setDirectSendSending(true);
    setDirectSendStatus(null);
    try {
      let targetVal = selectedEnquiry.email;
      let targetName = selectedEnquiry.studentName;
      if (directSendTargetType === 'PARENT') {
        targetVal = directSendChannel === 'EMAIL' 
          ? (selectedEnquiry.parentEmail || selectedEnquiry.email)
          : selectedEnquiry.parentPhone;
        targetName = selectedEnquiry.parentName;
      } else if (directSendTargetType === 'STAFF') {
        targetVal = sheetsConfig.ownerEmail || 'sharanappagoudapolicepatil60@gmail.com';
        targetName = 'Admissions Staff';
      }

      const res = await api.post('/admin/communications/send-direct', {
        referenceNo: selectedEnquiry.referenceNo,
        recipientType: directSendTargetType,
        recipientName: targetName,
        recipientTarget: targetVal,
        channel: directSendChannel,
        subject: `Message from SVCPUC Admissions (${selectedEnquiry.referenceNo})`,
        message: directSendMessage.trim()
      });

      if (res.success) {
        setDirectSendStatus({ success: true, message: 'Message sent and logged with date & time!' });
        setDirectSendMessage('');
        fetchEnquiryCommLogs(selectedEnquiry.referenceNo);
      } else {
        setDirectSendStatus({ success: false, message: res.message || 'Send failed' });
      }
    } catch (err) {
      setDirectSendStatus({ success: false, message: err.message || 'Send failed' });
    } finally {
      setDirectSendSending(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const token = localStorage.getItem('svcpuc_token');
      const res = await fetch('/api/v1/admin/admission-enquiries/export-csv', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admission_enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Could not export CSV');
    }
  };

  const isCustomSheetLinked = Boolean(
    sheetsConfig.spreadsheetUrl && 
    !sheetsConfig.spreadsheetUrl.includes('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms') &&
    sheetsConfig.spreadsheetUrl.includes('/d/')
  );

  const handleOpenSpreadsheet = (e) => {
    if (!isCustomSheetLinked) {
      e.preventDefault();
      setSheetsModalOpen(true);
    }
  };

  const handleSyncSheets = async () => {
    if (!sheetsConfig.hasWebhook) {
      setSheetsModalOpen(true);
      setSyncResult({
        type: 'warning',
        message: 'Please paste your Google Apps Script Webhook URL below to enable automated sync.'
      });
      return;
    }

    setSyncingSheets(true);
    setSyncResult(null);
    try {
      const res = await api.post('/admin/admission-enquiries/sync-google-sheets');
      if (res.success) {
        setSyncResult({
          type: res.data?.success ? 'success' : 'warning',
          message: res.data?.message || 'Sync completed'
        });
      } else {
        setSyncResult({ type: 'error', message: res.message || 'Sync failed' });
      }
    } catch (err) {
      setSyncResult({ type: 'error', message: err.message || 'Sync failed' });
    } finally {
      setSyncingSheets(false);
    }
  };

  const handleSaveSheetsConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await api.put('/admin/admission-enquiries/google-sheets-config', {
        spreadsheetUrl: editSpreadsheetUrl,
        webhookUrl: editWebhookUrl,
        ownerEmail: editOwnerEmail,
        syncEnabled: true
      });
      if (res.success && res.data) {
        setSheetsConfig(res.data);
        setSheetsModalOpen(false);
        setSyncResult({ type: 'success', message: 'Google Sheets configuration saved successfully!' });
      }
    } catch (err) {
      alert(err.message || 'Failed to update Google Sheets settings');
    } finally {
      setSavingConfig(false);
    }
  };

  const extractSheetId = (url) => {
    const match = url?.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : '11COvgZkHF6-96zAs_Fq5d1qvYNnM_vJ4Ut9CdsiwBPI';
  };

  const currentSheetId = extractSheetId(sheetsConfig.spreadsheetUrl);

  const googleAppsScriptCode = `/**
 * Sri Vidyodaya Composite PU College - Live Admission Sync & Email Notification
 * Target Spreadsheet ID: ${currentSheetId}
 */
var TARGET_SPREADSHEET_ID = "${currentSheetId}";

// Alert recipients (both emails receive notifications automatically)
var NOTIFICATION_EMAILS = [
  "newbasavaraj@gmail.com",
  "${sheetsConfig.ownerEmail || 'sharanappagoudapolicepatil60@gmail.com'}"
];

/**
 * ⚡ STEP 1: Click [Run] on this function once to authorize email permissions!
 */
function sendTestEmail() {
  var recipients = NOTIFICATION_EMAILS.join(", ");
  var testPayload = {
    notificationEmail: recipients,
    referenceNo: "ADM-2026-TEST",
    studentName: "Test Student",
    parentName: "Test Parent",
    studentPhone: "9845012345",
    parentPhone: "9845012346",
    email: NOTIFICATION_EMAILS[1],
    address: "MG Road, Gulbarga, Karnataka",
    pincode: "585102",
    referredBy: "Staff recommendation",
    stream: "SCIENCE",
    combination: "PCMB",
    board: "Karnataka State Board",
    academicYear: "2026-27",
    status: "NEW",
    submittedAt: new Date().toLocaleString(),
    message: "Verifying email delivery to student & admin inboxes"
  };
  sendAdminAlert(testPayload);
  sendStudentConfirmation(testPayload);
  Logger.log("✅ Test email sent to: " + recipients);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var ss;
    try { 
      ss = SpreadsheetApp.getActiveSpreadsheet(); 
    } catch(err) {}
    if (!ss && TARGET_SPREADSHEET_ID) {
      ss = SpreadsheetApp.openById(TARGET_SPREADSHEET_ID);
    }
    
    var sheet = ss ? ss.getSheetByName("Admissions") : null;
    if (ss && !sheet) {
      sheet = ss.insertSheet("Admissions");
    }

    var headers = [
      "Timestamp", "Ref Number", "Student Name", "Parent Name", 
      "Student Phone", "Parent Phone", "Email", "Address", "Pincode", "Referred By",
      "10th Board", "Stream", "Combination", "Academic Year", "Status", "Student Remarks"
    ];

    if (sheet) {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(headers);
        sheet.getRange("A1:P1").setBackground("#07172C").setFontColor("#FFFFFF").setFontWeight("bold");
        sheet.setFrozenRows(1);
      } else {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange("A1:P1").setBackground("#07172C").setFontColor("#FFFFFF").setFontWeight("bold");
      }
    }

    // 1. New Admission Enquiry Submitted
    if (payload.action === "APPEND_ENQUIRY") {
      if (sheet) {
        sheet.appendRow([
          payload.submittedAt || new Date().toLocaleString(),
          payload.referenceNo || "",
          payload.studentName || "",
          payload.parentName || "",
          payload.studentPhone || "",
          payload.parentPhone || "",
          payload.email || "",
          payload.address || "",
          payload.pincode || "",
          payload.referredBy || "",
          payload.board || "",
          payload.stream || "",
          payload.combination || "",
          payload.academicYear || "2026-27",
          payload.status || "NEW",
          payload.message || ""
        ]);
      }

      // Notify Admins
      try { sendAdminAlert(payload); } catch(err) { Logger.log("Admin alert error: " + err); }

      // Send Confirmation to Student
      try { sendStudentConfirmation(payload); } catch(err) { Logger.log("Student confirmation error: " + err); }
    }

    // 2. Admin Status Update
    else if (payload.action === "UPDATE_ENQUIRY_STATUS") {
      if (sheet && payload.referenceNo) {
        var data = sheet.getDataRange().getValues();
        for (var r = 1; r < data.length; r++) {
          if (String(data[r][1]).trim() === String(payload.referenceNo).trim()) {
            sheet.getRange(r + 1, 15).setValue(payload.status); // Column 15 is Status
            break;
          }
        }
      }

      // Send Status Update Email to Student
      try { sendStudentStatusUpdate(payload); } catch(err) { Logger.log("Student status update error: " + err); }
    }

    // 3. Bulk Sync
    else if (payload.action === "BULK_SYNC" && payload.enquiries && sheet) {
      for (var i = 0; i < payload.enquiries.length; i++) {
        var row = payload.enquiries[i];
        sheet.appendRow([
          row.submittedAt || new Date().toLocaleString(),
          row.referenceNo || "",
          row.studentName || "",
          row.parentName || "",
          row.studentPhone || "",
          row.parentPhone || "",
          row.email || "",
          row.address || "",
          row.pincode || "",
          row.referredBy || "",
          row.board || "",
          row.stream || "",
          row.combination || "",
          row.academicYear || "2026-27",
          row.status || "NEW",
          row.message || ""
        ]);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Sends Admin Alert Email
 */
function sendAdminAlert(data) {
  var recipients = NOTIFICATION_EMAILS.join(", ");
  var subject = "🎓 New Admission Enquiry: " + (data.studentName || "Candidate") + " (" + (data.combination || "PUC") + " - " + (data.referenceNo || "") + ")";
  var htmlBody = 
    "<div style='font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>" +
      "<div style='background-color: #07172C; color: #ffffff; padding: 20px; text-align: center;'>" +
        "<h2 style='margin: 0; color: #D4AF37; font-size: 20px;'>New Online Admission Enquiry</h2>" +
        "<p style='margin: 5px 0 0 0; color: #cbd5e1; font-size: 13px;'>Sri Vidyodaya Composite Pre-University College</p>" +
      "</div>" +
      "<div style='padding: 24px; background-color: #ffffff; color: #1e293b; line-height: 1.6;'>" +
        "<p style='font-size: 15px; margin-top: 0;'>Dear Admissions Admin,</p>" +
        "<p>A student has just submitted an admission enquiry on the college website:</p>" +
        "<table style='width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14px;'>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569; width: 38%;'>Reference No:</td><td style='padding: 8px; font-weight: bold; color: #1e40af;'>" + (data.referenceNo || "N/A") + "</td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Student Name:</td><td style='padding: 8px; font-weight: bold;'>" + (data.studentName || "N/A") + "</td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Parent / Guardian:</td><td style='padding: 8px;'>" + (data.parentName || "N/A") + "</td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Student Phone:</td><td style='padding: 8px;'><a href='tel:" + data.studentPhone + "'>" + (data.studentPhone || "N/A") + "</a></td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Parent Phone:</td><td style='padding: 8px;'><a href='tel:" + data.parentPhone + "'>" + (data.parentPhone || "N/A") + "</a></td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Email:</td><td style='padding: 8px;'><a href='mailto:" + data.email + "'>" + (data.email || "N/A") + "</a></td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Stream & Combination:</td><td style='padding: 8px;'><strong>" + (data.stream || "") + " (" + (data.combination || "") + ")</strong></td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Residential Address:</td><td style='padding: 8px;'>" + (data.address || "Not specified") + "</td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Pincode:</td><td style='padding: 8px;'>" + (data.pincode || "Not specified") + "</td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Referred By:</td><td style='padding: 8px;'>" + (data.referredBy || "Direct / None") + "</td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Submission Date:</td><td style='padding: 8px;'>" + (data.submittedAt || new Date().toLocaleString()) + "</td></tr>" +
          "<tr><td style='padding: 8px; font-weight: bold; color: #475569;'>Student Remarks:</td><td style='padding: 8px;'>" + (data.message || "None provided") + "</td></tr>" +
        "</table>" +
      "</div>" +
    "</div>";

  MailApp.sendEmail({ to: recipients, subject: subject, htmlBody: htmlBody });
}

/**
 * Sends Confirmation Email to Student when form is submitted
 */
function sendStudentConfirmation(data) {
  var studentEmail = data.studentEmail || data.email;
  if (!studentEmail) return;

  var subject = "🎓 Information Recorded: Admission Enquiry Received [Ref: " + (data.referenceNo || "") + "] | Sri Vidyodaya PU College";
  var htmlBody = 
    "<div style='font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>" +
      "<div style='background-color: #07172C; color: #ffffff; padding: 22px; text-align: center;'>" +
        "<h2 style='margin: 0; color: #D4AF37; font-size: 20px;'>Sri Vidyodaya Composite PU College</h2>" +
        "<p style='margin: 5px 0 0 0; color: #94a3b8; font-size: 13px;'>Online Admission Enquiry Acknowledgement</p>" +
      "</div>" +
      "<div style='padding: 24px; background-color: #ffffff; color: #1e293b; line-height: 1.6;'>" +
        "<div style='background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 12px 16px; margin-bottom: 18px;'>" +
          "<strong style='color: #065f46; font-size: 15px;'>✓ Your Information Has Been Recorded Successfully!</strong>" +
          "<p style='margin: 4px 0 0 0; color: #047857; font-size: 13px;'>Thank you, <strong>" + (data.studentName || "") + "</strong>. Your admission enquiry has been safely received.</p>" +
        "</div>" +
        "<div style='background-color: #f8fafc; border-left: 4px solid #1e40af; padding: 12px 16px; margin-bottom: 18px;'>" +
          "<div><span style='font-size: 11px; color: #64748b; text-transform: uppercase;'>Your Reference Number:</span><br/><strong style='font-size: 17px; color: #1e40af; font-family: monospace;'>" + data.referenceNo + "</strong></div>" +
          "<div style='margin-top: 6px;'><span style='font-size: 11px; color: #64748b; text-transform: uppercase;'>Current Status:</span> <span style='background-color: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: bold;'>" + (data.status || "NEW") + "</span></div>" +
        "</div>" +
        "<table style='width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;'>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 6px; font-weight: bold; color: #475569; width: 38%;'>Student Name:</td><td style='padding: 6px;'>" + data.studentName + "</td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 6px; font-weight: bold; color: #475569;'>Parent / Guardian:</td><td style='padding: 6px;'>" + data.parentName + "</td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 6px; font-weight: bold; color: #475569;'>Mobile:</td><td style='padding: 6px;'>" + data.studentPhone + "</td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 6px; font-weight: bold; color: #475569;'>Stream & Comb:</td><td style='padding: 6px;'><strong>" + data.stream + " (" + data.combination + ")</strong></td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 6px; font-weight: bold; color: #475569;'>Address:</td><td style='padding: 6px;'>" + (data.address || "Not specified") + "</td></tr>" +
          "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 6px; font-weight: bold; color: #475569;'>Pincode:</td><td style='padding: 6px;'>" + (data.pincode || "Not specified") + "</td></tr>" +
        "</table>" +
        "<div style='background-color: #fefce8; border: 1px solid #fef08a; border-radius: 6px; padding: 12px; font-size: 13px; color: #854d0e;'>" +
          "<strong>📌 Status Tracking:</strong><br/>" +
          "Our Admissions desk is reviewing your enquiry. You will receive an email whenever your admission status changes. You can also track your status on our website anytime using your Reference No: <strong>" + data.referenceNo + "</strong>." +
        "</div>" +
      "</div>" +
    "</div>";

  MailApp.sendEmail({ to: studentEmail, subject: subject, htmlBody: htmlBody });
}

/**
 * Sends Status Update Email to Student when Admin updates status
 */
function sendStudentStatusUpdate(data) {
  var studentEmail = data.studentEmail || data.email;
  if (!studentEmail) return;

  var statusColor = "#1e40af";
  var statusBg = "#dbeafe";
  if (data.status === "ADMITTED") {
    statusColor = "#065f46";
    statusBg = "#d1fae5";
  } else if (data.status === "REJECTED") {
    statusColor = "#991b1b";
    statusBg = "#fee2e2";
  } else if (data.status === "COUNSELLING_SCHEDULED") {
    statusColor = "#92400e";
    statusBg = "#fef3c7";
  }

  var subject = "📢 Admission Status Update: " + data.status + " (Ref: " + data.referenceNo + ") | Sri Vidyodaya PU College";
  var htmlBody = 
    "<div style='font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>" +
      "<div style='background-color: #07172C; color: #ffffff; padding: 22px; text-align: center;'>" +
        "<h2 style='margin: 0; color: #D4AF37; font-size: 20px;'>Sri Vidyodaya Composite PU College</h2>" +
        "<p style='margin: 5px 0 0 0; color: #94a3b8; font-size: 13px;'>Admission Enquiry Status Notification</p>" +
      "</div>" +
      "<div style='padding: 24px; background-color: #ffffff; color: #1e293b; line-height: 1.6;'>" +
        "<p style='font-size: 15px; margin-top: 0;'>Dear <strong>" + (data.studentName || "Candidate") + "</strong>,</p>" +
        "<p>The Admissions Office has updated the status of your admission enquiry (Reference No: <strong style='font-family: monospace; color: #1e40af;'>" + data.referenceNo + "</strong>):</p>" +
        "<div style='background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 18px 0; text-align: center;'>" +
          "<span style='font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;'>Updated Admission Status</span>" +
          "<div style='margin-top: 6px;'>" +
            "<span style='display: inline-block; background-color: " + statusBg + "; color: " + statusColor + "; padding: 8px 18px; border-radius: 9999px; font-size: 16px; font-weight: 800;'>" +
              data.status +
            "</span>" +
          "</div>" +
          "<div style='font-size: 12px; color: #94a3b8; margin-top: 6px;'>Previous: " + (data.oldStatus || "NEW") + " • Updated: " + (data.updatedAt || new Date().toLocaleString()) + "</div>" +
        "</div>" +
        (data.note ? 
          "<div style='background-color: #f1f5f9; border-left: 4px solid #07172C; border-radius: 4px; padding: 12px; margin-bottom: 18px; font-size: 13.5px;'>" +
            "<strong>Remarks from Admissions Office:</strong>" +
            "<p style='margin: 4px 0 0 0; color: #334155; white-space: pre-line;'>" + data.note + "</p>" +
          "</div>" : "") +
        "<div style='background-color: #eff6ff; border-radius: 6px; padding: 12px; font-size: 13px; color: #1e40af;'>" +
          "ℹ️ You can also track your live admission status anytime on our website using your reference number: <strong>" + data.referenceNo + "</strong>." +
        "</div>" +
      "</div>" +
    "</div>";

  MailApp.sendEmail({ to: studentEmail, subject: subject, htmlBody: htmlBody });
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ status: "ready", sheetId: TARGET_SPREADSHEET_ID }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const filteredEnquiries = enquiries.filter(e =>
    e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.studentPhone.includes(searchQuery)
  );

  return (
    <div>
      <div className="admin-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 className="admin-header-title">Admission Enquiries Management</h1>
          <p className="admin-header-subtitle">
            Review candidate details, schedule counselling, and auto-forward all admissions to Google Spreadsheet
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Direct Google Spreadsheet Link */}
          {isCustomSheetLinked ? (
            <a 
              href={sheetsConfig.spreadsheetUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-sm"
              style={{ 
                backgroundColor: '#0F9D58', 
                color: '#ffffff', 
                border: '1px solid #0b8043', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.45rem', 
                fontWeight: '600',
                padding: '0.5rem 0.95rem',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(15, 157, 88, 0.25)',
                textDecoration: 'none'
              }}
              title={`Open Google Spreadsheet for ${sheetsConfig.ownerEmail}`}
            >
              <FileSpreadsheet size={16} /> Google Spreadsheet <ExternalLink size={13} />
            </a>
          ) : (
            <button
              onClick={() => setSheetsModalOpen(true)}
              className="btn btn-sm"
              style={{ 
                backgroundColor: '#0F9D58', 
                color: '#ffffff', 
                border: '1px solid #0b8043', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.45rem', 
                fontWeight: '600',
                padding: '0.5rem 0.95rem',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(15, 157, 88, 0.25)',
                cursor: 'pointer'
              }}
              title="Click to link your 'New Admission List' Google Sheet"
            >
              <FileSpreadsheet size={16} /> Connect Google Sheet
            </button>
          )}

          {/* Sync to Sheet button */}
          <button 
            onClick={handleSyncSheets} 
            disabled={syncingSheets}
            className="btn btn-outline-primary btn-sm" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: '600' }}
            title="Sync all database admission records to Google Sheet"
          >
            <RefreshCw size={14} className={syncingSheets ? "spin-animation" : ""} />
            {syncingSheets ? 'Syncing...' : 'Sync to Sheet'}
          </button>

          {/* Sheet Settings button */}
          <button 
            onClick={() => setSheetsModalOpen(true)}
            className="btn btn-outline-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Configure Spreadsheet Link & Webhook URL"
          >
            <SettingsIcon size={14} /> Sheet Config
          </button>

          <button onClick={handleExportCsv} className="btn btn-outline-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Google Spreadsheet Environment Banner */}
      <div style={{
        backgroundColor: isCustomSheetLinked ? '#f0fdf4' : '#fffbeb',
        border: `1px solid ${isCustomSheetLinked ? '#bbf7d0' : '#fde68a'}`,
        borderRadius: '8px',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: isCustomSheetLinked ? '#0F9D58' : '#d97706', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <FileSpreadsheet size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: '700', color: isCustomSheetLinked ? '#166534' : '#92400e' }}>
                Google Spreadsheet Live Forwarding
              </span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                backgroundColor: sheetsConfig.hasWebhook ? '#dcfce7' : (isCustomSheetLinked ? '#fef3c7' : '#fee2e2'),
                color: sheetsConfig.hasWebhook ? '#166534' : (isCustomSheetLinked ? '#b45309' : '#dc2626'),
                padding: '0.15rem 0.55rem',
                borderRadius: '9999px',
                border: `1px solid ${sheetsConfig.hasWebhook ? '#86efac' : (isCustomSheetLinked ? '#fde68a' : '#fecaca')}`
              }}>
                {sheetsConfig.hasWebhook 
                  ? '● Live Auto-Sync Active' 
                  : (isCustomSheetLinked ? '● Webhook Needed for Real-time Forward' : '● Action Required: Connect "New Admission List"')}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: isCustomSheetLinked ? '#15803d' : '#b45309', marginTop: '0.15rem' }}>
              Target Google Account: <strong>{sheetsConfig.ownerEmail || 'sharanappagouda148@gmail.com'}</strong>
              {!isCustomSheetLinked && " ➔ Copy the URL of your open 'New Admission List' tab and paste it into Sheet Config."}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isCustomSheetLinked ? (
            <a
              href={sheetsConfig.spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#0F9D58',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#ffffff',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #86efac'
              }}
            >
              Open Your Sheet <ExternalLink size={13} />
            </a>
          ) : (
            <button
              onClick={() => setSheetsModalOpen(true)}
              style={{
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#b45309',
                backgroundColor: '#ffffff',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #fde68a',
                cursor: 'pointer'
              }}
            >
              Connect "New Admission List" Tab ➔
            </button>
          )}
        </div>
      </div>

      {/* Sync Result Banner if any */}
      {syncResult && (
        <div style={{
          backgroundColor: syncResult.type === 'success' ? '#ecfdf5' : (syncResult.type === 'warning' ? '#fffbeb' : '#fef2f2'),
          border: `1px solid ${syncResult.type === 'success' ? '#10b981' : (syncResult.type === 'warning' ? '#f59e0b' : '#ef4444')}`,
          color: syncResult.type === 'success' ? '#065f46' : (syncResult.type === 'warning' ? '#92400e' : '#991b1b'),
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            {syncResult.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{syncResult.message}</span>
          </div>
          <button
            onClick={() => setSyncResult(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by student name, ref number, or phone..."
              style={{ paddingLeft: '2.4rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '180px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {statusOptions.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Stream Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="form-select"
              value={streamFilter}
              onChange={(e) => setStreamFilter(e.target.value)}
            >
              <option value="ALL">All Streams</option>
              <option value="SCIENCE">Science</option>
              <option value="COMMERCE">Commerce</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ref Number</th>
              <th>Student & Parent</th>
              <th>Contacts</th>
              <th>Stream / Comb</th>
              <th>10th Board</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading admission enquiries...
                </td>
              </tr>
            ) : filteredEnquiries.length > 0 ? (
              filteredEnquiries.map(enquiry => (
                <tr key={enquiry.id}>
                  <td>
                    <strong style={{ color: 'var(--primary-800)', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                      {enquiry.referenceNo}
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {enquiry.createdAt ? enquiry.createdAt.slice(0, 10) : ''}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{enquiry.studentName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Parent: {enquiry.parentName}</div>
                    {enquiry.address && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        📍 {enquiry.address} {enquiry.pincode ? `(${enquiry.pincode})` : ''}
                      </div>
                    )}
                    {enquiry.referredBy && (
                      <div style={{ fontSize: '0.72rem', color: '#b45309', marginTop: '2px' }}>
                        Ref: {enquiry.referredBy}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>📞 {enquiry.studentPhone}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>✉️ {enquiry.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${enquiry.preferredStream === 'SCIENCE' ? 'badge-science' : 'badge-commerce'}`}>
                      {enquiry.preferredCombination}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {enquiry.preferredStream}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{enquiry.board}</span>
                  </td>
                  <td>
                    <span className="badge" style={{
                      backgroundColor: enquiry.status === 'NEW' ? '#dbeafe' : enquiry.status === 'ADMITTED' ? '#d1fae5' : enquiry.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                      color: enquiry.status === 'NEW' ? '#1e40af' : enquiry.status === 'ADMITTED' ? '#065f46' : enquiry.status === 'REJECTED' ? '#991b1b' : '#b45309'
                    }}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => openModal(enquiry)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <Eye size={13} /> View & Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No admission enquiries found matching the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enquiry Detail & Status Update Modal */}
      {selectedEnquiry && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2.25rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedEnquiry(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-900)' }}>
                  Enquiry: {selectedEnquiry.referenceNo}
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Received on {selectedEnquiry.createdAt}
                </span>
              </div>
              <span className="badge" style={{
                backgroundColor: selectedEnquiry.status === 'ADMITTED' ? '#d1fae5' : '#dbeafe',
                color: selectedEnquiry.status === 'ADMITTED' ? '#065f46' : '#1e40af',
                fontSize: '0.85rem'
              }}>
                {selectedEnquiry.status}
              </span>
            </div>

            {/* Candidate Details Grid */}
            <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div>
                <strong>Student Full Name:</strong>
                <div>{selectedEnquiry.studentName}</div>
              </div>
              <div>
                <strong>Parent / Guardian:</strong>
                <div>{selectedEnquiry.parentName}</div>
              </div>
              <div>
                <strong>Student Mobile:</strong>
                <div>{selectedEnquiry.studentPhone}</div>
              </div>
              <div>
                <strong>Parent Mobile:</strong>
                <div>{selectedEnquiry.parentPhone}</div>
              </div>
              <div>
                <strong>Student Email:</strong>
                <div style={{ color: '#1e40af', fontWeight: '600' }}>{selectedEnquiry.email}</div>
              </div>
              <div>
                <strong>Parent Email:</strong>
                <div>{selectedEnquiry.parentEmail || '—'}</div>
              </div>
              <div>
                <strong>Staff Alert Recipient:</strong>
                <div style={{ color: '#6b21a8', fontSize: '0.82rem' }}>{sheetsConfig.ownerEmail || 'sharanappagoudapolicepatil60@gmail.com'}</div>
              </div>
              <div>
                <strong>10th / SSLC Board:</strong>
                <div>{selectedEnquiry.board}</div>
              </div>
              <div>
                <strong>Preferred Stream & Comb:</strong>
                <div>{selectedEnquiry.preferredStream} - {selectedEnquiry.preferredCombination}</div>
              </div>
              <div>
                <strong>Academic Year:</strong>
                <div>{selectedEnquiry.academicYear}</div>
              </div>
              <div>
                <strong>Residential Address:</strong>
                <div>{selectedEnquiry.address || '—'}</div>
              </div>
              <div>
                <strong>Pincode:</strong>
                <div>{selectedEnquiry.pincode || '—'}</div>
              </div>
              <div>
                <strong>Referred By:</strong>
                <div>{selectedEnquiry.referredBy || '—'}</div>
              </div>
            </div>

            {selectedEnquiry.message && (
              <div style={{ backgroundColor: 'var(--bg-page)', padding: '0.85rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                <strong>Candidate Message:</strong>
                <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>{selectedEnquiry.message}</p>
              </div>
            )}

            {/* Follow-up Notes History */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
                Follow-up Notes & Status History:
              </h4>
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '0.85rem',
                fontSize: '0.82rem',
                maxHeight: '120px',
                overflowY: 'auto',
                whiteSpace: 'pre-line',
                color: 'var(--text-muted)'
              }}>
                {selectedEnquiry.followUpNotes || 'No notes added yet.'}
              </div>
            </div>

            {/* Email & SMS Send Record History for this Candidate */}
            <div style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1.15rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <History size={16} color="var(--primary-700)" /> Email & SMS Send Record History
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setDirectSendOpen(!directSendOpen)}
                    className="btn btn-outline-primary btn-sm"
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Send size={12} /> {directSendOpen ? 'Hide Composer' : 'Send Message'}
                  </button>
                  <Link to="/admin/communication-history" style={{ fontSize: '0.75rem', color: '#1e40af', textDecoration: 'none', fontWeight: 'bold' }}>
                    Full Logs →
                  </Link>
                </div>
              </div>

              {/* Direct Composer Form */}
              {directSendOpen && (
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>
                    Dispatch Direct Message to Staff, Student, or Parent:
                  </div>
                  {directSendStatus && (
                    <div style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.78rem', marginBottom: '0.5rem', backgroundColor: directSendStatus.success ? '#ecfdf5' : '#fef2f2', color: directSendStatus.success ? '#065f46' : '#991b1b' }}>
                      {directSendStatus.message}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.8rem', height: '32px' }}
                      value={directSendTargetType}
                      onChange={(e) => setDirectSendTargetType(e.target.value)}
                    >
                      <option value="STUDENT">To: Student Email ({selectedEnquiry.email})</option>
                      <option value="PARENT">To: Parent ({selectedEnquiry.parentEmail || selectedEnquiry.parentPhone})</option>
                      <option value="STAFF">To: Staff / Admin Email</option>
                    </select>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.8rem', height: '32px', width: '100px' }}
                      value={directSendChannel}
                      onChange={(e) => setDirectSendChannel(e.target.value)}
                    >
                      <option value="EMAIL">Email</option>
                      <option value="SMS">SMS</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type message to send..."
                    value={directSendMessage}
                    onChange={(e) => setDirectSendMessage(e.target.value)}
                    style={{ fontSize: '0.82rem', height: '34px', marginBottom: '0.5rem' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      disabled={directSendSending || !directSendMessage.trim()}
                      onClick={handleSendDirectModalMessage}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Send size={12} /> {directSendSending ? 'Sending...' : 'Send & Record Log'}
                    </button>
                  </div>
                </div>
              )}

              {/* Logs List with Date and Time */}
              {loadingCommLogs ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Loading send history...
                </div>
              ) : commLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '0.85rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No messages logged yet for this enquiry.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {commLogs.map((log) => (
                    <div key={log.id} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.65rem 0.85rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '0.12rem 0.45rem',
                            borderRadius: '4px',
                            backgroundColor: log.recipientType === 'STAFF' ? '#f3e8ff' : log.recipientType === 'STUDENT' ? '#dbeafe' : '#d1fae5',
                            color: log.recipientType === 'STAFF' ? '#6b21a8' : log.recipientType === 'STUDENT' ? '#1e40af' : '#065f46'
                          }}>
                            {log.recipientType} ({log.channel})
                          </span>
                          <span style={{ color: '#64748b', fontSize: '0.72rem', fontFamily: 'monospace' }}>
                            {log.recipientTarget}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b', fontSize: '0.72rem', fontWeight: '600' }}>
                          <Clock size={12} /> {log.createdAt ? log.createdAt.replace('T', ' ').slice(0, 19) : ''}
                        </div>
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--primary-900)', fontSize: '0.8rem' }}>
                        {log.subject}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Update Status Form */}
            <form onSubmit={handleUpdateStatus} style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
                Update Status & Add Log Note:
              </h4>

              {updateMsg && (
                <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {updateMsg}
                </div>
              )}

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">New Status</label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {statusOptions.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Add Note / Action Log</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Spoke to parent, counselling set for 10am"
                    value={followUpNote}
                    onChange={(e) => setFollowUpNote(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="btn btn-outline-primary btn-sm"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn btn-primary btn-sm"
                >
                  {updating ? 'Saving Changes...' : 'Save & Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Sheets Configuration & Setup Modal */}
      {sheetsModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ backgroundColor: '#0F9D58', color: '#fff', padding: '0.35rem', borderRadius: '6px' }}>
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-900)' }}>Google Spreadsheet Admission Environment</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automated forwarding for <strong>{sheetsConfig.ownerEmail || 'sharanappagoudapolicepatil60@gmail.com'}</strong></p>
                </div>
              </div>
              <button 
                onClick={() => setSheetsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSheetsConfig}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Google Spreadsheet URL (Owner: {sheetsConfig.ownerEmail})</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={editSpreadsheetUrl}
                    onChange={(e) => setEditSpreadsheetUrl(e.target.value)}
                    required
                  />
                  <a
                    href={editSpreadsheetUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}
                  >
                    Open <ExternalLink size={13} />
                  </a>
                </div>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  This spreadsheet will open when clicking the green "Google Spreadsheet" button on the UI.
                </small>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Google Apps Script Webhook URL (for instant real-time forwarding)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={editWebhookUrl}
                  onChange={(e) => setEditWebhookUrl(e.target.value)}
                />
                {(editWebhookUrl.includes('/edit') || editWebhookUrl.includes('/home/projects/')) ? (
                  <div style={{ color: '#dc2626', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '0.5rem 0.75rem', marginTop: '0.5rem', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    ⚠️ <strong>Notice:</strong> You pasted the Apps Script editor URL. Google requires the deployed <strong>Web app URL</strong>.<br />
                    In Apps Script, click <strong>Deploy ➔ New deployment</strong> ➔ choose <strong>Web app</strong> (set <em>Who has access</em> to <strong>Anyone</strong>) ➔ click <strong>Deploy</strong>, then copy the URL ending with <strong>/exec</strong>.
                  </div>
                ) : (
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Paste your deployed Apps Script Webhook URL (ending in <code>/exec</code>) for instant automatic forwarding.
                  </small>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Owner Email ID</label>
                <input
                  type="email"
                  className="form-control"
                  value={editOwnerEmail}
                  onChange={(e) => setEditOwnerEmail(e.target.value)}
                  placeholder="sharanappagoudapolicepatil60@gmail.com"
                />
              </div>

              {/* Step by Step Setup Box */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--primary-900)' }}>
                    📋 Google Sheets and Email Setup:
                  </span>
                  <button
                    type="button"
                    onClick={copyScriptToClipboard}
                    className="btn btn-outline-primary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                    {copiedCode ? 'Code Copied!' : 'Copy Script Code'}
                  </button>
                </div>

                <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#475569', lineHeight: '1.6' }}>
                  <li>Open your Google Sheet at <a href={editSpreadsheetUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0F9D58' }}>Google Sheets</a> using <strong>{editOwnerEmail || 'sharanappagoudapolicepatil60@gmail.com'}</strong>.</li>
                  <li>Click <strong>Extensions ➔ Apps Script</strong> in the top menu of your Google Sheet.</li>
                  <li>In Apps Script, replace the existing code with the script below and save it.</li>
                  <li>Choose <strong>sendTestEmail</strong> in the function selector and click <strong>Run</strong>. Sign in as the script owner, review the requested permissions, and click <strong>Allow</strong>. Confirm the test email arrives before continuing.</li>
                  <li>Click <strong>Deploy ➔ New deployment</strong>, select <strong>Web app</strong>, set <em>Execute as</em> to <strong>Me</strong> and <em>Who has access</em> to <strong>Anyone</strong>, then click <strong>Deploy</strong>.</li>
                  <li>Copy the resulting Web App URL and paste it into the Webhook URL field above. If this script is already deployed, use <strong>Deploy ➔ Manage deployments</strong>, edit the deployment, select <strong>New version</strong>, and deploy it again.</li>
                </ol>

                <div style={{ marginTop: '0.75rem', position: 'relative' }}>
                  <pre style={{
                    backgroundColor: '#0f172a',
                    color: '#e2e8f0',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    maxHeight: '130px',
                    overflowY: 'auto'
                  }}>
                    {googleAppsScriptCode}
                  </pre>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setSheetsModalOpen(false)}
                  className="btn btn-outline-primary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="btn btn-primary btn-sm"
                >
                  {savingConfig ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
