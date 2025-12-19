package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.entities.Groupe;
import net.essaid.projetpfa.backend.repository.GroupeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groupes")
public class GroupeController {

    @Autowired
    private GroupeRepository groupeRepository;

    @GetMapping
    public List<Groupe> getAllGroupes() {
        return groupeRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Groupe createGroupe(@RequestBody Groupe groupe) {
        return groupeRepository.save(groupe);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteGroupe(@PathVariable String id) {
        return groupeRepository.findById(id)
                .map(groupe -> {
                    groupeRepository.delete(groupe);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
