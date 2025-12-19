package net.essaid.projetpfa.backend.dto;

import lombok.Data;
import net.essaid.projetpfa.backend.entities.Room;

@Data
public class RoomResponseDTO {
    private String id;
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
    private String specificEquipment;
    private Room.RoomStatus status;

    public RoomResponseDTO(Room room) {
        this.id = room.getId();
        this.name = room.getName();
        this.capacity = room.getCapacity();
        this.campus = room.getCampus();
        this.type = room.getType();
        this.building = room.getBuilding();
        this.floor = room.getFloor();
        this.hasProjector = room.getHasProjector();
        this.hasComputers = room.getHasComputers();
        this.hasInteractiveBoard = room.getHasInteractiveBoard();
        this.hasInternet = room.getHasInternet();
        this.specificEquipment = room.getSpecificEquipment();
        this.status = room.getStatus();
    }
}
