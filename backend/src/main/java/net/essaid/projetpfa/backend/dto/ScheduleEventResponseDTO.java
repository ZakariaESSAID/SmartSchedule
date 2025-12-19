package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.ScheduleEvent;
import net.essaid.projetpfa.backend.entities.User;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class ScheduleEventResponseDTO {
    private String id;
    private String courseId;
    private String courseName;
    private String roomId;
    private String roomName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ScheduleEvent.SessionType sessionType;
    private Set<String> studentIds;
    private Set<String> studentNames; // Noms des étudiants associés
    private String responsibleTeacherName; // Nom de l'enseignant responsable du cours
    private boolean isCancelled;
    private boolean isModified;
    private boolean hasConflict;
    private boolean isRoomOverloaded;
    private String academicYear;
    private String semester;

    public ScheduleEventResponseDTO(ScheduleEvent event) {
        this.id = event.getId();
        this.courseId = event.getCourse().getId();
        this.courseName = event.getCourse().getName();
        this.roomId = event.getRoom().getId();
        this.roomName = event.getRoom().getName();
        this.startTime = event.getStartTime();
        this.endTime = event.getEndTime();
        this.sessionType = event.getSessionType();
        this.isCancelled = event.isCancelled();
        this.isModified = event.isModified();
        this.hasConflict = event.isHasConflict();
        this.isRoomOverloaded = event.isRoomOverloaded();
        this.academicYear = event.getAcademicYear();
        this.semester = event.getSemester();

        if (event.getStudents() != null) {
            this.studentIds = event.getStudents().stream().map(User::getId).collect(Collectors.toSet());
            this.studentNames = event.getStudents().stream().map(User::getName).collect(Collectors.toSet());
        }
        if (event.getCourse().getResponsibleTeacher() != null) {
            this.responsibleTeacherName = event.getCourse().getResponsibleTeacher().getName();
        }
    }
}
