package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.dto.ChangePasswordRequestDTO;
import net.essaid.projetpfa.backend.dto.TeacherRequestDTO;
import net.essaid.projetpfa.backend.dto.TeacherResponseDTO;
import net.essaid.projetpfa.backend.service.TeacherService;
import net.essaid.projetpfa.backend.service.UserService; // Importer le nouveau service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class UserController {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private UserService userService; // Injecter le nouveau service

    // --- Endpoints pour les Enseignants ---
    @GetMapping
    public List<TeacherResponseDTO> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherResponseDTO> getTeacherById(@PathVariable String id) {
        return teacherService.getTeacherById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherResponseDTO> createTeacher(@RequestBody TeacherRequestDTO teacherRequest) {
        TeacherResponseDTO createdTeacher = teacherService.createTeacher(teacherRequest);
        return ResponseEntity.ok(createdTeacher);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherResponseDTO> updateTeacher(@PathVariable String id, @RequestBody TeacherRequestDTO teacherRequest) {
        return teacherService.updateTeacher(id, teacherRequest)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTeacher(@PathVariable String id) {
        if (teacherService.deleteTeacher(id)) {
            return ResponseEntity.ok().<Void>build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Endpoint pour le changement de mot de passe ---
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequestDTO changePasswordRequest) {
        try {
            userService.changePassword(changePasswordRequest.getOldPassword(), changePasswordRequest.getNewPassword());
            return ResponseEntity.ok("Password changed successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
