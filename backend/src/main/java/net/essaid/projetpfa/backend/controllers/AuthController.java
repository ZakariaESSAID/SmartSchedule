package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.entities.User;
import net.essaid.projetpfa.backend.payload.request.LoginRequest;
import net.essaid.projetpfa.backend.payload.request.SignupRequest;
import net.essaid.projetpfa.backend.payload.response.JwtResponse;
import net.essaid.projetpfa.backend.repository.UserRepository;
import net.essaid.projetpfa.backend.security.jwt.JwtUtils;
import net.essaid.projetpfa.backend.security.services.UserDetailsImpl;
import net.essaid.projetpfa.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailService emailService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        logger.info("Attempting to authenticate user with email: {}", loginRequest.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            logger.info("User authenticated successfully: {}", loginRequest.getEmail());
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getEmail(),
                    roles));
        } catch (Exception e) {
            logger.error("Authentication failed for user {}: {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body("Error: Invalid email or password!");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        logger.info("Attempting to register user with email: {}", signUpRequest.getEmail());
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            logger.warn("Signup failed: Email {} is already in use!", signUpRequest.getEmail());
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }

        String plainPassword = signUpRequest.getPassword();

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(plainPassword));
        user.setRole(signUpRequest.getRole());

        userRepository.save(user);
        logger.info("User registered successfully: {}", signUpRequest.getEmail());

        // Envoyer l'email de bienvenue avec le template HTML approprié
        String subject = "Vos identifiants de connexion SmartSchedule";
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", user.getName());
        templateModel.put("email", user.getEmail());
        templateModel.put("password", plainPassword);

        String templateName = "generic-welcome-email"; // Template par défaut
        if (user.getRole() == User.Role.TEACHER) {
            templateName = "teacher-welcome-email";
        } else if (user.getRole() == User.Role.STUDENT) {
            templateName = "student-welcome-email";
        }
        
        emailService.sendHtmlEmail(user.getEmail(), subject, templateName, templateModel);
        logger.info("Login credentials email sent to {}", user.getEmail());

        return ResponseEntity.ok("User registered successfully! Email sent with credentials.");
    }
}
