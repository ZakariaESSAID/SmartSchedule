package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.Course;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class CourseRequestDTO {
    private String name;
    private String code;
    private String responsibleTeacherId;
    private Set<String> associatedTeacherIds;
    private String filiereId;
    private String niveauId; // ID du niveau
    private String campusId;
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
}
