package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.User;

@Data
public class StudentRequestDTO {
    private String name;
    private String email;
    private String password;
    private String studentIdNumber;
    private String studentFiliereId;
    private String studentNiveauId;
    private String studentGroupId; // ID du groupe
    private String studentCampusId;
    private User.AcademicStatus academicStatus;
    private String academicYear;
}
