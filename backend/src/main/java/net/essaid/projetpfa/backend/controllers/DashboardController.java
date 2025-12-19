package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.dto.DashboardStatsDTO;
import net.essaid.projetpfa.backend.dto.StudentDashboardDTO;
import net.essaid.projetpfa.backend.dto.TeacherDashboardDTO;
import net.essaid.projetpfa.backend.security.services.UserDetailsImpl;
import net.essaid.projetpfa.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardStatsDTO getAdminStats() {
        return dashboardService.getAdminDashboardStats();
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<TeacherDashboardDTO> getTeacherDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        Optional<TeacherDashboardDTO> dashboard = dashboardService.getTeacherDashboardByEmail(currentPrincipalName);
        
        return dashboard.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        Optional<StudentDashboardDTO> dashboard = dashboardService.getStudentDashboardByEmail(currentPrincipalName);

        return dashboard.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
