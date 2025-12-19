package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.User;

@Data
public class TeacherResponseDTO {
    private String id;
    private String name;
    private String email;
    private String matricule;
    private String phone;
    private String specialty;
    private String departmentName; // Renommé pour plus de clarté
    private String campusAffectionName;
    private User.TeacherStatus teacherStatus;
    private Boolean isModuleResponsible;
    private String availableDays;
    private String availableTimeSlots;
    private String unavailableTimeSlots;
    private String preferredTimeSlots;
    private Integer weeklyHours;
    private Integer maxWeeklyHours;
    private String nonWorkingDays;

    public TeacherResponseDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.matricule = user.getMatricule();
        this.phone = user.getPhone();
        this.specialty = user.getSpecialty();
        if (user.getDepartment() != null) {
            this.departmentName = user.getDepartment().getName();
        }
        if (user.getCampusAffection() != null) {
            this.campusAffectionName = user.getCampusAffection().getName();
        }
        this.teacherStatus = user.getTeacherStatus();
        this.isModuleResponsible = user.getIsModuleResponsible();
        this.availableDays = user.getAvailableDays();
        this.availableTimeSlots = user.getAvailableTimeSlots();
        this.unavailableTimeSlots = user.getUnavailableTimeSlots();
        this.preferredTimeSlots = user.getPreferredTimeSlots();
        this.weeklyHours = user.getWeeklyHours();
        this.maxWeeklyHours = user.getMaxWeeklyHours();
        this.nonWorkingDays = user.getNonWorkingDays();
    }
}
