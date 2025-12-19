package net.essaid.projetpfa.backend.service;

import net.essaid.projetpfa.backend.entities.Course;
import net.essaid.projetpfa.backend.entities.Room;
import net.essaid.projetpfa.backend.entities.ScheduleEvent;
import net.essaid.projetpfa.backend.repository.CourseRepository;
import net.essaid.projetpfa.backend.repository.RoomRepository;
import net.essaid.projetpfa.backend.repository.ScheduleEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class TimetableService {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private ScheduleEventRepository scheduleEventRepository;
    @Autowired
    private ScheduleEventService scheduleEventService; // Pour la détection de conflits

    @Transactional
    public String generateTimetable() {
        // 1. Nettoyer l'ancien emploi du temps
        scheduleEventRepository.deleteAll();

        // 2. Récupérer toutes les données nécessaires
        List<Course> courses = courseRepository.findAll();
        List<Room> rooms = roomRepository.findAll();

        if (rooms.isEmpty()) {
            return "Génération échouée : Aucune salle n'est disponible.";
        }

        int eventsCreated = 0;
        // 3. Algorithme de génération de base (très simple)
        for (Course course : courses) {
            // Pour chaque cours, essayer de le placer dans un créneau
            // Pour l'instant, on place tout le lundi matin pour la démo
            LocalDateTime eventStart = LocalDateTime.now()
                                            .with(DayOfWeek.MONDAY)
                                            .with(LocalTime.of(8, 0));
            LocalDateTime eventEnd = eventStart.plusHours(2);

            // Trouver une salle disponible (la première pour l'instant)
            Room availableRoom = rooms.get(0);

            // Créer l'événement
            ScheduleEvent newEvent = new ScheduleEvent();
            newEvent.setCourse(course);
            newEvent.setRoom(availableRoom);
            newEvent.setStartTime(eventStart);
            newEvent.setEndTime(eventEnd);
            newEvent.setSessionType(ScheduleEvent.SessionType.CM); // Type par défaut

            // Détecter les conflits et sauvegarder
            scheduleEventService.detectConflicts(newEvent);
            scheduleEventRepository.save(newEvent);
            eventsCreated++;
        }

        return String.format("Génération terminée. %d événements ont été créés.", eventsCreated);
    }
}
