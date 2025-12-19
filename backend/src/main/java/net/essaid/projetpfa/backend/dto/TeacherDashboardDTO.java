package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.ScheduleEvent;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TeacherDashboardDTO {
    private String teacherName;
    private String teacherEmail;
    private Integer weeklyHours; // Charge horaire actuelle
    private Integer maxWeeklyHours; // Volume horaire maximal
    private List<ScheduleEventResponseDTO> upcomingEvents; // Prochains cours
    private List<ScheduleEventResponseDTO> weeklySchedule; // Emploi du temps de la semaine
    private long conflictsDetected; // Conflits personnels
    private List<String> alerts; // Alertes spécifiques (modification, annulation)
}
