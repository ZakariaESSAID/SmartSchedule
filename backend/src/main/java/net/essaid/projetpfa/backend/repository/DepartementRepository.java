package net.essaid.projetpfa.backend.repository;

import net.essaid.projetpfa.backend.entities.Departement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartementRepository extends JpaRepository<Departement, String> {
}
