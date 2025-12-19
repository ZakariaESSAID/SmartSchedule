package net.essaid.projetpfa.backend.repository;

import net.essaid.projetpfa.backend.entities.Filiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FiliereRepository extends JpaRepository<Filiere, String> {
}
