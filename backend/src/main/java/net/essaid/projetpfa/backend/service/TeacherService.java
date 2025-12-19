package net.essaid.projetpfa.backend.service;

import net.essaid.projetpfa.backend.dto.TeacherRequestDTO;
import net.essaid.projetpfa.backend.dto.TeacherResponseDTO;
import net.essaid.projetpfa.backend.entities.Campus;
import net.essaid.projetpfa.backend.entities.Departement;
import net.essaid.projetpfa.backend.entities.User;
import net.essaid.projetpfa.backend.repository.CampusRepository;
import net.essaid.projetpfa.backend.repository.DepartementRepository;
import net.essaid.projetpfa.backend.repository.UserRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TeacherService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;
    @Autowired
    private CampusRepository campusRepository;
    @Autowired
    private DepartementRepository departementRepository;

    @Transactional
    public TeacherResponseDTO createTeacher(TeacherRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        User teacher = new User();
        teacher.setRole(User.Role.TEACHER);
        
        String generatedPassword = RandomStringUtils.randomAlphanumeric(10);
        teacher.setPassword(passwordEncoder.encode(generatedPassword));
        
        mapDtoToEntity(request, teacher);
        User savedTeacher = userRepository.save(teacher);

        String subject = "Vos identifiants de connexion SmartSchedule";
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", savedTeacher.getName());
        templateModel.put("email", savedTeacher.getEmail());
        templateModel.put("password", generatedPassword);
        templateModel.put("role", "Enseignant");
        
        emailService.sendHtmlEmail(savedTeacher.getEmail(), subject, "welcome-email", templateModel);

        return new TeacherResponseDTO(savedTeacher);
    }

    @Transactional
    public Optional<TeacherResponseDTO> updateTeacher(String id, TeacherRequestDTO request) {
        return userRepository.findById(id)
                .filter(user -> user.getRole() == User.Role.TEACHER)
                .map(existingTeacher -> {
                    mapDtoToEntity(request, existingTeacher);
                    User updatedTeacher = userRepository.save(existingTeacher);
                    return new TeacherResponseDTO(updatedTeacher);
                });
    }

    private void mapDtoToEntity(TeacherRequestDTO dto, User entity) {
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setMatricule(dto.getMatricule());
        entity.setPhone(dto.getPhone());
        entity.setSpecialty(dto.getSpecialty());
        entity.setTeacherStatus(dto.getTeacherStatus());
        entity.setIsModuleResponsible(dto.getIsModuleResponsible());
        entity.setAvailableDays(dto.getAvailableDays());
        entity.setAvailableTimeSlots(dto.getAvailableTimeSlots());
        entity.setUnavailableTimeSlots(dto.getUnavailableTimeSlots());
        entity.setPreferredTimeSlots(dto.getPreferredTimeSlots());
        entity.setWeeklyHours(dto.getWeeklyHours());
        entity.setMaxWeeklyHours(dto.getMaxWeeklyHours());
        entity.setNonWorkingDays(dto.getNonWorkingDays());

        if (dto.getCampusAffectionId() != null) {
            Campus campus = campusRepository.findById(dto.getCampusAffectionId())
                    .orElseThrow(() -> new RuntimeException("Campus not found with id: " + dto.getCampusAffectionId()));
            entity.setCampusAffection(campus);
        } else {
            entity.setCampusAffection(null);
        }

        if (dto.getDepartmentId() != null) {
            Departement departement = departementRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Departement not found with id: " + dto.getDepartmentId()));
            entity.setDepartment(departement);
        } else {
            entity.setDepartment(null);
        }
    }

    // ... autres méthodes ...
    @Transactional(readOnly = true)
    public List<TeacherResponseDTO> getAllTeachers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.Role.TEACHER)
                .map(TeacherResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<TeacherResponseDTO> getTeacherById(String id) {
        return userRepository.findById(id)
                .filter(user -> user.getRole() == User.Role.TEACHER)
                .map(TeacherResponseDTO::new);
    }

    @Transactional
    public boolean deleteTeacher(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
