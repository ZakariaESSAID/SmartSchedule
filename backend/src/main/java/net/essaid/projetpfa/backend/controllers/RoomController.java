package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.dto.RoomRequestDTO;
import net.essaid.projetpfa.backend.dto.RoomResponseDTO;
import net.essaid.projetpfa.backend.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping
    public List<RoomResponseDTO> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> getRoomById(@PathVariable String id) {
        return roomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponseDTO> createRoom(@RequestBody RoomRequestDTO roomRequest) {
        RoomResponseDTO createdRoom = roomService.createRoom(roomRequest);
        return ResponseEntity.ok(createdRoom);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponseDTO> updateRoom(@PathVariable String id, @RequestBody RoomRequestDTO roomRequest) {
        return roomService.updateRoom(id, roomRequest)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable String id) {
        if (roomService.deleteRoom(id)) {
            return ResponseEntity.ok().<Void>build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
