package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.entities.Departement;
import net.essaid.projetpfa.backend.repository.DepartementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departements")
public class DepartementController {

    @Autowired
    private DepartementRepository departementRepository;

    @GetMapping
    public List<Departement> getAllDepartements() {
        return departementRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Departement createDepartement(@RequestBody Departement departement) {
        return departementRepository.save(departement);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDepartement(@PathVariable String id) {
        return departementRepository.findById(id)
                .map(departement -> {
                    departementRepository.delete(departement);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
