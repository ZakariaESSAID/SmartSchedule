package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.entities.Semestre;
import net.essaid.projetpfa.backend.repository.SemestreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/semestres")
public class SemestreController {

    @Autowired
    private SemestreRepository semestreRepository;

    @GetMapping
    public List<Semestre> getAllSemestres() {
        return semestreRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Semestre createSemestre(@RequestBody Semestre semestre) {
        return semestreRepository.save(semestre);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSemestre(@PathVariable String id) {
        return semestreRepository.findById(id)
                .map(semestre -> {
                    semestreRepository.delete(semestre);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
