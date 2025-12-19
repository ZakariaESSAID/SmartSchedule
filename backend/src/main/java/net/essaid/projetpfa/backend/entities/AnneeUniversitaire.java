package net.essaid.projetpfa.backend.entities;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "annee_universitaires")
public class AnneeUniversitaire {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String annee; // ex: "2023-2024"

    public AnneeUniversitaire() {}
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAnnee() { return annee; }
    public void setAnnee(String annee) { this.annee = annee; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AnneeUniversitaire that = (AnneeUniversitaire) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
