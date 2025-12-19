package net.essaid.projetpfa.backend.service;

import net.essaid.projetpfa.backend.dto.ScheduleEventRequestDTO;
import net.essaid.projetpfa.backend.dto.ScheduleEventResponseDTO;
import net.essaid.projetpfa.backend.entities.Course;
import net.essaid.projetpfa.backend.entities.Room;
import net.essaid.projetpfa.backend.entities.ScheduleEvent;
import net.essaid.projetpfa.backend.entities.User;
import net.essaid.projetpfa.backend.repository.CourseRepository;
import net.essaid.projetpfa.backend.repository.RoomRepository;
import net.essaid.projetpfa.backend.repository.ScheduleEventRepository;
import net.essaid.projetpfa.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ScheduleEventService {

    @Autowired
    private ScheduleEventRepository scheduleEventRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ScheduleEventResponseDTO> getAllScheduleEvents() {
        return scheduleEventRepository.findAll().stream()
                .map(ScheduleEventResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ScheduleEventResponseDTO> getScheduleEventById(String id) {
        return scheduleEventRepository.findById(id).map(ScheduleEventResponseDTO::new);
    }

    @Transactional
    public ScheduleEventResponseDTO createScheduleEvent(ScheduleEventRequestDTO request) {
        ScheduleEvent event = new ScheduleEvent();
        mapDtoToEntity(request, event);
        detectConflicts(event); // Détecter les conflits avant de sauvegarder
        ScheduleEvent savedEvent = scheduleEventRepository.save(event);
        return new ScheduleEventResponseDTO(savedEvent);
    }

    @Transactional
    public Optional<ScheduleEventResponseDTO> updateScheduleEvent(String id, ScheduleEventRequestDTO request) {
        return scheduleEventRepository.findById(id)
                .map(existingEvent -> {
                    mapDtoToEntity(request, existingEvent);
                    detectConflicts(existingEvent); // Détecter les conflits après mise à jour
                    ScheduleEvent updatedEvent = scheduleEventRepository.save(existingEvent);
                    return new ScheduleEventResponseDTO(updatedEvent);
                });
    }

    @Transactional
    public boolean deleteScheduleEvent(String id) {
        if (scheduleEventRepository.existsById(id)) {
            scheduleEventRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private void mapDtoToEntity(ScheduleEventRequestDTO dto, ScheduleEvent entity) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + dto.getCourseId()));
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + dto.getRoomId()));

        entity.setCourse(course);
        entity.setRoom(room);
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setSessionType(dto.getSessionType());
        entity.setCancelled(dto.isCancelled());
        entity.setModified(dto.isModified());
        entity.setAcademicYear(dto.getAcademicYear());
        entity.setSemester(dto.getSemester());

        // Gérer les étudiants associés
        if (dto.getStudentIds() != null && !dto.getStudentIds().isEmpty()) {
            Set<User> students = new HashSet<>(userRepository.findAllById(dto.getStudentIds()));
            entity.setStudents(students);
        } else {
            entity.setStudents(new HashSet<>());
        }
    }

    // Méthode de détection de conflits
    private void detectConflicts(ScheduleEvent event) {
        boolean hasConflict = false;
        boolean isRoomOverloaded = false; // Pour l'instant, on ne gère pas la surcharge de salle ici

        // Vérifier les conflits de salle
        List<ScheduleEvent> conflictingRoomEvents = scheduleEventRepository.findAll().stream()
                .filter(e -> !e.getId().equals(event.getId())) // Exclure l'événement actuel lors de la mise à jour
                .filter(e -> e.getRoom().getId().equals(event.getRoom().getId()))
                .filter(e -> (event.getStartTime().isBefore(e.getEndTime()) && event.getEndTime().isAfter(e.getStartTime())))
                .collect(Collectors.toList());
        
        if (!conflictingRoomEvents.isEmpty()) {
            hasConflict = true;
        }

        // Vérifier les conflits d'enseignant (si le cours a un enseignant responsable)
        if (event.getCourse().getResponsibleTeacher() != null) {
            String responsibleTeacherId = event.getCourse().getResponsibleTeacher().getId();
            List<ScheduleEvent> conflictingTeacherEvents = scheduleEventRepository.findAll().stream()
                    .filter(e -> !e.getId().equals(event.getId()))
                    .filter(e -> e.getCourse().getResponsibleTeacher() != null && e.getCourse().getResponsibleTeacher().getId().equals(responsibleTeacherId))
                    .filter(e -> (event.getStartTime().isBefore(e.getEndTime()) && event.getEndTime().isAfter(e.getStartTime())))
                    .collect(Collectors.toList());
            if (!conflictingTeacherEvents.isEmpty()) {
                hasConflict = true;
            }
        }

        // Vérifier les conflits d'étudiant (si l'événement a des étudiants associés)
        if (event.getStudents() != null && !event.getStudents().isEmpty()) {
            Set<String> eventStudentIds = event.getStudents().stream().map(User::getId).collect(Collectors.toSet());
            List<ScheduleEvent> conflictingStudentEvents = scheduleEventRepository.findAll().stream()
                    .filter(e -> !e.getId().equals(event.getId()))
                    .filter(e -> e.getStudents() != null && e.getStudents().stream().anyMatch(s -> eventStudentIds.contains(s.getId())))
                    .filter(e -> (event.getStartTime().isBefore(e.getEndTime()) && event.getEndTime().isAfter(e.getStartTime())))
                    .collect(Collectors.toList());
            if (!conflictingStudentEvents.isEmpty()) {
                hasConflict = true;
            }
        }

        // TODO: Implémenter la logique isRoomOverloaded (comparer capacity de la room avec groupCapacity du course)
        // Pour l'instant, on laisse à false
        // if (event.getRoom().getCapacity() < event.getCourse().getGroupCapacity()) {
        //     isRoomOverloaded = true;
        // }

        event.setHasConflict(hasConflict);
        event.setRoomOverloaded(isRoomOverloaded);
    }
}
