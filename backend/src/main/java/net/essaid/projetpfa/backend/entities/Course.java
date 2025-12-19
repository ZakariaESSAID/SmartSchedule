package net.essaid.projetpfa.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @ManyToOne
    @JoinColumn(name = "responsible_teacher_id", nullable = true) 
    private User responsibleTeacher;

    @ManyToMany
    @JoinTable(
        name = "course_associated_teachers",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "teacher_id")
    )
    private Set<User> associatedTeachers;

    @ManyToOne
    @JoinColumn(name = "filiere_id")
    private Filiere filiere;

    @ManyToOne
    @JoinColumn(name = "niveau_id")
    private Niveau niveau;
    
    @ManyToOne
    @JoinColumn(name = "campus_id")
    private Campus campus;

    private BigDecimal totalHours;
    private BigDecimal cmHours;
    private BigDecimal tdHours;
    private BigDecimal tpHours;

    private Integer sessionDurationMinutes;

    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @Column(columnDefinition = "TEXT")
    private String groupsAffected;

    private Integer groupCapacity;

    @Column(columnDefinition = "TEXT")
    private String allowedTimeSlots;

    @Column(columnDefinition = "TEXT")
    private String forbiddenTimeSlots;

    private String requiredCampus;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private CourseStatus status;

    private String semester;
    @Column(columnDefinition = "TEXT")
    private String description;

    public enum Frequency {
        WEEKLY, BI_WEEKLY, MONTHLY, AD_HOC
    }

    public enum Priority {
        HIGH, NORMAL, LOW
    }

    public enum CourseStatus {
        PLANNED, PENDING, CANCELLED, MODIFIED
    }
}
