package net.essaid.projetpfa.backend.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    // Statistiques Étudiants
    private long totalStudents;
    private long enrolledStudents;
    private long suspendedStudents;

    // Statistiques Enseignants
    private long totalTeachers;

    // Statistiques Salles
    private long totalRooms;
    private long occupiedRooms; // Nombre de salles occupées à un instant T ou sur une période
    private double roomOccupancyRate; // Taux d'occupation des salles

    // Statistiques Cours
    private long totalCourses;
    private long plannedCourses; // Cours ayant au moins un événement planifié

    // Conflits
    private long detectedConflicts;
    private long roomOverloadConflicts; // Conflits de surcharge de salle
    private long teacherConflicts; // Conflits d'enseignants
    private long studentConflicts; // Conflits d'étudiants
}
