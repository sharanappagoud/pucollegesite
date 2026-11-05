-- V9: Add Model Question Paper Document support to examinations
ALTER TABLE examinations ADD COLUMN model_question_paper_url VARCHAR(500) NULL AFTER time_table_url;

-- Populate default model papers for existing seed examinations
UPDATE examinations
SET model_question_paper_url = '/uploads/model-paper-midterm-2026.pdf'
WHERE exam_type = 'MID_TERM' AND model_question_paper_url IS NULL;

UPDATE examinations
SET model_question_paper_url = '/uploads/model-paper-preparatory-2027.pdf'
WHERE exam_type = 'PREPARATORY' AND model_question_paper_url IS NULL;

UPDATE examinations
SET model_question_paper_url = '/uploads/model-paper-stateboard-2027.pdf'
WHERE exam_type = 'ANNUAL_BOARD' AND model_question_paper_url IS NULL;

UPDATE examinations
SET model_question_paper_url = '/uploads/model-paper-unit1-2026.pdf'
WHERE exam_type = 'UNIT_TEST' AND model_question_paper_url IS NULL;

