package net.essaid.projetpfa.backend.entities;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "semestres")
public class Semestre {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name; // ex: "Semestre 1", "Semestre 2"

    public Semestre() {}
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Semestre semestre = (Semestre) o;
        return Objects.equals(id, semestre.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
