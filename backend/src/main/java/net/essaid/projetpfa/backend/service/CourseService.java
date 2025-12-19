package net.essaid.projetpfa.backend.service;

import net.essaid.projetpfa.backend.dto.CourseRequestDTO;
import net.essaid.projetpfa.backend.dto.CourseResponseDTO;
import net.essaid.projetpfa.backend.entities.Campus;
import net.essaid.projetpfa.backend.entities.Course;
import net.essaid.projetpfa.backend.entities.Filiere;
import net.essaid.projetpfa.backend.entities.Niveau;
import net.essaid.projetpfa.backend.entities.User;
import net.essaid.projetpfa.backend.repository.CampusRepository;
import net.essaid.projetpfa.backend.repository.CourseRepository;
import net.essaid.projetpfa.backend.repository.FiliereRepository;
import net.essaid.projetpfa.backend.repository.NiveauRepository;
import net.essaid.projetpfa.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CampusRepository campusRepository;

    @Autowired
    private FiliereRepository filiereRepository;

    @Autowired
    private NiveauRepository niveauRepository;

    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(CourseResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<CourseResponseDTO> getCourseById(String id) {
        return courseRepository.findById(id).map(CourseResponseDTO::new);
    }

    @Transactional
    public CourseResponseDTO createCourse(CourseRequestDTO courseRequest) {
        Course course = new Course();
        mapDtoToEntity(courseRequest, course);
        Course savedCourse = courseRepository.save(course);
        return new CourseResponseDTO(savedCourse);
    }

    @Transactional
    public Optional<CourseResponseDTO> updateCourse(String id, CourseRequestDTO courseRequest) {
        return courseRepository.findById(id)
                .map(existingCourse -> {
                    mapDtoToEntity(courseRequest, existingCourse);
                    Course updatedCourse = courseRepository.save(existingCourse);
                    return new CourseResponseDTO(updatedCourse);
                });
    }

    @Transactional
    public boolean deleteCourse(String id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private void mapDtoToEntity(CourseRequestDTO dto, Course entity) {
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setTotalHours(dto.getTotalHours());
        entity.setCmHours(dto.getCmHours());
        entity.setTdHours(dto.getTdHours());
        entity.setTpHours(dto.getTpHours());
        entity.setSessionDurationMinutes(dto.getSessionDurationMinutes());
        entity.setFrequency(dto.getFrequency());
        entity.setGroupsAffected(dto.getGroupsAffected());
        entity.setGroupCapacity(dto.getGroupCapacity());
        entity.setAllowedTimeSlots(dto.getAllowedTimeSlots());
        entity.setForbiddenTimeSlots(dto.getForbiddenTimeSlots());
        entity.setRequiredCampus(dto.getRequiredCampus());
        entity.setPriority(dto.getPriority());
        entity.setStatus(dto.getStatus());
        entity.setSemester(dto.getSemester());
        entity.setDescription(dto.getDescription());

        // Gérer les relations
        if (dto.getResponsibleTeacherId() != null) {
            User responsibleTeacher = userRepository.findById(dto.getResponsibleTeacherId())
                    .orElseThrow(() -> new RuntimeException("Responsible Teacher not found with id: " + dto.getResponsibleTeacherId()));
            entity.setResponsibleTeacher(responsibleTeacher);
        } else {
            entity.setResponsibleTeacher(null);
        }

        if (dto.getAssociatedTeacherIds() != null) {
            Set<User> associatedTeachers = new HashSet<>(userRepository.findAllById(dto.getAssociatedTeacherIds()));
            entity.setAssociatedTeachers(associatedTeachers);
        }

        if (dto.getFiliereId() != null) {
            Filiere filiere = filiereRepository.findById(dto.getFiliereId())
                    .orElseThrow(() -> new RuntimeException("Filiere not found with id: " + dto.getFiliereId()));
            entity.setFiliere(filiere);
        } else {
            entity.setFiliere(null);
        }

        if (dto.getCampusId() != null) {
            Campus campus = campusRepository.findById(dto.getCampusId())
                    .orElseThrow(() -> new RuntimeException("Campus not found with id: " + dto.getCampusId()));
            entity.setCampus(campus);
        } else {
            entity.setCampus(null);
        }

        if (dto.getNiveauId() != null) {
            Niveau niveau = niveauRepository.findById(dto.getNiveauId())
                    .orElseThrow(() -> new RuntimeException("Niveau not found with id: " + dto.getNiveauId()));
            entity.setNiveau(niveau);
        } else {
            entity.setNiveau(null);
        }
    }
}
