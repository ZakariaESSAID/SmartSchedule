package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.entities.AnneeUniversitaire;
import net.essaid.projetpfa.backend.repository.AnneeUniversitaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/annees-universitaires")
public class AnneeUniversitaireController {

    @Autowired
    private AnneeUniversitaireRepository anneeUniversitaireRepository;

    @GetMapping
    public List<AnneeUniversitaire> getAllAnneesUniversitaires() {
        return anneeUniversitaireRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AnneeUniversitaire createAnneeUniversitaire(@RequestBody AnneeUniversitaire annee) {
        return anneeUniversitaireRepository.save(annee);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAnneeUniversitaire(@PathVariable String id) {
        return anneeUniversitaireRepository.findById(id)
                .map(annee -> {
                    anneeUniversitaireRepository.delete(annee);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
