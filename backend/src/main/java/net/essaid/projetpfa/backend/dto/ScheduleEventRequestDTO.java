package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.ScheduleEvent;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class ScheduleEventRequestDTO {
    private String courseId;
    private String roomId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ScheduleEvent.SessionType sessionType;
    private Set<String> studentIds; // IDs des étudiants associés
    private boolean isCancelled;
    private boolean isModified;
    private boolean hasConflict; // Peut être défini par le frontend ou calculé par le backend
    private boolean isRoomOverloaded; // Peut être défini par le frontend ou calculé par le backend
    private String academicYear;
    private String semester;
}
