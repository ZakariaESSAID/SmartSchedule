package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.ScheduleEvent;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class StudentDashboardDTO {
    private String studentName;
    private String studentEmail;
    private String studentFiliere;
    private String studentNiveau;
    private String studentGroup;
    private List<ScheduleEventResponseDTO> upcomingEvents; // Prochains cours
    private List<ScheduleEventResponseDTO> personalSchedule; // Emploi du temps personnel
    private List<String> alerts; // Notifications importantes (changement d'horaire, annulation)
}
