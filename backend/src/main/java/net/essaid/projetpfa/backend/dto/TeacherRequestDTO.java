package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.User;

@Data
public class TeacherRequestDTO {
    private String name;
    private String email;
    private String password;
    private String matricule;
    private String phone;
    private String specialty;
    private String departmentId; // ID du département
    private String campusAffectionId;
    private User.TeacherStatus teacherStatus;
    private Boolean isModuleResponsible;
    private String availableDays;
    private String availableTimeSlots;
    private String unavailableTimeSlots;
    private String preferredTimeSlots;
    private Integer weeklyHours;
    private Integer maxWeeklyHours;
    private String nonWorkingDays;
}
