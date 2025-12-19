package net.essaid.projetpfa.backend.service;

import net.essaid.projetpfa.backend.dto.DashboardStatsDTO;
import net.essaid.projetpfa.backend.dto.ScheduleEventResponseDTO;
import net.essaid.projetpfa.backend.dto.StudentDashboardDTO;
import net.essaid.projetpfa.backend.dto.TeacherDashboardDTO;
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

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private ScheduleEventRepository scheduleEventRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getAdminDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        List<User> allUsers = userRepository.findAll();
        List<Course> allCourses = courseRepository.findAll();
        List<Room> allRooms = roomRepository.findAll();
        List<ScheduleEvent> allEvents = scheduleEventRepository.findAll();

        List<User> students = allUsers.stream().filter(user -> user.getRole() == User.Role.STUDENT).toList();
        stats.setTotalStudents(students.size());
        stats.setEnrolledStudents(students.stream().filter(s -> s.getAcademicStatus() == User.AcademicStatus.ENROLLED).count());
        stats.setSuspendedStudents(students.stream().filter(s -> s.getAcademicStatus() == User.AcademicStatus.SUSPENDED).count());
        stats.setTotalTeachers(allUsers.stream().filter(user -> user.getRole() == User.Role.TEACHER).count());
        stats.setTotalCourses(allCourses.size());
        stats.setPlannedCourses(allEvents.stream().map(event -> event.getCourse().getId()).distinct().count());
        stats.setTotalRooms(allRooms.size());
        stats.setOccupiedRooms(allEvents.stream().map(event -> event.getRoom().getId()).distinct().count());
        stats.setRoomOccupancyRate(stats.getTotalRooms() > 0 ? (double) stats.getOccupiedRooms() / stats.getTotalRooms() * 100.0 : 0.0);
        stats.setDetectedConflicts(allEvents.stream().filter(ScheduleEvent::isHasConflict).count());
        stats.setRoomOverloadConflicts(allEvents.stream().filter(ScheduleEvent::isRoomOverloaded).count());
        stats.setTeacherConflicts(0);
        stats.setStudentConflicts(0);

        return stats;
    }

    @Transactional(readOnly = true)
    public Optional<TeacherDashboardDTO> getTeacherDashboardByEmail(String email) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getRole() == User.Role.TEACHER)
                .flatMap(teacher -> getTeacherDashboard(teacher.getId()));
    }

    @Transactional(readOnly = true)
    public Optional<TeacherDashboardDTO> getTeacherDashboard(String teacherId) {
        return userRepository.findById(teacherId)
                .filter(user -> user.getRole() == User.Role.TEACHER)
                .map(teacher -> {
                    TeacherDashboardDTO dto = new TeacherDashboardDTO();
                    dto.setTeacherName(teacher.getName());
                    dto.setTeacherEmail(teacher.getEmail());
                    dto.setWeeklyHours(teacher.getWeeklyHours());
                    dto.setMaxWeeklyHours(teacher.getMaxWeeklyHours());

                    LocalDateTime now = LocalDateTime.now();
                    LocalDateTime startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).toLocalDate().atStartOfDay();
                    LocalDateTime endOfWeek = now.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).toLocalDate().atTime(23, 59, 59);

                    List<ScheduleEvent> teacherEvents = scheduleEventRepository.findAll().stream()
                            .filter(event -> event.getCourse().getResponsibleTeacher() != null && event.getCourse().getResponsibleTeacher().getId().equals(teacherId))
                            .filter(event -> event.getStartTime().isAfter(startOfWeek) && event.getEndTime().isBefore(endOfWeek))
                            .collect(Collectors.toList());

                    dto.setUpcomingEvents(teacherEvents.stream().filter(event -> event.getStartTime().isAfter(now)).map(ScheduleEventResponseDTO::new).sorted((e1, e2) -> e1.getStartTime().compareTo(e2.getStartTime())).limit(5).collect(Collectors.toList()));
                    dto.setWeeklySchedule(teacherEvents.stream().map(ScheduleEventResponseDTO::new).sorted((e1, e2) -> e1.getStartTime().compareTo(e2.getStartTime())).collect(Collectors.toList()));
                    dto.setConflictsDetected(teacherEvents.stream().filter(ScheduleEvent::isHasConflict).count());

                    List<String> alerts = new ArrayList<>();
                    teacherEvents.stream().filter(event -> event.isModified() || event.isCancelled()).forEach(event -> alerts.add(String.format("Cours %s (%s) le %s a été %s.", event.getCourse().getName(), event.getSessionType(), event.getStartTime().toLocalDate(), event.isCancelled() ? "annulé" : "modifié")));
                    dto.setAlerts(alerts);

                    return dto;
                });
    }

    @Transactional(readOnly = true)
    public Optional<StudentDashboardDTO> getStudentDashboardByEmail(String email) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getRole() == User.Role.STUDENT)
                .flatMap(student -> getStudentDashboard(student.getId()));
    }

    @Transactional(readOnly = true)
    public Optional<StudentDashboardDTO> getStudentDashboard(String studentId) {
        return userRepository.findById(studentId)
                .filter(user -> user.getRole() == User.Role.STUDENT)
                .map(student -> {
                    StudentDashboardDTO dto = new StudentDashboardDTO();
                    dto.setStudentName(student.getName());
                    dto.setStudentEmail(student.getEmail());
                    if (student.getStudentFiliere() != null) dto.setStudentFiliere(student.getStudentFiliere().getName());
                    if (student.getStudentNiveau() != null) dto.setStudentNiveau(student.getStudentNiveau().getName());
                    if (student.getStudentGroup() != null) dto.setStudentGroup(student.getStudentGroup().getName());

                    LocalDateTime now = LocalDateTime.now();
                    LocalDateTime startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).toLocalDate().atStartOfDay();
                    LocalDateTime endOfWeek = now.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).toLocalDate().atTime(23, 59, 59);

                    List<ScheduleEvent> studentEvents = scheduleEventRepository.findAll().stream()
                            .filter(event -> event.getStudents() != null && event.getStudents().stream().anyMatch(s -> s.getId().equals(studentId)))
                            .filter(event -> event.getStartTime().isAfter(startOfWeek) && event.getEndTime().isBefore(endOfWeek))
                            .collect(Collectors.toList());

                    dto.setUpcomingEvents(studentEvents.stream().filter(event -> event.getStartTime().isAfter(now)).map(ScheduleEventResponseDTO::new).sorted((e1, e2) -> e1.getStartTime().compareTo(e2.getStartTime())).limit(5).collect(Collectors.toList()));
                    dto.setPersonalSchedule(studentEvents.stream().map(ScheduleEventResponseDTO::new).sorted((e1, e2) -> e1.getStartTime().compareTo(e2.getStartTime())).collect(Collectors.toList()));

                    List<String> alerts = new ArrayList<>();
                    studentEvents.stream().filter(event -> event.isModified() || event.isCancelled()).forEach(event -> alerts.add(String.format("Cours %s (%s) le %s a été %s.", event.getCourse().getName(), event.getSessionType(), event.getStartTime().toLocalDate(), event.isCancelled() ? "annulé" : "modifié")));
                    dto.setAlerts(alerts);

                    return dto;
                });
    }
}
