package net.essaid.projetpfa.backend.service;

import net.essaid.projetpfa.backend.dto.StudentRequestDTO;
import net.essaid.projetpfa.backend.dto.StudentResponseDTO;
import net.essaid.projetpfa.backend.entities.Campus;
import net.essaid.projetpfa.backend.entities.Filiere;
import net.essaid.projetpfa.backend.entities.Group;
import net.essaid.projetpfa.backend.entities.Niveau;
import net.essaid.projetpfa.backend.entities.User;
import net.essaid.projetpfa.backend.repository.CampusRepository;
import net.essaid.projetpfa.backend.repository.FiliereRepository;
import net.essaid.projetpfa.backend.repository.GroupRepository;
import net.essaid.projetpfa.backend.repository.NiveauRepository;
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
public class StudentService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;
    @Autowired
    private FiliereRepository filiereRepository;
    @Autowired
    private CampusRepository campusRepository;
    @Autowired
    private NiveauRepository niveauRepository;
    @Autowired
    private GroupRepository groupRepository;

    @Transactional
    public StudentResponseDTO createStudent(StudentRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        User student = new User();
        student.setRole(User.Role.STUDENT);
        
        String generatedPassword = RandomStringUtils.randomAlphanumeric(10);
        student.setPassword(passwordEncoder.encode(generatedPassword));
        
        mapDtoToEntity(request, student);
        User savedStudent = userRepository.save(student);

        String subject = "Vos identifiants de connexion SmartSchedule";
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", savedStudent.getName());
        templateModel.put("email", savedStudent.getEmail());
        templateModel.put("password", generatedPassword);
        templateModel.put("role", "Étudiant");
        
        emailService.sendHtmlEmail(savedStudent.getEmail(), subject, "welcome-email", templateModel);

        return new StudentResponseDTO(savedStudent);
    }

    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getAllStudents() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.Role.STUDENT)
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<StudentResponseDTO> getStudentById(String id) {
        return userRepository.findById(id)
                .filter(user -> user.getRole() == User.Role.STUDENT)
                .map(StudentResponseDTO::new);
    }

    @Transactional
    public Optional<StudentResponseDTO> updateStudent(String id, StudentRequestDTO request) {
        return userRepository.findById(id)
                .filter(user -> user.getRole() == User.Role.STUDENT)
                .map(existingStudent -> {
                    mapDtoToEntity(request, existingStudent);
                    User updatedStudent = userRepository.save(existingStudent);
                    return new StudentResponseDTO(updatedStudent);
                });
    }

    @Transactional
    public boolean deleteStudent(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private void mapDtoToEntity(StudentRequestDTO dto, User entity) {
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setStudentIdNumber(dto.getStudentIdNumber());
        entity.setAcademicStatus(dto.getAcademicStatus());
        entity.setAcademicYear(dto.getAcademicYear());

        if (dto.getStudentFiliereId() != null) {
            Filiere filiere = filiereRepository.findById(dto.getStudentFiliereId())
                    .orElseThrow(() -> new RuntimeException("Filiere not found"));
            entity.setStudentFiliere(filiere);
        }
        if (dto.getStudentNiveauId() != null) {
            Niveau niveau = niveauRepository.findById(dto.getStudentNiveauId())
                    .orElseThrow(() -> new RuntimeException("Niveau not found"));
            entity.setStudentNiveau(niveau);
        }
        if (dto.getStudentGroupId() != null) {
            Group group = groupRepository.findById(dto.getStudentGroupId())
                    .orElseThrow(() -> new RuntimeException("Group not found"));
            entity.setStudentGroup(group);
        }
        if (dto.getStudentCampusId() != null) {
            Campus campus = campusRepository.findById(dto.getStudentCampusId())
                    .orElseThrow(() -> new RuntimeException("Campus not found"));
            entity.setStudentCampus(campus);
        }
    }
}
