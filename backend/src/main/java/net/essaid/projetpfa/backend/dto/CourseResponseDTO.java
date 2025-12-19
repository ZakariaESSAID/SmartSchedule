package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.Course;
import net.essaid.projetpfa.backend.entities.User;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class CourseResponseDTO {
    private String id;
    private String name;
    private String code;
    private String responsibleTeacherName;
    private Set<String> associatedTeacherNames;
    private String filiereName;
    private String niveauName; // Renommé pour plus de clarté
    private String campusName;
    private BigDecimal totalHours;
    private BigDecimal cmHours;
    private BigDecimal tdHours;
    private BigDecimal tpHours;
    private Integer sessionDurationMinutes;
    private Course.Frequency frequency;
    private String groupsAffected;
    private Integer groupCapacity;
    private String allowedTimeSlots;
    private String forbiddenTimeSlots;
    private String requiredCampus;
    private Course.Priority priority;
    private Course.CourseStatus status;
    private String semester;
    private String description;

    public CourseResponseDTO(Course course) {
        this.id = course.getId();
        this.name = course.getName();
        this.code = course.getCode();
        if (course.getResponsibleTeacher() != null) {
            this.responsibleTeacherName = course.getResponsibleTeacher().getName();
        }
        if (course.getAssociatedTeachers() != null) {
            this.associatedTeacherNames = course.getAssociatedTeachers().stream()
                                                .map(User::getName)
                                                .collect(Collectors.toSet());
        }
        if (course.getFiliere() != null) {
            this.filiereName = course.getFiliere().getName();
        }
        if (course.getNiveau() != null) {
            this.niveauName = course.getNiveau().getName(); // Correction ici
        }
        if (course.getCampus() != null) {
            this.campusName = course.getCampus().getName();
        }
        this.totalHours = course.getTotalHours();
        this.cmHours = course.getCmHours();
        this.tdHours = course.getTdHours();
        this.tpHours = course.getTpHours();
        this.sessionDurationMinutes = course.getSessionDurationMinutes();
        this.frequency = course.getFrequency();
        this.groupsAffected = course.getGroupsAffected();
        this.groupCapacity = course.getGroupCapacity();
        this.allowedTimeSlots = course.getAllowedTimeSlots();
        this.forbiddenTimeSlots = course.getForbiddenTimeSlots();
        this.requiredCampus = course.getRequiredCampus();
        this.priority = course.getPriority();
        this.status = course.getStatus();
        this.semester = course.getSemester();
        this.description = course.getDescription();
    }
}
