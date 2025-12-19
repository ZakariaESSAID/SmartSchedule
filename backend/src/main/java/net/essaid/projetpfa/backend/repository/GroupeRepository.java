package net.essaid.projetpfa.backend.repository;

import net.essaid.projetpfa.backend.entities.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupeRepository extends JpaRepository<Groupe, String> {
}
