package net.essaid.projetpfa.backend.repository;

import net.essaid.projetpfa.backend.entities.Niveau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NiveauRepository extends JpaRepository<Niveau, String> {
}
