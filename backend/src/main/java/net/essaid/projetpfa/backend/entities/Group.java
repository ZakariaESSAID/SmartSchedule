package net.essaid.projetpfa.backend.entities;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "groups_table") // "Group" est un mot-clé SQL, donc renommé
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name; // Ex: G1, G2, Section A

    // Constructors
    public Group() {}

    public Group(String name) {
        this.name = name;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Group group = (Group) o;
        return Objects.equals(id, group.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
