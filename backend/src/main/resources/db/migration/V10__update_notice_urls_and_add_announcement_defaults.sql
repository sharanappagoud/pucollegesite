-- V10: Ensure notices and announcements have valid clickable document URLs and targets
UPDATE notices 
SET document_url = '/examinations'
WHERE (document_url IS NULL OR document_url = '#' OR document_url = '') 
  AND (title LIKE '%Unit Test%' OR title LIKE '%Exam%' OR title LIKE '%Timetable%');

UPDATE notices 
SET document_url = '/admissions#scholarships'
WHERE (document_url IS NULL OR document_url = '#' OR document_url = '') 
  AND (title LIKE '%Scholarship%' OR title LIKE '%Fee%');

UPDATE notices 
SET document_url = '/news'
WHERE (document_url IS NULL OR document_url = '#' OR document_url = '');

