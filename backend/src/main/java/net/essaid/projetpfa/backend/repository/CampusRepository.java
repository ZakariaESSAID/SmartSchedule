package net.essaid.projetpfa.backend.repository;

import net.essaid.projetpfa.backend.entities.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampusRepository extends JpaRepository<Campus, String> {
}
