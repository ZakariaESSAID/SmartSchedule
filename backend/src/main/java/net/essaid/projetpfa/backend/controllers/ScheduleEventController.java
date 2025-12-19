package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.dto.ScheduleEventRequestDTO;
import net.essaid.projetpfa.backend.dto.ScheduleEventResponseDTO;
import net.essaid.projetpfa.backend.service.ScheduleEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule-events")
public class ScheduleEventController {

    @Autowired
    private ScheduleEventService scheduleEventService;

    @GetMapping
    public List<ScheduleEventResponseDTO> getAllScheduleEvents() {
        return scheduleEventService.getAllScheduleEvents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleEventResponseDTO> getScheduleEventById(@PathVariable String id) {
        return scheduleEventService.getScheduleEventById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ScheduleEventResponseDTO> createScheduleEvent(@RequestBody ScheduleEventRequestDTO request) {
        ScheduleEventResponseDTO createdEvent = scheduleEventService.createScheduleEvent(request);
        return ResponseEntity.ok(createdEvent);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ScheduleEventResponseDTO> updateScheduleEvent(@PathVariable String id, @RequestBody ScheduleEventRequestDTO request) {
        return scheduleEventService.updateScheduleEvent(id, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteScheduleEvent(@PathVariable String id) {
        if (scheduleEventService.deleteScheduleEvent(id)) {
            return ResponseEntity.ok().<Void>build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
