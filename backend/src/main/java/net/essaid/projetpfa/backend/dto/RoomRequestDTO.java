package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.Room;

@Data
public class RoomRequestDTO {
    private String name;
    private int capacity;
    private String campus;
    private Room.RoomType type;
    private String building;
    private String floor;
    private Boolean hasProjector;
    private Boolean hasComputers;
    private Boolean hasInteractiveBoard;
    private Boolean hasInternet;
    private String specificEquipment; // Stored as JSON string
    private Room.RoomStatus status;
}
