package net.essaid.projetpfa.backend.repository;

import net.essaid.projetpfa.backend.entities.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<Group, String> {
}
