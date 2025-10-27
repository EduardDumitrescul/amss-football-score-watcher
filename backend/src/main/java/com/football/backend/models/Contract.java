package com.football.backend.models;

import java.util.Date;
import java.util.UUID;

public class Contract {
    private UUID id;
    private Player player;
    private Team team;
    private Date startDate;
    private Date endDate;
    private Integer salaryPerYear;

    public Contract  (
        UUID id,
        Player player,
        Team team,
        Date startDate, 
        Date endDate,
        Integer salaryPerYear
    ) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.salaryPerYear = salaryPerYear;
    }

    public UUID getId() {
        return id;
    }

    public Player getPlayer() {
        return player;
    }

    public Team getTeam() {
        return team;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public Integer getSalaryPerYear() {
        return salaryPerYear;
    }

}
