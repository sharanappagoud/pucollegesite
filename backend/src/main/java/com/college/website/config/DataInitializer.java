package com.college.website.config;

import com.college.website.entity.CollegeSetting;
import com.college.website.entity.Role;
import com.college.website.entity.User;
import com.college.website.repository.CollegeSettingRepository;
import com.college.website.repository.RoleRepository;
import com.college.website.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private static final String LEGACY_SEEDED_ADMIN_PASSWORD_HASH =
            "$2a$10$hKDVYxL9zR.eA1/55g8a/.uQh5k4lqK.Vd6l9Vj7XbEwKz6V9pG2e";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CollegeSettingRepository settingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           RoleRepository roleRepository,
                           CollegeSettingRepository settingRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.settingRepository = settingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private void initSettingIfMissing(String key, String defaultValue, String category, String description) {
        if (settingRepository.findBySettingKey(key).isEmpty()) {
            settingRepository.save(new CollegeSetting(key, defaultValue, category, description));
            logger.info("Initialized default setting for: {}", key);
        }
    }

    @Override
    public void run(String... args) {
        logger.info("Verifying administrator account...");

        // Ensure default navbar branding settings exist
        initSettingIfMissing("navbar_brand_name", "SRI VIDYODAYA", "BRANDING", "Navbar Primary Brand Title (e.g. SRI VIDYODAYA)");
        initSettingIfMissing("navbar_brand_sub", "COMPOSITE PRE-UNIVERSITY COLLEGE", "BRANDING", "Navbar Subtitle Text (e.g. COMPOSITE PRE-UNIVERSITY COLLEGE)");
        initSettingIfMissing("navbar_brand_tagline", "Recognized by Dept. of PU Education, Govt. of Karnataka", "BRANDING", "Navbar Tagline & Affiliation");

        // Ensure default leadership & Principal's desk settings exist
        initSettingIfMissing("principal_badge_text", "PRINCIPAL'S DESK", "LEADERSHIP", "Badge text on the Principal card");
        initSettingIfMissing("principal_name", "Dr. K. S. Venkatesh", "LEADERSHIP", "Full Name of the Principal");
        initSettingIfMissing("principal_title_line", "M.Sc., M.Phil., Ph.D. | Principal & Professor", "LEADERSHIP", "Qualifications and designation line");
        initSettingIfMissing("principal_photo_url", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", "LEADERSHIP", "Portrait photo URL of the Principal");
        initSettingIfMissing("principal_quote", "The two years of Pre-University education are the most transformative phase in a student's academic journey. At {collegeShortName}, we mentor each student to realize their fullest latent capability, fostering scientific inquiry and disciplined character.", "LEADERSHIP", "Inspirational quote on homepage card");
        initSettingIfMissing("principal_cta_text", "Read Principal's Complete Message", "LEADERSHIP", "Text for the call-to-action link");
        initSettingIfMissing("principal_cta_link", "/about#principal-message", "LEADERSHIP", "Destination URL for the link");
        initSettingIfMissing("principal_accolade", "Recipient of the State Best Teacher Accolade (2019)", "LEADERSHIP", "Honorary award or recognition for the About page");
        initSettingIfMissing("principal_desk_enabled", "true", "LEADERSHIP", "Whether the Principal's Desk widget is visible on the homepage");


        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN", "Full Administrative Privileges")));

        // Preserve an existing administrator's password. Startup must never reset it.
        userRepository.findByUsername("admin").ifPresentOrElse(user -> {
            if (user.getRoles().stream().noneMatch(role -> "ROLE_ADMIN".equals(role.getName()))) {
                user.getRoles().add(adminRole);
            }

            // The original demo seed used a placeholder hash. Upgrade only that known value
            // so fresh installations retain the documented initial sign-in.
            if (LEGACY_SEEDED_ADMIN_PASSWORD_HASH.equals(user.getPassword())) {
                user.setPassword(passwordEncoder.encode("Admin@123"));
            }

            userRepository.save(user);
            logger.info("Administrator account verified.");
        }, () -> {
            User newAdmin = new User();
            newAdmin.setUsername("admin");
            newAdmin.setEmail("admin@svcpuc.edu.in");
            newAdmin.setPassword(passwordEncoder.encode("Admin@123"));
            newAdmin.setFullName("Dr. K. S. Venkatesh (Principal)");
            newAdmin.setPhone("+91 98450 12345");
            newAdmin.setActive(true);
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            newAdmin.setRoles(roles);
            userRepository.save(newAdmin);
            logger.info("Default admin user created successfully.");
        });

    }
}
