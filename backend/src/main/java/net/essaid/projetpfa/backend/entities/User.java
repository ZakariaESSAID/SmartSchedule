package net.essaid.projetpfa.backend.entities;

import jakarta.persistence.*;
import java.util.Objects;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(unique = true)
    private String email;

    private String password;

    // --- Champs Enseignant ---
    private String matricule;
    private String phone;
    private String specialty;
    
    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement department;

    @ManyToOne
    @JoinColumn(name = "campus_affection_id")
    private Campus campusAffection;

    @Enumerated(EnumType.STRING)
    private TeacherStatus teacherStatus;

    private Boolean isModuleResponsible;
    @Column(columnDefinition = "TEXT")
    private String availableDays;
    @Column(columnDefinition = "TEXT")
    private String availableTimeSlots;
    @Column(columnDefinition = "TEXT")
    private String unavailableTimeSlots;
    @Column(columnDefinition = "TEXT")
    private String preferredTimeSlots;
    private Integer weeklyHours;
    private Integer maxWeeklyHours;
    @Column(columnDefinition = "TEXT")
    private String nonWorkingDays;

    // --- Champs Étudiant ---
    private String studentIdNumber;

    @ManyToOne
    @JoinColumn(name = "student_filiere_id")
    private Filiere studentFiliere;

    @ManyToOne
    @JoinColumn(name = "student_niveau_id")
    private Niveau studentNiveau;

    @ManyToOne
    @JoinColumn(name = "student_group_id")
    private Group studentGroup;
    
    @ManyToOne
    @JoinColumn(name = "student_campus_id")
    private Campus studentCampus;

    @Enumerated(EnumType.STRING)
    private AcademicStatus academicStatus;
    private String academicYear;

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public Departement getDepartment() { return department; }
    public void setDepartment(Departement department) { this.department = department; }
    public Campus getCampusAffection() { return campusAffection; }
    public void setCampusAffection(Campus campusAffection) { this.campusAffection = campusAffection; }
    public TeacherStatus getTeacherStatus() { return teacherStatus; }
    public void setTeacherStatus(TeacherStatus teacherStatus) { this.teacherStatus = teacherStatus; }
    public Boolean getIsModuleResponsible() { return isModuleResponsible; }
    public void setIsModuleResponsible(Boolean moduleResponsible) { isModuleResponsible = moduleResponsible; }
    public String getAvailableDays() { return availableDays; }
    public void setAvailableDays(String availableDays) { this.availableDays = availableDays; }
    public String getAvailableTimeSlots() { return availableTimeSlots; }
    public void setAvailableTimeSlots(String availableTimeSlots) { this.availableTimeSlots = availableTimeSlots; }
    public String getUnavailableTimeSlots() { return unavailableTimeSlots; }
    public void setUnavailableTimeSlots(String unavailableTimeSlots) { this.unavailableTimeSlots = unavailableTimeSlots; }
    public String getPreferredTimeSlots() { return preferredTimeSlots; }
    public void setPreferredTimeSlots(String preferredTimeSlots) { this.preferredTimeSlots = preferredTimeSlots; }
    public Integer getWeeklyHours() { return weeklyHours; }
    public void setWeeklyHours(Integer weeklyHours) { this.weeklyHours = weeklyHours; }
    public Integer getMaxWeeklyHours() { return maxWeeklyHours; }
    public void setMaxWeeklyHours(Integer maxWeeklyHours) { this.maxWeeklyHours = maxWeeklyHours; }
    public String getNonWorkingDays() { return nonWorkingDays; }
    public void setNonWorkingDays(String nonWorkingDays) { this.nonWorkingDays = nonWorkingDays; }
    public String getStudentIdNumber() { return studentIdNumber; }
    public void setStudentIdNumber(String studentIdNumber) { this.studentIdNumber = studentIdNumber; }
    public Filiere getStudentFiliere() { return studentFiliere; }
    public void setStudentFiliere(Filiere studentFiliere) { this.studentFiliere = studentFiliere; }
    public Niveau getStudentNiveau() { return studentNiveau; }
    public void setStudentNiveau(Niveau studentNiveau) { this.studentNiveau = studentNiveau; }
    public Group getStudentGroup() { return studentGroup; }
    public void setStudentGroup(Group studentGroup) { this.studentGroup = studentGroup; }
    public Campus getStudentCampus() { return studentCampus; }
    public void setStudentCampus(Campus studentCampus) { this.studentCampus = studentCampus; }
    public AcademicStatus getAcademicStatus() { return academicStatus; }
    public void setAcademicStatus(AcademicStatus academicStatus) { this.academicStatus = academicStatus; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public enum Role { ADMIN, TEACHER, STUDENT }
    public enum TeacherStatus { PERMANENT, VACATAIRE }
    public enum AcademicStatus { ENROLLED, SUSPENDED }
}
