package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.entities.Niveau;
import net.essaid.projetpfa.backend.repository.NiveauRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/niveaux")
public class NiveauController {

    @Autowired
    private NiveauRepository niveauRepository;

    @GetMapping
    public List<Niveau> getAllNiveaux() {
        return niveauRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Niveau createNiveau(@RequestBody Niveau niveau) {
        return niveauRepository.save(niveau);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNiveau(@PathVariable String id) {
        return niveauRepository.findById(id)
                .map(niveau -> {
                    niveauRepository.delete(niveau);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
