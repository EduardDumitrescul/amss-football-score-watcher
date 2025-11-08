package com.football.backend.dto;

import com.football.backend.entities.ContractEntity;

import java.util.Date;
import java.util.UUID;

public class ContractDto {
    private UUID id;
    private String teamName;
    private Date startDate;
    private Date endDate;
    private Integer salaryPerYear;

    public ContractDto(ContractEntity contract) {
        this.id = contract.getId();
        this.teamName = contract.getTeam().getName();
        this.startDate = contract.getStartDate();
        this.endDate = contract.getEndDate();
        this.salaryPerYear = contract.getSalaryPerYear();
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public String getTeamName() {
        return teamName;
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
