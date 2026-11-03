-- V5__google_sheets_sync.sql: Configure Google Spreadsheet integration for admissions forwarding

INSERT INTO college_settings (setting_key, setting_value, category, description) VALUES
('google_sheets_owner_email', 'Sharanappagouda148@gmail.com', 'INTEGRATIONS', 'Google Spreadsheet Owner Email for Admissions'),
('google_sheets_spreadsheet_url', 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing', 'INTEGRATIONS', 'Google Spreadsheet URL for Real-Time Admission Sync'),
('google_sheets_webhook_url', '', 'INTEGRATIONS', 'Google Apps Script Webhook URL for Admission Forwarding'),
('google_sheets_sync_enabled', 'true', 'INTEGRATIONS', 'Enable Automatic Forwarding of Admissions to Google Spreadsheet')
ON DUPLICATE KEY UPDATE 
    setting_value = VALUES(setting_value),
    description = VALUES(description);

