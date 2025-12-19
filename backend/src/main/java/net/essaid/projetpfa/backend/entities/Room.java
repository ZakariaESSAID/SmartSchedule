package net.essaid.projetpfa.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    private String campus;

    @Enumerated(EnumType.STRING)
    private RoomType type; // Enum for 'amphi', 'td', 'labo', 'meeting'

    private String building;
    private String floor;

    // Equipment
    private Boolean hasProjector;
    private Boolean hasComputers;
    private Boolean hasInteractiveBoard;
    private Boolean hasInternet;

    @Column(columnDefinition = "TEXT")
    private String specificEquipment; // Stored as JSON string

    // Availability & Constraints
    @Column(columnDefinition = "TEXT")
    private String availableTimeSlots; // Stored as JSON string

    @Column(columnDefinition = "TEXT")
    private String reservedTimeSlots; // Stored as JSON string

    @Enumerated(EnumType.STRING)
    private RoomStatus status; // Enum for 'available', 'occupied', 'maintenance', 'out-of-service'

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RoomUnavailablePeriod> unavailablePeriods;

    // Enums for RoomType, RoomStatus
    public enum RoomType {
        AMPHI, TD, LABO, MEETING
    }

    public enum RoomStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE, OUT_OF_SERVICE
    }
}
