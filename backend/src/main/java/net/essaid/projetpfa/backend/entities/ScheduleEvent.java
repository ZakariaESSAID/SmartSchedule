package net.essaid.projetpfa.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "schedule_events")
public class ScheduleEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionType sessionType;

    @ManyToMany
    @JoinTable(
        name = "schedule_event_students",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<User> students = new HashSet<>();

    private Boolean isCancelled = false;
    private Boolean isModified = false;
    private Boolean hasConflict = false;
    private Boolean isRoomOverloaded = false;
    private String academicYear;
    private String semester;

    // Constructors
    public ScheduleEvent() {
    }

    public ScheduleEvent(String id, Course course, Room room, LocalDateTime startTime, LocalDateTime endTime, SessionType sessionType, Set<User> students, Boolean isCancelled, Boolean isModified, Boolean hasConflict, Boolean isRoomOverloaded, String academicYear, String semester) {
        this.id = id;
        this.course = course;
        this.room = room;
        this.startTime = startTime;
        this.endTime = endTime;
        this.sessionType = sessionType;
        this.students = students;
        this.isCancelled = isCancelled;
        this.isModified = isModified;
        this.hasConflict = hasConflict;
        this.isRoomOverloaded = isRoomOverloaded;
        this.academicYear = academicYear;
        this.semester = semester;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public SessionType getSessionType() {
        return sessionType;
    }

    public void setSessionType(SessionType sessionType) {
        this.sessionType = sessionType;
    }

    public Set<User> getStudents() {
        return students;
    }

    public void setStudents(Set<User> students) {
        this.students = students;
    }

    public Boolean isCancelled() {
        return isCancelled;
    }

    public void setCancelled(Boolean cancelled) {
        isCancelled = cancelled;
    }

    public Boolean isModified() {
        return isModified;
    }

    public void setModified(Boolean modified) {
        isModified = modified;
    }

    public Boolean isHasConflict() {
        return hasConflict;
    }

    public void setHasConflict(Boolean hasConflict) {
        this.hasConflict = hasConflict;
    }

    public Boolean isRoomOverloaded() {
        return isRoomOverloaded;
    }

    public void setRoomOverloaded(Boolean roomOverloaded) {
        isRoomOverloaded = roomOverloaded;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ScheduleEvent that = (ScheduleEvent) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // Enum for SessionType
    public enum SessionType {
        CM, TD, TP
    }
}
