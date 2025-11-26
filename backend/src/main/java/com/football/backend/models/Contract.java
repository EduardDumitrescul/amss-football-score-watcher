package com.football.backend.models;

import lombok.Getter;

import java.util.Date;
import java.util.UUID;

@Getter
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

}
