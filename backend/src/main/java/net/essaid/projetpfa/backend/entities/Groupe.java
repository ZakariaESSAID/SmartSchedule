package net.essaid.projetpfa.backend.entities;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "groupes")
public class Groupe {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    public Groupe() {}
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Groupe groupe = (Groupe) o;
        return Objects.equals(id, groupe.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
