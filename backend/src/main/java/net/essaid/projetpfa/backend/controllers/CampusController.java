package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.entities.Campus;
import net.essaid.projetpfa.backend.repository.CampusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campuses")
public class CampusController {

    @Autowired
    private CampusRepository campusRepository;

    @GetMapping
    public List<Campus> getAllCampuses() {
        return campusRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Campus createCampus(@RequestBody Campus campus) {
        return campusRepository.save(campus);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCampus(@PathVariable String id) {
        return campusRepository.findById(id)
                .map(campus -> {
                    campusRepository.delete(campus);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
