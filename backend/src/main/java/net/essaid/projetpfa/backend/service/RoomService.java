package net.essaid.projetpfa.backend.service;

import net.essaid.projetpfa.backend.dto.RoomRequestDTO;
import net.essaid.projetpfa.backend.dto.RoomResponseDTO;
import net.essaid.projetpfa.backend.entities.Room;
import net.essaid.projetpfa.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Transactional(readOnly = true)
    public List<RoomResponseDTO> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(RoomResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<RoomResponseDTO> getRoomById(String id) {
        return roomRepository.findById(id).map(RoomResponseDTO::new);
    }

    @Transactional
    public RoomResponseDTO createRoom(RoomRequestDTO request) {
        Room room = new Room();
        mapDtoToEntity(request, room);
        Room savedRoom = roomRepository.save(room);
        return new RoomResponseDTO(savedRoom);
    }

    @Transactional
    public Optional<RoomResponseDTO> updateRoom(String id, RoomRequestDTO request) {
        return roomRepository.findById(id)
                .map(existingRoom -> {
                    mapDtoToEntity(request, existingRoom);
                    Room updatedRoom = roomRepository.save(existingRoom);
                    return new RoomResponseDTO(updatedRoom);
                });
    }

    @Transactional
    public boolean deleteRoom(String id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private void mapDtoToEntity(RoomRequestDTO dto, Room entity) {
        entity.setName(dto.getName());
        entity.setCapacity(dto.getCapacity());
        entity.setCampus(dto.getCampus());
        entity.setType(dto.getType());
        entity.setBuilding(dto.getBuilding());
        entity.setFloor(dto.getFloor());
        entity.setHasProjector(dto.getHasProjector());
        entity.setHasComputers(dto.getHasComputers());
        entity.setHasInteractiveBoard(dto.getHasInteractiveBoard());
        entity.setHasInternet(dto.getHasInternet());
        entity.setSpecificEquipment(dto.getSpecificEquipment());
        entity.setStatus(dto.getStatus());
    }
}
