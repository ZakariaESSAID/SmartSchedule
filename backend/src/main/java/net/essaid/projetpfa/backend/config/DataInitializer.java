package net.essaid.projetpfa.backend.config;

import net.essaid.projetpfa.backend.entities.User;
import net.essaid.projetpfa.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // --- Initialisation de l'utilisateur ADMIN ---
        // On s'assure qu'il existe et que son mot de passe est toujours le même
        Optional<User> adminOpt = userRepository.findByEmail("admin@example.com");
        User admin;
        if (adminOpt.isEmpty()) {
            admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setRole(User.Role.ADMIN);
            System.out.println("Admin user created.");
        } else {
            admin = adminOpt.get();
            System.out.println("Admin user found. Resetting password.");
        }
        admin.setPassword(passwordEncoder.encode("password123"));
        userRepository.save(admin);


        // --- Initialisation de l'utilisateur TEACHER (uniquement s'il n'existe pas) ---
        if (userRepository.findByEmail("teacher@example.com").isEmpty()) {
            User teacher = new User();
            teacher.setName("Teacher User");
            teacher.setEmail("teacher@example.com");
            teacher.setPassword(passwordEncoder.encode("password123"));
            teacher.setRole(User.Role.TEACHER);
            userRepository.save(teacher);
            System.out.println("Teacher user created.");
        }

        // --- Initialisation de l'utilisateur STUDENT (uniquement s'il n'existe pas) ---
        if (userRepository.findByEmail("student@example.com").isEmpty()) {
            User student = new User();
            student.setName("Student User");
            student.setEmail("student@example.com");
            student.setPassword(passwordEncoder.encode("password123"));
            student.setRole(User.Role.STUDENT);
            userRepository.save(student);
            System.out.println("Student user created.");
        }
    }
}
