package net.essaid.projetpfa.backend.repository;

import net.essaid.projetpfa.backend.entities.AnneeUniversitaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnneeUniversitaireRepository extends JpaRepository<AnneeUniversitaire, String> {
}
