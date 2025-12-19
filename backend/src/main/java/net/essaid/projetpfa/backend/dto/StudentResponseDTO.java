package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.User;

@Data
public class StudentResponseDTO {
    private String id;
    private String name;
    private String email;
    private String studentIdNumber;
    private String studentFiliereName;
    private String studentNiveauName; // Renommé pour plus de clarté
    private String studentGroupName; // Renommé pour plus de clarté
    private String studentCampusName;
    private User.AcademicStatus academicStatus;
    private String academicYear;

    public StudentResponseDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.studentIdNumber = user.getStudentIdNumber();
        if (user.getStudentFiliere() != null) {
            this.studentFiliereName = user.getStudentFiliere().getName();
        }
        if (user.getStudentNiveau() != null) {
            this.studentNiveauName = user.getStudentNiveau().getName(); // Correction
        }
        if (user.getStudentGroup() != null) {
            this.studentGroupName = user.getStudentGroup().getName(); // Correction
        }
        if (user.getStudentCampus() != null) {
            this.studentCampusName = user.getStudentCampus().getName();
        }
        this.academicStatus = user.getAcademicStatus();
        this.academicYear = user.getAcademicYear();
    }
}
