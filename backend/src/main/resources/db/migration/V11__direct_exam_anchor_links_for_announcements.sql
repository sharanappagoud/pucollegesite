-- V11: Direct anchor links for announcements so clicking scrolls directly to the relevant examination
UPDATE notices 
SET document_url = '/examinations#exam-unit-test'
WHERE title LIKE '%Unit Test%';

UPDATE notices 
SET document_url = '/examinations#exam-mid-term'
WHERE title LIKE '%Mid-Term%' OR title LIKE '%Mid Term%';

UPDATE notices 
SET document_url = '/examinations#exam-preparatory'
WHERE title LIKE '%Preparatory%';

UPDATE notices 
SET document_url = '/examinations#exam-annual-board'
WHERE title LIKE '%Board Exam%' OR title LIKE '%Annual%';
