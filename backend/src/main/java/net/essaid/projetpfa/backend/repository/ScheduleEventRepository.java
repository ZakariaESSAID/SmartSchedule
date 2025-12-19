package net.essaid.projetpfa.backend.repository;

import net.essaid.projetpfa.backend.entities.ScheduleEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleEventRepository extends JpaRepository<ScheduleEvent, String> {
    // Méthode pour compter les événements ayant un conflit
    long countByHasConflict(boolean hasConflict);
}
