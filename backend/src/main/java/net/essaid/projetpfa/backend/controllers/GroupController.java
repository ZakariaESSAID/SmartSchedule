package net.essaid.projetpfa.backend.controllers;

import net.essaid.projetpfa.backend.entities.Group;
import net.essaid.projetpfa.backend.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @GetMapping
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Group createGroup(@RequestBody Group group) {
        return groupRepository.save(group);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteGroup(@PathVariable String id) {
        return groupRepository.findById(id)
                .map(group -> {
                    groupRepository.delete(group);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
