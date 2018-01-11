package ru.mail.jira.plugins.groovy.api.entity;

import net.java.ao.Entity;
import net.java.ao.schema.NotNull;
import ru.mail.jira.plugins.groovy.api.dto.AuditCategory;

public interface AuditLogEntry extends Entity {
    @NotNull
    void setUserKey(String userKey);
    String getUserKey();

    @NotNull
    void setCategory(AuditCategory category);
    AuditCategory getCategory();

    @NotNull
    void setAction(AuditAction action);
    AuditAction getAction();

    void setDescription(String description);
    String getDescription();
}
