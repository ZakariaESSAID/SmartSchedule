package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.entities.Filiere;
import net.essaid.projetpfa.backend.repository.FiliereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filieres")
public class FiliereController {

    @Autowired
    private FiliereRepository filiereRepository;

    @GetMapping
    public List<Filiere> getAllFilieres() {
        return filiereRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Filiere createFiliere(@RequestBody Filiere filiere) {
        return filiereRepository.save(filiere);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFiliere(@PathVariable String id) {
        return filiereRepository.findById(id)
                .map(filiere -> {
                    filiereRepository.delete(filiere);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
