-- V8__banner_text_colors.sql: Add customizable text and highlight colors for hero carousel banners
ALTER TABLE banners
    ADD COLUMN title_color VARCHAR(30) DEFAULT '#FFFFFF' AFTER subtitle,
    ADD COLUMN highlight_text VARCHAR(255) NULL AFTER title_color,
    ADD COLUMN highlight_color VARCHAR(30) DEFAULT '#E6CA65' AFTER highlight_text,
    ADD COLUMN subtitle_color VARCHAR(30) DEFAULT '#CBD5E1' AFTER highlight_color;

UPDATE banners 
SET title_color = '#FFFFFF', 
    highlight_text = 'Engineering, Medicine & Corporate', 
    highlight_color = '#E6CA65', 
    subtitle_color = '#CBD5E1'
WHERE id = 1;

UPDATE banners 
SET title_color = '#FFFFFF', 
    highlight_text = 'KCET, NEET & JEE', 
    highlight_color = '#E6CA65', 
    subtitle_color = '#CBD5E1'
WHERE id = 2;

UPDATE banners 
SET title_color = '#FFFFFF', 
    highlight_text = 'Commerce, CA Foundation & Analytics', 
    highlight_color = '#E6CA65', 
    subtitle_color = '#CBD5E1'
WHERE id = 3;

