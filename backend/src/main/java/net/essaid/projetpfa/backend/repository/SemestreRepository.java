package net.essaid.projetpfa.backend.repository;

import net.essaid.projetpfa.backend.entities.Semestre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SemestreRepository extends JpaRepository<Semestre, String> {
}
