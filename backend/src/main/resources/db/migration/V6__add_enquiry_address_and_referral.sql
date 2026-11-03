-- V6: Add address, pincode, and referred_by to admission_enquiries
ALTER TABLE admission_enquiries
    ADD COLUMN address TEXT NULL AFTER message,
    ADD COLUMN pincode VARCHAR(20) NULL AFTER address,
    ADD COLUMN referred_by VARCHAR(150) NULL AFTER pincode;

