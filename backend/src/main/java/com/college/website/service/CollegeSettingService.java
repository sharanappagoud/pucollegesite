package com.college.website.service;

import com.college.website.dto.CollegeSettingDto;
import com.college.website.entity.CollegeSetting;
import com.college.website.repository.CollegeSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CollegeSettingService {

    private final CollegeSettingRepository settingRepository;
    private final AuditLogService auditLogService;

    public CollegeSettingService(CollegeSettingRepository settingRepository,
                                 AuditLogService auditLogService) {
        this.settingRepository = settingRepository;
        this.auditLogService = auditLogService;
    }

    public Map<String, String> getAllSettingsAsMap() {
        Map<String, String> map = new HashMap<>();
        settingRepository.findAll().forEach(s -> map.put(s.getSettingKey(), s.getSettingValue()));
        return map;
    }

    public List<CollegeSettingDto> getAllSettings() {
        return settingRepository.findAll().stream()
                .map(s -> new CollegeSettingDto(s.getId(), s.getSettingKey(), s.getSettingValue(), s.getCategory(), s.getDescription()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateSetting(String key, String value, String adminUsername) {
        CollegeSetting setting = settingRepository.findBySettingKey(key)
                .orElse(new CollegeSetting(key, value, "GENERAL", key));
        setting.setSettingValue(value != null ? value : "");
        settingRepository.save(setting);
        auditLogService.logAction(adminUsername, "UPDATE_SETTING", "SETTINGS", "Updated key: " + key);

        // When college_name is updated alone, only sync if navbar_brand_name is not already present or is empty
        if ("college_name".equals(key) && value != null && !value.isBlank()) {
            boolean hasBrand = settingRepository.findBySettingKey("navbar_brand_name")
                    .map(CollegeSetting::getSettingValue)
                    .filter(v -> v != null && !v.isBlank())
                    .isPresent();
            if (!hasBrand) {
                syncNavbarBrandingFromCollegeName(value);
            }
        }
    }

    @Transactional
    public void updateSettings(Map<String, String> settingsMap, String adminUsername) {
        if (settingsMap == null || settingsMap.isEmpty()) return;

        boolean hasExplicitBrand = settingsMap.containsKey("navbar_brand_name") &&
                settingsMap.get("navbar_brand_name") != null &&
                !settingsMap.get("navbar_brand_name").isBlank();

        settingsMap.forEach((key, value) -> {
            if (key != null) {
                CollegeSetting setting = settingRepository.findBySettingKey(key)
                        .orElse(new CollegeSetting(key, value != null ? value : "", "GENERAL", key));
                setting.setSettingValue(value != null ? value : "");
                settingRepository.save(setting);
            }
        });

        auditLogService.logAction(adminUsername, "UPDATE_SETTINGS_BATCH", "SETTINGS",
                "Batch updated " + settingsMap.size() + " settings");

        // Only sync branding if college_name was supplied and navbar_brand_name was NOT explicitly provided
        if (!hasExplicitBrand && settingsMap.containsKey("college_name")) {
            String cName = settingsMap.get("college_name");
            if (cName != null && !cName.isBlank()) {
                syncNavbarBrandingFromCollegeName(cName);
            }
        }
    }

    private void syncNavbarBrandingFromCollegeName(String collegeName) {
        String trimmed = collegeName.trim();
        String[] words = trimmed.split("\\s+");
        String brandPrimary;
        String brandSub;

        if (words.length >= 2 && List.of("sri", "st.", "st", "the", "new", "mount").contains(words[0].toLowerCase())) {
            brandPrimary = (words[0] + " " + words[1]).toUpperCase();
            brandSub = words.length > 2 ? String.join(" ", java.util.Arrays.copyOfRange(words, 2, words.length)).toUpperCase() : "PU COLLEGE";
        } else if (words.length >= 1) {
            brandPrimary = words[0].toUpperCase();
            brandSub = words.length > 1 ? String.join(" ", java.util.Arrays.copyOfRange(words, 1, words.length)).toUpperCase() : "PRE-UNIVERSITY COLLEGE";
        } else {
            brandPrimary = trimmed.toUpperCase();
            brandSub = "PRE-UNIVERSITY COLLEGE";
        }

        CollegeSetting brandSetting = settingRepository.findBySettingKey("navbar_brand_name")
                .orElse(new CollegeSetting("navbar_brand_name", brandPrimary, "BRANDING", "Navbar Brand Primary Title"));
        brandSetting.setSettingValue(brandPrimary);
        settingRepository.save(brandSetting);

        CollegeSetting subSetting = settingRepository.findBySettingKey("navbar_brand_sub")
                .orElse(new CollegeSetting("navbar_brand_sub", brandSub, "BRANDING", "Navbar Brand Subtitle"));
        subSetting.setSettingValue(brandSub);
        settingRepository.save(subSetting);
    }
}
